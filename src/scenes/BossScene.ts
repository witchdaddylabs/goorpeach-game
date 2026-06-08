import Phaser from 'phaser';
import { SCENES } from '../config';

/**
 * BossScene — the Kew arena, two-phase fight against The Nerd.
 * Phase 1: feeding frenzy (empty the feed meter). Phase 2: Tiguan escape
 * (disable it within 15s). See docs/BRIEF.md.
 *
 * TODO: implement. See CLAUDE.md working pattern, steps 14–15.
 */
export class BossScene extends Phaser.Scene {
  constructor() {
    super(SCENES.Boss);
  }
}
