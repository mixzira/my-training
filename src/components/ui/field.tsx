import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

export function FieldMessage({
  tone = "danger",
  children,
}: {
  tone?: "danger" | "muted";
  children?: string;
}) {
  if (!children) return null;

  return (
    <span
      role={tone === "danger" ? "alert" : undefined}
      className={cn(
        "text-fine-print",
        tone === "danger" ? "text-danger" : "text-ink-muted-48",
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  const invalid = Boolean(error);
  const Wrapper = htmlFor ? "div" : "label";

  return (
    <Wrapper className="flex flex-col gap-xxs">
      <span
        className={cn(
          "text-caption-strong",
          invalid ? "text-danger" : "text-ink-muted-80",
        )}
      >
        {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : label}
      </span>

      {children}

      {invalid ? (
        <FieldMessage>{error}</FieldMessage>
      ) : (
        <FieldMessage tone="muted">{hint}</FieldMessage>
      )}
    </Wrapper>
  );
}

export function Input({
  invalid = false,
  className,
  ...props
}: { invalid?: boolean } & ComponentProps<"input">) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "h-touch w-full rounded-pill border bg-canvas px-lg text-body",
        "placeholder:text-ink-muted-48",
        invalid ? "border-danger text-danger" : "border-hairline text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function FormError({ children }: { children?: string }) {
  if (!children) return null;

  return (
    <p role="alert" className="text-caption text-danger">
      {children}
    </p>
  );
}
