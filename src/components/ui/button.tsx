import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "dark-utility"
  | "pearl"
  | "hero";

const base =
  "inline-flex items-center justify-center gap-xs select-none " +
  "min-h-touch transition-transform duration-150 active:scale-95 " +
  "disabled:pointer-events-none disabled:text-ink-muted-48";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary text-body rounded-pill px-[22px] py-[11px]",
  secondary:
    "bg-transparent text-primary border-primary dark:text-primary-on-dark dark:border-primary-on-dark text-body rounded-pill px-[22px] py-[11px] border",
  "dark-utility":
    "bg-ink text-canvas text-button-utility rounded-sm px-[15px] py-xs",
  pearl:
    "bg-surface-pearl text-ink-muted-80 text-caption rounded-md px-[14px] py-xs border border-divider-soft",
  hero: "bg-primary text-on-primary text-button-large rounded-pill px-[28px] py-[14px]",
};

type ButtonBaseProps = {
  variant?: ButtonVariant;
  block?: boolean;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  block = false,
  className,
  children,
  ...props
}: ButtonBaseProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], block && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  block = false,
  className,
  children,
  ...props
}: ButtonBaseProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(base, variants[variant], block && "w-full", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function TextLink({
  onDark = false,
  className,
  children,
  ...props
}: { onDark?: boolean } & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "text-body",
        onDark
          ? "text-primary-on-dark"
          : "text-primary dark:text-primary-on-dark",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
