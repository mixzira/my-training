import {
  GetBucketCorsCommand,
  PutBucketCorsCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { ALLOWED_ORIGINS } from "../src/lib/storage/config.ts";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;

if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
  console.error(
    "Faltam variáveis do R2. Rode com: node --env-file=.env scripts/r2-cors.mts",
  );
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

const rules = [
  {
    AllowedOrigins: [...ALLOWED_ORIGINS],
    AllowedMethods: ["GET", "PUT", "HEAD"],
    AllowedHeaders: ["content-type"],
    ExposeHeaders: ["etag"],
    MaxAgeSeconds: 3600,
  },
];

try {
  await s3.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: { CORSRules: rules },
    }),
  );
} catch (error) {
  const name = (error as Error).name;

  if (name === "AccessDenied") {
    console.error(
      [
        `Sem permissão para configurar o bucket "${bucket}".`,
        "",
        "Configurar CORS exige um token R2 de Admin Read & Write. O token do",
        "app precisa apenas de Object Read & Write, então prefira colar a",
        "política abaixo no painel da Cloudflare, em:",
        "R2 > o bucket > Settings > CORS Policy",
        "",
        JSON.stringify(rules, null, 2),
      ].join("\n"),
    );
    process.exit(1);
  }

  throw error;
}

const applied = await s3.send(new GetBucketCorsCommand({ Bucket: bucket }));

console.log(`CORS aplicado no bucket "${bucket}":`);
console.log(JSON.stringify(applied.CORSRules, null, 2));
