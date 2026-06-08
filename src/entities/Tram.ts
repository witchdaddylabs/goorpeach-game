import Phaser from 'phaser';
import { TRAM } from '../config';
import { getLayout } from '../systems/Layout';

export type TramDirection = 'left' | 'right';

/** Tram — W-class crosses horizontally from a side street (docs/BRIEF.md). */
export class Tram {
  readonly body: Phaser.GameObjects.Image;
  private readonly velocityX: number;
  readonly crossY: number;

  constructor(scene: Phaser.Scene, direction: TramDirection, crossY: number) {
    const { road, width, tram: tramLayout } = getLayout();
    const playableW = width - road.footpathWidth * 2;
    const speed = playableW / (TRAM.crossDurationMs / 1000);
    const length = tramLayout.length;
    this.crossY = crossY;

    const startX = direction === 'left' ? -length / 2 : width + length / 2;
    this.velocityX = direction === 'left' ? speed : -speed;

    this.body = scene.add.image(startX, crossY, 'tramBody');
    this.body.setDisplaySize(length, TRAM.height);
    this.body.setOrigin(0.5, 0.5);
    this.body.setDepth(9);
  }

  update(delta: number): void {
    this.body.x += this.velocityX * (delta / 1000);
  }

  getBounds(): Phaser.Geom.Rectangle {
    return this.body.getBounds();
  }

  /** Hazard bounds — wide on X, tight on Y so a full brake clears the crossing. */
  getHitBounds(): Phaser.Geom.Rectangle {
    const b = this.body.getBounds();
    return new Phaser.Geom.Rectangle(
      b.x - TRAM.hitPaddingX,
      b.y - TRAM.hitPaddingY,
      b.width + TRAM.hitPaddingX * 2,
      b.height + TRAM.hitPaddingY * 2,
    );
  }

  get offscreen(): boolean {
    const { width, tram: tramLayout } = getLayout();
    const half = tramLayout.length / 2;
    return this.body.x < -half || this.body.x > width + half;
  }

  destroy(): void {
    if (this.body.active) this.body.destroy();
  }
}