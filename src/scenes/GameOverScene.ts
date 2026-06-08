import Phaser from 'phaser';
import { SCENES, COLOURS, COLOUR_HEX } from '../config';
import { Audio } from '../systems/Audio';

/** Data passed in from DriveScene when a run ends in death. */
export interface GameOverData {
  message: string; // resolved death-cause line
  score: number;
  levelId: number; // for "Restart Level"
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
    const cx = 240;

    this.add.rectangle(cx, 135, 480, 270, COLOURS.textDark).setOrigin(0.5);

    this.add
      .text(cx, 70, 'GAME OVER', { fontFamily: 'Bungee', fontSize: '34px', color: COLOUR_HEX.hazard })
      .setOrigin(0.5);

    this.add
      .text(cx, 110, this.params.message, {
        fontFamily: 'JetBrains Mono',
        fontSize: '9px',
        color: COLOUR_HEX.text,
        align: 'center',
        wordWrap: { width: 400 },
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 142, `SCORE: ${this.params.score}`, {
        fontFamily: 'JetBrains Mono',
        fontSize: '11px',
        color: COLOUR_HEX.bile,
      })
      .setOrigin(0.5);

    this.createButton('RESTART LEVEL', 180, () => {
      this.scene.start(SCENES.Drive, { levelId: this.params.levelId });
    });
    this.createButton('QUIT TO MENU', 210, () => {
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
    const cx = 240;
    const bg = this.add.graphics();
    bg.fillStyle(COLOURS.road, 0.9);
    bg.fillRect(cx - 92, y - 9, 184, 20);

    const txt = this.add
      .text(cx, y, label, { fontFamily: 'Bungee', fontSize: '12px', color: COLOUR_HEX.text })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    txt.on('pointerover', () => txt.setColor(COLOUR_HEX.cyan));
    txt.on('pointerout', () => txt.setColor(COLOUR_HEX.text));
    txt.on('pointerup', onActivate);
  }
}
