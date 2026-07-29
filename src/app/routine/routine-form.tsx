"use client";

import { useActionState, useMemo, useState } from "react";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Field, FieldMessage, FormError, Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { INITIAL_ACTION_STATE } from "@/lib/form";

import { createRoutine, updateRoutine } from "./actions";

export type WorkoutOption = { id: string; name: string };

export type RoutineDraft = {
  id: string;
  name: string;
  slots: { id: string; type: "WORKOUT" | "REST"; workoutId: string | null }[];
};

type SlotDraft = {
  key: string;
  id?: string;
  type: "WORKOUT" | "REST";
  workoutId?: string;
};

const rowButton =
  "flex size-touch shrink-0 items-center justify-center rounded-md text-ink-muted-80 transition-transform duration-150 active:scale-95 disabled:text-ink-muted-48";

export function RoutineForm({
  routine,
  workouts,
  onClose,
}: {
  routine?: RoutineDraft;
  workouts: WorkoutOption[];
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    routine ? updateRoutine : createRoutine,
    INITIAL_ACTION_STATE,
  );
  const [settledState, setSettledState] = useState(state);
  const [slots, setSlots] = useState<SlotDraft[]>(() =>
    routine
      ? routine.slots.map((slot) => ({
          key: slot.id,
          id: slot.id,
          type: slot.type,
          workoutId: slot.workoutId ?? undefined,
        }))
      : [],
  );

  if (state !== settledState) {
    setSettledState(state);
    if (state.ok) onClose();
  }

  const workoutName = useMemo(
    () => new Map(workouts.map((workout) => [workout.id, workout.name])),
    [workouts],
  );

  function addWorkout(workoutId: string) {
    setSlots((prev) => [
      ...prev,
      { key: crypto.randomUUID(), type: "WORKOUT", workoutId },
    ]);
  }

  function addRest() {
    setSlots((prev) => [...prev, { key: crypto.randomUUID(), type: "REST" }]);
  }

  function removeAt(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    setSlots((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function slotLabel(slot: SlotDraft) {
    if (slot.type === "REST") return "Descanso";
    return workoutName.get(slot.workoutId ?? "") ?? "Treino removido";
  }

  const slotsError = state.fieldErrors?.slots;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-md">
      {routine ? <input type="hidden" name="id" value={routine.id} /> : null}
      {slots.map((slot) => (
        <input
          key={slot.key}
          type="hidden"
          name="slots"
          value={JSON.stringify({
            id: slot.id,
            type: slot.type,
            workoutId: slot.workoutId,
          })}
        />
      ))}

      <Field label="Nome" error={state.fieldErrors?.name}>
        <Input
          name="name"
          defaultValue={routine?.name}
          placeholder="Ciclo ABC + descanso"
          maxLength={80}
          invalid={Boolean(state.fieldErrors?.name)}
        />
      </Field>

      <div className="flex flex-col gap-xxs">
        <span
          className={cn(
            "text-caption-strong",
            slotsError ? "text-danger" : "text-ink-muted-80",
          )}
        >
          Fila da rotina
        </span>

        {slots.length === 0 ? (
          <FieldMessage tone={slotsError ? "danger" : "muted"}>
            {slotsError ?? "Adicione treinos e descansos na ordem do ciclo."}
          </FieldMessage>
        ) : (
          <ol className="flex flex-col gap-xxs">
            {slots.map((slot, index) => (
              <li
                key={slot.key}
                className="flex items-center gap-xs rounded-md border border-hairline bg-canvas px-sm py-xxs"
              >
                <span className="w-5 shrink-0 text-caption text-ink-muted-48 tabular-nums">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-body text-ink">
                  {slotLabel(slot)}
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
                  disabled={index === slots.length - 1}
                  className={rowButton}
                >
                  <ChevronDownIcon className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label={`Remover ${slotLabel(slot)}`}
                  onClick={() => removeAt(index)}
                  className={cn(rowButton, "text-ink")}
                >
                  <TrashIcon className="size-5" />
                </button>
              </li>
            ))}
          </ol>
        )}

        {slotsError && slots.length > 0 ? (
          <FieldMessage>{slotsError}</FieldMessage>
        ) : null}
      </div>

      <div className="flex flex-col gap-sm">
        <span className="text-caption-strong text-ink-muted-80">Adicionar</span>

        <div className="flex flex-wrap gap-xxs">
          <button
            type="button"
            onClick={addRest}
            className="inline-flex min-h-touch items-center gap-xxs rounded-pill border border-hairline bg-canvas px-md text-caption text-ink transition-transform duration-150 active:scale-95"
          >
            <PlusIcon className="size-4" />
            Descanso
          </button>
          {workouts.map((workout) => (
            <button
              key={workout.id}
              type="button"
              onClick={() => addWorkout(workout.id)}
              className="inline-flex min-h-touch items-center gap-xxs rounded-pill border border-hairline bg-canvas px-md text-caption text-ink transition-transform duration-150 active:scale-95"
            >
              <PlusIcon className="size-4" />
              {workout.name}
            </button>
          ))}
        </div>

        {workouts.length === 0 ? (
          <FieldMessage tone="muted">
            Cadastre treinos para incluí-los na rotina.
          </FieldMessage>
        ) : null}
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
