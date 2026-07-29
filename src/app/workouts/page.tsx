import { Header } from "@/components/ui/header";
import { Tile } from "@/components/ui/tile";
import { prisma } from "@/lib/prisma";
import { createFileUrl } from "@/lib/storage";

import { AddWorkoutForm } from "./add-workout-form";
import { WorkoutCard } from "./workout-card";

export const dynamic = "force-dynamic";

export default async function WorkoutsPage() {
  const [workouts, categories] = await Promise.all([
    prisma.workout.findMany({
      orderBy: { name: "asc" },
      include: {
        exercises: {
          orderBy: { position: "asc" },
          include: { exercise: { select: { id: true, name: true } } },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        exercises: {
          orderBy: { name: "asc" },
          select: { id: true, name: true, videoKey: true },
        },
      },
    }),
  ]);

  const catalog = (
    await Promise.all(
      categories.map(async (category) => ({
        id: category.id,
        name: category.name,
        exercises: await Promise.all(
          category.exercises.map(async (exercise) => ({
            id: exercise.id,
            name: exercise.name,
            videoUrl: await createFileUrl(exercise.videoKey),
          })),
        ),
      })),
    )
  ).filter((category) => category.exercises.length > 0);

  const cards = workouts.map((workout) => ({
    id: workout.id,
    name: workout.name,
    exercises: workout.exercises.map((entry) => ({
      id: entry.exerciseId,
      name: entry.exercise.name,
    })),
  }));

  return (
    <>
      <Header />
      <Tile surface="parchment" className="pb-section">
        <h1 className="text-display-md font-display lg:text-display-lg">
          Treinos
        </h1>

        <div className="mt-lg">
          <AddWorkoutForm catalog={catalog} />
        </div>

        {cards.length === 0 ? (
          <p className="mt-xl max-w-[36ch] text-body text-ink-muted-80">
            Nenhum treino ainda. Crie o primeiro escolhendo exercícios.
          </p>
        ) : (
          <ul className="mt-xl grid grid-cols-1 gap-sm lg:grid-cols-2 xl:grid-cols-3">
            {cards.map((workout) => (
              <li key={workout.id}>
                <WorkoutCard workout={workout} catalog={catalog} />
              </li>
            ))}
          </ul>
        )}
      </Tile>
    </>
  );
}
