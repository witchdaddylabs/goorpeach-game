/**
 * Headless browser playtest — exercises menu → drive → level select flows.
 * Run: node scripts/playtest.mjs (dev server must be on localhost:5173)
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://localhost:5173/';
const OUT = join(process.cwd(), 'playtest-output');

const errors = [];
const warnings = [];
const logs = [];

async function clickCanvas(canvas, gameX, gameY) {
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas has no bounding box');
  const x = box.x + (gameX / 480) * box.width;
  const y = box.y + (gameY / 270) * box.height;
  await canvas.page().mouse.click(x, y);
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader'],
  });
  const context = await browser.newContext({
    viewport: { width: 844, height: 390 },
    locale: 'en-AU',
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    const text = msg.text();
    logs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') errors.push(text);
    if (msg.type() === 'warning') warnings.push(text);
  });
  page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.stack || err.message}`));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('#game-root canvas', { timeout: 15000 });
  await page.waitForTimeout(2500);

  const canvas = page.locator('#game-root canvas').first();

  async function sampleCenter() {
    return page.evaluate(() => {
      const c = document.querySelector('#game-root canvas');
      if (!c) return null;
      const gl = c.getContext('webgl') || c.getContext('webgl2');
      if (!gl) return null;
      const pixels = new Uint8Array(4);
      gl.readPixels(240, 135, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      return [...pixels];
    });
  }
  const menuPixels = await sampleCenter();
  console.log('Menu centre RGBA:', menuPixels);
  await canvas.screenshot({ path: join(OUT, '01-after-preload.png') });

  // START button ~ (240, 140)
  await clickCanvas(canvas, 240, 140);
  await page.waitForTimeout(1200);
  const drivePixels = await sampleCenter();
  console.log('Drive centre RGBA:', drivePixels);
  await canvas.screenshot({ path: join(OUT, '02-drive-scene.png') });

  // Drive: steer left/right, brake, fire
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(400);
  await page.keyboard.up('ArrowLeft');
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(400);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowDown');
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(350);
  }
  await page.waitForTimeout(3000);
  await canvas.screenshot({ path: join(OUT, '03-driving.png') });

  // Quit to menu (P key)
  await page.keyboard.press('P');
  await page.waitForTimeout(800);
  await canvas.screenshot({ path: join(OUT, '04-back-to-menu.png') });

  // Level Select
  await clickCanvas(canvas, 240, 168);
  await page.waitForTimeout(800);
  await canvas.screenshot({ path: join(OUT, '05-level-select.png') });

  // Back from level select (Escape or back button — try Escape first)
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // SETTINGS shows coming soon
  await clickCanvas(canvas, 240, 196);
  await page.waitForTimeout(600);
  await canvas.screenshot({ path: join(OUT, '06-settings-stub.png') });

  const fatalErrors = errors.filter(
    (e) => !e.includes('[Preload] could not load') && !e.includes('Failed to load resource')
  );

  console.log('=== PLAYTEST SUMMARY ===');
  console.log(`Screenshots: ${OUT}`);
  console.log(`Console errors (filtered): ${fatalErrors.length}`);
  fatalErrors.forEach((e) => console.log(`  ERROR: ${e}`));
  console.log(`Console warnings: ${warnings.length}`);
  warnings.slice(0, 5).forEach((w) => console.log(`  WARN: ${w}`));
  console.log(`Total log lines: ${logs.length}`);

  await browser.close();
  process.exit(fatalErrors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Playtest failed:', err);
  process.exit(2);
});