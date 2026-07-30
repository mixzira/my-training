"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export type TodayItemInput = {
  position: number;
  exerciseId: string;
  done: boolean;
  weight: number;
};

export type SaveResult = { ok: boolean; error?: string };

function parseDay(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export async function saveTodaySession(input: {
  workoutId: string;
  date: string;
  completed: boolean;
  items: TodayItemInput[];
}): Promise<SaveResult> {
  const date = parseDay(input.date);
  if (!date) return { ok: false, error: "Data inválida." };

  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { ok: false, error: "Nada para salvar." };
  }

  const workout = await prisma.workout.findUnique({
    where: { id: input.workoutId },
    select: { id: true },
  });
  if (!workout) return { ok: false, error: "Treino não encontrado." };

  const exerciseIds = [...new Set(input.items.map((item) => item.exerciseId))];
  const found = await prisma.exercise.findMany({
    where: { id: { in: exerciseIds } },
    select: { id: true },
  });
  if (found.length !== exerciseIds.length) {
    return { ok: false, error: "Um exercício não existe mais. Recarregue a página." };
  }

  const items = input.items.map((item, index) => ({
    position: Number.isInteger(item.position) ? item.position : index,
    exerciseId: item.exerciseId,
    done: Boolean(item.done),
    weight: Number.isFinite(item.weight) && item.weight >= 0 ? item.weight : 0,
  }));
  const completedAt = input.completed ? new Date() : null;

  const existing = await prisma.workoutSession.findUnique({
    where: { date },
    select: { id: true },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.sessionEntry.deleteMany({ where: { sessionId: existing.id } }),
      prisma.workoutSession.update({
        where: { id: existing.id },
        data: {
          workoutId: input.workoutId,
          completedAt,
          entries: { create: items },
        },
      }),
    ]);
  } else {
    await prisma.workoutSession.create({
      data: {
        date,
        workoutId: input.workoutId,
        completedAt,
        entries: { create: items },
      },
    });
  }

  revalidatePath("/");

  return { ok: true };
}
