import Phaser from 'phaser';
import { COLOURS, TRAM } from '../config';

/**
 * Tram — rogue W-class (green + cream). Instant-death hazard regardless of
 * hearts. Crosses down the street at TRAM.speed after its TramWarning telegraph.
 * Drawn as a chunky rectangle proxy until the real sprite lands.
 */
export class Tram {
  readonly body: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.body = scene.add.rectangle(TRAM.spawnX, TRAM.spawnY, TRAM.width, TRAM.height, COLOURS.tramBody);
    // Cream livery trim
    this.body.setStrokeStyle(3, COLOURS.footpath);
  }

  update(delta: number): void {
    this.body.y += TRAM.speed * (delta / 1000);
  }

  getBounds(): Phaser.Geom.Rectangle {
    return this.body.getBounds();
  }

  get offscreen(): boolean {
    return this.body.y > 300;
  }

  destroy(): void {
    if (this.body.active) this.body.destroy();
  }
}
