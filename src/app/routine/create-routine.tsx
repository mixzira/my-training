"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

import { RoutineForm, type WorkoutOption } from "./routine-form";

export function CreateRoutine({ workouts }: { workouts: WorkoutOption[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Rotina</Button>

      {open && (
        <Modal open onClose={() => setOpen(false)} title="Nova rotina">
          <RoutineForm workouts={workouts} onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}
