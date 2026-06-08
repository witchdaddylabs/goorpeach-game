/**
 * PlayerCar — the VN Commodore. Steering, braking, and three damage states
 * (clean → cracked → wrecked). Player-favouring hitbox (CLAUDE.md rule 9).
 * All numbers from config.ts.
 *
 * Implemented for DriveScene level 1 (Richmond only, no couriers yet).
 */
import Phaser from 'phaser';
import { PLAYER } from '../config';

export class PlayerCar {
  sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private currentSpeed: number;
  private maxSpeed: number;
  private steerSpeed: number;

  lives: number;
  ammo: number = 5; // starting ammo for tutorial
  hasShield: boolean = false;
  boostEndTime: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setScale(0.85);
    this.sprite.setOrigin(0.5, 0.5);

    this.sprite.body!.setSize(
      this.sprite.width - PLAYER.hitboxPadding * 2,
      this.sprite.height - PLAYER.hitboxPadding * 2
    );

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.cursors.left = scene.input.keyboard!.addKey('A');
    this.cursors.right = scene.input.keyboard!.addKey('D');
    this.cursors.down = scene.input.keyboard!.addKey('S');

    this.maxSpeed = PLAYER.forwardSpeed;
    this.currentSpeed = this.maxSpeed;
    this.steerSpeed = PLAYER.steerSpeed;
    this.lives = PLAYER.startingLives;
  }

  update(delta: number, now: number): void {
    const dt = delta / 1000;
    const sprite = this.sprite;

    // Apply boost if active
    const speedMult = (now < this.boostEndTime) ? 1.5 : 1.0;
    const effectiveSteer = this.steerSpeed * speedMult;

    if (this.cursors.left.isDown) {
      sprite.x -= effectiveSteer * dt;
    }
    if (this.cursors.right.isDown) {
      sprite.x += effectiveSteer * dt;
    }

    if (this.cursors.down.isDown) {
      this.currentSpeed = Math.max(this.maxSpeed * PLAYER.brakeMultiplier, 40);
    } else {
      this.currentSpeed = Phaser.Math.Linear(
        this.currentSpeed,
        this.maxSpeed,
        0.08
      );
    }

    const targetY = 135 + (this.currentSpeed - this.maxSpeed) * 0.1;
    sprite.y = Phaser.Math.Linear(sprite.y, targetY, 0.1);

    const halfW = sprite.displayWidth / 2;
    sprite.x = Phaser.Math.Clamp(sprite.x, 60 + halfW, 420 - halfW);
    sprite.y = Phaser.Math.Clamp(sprite.y, 70, 200);
  }

  getSpeed(): number {
    return this.currentSpeed;
  }

  takeDamage(): boolean {
    if (this.hasShield) {
      this.hasShield = false;
      this.sprite.setTint(0x88ff88);
      this.scene.time.delayedCall(300, () => {
        if (this.sprite?.active) this.sprite.clearTint();
      });
      return false;
    }

    this.lives--;
    this.sprite.setTint(0xffaaaa);
    this.scene.time.delayedCall(250, () => {
      if (this.sprite?.active) this.sprite.clearTint();
    });
    return this.lives <= 0;
  }

  addAmmo(amount: number): void {
    this.ammo += amount;
  }

  applyBoost(durationMs: number): void {
    this.boostEndTime = Date.now() + durationMs;
  }

  applyShield(): void {
    this.hasShield = true;
    this.sprite.setTint(0x88ff88);
  }

  canFire(): boolean {
    return this.ammo > 0;
  }

  consumeAmmo(): void {
    if (this.ammo > 0) this.ammo--;
  }
}
