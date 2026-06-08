import Phaser from 'phaser';
import { Courier } from './Courier';

/**
 * ScooterCourier — GoorPeach (peach orange). Fast, weaves erratically, 1 HP.
 * Behaviour numbers come from COURIER.GoorPeach in config.ts.
 */
export class ScooterCourier extends Courier {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, 'GoorPeach');
  }
}
