import "server-only";

import { randomUUID } from "node:crypto";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getStorage } from "./client";
import {
  DOWNLOAD_URL_TTL_SECONDS,
  DOWNLOAD_URL_WINDOW_SECONDS,
  EXTENSION_BY_CONTENT_TYPE,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  UPLOAD_URL_TTL_SECONDS,
  type UploadContentType,
  type UploadFolder,
  isImageContentType,
  isVideoContentType,
} from "./config";

export * from "./config";

export type PreparedUpload = {
  key: string;
  uploadUrl: string;
  expiresIn: number;
  maxBytes: number;
};

export class StorageValidationError extends Error {}

function maxBytesFor(contentType: UploadContentType) {
  return isVideoContentType(contentType) ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
}

export function assertUploadContentType(
  value: string,
): asserts value is UploadContentType {
  if (!isImageContentType(value) && !isVideoContentType(value)) {
    throw new StorageValidationError(`Tipo de arquivo não aceito: ${value}`);
  }
}

export function buildObjectKey(
  folder: UploadFolder,
  contentType: UploadContentType,
) {
  const extension = EXTENSION_BY_CONTENT_TYPE[contentType];
  return `${folder}/${randomUUID()}.${extension}`;
}

export async function prepareUpload(
  folder: UploadFolder,
  contentType: string,
): Promise<PreparedUpload> {
  assertUploadContentType(contentType);

  const { s3, bucket } = getStorage();
  const key = buildObjectKey(folder, contentType);

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: UPLOAD_URL_TTL_SECONDS },
  );

  return {
    key,
    uploadUrl,
    expiresIn: UPLOAD_URL_TTL_SECONDS,
    maxBytes: maxBytesFor(contentType),
  };
}

export async function confirmUpload(key: string) {
  const { s3, bucket } = getStorage();

  const head = await s3
    .send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    .catch(() => null);

  if (!head) {
    throw new StorageValidationError("Arquivo não encontrado no bucket.");
  }

  const contentType = head.ContentType ?? "";
  const size = head.ContentLength ?? 0;

  if (!isImageContentType(contentType) && !isVideoContentType(contentType)) {
    await deleteFile(key);
    throw new StorageValidationError(
      `Tipo de arquivo não aceito: ${contentType || "desconhecido"}`,
    );
  }

  if (size > maxBytesFor(contentType)) {
    await deleteFile(key);
    throw new StorageValidationError("Arquivo maior que o limite permitido.");
  }

  return { key, contentType, size };
}

function currentWindowStart(): Date {
  const windowMs = DOWNLOAD_URL_WINDOW_SECONDS * 1000;
  return new Date(Math.floor(Date.now() / windowMs) * windowMs);
}

export async function createFileUrl(
  key: string,
  expiresIn = DOWNLOAD_URL_TTL_SECONDS,
) {
  const { s3, bucket } = getStorage();

  return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn,
    signingDate: currentWindowStart(),
  });
}

export async function deleteFile(key: string) {
  const { s3, bucket } = getStorage();

  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
