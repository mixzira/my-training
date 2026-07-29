"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { type ActionState, INITIAL_ACTION_STATE } from "@/lib/form";

export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel = "Excluir",
  action,
  hidden,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  hidden: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ACTION_STATE,
  );
  const [settledState, setSettledState] = useState(state);

  if (state !== settledState) {
    setSettledState(state);
    if (state.ok) onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-body text-ink-muted-80">{message}</p>

      <form action={formAction} className="flex flex-col gap-md">
        {Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

        <FormError>{state.error}</FormError>

        <div className="flex flex-wrap gap-sm">
          <Button
            type="submit"
            disabled={pending}
            className="bg-ink text-canvas"
          >
            {pending ? "Excluindo…" : confirmLabel}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={pending}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
