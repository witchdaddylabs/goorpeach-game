import Phaser from 'phaser';
import { COLOUR_HEX } from '../config';

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

  constructor(scene: Phaser.Scene, levelName: string) {
    const cx = 240;

    scene.add
      .text(cx, 26, levelName.toUpperCase(), {
        fontFamily: 'Bungee',
        fontSize: '18px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);

    this.timerText = scene.add
      .text(cx, 46, '', { fontFamily: 'JetBrains Mono', fontSize: '11px', color: COLOUR_HEX.caution })
      .setOrigin(0.5);

    this.livesText = scene.add
      .text(60, 265, '', { fontFamily: 'JetBrains Mono', fontSize: '8px', color: COLOUR_HEX.text })
      .setOrigin(0.5);

    this.ammoText = scene.add
      .text(180, 265, '', { fontFamily: 'JetBrains Mono', fontSize: '8px', color: COLOUR_HEX.cyan })
      .setOrigin(0.5);

    this.scoreText = scene.add
      .text(320, 265, '', { fontFamily: 'JetBrains Mono', fontSize: '8px', color: COLOUR_HEX.bile })
      .setOrigin(0.5);

    scene.add
      .text(cx, 250, 'A/D ←→ steer • S↓ brake • SPACE fire • P menu', {
        fontFamily: 'JetBrains Mono',
        fontSize: '6px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);
  }

  update(state: HudState): void {
    this.livesText.setText(`LIVES:${state.lives}`);
    this.ammoText.setText(`AMMO:${state.ammo}`);
    this.scoreText.setText(`SCORE:${state.score}`);
    this.timerText.setText(`${Math.max(0, Math.ceil(state.secondsLeft))}s`);
  }
}
