export type ActionState = {
  error?: string;
  ok?: boolean;
};

export const INITIAL_ACTION_STATE: ActionState = {};

export function parseText(
  value: FormDataEntryValue | null,
  maxLength = 80,
): string | null {
  if (typeof value !== "string") return null;

  const text = value.trim();
  if (text.length === 0 || text.length > maxLength) return null;

  return text;
}

export function parseUrl(value: FormDataEntryValue | null): string | null {
  const text = parseText(value, 2048);
  if (text === null) return null;

  try {
    const { protocol } = new URL(text);
    return protocol === "https:" || protocol === "http:" ? text : null;
  } catch {
    return null;
  }
}
