"use client";

import { useMemo, useState } from "react";

import { ChevronDownIcon, PlusIcon } from "@/components/icons";
import { FieldMessage, Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";

import type { CatalogCategory, CatalogExercise } from "./workout-form";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function ExerciseAddCard({
  exercise,
  onAdd,
  active,
}: {
  exercise: CatalogExercise;
  onAdd: (id: string) => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onAdd(exercise.id)}
      className="flex w-full items-center gap-md rounded-lg border border-hairline bg-canvas p-md text-left transition-transform duration-150 active:scale-95"
    >
      <video
        src={active ? `${exercise.videoUrl}#t=0.001` : undefined}
        muted
        playsInline
        preload="metadata"
        className="size-[72px] shrink-0 rounded-sm bg-canvas-parchment object-cover"
      />
      <span className="min-w-0 flex-1 truncate text-body-strong text-ink">
        {exercise.name}
      </span>
      <PlusIcon className="size-6 shrink-0 text-primary dark:text-primary-on-dark" />
    </button>
  );
}

export function ExercisePicker({
  catalog,
  onAdd,
}: {
  catalog: CatalogCategory[];
  onAdd: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const q = normalize(query);
  const searching = q.length > 0;

  const results = useMemo(() => {
    if (!searching) return [];
    return catalog
      .map((category) => ({
        ...category,
        exercises: category.exercises.filter((exercise) =>
          normalize(exercise.name).includes(q),
        ),
      }))
      .filter((category) => category.exercises.length > 0);
  }, [catalog, q, searching]);

  if (catalog.length === 0) {
    return (
      <FieldMessage tone="muted">
        Cadastre exercícios antes de montar um treino.
      </FieldMessage>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      <Input
        type="search"
        aria-label="Buscar exercício"
        placeholder="Buscar exercício"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {searching ? (
        results.length === 0 ? (
          <FieldMessage tone="muted">Nenhum exercício encontrado.</FieldMessage>
        ) : (
          <div className="flex flex-col gap-sm">
            {results.map((category) => (
              <div key={category.id} className="flex flex-col gap-xxs">
                <span className="text-caption text-ink-muted-48">
                  {category.name}
                </span>
                {category.exercises.map((exercise) => (
                  <ExerciseAddCard
                    key={exercise.id}
                    exercise={exercise}
                    onAdd={onAdd}
                    active
                  />
                ))}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col gap-xxs">
          {catalog.map((category) => {
            const open = openId === category.id;

            return (
              <div
                key={category.id}
                className="overflow-hidden rounded-md border border-hairline"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : category.id)}
                  className="flex min-h-touch w-full items-center justify-between gap-sm bg-canvas px-md text-left"
                >
                  <span className="min-w-0 truncate text-body-strong text-ink">
                    {category.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-xs text-ink-muted-48">
                    <span className="text-caption tabular-nums">
                      {category.exercises.length}
                    </span>
                    <ChevronDownIcon
                      className={cn(
                        "size-5 transition-transform duration-150",
                        open && "rotate-180",
                      )}
                    />
                  </span>
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-xxs border-t border-hairline p-xs">
                      {category.exercises.map((exercise) => (
                        <ExerciseAddCard
                          key={exercise.id}
                          exercise={exercise}
                          onAdd={onAdd}
                          active={open}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
