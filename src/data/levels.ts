import type { LevelConfig } from '../types';

/**
 * levels.ts — the single source of level config (CLAUDE.md rule 2). Adding a
 * level = editing this file only. Each entry: id, name, durationMs, scrollSpeed,
 * courierWaves, powerUpSpawns, tramSpawnTimes, backgroundTileset, deathLine.
 *
 * Spawn patterns are fixed and predictable — same level, same sequence, so
 * players can learn it (CLAUDE.md rule 10). Difficulty rises Richmond → Kew:
 * faster scroll, denser waves, more trams.
 *
 * Level 5 (Kew) is the boss arena (BossScene), not a driving level, so it does
 * not appear here.
 *
 * Pacing target: ~45s per suburb, couriers every 4–7s, PEN pickups every ~8s.
 */
export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Richmond',
    durationMs: 45000,
    scrollSpeed: 155,
    courierWaves: [
      { triggerMs: 2500, spawns: [{ brand: 'GoorPeach' }] },
      { triggerMs: 6500, spawns: [{ brand: 'GoorPeach' }, { brand: 'GorgeRush' }] },
      { triggerMs: 11000, spawns: [{ brand: 'ChewSnog' }] },
      { triggerMs: 16000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GoorPeach' }] },
      { triggerMs: 21000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 27000, spawns: [{ brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 33000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GorgeRush' }, { brand: 'GoorPeach' }] },
      { triggerMs: 39000, spawns: [{ brand: 'ChewSnog' }, { brand: 'GorgeRush' }] },
    ],
    powerUpSpawns: [
      { kind: 'ammo', triggerMs: 4500 },
      { kind: 'ammo', triggerMs: 12000 },
      { kind: 'boost', triggerMs: 19000 },
      { kind: 'ammo', triggerMs: 26000 },
      { kind: 'ammo', triggerMs: 34000 },
    ],
    tramSpawnTimes: [9000, 30000],
    backgroundTileset: 'procedural',
    deathLine: 'You got smashed by a cyclist on Brunswick St. Embarrassing.',
  },
  {
    id: 2,
    name: 'Fitzroy',
    durationMs: 45000,
    scrollSpeed: 175,
    courierWaves: [
      { triggerMs: 2000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 6000, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }] },
      { triggerMs: 10500, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 15000, spawns: [{ brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 19500, spawns: [{ brand: 'GoorPeach' }, { brand: 'GoorPeach' }, { brand: 'ChewSnog' }] },
      { triggerMs: 24500, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 29500, spawns: [{ brand: 'ChewSnog' }, { brand: 'GoorPeach' }, { brand: 'GorgeRush' }] },
      { triggerMs: 35000, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 40000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'ChewSnog' }] },
    ],
    powerUpSpawns: [
      { kind: 'ammo', triggerMs: 3500 },
      { kind: 'ammo', triggerMs: 10000 },
      { kind: 'shield', triggerMs: 17000 },
      { kind: 'ammo', triggerMs: 24000 },
      { kind: 'ammo', triggerMs: 31000 },
      { kind: 'ammo', triggerMs: 38000 },
    ],
    tramSpawnTimes: [8000, 22000, 36000],
    backgroundTileset: 'procedural',
    deathLine: 'An e-bike clipped you outside a vegan bakery. Tragic.',
  },
  {
    id: 3,
    name: 'Collingwood',
    durationMs: 45000,
    scrollSpeed: 195,
    courierWaves: [
      { triggerMs: 2000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GoorPeach' }] },
      { triggerMs: 5500, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 9500, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 14000, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 18500, spawns: [{ brand: 'ChewSnog' }, { brand: 'ChewSnog' }] },
      { triggerMs: 23000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 28000, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 33000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GorgeRush' }, { brand: 'GoorPeach' }] },
      { triggerMs: 38000, spawns: [{ brand: 'ChewSnog' }, { brand: 'GoorPeach' }, { brand: 'GorgeRush' }] },
    ],
    powerUpSpawns: [
      { kind: 'ammo', triggerMs: 3000 },
      { kind: 'ammo', triggerMs: 9000 },
      { kind: 'magpie', triggerMs: 16000 },
      { kind: 'ammo', triggerMs: 22000 },
      { kind: 'ammo', triggerMs: 29000 },
      { kind: 'boost', triggerMs: 36000 },
    ],
    tramSpawnTimes: [7000, 20000, 33000],
    backgroundTileset: 'procedural',
    deathLine: 'GorgeRush swarm. They did not even stop.',
  },
  {
    id: 4,
    name: 'Approaching Kew',
    durationMs: 45000,
    scrollSpeed: 220,
    courierWaves: [
      { triggerMs: 1500, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }] },
      { triggerMs: 5000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GoorPeach' }, { brand: 'ChewSnog' }] },
      { triggerMs: 9000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 13000, spawns: [{ brand: 'ChewSnog' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 17500, spawns: [{ brand: 'GoorPeach' }, { brand: 'GorgeRush' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 22000, spawns: [{ brand: 'ChewSnog' }, { brand: 'GoorPeach' }, { brand: 'GoorPeach' }] },
      { triggerMs: 27000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 32000, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }, { brand: 'GorgeRush' }] },
      { triggerMs: 37000, spawns: [{ brand: 'ChewSnog' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 41000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'ChewSnog' }] },
    ],
    powerUpSpawns: [
      { kind: 'ammo', triggerMs: 2500 },
      { kind: 'ammo', triggerMs: 8000 },
      { kind: 'shield', triggerMs: 14000 },
      { kind: 'ammo', triggerMs: 20000 },
      { kind: 'magpie', triggerMs: 26000 },
      { kind: 'ammo', triggerMs: 32000 },
      { kind: 'boost', triggerMs: 38000 },
    ],
    tramSpawnTimes: [11000, 28000, 40000],
    backgroundTileset: 'procedural',
    deathLine: 'Eastern Fwy at peak hour. Predictable, really.',
  },
];