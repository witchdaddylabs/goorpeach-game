import Phaser from 'phaser';
import { COLOURS, COURIER } from '../config';
import { getLayout } from '../systems/Layout';
import type { CourierBrand } from '../types';

const HIT_TEXTURE = 'courierHit';

/**
 * Courier — GoorPeach scooter, ChewSnog e-bike, GorgeRush pushbike (docs/BRIEF.md).
 * Chunky procedural top-down riders with glowing food bags — not car sprites.
 */
export class Courier {
  readonly sprite: Phaser.Physics.Arcade.Image;
  readonly brand: CourierBrand;
  private readonly gfx: Phaser.GameObjects.Graphics;
  private hp: number;
  private readonly baseX: number;
  private elapsed = 0;
  private readonly cfg: (typeof COURIER)[CourierBrand];
  private readonly bodySize: { w: number; h: number };

  constructor(scene: Phaser.Scene, x: number, y: number, brand: CourierBrand) {
    Courier.ensureHitTexture(scene);
    this.brand = brand;
    this.cfg = COURIER[brand];
    this.bodySize = COURIER.body[brand];
    this.hp = this.cfg.hp;
    this.baseX = x;

    this.sprite = scene.physics.add.image(x, y, HIT_TEXTURE);
    this.sprite.setDisplaySize(this.bodySize.w, this.bodySize.h);
    this.sprite.setVisible(false);
    this.sprite.setDepth(COURIER.spriteDepth);
    this.sprite.setVelocityY(this.cfg.speed);

    this.gfx = scene.add.graphics();
    this.gfx.setDepth(COURIER.spriteDepth);
    this.redraw();
  }

  private static ensureHitTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists(HIT_TEXTURE)) return;
    const g = scene.make.graphics({}, false);
    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, 1, 1);
    g.generateTexture(HIT_TEXTURE, 1, 1);
    g.destroy();
  }

  private redraw(): void {
    const colour = COURIER.brandColour[this.brand];
    this.gfx.clear();
    this.gfx.setPosition(this.sprite.x, this.sprite.y);

    switch (this.brand) {
      case 'GoorPeach':
        this.drawScooter(colour);
        break;
      case 'ChewSnog':
        this.drawEbike(colour);
        break;
      case 'GorgeRush':
        this.drawPushbike(colour);
        break;
    }
    this.drawFoodBag();
  }

  /** GoorPeach — compact scooter, peach orange. */
  private drawScooter(colour: number): void {
    this.gfx.fillStyle(colour, 1);
    this.gfx.fillRect(-5, -4, 10, 12);
    this.gfx.fillStyle(COLOURS.textDark, 1);
    this.gfx.fillRect(-6, -9, 12, 3);
    this.gfx.fillRect(-1, -11, 2, 4);
    this.gfx.fillStyle(COLOURS.road, 1);
    this.gfx.fillCircle(-4, 6, 2);
    this.gfx.fillCircle(4, 6, 2);
  }

  /** ChewSnog — sturdier e-bike frame, bile green. */
  private drawEbike(colour: number): void {
    this.gfx.fillStyle(colour, 1);
    this.gfx.fillRect(-7, -5, 14, 10);
    this.gfx.fillStyle(COLOURS.textDark, 1);
    this.gfx.fillRect(-8, -10, 16, 3);
    this.gfx.lineStyle(2, COLOURS.textDark, 1);
    this.gfx.strokeRect(-7, -2, 14, 6);
    this.gfx.fillStyle(COLOURS.road, 1);
    this.gfx.fillCircle(-5, 7, 2);
    this.gfx.fillCircle(5, 7, 2);
  }

  /** GorgeRush — thin pushbike + rider silhouette, magenta. */
  private drawPushbike(colour: number): void {
    this.gfx.fillStyle(colour, 1);
    this.gfx.fillRect(-2, -10, 4, 18);
    this.gfx.fillRect(-6, 0, 12, 2);
    this.gfx.fillCircle(0, -12, 3);
    this.gfx.fillStyle(COLOURS.road, 1);
    this.gfx.fillCircle(-4, 8, 2);
    this.gfx.fillCircle(4, 8, 2);
  }

  /** Glowing delivery bag (all brands). */
  private drawFoodBag(): void {
    this.gfx.fillStyle(COLOURS.cyan, 0.95);
    this.gfx.fillCircle(0, 2, 4);
    this.gfx.lineStyle(1, COLOURS.text, 0.7);
    this.gfx.strokeCircle(0, 2, 4);
  }

  update(delta: number): void {
    const { road, width } = getLayout();

    if (this.cfg.weave) {
      this.elapsed += delta / 1000;
      const offset = Math.sin(this.elapsed * this.cfg.weaveFreq * Math.PI * 2) * this.cfg.weaveAmp;
      const half = this.bodySize.w / 2;
      this.sprite.x = Phaser.Math.Clamp(
        this.baseX + offset,
        road.footpathWidth + half,
        width - road.footpathWidth - half,
      );
    }

    this.redraw();
  }

  getBounds(): Phaser.Geom.Rectangle {
    return this.sprite.getBounds();
  }

  getHitBounds(): Phaser.Geom.Rectangle {
    const b = this.sprite.getBounds();
    const g = COURIER.hitGenerosity;
    return new Phaser.Geom.Rectangle(b.x - g, b.y - g, b.width + g * 2, b.height + g * 2);
  }

  hit(): boolean {
    this.hp -= 1;
    if (this.hp > 0) {
      this.gfx.setAlpha(0.35);
      this.sprite.scene.time.delayedCall(80, () => {
        if (this.gfx.active) this.gfx.setAlpha(1);
      });
      return false;
    }
    return true;
  }

  get active(): boolean {
    return this.sprite?.active ?? false;
  }

  destroy(): void {
    if (this.gfx?.active) this.gfx.destroy();
    if (this.sprite?.active) this.sprite.destroy();
  }
}