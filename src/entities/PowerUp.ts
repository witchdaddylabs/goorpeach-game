import type { PowerUpKind } from '../types';

/**
 * PowerUp — fixed-spawn pickups (no RNG): ammo, tram-line boost, parma shield,
 * magpie swoop. Placement comes from src/data/levels.ts.
 *
 * Basic visual + bounds for DriveScene level 1. Full effects in scene.
 */
import Phaser from 'phaser';
import { COLOURS } from '../config';

export class PowerUp {
  sprite: Phaser.GameObjects.Graphics;
  kind: PowerUpKind;
  active: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, kind: PowerUpKind) {
    this.kind = kind;
    this.sprite = scene.add.graphics();
    this.sprite.setPosition(x, y);

    // Simple chunky icon using palette (no dedicated sprites yet)
    this.sprite.clear();
    this.sprite.fillStyle(COLOURS.cyan, 1);
    this.sprite.fillCircle(0, 0, 10);

    const labelMap: Record<PowerUpKind, string> = {
      ammo: 'PEN',
      boost: 'SPD',
      shield: 'SHD',
      magpie: 'CLR',
    };
    const label = scene.add.text(x, y, labelMap[kind], {
      fontFamily: 'JetBrains Mono',
      fontSize: '5px',
      color: '#1a1a22',
    }).setOrigin(0.5);

    (this.sprite as any).label = label;
  }

  getBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(this.sprite.x - 10, this.sprite.y - 10, 20, 20);
  }

  destroy(): void {
    if (this.sprite) {
      const label = (this.sprite as any).label;
      if (label) label.destroy();
      this.sprite.destroy();
    }
    this.active = false;
  }
}
