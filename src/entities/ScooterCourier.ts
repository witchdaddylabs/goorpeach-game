import { Courier } from './Courier';
import type { CourierBrand } from '../types';

/**
 * ScooterCourier — GoorPeach (peach orange). Fast, weaves erratically, 1 HP.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 6.
 */
export class ScooterCourier extends Courier {
  readonly brand: CourierBrand = 'GoorPeach';
}
