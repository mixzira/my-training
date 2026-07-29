"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export const LONG_PRESS_MS = 700;

export function LongPressActions({
  actions,
  children,
}: {
  actions: ReactNode;
  children: ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickRef = useRef(false);

  function cancelTimer() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function startTimer(event: React.PointerEvent) {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    cancelTimer();
    timerRef.current = setTimeout(() => {
      suppressClickRef.current = true;
      setRevealed(true);
    }, LONG_PRESS_MS);
  }

  useEffect(() => cancelTimer, []);

  useEffect(() => {
    if (!revealed) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setRevealed(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setRevealed(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [revealed]);

  return (
    <div
      ref={containerRef}
      className="flex select-none items-stretch"
      onPointerDown={startTimer}
      onPointerUp={cancelTimer}
      onPointerLeave={cancelTimer}
      onPointerCancel={cancelTimer}
      onContextMenu={(event) => event.preventDefault()}
      onClickCapture={(event) => {
        if (!suppressClickRef.current) return;
        suppressClickRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div
        className={cn(
          "min-w-0 flex-1 origin-left transition-transform duration-300 ease-out",
          revealed && "scale-[0.96]",
        )}
      >
        {children}
      </div>

      <div
        aria-hidden={!revealed}
        className={cn(
          "flex shrink-0 items-center justify-end gap-xs overflow-hidden transition-all duration-300 ease-out",
          revealed
            ? "w-26 pl-xs opacity-100"
            : "pointer-events-none w-0 opacity-0",
        )}
      >
        {actions}
      </div>
    </div>
  );
}
