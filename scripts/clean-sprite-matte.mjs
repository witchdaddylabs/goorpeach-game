/**
 * clean-sprite-matte.mjs — strip the semi-transparent grey matte baked into the
 * Grok-generated sprites.
 *
 * Every generated PNG shipped with a flat ~15% alpha light-grey background (no
 * pixel was fully transparent), which renders as a visible square/halo around
 * cars, couriers and characters on the dark road. We knock any pixel at or below
 * an alpha threshold fully transparent, leaving the real silhouette crisp.
 *
 * Originals are committed in git — `git checkout public/sprites/generated` restores.
 *
 *   node scripts/clean-sprite-matte.mjs [threshold]   (default 110)
 */
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const THRESHOLD = Number(process.argv[2] ?? 110);
const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sprites', 'generated');

const files = (await readdir(DIR)).filter((f) => f.toLowerCase().endsWith('.png'));
let changed = 0;

for (const file of files) {
  const path = join(DIR, file);
  const { data, info } = await sharp(path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let cleared = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a > 0 && a <= THRESHOLD) {
      data[i + 3] = 0; // fully transparent — kills the matte
      cleared++;
    }
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path);

  if (cleared > 0) changed++;
  console.log(`${file.padEnd(32)} ${info.width}x${info.height}  cleared ${cleared} matte px`);
}

console.log(`\nDone — threshold ${THRESHOLD}, ${changed}/${files.length} files touched.`);
