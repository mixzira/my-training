import { UPLOAD_FOLDERS } from "@/lib/storage/config";

export type FieldErrors = Record<string, string>;

export type ActionState = {
  error?: string;
  fieldErrors?: FieldErrors;
  warning?: string;
  ok?: boolean;
};

export const INITIAL_ACTION_STATE: ActionState = {};

export function fieldError(field: string, message: string): ActionState {
  return { fieldErrors: { [field]: message } };
}

export function parseText(
  value: FormDataEntryValue | null,
  maxLength = 80,
): string | null {
  if (typeof value !== "string") return null;

  const text = value.trim();
  if (text.length === 0 || text.length > maxLength) return null;

  return text;
}

const OBJECT_KEY_PATTERN = new RegExp(
  `^(${UPLOAD_FOLDERS.join("|")})/[0-9a-f-]{36}\\.[a-z0-9]{3,4}$`,
);

export function parseObjectKey(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;

  const key = value.trim();
  if (!OBJECT_KEY_PATTERN.test(key)) return null;

  return key;
}

export function parseOptionalObjectKey(
  value: FormDataEntryValue | null,
): string | null | undefined {
  if (typeof value !== "string") return undefined;
  if (value.trim().length === 0) return null;

  return parseObjectKey(value) ?? undefined;
}
