import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

type StorageEnv = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

function readEnv(): StorageEnv {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;

  const missing = [
    ["R2_ACCOUNT_ID", accountId],
    ["R2_ACCESS_KEY_ID", accessKeyId],
    ["R2_SECRET_ACCESS_KEY", secretAccessKey],
    ["R2_BUCKET", bucket],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente do R2 ausentes: ${missing.join(", ")}. Veja .env.example.`,
    );
  }

  return {
    accountId: accountId as string,
    accessKeyId: accessKeyId as string,
    secretAccessKey: secretAccessKey as string,
    bucket: bucket as string,
  };
}

const createStorageClient = () => {
  const env = readEnv();

  return {
    bucket: env.bucket,
    s3: new S3Client({
      region: "auto",
      endpoint: `https://${env.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.accessKeyId,
        secretAccessKey: env.secretAccessKey,
      },
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    }),
  };
};

const globalForStorage = globalThis as unknown as {
  storage: ReturnType<typeof createStorageClient> | undefined;
};

export function getStorage() {
  const existing = globalForStorage.storage ?? createStorageClient();

  if (process.env.NODE_ENV !== "production") {
    globalForStorage.storage = existing;
  }

  return existing;
}
