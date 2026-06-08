import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * BootScene — first scene. Sets scale/input defaults, then hands off to
 * PreloadScene. No heavy asset loading here.
 *
 * Per CLAUDE.md: mobile-first — portrait and landscape both playable via
 * systems/Layout.ts responsive sizing.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENES.Boot);
  }

  create(): void {
    // Input defaults for mobile (touch-action already none on #game-root via index.html)
    this.input.mouse?.disableContextMenu();

    // Register Phaser's WebAudio unlock listeners before any scene plays sound.
    const sm = this.sound as Phaser.Sound.WebAudioSoundManager;
    if (typeof sm.unlock === 'function') {
      sm.unlock();
    }

    // Hand straight to Preload (actual asset loading + progress bar lives there)
    this.scene.start(SCENES.Preload);
  }
}
