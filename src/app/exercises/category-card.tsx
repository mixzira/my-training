"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  DeleteActionButton,
  EditActionButton,
} from "@/components/ui/action-buttons";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LongPressActions } from "@/components/ui/long-press-actions";
import { Modal } from "@/components/ui/modal";

import { deleteCategory } from "./actions";
import { CategoryForm } from "./category-form";

export type CategoryCardData = {
  id: string;
  name: string;
  imageKey: string;
  imageUrl: string;
  summary: string;
};

export function CategoryCard({ category }: { category: CategoryCardData }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <LongPressActions
        actions={
          <>
            <EditActionButton
              label={`Editar ${category.name}`}
              onClick={() => setEditing(true)}
            />
            <DeleteActionButton
              label={category.name}
              onClick={() => setConfirming(true)}
            />
          </>
        }
      >
        <Link
          href={`/exercises/${category.id}`}
          className="flex items-center gap-md rounded-lg border border-hairline bg-canvas p-4"
        >
          <Image
            src={category.imageUrl}
            alt=""
            width={72}
            height={72}
            className="size-22 aspect-square shrink-0 rounded-sm bg-canvas-parchment object-cover"
            unoptimized
          />
          <div className="min-w-0">
            <p className="truncate text-body-strong text-ink">{category.name}</p>
            <p className="mt-xxs text-caption text-ink-muted-48">
              {category.summary}
            </p>
          </div>
        </Link>
      </LongPressActions>

      {editing && (
        <Modal open onClose={() => setEditing(false)} title="Editar categoria">
          <CategoryForm category={category} onClose={() => setEditing(false)} />
        </Modal>
      )}

      {confirming && (
        <ConfirmDialog
          open
          onClose={() => setConfirming(false)}
          title="Excluir categoria"
          message={`Excluir "${category.name}"? Os exercícios dela também serão excluídos. Esta ação não pode ser desfeita.`}
          action={deleteCategory}
          hidden={{ id: category.id }}
        />
      )}
    </>
  );
}
