import { Header } from "@/components/ui/header";
import { Tile } from "@/components/ui/tile";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Header title="Início" />
      <Tile surface="parchment" className="pb-section" />
    </>
  );
}
