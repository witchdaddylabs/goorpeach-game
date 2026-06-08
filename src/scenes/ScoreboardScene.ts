import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * ScoreboardScene — the global Top-20 high-score board (single board, ranked on
 * final run score), plus classic 3-letter arcade initials entry.
 *
 * Flow when implemented:
 *  - Reached from MenuScene (view only) or after a run from VictoryScene /
 *    GameOverScene, which pass the final score + level reached.
 *  - On entry with a score, call Scoreboard.qualifies(score, board); if it makes
 *    the board, run initials entry (AAA selector — keyboard up/down/left/right
 *    and on-screen touch arrows), then Scoreboard.submit(...) and highlight the
 *    new row at its returned rank.
 *  - Reads/writes go through systems/Scoreboard.ts ONLY (never fetch here).
 *  - Honour prefers-reduced-motion for any row animation; colours from config
 *    tokens with WCAG-safe contrast.
 *
 * TODO: implement. The data path (Scoreboard + Score systems + /api/scores) is
 * already wired and testable; this scene renders it.
 */
export class ScoreboardScene extends Phaser.Scene {
  constructor() {
    super(SCENES.Scoreboard);
  }
}
