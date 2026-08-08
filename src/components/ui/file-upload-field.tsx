"use client";

import { useId, useState } from "react";

import { requestUpload } from "@/app/settings/upload-actions";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import type { UploadFolder } from "@/lib/storage/config";

type Status =
  | { phase: "idle" }
  | { phase: "uploading"; fileName: string }
  | { phase: "done"; fileName: string }
  | { phase: "error"; message: string };

function formatBytes(bytes: number) {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

function describeTypes(types: readonly string[]) {
  return types
    .map((type) => type.split("/")[1]?.toUpperCase() ?? type)
    .join(", ");
}

export function FileUploadField({
  name,
  label,
  folder,
  accept,
  acceptedTypes,
  hint,
  defaultKey,
  error,
}: {
  name: string;
  label: string;
  folder: UploadFolder;
  accept: string;
  acceptedTypes: readonly string[];
  hint: string;
  defaultKey?: string;
  error?: string;
}) {
  const inputId = useId();
  const [key, setKey] = useState(defaultKey ?? "");
  const [status, setStatus] = useState<Status>({ phase: "idle" });

  async function upload(file: File) {
    if (!acceptedTypes.includes(file.type)) {
      setKey("");
      setStatus({
        phase: "error",
        message: `Formato não aceito${file.type ? `: ${file.type}` : ""}. Envie ${describeTypes(acceptedTypes)}.`,
      });
      return;
    }

    setStatus({ phase: "uploading", fileName: file.name });

    const ticket = await requestUpload(folder, file.type);

    if (!ticket.ok) {
      setKey("");
      setStatus({ phase: "error", message: ticket.error });
      return;
    }

    if (file.size > ticket.maxBytes) {
      setKey("");
      setStatus({
        phase: "error",
        message: `Arquivo de ${formatBytes(file.size)} excede o limite de ${formatBytes(ticket.maxBytes)}.`,
      });
      return;
    }

    const response = await fetch(ticket.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "content-type": file.type },
    }).catch(() => null);

    if (!response) {
      setKey("");
      setStatus({
        phase: "error",
        message:
          "Não foi possível alcançar o armazenamento. Verifique sua conexão e a política de CORS do bucket.",
      });
      return;
    }

    if (!response.ok) {
      setKey("");
      setStatus({
        phase: "error",
        message: `O armazenamento recusou o arquivo (HTTP ${response.status}).`,
      });
      return;
    }

    setKey(ticket.key);
    setStatus({ phase: "done", fileName: file.name });
  }

  const localError = status.phase === "error" ? status.message : undefined;
  const shownError = localError ?? error;
  const invalid = Boolean(shownError);

  const statusHint =
    status.phase === "uploading"
      ? `Enviando ${status.fileName}…`
      : status.phase === "done"
        ? status.fileName
        : key
          ? "Arquivo atual mantido."
          : hint;

  return (
    <Field label={label} hint={statusHint} error={shownError} htmlFor={inputId}>
      <input type="hidden" name={name} value={key} />

      <input
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        aria-invalid={invalid || undefined}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      <label
        htmlFor={inputId}
        className={cn(
          "flex min-h-touch cursor-pointer items-center justify-center rounded-pill border bg-canvas px-lg text-caption",
          "transition-transform duration-150 active:scale-95",
          invalid ? "border-danger text-danger" : "border-hairline text-ink-muted-80",
        )}
      >
        {status.phase === "uploading"
          ? "Enviando…"
          : key
            ? "Trocar arquivo"
            : "Escolher arquivo"}
      </label>
    </Field>
  );
}
