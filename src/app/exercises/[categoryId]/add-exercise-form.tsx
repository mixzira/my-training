"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

import { ExerciseForm } from "./exercise-form";

export function AddExerciseForm({ categoryId }: { categoryId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Exercício</Button>

      {open && (
        <Modal open onClose={() => setOpen(false)} title="Novo exercício">
          <ExerciseForm categoryId={categoryId} onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}
