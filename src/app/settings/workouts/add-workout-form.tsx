"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

import { WorkoutForm, type CatalogCategory } from "./workout-form";

export function AddWorkoutForm({ catalog }: { catalog: CatalogCategory[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Treino</Button>

      {open && (
        <Modal open onClose={() => setOpen(false)} title="Novo treino">
          <WorkoutForm catalog={catalog} onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}
