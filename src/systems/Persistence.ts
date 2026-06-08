import { STORAGE_KEYS } from '../config';
import type { ScoreEntry } from '../types';

/**
 * Persistence — the ONLY place raw localStorage is touched (CLAUDE.md rule 4).
 * Wraps high score, settings, unlocked levels, and volume so the store can be
 * swapped later. Scenes/systems call this, never localStorage directly.
 *
 * Mostly stubbed; the local-scores cache is implemented now because the
 * scoreboard needs an offline fallback (see systems/Scoreboard.ts).
 */
export class Persistence {
  /** Safe read of a JSON value; returns the fallback on any error. */
  private static read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  }

  /** Safe write of a JSON value; silently no-ops if storage is unavailable. */
  private static write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked (e.g. private mode) — non-fatal for a game.
    }
  }

  /** Local mirror of the global board, shown when the API is unreachable. */
  static getLocalScores(): ScoreEntry[] {
    return Persistence.read<ScoreEntry[]>(STORAGE_KEYS.localScores, []);
  }

  static saveLocalScores(scores: ScoreEntry[]): void {
    Persistence.write(STORAGE_KEYS.localScores, scores);
  }

  /** Highest level the player has unlocked (1-based). Defaults to level 1. */
  static getHighestUnlocked(): number {
    return Persistence.read<number>(STORAGE_KEYS.highestUnlockedLevel, 1);
  }

  /** Record a newly reached level if it beats the stored high-water mark. */
  static unlockLevel(level: number): void {
    if (level > Persistence.getHighestUnlocked()) {
      Persistence.write(STORAGE_KEYS.highestUnlockedLevel, level);
    }
  }

  // TODO: getSettings/setSettings.
}
