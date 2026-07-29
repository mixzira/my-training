"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/field";
import { INITIAL_ACTION_STATE } from "@/lib/form";

import { createExercise } from "./actions";

export function AddExerciseForm({ categoryId }: { categoryId: string }) {
  const [state, formAction, pending] = useActionState(
    createExercise,
    INITIAL_ACTION_STATE,
  );
  const [open, setOpen] = useState(false);
  const [settledState, setSettledState] = useState(state);

  if (state !== settledState) {
    setSettledState(state);
    if (state.ok) setOpen(false);
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Exercício</Button>;
  }

  return (
    <form
      action={formAction}
      className="flex w-full max-w-[520px] flex-col gap-md rounded-lg border border-hairline bg-canvas p-lg"
    >
      <input type="hidden" name="categoryId" value={categoryId} />

      <Field label="Nome">
        <Input name="name" placeholder="Supino reto" required maxLength={80} />
      </Field>

      <Field label="Vídeo de execução" hint="Link para um MP4 ou WebM.">
        <Input
          name="videoUrl"
          type="url"
          inputMode="url"
          placeholder="https://"
          required
        />
      </Field>

      <FormError>{state.error}</FormError>

      <div className="flex flex-wrap gap-sm">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
          disabled={pending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
