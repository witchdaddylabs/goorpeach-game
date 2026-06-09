import Phaser from 'phaser';
import { TRAM, TRAM_WARN, COLOURS } from '../config';
import { getLayout } from '../systems/Layout';
import type { TramDirection } from './Tram';

/**
 * TramWarning — the cross-street telegraph (docs/BRIEF.md).
 *
 * The base flashing crossing-lights alone read as too subtle, so the telegraph
 * also paints a hazard band across the road (the kill zone), direction chevrons
 * pointing the way the W-class is coming from, and a flashing TRAM label. All
 * tuning is in TRAM_WARN (config.ts, rule 1). The bell + haptic are fired from
 * DriveScene where the Audio manager lives (rule 3).
 */
export class TramWarning {
  private readonly lights: Phaser.GameObjects.Image[] = [];
  private readonly chevrons: Phaser.GameObjects.Triangle[] = [];
  private readonly band: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;
  private readonly flashEvent: Phaser.Time.TimerEvent;
  private crossY: number;
  private on = true;

  constructor(scene: Phaser.Scene, crossY: number, direction: TramDirection = 'left') {
    this.crossY = crossY;
    this.band = scene.add.graphics().setDepth(TRAM_WARN.depth);
    this.label = this.spawnLabel(scene);
    this.spawnLights(scene);
    this.spawnChevrons(scene, direction);
    this.draw();

    this.flashEvent = scene.time.addEvent({
      delay: TRAM.flashMs,
      loop: true,
      callback: () => {
        this.on = !this.on;
        this.draw();
      },
    });
  }

  private spawnLabel(scene: Phaser.Scene): Phaser.GameObjects.Text {
    const { centerX } = getLayout();
    return scene.add
      .text(centerX, this.crossY - TRAM_WARN.labelOffsetY, TRAM_WARN.label, {
        fontFamily: 'Bungee',
        fontSize: TRAM_WARN.labelSize,
        color: TRAM_WARN.labelColour,
      })
      .setOrigin(0.5)
      .setDepth(TRAM_WARN.depth);
  }

  private spawnLights(scene: Phaser.Scene): void {
    const { road, width } = getLayout();
    const lightXs = [
      road.footpathWidth + TRAM.lightInset,
      width - road.footpathWidth - TRAM.lightInset - TRAM_WARN.lightW,
    ];
    for (const x of lightXs) {
      const light = scene.add.image(x + TRAM_WARN.lightW / 2, this.crossY, 'tramWarningLights');
      light.setDisplaySize(TRAM_WARN.lightW, TRAM_WARN.lightH);
      light.setOrigin(0.5, 0.5);
      light.setDepth(TRAM_WARN.depth + 1);
      this.lights.push(light);
    }
  }

  /** Chevrons stacked on the side the tram enters from, pointing its travel way. */
  private spawnChevrons(scene: Phaser.Scene, direction: TramDirection): void {
    const { road, width } = getLayout();
    const s = TRAM_WARN.chevronSize;
    // direction 'left' → enters from the left moving right; point right, anchor left.
    const pointRight = direction === 'left';
    const baseX = pointRight
      ? road.footpathWidth + TRAM.lightInset + TRAM_WARN.lightW + 8
      : width - road.footpathWidth - TRAM.lightInset - TRAM_WARN.lightW - 8;
    for (let i = 0; i < TRAM_WARN.chevronCount; i++) {
      const cx = baseX + (pointRight ? 1 : -1) * i * TRAM_WARN.chevronGap;
      // Triangle points along travel direction.
      const tri = pointRight
        ? scene.add.triangle(cx, this.crossY, 0, -s, s, 0, 0, s, TRAM_WARN.chevronColour)
        : scene.add.triangle(cx, this.crossY, s, -s, 0, 0, s, s, TRAM_WARN.chevronColour);
      tri.setOrigin(0.5, 0.5).setDepth(TRAM_WARN.depth + 1);
      this.chevrons.push(tri);
    }
  }

  /** Repaint the band + sync flash state across every element. */
  private draw(): void {
    const { road, width } = getLayout();
    const left = road.footpathWidth;
    const bandW = width - road.footpathWidth * 2;
    const top = this.crossY - TRAM_WARN.bandHeight / 2;

    this.band.clear();
    // Steady underlay so the kill zone is always legible…
    this.band.fillStyle(TRAM_WARN.bandColour, TRAM_WARN.bandAlphaSteady);
    this.band.fillRect(left, top, bandW, TRAM_WARN.bandHeight);
    // …plus a flashing layer + border on the on-beat.
    if (this.on) {
      this.band.fillStyle(TRAM_WARN.bandColour, TRAM_WARN.bandAlphaFlash - TRAM_WARN.bandAlphaSteady);
      this.band.fillRect(left, top, bandW, TRAM_WARN.bandHeight);
      this.band.lineStyle(TRAM_WARN.borderWidth, TRAM_WARN.borderColour, 1);
      this.band.strokeRect(left, top, bandW, TRAM_WARN.bandHeight);
    }

    const flashAlpha = this.on ? 1 : TRAM_WARN.lightOffAlpha;
    for (const light of this.lights) light.setAlpha(flashAlpha);
    for (const chevron of this.chevrons) chevron.setAlpha(flashAlpha);
    this.label.setAlpha(this.on ? 1 : TRAM_WARN.lightOffAlpha);
    this.label.setColor(this.on ? TRAM_WARN.labelColour : `#${COLOURS.hazard.toString(16)}`);
  }

  /** Follow the player lane during the telegraph so the cross matches arrival. */
  setCrossY(y: number): void {
    const dy = y - this.crossY;
    this.crossY = y;
    for (const light of this.lights) light.y += dy;
    for (const chevron of this.chevrons) chevron.y += dy;
    this.label.y += dy;
    this.draw();
  }

  destroy(): void {
    this.flashEvent.remove();
    this.band.destroy();
    this.label.destroy();
    for (const light of this.lights) light.destroy();
    for (const chevron of this.chevrons) chevron.destroy();
  }
}
