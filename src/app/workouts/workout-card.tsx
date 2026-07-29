"use client";

import { useActionState, useState } from "react";

import {
  DeleteActionButton,
  EditActionButton,
} from "@/components/ui/action-buttons";
import { LongPressActions } from "@/components/ui/long-press-actions";
import { INITIAL_ACTION_STATE } from "@/lib/form";

import { deleteWorkout } from "./actions";
import { WorkoutForm, type CatalogCategory } from "./workout-form";

export type WorkoutCardData = {
  id: string;
  name: string;
  exercises: { id: string; name: string }[];
};

function summarize(total: number) {
  if (total === 0) return "Sem exercícios";
  if (total === 1) return "1 exercício";
  return `${total} exercícios`;
}

export function WorkoutCard({
  workout,
  catalog,
}: {
  workout: WorkoutCardData;
  catalog: CatalogCategory[];
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    deleteWorkout,
    INITIAL_ACTION_STATE,
  );

  if (editing) {
    return (
      <WorkoutForm
        workout={{
          id: workout.id,
          name: workout.name,
          exerciseIds: workout.exercises.map((exercise) => exercise.id),
        }}
        catalog={catalog}
        onClose={() => setEditing(false)}
      />
    );
  }

  return (
    <LongPressActions
      actions={
        <>
          <EditActionButton
            label={`Editar ${workout.name}`}
            onClick={() => setEditing(true)}
          />
          <form action={formAction} className="contents">
            <input type="hidden" name="id" value={workout.id} />
            <DeleteActionButton label={workout.name} pending={pending} />
          </form>
        </>
      }
    >
      <div className="flex flex-col gap-xxs">
        <div className="flex flex-col gap-xxs rounded-lg border border-hairline bg-canvas p-lg">
          <p className="truncate text-body-strong text-ink">{workout.name}</p>
          <p className="text-caption text-ink-muted-48">
            {summarize(workout.exercises.length)}
          </p>
          {workout.exercises.length > 0 ? (
            <p className="mt-xxs truncate text-caption text-ink-muted-80">
              {workout.exercises.map((exercise) => exercise.name).join(" · ")}
            </p>
          ) : null}
        </div>

        {state.error ? (
          <p role="alert" className="text-fine-print text-danger">
            {state.error}
          </p>
        ) : null}
      </div>
    </LongPressActions>
  );
}
