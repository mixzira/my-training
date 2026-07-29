"use client";

import { GlassCard } from "@developer-hub/liquid-glass";
import Link from "next/link";

import { ExercisesIcon, HomeIcon } from "@/components/icons";

const ITEMS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/exercises", label: "Exercícios", Icon: ExercisesIcon },
] as const;

export function FloatingMenu() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4">
      <nav aria-label="Navegação" className="pointer-events-auto">
        <GlassCard cornerRadius={999} padding="6px" shadowMode>
          <ul className="flex items-center gap-xxs">
            {ITEMS.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  className="flex min-h-touch min-w-touch items-center justify-center rounded-pill text-ink transition-transform duration-150 active:scale-95"
                >
                  <Icon />
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      </nav>
    </div>
  );
}
