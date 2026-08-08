import { Header } from "@/components/ui/header";
import { Tile } from "@/components/ui/tile";
import { prisma } from "@/lib/prisma";
import { createFileUrl } from "@/lib/storage";

import { AddCategoryForm } from "./add-category-form";
import { CategoryCard } from "./category-card";

export const dynamic = "force-dynamic";

function summarize(name: string, total: number) {
  const subject = name.toLowerCase();

  if (total === 0) return `Nenhum exercício de ${subject} ainda`;
  if (total === 1) return `1 exercício de ${subject}`;

  return `${total} exercícios de ${subject}`;
}

export default async function ExercisesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { exercises: true } } },
  });

  const cards = await Promise.all(
    categories.map(async (category) => ({
      id: category.id,
      name: category.name,
      imageKey: category.imageKey,
      imageUrl: await createFileUrl(category.imageKey),
      summary: summarize(category.name, category._count.exercises),
    })),
  );

  return (
    <>
      <Header title="Exercícios" />
      <Tile surface="parchment" className="pb-section">
        <h1 className="text-display-md font-display lg:text-display-lg">
          Exercícios
        </h1>

        <div className="mt-lg">
          <AddCategoryForm />
        </div>

        {cards.length === 0 ? (
          <p className="mt-xl max-w-[36ch] text-body text-ink-muted-80">
            Nenhuma categoria ainda. Crie a primeira para começar a organizar
            seus exercícios.
          </p>
        ) : (
          <ul className="mt-xl grid grid-cols-1 gap-sm lg:grid-cols-2 xl:grid-cols-3">
            {cards.map((category) => (
              <li key={category.id}>
                <CategoryCard category={category} />
              </li>
            ))}
          </ul>
        )}
      </Tile>
    </>
  );
}
