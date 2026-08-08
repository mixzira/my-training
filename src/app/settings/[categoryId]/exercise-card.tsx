"use client";

import { useState } from "react";

import {
  DeleteActionButton,
  EditActionButton,
} from "@/components/ui/action-buttons";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LongPressActions } from "@/components/ui/long-press-actions";
import { Modal } from "@/components/ui/modal";

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
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <LongPressActions
        actions={
          <>
            <EditActionButton
              label={`Editar ${exercise.name}`}
              onClick={() => setEditing(true)}
            />
            <DeleteActionButton
              label={exercise.name}
              onClick={() => setConfirming(true)}
            />
          </>
        }
      >
        <div className="flex items-center gap-md rounded-lg border border-hairline bg-canvas p-lg">
          <video
            src={`${exercise.videoUrl}#t=0.001`}
            muted
            playsInline
            preload="metadata"
            className="size-[72px] shrink-0 rounded-sm bg-canvas-parchment object-cover"
          />
          <p className="min-w-0 truncate text-body-strong text-ink">
            {exercise.name}
          </p>
        </div>
      </LongPressActions>

      {editing && (
        <Modal open onClose={() => setEditing(false)} title="Editar exercício">
          <ExerciseForm
            categoryId={categoryId}
            exercise={exercise}
            onClose={() => setEditing(false)}
          />
        </Modal>
      )}

      {confirming && (
        <ConfirmDialog
          open
          onClose={() => setConfirming(false)}
          title="Excluir exercício"
          message={`Excluir "${exercise.name}"? Esta ação não pode ser desfeita.`}
          action={deleteExercise}
          hidden={{ id: exercise.id }}
        />
      )}
    </>
  );
}
