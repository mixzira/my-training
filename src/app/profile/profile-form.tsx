"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/field";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { INITIAL_ACTION_STATE } from "@/lib/form";
import { IMAGE_CONTENT_TYPES } from "@/lib/storage/config";

import { saveProfile } from "./actions";

const ACCEPT = IMAGE_CONTENT_TYPES.join(",");

export type ProfileDraft = {
  nickname: string;
  avatarKey: string | null;
  heightCm: string;
  weightKg: string;
  birthDate: string;
};

export function ProfileForm({
  profile,
  onClose,
}: {
  profile?: ProfileDraft;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    saveProfile,
    INITIAL_ACTION_STATE,
  );
  useEffect(() => {
    if (state.ok) onClose();
  }, [state, onClose]);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-md">
      <Field label="Como quer ser chamado" error={state.fieldErrors?.nickname}>
        <Input
          name="nickname"
          defaultValue={profile?.nickname}
          placeholder="Mateus"
          maxLength={40}
          invalid={Boolean(state.fieldErrors?.nickname)}
        />
      </Field>

      <FileUploadField
        name="avatarKey"
        label="Foto"
        folder="profile"
        accept={ACCEPT}
        acceptedTypes={IMAGE_CONTENT_TYPES}
        hint="PNG, JPEG, WebP ou AVIF, até 8 MB."
        defaultKey={profile?.avatarKey ?? undefined}
        error={state.fieldErrors?.avatarKey}
      />

      <Field
        label="Altura (cm)"
        hint="Opcional."
        error={state.fieldErrors?.heightCm}
      >
        <Input
          name="heightCm"
          type="text"
          inputMode="numeric"
          defaultValue={profile?.heightCm}
          placeholder="178"
          maxLength={3}
          invalid={Boolean(state.fieldErrors?.heightCm)}
        />
      </Field>

      <Field
        label="Peso (kg)"
        hint="Opcional."
        error={state.fieldErrors?.weightKg}
      >
        <Input
          name="weightKg"
          type="text"
          inputMode="decimal"
          defaultValue={profile?.weightKg}
          placeholder="76,5"
          maxLength={6}
          invalid={Boolean(state.fieldErrors?.weightKg)}
        />
      </Field>

      <Field
        label="Data de nascimento"
        hint="Opcional. Usada para calcular sua idade."
        error={state.fieldErrors?.birthDate}
      >
        <Input
          name="birthDate"
          type="date"
          defaultValue={profile?.birthDate}
          invalid={Boolean(state.fieldErrors?.birthDate)}
        />
      </Field>

      <FormError>{state.error}</FormError>

      <div className="flex flex-wrap gap-sm">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar"}
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
  );
}
