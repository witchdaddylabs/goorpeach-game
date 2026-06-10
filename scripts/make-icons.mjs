/**
 * make-icons.mjs — generate the PWA / home-screen icons from a single inline SVG,
 * using the palette tokens from config.ts. Run once (or when the mark changes):
 *   node scripts/make-icons.mjs
 * Outputs to public/icons/.
 */
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
await mkdir(OUT, { recursive: true });

// Palette (mirrors src/config.ts COLOURS)
const DARK = '#1a1a22';
const ROAD = '#3a3a42';
const HAZARD = '#ff7a1c';
const PEACHHI = '#ff9d4d';
const LEAF = '#3a8c54';
const CAUTION = '#ffd900';

/** A bold peach with a leaf over a dark road — reads at 48px and as a maskable icon. */
const svg = (size, maskable) => {
  const s = size;
  const c = s / 2;
  const r = s * (maskable ? 0.3 : 0.34); // smaller for maskable safe-zone
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="${DARK}"/>
  <rect y="${s * 0.66}" width="${s}" height="${s * 0.34}" fill="${ROAD}"/>
  <g>
    <rect x="${c - s * 0.03}" y="${s * 0.74}" width="${s * 0.06}" height="${s * 0.07}" fill="${CAUTION}"/>
    <rect x="${c - s * 0.03}" y="${s * 0.88}" width="${s * 0.06}" height="${s * 0.07}" fill="${CAUTION}"/>
  </g>
  <circle cx="${c}" cy="${c - s * 0.04}" r="${r}" fill="${HAZARD}"/>
  <circle cx="${c - r * 0.32}" cy="${c - s * 0.04 - r * 0.28}" r="${r * 0.5}" fill="${PEACHHI}" opacity="0.55"/>
  <path d="M ${c} ${c - s * 0.04 - r} q ${r * 0.18} ${r * 0.32} 0 ${r * 0.95}" stroke="${DARK}" stroke-width="${s * 0.018}" fill="none" opacity="0.45"/>
  <path d="M ${c + r * 0.1} ${c - s * 0.04 - r * 0.96} q ${r * 0.55} ${-r * 0.35} ${r * 0.62} ${r * 0.12} q ${-r * 0.5} ${r * 0.05} ${-r * 0.62} ${r * 0.2} z" fill="${LEAF}"/>
  </svg>`;
};

const jobs = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
];

for (const j of jobs) {
  await sharp(Buffer.from(svg(j.size, j.maskable))).png().toFile(join(OUT, j.name));
  console.log(`wrote icons/${j.name} (${j.size}px)`);
}
console.log('done');
