import Phaser from 'phaser';
import { SCENES, COLOURS, COLOUR_HEX, AUDIO_PATHS, SPRITE_PATHS } from '../config';

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
    // Real assets the user dumped into public/sprites and public/audio.
    // We now load the actual files so the progress bar and game use real content.

    // Audio (moved to correct folder)
    this.load.audio('menuLoop', AUDIO_PATHS.menuLoop);
    this.load.audio('drivingLoopA', AUDIO_PATHS.drivingLoopA);
    this.load.audio('tramBell', AUDIO_PATHS.tramBell);
    this.load.audio('courierCrash', AUDIO_PATHS.courierCrash);
    this.load.audio('engineRev', AUDIO_PATHS.engineRev);

    // Real top-down cars from the dumped marcusvh "2D TOP DOWN PIXEL CARS" pack
    this.load.image('playerClean', SPRITE_PATHS.playerClean);
    this.load.image('courierScooter', SPRITE_PATHS.courierScooter);
    this.load.image('courierEbike', SPRITE_PATHS.courierEbike);
    this.load.image('courierPushbike', SPRITE_PATHS.courierPushbike);

    // Road tiles kept for future detail props; the scrolling road itself is
    // drawn procedurally in DriveScene (no heavy background bitmap).
    this.load.image('roadTiles', SPRITE_PATHS.roadTiles);

    // Extra vehicles
    if (SPRITE_PATHS.vehicleAudi) this.load.image('vehicleAudi', SPRITE_PATHS.vehicleAudi);
    if (SPRITE_PATHS.vehiclePolice) this.load.image('vehiclePolice', SPRITE_PATHS.vehiclePolice);

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

  create(): void {
    const cx = 240; // internal 480×270 centre
    const cy = 135;

    // Dark road background
    this.add.rectangle(cx, cy, 480, 270, COLOURS.road).setOrigin(0.5);

    // Chunky title using Bungee (fonts loaded in index.html)
    this.add
      .text(cx, cy - 52, 'GOORPEACH', {
        fontFamily: 'Bungee',
        fontSize: '28px',
        color: COLOUR_HEX.text,
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy - 22, 'APOCALYPSE', {
        fontFamily: 'Bungee',
        fontSize: '14px',
        color: COLOUR_HEX.hazard,
        align: 'center',
      })
      .setOrigin(0.5);

    // Progress box (cream outline, hard)
    this.progressBox = this.add.graphics();
    this.progressBox.lineStyle(2, COLOURS.text, 0.9);
    this.progressBox.strokeRect(cx - 70, cy + 8, 140, 14);

    // Dynamic fill bar (cyan / hazard accent)
    this.progressBar = this.add.graphics();

    // Percentage (JetBrains Mono for tabular/arcade numeric feel)
    this.percentText = this.add
      .text(cx, cy + 32, '0%', {
        fontFamily: 'JetBrains Mono',
        fontSize: '11px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);

    // Current asset key (tiny, shows it's actually counting real queued items)
    this.assetText = this.add
      .text(cx, cy + 48, '', {
        fontFamily: 'JetBrains Mono',
        fontSize: '8px',
        color: COLOUR_HEX.cyan,
      })
      .setOrigin(0.5);

    // Seed at 0
    this.updateProgressBar(0);
  }

  private updateProgressBar(progress: number): void {
    const cx = 240;
    const cy = 135;
    const barWidth = 136 * progress;

    this.progressBar.clear();
    this.progressBar.fillStyle(COLOURS.cyan, 1);
    this.progressBar.fillRect(cx - 68, cy + 10, barWidth, 10);

    if (this.percentText) {
      this.percentText.setText(`${Math.floor(progress * 100)}%`);
    }
  }
}
