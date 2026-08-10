// Otimização de assets — Onda 2 (maior ROI contra o drop-off de 41%).
// Converte os PNGs pesados (~23MB) para AVIF+WebP redimensionados e gera
// blurDataURL (base64) para placeholder blur. Uso: `node scripts/optimize-assets.mjs`.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(root, "..", "public", "_assets-raw");
const OUT = path.join(root, "..", "public", "img");
const BLUR_TS = path.join(root, "..", "src", "lib", "blur.ts");

/**
 * jobs: cada asset → largura-alvo, se tem alpha, e qualidades.
 * Backgrounds fotográficos: sem alpha, WebP+AVIF. Retrato/avatares: com alpha.
 */
const jobs = [
  { in: "Background-concrete.png", out: "bg-concrete", width: 2400, alpha: false, avifQ: 52, webpQ: 76, blur: true },
  { in: "Background-CTA.png", out: "bg-cta", width: 2400, alpha: false, avifQ: 52, webpQ: 76, blur: true },
  { in: "Retrato-henrique.png", out: "henrique-retrato", width: 1400, alpha: true, avifQ: 60, webpQ: 82, blur: true },
  { in: "card_curso.png", out: "card-curso", width: 1377, alpha: false, avifQ: 58, webpQ: 80, blur: true },
  { in: "arthur-henrique.png", out: "arthur-avatar", width: 320, alpha: true, avifQ: 62, webpQ: 85, blur: false },
  { in: "whatsapp-arthur.png", out: "whatsapp-arthur", width: 364, alpha: true, avifQ: 62, webpQ: 85, blur: false },
];

const kb = (n) => `${(n / 1024).toFixed(1)}KB`;

async function run() {
  await mkdir(OUT, { recursive: true });
  const blurs = {};
  const meta = {};

  for (const job of jobs) {
    const src = path.join(RAW, job.in);
    const base = sharp(src).resize({ width: job.width, withoutEnlargement: true });
    const info = await sharp(src).metadata();
    // proporção preservada; guardamos width/height finais para next/image
    const finalW = Math.min(job.width, info.width);
    const finalH = Math.round((info.height / info.width) * finalW);
    meta[job.out] = { width: finalW, height: finalH };

    // AVIF
    const avif = await base.clone().avif({ quality: job.avifQ, effort: 5 }).toBuffer();
    await writeFile(path.join(OUT, `${job.out}.avif`), avif);
    // WebP
    const webp = await base.clone().webp({ quality: job.webpQ }).toBuffer();
    await writeFile(path.join(OUT, `${job.out}.webp`), webp);

    // blurDataURL (16px de largura, sobre fundo preto se sem alpha)
    if (job.blur) {
      let tiny = sharp(src).resize({ width: 16 });
      if (!job.alpha) tiny = tiny.flatten({ background: "#0d0d0d" });
      const buf = await tiny.webp({ quality: 40 }).toBuffer();
      blurs[job.out] = `data:image/webp;base64,${buf.toString("base64")}`;
    }

    console.log(
      `${job.out}: AVIF ${kb(avif.length)} · WebP ${kb(webp.length)} · ${finalW}x${finalH}`,
    );
  }

  // Módulo TS com blurDataURLs + dimensões
  const tsLines = [
    "// GERADO por scripts/optimize-assets.mjs — não editar à mão.",
    "// blurDataURL (placeholder) + dimensões intrínsecas dos assets otimizados.",
    "",
    `export const IMG = ${JSON.stringify(meta, null, 2)} as const;`,
    "",
    `export const BLUR = ${JSON.stringify(blurs, null, 2)} as const;`,
    "",
  ];
  await writeFile(BLUR_TS, tsLines.join("\n"));
  console.log(`\nblur.ts escrito com ${Object.keys(blurs).length} placeholders.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
