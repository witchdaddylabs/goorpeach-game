import { Courier } from './Courier';
import type { CourierBrand } from '../types';

/**
 * EbikeCourier — ChewSnog (bile green). Tanky, holds its lane, 2 HP.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 7.
 */
export class EbikeCourier extends Courier {
  readonly brand: CourierBrand = 'ChewSnog';
}
