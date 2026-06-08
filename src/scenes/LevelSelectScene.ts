import Phaser from 'phaser';
import { SCENES, COLOURS, COLOUR_HEX } from '../config';
import { LEVELS } from '../data/levels';
import { Persistence } from '../systems/Persistence';

/**
 * LevelSelectScene — pick a suburb. Levels unlock progressively (the furthest
 * reached is stored via Persistence); locked suburbs show a padlock. Selecting
 * an unlocked driving level starts it; the final entry is the Kew boss arena.
 */
export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super(SCENES.LevelSelect);
  }

  create(): void {
    const cx = 240;
    this.add.rectangle(cx, 135, 480, 270, COLOURS.road).setOrigin(0.5);
    this.add
      .text(cx, 28, 'SELECT SUBURB', { fontFamily: 'Bungee', fontSize: '20px', color: COLOUR_HEX.text })
      .setOrigin(0.5);

    const highest = Persistence.getHighestUnlocked();

    // Driving suburbs from level data, plus the Kew boss arena as the finale.
    const entries: { id: number; name: string; boss: boolean }[] = [
      ...LEVELS.map((l) => ({ id: l.id, name: l.name, boss: false })),
      { id: 5, name: 'Kew — The Nerd', boss: true },
    ];

    let y = 70;
    for (const entry of entries) {
      const unlocked = entry.id <= highest;
      this.createRow(entry.name, entry.boss, unlocked, y, () => {
        if (entry.boss) this.scene.start(SCENES.Boss, { score: 0 });
        else this.scene.start(SCENES.Drive, { levelId: entry.id });
      });
      y += 30;
    }

    const back = this.add
      .text(cx, 242, 'BACK', { fontFamily: 'Bungee', fontSize: '13px', color: COLOUR_HEX.cyan })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    back.on('pointerover', () => back.setColor(COLOUR_HEX.hazard));
    back.on('pointerout', () => back.setColor(COLOUR_HEX.cyan));
    back.on('pointerup', () => this.scene.start(SCENES.Menu));
  }

  private createRow(name: string, boss: boolean, unlocked: boolean, y: number, onSelect: () => void): void {
    const cx = 240;
    const bg = this.add.graphics();
    bg.fillStyle(unlocked ? COLOURS.textDark : COLOURS.road, unlocked ? 0.9 : 0.6);
    bg.fillRect(cx - 150, y - 11, 300, 24);
    if (boss && unlocked) bg.lineStyle(2, COLOURS.magenta, 1).strokeRect(cx - 150, y - 11, 300, 24);

    const label = unlocked ? name : `${name}  — LOCKED`;
    const txt = this.add
      .text(cx - 138, y, label, {
        fontFamily: boss ? 'Bungee' : 'JetBrains Mono',
        fontSize: boss ? '12px' : '11px',
        color: unlocked ? (boss ? COLOUR_HEX.magenta : COLOUR_HEX.text) : COLOUR_HEX.road,
      })
      .setOrigin(0, 0.5);

    if (!unlocked) {
      txt.setColor(COLOUR_HEX.footpath).setAlpha(0.45);
      return;
    }

    txt.setInteractive({ useHandCursor: true });
    txt.on('pointerover', () => txt.setColor(COLOUR_HEX.cyan));
    txt.on('pointerout', () => txt.setColor(boss ? COLOUR_HEX.magenta : COLOUR_HEX.text));
    txt.on('pointerup', onSelect);
  }
}
