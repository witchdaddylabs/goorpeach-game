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

/**
 * Per-frame steering intent. The scene merges keyboard and touch into this, so
 * entities never branch on input source (CLAUDE.md rule 5).
 */
export interface SteerIntent {
  left: boolean;
  right: boolean;
  brake: boolean;
}

/** A single courier spawn within a wave. TODO: expand (lane, delay, etc.). */
export interface CourierSpawn {
  brand: CourierBrand;
  // TODO: timing and position fields
}

/** A timed wave of couriers within a level. */
export interface CourierWave {
  triggerMs: number;
  spawns: CourierSpawn[];
}

/** A fixed power-up placement within a level. */
export interface PowerUpSpawn {
  kind: PowerUpKind;
  triggerMs: number;
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
  /** Dry death-cause line shown on GameOver (per docs/BRIEF.md). */
  deathLine: string;
}

/** A leaderboard row as returned by the scores API / shown on the board. */
export interface ScoreEntry {
  initials: string; // exactly 3 uppercase letters
  score: number; // non-negative integer
  levelReached: number; // 1..5
  createdAt: number; // epoch milliseconds
}

/** A score the client submits (server stamps createdAt and assigns rank). */
export interface NewScore {
  initials: string;
  score: number;
  levelReached: number;
}

/** API response after a successful submit. */
export interface SubmitResult {
  rank: number; // 1-based position in the global board
  top: ScoreEntry[]; // current Top-N after insert
}

/** Persisted player settings (via systems/Persistence.ts). TODO: expand. */
export interface GameSettings {
  soundVolume: number;
  musicVolume: number;
  crtScanlines: boolean;
  reducedMotion: boolean;
  touchSteerSensitivity: number;
}
