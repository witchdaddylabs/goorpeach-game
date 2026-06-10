import Phaser from 'phaser';
import { SCENES, COLOURS, COLOUR_HEX } from '../config';
import { Audio } from '../systems/Audio';
import { getLayout } from '../systems/Layout';
import { CrtOverlay } from '../ui/CrtOverlay';

/** Data passed in from DriveScene when a run ends in death. */
export interface GameOverData {
  message: string; // resolved death-cause line
  score: number; // run total at death (shown)
  levelId: number; // for "Restart Level"
  restartScore: number; // score the player entered this level with
  restartScene?: string; // scene to restart into (default DriveScene; boss uses BossScene)
}

/**
 * GameOverScene — death-cause text (per level, or the tram line), plus Restart
 * Level and Quit to Menu. Restart resumes the current suburb, not Richmond
 * (docs/BRIEF.md). One scene per file (CLAUDE.md).
 */
export class GameOverScene extends Phaser.Scene {
  private params!: GameOverData;

  constructor() {
    super(SCENES.GameOver);
  }

  init(data: GameOverData): void {
    this.params = data;
  }

  create(): void {
    const { width, height, centerX, centerY } = getLayout();
    new CrtOverlay(this);

    this.add.rectangle(centerX, centerY, width, height, COLOURS.textDark).setOrigin(0.5);

    this.add
      .text(centerX, height * 0.26, 'GAME OVER', { fontFamily: 'Bungee', fontSize: '34px', color: COLOUR_HEX.hazard })
      .setOrigin(0.5);

    this.add
      .text(centerX, height * 0.41, this.params.message, {
        fontFamily: 'JetBrains Mono',
        fontSize: '9px',
        color: COLOUR_HEX.text,
        align: 'center',
        wordWrap: { width: width - 40 },
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, height * 0.53, `SCORE: ${this.params.score}`, {
        fontFamily: 'JetBrains Mono',
        fontSize: '11px',
        color: COLOUR_HEX.bile,
      })
      .setOrigin(0.5);

    this.createButton('RESTART LEVEL', height * 0.62, () => {
      const target = this.params.restartScene ?? SCENES.Drive;
      this.scene.start(target, { levelId: this.params.levelId, score: this.params.restartScore });
    });
    this.createButton('SUBMIT SCORE', height * 0.72, () => {
      this.scene.start(SCENES.Scoreboard, { score: this.params.score, levelReached: this.params.levelId });
    });
    this.createButton('QUIT TO MENU', height * 0.82, () => {
      this.scene.start(SCENES.Menu);
    });

    // Defeat sting (through the Audio manager only — CLAUDE.md rule 3)
    const audio = this.registry.get('audio') as Audio | undefined;
    if (audio && !audio.isMuted) {
      try {
        audio.playSfx('gameoverSting', 0.8);
      } catch (e) {
        console.info('[GameOver] sting failed:', e);
      }
    }
  }

  private createButton(label: string, y: number, onActivate: () => void): void {
    const { width, centerX } = getLayout();
    const btnW = Math.min(184, width - 24);
    const bg = this.add.graphics();
    bg.fillStyle(COLOURS.road, 0.9);
    bg.fillRect(centerX - btnW / 2, y - 9, btnW, 20);

    const txt = this.add
      .text(centerX, y, label, { fontFamily: 'Bungee', fontSize: '12px', color: COLOUR_HEX.text })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    txt.on('pointerover', () => txt.setColor(COLOUR_HEX.cyan));
    txt.on('pointerout', () => txt.setColor(COLOUR_HEX.text));
    txt.on('pointerup', onActivate);
  }
}
