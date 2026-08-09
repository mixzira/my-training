"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/field";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { INITIAL_ACTION_STATE } from "@/lib/form";
import { VIDEO_CONTENT_TYPES } from "@/lib/storage/config";

import { createExercise, updateExercise } from "./actions";

const ACCEPT = VIDEO_CONTENT_TYPES.join(",");

export function ExerciseForm({
  categoryId,
  exercise,
  onClose,
}: {
  categoryId: string;
  exercise?: { id: string; name: string; videoKey: string };
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    exercise ? updateExercise : createExercise,
    INITIAL_ACTION_STATE,
  );
  useEffect(() => {
    if (state.ok) onClose();
  }, [state, onClose]);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-md">
      {exercise ? (
        <input type="hidden" name="id" value={exercise.id} />
      ) : (
        <input type="hidden" name="categoryId" value={categoryId} />
      )}

      <Field label="Nome" error={state.fieldErrors?.name}>
        <Input
          name="name"
          defaultValue={exercise?.name}
          placeholder="Supino reto"
          maxLength={80}
          invalid={Boolean(state.fieldErrors?.name)}
        />
      </Field>

      <FileUploadField
        name="videoKey"
        label="Vídeo de execução"
        folder="exercises"
        accept={ACCEPT}
        acceptedTypes={VIDEO_CONTENT_TYPES}
        hint="MP4 ou WebM, até 100 MB."
        defaultKey={exercise?.videoKey}
        error={state.fieldErrors?.videoKey}
      />

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
