"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ExercisesIcon, HomeIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/", label: "Início", Icon: HomeIcon },
  { href: "/today", label: "Hoje", Icon: ExercisesIcon },
] as const;

const HOVER = { type: "spring", stiffness: 320, damping: 22, mass: 0.7 } as const;

const SLIDE = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

const HIDDEN_ROUTES = ["/settings", "/profile"];

const MotionLink = motion.create(Link);

export function FloatingMenu() {
  const pathname = usePathname();

  const hidden = HIDDEN_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[calc(env(safe-area-inset-bottom)+--spacing(4))]",
          hidden && "invisible",
        )}
      >
        <nav
          aria-label="Navegação"
          className="pointer-events-auto rounded-pill bg-surface-tile-2 p-xs text-on-dark [view-transition-name:floating-menu]"
        >
          <ul className="flex items-center gap-xxs">
            {ITEMS.map(({ href, label, Icon }) => (
              <li key={href}>
                <MotionLink
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  whileHover={{ scale: 1.08, y: -6 }}
                  whileTap={{ scale: 0.95 }}
                  transition={HOVER}
                  className={cn(
                    "relative flex min-h-touch min-w-touch flex-col items-center justify-center gap-xxs rounded-pill px-lg py-sm",
                    pathname === href && "text-primary-on-dark",
                  )}
                >
                  {pathname === href ? (
                    <motion.span
                      layoutId="nav-active"
                      transition={SLIDE}
                      className="absolute inset-0 rounded-pill bg-on-dark/10"
                    />
                  ) : null}

                  <Icon className="relative" />
                  <span className="relative text-nav-link">{label}</span>
                </MotionLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </MotionConfig>
  );
}
