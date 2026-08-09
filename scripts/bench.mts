import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "../src/generated/prisma/client";
import { cacheEnabled, remember } from "../src/lib/cache";
import { DOWNLOAD_URL_TTL_SECONDS } from "../src/lib/storage/config";

const ROUNDS = 50;

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  }),
});

async function average(run: () => Promise<unknown>) {
  await run();
  await run();

  const started = performance.now();
  for (let round = 0; round < ROUNDS; round += 1) await run();

  return (performance.now() - started) / ROUNDS;
}

async function compare(label: string, run: () => Promise<unknown>) {
  const direct = await average(run);
  const cached = await average(() =>
    remember(`bench:${label}`, 60, async () => run()),
  );

  const verdict = !cacheEnabled
    ? "camada inerte"
    : cached < direct
      ? `cache ganha ${(direct / cached).toFixed(1)}×`
      : `cache perde ${(cached / direct).toFixed(1)}×`;

  console.log(
    `${label.padEnd(30)} direto ${direct.toFixed(3).padStart(7)} ms   cache ${cached.toFixed(3).padStart(7)} ms   ${verdict}`,
  );
}

console.log(
  cacheEnabled
    ? `Redis configurado em ${process.env.REDIS_URL}`
    : "REDIS_URL ausente: a camada está inerte e tudo cai no acesso direto.",
);
console.log(`Média de ${ROUNDS} execuções.\n`);

await compare("profile.findFirst", () =>
  prisma.profile.findFirst({ select: { avatarKey: true } }),
);

await compare("category.findMany", () =>
  prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { exercises: true } } },
  }),
);

await compare("routine.findFirst", () =>
  prisma.routine.findFirst({
    include: {
      slots: {
        orderBy: { position: "asc" },
        select: { id: true, type: true, workoutId: true },
      },
    },
  }),
);

const exercise = await prisma.exercise.findFirst({ select: { videoKey: true } });

if (exercise) {
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
  const { GetObjectCommand, S3Client } = await import("@aws-sdk/client-s3");

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  await compare("assinar URL do R2", () =>
    getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: exercise.videoKey,
      }),
      { expiresIn: DOWNLOAD_URL_TTL_SECONDS, signingDate: new Date(0) },
    ),
  );
} else {
  console.log("Nenhum exercício cadastrado: assinatura de URL não medida.");
}

await prisma.$disconnect();
process.exit(0);
