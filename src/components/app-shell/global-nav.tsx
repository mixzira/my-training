import Link from "next/link";

export function GlobalNav() {
  return (
    <header className="sticky top-0 z-50 bg-surface-black text-on-dark">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex h-nav max-w-[1440px] items-stretch justify-between px-lg lg:px-xl"
      >
        <Link
          href="/"
          className="flex items-center text-nav-link font-semibold tracking-tight"
        >
          my·training
        </Link>
      </nav>
    </header>
  );
}
