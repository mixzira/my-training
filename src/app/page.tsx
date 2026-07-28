import { SubNav } from "@/components/app-shell/sub-nav";
import { Tile } from "@/components/ui/tile";

export default function HomePage() {
  return (
    <>
      <SubNav title="my·training" />
      <Tile surface="parchment">
        <h2 className="text-display-md font-display">Base pronta.</h2>
      </Tile>
    </>
  );
}
