import Phaser from 'phaser';
import { COLOURS, TRAM } from '../config';
import { getLayout } from '../systems/Layout';

/** Flashing crossing lights at the upcoming cross-street (docs/BRIEF.md). */
export class TramWarning {
  private readonly gfx: Phaser.GameObjects.Graphics;
  private readonly flashEvent: Phaser.Time.TimerEvent;
  private crossY: number;
  private on = true;

  constructor(scene: Phaser.Scene, crossY: number) {
    this.crossY = crossY;
    this.gfx = scene.add.graphics();
    this.draw();
    this.flashEvent = scene.time.addEvent({
      delay: TRAM.flashMs,
      loop: true,
      callback: () => {
        this.on = !this.on;
        this.draw();
      },
    });
  }

  /** Follow the player lane during the telegraph so the cross matches arrival. */
  setCrossY(y: number): void {
    this.crossY = y;
    this.draw();
  }

  private draw(): void {
    const { road, width } = getLayout();
    this.gfx.clear();
    this.gfx.fillStyle(this.on ? COLOURS.caution : COLOURS.hazard, this.on ? 1 : 0.55);
    const lightXs = [
      road.footpathWidth + TRAM.lightInset,
      width - road.footpathWidth - TRAM.lightInset - TRAM.lightW,
    ];
    for (const x of lightXs) {
      this.gfx.fillRect(x, this.crossY - TRAM.lightH / 2, TRAM.lightW, TRAM.lightH);
    }
  }

  destroy(): void {
    this.flashEvent.remove();
    this.gfx.destroy();
  }
}