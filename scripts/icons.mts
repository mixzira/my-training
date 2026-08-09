import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const SOURCE = "public/icon-source.png";

const BACKGROUND = { r: 0, g: 0, b: 0, alpha: 1 };

const MASKABLE_SAFE_RATIO = 0.8;

const targets = [
  { out: "public/icons/icon-192.png", size: 192 },
  { out: "public/icons/icon-512.png", size: 512 },
  { out: "src/app/icon.png", size: 192 },
  { out: "src/app/apple-icon.png", size: 180 },
];

const source = sharp(SOURCE);

const meta = await source.metadata().catch(() => null);

if (!meta) {
  console.error(
    [
      `Arquivo de origem não encontrado: ${SOURCE}`,
      "",
      "Coloque um PNG quadrado de 1024×1024, sem cantos arredondados e sem",
      "margem transparente, nesse caminho e rode de novo.",
    ].join("\n"),
  );
  process.exit(1);
}

if (meta.width !== meta.height) {
  console.error(
    `A origem precisa ser quadrada. ${SOURCE} tem ${meta.width}×${meta.height}.`,
  );
  process.exit(1);
}

if ((meta.width ?? 0) < 512) {
  console.error(
    `A origem precisa ter ao menos 512px de lado. ${SOURCE} tem ${meta.width}.`,
  );
  process.exit(1);
}

async function write(out: string, image: sharp.Sharp) {
  await mkdir(path.dirname(out), { recursive: true });
  await image.png().toFile(out);
  console.log(`  ${out}`);
}

console.log(`Gerando ícones a partir de ${SOURCE} (${meta.width}px):`);

for (const { out, size } of targets) {
  await write(
    out,
    sharp(SOURCE).resize(size, size, { fit: "cover", background: BACKGROUND }),
  );
}

const maskableSize = 512;
const inner = Math.round(maskableSize * MASKABLE_SAFE_RATIO);
const padding = Math.round((maskableSize - inner) / 2);

await write(
  "public/icons/icon-maskable-512.png",
  sharp(SOURCE)
    .resize(inner, inner, { fit: "cover" })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: BACKGROUND,
    }),
);
