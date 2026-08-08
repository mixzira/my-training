import Image from "next/image";

import { Tile } from "@/components/ui/tile";
import { prisma } from "@/lib/prisma";
import { createFileUrl } from "@/lib/storage";

import { EditProfile } from "./edit-profile";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("pt-BR");

const numberFormat = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

const FALLBACK_AVATAR = "/images/avatar.webp";

const EMPTY = "—";

function toDateInput(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function ageFrom(birthDate: Date, now: Date): number {
  let age = now.getFullYear() - birthDate.getFullYear();
  const month = now.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-md rounded-pill border border-hairline bg-canvas p-lg">
      <span className="text-caption text-ink-muted-48">{label}</span>
      <span data-numeric className="text-body-strong text-ink">
        {value}
      </span>
    </li>
  );
}

export default async function ProfilePage() {
  const profile = await prisma.profile.findFirst();

  const avatarUrl = profile?.avatarKey
    ? await createFileUrl(profile.avatarKey)
    : null;

  const now = new Date();

  return (
    <>
      <Tile surface="parchment" className="pb-section">
        {!profile ? (
          <>
            <p className="max-w-[36ch] text-body text-ink-muted-80">
              Nenhum perfil ainda. Diga como você quer ser chamado para começar.
            </p>
            <div className="mt-lg">
              <EditProfile />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-lg">
            <div className="flex flex-col items-center gap-sm">
              <Image
                src={avatarUrl ?? FALLBACK_AVATAR}
                alt=""
                width={160}
                height={160}
                className="size-28 shrink-0 rounded-full bg-canvas object-cover"
                unoptimized
              />
              <p className="max-w-full truncate text-lead text-ink font-bold">
                {profile.nickname}
              </p>
            </div>

            <ul className="flex flex-col gap-xs">
              <Stat
                label="Altura"
                value={
                  profile.heightCm === null
                    ? EMPTY
                    : `${numberFormat.format(profile.heightCm)} cm`
                }
              />
              <Stat
                label="Peso"
                value={
                  profile.weightKg === null
                    ? EMPTY
                    : `${numberFormat.format(profile.weightKg)} kg`
                }
              />
              <Stat
                label="Idade"
                value={
                  profile.birthDate === null
                    ? EMPTY
                    : `${ageFrom(profile.birthDate, now)} anos · ${dateFormat.format(profile.birthDate)}`
                }
              />
            </ul>

            <div className="flex flex-wrap justify-center gap-sm">
              <EditProfile
                profile={{
                  nickname: profile.nickname,
                  avatarKey: profile.avatarKey,
                  heightCm:
                    profile.heightCm === null ? "" : String(profile.heightCm),
                  weightKg:
                    profile.weightKg === null
                      ? ""
                      : String(profile.weightKg).replace(".", ","),
                  birthDate:
                    profile.birthDate === null
                      ? ""
                      : toDateInput(profile.birthDate),
                }}
              />
            </div>
          </div>
        )}
      </Tile>
    </>
  );
}
