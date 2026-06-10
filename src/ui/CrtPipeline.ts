import Phaser from 'phaser';
import { CRT } from '../config';

/**
 * CrtPipeline — a WebGL post-processing pass that turns the flat scanline overlay
 * into a real curved CRT tube: barrel curvature, scanlines, RGB chromatic
 * aberration and a vignette. All intensities come from CRT in config.ts (rule 1).
 *
 * Applied per-scene camera by ui/CrtOverlay.ts, which also flips `reduced` so
 * reduced-motion users get flat scanlines with no distortion. Falls back to the
 * Graphics overlay on Canvas renderers (handled in CrtOverlay).
 */
export const CRT_PIPELINE_KEY = 'CrtPipeline';

const fragShader = `
precision mediump float;
uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uReduced;
varying vec2 outTexCoord;

const float CURVE = ${CRT.curvature.toFixed(4)};
const float SCAN = ${CRT.scanlineDepth.toFixed(4)};
const float ABERR = ${CRT.aberration.toFixed(5)};
const float VIG = ${CRT.vignette.toFixed(4)};

void main() {
  vec2 uv = outTexCoord;
  vec2 cc = uv - 0.5;
  float dist = dot(cc, cc);

  // Barrel curvature (skipped under reduced motion)
  float curve = mix(CURVE, 0.0, uReduced);
  vec2 cuv = uv + cc * dist * curve;

  // Outside the tube = black bezel
  if (cuv.x < 0.0 || cuv.x > 1.0 || cuv.y < 0.0 || cuv.y > 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // Chromatic aberration, stronger toward the edges (skipped under reduced motion)
  float ab = mix(ABERR, 0.0, uReduced) * (0.4 + dist);
  vec3 col;
  col.r = texture2D(uMainSampler, cuv + vec2(ab, 0.0)).r;
  col.g = texture2D(uMainSampler, cuv).g;
  col.b = texture2D(uMainSampler, cuv - vec2(ab, 0.0)).b;

  // Scanlines — one dark gap per output row
  float s = sin(cuv.y * uResolution.y * 3.14159265);
  col *= 1.0 - SCAN * (0.5 - 0.5 * s);

  // Vignette
  col *= clamp(1.0 - VIG * dist * 2.0, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

export class CrtPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  /** Flattened (no curvature/aberration) when the player asks for reduced motion. */
  reduced = false;

  constructor(game: Phaser.Game) {
    super({ game, fragShader });
  }

  onPreRender(): void {
    this.set1f('uReduced', this.reduced ? 1 : 0);
    this.set2f('uResolution', this.renderer.width, this.renderer.height);
  }
}
