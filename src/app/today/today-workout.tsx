"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useRef, useState, useTransition } from "react";

import { CloseIcon, EyeIcon, WeightIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Check } from "@/components/ui/check";
import { Field, Input } from "@/components/ui/field";
import { HoldButton } from "@/components/ui/hold-button";
import { LongPressActions } from "@/components/ui/long-press-actions";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";

import { saveTodaySession } from "./actions";

type InitialItem = {
  position: number;
  exerciseId: string;
  name: string;
  videoUrl: string;
  done: boolean;
  weight: number;
};

type Item = Omit<InitialItem, "weight"> & { weight: string };

function parseWeight(value: string): number {
  const parsed = parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function isValidWeight(value: string): boolean {
  const parsed = parseFloat(value.replace(",", "."));
  return value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0;
}

const ENTER = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.9,
} as const;

const EXIT = { duration: 0.2, ease: "easeIn" } as const;

const iconButton =
  "flex shrink-0 items-center justify-center rounded-full border border-hairline bg-canvas text-ink transition-transform duration-150 active:scale-95";

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
  const [weightIndex, setWeightIndex] = useState<number | null>(null);
  const [weightDraft, setWeightDraft] = useState("");
  const [weightError, setWeightError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewRatio, setPreviewRatio] = useState(1);
  const cardVideos = useRef(new Map<number, HTMLVideoElement>());
  const [, startTransition] = useTransition();

  const weightItem = weightIndex === null ? null : items[weightIndex];
  const previewItem = previewIndex === null ? null : items[previewIndex];

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

  function openPreview(index: number) {
    const card = cardVideos.current.get(index);
    if (card?.videoWidth && card.videoHeight) {
      setPreviewRatio(card.videoWidth / card.videoHeight);
    }
    setPreviewIndex(index);
  }

  function openWeight(index: number) {
    setWeightDraft(items[index].weight);
    setWeightError(null);
    setWeightIndex(index);
  }

  function closeWeight() {
    setWeightIndex(null);
    setWeightError(null);
  }

  function saveWeight() {
    if (weightIndex === null) return;

    if (!isValidWeight(weightDraft)) {
      setWeightError("Informe um peso em kg, usando apenas números.");
      return;
    }

    const next = items.map((item, i) =>
      i === weightIndex
        ? { ...item, weight: String(parseWeight(weightDraft)) }
        : item,
    );
    setItems(next);
    persist(next, false);
    closeWeight();
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
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-lg">
        <AnimatePresence mode="wait" initial={false}>
          {concluded ? (
            <motion.div
              key="concluded"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={ENTER}
              className="flex flex-col gap-lg"
            >
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
            </motion.div>
          ) : (
            <motion.div
              key="pending"
              exit={{ opacity: 0, scale: 0.94 }}
              transition={EXIT}
              className="flex flex-col gap-lg"
            >
              <div>
                <p className="text-caption text-ink-muted-48">Treino de hoje</p>
                <p className="text-lead text-ink">{workoutName}</p>
              </div>

              <ul className="flex flex-col gap-xs">
                {items.map((item, index) => (
                  <li key={`${item.position}-${item.exerciseId}`}>
                    <LongPressActions
                      actionsWidth="w-17.5"
                      actions={
                        <button
                          type="button"
                          aria-label={`Carga de ${item.name} em kg`}
                          onClick={() => openWeight(index)}
                          className={cn(iconButton, "size-15.5")}
                        >
                          <WeightIcon className="size-5" />
                        </button>
                      }
                    >
                      <div
                        className={cn(
                          "flex items-center gap-sm rounded-pill border border-hairline bg-canvas p-xs pl-md transition-opacity duration-150",
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

                        <button
                          type="button"
                          aria-label={`Ver execução de ${item.name}`}
                          onClick={() => openPreview(index)}
                          className="group relative size-touch shrink-0 overflow-hidden rounded-full transition-transform duration-150 active:scale-95"
                        >
                          <video
                            ref={(element) => {
                              if (element)
                                cardVideos.current.set(index, element);
                              else cardVideos.current.delete(index);
                            }}
                            src={`${item.videoUrl}#t=0.001`}
                            crossOrigin="anonymous"
                            muted
                            playsInline
                            preload="metadata"
                            className="size-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-surface-chip-translucent/64 text-ink opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-active:opacity-100">
                            <EyeIcon className="size-5" />
                          </span>
                        </button>
                      </div>
                    </LongPressActions>
                  </li>
                ))}
              </ul>

              <AnimatePresence>
                {allDone ? (
                  <motion.div
                    key="conclude"
                    initial={{ opacity: 0, scale: 0.88, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={ENTER}
                    className="flex flex-col gap-xxs"
                  >
                    <HoldButton holdMs={2000} onComplete={conclude}>
                      Concluir treino
                    </HoldButton>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {error ? (
          <p role="alert" className="text-caption text-danger">
            {error}
          </p>
        ) : null}

        {weightItem ? (
          <Modal open onClose={closeWeight} title={weightItem.name}>
            <Field
              label="Carga (kg)"
              error={weightError ?? undefined}
              htmlFor="weight"
            >
              <Input
                id="weight"
                type="text"
                inputMode="decimal"
                autoFocus
                value={weightDraft}
                invalid={Boolean(weightError)}
                onChange={(event) => {
                  setWeightDraft(event.target.value);
                  setWeightError(null);
                }}
              />
            </Field>

            <div className="flex justify-end gap-xs">
              <Button variant="tertiary" onClick={closeWeight}>
                Cancelar
              </Button>
              <Button onClick={saveWeight}>Salvar</Button>
            </div>
          </Modal>
        ) : null}

        {previewItem ? (
          <Modal bare open onClose={() => setPreviewIndex(null)}>
            <div className="flex justify-end">
              <button
                type="button"
                aria-label={`Fechar execução de ${previewItem.name}`}
                onClick={() => setPreviewIndex(null)}
                className={cn(iconButton, "size-touch")}
              >
                <CloseIcon className="size-5" />
              </button>
            </div>
            <video
              src={previewItem.videoUrl}
              crossOrigin="anonymous"
              autoPlay
              loop
              muted
              playsInline
              style={{ aspectRatio: previewRatio }}
              className="w-full rounded-md object-cover"
            />
            <span aria-hidden className="h-touch shrink-0" />
          </Modal>
        ) : null}
      </div>
    </MotionConfig>
  );
}
