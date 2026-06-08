import Phaser from 'phaser';
import { COLOURS, COLOUR_HEX, TOUCH } from '../config';
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
  private brakePointer: Phaser.Input.Pointer | null = null;
  private firePending = false;

  constructor(scene: Phaser.Scene) {
    // Allow up to three simultaneous touches (steer + brake + fire).
    scene.input.addPointer(2);

    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);

    if (TOUCH.showHints && scene.sys.game.device.input.touch) {
      this.drawHints(scene);
    }
  }

  private static inZone(p: Phaser.Input.Pointer, z: { x: number; y: number; w: number; h: number }): boolean {
    return p.x >= z.x && p.x <= z.x + z.w && p.y >= z.y && p.y <= z.y + z.h;
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (TouchControls.inZone(pointer, TOUCH.fireZone)) {
      this.firePending = true;
    } else if (TouchControls.inZone(pointer, TOUCH.steerZone)) {
      this.steerPointer = pointer;
      this.steerAnchorX = pointer.x;
    } else if (TouchControls.inZone(pointer, TOUCH.brakeZone)) {
      this.brakePointer = pointer;
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer === this.steerPointer) this.steerPointer = null;
    if (pointer === this.brakePointer) this.brakePointer = null;
  }

  /** Current steering intent from active touches. */
  getState(): SteerIntent {
    let left = false;
    let right = false;

    if (this.steerPointer && this.steerPointer.isDown) {
      const dx = this.steerPointer.x - this.steerAnchorX;
      if (dx < -TOUCH.steerDeadzone) left = true;
      else if (dx > TOUCH.steerDeadzone) right = true;
    } else {
      this.steerPointer = null;
    }

    const brake = !!this.brakePointer && this.brakePointer.isDown;
    return { left, right, brake };
  }

  /** Edge-triggered fire: true once per tap in the fire zone. */
  consumeFire(): boolean {
    const fired = this.firePending;
    this.firePending = false;
    return fired;
  }

  private drawHints(scene: Phaser.Scene): void {
    const g = scene.add.graphics();
    g.fillStyle(COLOURS.cyan, TOUCH.hintAlpha);
    g.fillRect(TOUCH.steerZone.x, TOUCH.steerZone.y, TOUCH.steerZone.w, TOUCH.steerZone.h);
    g.fillStyle(COLOURS.caution, TOUCH.hintAlpha);
    g.fillRect(TOUCH.brakeZone.x, TOUCH.brakeZone.y, TOUCH.brakeZone.w, TOUCH.brakeZone.h);
    g.fillStyle(COLOURS.hazard, TOUCH.hintAlpha);
    g.fillRect(TOUCH.fireZone.x, TOUCH.fireZone.y, TOUCH.fireZone.w, TOUCH.fireZone.h);

    const tag = (x: number, y: number, s: string): void => {
      scene.add
        .text(x, y, s, { fontFamily: 'JetBrains Mono', fontSize: '6px', color: COLOUR_HEX.text })
        .setOrigin(0.5)
        .setAlpha(0.5);
    };
    tag(TOUCH.steerZone.x + TOUCH.steerZone.w / 2, TOUCH.steerZone.y + 12, 'DRAG TO STEER');
    tag(TOUCH.brakeZone.x + TOUCH.brakeZone.w / 2, TOUCH.brakeZone.y + 12, 'BRAKE');
    tag(TOUCH.fireZone.x + TOUCH.fireZone.w / 2, TOUCH.fireZone.y + 12, 'TAP FIRE');
  }
}
