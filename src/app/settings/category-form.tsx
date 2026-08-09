"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/field";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { INITIAL_ACTION_STATE } from "@/lib/form";
import { IMAGE_CONTENT_TYPES } from "@/lib/storage/config";

import { createCategory, updateCategory } from "./actions";

const ACCEPT = IMAGE_CONTENT_TYPES.join(",");

export function CategoryForm({
  category,
  onClose,
}: {
  category?: { id: string; name: string; imageKey: string };
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    category ? updateCategory : createCategory,
    INITIAL_ACTION_STATE,
  );
  useEffect(() => {
    if (state.ok) onClose();
  }, [state, onClose]);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-md">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <Field label="Nome" error={state.fieldErrors?.name}>
        <Input
          name="name"
          defaultValue={category?.name}
          placeholder="Peito"
          maxLength={80}
          invalid={Boolean(state.fieldErrors?.name)}
        />
      </Field>

      <FileUploadField
        name="imageKey"
        label="Imagem"
        folder="categories"
        accept={ACCEPT}
        acceptedTypes={IMAGE_CONTENT_TYPES}
        hint="PNG, JPEG, WebP ou AVIF, até 8 MB."
        defaultKey={category?.imageKey}
        error={state.fieldErrors?.imageKey}
      />

      <FormError>{state.error}</FormError>

      <div className="flex flex-wrap gap-sm">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={pending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
