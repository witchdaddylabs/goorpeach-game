import Phaser from 'phaser';
import { TRAM } from '../config';
import { getLayout } from '../systems/Layout';

/** Flashing crossing lights at the upcoming cross-street (docs/BRIEF.md). */
export class TramWarning {
  private readonly lights: Phaser.GameObjects.Image[] = [];
  private readonly flashEvent: Phaser.Time.TimerEvent;
  private crossY: number;
  private on = true;

  constructor(scene: Phaser.Scene, crossY: number) {
    this.crossY = crossY;
    this.spawnLights(scene);
    this.flashEvent = scene.time.addEvent({
      delay: TRAM.flashMs,
      loop: true,
      callback: () => {
        this.on = !this.on;
        this.setAlpha();
      },
    });
  }

  private spawnLights(scene: Phaser.Scene): void {
    const { road, width } = getLayout();
    const lightXs = [
      road.footpathWidth + TRAM.lightInset,
      width - road.footpathWidth - TRAM.lightInset - TRAM.lightW,
    ];
    for (const x of lightXs) {
      const light = scene.add.image(x + TRAM.lightW / 2, this.crossY, 'tramWarningLights');
      light.setDisplaySize(TRAM.lightW, TRAM.lightH);
      light.setOrigin(0.5, 0.5);
      light.setDepth(6);
      this.lights.push(light);
    }
  }

  private setAlpha(): void {
    for (const light of this.lights) {
      light.setAlpha(this.on ? 1 : 0.45);
    }
  }

  /** Follow the player lane during the telegraph so the cross matches arrival. */
  setCrossY(y: number): void {
    this.crossY = y;
    for (const light of this.lights) {
      light.y = y;
    }
  }

  destroy(): void {
    this.flashEvent.remove();
    for (const light of this.lights) {
      light.destroy();
    }
  }
}