import Phaser from 'phaser';
import { COLOURS, COLOUR_HEX } from '../config';
import { getLayout } from '../systems/Layout';
import { Persistence } from '../systems/Persistence';
import type { SteerIntent } from '../types';

/**
 * TouchControls — the ONLY home for touch input (CLAUDE.md rule 5). Mobile-first:
 * drag the lower-left to steer, hold the lower-right to brake, tap the upper-right
 * to fire (docs/BRIEF.md).
 *
 * It exposes the same semantics the keyboard does — a per-frame SteerIntent via
 * getState() and an edge-triggered consumeFire() — so the scene merges both
 * without knowing which fired. Faint zone hints are drawn on touch devices only.
 */
export class TouchControls {
  private steerPointer: Phaser.Input.Pointer | null = null;
  private steerAnchorX = 0;
  private steerAnchorY = 0;
  private lastSteerX = 0;
  private brakePointer: Phaser.Input.Pointer | null = null;
  private firePending = false;

  constructor(scene: Phaser.Scene) {
    // Allow up to three simultaneous touches (steer + brake + fire).
    scene.input.addPointer(2);

    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);

    const touch = getLayout().touch;
    if (touch.showHints && scene.sys.game.device.input.touch) {
      this.drawHints(scene, touch);
    }
  }

  private static inZone(p: Phaser.Input.Pointer, z: { x: number; y: number; w: number; h: number }): boolean {
    return p.x >= z.x && p.x <= z.x + z.w && p.y >= z.y && p.y <= z.y + z.h;
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    const touch = getLayout().touch;
    if (TouchControls.inZone(pointer, touch.fireZone)) {
      this.firePending = true;
    } else if (TouchControls.inZone(pointer, touch.steerZone)) {
      this.steerPointer = pointer;
      this.steerAnchorX = pointer.x;
      this.steerAnchorY = pointer.y;
      this.lastSteerX = pointer.x;
    } else if (TouchControls.inZone(pointer, touch.brakeZone)) {
      this.brakePointer = pointer;
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer === this.steerPointer) this.steerPointer = null;
    if (pointer === this.brakePointer) this.brakePointer = null;
  }

  /** Current steering intent from active touches. */
  getState(): SteerIntent {
    const touch = getLayout().touch;
    const settings = Persistence.getSettings();
    const deadzone = touch.steerDeadzone / settings.touchSteerSensitivity;
    let left = false;
    let right = false;

    if (this.steerPointer && this.steerPointer.isDown) {
      const dx =
        settings.touchInputMode === 'swipe'
          ? this.steerPointer.x - this.lastSteerX
          : this.steerPointer.x - this.steerAnchorX;
      this.lastSteerX = this.steerPointer.x;
      if (dx < -deadzone) left = true;
      else if (dx > deadzone) right = true;
    } else {
      this.steerPointer = null;
    }

    const brake = !!this.brakePointer && this.brakePointer.isDown;
    return { left, right, brake };
  }

  /**
   * 2D move vector in [-1,1] from the steer-zone drag — used by the boss arena
   * where the player moves freely rather than steering in lanes.
   */
  getMoveVector(): { x: number; y: number } {
    const touch = getLayout().touch;
    const sensitivity = Persistence.getSettings().touchSteerSensitivity;
    if (this.steerPointer && this.steerPointer.isDown) {
      const dx = this.steerPointer.x - this.steerAnchorX;
      const dy = this.steerPointer.y - this.steerAnchorY;
      const range = touch.moveRange / sensitivity;
      return {
        x: Phaser.Math.Clamp(dx / range, -1, 1),
        y: Phaser.Math.Clamp(dy / range, -1, 1),
      };
    }
    this.steerPointer = null;
    return { x: 0, y: 0 };
  }

  /** Edge-triggered fire: true once per tap in the fire zone. */
  consumeFire(): boolean {
    const fired = this.firePending;
    this.firePending = false;
    return fired;
  }

  private drawHints(
    scene: Phaser.Scene,
    touch: ReturnType<typeof getLayout>['touch'],
  ): void {
    const g = scene.add.graphics();
    g.fillStyle(COLOURS.cyan, touch.hintAlpha);
    g.fillRect(touch.steerZone.x, touch.steerZone.y, touch.steerZone.w, touch.steerZone.h);
    g.fillStyle(COLOURS.caution, touch.hintAlpha);
    g.fillRect(touch.brakeZone.x, touch.brakeZone.y, touch.brakeZone.w, touch.brakeZone.h);
    g.fillStyle(COLOURS.hazard, touch.hintAlpha);
    g.fillRect(touch.fireZone.x, touch.fireZone.y, touch.fireZone.w, touch.fireZone.h);

    const tag = (x: number, y: number, s: string): void => {
      scene.add
        .text(x, y, s, { fontFamily: 'JetBrains Mono', fontSize: '6px', color: COLOUR_HEX.text })
        .setOrigin(0.5)
        .setAlpha(0.5);
    };
    tag(touch.steerZone.x + touch.steerZone.w / 2, touch.steerZone.y + 12, 'DRAG TO STEER');
    tag(touch.brakeZone.x + touch.brakeZone.w / 2, touch.brakeZone.y + 12, 'BRAKE');
    tag(touch.fireZone.x + touch.fireZone.w / 2, touch.fireZone.y + 12, 'TAP FIRE');
  }
}