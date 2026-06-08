import Phaser from 'phaser';
import { COLOURS, COLOUR_HEX, POWERUP } from '../config';
import { getLayout } from '../systems/Layout';
import type { PowerUpKind } from '../types';

/** Power-up pickup — scrolls with the road; collect by driving over it (not shooting). */
export class PowerUp {
  readonly kind: PowerUpKind;
  active = true;
  private readonly icon: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;
  private readonly x: number;
  private y: number;

  private static readonly LABELS: Record<PowerUpKind, string> = {
    ammo: 'PEN',
    boost: 'SPD',
    shield: 'SHD',
    magpie: 'MAG',
  };

  private static readonly COLOURS: Record<PowerUpKind, number> = {
    ammo: COLOURS.cyan,
    boost: COLOURS.caution,
    shield: COLOURS.bile,
    magpie: COLOURS.magenta,
  };

  constructor(scene: Phaser.Scene, x: number, y: number, kind: PowerUpKind) {
    this.kind = kind;
    this.x = x;
    this.y = y;

    this.icon = scene.add.graphics();
    this.icon.setDepth(7);
    this.drawIcon();

    this.label = scene.add
      .text(x, y, PowerUp.LABELS[kind], {
        fontFamily: 'JetBrains Mono',
        fontSize: '6px',
        color: COLOUR_HEX.textDark,
      })
      .setOrigin(0.5)
      .setDepth(7);
  }

  private drawIcon(): void {
    this.icon.clear();
    this.icon.fillStyle(PowerUp.COLOURS[this.kind], 1);
    this.icon.fillCircle(this.x, this.y, POWERUP.visualRadius);
    this.icon.lineStyle(2, COLOURS.text, 0.9);
    this.icon.strokeCircle(this.x, this.y, POWERUP.visualRadius);
  }

  update(delta: number, effectiveScroll: number): void {
    this.y += effectiveScroll * (delta / 1000);
    this.drawIcon();
    this.label.setPosition(this.x, this.y);
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
    this.label.destroy();
    this.active = false;
  }
}