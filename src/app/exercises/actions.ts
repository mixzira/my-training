"use server";

import { revalidatePath } from "next/cache";

import { type ActionState, parseText, parseUrl } from "@/lib/form";
import { prisma } from "@/lib/prisma";

export async function createCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = parseText(formData.get("name"));
  if (name === null) {
    return { error: "Informe um nome de até 80 caracteres." };
  }

  const imageUrl = parseUrl(formData.get("imageUrl"));
  if (imageUrl === null) {
    return { error: "Informe um link de imagem válido, começando com https://" };
  }

  const duplicate = await prisma.category.findUnique({ where: { name } });
  if (duplicate) {
    return { error: `Já existe uma categoria chamada "${name}".` };
  }

  await prisma.category.create({ data: { name, imageUrl } });

  revalidatePath("/exercises");

  return { ok: true };
}
