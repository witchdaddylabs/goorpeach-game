/**
 * ScreenShake — camera rumble for impacts. Skipped when reduced motion is on.
 */
import Phaser from 'phaser';
import { SCREEN_SHAKE } from '../config';
import { Persistence } from './Persistence';

export class ScreenShake {
  private static enabled(): boolean {
    return !Persistence.getSettings().reducedMotion;
  }

  static courierHit(scene: Phaser.Scene): void {
    if (!ScreenShake.enabled()) return;
    scene.cameras.main.shake(
      SCREEN_SHAKE.courierHitDurationMs / 1000,
      SCREEN_SHAKE.courierHitIntensity,
    );
  }

  static tramDeath(scene: Phaser.Scene): void {
    if (!ScreenShake.enabled()) return;
    scene.cameras.main.shake(
      SCREEN_SHAKE.tramDeathDurationMs / 1000,
      SCREEN_SHAKE.tramDeathIntensity,
    );
  }
}