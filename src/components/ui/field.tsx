import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-xxs">
      <span className="text-caption-strong text-ink-muted-80">{label}</span>
      {children}
      {hint ? (
        <span className="text-fine-print text-ink-muted-48">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-touch w-full rounded-pill border border-hairline bg-canvas px-lg text-body text-ink",
        "placeholder:text-ink-muted-48",
        className,
      )}
      {...props}
    />
  );
}

export function FormError({ children }: { children?: string }) {
  if (!children) return null;

  return (
    <p role="alert" className="text-caption text-ink-muted-80">
      {children}
    </p>
  );
}
