"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";

import {
  DeleteActionButton,
  EditActionButton,
} from "@/components/ui/action-buttons";
import { LongPressActions } from "@/components/ui/long-press-actions";
import { INITIAL_ACTION_STATE } from "@/lib/form";

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
  const [state, formAction, pending] = useActionState(
    deleteCategory,
    INITIAL_ACTION_STATE,
  );

  if (editing) {
    return <CategoryForm category={category} onClose={() => setEditing(false)} />;
  }

  const message = state.error ?? state.warning;

  return (
    <LongPressActions
      actions={
        <>
          <EditActionButton
            label={`Editar ${category.name}`}
            onClick={() => setEditing(true)}
          />
          <form action={formAction} className="contents">
            <input type="hidden" name="id" value={category.id} />
            <DeleteActionButton label={category.name} pending={pending} />
          </form>
        </>
      }
    >
      <div className="flex flex-col gap-xxs">
        <Link
          href={`/exercises/${category.id}`}
          className="flex items-center gap-md rounded-lg border border-hairline bg-canvas p-lg"
        >
          <Image
            src={category.imageUrl}
            alt=""
            width={72}
            height={72}
            className="size-[72px] shrink-0 rounded-sm bg-canvas-parchment object-cover"
            unoptimized
          />
          <div className="min-w-0">
            <p className="truncate text-body-strong text-ink">{category.name}</p>
            <p className="mt-xxs text-caption text-ink-muted-48">
              {category.summary}
            </p>
          </div>
        </Link>

        {message ? (
          <p role="alert" className="text-fine-print text-danger">
            {message}
          </p>
        ) : null}
      </div>
    </LongPressActions>
  );
}
