import type { CourierBrand } from '../types';

/**
 * Courier — base class for the three delivery-rider brands.
 * Concrete basic version for DriveScene level 1 (slow traffic using real assets).
 * Full subclassing (ScooterCourier etc), HP, waves, and collision in next steps.
 */
import Phaser from 'phaser';

export class Courier {
  sprite: Phaser.Physics.Arcade.Sprite;
  readonly brand: CourierBrand;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    brand: CourierBrand = 'GoorPeach'
  ) {
    this.brand = brand;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setScale(0.72);
    this.sprite.setOrigin(0.5, 0.5);
    // Slow "oncoming" movement
    this.sprite.setVelocityY(55 + Math.random() * 25);
  }

  get active(): boolean {
    return this.sprite?.active ?? false;
  }

  destroy(): void {
    if (this.sprite?.active) this.sprite.destroy();
  }
}
