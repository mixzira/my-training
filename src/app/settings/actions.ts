"use server";

import { revalidatePath } from "next/cache";

import {
  type ActionState,
  fieldError,
  parseObjectKey,
  parseText,
} from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { StorageValidationError, confirmUpload, deleteFile } from "@/lib/storage";

const NAME_REQUIRED = "Informe um nome de até 80 caracteres.";
const IMAGE_REQUIRED = "Envie uma imagem para a categoria.";

async function discardKeys(keys: string[]): Promise<string | undefined> {
  const results = await Promise.allSettled(keys.map((key) => deleteFile(key)));
  const failed = results.filter((result) => result.status === "rejected").length;

  if (failed === 0) return undefined;

  return `${failed} arquivo(s) não puderam ser apagados do R2.`;
}

function storageFieldError(field: string, error: unknown): ActionState {
  return fieldError(
    field,
    error instanceof StorageValidationError
      ? error.message
      : "Não foi possível validar o arquivo enviado.",
  );
}

export async function createCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = parseText(formData.get("name"));
  if (name === null) return fieldError("name", NAME_REQUIRED);

  const imageKey = parseObjectKey(formData.get("imageKey"));
  if (imageKey === null) return fieldError("imageKey", IMAGE_REQUIRED);

  const duplicate = await prisma.category.findUnique({ where: { name } });
  if (duplicate) {
    return fieldError("name", `Já existe uma categoria chamada "${name}".`);
  }

  try {
    await confirmUpload(imageKey);
  } catch (error) {
    return storageFieldError("imageKey", error);
  }

  await prisma.category.create({ data: { name, imageKey } });

  revalidatePath("/settings");

  return { ok: true };
}

export async function updateCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = parseText(formData.get("id"), 40);
  if (id === null) return { error: "Categoria inválida." };

  const name = parseText(formData.get("name"));
  if (name === null) return fieldError("name", NAME_REQUIRED);

  const imageKey = parseObjectKey(formData.get("imageKey"));
  if (imageKey === null) return fieldError("imageKey", IMAGE_REQUIRED);

  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) return { error: "Categoria não encontrada." };

  const duplicate = await prisma.category.findUnique({ where: { name } });
  if (duplicate && duplicate.id !== id) {
    return fieldError("name", `Já existe uma categoria chamada "${name}".`);
  }

  const imageChanged = imageKey !== current.imageKey;

  if (imageChanged) {
    try {
      await confirmUpload(imageKey);
    } catch (error) {
      return storageFieldError("imageKey", error);
    }
  }

  await prisma.category.update({ where: { id }, data: { name, imageKey } });

  const warning = imageChanged
    ? await discardKeys([current.imageKey])
    : undefined;

  revalidatePath("/settings");
  revalidatePath(`/settings/${id}`);

  return { ok: true, warning };
}

export async function deleteCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = parseText(formData.get("id"), 40);
  if (id === null) return { error: "Categoria inválida." };

  const category = await prisma.category.findUnique({
    where: { id },
    include: { exercises: { select: { videoKey: true } } },
  });
  if (!category) return { error: "Categoria não encontrada." };

  const keys = [
    category.imageKey,
    ...category.exercises.map((exercise) => exercise.videoKey),
  ];

  await prisma.category.delete({ where: { id } });

  const warning = await discardKeys(keys);

  revalidatePath("/settings");

  return { ok: true, warning };
}
