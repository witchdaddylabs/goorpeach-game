import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * BootScene — first scene. Sets scale/input defaults, then hands off to
 * PreloadScene. No heavy asset loading here.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 1.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENES.Boot);
  }
}
