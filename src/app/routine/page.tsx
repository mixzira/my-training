import { Header } from "@/components/ui/header";
import { Tile } from "@/components/ui/tile";
import { prisma } from "@/lib/prisma";

import { CreateRoutine } from "./create-routine";
import { RoutineActions } from "./routine-actions";

export const dynamic = "force-dynamic";

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

  return (
    <>
      <Header />
      <Tile surface="parchment" className="pb-section">
        <h1 className="text-display-md font-display lg:text-display-lg">
          Rotina
        </h1>

        {!routine ? (
          <>
            <p className="mt-xl max-w-[36ch] text-body text-ink-muted-80">
              Nenhuma rotina ainda. Monte uma fila de treinos e descansos.
            </p>
            <div className="mt-lg">
              <CreateRoutine workouts={workouts} />
            </div>
          </>
        ) : (
          <div className="mt-lg flex flex-col gap-lg">
            <div className="flex flex-col gap-sm">
              <p className="text-body-strong text-ink">{routine.name}</p>
              <RoutineActions
                routine={{
                  id: routine.id,
                  name: routine.name,
                  slots: routine.slots.map((slot) => ({
                    id: slot.id,
                    type: slot.type === "REST" ? "REST" : "WORKOUT",
                    workoutId: slot.workoutId,
                  })),
                }}
                workouts={workouts}
              />
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
                  {slot.id === routine.currentSlotId ? (
                    <span className="shrink-0 rounded-pill bg-ink px-sm py-xxs text-caption-strong text-canvas">
                      Atual
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        )}
      </Tile>
    </>
  );
}
