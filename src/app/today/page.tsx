import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Tile } from "@/components/ui/tile";
import { prisma } from "@/lib/prisma";
import { createFileUrl } from "@/lib/storage";

import { TodayWorkout } from "./today-workout";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("pt-BR");

function toDateInput(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dayStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysSince(start: Date, now: Date): number {
  return Math.round((dayStart(now).getTime() - dayStart(start).getTime()) / 86400000);
}

function shell(body: ReactNode) {
  return (
    <>
      <Header title="Hoje" back={false} />
      <Tile surface="parchment" className="pb-section">
        {body}
      </Tile>
    </>
  );
}

function message(text: string) {
  return <p className="max-w-[36ch] text-body text-ink-muted-80">{text}</p>;
}

export default async function HomePage() {
  const now = new Date();

  const routine = await prisma.routine.findFirst({
    include: {
      slots: {
        orderBy: { position: "asc" },
        select: { id: true, type: true, workoutId: true },
      },
    },
  });

  if (!routine || routine.slots.length === 0) {
    return shell(
      <>
        {message("Nenhuma rotina ativa. Crie uma rotina para ver o treino do dia.")}
        <div className="mt-lg">
          <ButtonLink href="/routine">Criar rotina</ButtonLink>
        </div>
      </>,
    );
  }

  const elapsed = daysSince(routine.startDate, now);
  if (elapsed < 0) {
    const daysUntil = -elapsed;
    return shell(
      message(
        `Sua rotina começa em ${dateFormat.format(routine.startDate)} · em ${daysUntil} dia${daysUntil > 1 ? "s" : ""}.`,
      ),
    );
  }

  const slot = routine.slots[elapsed % routine.slots.length];

  if (slot.type === "REST") {
    return shell(message("Hoje é dia de descanso. 😴"));
  }

  if (!slot.workoutId) {
    return shell(message("O treino de hoje foi removido. Edite sua rotina."));
  }

  const workout = await prisma.workout.findUnique({
    where: { id: slot.workoutId },
    include: {
      exercises: {
        orderBy: { position: "asc" },
        include: {
          exercise: { select: { id: true, name: true, videoKey: true } },
        },
      },
    },
  });

  if (!workout) {
    return shell(message("O treino de hoje foi removido. Edite sua rotina."));
  }

  const today = dayStart(now);

  const session = await prisma.workoutSession.findUnique({
    where: { date: today },
    include: {
      entries: {
        orderBy: { position: "asc" },
        include: { exercise: { select: { name: true, videoKey: true } } },
      },
    },
  });

  let initialItems;
  if (session) {
    initialItems = await Promise.all(
      session.entries.map(async (entry) => ({
        position: entry.position,
        exerciseId: entry.exerciseId,
        name: entry.exercise.name,
        videoUrl: await createFileUrl(entry.exercise.videoKey),
        done: entry.done,
        weight: entry.weight,
      })),
    );
  } else {
    const exerciseIds = [
      ...new Set(workout.exercises.map((item) => item.exerciseId)),
    ];

    const pastEntries = exerciseIds.length
      ? await prisma.sessionEntry.findMany({
          where: { exerciseId: { in: exerciseIds } },
          orderBy: { session: { date: "desc" } },
          select: { exerciseId: true, weight: true },
        })
      : [];

    const lastWeight = new Map<string, number>();
    for (const entry of pastEntries) {
      if (!lastWeight.has(entry.exerciseId)) {
        lastWeight.set(entry.exerciseId, entry.weight);
      }
    }

    initialItems = await Promise.all(
      workout.exercises.map(async (item, position) => ({
        position,
        exerciseId: item.exerciseId,
        name: item.exercise.name,
        videoUrl: await createFileUrl(item.exercise.videoKey),
        done: false,
        weight: lastWeight.get(item.exerciseId) ?? 0,
      })),
    );
  }

  return shell(
    <TodayWorkout
      workoutName={workout.name}
      workoutId={workout.id}
      date={toDateInput(now)}
      completed={session ? session.completedAt !== null : false}
      initialItems={initialItems}
    />,
  );
}
