import { ButtonLink } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Tile } from "@/components/ui/tile";

export default function SettingsPage() {
  return (
    <>
      <Header />
      <Tile surface="parchment" className="pb-section">
        <ButtonLink href="/exercises">Exercícios</ButtonLink>
      </Tile>
    </>
  );
}
