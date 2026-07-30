"use client";

import type { ReactNode } from "react";

import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function Check({
  checked,
  onChange,
  className,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex min-h-touch items-center gap-sm text-left transition-transform duration-150 active:scale-95",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
          checked
            ? "border-primary bg-primary text-on-primary [animation:check-pop_0.3s_ease-out]"
            : "border-hairline text-transparent",
        )}
      >
        <CheckIcon className="size-4" />
      </span>
      {children}
    </button>
  );
}
