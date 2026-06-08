import Phaser from 'phaser';
import { Courier } from './Courier';

/** EbikeCourier — ChewSnog (bile green). Tanky, holds lane, 2 HP. */
export class EbikeCourier extends Courier {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ChewSnog');
  }
}