"use client";

import { useState } from "react";

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
  pending,
}: {
  label: string;
  pending: boolean;
}) {
  const [armed, setArmed] = useState(false);

  if (armed) {
    return (
      <button
        type="submit"
        aria-label={`Confirmar exclusão de ${label}`}
        disabled={pending}
        className={cn(
          shape,
          "w-auto border-ink bg-ink px-sm text-caption-strong text-on-dark",
        )}
      >
        {pending ? "…" : "Confirmar"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Excluir ${label}`}
      disabled={pending}
      onClick={() => setArmed(true)}
      className={cn(shape, "text-ink")}
    >
      <TrashIcon className="size-5" />
    </button>
  );
}
