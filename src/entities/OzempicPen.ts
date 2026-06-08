/**
 * OzempicPen — the player's projectile. Generous against couriers when fired
 * (CLAUDE.md rule 9). Ammo is limited and topped up by power-ups.
 *
 * Basic implementation for DriveScene level 1 (firing practice).
 * Uses a tinted proxy sprite until dedicated pen asset is adapted.
 */
import Phaser from 'phaser';

export class OzempicPen {
  sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Temporary visual using player asset (will be replaced by real pen sprite later)
    this.sprite = scene.physics.add.sprite(x, y, 'playerClean');
    this.sprite.setScale(0.22, 0.55);
    this.sprite.setTint(0xaaddff); // light pen-like color
    this.sprite.setOrigin(0.5, 0.5);

    // Fast forward (negative y = up the screen)
    this.sprite.setVelocityY(-480);

    this.sprite.setCollideWorldBounds(false);
  }

  get active(): boolean {
    return !!this.sprite && this.sprite.active;
  }

  destroy(): void {
    if (this.sprite?.active) {
      this.sprite.destroy();
    }
  }
}
