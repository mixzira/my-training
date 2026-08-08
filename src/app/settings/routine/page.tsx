import { FloatingActions } from "@/components/ui/floating-actions";
import { prisma } from "@/lib/prisma";

import { CreateRoutine } from "./create-routine";
import { RoutineActions } from "./routine-actions";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("pt-BR");

function toDateInput(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dayStart(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

function daysSince(start: Date, now: Date): number {
  return Math.round((dayStart(now) - dayStart(start)) / 86400000);
}

export default async function RoutinePage() {
  const [routine, workouts] = await Promise.all([
    prisma.routine.findFirst({
      include: {
        slots: {
          orderBy: { position: "asc" },
          include: { workout: { select: { id: true, name: true } } },
        },
      },
    }),
    prisma.workout.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const now = new Date();
  const today = toDateInput(now);

  const elapsed = routine ? daysSince(routine.startDate, now) : 0;
  const started = Boolean(routine && routine.slots.length > 0 && elapsed >= 0);
  const currentIndex = routine && started ? elapsed % routine.slots.length : -1;
  const daysUntil = elapsed < 0 ? -elapsed : 0;

  return (
    <>
      {!routine ? (
        <>
          <p className="max-w-[36ch] text-body text-ink-muted-80">
            Nenhuma rotina ainda. Monte uma fila de treinos e descansos.
          </p>
          <FloatingActions>
            <CreateRoutine workouts={workouts} today={today} />
          </FloatingActions>
        </>
      ) : (
        <div className="flex flex-col gap-lg">
          <div className="flex flex-col gap-sm">
            <p className="text-body-strong text-ink">{routine.name}</p>
            {started ? (
              <p className="text-caption text-ink-muted-48">
                Início: {dateFormat.format(routine.startDate)}
              </p>
            ) : (
              <p className="text-caption text-ink-muted-80">
                Começa em {dateFormat.format(routine.startDate)}
                {daysUntil > 0
                  ? ` · em ${daysUntil} dia${daysUntil > 1 ? "s" : ""}`
                  : ""}
              </p>
            )}
          </div>

          <ol className="flex flex-col gap-xs">
            {routine.slots.map((slot, index) => (
              <li
                key={slot.id}
                className="flex items-center gap-md rounded-lg border border-hairline bg-canvas p-lg"
              >
                <span className="w-6 shrink-0 text-caption text-ink-muted-48 tabular-nums">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-strong text-ink">
                    {slot.type === "REST"
                      ? "Descanso"
                      : (slot.workout?.name ?? "Treino removido")}
                  </p>
                  <p className="text-caption text-ink-muted-48">
                    {slot.type === "REST" ? "Descanso" : "Treino"}
                  </p>
                </div>
                {index === currentIndex ? (
                  <span className="shrink-0 rounded-pill bg-ink px-sm py-xxs text-caption-strong text-canvas">
                    Atual
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          <RoutineActions
            routine={{
              id: routine.id,
              name: routine.name,
              startDate: toDateInput(routine.startDate),
              slots: routine.slots.map((slot) => ({
                id: slot.id,
                type: slot.type === "REST" ? "REST" : "WORKOUT",
                workoutId: slot.workoutId,
              })),
            }}
            workouts={workouts}
            today={today}
          />
        </div>
      )}
    </>
  );
}
