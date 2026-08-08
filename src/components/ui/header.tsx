import { HeaderBar } from "@/components/ui/header-bar";
import { prisma } from "@/lib/prisma";
import { createFileUrl } from "@/lib/storage";

export async function Header() {
  const profile = await prisma.profile.findFirst({
    select: { avatarKey: true },
  });

  const avatarUrl = profile?.avatarKey
    ? await createFileUrl(profile.avatarKey)
    : null;

  return <HeaderBar avatarUrl={avatarUrl} />;
}
