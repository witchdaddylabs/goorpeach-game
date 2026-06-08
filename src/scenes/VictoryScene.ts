import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * VictoryScene — confetti, Boroondara skyline, "Kew is safe. For now." with
 * Restart and Menu. See docs/BRIEF.md.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 16.
 */
export class VictoryScene extends Phaser.Scene {
  constructor() {
    super(SCENES.Victory);
  }
}
