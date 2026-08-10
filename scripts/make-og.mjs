// Gera a OG image 1200x630 (share card) — Onda 2.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(root, "..", "public", "_assets-raw");
const OUT = path.join(root, "..", "public", "img", "og-image.png");

const W = 1200;
const H = 630;

// Fundo noir + radar dourado (rings) + scrim + título + kicker.
const bg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="72%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#5a0a0a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0d0d0d" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0d0d0d" stop-opacity="0.98"/>
      <stop offset="55%" stop-color="#0d0d0d" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="#0d0d0d" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0d0d0d"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <!-- radar rings (dourado, discretos) centrados à direita -->
  <g transform="translate(860,315)" fill="none" stroke="#c9a227">
    <circle r="300" stroke-width="1.2" opacity="0.14"/>
    <circle r="220" stroke-width="1" opacity="0.18"/>
    <circle r="150" stroke-width="1" opacity="0.24"/>
    <circle r="80" stroke-width="1.2" opacity="0.34"/>
    <line x1="0" y1="0" x2="248" y2="-168" stroke-width="1.8" opacity="0.6"/>
    <circle cx="248" cy="-168" r="7" fill="#cc2222" stroke="none" opacity="0.95"/>
    <circle cx="248" cy="-168" r="14" stroke="#cc2222" stroke-width="1" opacity="0.4"/>
  </g>
</svg>`);

const scrim = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0d0d0d" stop-opacity="0.97"/>
      <stop offset="52%" stop-color="#0d0d0d" stop-opacity="0.78"/>
      <stop offset="100%" stop-color="#0d0d0d" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#s)"/>
</svg>`);

const text = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .kicker { font-family: "Helvetica Neue", Arial, sans-serif; font-weight: 700; letter-spacing: 6px; }
    .title { font-family: "Helvetica Neue", Arial, sans-serif; font-weight: 800; letter-spacing: 1px; }
    .name  { font-family: "Helvetica Neue", Arial, sans-serif; font-weight: 600; letter-spacing: 3px; }
  </style>
  <text x="72" y="150" class="kicker" font-size="24" fill="#c9a227">PARA QUEM JÁ FOI ENGANADO</text>
  <text x="70" y="270" class="title" font-size="76" fill="#f0ebe0">AS TRÊS DIMENSÕES</text>
  <text x="70" y="352" class="title" font-size="76" fill="#f0ebe0">DA <tspan fill="#cc2222">MENTIRA</tspan></text>
  <rect x="74" y="400" width="120" height="4" fill="#c9a227"/>
  <text x="72" y="470" class="name" font-size="26" fill="#c9a227">HENRIQUE YOITI</text>
</svg>`);

async function run() {
  // retrato à direita, recortado à altura do card
  const portrait = await sharp(path.join(RAW, "Retrato-henrique.png"))
    .resize({ height: H, fit: "cover", position: "top" })
    .toBuffer();
  const pMeta = await sharp(portrait).metadata();

  await sharp(bg)
    .composite([
      { input: portrait, left: W - pMeta.width + 40, top: 0 },
      { input: scrim, left: 0, top: 0 },
      { input: text, left: 0, top: 0 },
    ])
    .png()
    .toFile(OUT);

  const out = await sharp(OUT).metadata();
  console.log(`og-image.png: ${out.width}x${out.height}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
