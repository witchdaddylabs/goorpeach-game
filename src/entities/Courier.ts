import Phaser from 'phaser';
import { COURIER, ROAD } from '../config';
import type { CourierBrand } from '../types';

/**
 * Courier — base class for the three delivery-rider brands. Movement, HP and
 * hitbox are driven entirely by the per-brand `COURIER` config (CLAUDE.md rule 1).
 * Subclasses (ScooterCourier / EbikeCourier / PushbikeCourier) fix the brand and
 * exist so brand-specific behaviour has a home.
 *
 * Movement is predictable, not random (rule 10): a courier travels straight down
 * at its brand speed; weaving brands oscillate with a fixed amplitude/frequency,
 * phased from their spawn lane so each one is deterministic and learnable.
 */
export class Courier {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly brand: CourierBrand;
  private hp: number;
  private readonly baseX: number;
  private elapsed = 0;
  private readonly cfg: (typeof COURIER)[CourierBrand];

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, brand: CourierBrand) {
    this.brand = brand;
    this.cfg = COURIER[brand];
    this.hp = this.cfg.hp;
    this.baseX = x;

    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setScale(COURIER.scale);
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setVelocityY(this.cfg.speed);
  }

  /** Advance weave (vertical motion is handled by the physics velocity). */
  update(delta: number): void {
    if (!this.cfg.weave) return;
    this.elapsed += delta / 1000;
    const offset = Math.sin(this.elapsed * this.cfg.weaveFreq * Math.PI * 2) * this.cfg.weaveAmp;
    const half = this.sprite.displayWidth / 2;
    this.sprite.x = Phaser.Math.Clamp(
      this.baseX + offset,
      ROAD.footpathWidth + half,
      480 - ROAD.footpathWidth - half,
    );
  }

  /** Raw display bounds — used for player collisions. */
  getBounds(): Phaser.Geom.Rectangle {
    return this.sprite.getBounds();
  }

  /** Slightly generous bounds — used for player pen hits (rule 9). */
  getHitBounds(): Phaser.Geom.Rectangle {
    const b = this.sprite.getBounds();
    const g = COURIER.hitGenerosity;
    return new Phaser.Geom.Rectangle(b.x - g, b.y - g, b.width + g * 2, b.height + g * 2);
  }

  /** Apply one pen hit. Returns true when the courier is destroyed. */
  hit(): boolean {
    this.hp -= 1;
    if (this.hp > 0) {
      this.sprite.setTint(0xffffff);
      this.sprite.scene.time.delayedCall(80, () => {
        if (this.sprite.active) this.sprite.clearTint();
      });
      return false;
    }
    return true;
  }

  get active(): boolean {
    return this.sprite?.active ?? false;
  }

  destroy(): void {
    if (this.sprite?.active) this.sprite.destroy();
  }
}
