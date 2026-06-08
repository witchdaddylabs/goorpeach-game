import Phaser from 'phaser';
import { SCENES, COLOURS, COLOUR_HEX, AUDIO_PATHS, SPRITE_PATHS } from '../config';
import { getLayout } from '../systems/Layout';

/**
 * PreloadScene — loads all assets with a real progress bar drawn against the
 * actual asset count (no vague spinner — CLAUDE.md).
 *
 * For the first milestone we load a minimal set (menu music + early SFX + two
 * placeholder sprite references). Real files per docs/ASSETS.md will be dropped
 * into public/ later; missing files are expected and logged at info level only.
 * The bar is driven by Phaser's loader progress events.
 */
export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private percentText!: Phaser.GameObjects.Text;
  private assetText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENES.Preload);
  }

  preload(): void {
    // Progress UI must exist before loader events fire (preload runs before create).
    this.buildProgressUi();

    // Real assets the user dumped into public/sprites and public/audio.
    // We now load the actual files so the progress bar and game use real content.

    // Every AUDIO_PATHS key must be preloaded — Phaser keys are not shared by path.
    for (const [key, path] of Object.entries(AUDIO_PATHS)) {
      this.load.audio(key, path);
    }

    // All sprite paths — Phaser texture key matches the config key
    for (const [key, path] of Object.entries(SPRITE_PATHS)) {
      this.load.image(key, path);
    }

    // Real progress bar driven by actual loads
    this.load.on('progress', (progress: number) => {
      this.updateProgressBar(progress);
    });

    this.load.on('filecomplete', (_key: string, _type: string, _data: unknown) => {
      if (this.assetText) {
        this.assetText.setText(_key);
      }
    });

    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.info('[Preload] could not load (will use placeholder or later asset):', file.src);
    });

    this.load.on('complete', () => {
      this.time.delayedCall(90, () => {
        this.scene.start(SCENES.Menu);
      });
    });
  }

  private buildProgressUi(): void {
    const { width, height, centerX, centerY } = getLayout();

    // Dark road background
    this.add.rectangle(centerX, centerY, width, height, COLOURS.road).setOrigin(0.5);

    // Chunky title using Bungee (fonts loaded in index.html)
    this.add
      .text(centerX, centerY - height * 0.19, 'GOORPEACH', {
        fontFamily: 'Bungee',
        fontSize: '28px',
        color: COLOUR_HEX.text,
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY - height * 0.08, 'APOCALYPSE', {
        fontFamily: 'Bungee',
        fontSize: '14px',
        color: COLOUR_HEX.hazard,
        align: 'center',
      })
      .setOrigin(0.5);

    // Progress box (cream outline, hard)
    this.progressBox = this.add.graphics();
    this.progressBox.lineStyle(2, COLOURS.text, 0.9);
    this.progressBox.strokeRect(centerX - 70, centerY + 8, 140, 14);

    // Dynamic fill bar (cyan / hazard accent)
    this.progressBar = this.add.graphics();

    // Percentage (JetBrains Mono for tabular/arcade numeric feel)
    this.percentText = this.add
      .text(centerX, centerY + 32, '0%', {
        fontFamily: 'JetBrains Mono',
        fontSize: '11px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);

    // Current asset key (tiny, shows it's actually counting real queued items)
    this.assetText = this.add
      .text(centerX, centerY + 48, '', {
        fontFamily: 'JetBrains Mono',
        fontSize: '8px',
        color: COLOUR_HEX.cyan,
      })
      .setOrigin(0.5);

    this.updateProgressBar(0);
  }

  private updateProgressBar(progress: number): void {
    if (!this.progressBar) return;
    const { centerX, centerY } = getLayout();
    const barWidth = 136 * progress;

    this.progressBar.clear();
    this.progressBar.fillStyle(COLOURS.cyan, 1);
    this.progressBar.fillRect(centerX - 68, centerY + 10, barWidth, 10);

    if (this.percentText) {
      this.percentText.setText(`${Math.floor(progress * 100)}%`);
    }
  }
}
