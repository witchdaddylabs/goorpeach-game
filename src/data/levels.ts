import type { LevelConfig } from '../types';

/**
 * levels.ts — the single source of level config (CLAUDE.md rule 2). Adding a
 * level = editing this file only. Each entry: id, name, durationMs, scrollSpeed,
 * courierWaves, powerUpSpawns, backgroundTileset.
 *
 * Spawn patterns are fixed and predictable — same level, same sequence, so
 * players can learn it (CLAUDE.md rule 10).
 *
 * Scaffold stub: empty for now. Implementation starts with level 1 (Richmond),
 * then Fitzroy → Collingwood/Abbotsford → Approaching Kew → Kew boss arena.
 */
export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Richmond',
    durationMs: 75000, // ~75 seconds tutorial length
    scrollSpeed: 140,
    courierWaves: [
      // Mild tutorial traffic — predictable spawns
      {
        triggerMs: 8000,
        spawns: [{ brand: 'GoorPeach' }],
      },
      {
        triggerMs: 22000,
        spawns: [{ brand: 'ChewSnog' }, { brand: 'GoorPeach' }],
      },
      {
        triggerMs: 45000,
        spawns: [{ brand: 'GorgeRush' }],
      },
    ],
    powerUpSpawns: [
      { kind: 'ammo', triggerMs: 15000 },
      { kind: 'boost', triggerMs: 35000 },
    ],
    backgroundTileset: 'roadTest',
  },
];
