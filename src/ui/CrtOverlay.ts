/**
 * CrtOverlay — subtle scanline pass over gameplay (docs/BRIEF.md, CLAUDE.md).
 * Honour Settings: crtScanlines + reducedMotion via Persistence.
 */
import Phaser from 'phaser';
import { COLOURS, CRT } from '../config';
import { Persistence } from '../systems/Persistence';
import { getLayout } from '../systems/Layout';

export class CrtOverlay {
  private readonly gfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.gfx = scene.add.graphics().setDepth(CRT.depth).setScrollFactor(0);
    this.refresh();
  }

  /** Re-read settings — call after orientation resize or settings change. */
  refresh(): void {
    const settings = Persistence.getSettings();
    const { width, height } = getLayout();
    this.gfx.clear();

    if (!settings.crtScanlines || settings.reducedMotion) {
      this.gfx.setVisible(false);
      return;
    }

    this.gfx.setVisible(true);
    this.gfx.fillStyle(COLOURS.textDark, CRT.lineAlpha);
    for (let y = 0; y < height; y += CRT.lineSpacing) {
      this.gfx.fillRect(0, y, width, CRT.lineHeight);
    }
  }

  destroy(): void {
    this.gfx.destroy();
  }
}