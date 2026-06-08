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
  // TODO: define Richmond (id 1) first. See docs/BRIEF.md for the five levels.
];
