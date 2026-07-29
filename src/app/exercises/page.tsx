import Image from "next/image";
import Link from "next/link";

import { Tile } from "@/components/ui/tile";
import { prisma } from "@/lib/prisma";

import { AddCategoryForm } from "./add-category-form";

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

  return (
    <Tile surface="parchment" className="pb-section">
      <h1 className="text-display-md font-display lg:text-display-lg">
        Exercícios
      </h1>

      <div className="mt-lg">
        <AddCategoryForm />
      </div>

      {categories.length === 0 ? (
        <p className="mt-xl max-w-[36ch] text-body text-ink-muted-80">
          Nenhuma categoria ainda. Crie a primeira para começar a organizar seus
          exercícios.
        </p>
      ) : (
        <ul className="mt-xl grid grid-cols-1 gap-sm lg:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/exercises/${category.id}`}
                className="flex items-center gap-md rounded-lg border border-hairline bg-canvas p-lg transition-transform duration-150 active:scale-95"
              >
                <Image
                  src={category.imageUrl}
                  alt=""
                  width={72}
                  height={72}
                  className="size-[72px] shrink-0 rounded-sm bg-canvas-parchment object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-body-strong text-ink">
                    {category.name}
                  </p>
                  <p className="mt-xxs text-caption text-ink-muted-48">
                    {summarize(category.name, category._count.exercises)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Tile>
  );
}
