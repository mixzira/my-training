"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type Tab = { href: string; label: string };

const SLIDE = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

const MotionLink = motion.create(Link);

export function TabNav({ tabs, layoutId }: { tabs: Tab[]; layoutId: string }) {
  const pathname = usePathname();

  const current = tabs.reduce((match, tab) =>
    pathname.startsWith(tab.href) && tab.href.length > match.href.length
      ? tab
      : match,
  );

  return (
    <MotionConfig reducedMotion="user">
      <nav aria-label="Seções">
        <ul className="flex flex-wrap justify-center gap-xxs">
          {tabs.map((tab) => (
            <li key={tab.href}>
              <MotionLink
                href={tab.href}
                aria-current={tab === current ? "page" : undefined}
                whileTap={{ scale: 0.95 }}
                transition={SLIDE}
                className="relative flex min-h-touch items-center justify-center rounded-pill px-lg text-body text-ink"
              >
                {tab === current ? (
                  <motion.span
                    layoutId={layoutId}
                    transition={SLIDE}
                    className="absolute inset-0 rounded-pill border border-hairline bg-canvas"
                  />
                ) : null}

                <span className="relative">{tab.label}</span>
              </MotionLink>
            </li>
          ))}
        </ul>
      </nav>
    </MotionConfig>
  );
}
