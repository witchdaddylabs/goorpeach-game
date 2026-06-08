/**
 * Persistence — the ONLY place raw localStorage is touched (CLAUDE.md rule 4).
 * Wraps high score, settings, unlocked levels, and volume so the store can be
 * swapped later. Scenes call this, never localStorage directly.
 *
 * Uses STORAGE_KEYS from config.ts.
 *
 * TODO: implement get/set for unlocked levels and settings.
 */
export class Persistence {
  // TODO: getUnlockedLevel/setUnlockedLevel, getSettings/setSettings, etc.
}
