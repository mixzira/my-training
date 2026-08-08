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
const VIDEO_REQUIRED = "Envie o vídeo de execução.";

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

export async function createExercise(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const categoryId = parseText(formData.get("categoryId"), 40);
  if (categoryId === null) return { error: "Categoria inválida." };

  const name = parseText(formData.get("name"));
  if (name === null) return fieldError("name", NAME_REQUIRED);

  const videoKey = parseObjectKey(formData.get("videoKey"));
  if (videoKey === null) return fieldError("videoKey", VIDEO_REQUIRED);

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) return { error: "Categoria não encontrada." };

  const duplicate = await prisma.exercise.findUnique({
    where: { categoryId_name: { categoryId, name } },
  });
  if (duplicate) {
    return fieldError(
      "name",
      `Já existe um exercício chamado "${name}" nesta categoria.`,
    );
  }

  try {
    await confirmUpload(videoKey);
  } catch (error) {
    return storageFieldError("videoKey", error);
  }

  await prisma.exercise.create({ data: { name, videoKey, categoryId } });

  revalidatePath(`/settings/${categoryId}`);
  revalidatePath("/settings");

  return { ok: true };
}

export async function updateExercise(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = parseText(formData.get("id"), 40);
  if (id === null) return { error: "Exercício inválido." };

  const name = parseText(formData.get("name"));
  if (name === null) return fieldError("name", NAME_REQUIRED);

  const videoKey = parseObjectKey(formData.get("videoKey"));
  if (videoKey === null) return fieldError("videoKey", VIDEO_REQUIRED);

  const current = await prisma.exercise.findUnique({ where: { id } });
  if (!current) return { error: "Exercício não encontrado." };

  const duplicate = await prisma.exercise.findUnique({
    where: { categoryId_name: { categoryId: current.categoryId, name } },
  });
  if (duplicate && duplicate.id !== id) {
    return fieldError(
      "name",
      `Já existe um exercício chamado "${name}" nesta categoria.`,
    );
  }

  const videoChanged = videoKey !== current.videoKey;

  if (videoChanged) {
    try {
      await confirmUpload(videoKey);
    } catch (error) {
      return storageFieldError("videoKey", error);
    }
  }

  await prisma.exercise.update({ where: { id }, data: { name, videoKey } });

  const warning = videoChanged
    ? await discardKeys([current.videoKey])
    : undefined;

  revalidatePath(`/settings/${current.categoryId}`);

  return { ok: true, warning };
}

export async function deleteExercise(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = parseText(formData.get("id"), 40);
  if (id === null) return { error: "Exercício inválido." };

  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) return { error: "Exercício não encontrado." };

  await prisma.exercise.delete({ where: { id } });

  const warning = await discardKeys([exercise.videoKey]);

  revalidatePath(`/settings/${exercise.categoryId}`);
  revalidatePath("/settings");

  return { ok: true, warning };
}
