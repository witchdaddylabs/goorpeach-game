import Phaser from 'phaser';
import { COLOURS, TRAM } from '../config';

/**
 * TramWarning — the flashing red/amber crossing-light telegraph that precedes a
 * Tram by TRAM.warningMs, giving fair warning (docs/BRIEF.md). Lights flash at
 * the configured crossing positions; the scene promotes it to a Tram when the
 * lead time elapses, then calls destroy().
 */
export class TramWarning {
  private readonly gfx: Phaser.GameObjects.Graphics;
  private readonly flashEvent: Phaser.Time.TimerEvent;
  private on = true;

  constructor(scene: Phaser.Scene) {
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

  private draw(): void {
    this.gfx.clear();
    this.gfx.fillStyle(this.on ? COLOURS.caution : COLOURS.hazard, this.on ? 1 : 0.5);
    for (const x of TRAM.lightXs) {
      this.gfx.fillRect(x, TRAM.lightY, TRAM.lightW, TRAM.lightH);
    }
  }

  destroy(): void {
    this.flashEvent.remove();
    this.gfx.destroy();
  }
}
