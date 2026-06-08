/**
 * PauseOverlay — translucent pause layer: Resume, Restart Level, Quit to Menu,
 * Mute toggle. Triggered by P (keyboard) during DriveScene and BossScene.
 */
import Phaser from 'phaser';
import { COLOURS, COLOUR_HEX, FONTS, PAUSE } from '../config';
import { getLayout } from '../systems/Layout';

export interface PauseOverlayCallbacks {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  getMuted: () => boolean;
  onMuteToggle: () => void;
}

export class PauseOverlay {
  private readonly container: Phaser.GameObjects.Container;
  private muteLabel!: Phaser.GameObjects.Text;
  private open = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly callbacks: PauseOverlayCallbacks,
  ) {
    const { width, height, centerX } = getLayout();
    this.container = scene.add.container(0, 0).setDepth(PAUSE.depth).setVisible(false);

    const dim = scene.add
      .rectangle(centerX, height / 2, width, height, COLOURS.textDark, PAUSE.overlayAlpha)
      .setOrigin(0.5)
      .setInteractive();
    this.container.add(dim);

    const title = scene.add
      .text(centerX, height * PAUSE.titleYFrac, 'PAUSED', {
        fontFamily: FONTS.title,
        fontSize: '22px',
        color: COLOUR_HEX.hazard,
      })
      .setOrigin(0.5);
    this.container.add(title);

    let y = height * PAUSE.btnStartYFrac;
    const gap = height * PAUSE.btnGapFrac;
    this.addButton('RESUME', y, () => callbacks.onResume());
    y += gap;
    this.addButton('RESTART', y, () => callbacks.onRestart());
    y += gap;
    this.addButton('QUIT', y, () => callbacks.onQuit());
    y += gap;
    this.muteLabel = this.addButton(this.muteText(), y, () => {
      callbacks.onMuteToggle();
      this.muteLabel.setText(this.muteText());
    });
  }

  private muteText(): string {
    return this.callbacks.getMuted() ? 'UNMUTE' : 'MUTE';
  }

  private addButton(label: string, y: number, onClick: () => void): Phaser.GameObjects.Text {
    const { centerX } = getLayout();
    const bg = this.scene.add.graphics();
    bg.fillStyle(COLOURS.road, 0.95);
    bg.fillRect(centerX - PAUSE.btnW / 2, y - 10, PAUSE.btnW, 22);
    this.container.add(bg);

    const txt = this.scene.add
      .text(centerX, y, label, {
        fontFamily: FONTS.title,
        fontSize: '11px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    txt.on('pointerover', () => txt.setColor(COLOUR_HEX.cyan));
    txt.on('pointerout', () => txt.setColor(COLOUR_HEX.text));
    txt.on('pointerup', onClick);
    this.container.add(txt);
    return txt;
  }

  show(): void {
    this.open = true;
    this.muteLabel.setText(this.muteText());
    this.container.setVisible(true);
  }

  hide(): void {
    this.open = false;
    this.container.setVisible(false);
  }

  get isOpen(): boolean {
    return this.open;
  }

  destroy(): void {
    this.container.destroy(true);
  }
}