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
 */
export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Richmond',
    durationMs: 75000, // ~75s tutorial length
    scrollSpeed: 140,
    courierWaves: [
      { triggerMs: 8000, spawns: [{ brand: 'GoorPeach' }] },
      { triggerMs: 22000, spawns: [{ brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 45000, spawns: [{ brand: 'GorgeRush' }] },
    ],
    powerUpSpawns: [
      { kind: 'ammo', triggerMs: 15000 },
      { kind: 'boost', triggerMs: 35000 },
    ],
    tramSpawnTimes: [12000, 38000],
    backgroundTileset: 'procedural',
    deathLine: 'You got smashed by a cyclist on Brunswick St. Embarrassing.',
  },
  {
    id: 2,
    name: 'Fitzroy',
    durationMs: 80000,
    scrollSpeed: 160,
    courierWaves: [
      // Hipster cluster — tighter streets, more cyclists
      { triggerMs: 7000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 20000, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }] },
      { triggerMs: 34000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 52000, spawns: [{ brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 68000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GorgeRush' }] },
    ],
    powerUpSpawns: [
      { kind: 'ammo', triggerMs: 12000 },
      { kind: 'shield', triggerMs: 30000 },
      { kind: 'ammo', triggerMs: 50000 },
    ],
    tramSpawnTimes: [15000, 45000, 65000],
    backgroundTileset: 'procedural',
    deathLine: 'An e-bike clipped you outside a vegan bakery. Tragic.',
  },
  {
    id: 3,
    name: 'Collingwood',
    durationMs: 85000,
    scrollSpeed: 180,
    courierWaves: [
      // Industrial Smith St → Johnston St — more scooters
      { triggerMs: 6000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GoorPeach' }] },
      { triggerMs: 18000, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 32000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 48000, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 62000, spawns: [{ brand: 'ChewSnog' }, { brand: 'ChewSnog' }] },
      { triggerMs: 75000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GorgeRush' }, { brand: 'GoorPeach' }] },
    ],
    powerUpSpawns: [
      { kind: 'ammo', triggerMs: 10000 },
      { kind: 'magpie', triggerMs: 28000 },
      { kind: 'ammo', triggerMs: 44000 },
      { kind: 'boost', triggerMs: 64000 },
    ],
    tramSpawnTimes: [10000, 30000, 55000, 72000],
    backgroundTileset: 'procedural',
    deathLine: 'GorgeRush swarm. They did not even stop.',
  },
  {
    id: 4,
    name: 'Approaching Kew',
    durationMs: 90000,
    scrollSpeed: 210,
    courierWaves: [
      // Eastern Fwy → High St — highway speed, dense traffic
      { triggerMs: 5000, spawns: [{ brand: 'GoorPeach' }, { brand: 'ChewSnog' }] },
      { triggerMs: 16000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GoorPeach' }, { brand: 'ChewSnog' }] },
      { triggerMs: 28000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
      { triggerMs: 40000, spawns: [{ brand: 'ChewSnog' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 54000, spawns: [{ brand: 'GoorPeach' }, { brand: 'GorgeRush' }, { brand: 'ChewSnog' }, { brand: 'GoorPeach' }] },
      { triggerMs: 70000, spawns: [{ brand: 'ChewSnog' }, { brand: 'GoorPeach' }, { brand: 'GoorPeach' }] },
      { triggerMs: 82000, spawns: [{ brand: 'GorgeRush' }, { brand: 'GorgeRush' }] },
    ],
    powerUpSpawns: [
      { kind: 'ammo', triggerMs: 9000 },
      { kind: 'shield', triggerMs: 24000 },
      { kind: 'ammo', triggerMs: 42000 },
      { kind: 'magpie', triggerMs: 58000 },
      { kind: 'boost', triggerMs: 74000 },
    ],
    tramSpawnTimes: [20000, 50000, 78000],
    backgroundTileset: 'procedural',
    deathLine: 'Eastern Fwy at peak hour. Predictable, really.',
  },
];
