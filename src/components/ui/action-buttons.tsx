"use client";

import { PencilIcon, TrashIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const shape =
  "flex size-touch shrink-0 items-center justify-center rounded-full border border-hairline bg-canvas transition-transform duration-150 active:scale-95";

export function EditActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(shape, "text-ink")}
    >
      <PencilIcon className="size-5" />
    </button>
  );
}

export function DeleteActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Excluir ${label}`}
      onClick={onClick}
      className={cn(shape, "text-ink")}
    >
      <TrashIcon className="size-5" />
    </button>
  );
}
