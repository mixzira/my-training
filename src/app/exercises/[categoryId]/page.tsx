import { notFound } from "next/navigation";

import { Header } from "@/components/ui/header";
import { Tile } from "@/components/ui/tile";
import { prisma } from "@/lib/prisma";
import { createFileUrl } from "@/lib/storage";

import { AddExerciseForm } from "./add-exercise-form";
import { ExerciseCard } from "./exercise-card";

export const dynamic = "force-dynamic";

export default async function CategoryExercisesPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { exercises: { orderBy: { name: "asc" } } },
  });

  if (!category) notFound();

  const cards = await Promise.all(
    category.exercises.map(async (exercise) => ({
      id: exercise.id,
      name: exercise.name,
      videoKey: exercise.videoKey,
      videoUrl: await createFileUrl(exercise.videoKey),
    })),
  );

  return (
    <>
      <Header />
      <Tile surface="parchment" className="pb-section">
        <h1 className="text-display-md font-display lg:text-display-lg">
          Exercícios de {category.name}
        </h1>

        <div className="mt-lg">
          <AddExerciseForm categoryId={category.id} />
        </div>

        {cards.length === 0 ? (
          <p className="mt-xl max-w-[36ch] text-body text-ink-muted-80">
            Nenhum exercício nesta categoria ainda.
          </p>
        ) : (
          <ul className="mt-xl grid grid-cols-1 gap-sm lg:grid-cols-2 xl:grid-cols-3">
            {cards.map((exercise) => (
              <li key={exercise.id}>
                <ExerciseCard categoryId={category.id} exercise={exercise} />
              </li>
            ))}
          </ul>
        )}
      </Tile>
    </>
  );
}
