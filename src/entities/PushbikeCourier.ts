import Phaser from 'phaser';
import { Courier } from './Courier';

/**
 * PushbikeCourier — GorgeRush (magenta). Slow, swarms in clusters, 1 HP.
 * Behaviour numbers come from COURIER.GorgeRush in config.ts; swarming is
 * expressed by the level data spawning several at once.
 */
export class PushbikeCourier extends Courier {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, 'GorgeRush');
  }
}
