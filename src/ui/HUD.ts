import Phaser from 'phaser';
import { COLOUR_HEX } from '../config';
import { getLayout } from '../systems/Layout';

/** Live values the HUD renders each frame. */
export interface HudState {
  lives: number;
  ammo: number;
  score: number;
  secondsLeft: number;
}

/**
 * HUD — lives, ammo, score and the level timer (CLAUDE.md: HUD lives in ui/).
 * Bungee for the level title, JetBrains Mono for tabular readouts. Colours come
 * from config tokens; pairings are chosen for legibility on the dark road.
 */
export class HUD {
  private readonly timerText: Phaser.GameObjects.Text;
  private readonly livesText: Phaser.GameObjects.Text;
  private readonly ammoText: Phaser.GameObjects.Text;
  private readonly scoreText: Phaser.GameObjects.Text;

  // Last rendered values — only call setText (which re-rasterises the text
  // texture) when a value actually changes, instead of every frame.
  private lastLives = NaN;
  private lastAmmo = NaN;
  private lastScore = NaN;
  private lastSeconds = NaN;

  constructor(scene: Phaser.Scene, levelName: string) {
    const { centerX, hud } = getLayout();

    scene.add
      .text(centerX, hud.titleY, levelName.toUpperCase(), {
        fontFamily: 'Bungee',
        fontSize: '18px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);

    this.timerText = scene.add
      .text(centerX, hud.timerY, '', { fontFamily: 'JetBrains Mono', fontSize: '11px', color: COLOUR_HEX.caution })
      .setOrigin(0.5);

    this.livesText = scene.add
      .text(hud.livesX, hud.footerY, '', { fontFamily: 'JetBrains Mono', fontSize: '8px', color: COLOUR_HEX.text })
      .setOrigin(0.5);

    this.ammoText = scene.add
      .text(hud.ammoX, hud.footerY, '', { fontFamily: 'JetBrains Mono', fontSize: '8px', color: COLOUR_HEX.cyan })
      .setOrigin(0.5);

    this.scoreText = scene.add
      .text(hud.scoreX, hud.footerY, '', { fontFamily: 'JetBrains Mono', fontSize: '8px', color: COLOUR_HEX.bile })
      .setOrigin(0.5);

    scene.add
      .text(centerX, hud.hintY, 'A/D ←→ steer • S↓ brake • SPACE fire • P menu', {
        fontFamily: 'JetBrains Mono',
        fontSize: '6px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);
  }

  update(state: HudState): void {
    if (state.lives !== this.lastLives) {
      this.lastLives = state.lives;
      this.livesText.setText(`LIVES:${state.lives}`);
    }
    if (state.ammo !== this.lastAmmo) {
      this.lastAmmo = state.ammo;
      this.ammoText.setText(`AMMO:${state.ammo}`);
    }
    if (state.score !== this.lastScore) {
      this.lastScore = state.score;
      this.scoreText.setText(`SCORE:${state.score}`);
    }
    const secs = Math.max(0, Math.ceil(state.secondsLeft));
    if (secs !== this.lastSeconds) {
      this.lastSeconds = secs;
      this.timerText.setText(`${secs}s`);
    }
  }
}