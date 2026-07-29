"use server";

import { revalidatePath } from "next/cache";

import { type ActionState, fieldError, parseText } from "@/lib/form";
import { prisma } from "@/lib/prisma";

const NAME_REQUIRED = "Informe um nome de até 80 caracteres.";
const EXERCISES_REQUIRED = "Escolha pelo menos um exercício.";
const STALE_EXERCISE =
  "Um dos exercícios selecionados não existe mais. Recarregue a página e tente de novo.";

function parseExerciseIds(formData: FormData): string[] {
  return formData
    .getAll("exerciseIds")
    .filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
}

async function allExercisesExist(ids: string[]): Promise<boolean> {
  const unique = [...new Set(ids)];
  const found = await prisma.exercise.findMany({
    where: { id: { in: unique } },
    select: { id: true },
  });

  return found.length === unique.length;
}

function entriesFrom(exerciseIds: string[]) {
  return exerciseIds.map((exerciseId, position) => ({ exerciseId, position }));
}

export async function createWorkout(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = parseText(formData.get("name"));
  if (name === null) return fieldError("name", NAME_REQUIRED);

  const exerciseIds = parseExerciseIds(formData);
  if (exerciseIds.length === 0) {
    return fieldError("exercises", EXERCISES_REQUIRED);
  }

  if (!(await allExercisesExist(exerciseIds))) {
    return { error: STALE_EXERCISE };
  }

  const duplicate = await prisma.workout.findUnique({ where: { name } });
  if (duplicate) {
    return fieldError("name", `Já existe um treino chamado "${name}".`);
  }

  await prisma.workout.create({
    data: { name, exercises: { create: entriesFrom(exerciseIds) } },
  });

  revalidatePath("/workouts");

  return { ok: true };
}

export async function updateWorkout(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = parseText(formData.get("id"), 40);
  if (id === null) return { error: "Treino inválido." };

  const name = parseText(formData.get("name"));
  if (name === null) return fieldError("name", NAME_REQUIRED);

  const exerciseIds = parseExerciseIds(formData);
  if (exerciseIds.length === 0) {
    return fieldError("exercises", EXERCISES_REQUIRED);
  }

  const current = await prisma.workout.findUnique({ where: { id } });
  if (!current) return { error: "Treino não encontrado." };

  if (!(await allExercisesExist(exerciseIds))) {
    return { error: STALE_EXERCISE };
  }

  const duplicate = await prisma.workout.findUnique({ where: { name } });
  if (duplicate && duplicate.id !== id) {
    return fieldError("name", `Já existe um treino chamado "${name}".`);
  }

  await prisma.$transaction([
    prisma.workoutExercise.deleteMany({ where: { workoutId: id } }),
    prisma.workout.update({
      where: { id },
      data: { name, exercises: { create: entriesFrom(exerciseIds) } },
    }),
  ]);

  revalidatePath("/workouts");

  return { ok: true };
}

export async function deleteWorkout(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = parseText(formData.get("id"), 40);
  if (id === null) return { error: "Treino inválido." };

  const workout = await prisma.workout.findUnique({ where: { id } });
  if (!workout) return { error: "Treino não encontrado." };

  await prisma.workout.delete({ where: { id } });

  revalidatePath("/workouts");

  return { ok: true };
}
