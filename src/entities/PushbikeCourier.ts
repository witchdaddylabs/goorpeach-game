import { Courier } from './Courier';
import type { CourierBrand } from '../types';

/**
 * PushbikeCourier — GorgeRush (magenta). Slow, swarms in clusters of 3–5, 1 HP.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 7.
 */
export class PushbikeCourier extends Courier {
  readonly brand: CourierBrand = 'GorgeRush';
}
