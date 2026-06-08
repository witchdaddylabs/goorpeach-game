import type { CourierBrand } from '../types';

/**
 * Courier — base class for the three delivery-rider brands. Subclasses set HP,
 * speed, and movement behaviour. All tuning numbers come from config.ts.
 *
 * TODO: implement (likely extending a Phaser sprite/container). See CLAUDE.md
 * working pattern, step 6.
 */
export abstract class Courier {
  abstract readonly brand: CourierBrand;
}
