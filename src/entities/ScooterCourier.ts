import Phaser from 'phaser';
import { Courier } from './Courier';

/** ScooterCourier — GoorPeach (peach orange). Fast, weaves, 1 HP. */
export class ScooterCourier extends Courier {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'GoorPeach');
  }
}