import Phaser from 'phaser';
import { POWERUP } from '../config';
import { getLayout } from '../systems/Layout';
import type { PowerUpKind } from '../types';

/** Power-up pickup — scrolls with the road; collect by driving over it (not shooting). */
export class PowerUp {
  readonly kind: PowerUpKind;
  active = true;
  private readonly icon: Phaser.GameObjects.Image;
  private readonly x: number;
  private baseY: number;
  private y: number;
  private phase: number;

  constructor(scene: Phaser.Scene, x: number, y: number, kind: PowerUpKind) {
    this.kind = kind;
    this.x = x;
    this.baseY = y;
    this.y = y;
    this.phase = Math.random() * Math.PI * 2;

    this.icon = scene.add.image(x, y, POWERUP.textures[kind]);
    this.icon.setDisplaySize(POWERUP.iconSize, POWERUP.iconSize);
    this.icon.setOrigin(0.5, 0.5);
    this.icon.setDepth(7);
  }

  update(delta: number, effectiveScroll: number): void {
    this.baseY += effectiveScroll * (delta / 1000);
    this.phase += (delta / 1000) * POWERUP.floatHz * Math.PI * 2;
    this.y = this.baseY + Math.sin(this.phase) * POWERUP.floatAmp;
    this.icon.setPosition(this.x, this.y);
  }

  get offscreen(): boolean {
    const { road } = getLayout();
    return this.y > road.bottomY + POWERUP.visualRadius;
  }

  getBounds(): Phaser.Geom.Rectangle {
    const r = POWERUP.visualRadius;
    return new Phaser.Geom.Rectangle(this.x - r, this.y - r, r * 2, r * 2);
  }

  destroy(): void {
    this.icon.destroy();
    this.active = false;
  }
}