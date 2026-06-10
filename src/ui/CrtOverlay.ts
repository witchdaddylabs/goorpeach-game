/**
 * CrtOverlay — the CRT effect, honouring Settings (crtScanlines + reducedMotion).
 *
 * On a WebGL renderer it drives the real curved-tube post-FX (ui/CrtPipeline.ts)
 * on the scene's main camera. On a Canvas renderer (rare fallback) it draws the
 * old flat scanline Graphics. Same constructor + refresh() API as before, so the
 * scenes and SettingsScene don't change.
 */
import Phaser from 'phaser';
import { COLOURS, CRT } from '../config';
import { Persistence } from '../systems/Persistence';
import { getLayout } from '../systems/Layout';
import { CrtPipeline, CRT_PIPELINE_KEY } from './CrtPipeline';

let pipelineRegistered = false;

export class CrtOverlay {
  private readonly scene: Phaser.Scene;
  private readonly webgl: boolean;
  private gfx?: Phaser.GameObjects.Graphics;
  private applied = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.webgl = scene.game.renderer.type === Phaser.WEBGL;

    if (this.webgl) {
      const pipelines = (scene.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines;
      if (!pipelineRegistered) {
        pipelines.addPostPipeline(CRT_PIPELINE_KEY, CrtPipeline);
        pipelineRegistered = true;
      }
    } else {
      this.gfx = scene.add.graphics().setDepth(CRT.depth).setScrollFactor(0);
    }

    this.refresh();
  }

  /** Re-read settings — call after a settings change or orientation resize. */
  refresh(): void {
    const settings = Persistence.getSettings();
    const on = settings.crtScanlines;
    if (this.webgl) {
      this.applyPipeline(on, settings.reducedMotion);
    } else {
      this.drawScanlines(on);
    }
  }

  private applyPipeline(on: boolean, reduced: boolean): void {
    const cam = this.scene.cameras.main;
    if (on && !this.applied) {
      cam.setPostPipeline(CRT_PIPELINE_KEY);
      this.applied = true;
    } else if (!on && this.applied) {
      cam.removePostPipeline(CRT_PIPELINE_KEY);
      this.applied = false;
    }
    if (this.applied) {
      const pipe = cam.getPostPipeline(CRT_PIPELINE_KEY);
      const inst = (Array.isArray(pipe) ? pipe[0] : pipe) as CrtPipeline | undefined;
      if (inst) inst.reduced = reduced;
    }
  }

  private drawScanlines(on: boolean): void {
    if (!this.gfx) return;
    this.gfx.clear();
    this.gfx.setVisible(on);
    if (!on) return;
    const { width, height } = getLayout();
    this.gfx.fillStyle(COLOURS.textDark, CRT.lineAlpha);
    for (let y = 0; y < height; y += CRT.lineSpacing) {
      this.gfx.fillRect(0, y, width, CRT.lineHeight);
    }
  }

  destroy(): void {
    if (this.webgl && this.applied) {
      this.scene.cameras.main.removePostPipeline(CRT_PIPELINE_KEY);
      this.applied = false;
    }
    this.gfx?.destroy();
  }
}
