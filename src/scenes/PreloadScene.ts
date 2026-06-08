import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * PreloadScene — loads all assets with a real progress bar drawn against the
 * actual asset count (no vague spinner — CLAUDE.md).
 *
 * TODO: implement. See CLAUDE.md working pattern, step 1.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENES.Preload);
  }
}
