import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * DriveScene — the core driving level, parameterised by level id. All level
 * config (length, waves, power-up spawns, tileset) comes from src/data/levels.ts
 * (CLAUDE.md rule 2). Auto-scrolls forward; ends at the checkpoint after
 * durationMs.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 3.
 */
export class DriveScene extends Phaser.Scene {
  constructor() {
    super(SCENES.Drive);
  }
}
