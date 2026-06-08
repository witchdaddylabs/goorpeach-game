import Phaser from 'phaser';
import { PEN } from '../config';

/**
 * OzempicPen — the player's projectile. Generous against couriers when fired
 * (CLAUDE.md rule 9 — see Courier.getHitBounds). Ammo is limited and topped up
 * by power-ups. Tuning from PEN in config.ts. Uses a tinted proxy until a
 * dedicated pen sprite lands.
 */
export class OzempicPen {
  readonly sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'playerClean');
    this.sprite.setScale(PEN.scaleX, PEN.scaleY);
    this.sprite.setTint(PEN.tint);
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setVelocityY(-PEN.speed); // negative y = up the screen
    this.sprite.setCollideWorldBounds(false);
  }

  getBounds(): Phaser.Geom.Rectangle {
    return this.sprite.getBounds();
  }

  get active(): boolean {
    return !!this.sprite && this.sprite.active;
  }

  /** True once it has flown off the top of the play area. */
  get offscreen(): boolean {
    return this.sprite.y < PEN.despawnY;
  }

  destroy(): void {
    if (this.sprite?.active) this.sprite.destroy();
  }
}
