import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * GameOverScene — death-cause text (variant per level / tram / boss escape) plus
 * Restart and Quit. Restart resumes from the current suburb, not Richmond.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 12.
 */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SCENES.GameOver);
  }
}
