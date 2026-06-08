import Phaser from 'phaser';
import { SCENES, COLOURS, COLOUR_HEX } from '../config';
import { Audio } from '../systems/Audio';
import { Persistence } from '../systems/Persistence';
import { CrtOverlay } from '../ui/CrtOverlay';
import { getLayout } from '../systems/Layout';

/**
 * MenuScene — title screen with chunky logo, Melbourne skyline hint, and the
 * four main buttons. The "Start" button is the critical audio-unlock gesture.
 *
 * Per CLAUDE.md:
 *  - No direct this.sound.play anywhere.
 *  - Audio system handles unlock + music.
 *  - Australian English, dry tone in any copy.
 *  - Mobile-first (buttons large, touch friendly).
 *
 * For this milestone Start proves the unlock + music path then moves to
 * DriveScene (even while that scene is still being built in the next step).
 * Other buttons show a temporary "coming soon" message (we implement one
 * scene at a time).
 */
export class MenuScene extends Phaser.Scene {
  private audio!: Audio;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENES.Menu);
  }

  create(): void {
    const { width, height, centerX, centerY } = getLayout();

    // Background
    this.add.rectangle(centerX, centerY, width, height, COLOURS.road).setOrigin(0.5);

    // Very minimal late-90s Melbourne skyline silhouette (hard rects, no gradients)
    this.drawSkyline();

    // Big chunky title — Bungee + palette
    this.add
      .text(centerX, height * 0.18, 'GOORPEACH', {
        fontFamily: 'Bungee',
        fontSize: '36px',
        color: COLOUR_HEX.text,
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, height * 0.29, 'APOCALYPSE', {
        fontFamily: 'Bungee',
        fontSize: '16px',
        color: COLOUR_HEX.hazard,
        align: 'center',
      })
      .setOrigin(0.5);

    // Tagline (dry, Australian, per BRIEF.md)
    this.add
      .text(centerX, height * 0.37, 'Richmond to Kew. Delivery riders. Ozempic. Trams.', {
        fontFamily: 'JetBrains Mono',
        fontSize: '9px',
        color: COLOUR_HEX.cyan,
        align: 'center',
      })
      .setOrigin(0.5);

    // Buttons — large tap targets, chunky 90s style
    const startY = height * 0.52;
    const btnGap = height * 0.1;
    this.createButton('START', startY, async () => {
      await this.handleStart();
    });

    this.createButton('LEVEL SELECT', startY + btnGap, () => {
      this.scene.start(SCENES.LevelSelect);
    });

    this.createButton('HIGH SCORES', startY + btnGap * 2, () => {
      this.scene.start(SCENES.Scoreboard);
    });

    this.createButton('SETTINGS', startY + btnGap * 3, () => {
      this.scene.start(SCENES.Settings);
    });

    this.createButton('CREDITS', startY + btnGap * 4, () => {
      this.scene.start(SCENES.Credits);
    });

    // Small mute toggle (top-right, touch friendly)
    const muteBtn = this.add
      .text(width - 20, height * 0.07, '♫', {
        fontFamily: 'JetBrains Mono',
        fontSize: '14px',
        color: COLOUR_HEX.text,
        backgroundColor: COLOUR_HEX.textDark,
      })
      .setOrigin(0.5)
      .setPadding(6)
      .setInteractive({ useHandCursor: true });

    muteBtn.on('pointerdown', () => {
      if (this.audio) {
        const nowMuted = this.audio.toggleMute();
        muteBtn.setText(nowMuted ? 'M' : '♫');
      }
    });

    // Status line (for unlock feedback and coming-soon messages)
    this.statusText = this.add
      .text(centerX, height * 0.93, '', {
        fontFamily: 'JetBrains Mono',
        fontSize: '9px',
        color: COLOUR_HEX.bile,
        align: 'center',
      })
      .setOrigin(0.5);

    // Hint for first run (audio context)
    this.statusText.setText('tap START to begin (unlocks audio)');

    // If someone arrives here with audio already in registry (rare on first load), reuse
    const existing = this.registry.get('audio') as Audio | undefined;
    if (existing) {
      this.audio = existing;
      this.statusText.setText('audio ready — tap START to drive');
    }

    new CrtOverlay(this);
  }

  private drawSkyline(): void {
    const { width, height } = getLayout();
    const scale = width / 480;
    // Hard-edged building silhouettes using palette colours (footpath, hazard, tram body, magenta)
    // Bottom strip representing inner-Melbourne roofline
    const g = this.add.graphics();
    const baseY = height * 0.78;

    // Simple repeating blocks of different heights — very GTA1 / Micro Machines feel
    const blocks = [
      { x: 20, w: 38, h: 42, c: COLOURS.footpath },
      { x: 62, w: 26, h: 58, c: COLOURS.hazard },
      { x: 92, w: 44, h: 35, c: COLOURS.tramBody },
      { x: 140, w: 30, h: 65, c: COLOURS.magenta },
      { x: 175, w: 52, h: 28, c: COLOURS.footpath },
      { x: 232, w: 22, h: 71, c: COLOURS.hazard },
      { x: 258, w: 36, h: 40, c: COLOURS.tramBody },
      { x: 298, w: 28, h: 55, c: COLOURS.footpath },
      { x: 330, w: 48, h: 33, c: COLOURS.magenta },
      { x: 382, w: 24, h: 62, c: COLOURS.hazard },
      { x: 410, w: 40, h: 38, c: COLOURS.tramBody },
    ];

    blocks.forEach((b) => {
      const x = b.x * scale;
      const w = b.w * scale;
      const h = b.h * scale;
      g.fillStyle(b.c, 0.85);
      g.fillRect(x, baseY - h, w, h);
      // Tiny roof detail line
      g.fillStyle(COLOURS.road, 0.6);
      g.fillRect(x, baseY - h - 2, w, 3);
    });
  }

  private createButton(label: string, y: number, onActivate: () => void): Phaser.GameObjects.Text {
    const { width, centerX } = getLayout();
    const btnW = Math.min(184, width - 24);

    // Background "plaque" (hard, no shadow — 90s style)
    const bg = this.add.graphics();
    bg.fillStyle(COLOURS.textDark, 0.9);
    bg.fillRect(centerX - btnW / 2, y - 9, btnW, 20);

    const txt = this.add
      .text(centerX, y, label, {
        fontFamily: 'Bungee',
        fontSize: '13px',
        color: COLOUR_HEX.text,
        align: 'center',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Hover / active feedback using cyan accent (UI highlight colour)
    txt.on('pointerover', () => {
      txt.setColor(COLOUR_HEX.cyan);
      bg.clear();
      bg.fillStyle(COLOURS.cyan, 0.15);
      bg.fillRect(centerX - btnW / 2, y - 9, btnW, 20);
    });

    txt.on('pointerout', () => {
      txt.setColor(COLOUR_HEX.text);
      bg.clear();
      bg.fillStyle(COLOURS.textDark, 0.9);
      bg.fillRect(centerX - btnW / 2, y - 9, btnW, 20);
    });

    txt.on('pointerdown', () => {
      txt.setColor(COLOUR_HEX.hazard);
    });

    txt.on('pointerup', () => {
      txt.setColor(COLOUR_HEX.cyan);
      onActivate();
    });

    return txt;
  }

  private async handleStart(): Promise<void> {
    // This is THE unlock point (CLAUDE.md audio gotcha). Must be direct user gesture.
    if (!this.audio) {
      this.audio = new Audio(this.sound);
    }

    await this.audio.unlock();
    const settings = Persistence.getSettings();
    this.audio.setMusicVolume(settings.musicVolume);
    this.audio.setSfxVolume(settings.soundVolume);
    this.audio.playMusic('menuLoop');

    // Make the audio manager available to subsequent scenes (Drive, Boss, etc.)
    this.registry.set('audio', this.audio);

    this.statusText.setText('audio unlocked — driving...');
    this.statusText.setColor(COLOUR_HEX.bile);

    // Per working pattern, next is DriveScene level 1 (Richmond) — even if still stub.
    // Music will continue because the Audio instance is on the registry and the
    // underlying WebAudio context is now running.
    this.time.delayedCall(280, () => {
      this.scene.start(SCENES.Drive);
    });
  }

}
