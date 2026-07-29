"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { ExerciseForm } from "./exercise-form";

export function AddExerciseForm({ categoryId }: { categoryId: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Exercício</Button>;
  }

  return (
    <ExerciseForm categoryId={categoryId} onClose={() => setOpen(false)} />
  );
}
