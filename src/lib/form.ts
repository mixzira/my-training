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

export function parseObjectKey(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;

  const key = value.trim();
  if (!/^(categories|exercises)\/[0-9a-f-]{36}\.[a-z0-9]{3,4}$/.test(key)) {
    return null;
  }

  return key;
}
