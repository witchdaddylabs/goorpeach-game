import type { PowerUpKind } from '../types';

/**
 * PowerUp — fixed-spawn pickups (no RNG): ammo, tram-line boost, parma shield,
 * magpie swoop. Placement comes from src/data/levels.ts.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 9.
 */
export class PowerUp {
  constructor(public readonly kind: PowerUpKind) {}
}
