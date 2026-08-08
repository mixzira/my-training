"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

import { SettingsIcon } from "@/components/icons";
import { BackButton } from "@/components/ui/back-button";

const ROOT_ROUTES = new Set(["/"]);

const FALLBACK_AVATAR = "/images/avatar.webp";

export function HeaderBar({
  back,
  title,
  avatarUrl,
}: {
  back?: boolean | string;
  title: string;
  avatarUrl: string | null;
}) {
  const pathname = usePathname();
  const showBack =
    back === undefined ? !ROOT_ROUTES.has(pathname) : back !== false;

  return (
    <header className="sticky top-0 z-40 bg-surface-black text-on-dark [view-transition-name:app-header]">
      <div className="mx-auto flex min-h-nav w-full max-w-360 items-center justify-between gap-sm p-4">
        <div className="flex min-w-0 flex-1 items-center gap-xs">
          {showBack ? (
            <ViewTransition
              name="back-button"
              enter="back-enter"
              exit="back-exit"
              default="none"
            >
              <BackButton to={typeof back === "string" ? back : undefined} />
            </ViewTransition>
          ) : null}

          <p className="min-w-0 truncate text-3xl font-bold">{title}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/settings"
            aria-label="Configurações"
            className="flex size-touch items-center justify-center rounded-full text-on-dark/30 transition-transform duration-150 active:scale-95"
          >
            <SettingsIcon className="size-8" />
          </Link>
          <Link
            href="/profile"
            aria-label="Perfil"
            className="flex min-h-touch min-w-touch items-center justify-center rounded-full border border-on-dark/20 bg-on-dark/10 p-xs transition-transform duration-150 active:scale-95"
          >
            <Image
              src={avatarUrl ?? FALLBACK_AVATAR}
              alt=""
              width={48}
              height={48}
              className="size-10 shrink-0 rounded-full object-cover"
              unoptimized
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
