import Phaser from 'phaser';
import { SCENES, COLOURS, COLOUR_HEX } from '../config';
import { Audio } from '../systems/Audio';

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
    const cx = 240;
    const cy = 135;

    // Background
    this.add.rectangle(cx, cy, 480, 270, COLOURS.road).setOrigin(0.5);

    // Very minimal late-90s Melbourne skyline silhouette (hard rects, no gradients)
    this.drawSkyline();

    // Big chunky title — Bungee + palette
    this.add
      .text(cx, 48, 'GOORPEACH', {
        fontFamily: 'Bungee',
        fontSize: '36px',
        color: COLOUR_HEX.text,
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 78, 'APOCALYPSE', {
        fontFamily: 'Bungee',
        fontSize: '16px',
        color: COLOUR_HEX.hazard,
        align: 'center',
      })
      .setOrigin(0.5);

    // Tagline (dry, Australian, per BRIEF.md)
    this.add
      .text(cx, 100, 'Richmond to Kew. Delivery riders. Ozempic. Trams.', {
        fontFamily: 'JetBrains Mono',
        fontSize: '9px',
        color: COLOUR_HEX.cyan,
        align: 'center',
      })
      .setOrigin(0.5);

    // Buttons — large tap targets, chunky 90s style
    const startY = 140;
    this.createButton('START', startY, async () => {
      await this.handleStart();
    });

    this.createButton('LEVEL SELECT', startY + 28, () => {
      this.showComingSoon('Level Select');
    });

    this.createButton('SETTINGS', startY + 56, () => {
      this.showComingSoon('Settings');
    });

    this.createButton('CREDITS', startY + 84, () => {
      this.showComingSoon('Credits');
    });

    // Small mute toggle (top-right, touch friendly)
    const muteBtn = this.add
      .text(460, 18, '♫', {
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
      .text(cx, 250, '', {
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
  }

  private drawSkyline(): void {
    // Hard-edged building silhouettes using palette colours (footpath, hazard, tram body, magenta)
    // Bottom strip representing inner-Melbourne roofline
    const g = this.add.graphics();
    const baseY = 210;

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
      g.fillStyle(b.c, 0.85);
      g.fillRect(b.x, baseY - b.h, b.w, b.h);
      // Tiny roof detail line
      g.fillStyle(COLOURS.road, 0.6);
      g.fillRect(b.x, baseY - b.h - 2, b.w, 3);
    });
  }

  private createButton(label: string, y: number, onActivate: () => void): Phaser.GameObjects.Text {
    const cx = 240;

    // Background "plaque" (hard, no shadow — 90s style)
    const bg = this.add.graphics();
    bg.fillStyle(COLOURS.textDark, 0.9);
    bg.fillRect(cx - 92, y - 9, 184, 20);

    const txt = this.add
      .text(cx, y, label, {
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
      bg.fillRect(cx - 92, y - 9, 184, 20);
    });

    txt.on('pointerout', () => {
      txt.setColor(COLOUR_HEX.text);
      bg.clear();
      bg.fillStyle(COLOURS.textDark, 0.9);
      bg.fillRect(cx - 92, y - 9, 184, 20);
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

  private showComingSoon(feature: string): void {
    if (this.audio) {
      this.audio.playSfx('powerupPickup', 0.6);
    }
    this.statusText.setText(`${feature} — next session (one scene at a time)`);
    this.statusText.setColor(COLOUR_HEX.caution);

    // Clear the message after a moment so it doesn't stick
    this.time.delayedCall(1600, () => {
      if (this.statusText && this.statusText.active) {
        this.statusText.setText(this.audio ? 'audio ready' : 'tap START to begin');
        this.statusText.setColor(COLOUR_HEX.bile);
      }
    });
  }
}
