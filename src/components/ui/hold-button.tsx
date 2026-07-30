"use client";

import { useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export function HoldButton({
  onComplete,
  holdMs = 1500,
  className,
  children,
}: {
  onComplete: () => void;
  holdMs?: number;
  className?: string;
  children: ReactNode;
}) {
  const [holding, setHolding] = useState(false);
  const completedRef = useRef(false);

  function start() {
    if (completedRef.current) return;
    setHolding(true);
  }

  function cancel() {
    setHolding(false);
  }

  function handleTransitionEnd() {
    if (holding && !completedRef.current) {
      completedRef.current = true;
      setHolding(false);
      onComplete();
    }
  }

  return (
    <button
      type="button"
      onPointerDown={(event) => {
        event.preventDefault();
        start();
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(event) => event.preventDefault()}
      className={cn(
        "relative min-h-touch w-full select-none touch-none overflow-hidden rounded-pill bg-surface-tile-2 px-lg text-on-dark",
        className,
      )}
    >
      <span
        aria-hidden
        onTransitionEnd={handleTransitionEnd}
        style={{
          width: holding ? "100%" : "0%",
          transitionProperty: "width",
          transitionDuration: holding ? `${holdMs}ms` : "250ms",
          transitionTimingFunction: holding ? "linear" : "ease-out",
        }}
        className="absolute inset-y-0 left-0 bg-primary"
      />
      <span className="relative flex items-center justify-center text-body">
        {children}
      </span>
    </button>
  );
}
