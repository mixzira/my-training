import { Tile } from "@/components/ui/tile";

export default function OfflinePage() {
  return (
    <Tile surface="parchment" className="pb-section">
      <p className="max-w-[36ch] text-body text-ink-muted-80">
        Você está sem conexão. O treino de hoje precisa de rede para carregar —
        tente de novo quando o sinal voltar.
      </p>
    </Tile>
  );
}
