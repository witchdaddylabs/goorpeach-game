import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * LevelSelectScene — levels unlock progressively; locked levels show padlocks.
 * Reads unlock state via systems/Persistence.ts.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 17.
 */
export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super(SCENES.LevelSelect);
  }
}
