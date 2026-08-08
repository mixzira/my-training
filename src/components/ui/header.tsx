import { HeaderBar } from "@/components/ui/header-bar";
import { prisma } from "@/lib/prisma";
import { createFileUrl } from "@/lib/storage";

export async function Header({
  back,
  title,
}: {
  back?: boolean | string;
  title: string;
}) {
  const profile = await prisma.profile.findFirst({
    select: { avatarKey: true },
  });

  const avatarUrl = profile?.avatarKey
    ? await createFileUrl(profile.avatarKey)
    : null;

  return <HeaderBar back={back} title={title} avatarUrl={avatarUrl} />;
}
