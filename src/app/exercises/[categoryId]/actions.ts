"use server";

import { revalidatePath } from "next/cache";

import { type ActionState, parseText, parseUrl } from "@/lib/form";
import { prisma } from "@/lib/prisma";

export async function createExercise(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const categoryId = parseText(formData.get("categoryId"), 40);
  if (categoryId === null) {
    return { error: "Categoria inválida." };
  }

  const name = parseText(formData.get("name"));
  if (name === null) {
    return { error: "Informe um nome de até 80 caracteres." };
  }

  const videoUrl = parseUrl(formData.get("videoUrl"));
  if (videoUrl === null) {
    return { error: "Informe um link de vídeo válido, começando com https://" };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return { error: "Categoria não encontrada." };
  }

  const duplicate = await prisma.exercise.findUnique({
    where: { categoryId_name: { categoryId, name } },
  });
  if (duplicate) {
    return { error: `Já existe um exercício chamado "${name}" nesta categoria.` };
  }

  await prisma.exercise.create({ data: { name, videoUrl, categoryId } });

  revalidatePath(`/exercises/${categoryId}`);
  revalidatePath("/exercises");

  return { ok: true };
}
