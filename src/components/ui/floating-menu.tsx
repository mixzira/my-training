"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";

import { HomeIcon } from "@/components/icons";

const ITEMS = [{ href: "/", label: "Início", Icon: HomeIcon }] as const;

const HOVER = { type: "spring", stiffness: 320, damping: 22, mass: 0.7 } as const;

export function FloatingMenu() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4">
        <motion.nav
          aria-label="Navegação"
          whileHover={{ scale: 1.05, y: -6 }}
          transition={HOVER}
          className="pointer-events-auto rounded-pill bg-surface-tile-2 p-xs text-on-dark [view-transition-name:floating-menu]"
        >
          <ul className="flex items-center gap-xxs">
            {ITEMS.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex min-h-touch min-w-touch flex-col items-center justify-center gap-xxs rounded-pill px-sm transition-transform duration-150 active:scale-95"
                >
                  <Icon />
                  <span className="text-nav-link">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </MotionConfig>
  );
}
