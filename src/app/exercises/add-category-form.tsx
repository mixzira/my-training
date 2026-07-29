"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CategoryForm } from "./category-form";

export function AddCategoryForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Categoria</Button>;
  }

  return <CategoryForm onClose={() => setOpen(false)} />;
}
