import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface-black text-on-dark">
      <div className="mx-auto flex min-h-nav w-full max-w-360 items-center justify-end p-4">
        <Link
          href="/profile"
          aria-label="Perfil"
          className="flex size-touch items-center justify-center rounded-full transition-transform duration-150 active:scale-95"
        >
          <Image
            src="/images/avatar.webp"
            alt=""
            width={48}
            height={48}
            className="size-10 rounded-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
