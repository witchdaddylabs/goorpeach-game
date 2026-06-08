import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * BootScene — first scene. Sets scale/input defaults, then hands off to
 * PreloadScene. No heavy asset loading here.
 *
 * Per CLAUDE.md: mobile-first, landscape-locked. A basic portrait prompt
 * will be handled in the menu for the first milestone (full blocker can be
 * polished later).
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENES.Boot);
  }

  create(): void {
    // Input defaults for mobile (touch-action already none on #game-root via index.html)
    this.input.mouse?.disableContextMenu();

    // Hand straight to Preload (actual asset loading + progress bar lives there)
    this.scene.start(SCENES.Preload);
  }
}
