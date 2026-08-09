import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type TileSurface = "light" | "parchment" | "dark" | "dark-2" | "dark-3";

const surfaces: Record<TileSurface, string> = {
  light: "bg-canvas text-ink",
  parchment: "bg-canvas-parchment text-ink",
  dark: "bg-surface-tile-1 text-on-dark",
  "dark-2": "bg-surface-tile-2 text-on-dark",
  "dark-3": "bg-surface-tile-3 text-on-dark",
};

export function Tile({
  surface = "light",
  className,
  children,
}: {
  surface?: TileSurface;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section className={cn("flex w-full flex-1 flex-col", surfaces[surface], className)}>
      <div className="mx-auto flex w-full max-w-360 flex-1 flex-col px-lg pb-xxl lg:px-xl lg:pt-xl lg:pb-section">
        {children}
      </div>
    </section>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-hairline bg-canvas p-lg text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-md py-xxl">
      <h2 className="text-display-md font-display">{title}</h2>
      <p className="max-w-[36ch] text-body text-ink-muted-80">{description}</p>
      {action}
    </div>
  );
}
