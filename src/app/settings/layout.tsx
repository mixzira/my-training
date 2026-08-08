import type { ReactNode } from "react";

import { Header } from "@/components/ui/header";
import { TabNav, type Tab } from "@/components/ui/tab-nav";
import { Tile } from "@/components/ui/tile";

export const dynamic = "force-dynamic";

const TABS: Tab[] = [
  { href: "/settings", label: "Exercícios" },
  { href: "/settings/workouts", label: "Treinos" },
  { href: "/settings/routine", label: "Rotina" },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header title="Configurações" back="/" actions={false} />
      <Tile surface="parchment" className="pb-lg">
        <TabNav tabs={TABS} layoutId="settings-tab" />
        <div className="mt-xl">{children}</div>
      </Tile>
    </>
  );
}
