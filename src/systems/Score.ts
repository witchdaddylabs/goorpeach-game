import { SCORING } from '../config';
import type { CourierBrand } from '../types';

/**
 * Score — tracks the running total for a single playthrough, config-driven from
 * SCORING. DriveScene and BossScene feed it events during implementation; at the
 * end of a run the total is offered to systems/Scoreboard.ts.
 *
 * Plain TypeScript (no Phaser) so it is unit-testable.
 */
export class Score {
  private total = 0;

  get value(): number {
    return this.total;
  }

  reset(): void {
    this.total = 0;
  }

  /** Seed the running total — used to carry score across levels in one run. */
  seed(value: number): void {
    this.total = value;
  }

  /** A courier was taken out — points depend on brand difficulty. */
  addCourier(brand: CourierBrand): void {
    this.total += SCORING.courierPoints[brand];
  }

  /** A driving level was cleared, with `secondsRemaining` on the clock. */
  addLevelClear(secondsRemaining: number): void {
    const survival = Math.max(0, Math.floor(secondsRemaining)) * SCORING.survivalBonusPerSecond;
    this.total += SCORING.levelClearBonus + survival;
  }

  /** The Nerd was defeated. */
  addBossDefeat(): void {
    this.total += SCORING.bossDefeatBonus;
  }
}
