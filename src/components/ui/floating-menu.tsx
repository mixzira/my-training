import Link from "next/link";

import { HomeIcon } from "@/components/icons";

const ITEMS = [{ href: "/", label: "Home", Icon: HomeIcon }] as const;

export function FloatingMenu() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4">
      <nav
        aria-label="Navegação"
        className="pointer-events-auto rounded-pill bg-surface-tile-2 p-xs text-on-dark [view-transition-name:floating-menu]"
      >
        <ul className="flex items-center gap-xxs">
          {ITEMS.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                className="flex min-h-touch min-w-touch items-center justify-center rounded-pill transition-transform duration-150 active:scale-95"
              >
                <Icon />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
