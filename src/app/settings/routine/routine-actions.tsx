"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";

import { deleteRoutine } from "./actions";
import {
  RoutineForm,
  type RoutineDraft,
  type WorkoutOption,
} from "./routine-form";

export function RoutineActions({
  routine,
  workouts,
  today,
}: {
  routine: RoutineDraft;
  workouts: WorkoutOption[];
  today: string;
}) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-wrap gap-sm">
      <Button variant="secondary" onClick={() => setEditing(true)}>
        Editar
      </Button>
      <Button variant="secondary" onClick={() => setConfirming(true)}>
        Excluir
      </Button>

      {editing && (
        <Modal open onClose={() => setEditing(false)} title="Editar rotina">
          <RoutineForm
            routine={routine}
            workouts={workouts}
            today={today}
            onClose={() => setEditing(false)}
          />
        </Modal>
      )}

      {confirming && (
        <ConfirmDialog
          open
          onClose={() => setConfirming(false)}
          title="Excluir rotina"
          message={`Excluir a rotina "${routine.name}"? O histórico dela também será apagado. Esta ação não pode ser desfeita.`}
          action={deleteRoutine}
          hidden={{ id: routine.id }}
        />
      )}
    </div>
  );
}
