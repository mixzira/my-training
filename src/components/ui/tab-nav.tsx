"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

export type Tab = { href: string; label: string };

const TAP = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

const MotionLink = motion.create(Link);

export function TabNav({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  const current = tabs.reduce((match, tab) =>
    pathname.startsWith(tab.href) && tab.href.length > match.href.length
      ? tab
      : match,
  );

  return (
    <MotionConfig reducedMotion="user">
      <nav aria-label="Seções">
        <ul className="flex justify-center-safe gap-xxs overflow-x-auto overscroll-x-contain scrollbar-none">
          {tabs.map((tab) => (
            <li key={tab.href} className="shrink-0">
              <MotionLink
                href={tab.href}
                aria-current={tab === current ? "page" : undefined}
                whileTap={{ scale: 0.95 }}
                transition={TAP}
                className={cn(
                  "flex min-h-touch items-center justify-center rounded-pill border border-hairline px-lg text-body font-bold",
                  tab === current
                    ? "bg-white text-black"
                    : "bg-canvas/40 text-ink-muted-80",
                )}
              >
                {tab.label}
              </MotionLink>
            </li>
          ))}
        </ul>
      </nav>
    </MotionConfig>
  );
}
