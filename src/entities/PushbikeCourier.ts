import Phaser from 'phaser';
import { Courier } from './Courier';

/** PushbikeCourier — GorgeRush (magenta). Slow swarms, 1 HP. */
export class PushbikeCourier extends Courier {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'GorgeRush');
  }
}