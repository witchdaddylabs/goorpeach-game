import Phaser from 'phaser';
import { Courier } from './Courier';

/**
 * EbikeCourier — ChewSnog (bile green). Tanky, holds its lane, 2 HP.
 * Behaviour numbers come from COURIER.ChewSnog in config.ts.
 */
export class EbikeCourier extends Courier {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, 'ChewSnog');
  }
}
