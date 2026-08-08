import { notFound } from "next/navigation";

import { FloatingActions } from "@/components/ui/floating-actions";
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
      <h2 className="text-tagline text-ink">Exercícios de {category.name}</h2>

      <FloatingActions>
        <AddExerciseForm categoryId={category.id} />
      </FloatingActions>

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
    </>
  );
}
