"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

import { SettingsIcon } from "@/components/icons";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/cn";

const ROOT_ROUTES = new Set(["/", "/exercises"]);

export function Header({ back }: { back?: boolean | string }) {
  const pathname = usePathname();
  const showBack =
    back === undefined ? !ROOT_ROUTES.has(pathname) : back !== false;

  return (
    <header className="sticky top-0 z-40 bg-surface-black text-on-dark [view-transition-name:app-header]">
      <div
        className={cn(
          "mx-auto flex min-h-nav w-full max-w-360 items-center p-4",
          showBack ? "justify-between" : "justify-end",
        )}
      >
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

        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            aria-label="Configurações"
            className="flex size-touch text-white/30 items-center justify-center rounded-full transition-transform duration-150 active:scale-95"
          >
            <SettingsIcon className="size-8" />
          </Link>
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
      </div>
    </header>
  );
}
