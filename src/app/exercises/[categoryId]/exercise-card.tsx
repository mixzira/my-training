"use client";

import { useActionState, useState } from "react";

import {
  DeleteActionButton,
  EditActionButton,
} from "@/components/ui/action-buttons";
import { LongPressActions } from "@/components/ui/long-press-actions";
import { INITIAL_ACTION_STATE } from "@/lib/form";

import { deleteExercise } from "./actions";
import { ExerciseForm } from "./exercise-form";

export type ExerciseCardData = {
  id: string;
  name: string;
  videoKey: string;
  videoUrl: string;
};

export function ExerciseCard({
  categoryId,
  exercise,
}: {
  categoryId: string;
  exercise: ExerciseCardData;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    deleteExercise,
    INITIAL_ACTION_STATE,
  );

  if (editing) {
    return (
      <ExerciseForm
        categoryId={categoryId}
        exercise={exercise}
        onClose={() => setEditing(false)}
      />
    );
  }

  const message = state.error ?? state.warning;

  return (
    <LongPressActions
      actions={
        <>
          <EditActionButton
            label={`Editar ${exercise.name}`}
            onClick={() => setEditing(true)}
          />
          <form action={formAction} className="contents">
            <input type="hidden" name="id" value={exercise.id} />
            <DeleteActionButton label={exercise.name} pending={pending} />
          </form>
        </>
      }
    >
      <div className="flex flex-col gap-xxs">
        <div className="flex items-center gap-md rounded-lg border border-hairline bg-canvas p-lg">
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
        </div>

        {message ? (
          <p role="alert" className="text-fine-print text-danger">
            {message}
          </p>
        ) : null}
      </div>
    </LongPressActions>
  );
}
