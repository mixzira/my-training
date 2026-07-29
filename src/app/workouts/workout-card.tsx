"use client";

import { useState } from "react";

import {
  DeleteActionButton,
  EditActionButton,
} from "@/components/ui/action-buttons";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LongPressActions } from "@/components/ui/long-press-actions";
import { Modal } from "@/components/ui/modal";

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
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <LongPressActions
        actions={
          <>
            <EditActionButton
              label={`Editar ${workout.name}`}
              onClick={() => setEditing(true)}
            />
            <DeleteActionButton
              label={workout.name}
              onClick={() => setConfirming(true)}
            />
          </>
        }
      >
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
      </LongPressActions>

      {editing && (
        <Modal open onClose={() => setEditing(false)} title="Editar treino">
          <WorkoutForm
            workout={{
              id: workout.id,
              name: workout.name,
              exerciseIds: workout.exercises.map((exercise) => exercise.id),
            }}
            catalog={catalog}
            onClose={() => setEditing(false)}
          />
        </Modal>
      )}

      {confirming && (
        <ConfirmDialog
          open
          onClose={() => setConfirming(false)}
          title="Excluir treino"
          message={`Excluir "${workout.name}"? Esta ação não pode ser desfeita.`}
          action={deleteWorkout}
          hidden={{ id: workout.id }}
        />
      )}
    </>
  );
}
