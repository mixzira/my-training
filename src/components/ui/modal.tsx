"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Modal({
  open,
  onClose,
  title,
  bare = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  bare?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-[520px] overflow-y-auto p-0 text-ink",
        bare
          ? "bg-transparent"
          : "rounded-lg border border-hairline bg-canvas",
      )}
    >
      <div
        className={cn("flex flex-col", bare ? "gap-xs p-0" : "gap-md p-lg")}
      >
        {title ? <h2 className="text-body-strong text-ink">{title}</h2> : null}
        {children}
      </div>
    </dialog>
  );
}
