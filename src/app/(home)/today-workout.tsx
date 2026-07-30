"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Check } from "@/components/ui/check";
import { HoldButton } from "@/components/ui/hold-button";
import { cn } from "@/lib/cn";

import { saveTodaySession } from "./actions";

type InitialItem = {
  position: number;
  exerciseId: string;
  name: string;
  done: boolean;
  weight: number;
};

type Item = Omit<InitialItem, "weight"> & { weight: string };

function parseWeight(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function TodayWorkout({
  workoutName,
  workoutId,
  date,
  completed,
  initialItems,
}: {
  workoutName: string;
  workoutId: string;
  date: string;
  completed: boolean;
  initialItems: InitialItem[];
}) {
  const [items, setItems] = useState<Item[]>(() =>
    initialItems.map((item) => ({ ...item, weight: String(item.weight) })),
  );
  const [concluded, setConcluded] = useState(completed);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const allDone = items.length > 0 && items.every((item) => item.done);

  function persist(next: Item[], asCompleted: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await saveTodaySession({
        workoutId,
        date,
        completed: asCompleted,
        items: next.map((item) => ({
          position: item.position,
          exerciseId: item.exerciseId,
          done: item.done,
          weight: parseWeight(item.weight),
        })),
      });
      if (!result.ok) {
        setError(result.error ?? "Não foi possível salvar. Tente de novo.");
      }
    });
  }

  function toggle(index: number) {
    const next = items.map((item, i) =>
      i === index ? { ...item, done: !item.done } : item,
    );
    setItems(next);
    persist(next, false);
  }

  function changeWeight(index: number, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, weight: value } : item)),
    );
  }

  function commitWeight(index: number) {
    const next = items.map((item, i) =>
      i === index ? { ...item, weight: String(parseWeight(item.weight)) } : item,
    );
    setItems(next);
    persist(next, false);
  }

  function conclude() {
    setConcluded(true);
    persist(items, true);
  }

  function reopen() {
    setConcluded(false);
    persist(items, false);
  }

  return (
    <div className="mt-lg flex flex-col gap-lg">
      <div>
        <p className="text-caption text-ink-muted-48">Treino de hoje</p>
        <p className="text-lead text-ink">{workoutName}</p>
      </div>

      {concluded ? (
        <>
          <div className="flex flex-col items-start gap-sm rounded-lg border border-hairline bg-canvas p-lg">
            <p className="text-body-strong text-ink">
              Parabéns, o de hoje está pago! 🎉
            </p>
            <p className="text-body text-ink-muted-80">
              Que tal registrar o progresso com uma foto?
            </p>
            <Button>Adicionar foto</Button>
          </div>
          <Button variant="tertiary" onClick={reopen}>
            Reabrir treino
          </Button>
        </>
      ) : (
        <>
          <ul className="flex flex-col gap-xs">
            {items.map((item, index) => (
              <li
                key={`${item.position}-${item.exerciseId}`}
                className={cn(
                  "flex items-center gap-sm rounded-lg border border-hairline bg-canvas p-md transition-opacity duration-150",
                  item.done && "opacity-60",
                )}
              >
                <Check
                  checked={item.done}
                  onChange={() => toggle(index)}
                  className="min-w-0 flex-1"
                >
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-body text-ink",
                      item.done && "line-through",
                    )}
                  >
                    {item.name}
                  </span>
                </Check>

                <div className="flex shrink-0 items-center gap-xxs">
                  <input
                    type="number"
                    min={0}
                    step="0.5"
                    inputMode="decimal"
                    value={item.weight}
                    onChange={(event) => changeWeight(index, event.target.value)}
                    onBlur={() => commitWeight(index)}
                    aria-label={`Carga de ${item.name} em kg`}
                    className="h-touch w-20 rounded-md border border-hairline bg-canvas px-sm text-right text-body text-ink"
                  />
                  <span className="text-caption text-ink-muted-48">kg</span>
                </div>
              </li>
            ))}
          </ul>

          {allDone ? (
            <div className="flex flex-col gap-xxs">
              <HoldButton holdMs={2000} onComplete={conclude}>
                Concluir treino
              </HoldButton>
            </div>
          ) : null}
        </>
      )}

      {error ? (
        <p role="alert" className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
