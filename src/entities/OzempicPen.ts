import Phaser from 'phaser';
import { PEN } from '../config';
import { getLayout } from '../systems/Layout';

/**
 * OzempicPen — the player's projectile. A small cyan capsule (not a car sprite).
 * Generous against couriers when fired (CLAUDE.md rule 9). Tuning from PEN.
 */
export class OzempicPen {
  private readonly body: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.body = scene.add.rectangle(x, y, PEN.width, PEN.height, PEN.colour);
    this.body.setStrokeStyle(1, 0xffffff, 0.6);
  }

  getBounds(): Phaser.Geom.Rectangle {
    return this.body.getBounds();
  }

  get active(): boolean {
    return this.body.active;
  }

  /** True once it has flown off the top of the play area. */
  get offscreen(): boolean {
    return this.body.y < getLayout().road.topY - 4;
  }

  update(delta: number): void {
    this.body.y -= PEN.speed * (delta / 1000);
  }

  destroy(): void {
    if (this.body.active) this.body.destroy();
  }
}