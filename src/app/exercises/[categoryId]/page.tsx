import { notFound } from "next/navigation";

import { Tile } from "@/components/ui/tile";
import { prisma } from "@/lib/prisma";

import { AddExerciseForm } from "./add-exercise-form";

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

  return (
    <Tile surface="parchment" className="pb-section">
      <h1 className="text-display-md font-display lg:text-display-lg">
        Exercícios de {category.name}
      </h1>

      <div className="mt-lg">
        <AddExerciseForm categoryId={category.id} />
      </div>

      {category.exercises.length === 0 ? (
        <p className="mt-xl max-w-[36ch] text-body text-ink-muted-80">
          Nenhum exercício nesta categoria ainda.
        </p>
      ) : (
        <ul className="mt-xl grid grid-cols-1 gap-sm lg:grid-cols-2 xl:grid-cols-3">
          {category.exercises.map((exercise) => (
            <li
              key={exercise.id}
              className="flex items-center gap-md rounded-lg border border-hairline bg-canvas p-lg"
            >
              <video
                src={exercise.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="size-[72px] shrink-0 rounded-sm bg-canvas-parchment object-cover"
              />
              <p className="min-w-0 truncate text-body-strong text-ink">
                {exercise.name}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Tile>
  );
}
