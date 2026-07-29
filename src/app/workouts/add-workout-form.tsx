"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { WorkoutForm, type CatalogCategory } from "./workout-form";

export function AddWorkoutForm({ catalog }: { catalog: CatalogCategory[] }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Treino</Button>;
  }

  return <WorkoutForm catalog={catalog} onClose={() => setOpen(false)} />;
}
