import Phaser from 'phaser';
import { COLOURS, COLOUR_HEX, POWERUP } from '../config';
import type { PowerUpKind } from '../types';

/**
 * PowerUp — fixed-spawn pickups (no RNG): ammo, tram-line boost, parma shield,
 * magpie swoop. Placement comes from src/data/levels.ts. Chunky palette icon
 * with a short label until dedicated sprites land.
 */
export class PowerUp {
  readonly kind: PowerUpKind;
  active = true;
  private readonly icon: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;
  private readonly x: number;
  private readonly y: number;

  private static readonly LABELS: Record<PowerUpKind, string> = {
    ammo: 'PEN',
    boost: 'SPD',
    shield: 'SHD',
    magpie: 'CLR',
  };

  constructor(scene: Phaser.Scene, x: number, y: number, kind: PowerUpKind) {
    this.kind = kind;
    this.x = x;
    this.y = y;

    this.icon = scene.add.graphics();
    this.icon.setPosition(x, y);
    this.icon.fillStyle(COLOURS.cyan, 1);
    this.icon.fillCircle(0, 0, POWERUP.visualRadius);

    this.label = scene.add
      .text(x, y, PowerUp.LABELS[kind], {
        fontFamily: 'JetBrains Mono',
        fontSize: '5px',
        color: COLOUR_HEX.textDark,
      })
      .setOrigin(0.5);
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
