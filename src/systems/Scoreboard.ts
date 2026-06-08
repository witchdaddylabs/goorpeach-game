import { LEADERBOARD } from '../config';
import type { NewScore, ScoreEntry, SubmitResult } from '../types';
import { Persistence } from './Persistence';

/**
 * Scoreboard — the ONLY way the game reads/writes high scores (mirrors the
 * "no raw store access in scenes" rule for Persistence and Audio).
 *
 * Talks to the same-origin Cloudflare Pages Function at LEADERBOARD.apiPath,
 * backed by D1. If the network/API is unavailable (offline, or running the pure
 * Vite dev server without Functions), it degrades gracefully to a localStorage
 * board via Persistence, so the static site is always playable.
 *
 * No Phaser here — this is plain TypeScript so it stays testable and reusable.
 */
export class Scoreboard {
  constructor(private readonly apiPath: string = LEADERBOARD.apiPath) {}

  /** Top-N global scores. Falls back to the local cache on failure. */
  async getTop(): Promise<ScoreEntry[]> {
    try {
      const res = await fetch(this.apiPath, { method: 'GET' });
      if (!res.ok) throw new Error(`GET ${this.apiPath} → ${res.status}`);
      const data = (await res.json()) as { top: ScoreEntry[] };
      Persistence.saveLocalScores(data.top); // keep the offline mirror warm
      return data.top;
    } catch {
      return Persistence.getLocalScores();
    }
  }

  /**
   * Submit a run. On success returns the server rank and refreshed board. On
   * failure, records the score locally and computes a local rank so the player
   * still sees a result.
   */
  async submit(entry: NewScore): Promise<SubmitResult> {
    const normalised: NewScore = { ...entry, initials: entry.initials.toUpperCase() };
    try {
      const res = await fetch(this.apiPath, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(normalised),
      });
      if (!res.ok) throw new Error(`POST ${this.apiPath} → ${res.status}`);
      const data = (await res.json()) as SubmitResult;
      Persistence.saveLocalScores(data.top);
      return data;
    } catch {
      return Scoreboard.submitLocal(normalised);
    }
  }

  /** Does this score make the visible board? Used to gate initials entry. */
  static qualifies(score: number, board: ScoreEntry[]): boolean {
    if (board.length < LEADERBOARD.topN) return true;
    const lowest = board[board.length - 1];
    return lowest === undefined || score > lowest.score;
  }

  /** Offline insert into the local cache; returns a local rank + board. */
  private static submitLocal(entry: NewScore): SubmitResult {
    const board = Persistence.getLocalScores();
    const row: ScoreEntry = { ...entry, createdAt: Date.now() };
    const next = [...board, row]
      .sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
      .slice(0, LEADERBOARD.topN);
    Persistence.saveLocalScores(next);
    const rank = board.filter((e) => e.score > entry.score).length + 1;
    return { rank, top: next };
  }
}
