"use server";

import {
  StorageValidationError,
  type UploadFolder,
  prepareUpload,
} from "@/lib/storage";

export type UploadTicket =
  | { ok: true; key: string; uploadUrl: string; maxBytes: number }
  | { ok: false; error: string };

export async function requestUpload(
  folder: UploadFolder,
  contentType: string,
): Promise<UploadTicket> {
  try {
    const ticket = await prepareUpload(folder, contentType);

    return {
      ok: true,
      key: ticket.key,
      uploadUrl: ticket.uploadUrl,
      maxBytes: ticket.maxBytes,
    };
  } catch (error) {
    if (error instanceof StorageValidationError) {
      return { ok: false, error: error.message };
    }

    return { ok: false, error: "Não foi possível preparar o envio." };
  }
}
