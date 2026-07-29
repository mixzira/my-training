"use client";

import { usePathname, useRouter } from "next/navigation";

import { BackIcon } from "@/components/icons";
import { useNavHistory } from "@/components/ui/nav-history";

function parentPath(pathname: string): string {
  const parent = pathname.slice(0, pathname.lastIndexOf("/"));
  return parent === "" ? "/" : parent;
}

export function BackButton({ to }: { to?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { getPreviousPath } = useNavHistory();

  function goBack() {
    const target = to ?? getPreviousPath() ?? parentPath(pathname);
    router.replace(target, { transitionTypes: ["nav-back"] });
  }

  return (
    <button
      type="button"
      aria-label="Voltar"
      onClick={goBack}
      className="flex size-touch items-center justify-center rounded-full text-on-dark transition-transform duration-150 active:scale-95"
    >
      <BackIcon />
    </button>
  );
}
