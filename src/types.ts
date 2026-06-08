/**
 * types.ts — shared TypeScript types across scenes, entities, and systems.
 *
 * Keep cross-cutting types here so a scene and an entity agree on shape without
 * a circular import. Scaffold stub — expand during implementation.
 */

/** The three parody courier brands (no real brand names — see CLAUDE.md). */
export type CourierBrand = 'GoorPeach' | 'ChewSnog' | 'GorgeRush';

/** Power-up kinds (fixed spawns, no RNG — see docs/BRIEF.md). */
export type PowerUpKind = 'ammo' | 'boost' | 'shield' | 'magpie';

/** A single courier spawn within a wave. TODO: expand (lane, delay, etc.). */
export interface CourierSpawn {
  brand: CourierBrand;
  // TODO: timing and position fields
}

/** A timed wave of couriers within a level. TODO: expand. */
export interface CourierWave {
  spawns: CourierSpawn[];
  // TODO: triggerMs, etc.
}

/** A fixed power-up placement within a level. TODO: expand. */
export interface PowerUpSpawn {
  kind: PowerUpKind;
  // TODO: position / trigger fields
}

/**
 * A level definition. Each level in src/data/levels.ts exports this shape
 * (id, name, durationMs, scrollSpeed, courierWaves, powerUpSpawns,
 * backgroundTileset) — see CLAUDE.md rule 2.
 */
export interface LevelConfig {
  id: number;
  name: string;
  durationMs: number;
  scrollSpeed: number;
  courierWaves: CourierWave[];
  powerUpSpawns: PowerUpSpawn[];
  backgroundTileset: string;
}

/** Persisted player settings (via systems/Persistence.ts). TODO: expand. */
export interface GameSettings {
  soundVolume: number;
  musicVolume: number;
  crtScanlines: boolean;
  reducedMotion: boolean;
  touchSteerSensitivity: number;
}
