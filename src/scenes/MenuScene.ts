import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * MenuScene — title screen (skyline, chunky logo, Start / Level Select /
 * Settings / Credits). The Start button is the audio-unlock point: it must
 * resume the WebAudio context on first interaction (CLAUDE.md audio gotcha).
 *
 * TODO: implement. See CLAUDE.md working pattern, step 2.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENES.Menu);
  }
}
