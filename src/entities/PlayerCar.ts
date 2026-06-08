import Phaser from 'phaser';
import { PLAYER, ROAD } from '../config';
import type { SteerIntent } from '../types';

/**
 * PlayerCar — the VN Commodore. Steering, braking, and (later) three damage
 * states. Player-favouring hitbox (CLAUDE.md rule 9). All numbers from config.ts.
 *
 * Input-agnostic: the scene passes a SteerIntent each frame built from keyboard
 * and/or touch, so this entity never reads the keyboard directly (rule 5).
 */
export class PlayerCar {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly scene: Phaser.Scene;
  private currentSpeed: number;
  private readonly maxSpeed: number;
  private readonly steerSpeed: number;

  lives: number;
  ammo: number = PLAYER.startingAmmo;
  hasShield = false;
  boostEndTime = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setScale(PLAYER.scale);
    this.sprite.setOrigin(0.5, 0.5);

    this.sprite.body?.setSize(
      this.sprite.width - PLAYER.hitboxPadding * 2,
      this.sprite.height - PLAYER.hitboxPadding * 2,
    );

    this.maxSpeed = PLAYER.forwardSpeed;
    this.currentSpeed = this.maxSpeed;
    this.steerSpeed = PLAYER.steerSpeed;
    this.lives = PLAYER.startingLives;
  }

  update(delta: number, now: number, intent: SteerIntent): void {
    const dt = delta / 1000;
    const sprite = this.sprite;

    const speedMult = now < this.boostEndTime ? PLAYER.boostMultiplier : 1.0;
    const effectiveSteer = this.steerSpeed * speedMult;

    if (intent.left) sprite.x -= effectiveSteer * dt;
    if (intent.right) sprite.x += effectiveSteer * dt;

    if (intent.brake) {
      this.currentSpeed = Math.max(this.maxSpeed * PLAYER.brakeMultiplier, 40);
    } else {
      this.currentSpeed = Phaser.Math.Linear(this.currentSpeed, this.maxSpeed, 0.08);
    }

    const targetY = 135 + (this.currentSpeed - this.maxSpeed) * 0.1;
    sprite.y = Phaser.Math.Linear(sprite.y, targetY, 0.1);

    const halfW = sprite.displayWidth / 2;
    sprite.x = Phaser.Math.Clamp(sprite.x, ROAD.footpathWidth + halfW, 480 - ROAD.footpathWidth - halfW);
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

    this.lives -= 1;
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
    if (this.ammo > 0) this.ammo -= 1;
  }
}
