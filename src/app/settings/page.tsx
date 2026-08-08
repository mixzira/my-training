import { ButtonLink } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Tile } from "@/components/ui/tile";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <>
      <Header />
      <Tile surface="parchment" className="pb-section">
        <div className="flex flex-wrap gap-sm">
          <ButtonLink href="/exercises">Exercícios</ButtonLink>
          <ButtonLink href="/workouts">Treinos</ButtonLink>
          <ButtonLink href="/routine">Rotina</ButtonLink>
        </div>
      </Tile>
    </>
  );
}
