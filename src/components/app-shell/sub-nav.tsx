import type { ReactNode } from "react";

export function SubNav({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="sticky top-nav z-40 border-b border-hairline bg-canvas-parchment/80 backdrop-blur-xl">
      <div className="mx-auto flex h-subnav max-w-[1440px] items-center justify-between gap-md px-lg lg:px-xl">
        <h1 className="truncate text-tagline font-display text-ink">{title}</h1>
        {action}
      </div>
    </div>
  );
}
