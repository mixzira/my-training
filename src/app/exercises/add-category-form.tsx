"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

import { CategoryForm } from "./category-form";

export function AddCategoryForm() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Categoria</Button>

      {open && (
        <Modal open onClose={() => setOpen(false)} title="Nova categoria">
          <CategoryForm onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}
