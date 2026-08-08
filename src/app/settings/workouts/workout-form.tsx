"use client";

import { useActionState, useMemo, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Field, FieldMessage, FormError, Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { INITIAL_ACTION_STATE } from "@/lib/form";

import { createWorkout, updateWorkout } from "./actions";
import { ExercisePicker } from "./exercise-picker";

export type CatalogExercise = { id: string; name: string; videoUrl: string };
export type CatalogCategory = {
  id: string;
  name: string;
  exercises: CatalogExercise[];
};

const rowButton =
  "flex size-touch shrink-0 items-center justify-center rounded-md text-ink-muted-80 transition-transform duration-150 active:scale-95 disabled:text-ink-muted-48";

export function WorkoutForm({
  workout,
  catalog,
  onClose,
}: {
  workout?: { id: string; name: string; exerciseIds: string[] };
  catalog: CatalogCategory[];
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    workout ? updateWorkout : createWorkout,
    INITIAL_ACTION_STATE,
  );
  const [settledState, setSettledState] = useState(state);
  const [selected, setSelected] = useState<string[]>(
    workout?.exerciseIds ?? [],
  );

  if (state !== settledState) {
    setSettledState(state);
    if (state.ok) onClose();
  }

  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of catalog) {
      for (const exercise of category.exercises) {
        map.set(exercise.id, exercise.name);
      }
    }
    return map;
  }, [catalog]);

  function add(id: string) {
    setSelected((prev) => [...prev, id]);
  }

  function removeAt(index: number) {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    setSelected((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const exercisesError = state.fieldErrors?.exercises;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-md">
      {workout ? <input type="hidden" name="id" value={workout.id} /> : null}
      {selected.map((id, index) => (
        <input key={index} type="hidden" name="exerciseIds" value={id} />
      ))}

      <Field label="Nome" error={state.fieldErrors?.name}>
        <Input
          name="name"
          defaultValue={workout?.name}
          placeholder="Treino A"
          maxLength={80}
          invalid={Boolean(state.fieldErrors?.name)}
        />
      </Field>

      <div className="flex flex-col gap-xxs">
        <span
          className={cn(
            "text-caption-strong",
            exercisesError ? "text-danger" : "text-ink-muted-80",
          )}
        >
          Exercícios do treino
        </span>

        {selected.length === 0 ? (
          <FieldMessage tone={exercisesError ? "danger" : "muted"}>
            {exercisesError ?? "Escolha exercícios na busca abaixo."}
          </FieldMessage>
        ) : (
          <ol className="flex flex-col gap-xxs">
            {selected.map((id, index) => (
              <li
                key={index}
                className="flex items-center gap-xs rounded-md border border-hairline bg-canvas px-sm py-xxs"
              >
                <span className="w-5 shrink-0 text-caption text-ink-muted-48 tabular-nums">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-body text-ink">
                  {nameById.get(id) ?? "—"}
                </span>
                <button
                  type="button"
                  aria-label="Mover para cima"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className={rowButton}
                >
                  <ChevronUpIcon className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Mover para baixo"
                  onClick={() => move(index, 1)}
                  disabled={index === selected.length - 1}
                  className={rowButton}
                >
                  <ChevronDownIcon className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label={`Remover ${nameById.get(id) ?? "exercício"}`}
                  onClick={() => removeAt(index)}
                  className={cn(rowButton, "text-ink")}
                >
                  <TrashIcon className="size-5" />
                </button>
              </li>
            ))}
          </ol>
        )}

        {exercisesError && selected.length > 0 ? (
          <FieldMessage>{exercisesError}</FieldMessage>
        ) : null}
      </div>

      <div className="flex flex-col gap-sm">
        <span className="text-caption-strong text-ink-muted-80">
          Adicionar exercícios
        </span>
        <ExercisePicker catalog={catalog} onAdd={add} />
      </div>

      <FormError>{state.error}</FormError>

      <div className="flex flex-wrap gap-sm">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={pending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
