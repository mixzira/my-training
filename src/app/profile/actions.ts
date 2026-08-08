"use server";

import { revalidatePath } from "next/cache";

import {
  type ActionState,
  fieldError,
  parseOptionalObjectKey,
  parseText,
} from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { StorageValidationError, confirmUpload, deleteFile } from "@/lib/storage";

const NICKNAME_REQUIRED = "Informe como você quer ser chamado, até 40 caracteres.";
const AVATAR_INVALID = "Não foi possível ler a foto enviada. Envie o arquivo de novo.";
const HEIGHT_INVALID = "Informe a altura em centímetros, entre 50 e 300. Deixe vazio para não registrar.";
const WEIGHT_INVALID = "Informe o peso em quilos, entre 20 e 500. Deixe vazio para não registrar.";
const BIRTH_DATE_INVALID = "Informe uma data de nascimento válida, a partir de 1900 e não futura.";

const MIN_HEIGHT_CM = 50;
const MAX_HEIGHT_CM = 300;
const MIN_WEIGHT_KG = 20;
const MAX_WEIGHT_KG = 500;
const MIN_BIRTH_YEAR = 1900;

async function discardKeys(keys: string[]): Promise<string | undefined> {
  const results = await Promise.allSettled(keys.map((key) => deleteFile(key)));
  const failed = results.filter((result) => result.status === "rejected").length;

  if (failed === 0) return undefined;

  return `${failed} arquivo(s) não puderam ser apagados do R2.`;
}

function storageFieldError(field: string, error: unknown): ActionState {
  return fieldError(
    field,
    error instanceof StorageValidationError
      ? error.message
      : "Não foi possível validar o arquivo enviado.",
  );
}

function parseHeight(
  value: FormDataEntryValue | null,
): number | null | undefined {
  if (typeof value !== "string") return undefined;

  const text = value.trim();
  if (text.length === 0) return null;
  if (!/^\d+$/.test(text)) return undefined;

  const height = Number(text);
  if (height < MIN_HEIGHT_CM || height > MAX_HEIGHT_CM) return undefined;

  return height;
}

function parseWeight(
  value: FormDataEntryValue | null,
): number | null | undefined {
  if (typeof value !== "string") return undefined;

  const text = value.trim();
  if (text.length === 0) return null;

  const weight = Number(text.replace(",", "."));
  if (!Number.isFinite(weight)) return undefined;
  if (weight < MIN_WEIGHT_KG || weight > MAX_WEIGHT_KG) return undefined;

  return Math.round(weight * 10) / 10;
}

function parseBirthDate(
  value: FormDataEntryValue | null,
): Date | null | undefined {
  if (typeof value !== "string") return undefined;

  const text = value.trim();
  if (text.length === 0) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  if (year < MIN_BIRTH_YEAR) return undefined;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date.getTime() > today.getTime()) return undefined;

  return date;
}

export async function saveProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const nickname = parseText(formData.get("nickname"), 40);
  if (nickname === null) return fieldError("nickname", NICKNAME_REQUIRED);

  const avatarKey = parseOptionalObjectKey(formData.get("avatarKey"));
  if (avatarKey === undefined) return fieldError("avatarKey", AVATAR_INVALID);

  const heightCm = parseHeight(formData.get("heightCm"));
  if (heightCm === undefined) return fieldError("heightCm", HEIGHT_INVALID);

  const weightKg = parseWeight(formData.get("weightKg"));
  if (weightKg === undefined) return fieldError("weightKg", WEIGHT_INVALID);

  const birthDate = parseBirthDate(formData.get("birthDate"));
  if (birthDate === undefined) return fieldError("birthDate", BIRTH_DATE_INVALID);

  const current = await prisma.profile.findFirst();
  const avatarChanged = avatarKey !== (current?.avatarKey ?? null);

  if (avatarChanged && avatarKey !== null) {
    try {
      await confirmUpload(avatarKey);
    } catch (error) {
      return storageFieldError("avatarKey", error);
    }
  }

  const data = { nickname, avatarKey, heightCm, weightKg, birthDate };

  if (current) {
    await prisma.profile.update({ where: { id: current.id }, data });
  } else {
    await prisma.profile.create({ data });
  }

  const warning =
    avatarChanged && current?.avatarKey
      ? await discardKeys([current.avatarKey])
      : undefined;

  revalidatePath("/", "layout");

  return { ok: true, warning };
}
