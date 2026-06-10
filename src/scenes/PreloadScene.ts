import Phaser from 'phaser';
import { SCENES, COLOURS, COLOUR_HEX, AUDIO_PATHS, SPRITE_PATHS, SPRITE_SHEETS, ANIMS } from '../config';
import { getLayout } from '../systems/Layout';

/**
 * PreloadScene — loads all assets with a real progress bar drawn against the
 * actual asset count (no vague spinner — CLAUDE.md).
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
    this.buildProgressUi();

    for (const [key, path] of Object.entries(AUDIO_PATHS)) {
      this.load.audio(key, path);
    }

    for (const [key, path] of Object.entries(SPRITE_PATHS)) {
      this.load.image(key, path);
    }

    for (const [key, sheet] of Object.entries(SPRITE_SHEETS)) {
      this.load.spritesheet(key, sheet.path, {
        frameWidth: sheet.frameWidth,
        frameHeight: sheet.frameHeight,
      });
    }

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
      this.registerAnimations();
      this.makeRuntimeTextures();
      this.time.delayedCall(90, () => {
        this.scene.start(SCENES.Menu);
      });
    });
  }

  /** Soft radial glow dot, built once — used by exhaust particles + power-up halos. */
  private makeRuntimeTextures(): void {
    if (this.textures.exists('softGlow')) return;
    const size = 32;
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    // Stack translucent circles so alpha accumulates toward the centre (soft falloff).
    for (let r = size / 2; r > 0; r--) {
      g.fillStyle(0xffffff, 0.05);
      g.fillCircle(size / 2, size / 2, r);
    }
    g.generateTexture('softGlow', size, size);
    g.destroy();
  }

  /** Register all config-driven sprite animations once textures are ready. */
  private registerAnimations(): void {
    for (const [key, def] of Object.entries(ANIMS)) {
      if (this.anims.exists(key)) continue;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(def.sheet, { start: def.start, end: def.end }),
        frameRate: def.rate,
        repeat: def.repeat,
      });
    }
  }

  private buildProgressUi(): void {
    const { width, height, centerX, centerY } = getLayout();

    this.add.rectangle(centerX, centerY, width, height, COLOURS.road).setOrigin(0.5);

    this.add
      .text(centerX, centerY - height * 0.19, 'DOORPEACH', {
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

    this.progressBox = this.add.graphics();
    this.progressBox.lineStyle(2, COLOURS.text, 0.9);
    this.progressBox.strokeRect(centerX - 70, centerY + 8, 140, 14);

    this.progressBar = this.add.graphics();

    this.percentText = this.add
      .text(centerX, centerY + 32, '0%', {
        fontFamily: 'JetBrains Mono',
        fontSize: '11px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);

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