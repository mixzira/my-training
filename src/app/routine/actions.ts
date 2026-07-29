"use server";

import { revalidatePath } from "next/cache";

import { type ActionState, fieldError, parseText } from "@/lib/form";
import { prisma } from "@/lib/prisma";

const NAME_REQUIRED = "Informe um nome de até 80 caracteres.";
const SLOTS_REQUIRED = "Adicione pelo menos um slot à fila.";
const BAD_SLOTS = "Não foi possível ler a fila. Recarregue a página e tente de novo.";
const STALE_WORKOUT =
  "Um dos treinos selecionados não existe mais. Recarregue a página e tente de novo.";
const DATE_REQUIRED = "Informe uma data de início válida.";

type SlotInput = { id?: string; type: "WORKOUT" | "REST"; workoutId?: string };

function parseStartDate(value: FormDataEntryValue | null): Date | null {
  if (typeof value !== "string") return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function parseSlots(formData: FormData): SlotInput[] | null {
  const slots: SlotInput[] = [];

  for (const value of formData.getAll("slots")) {
    if (typeof value !== "string") return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch {
      return null;
    }

    if (typeof parsed !== "object" || parsed === null) return null;
    const obj = parsed as Record<string, unknown>;

    if (obj.type !== "WORKOUT" && obj.type !== "REST") return null;
    const id = typeof obj.id === "string" ? obj.id : undefined;
    const workoutId = typeof obj.workoutId === "string" ? obj.workoutId : undefined;
    if (obj.type === "WORKOUT" && !workoutId) return null;

    slots.push({
      id,
      type: obj.type,
      workoutId: obj.type === "WORKOUT" ? workoutId : undefined,
    });
  }

  return slots;
}

async function workoutsExist(ids: string[]): Promise<boolean> {
  const unique = [...new Set(ids)];
  if (unique.length === 0) return true;

  const found = await prisma.workout.findMany({
    where: { id: { in: unique } },
    select: { id: true },
  });

  return found.length === unique.length;
}

export async function createRoutine(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = parseText(formData.get("name"));
  if (name === null) return fieldError("name", NAME_REQUIRED);

  const startDate = parseStartDate(formData.get("startDate"));
  if (startDate === null) return fieldError("startDate", DATE_REQUIRED);

  const slots = parseSlots(formData);
  if (slots === null) return { error: BAD_SLOTS };
  if (slots.length === 0) return fieldError("slots", SLOTS_REQUIRED);

  const workoutIds = slots
    .filter((slot) => slot.type === "WORKOUT")
    .map((slot) => slot.workoutId as string);
  if (!(await workoutsExist(workoutIds))) return { error: STALE_WORKOUT };

  const existing = await prisma.routine.findFirst({ select: { id: true } });
  if (existing) {
    return { error: "Já existe uma rotina. Edite ou exclua a atual." };
  }

  const routine = await prisma.routine.create({
    data: {
      name,
      startDate,
      slots: {
        create: slots.map((slot, position) => ({
          position,
          type: slot.type,
          workoutId: slot.workoutId ?? null,
        })),
      },
    },
    include: { slots: { orderBy: { position: "asc" }, select: { id: true } } },
  });

  const firstSlotId = routine.slots[0]?.id;
  if (firstSlotId) {
    await prisma.routine.update({
      where: { id: routine.id },
      data: { currentSlotId: firstSlotId, currentSince: startDate },
    });
  }

  revalidatePath("/routine");

  return { ok: true };
}

export async function updateRoutine(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = parseText(formData.get("id"), 40);
  if (id === null) return { error: "Rotina inválida." };

  const name = parseText(formData.get("name"));
  if (name === null) return fieldError("name", NAME_REQUIRED);

  const startDate = parseStartDate(formData.get("startDate"));
  if (startDate === null) return fieldError("startDate", DATE_REQUIRED);

  const slots = parseSlots(formData);
  if (slots === null) return { error: BAD_SLOTS };
  if (slots.length === 0) return fieldError("slots", SLOTS_REQUIRED);

  const workoutIds = slots
    .filter((slot) => slot.type === "WORKOUT")
    .map((slot) => slot.workoutId as string);
  if (!(await workoutsExist(workoutIds))) return { error: STALE_WORKOUT };

  const current = await prisma.routine.findUnique({
    where: { id },
    include: { slots: { orderBy: { position: "asc" }, select: { id: true } } },
  });
  if (!current) return { error: "Rotina não encontrada." };

  const existingIds = new Set(current.slots.map((slot) => slot.id));
  const keepIds = new Set(
    slots
      .map((slot) => slot.id)
      .filter((slotId): slotId is string => Boolean(slotId) && existingIds.has(slotId!)),
  );

  const oldOrder = current.slots.map((slot) => slot.id);
  const currentId = current.currentSlotId;

  let fallbackCurrent: string | null = null;
  if (currentId && !keepIds.has(currentId)) {
    const from = oldOrder.indexOf(currentId);
    if (from !== -1) {
      for (let offset = 1; offset <= oldOrder.length; offset++) {
        const candidate = oldOrder[(from + offset) % oldOrder.length];
        if (keepIds.has(candidate)) {
          fallbackCurrent = candidate;
          break;
        }
      }
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.routineSlot.deleteMany({
      where: { routineId: id, id: { notIn: [...keepIds] } },
    });

    for (const [position, slot] of slots.entries()) {
      if (slot.id && keepIds.has(slot.id)) {
        await tx.routineSlot.update({ where: { id: slot.id }, data: { position } });
      } else {
        await tx.routineSlot.create({
          data: {
            routineId: id,
            position,
            type: slot.type,
            workoutId: slot.workoutId ?? null,
          },
        });
      }
    }

    const currentSurvives = Boolean(currentId && keepIds.has(currentId));
    let nextCurrentId: string | null;

    if (currentSurvives) {
      nextCurrentId = currentId;
    } else if (fallbackCurrent) {
      nextCurrentId = fallbackCurrent;
    } else {
      const first = await tx.routineSlot.findFirst({
        where: { routineId: id },
        orderBy: { position: "asc" },
        select: { id: true },
      });
      nextCurrentId = first?.id ?? null;
    }

    await tx.routine.update({
      where: { id },
      data: {
        name,
        startDate,
        currentSlotId: nextCurrentId,
        ...(currentSurvives ? {} : { currentSince: startDate }),
      },
    });
  });

  revalidatePath("/routine");

  return { ok: true };
}

export async function deleteRoutine(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = parseText(formData.get("id"), 40);
  if (id === null) return { error: "Rotina inválida." };

  const routine = await prisma.routine.findUnique({ where: { id } });
  if (!routine) return { error: "Rotina não encontrada." };

  await prisma.routine.update({ where: { id }, data: { currentSlotId: null } });
  await prisma.routine.delete({ where: { id } });

  revalidatePath("/routine");

  return { ok: true };
}
