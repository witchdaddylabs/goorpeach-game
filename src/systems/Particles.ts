/**
 * Particles — chunky deterministic bursts (no RNG). Skipped when reduced motion on.
 */
import Phaser from 'phaser';
import { COLOURS, PARTICLES } from '../config';
import { Persistence } from './Persistence';

type BurstKind = 'courierBurst' | 'tramSparks';

const BURST_COLOURS: Record<BurstKind, readonly number[]> = {
  courierBurst: [COLOURS.hazard, COLOURS.magenta, COLOURS.caution, COLOURS.bile],
  tramSparks: [COLOURS.caution, COLOURS.hazard, COLOURS.text, COLOURS.footpath],
};

export class Particles {
  static burst(scene: Phaser.Scene, x: number, y: number, kind: BurstKind): void {
    if (Persistence.getSettings().reducedMotion) return;

    const preset = PARTICLES[kind];
    const colours = BURST_COLOURS[kind];

    for (let i = 0; i < preset.count; i++) {
      const angle = (i / preset.count) * Math.PI * 2;
      const colour = colours[i % colours.length] ?? COLOURS.hazard;
      const piece = scene.add
        .rectangle(x, y, preset.size, preset.size, colour)
        .setDepth(PARTICLES.depth)
        .setOrigin(0.5);
      scene.tweens.add({
        targets: piece,
        x: x + Math.cos(angle) * preset.spread,
        y: y + Math.sin(angle) * preset.spread,
        alpha: 0,
        angle: i * 45,
        duration: preset.durationMs,
        ease: 'Quad.easeOut',
        onComplete: () => piece.destroy(),
      });
    }
  }
}