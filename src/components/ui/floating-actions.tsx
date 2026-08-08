import type { ReactNode } from "react";

export function FloatingActions({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-8">
      <div className="pointer-events-auto flex flex-wrap justify-center gap-sm">
        {children}
      </div>
    </div>
  );
}
