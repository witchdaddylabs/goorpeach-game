import Phaser from 'phaser';
import { SCENES, COLOURS, COLOUR_HEX, ROAD, TRAM, POWERUP, MESSAGES } from '../config';
import { LEVELS } from '../data/levels';
import { PlayerCar } from '../entities/PlayerCar';
import { OzempicPen } from '../entities/OzempicPen';
import { Courier } from '../entities/Courier';
import { ScooterCourier } from '../entities/ScooterCourier';
import { EbikeCourier } from '../entities/EbikeCourier';
import { PushbikeCourier } from '../entities/PushbikeCourier';
import { PowerUp } from '../entities/PowerUp';
import { Tram } from '../entities/Tram';
import { TramWarning } from '../entities/TramWarning';
import { HUD } from '../ui/HUD';
import { TouchControls } from '../ui/TouchControls';
import type { CourierBrand, PowerUpKind, SteerIntent } from '../types';
import { Score } from '../systems/Score';
import { Audio } from '../systems/Audio';

/**
 * DriveScene — the core driving level, parameterised by level id. All level
 * config comes from src/data/levels.ts (rule 2). Couriers, trams, HUD and touch
 * live in their own modules; this scene just orchestrates them. Auto-scrolls
 * forward; ends at the checkpoint after durationMs.
 */
export class DriveScene extends Phaser.Scene {
  private audio?: Audio;
  private player!: PlayerCar;
  private hud!: HUD;
  private touch!: TouchControls;
  private levelData!: (typeof LEVELS)[number];

  private timeLeft = 0;
  private scrollSpeed = 0;
  private roadBase!: Phaser.GameObjects.Graphics;
  private roadLines!: Phaser.GameObjects.Graphics;
  private roadScroll = 0;

  private pens: OzempicPen[] = [];
  private couriers: Courier[] = [];
  private powerups: PowerUp[] = [];
  private trams: Tram[] = [];
  private tramWarnings: TramWarning[] = [];
  private score = new Score();

  private lastFireTime = 0;
  private readonly fireCooldown = 280;

  // Keyboard (optional — mobile uses touch only)
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private fireKey?: Phaser.Input.Keyboard.Key;

  // Predictable spawn cursors
  private nextCourierWaveIndex = 0;
  private nextPowerupIndex = 0;
  private nextTramIndex = 0;

  private levelId = 1;
  private endingRun = false;

  constructor() {
    super(SCENES.Drive);
  }

  init(data: { levelId?: number }): void {
    this.levelId = data.levelId ?? 1;
  }

  create(): void {
    const cx = 240;
    const cy = 135;

    this.physics.world.setBounds(0, ROAD.topY, 480, ROAD.bottomY - ROAD.topY);

    const level = LEVELS.find((l) => l.id === this.levelId);
    if (!level) {
      console.error('[Drive] Level 1 (Richmond) missing from levels.ts');
      this.scene.start(SCENES.Menu);
      return;
    }
    this.levelData = level;
    this.scrollSpeed = level.scrollSpeed;
    this.timeLeft = level.durationMs / 1000;

    // Reset per-run state — Phaser reuses the scene instance across restarts.
    this.pens = [];
    this.couriers = [];
    this.powerups = [];
    this.trams = [];
    this.tramWarnings = [];
    this.score = new Score();
    this.nextCourierWaveIndex = 0;
    this.nextPowerupIndex = 0;
    this.nextTramIndex = 0;
    this.lastFireTime = 0;
    this.roadScroll = 0;
    this.endingRun = false;

    // Procedural road (palette tokens, chunky GTA-1 look — no heavy bitmap)
    this.roadBase = this.add.graphics();
    this.drawRoadBase();
    this.roadLines = this.add.graphics();

    this.hud = new HUD(this, level.name);
    this.player = new PlayerCar(this, cx, cy + 55, 'playerClean');
    this.touch = new TouchControls(this);

    this.audio = this.registry.get('audio') as Audio | undefined;
    this.playMusic('drivingLoopA');

    this.setupKeyboard();
    this.refreshHud();
  }

  private setupKeyboard(): void {
    const kb = this.input.keyboard;
    if (!kb) return;
    this.cursors = kb.createCursorKeys();
    this.keyA = kb.addKey('A');
    this.keyD = kb.addKey('D');
    this.keyS = kb.addKey('S');
    this.fireKey = kb.addKey('SPACE');
    // P quits to menu for now (a proper PauseOverlay comes later).
    kb.on('keydown-P', () => {
      if (this.endingRun) return;
      this.endingRun = true;
      this.audio?.stopMusic();
      this.scene.start(SCENES.Menu);
    });
  }

  /** Merge keyboard and touch into a single intent (rule 5). */
  private buildIntent(): SteerIntent {
    const c = this.cursors;
    const kbLeft = (c?.left.isDown ?? false) || (this.keyA?.isDown ?? false);
    const kbRight = (c?.right.isDown ?? false) || (this.keyD?.isDown ?? false);
    const kbBrake = (c?.down.isDown ?? false) || (this.keyS?.isDown ?? false);
    const t = this.touch.getState();
    return { left: kbLeft || t.left, right: kbRight || t.right, brake: kbBrake || t.brake };
  }

  update(time: number, delta: number): void {
    if (!this.player || this.endingRun) return;

    this.player.update(delta, Date.now(), this.buildIntent());

    // Scrolling road
    this.roadScroll += this.scrollSpeed * (delta / 1000);
    this.drawRoadLines();

    // Firing — keyboard held or a touch tap; touch only consumed off cooldown so taps aren't dropped
    const offCooldown = time - this.lastFireTime > this.fireCooldown;
    const wantFire = (this.fireKey?.isDown ?? false) || (offCooldown && this.touch.consumeFire());
    if (wantFire && offCooldown && this.player.canFire()) {
      this.player.consumeAmmo();
      this.firePen();
      this.lastFireTime = time;
    }

    this.updatePens();
    this.runSpawns();
    this.updateCouriers(delta);
    this.updatePowerups();
    this.updateTrams(delta);

    this.timeLeft -= delta / 1000;
    if (this.timeLeft <= 0) {
      this.completeLevel();
      return;
    }
    this.refreshHud();
  }

  private updatePens(): void {
    for (let i = this.pens.length - 1; i >= 0; i--) {
      const pen = this.pens[i];
      if (!pen || !pen.active || pen.offscreen) {
        pen?.destroy();
        this.pens.splice(i, 1);
      }
    }
  }

  private runSpawns(): void {
    const elapsed = this.levelData.durationMs - this.timeLeft * 1000;

    while (
      this.nextCourierWaveIndex < this.levelData.courierWaves.length &&
      elapsed >= (this.levelData.courierWaves[this.nextCourierWaveIndex]?.triggerMs ?? Infinity)
    ) {
      const wave = this.levelData.courierWaves[this.nextCourierWaveIndex];
      wave?.spawns.forEach((spawn, idx) => {
        const x = ROAD.laneXs[idx % ROAD.laneXs.length] ?? 240;
        this.couriers.push(this.spawnCourier(spawn.brand, x, 30));
      });
      this.nextCourierWaveIndex += 1;
    }

    while (
      this.nextPowerupIndex < this.levelData.powerUpSpawns.length &&
      elapsed >= (this.levelData.powerUpSpawns[this.nextPowerupIndex]?.triggerMs ?? Infinity)
    ) {
      const p = this.levelData.powerUpSpawns[this.nextPowerupIndex];
      const idx = this.nextPowerupIndex % ROAD.laneXs.length;
      const px = ROAD.laneXs[idx] ?? 240;
      if (p) this.powerups.push(new PowerUp(this, px, 90 + idx * 25, p.kind));
      this.nextPowerupIndex += 1;
    }

    while (
      this.nextTramIndex < TRAM.spawnTimes.length &&
      elapsed >= (TRAM.spawnTimes[this.nextTramIndex] ?? Infinity)
    ) {
      this.spawnTram();
      this.nextTramIndex += 1;
    }
  }

  private spawnCourier(brand: CourierBrand, x: number, y: number): Courier {
    switch (brand) {
      case 'GoorPeach':
        return new ScooterCourier(this, x, y, 'courierScooter');
      case 'ChewSnog':
        return new EbikeCourier(this, x, y, 'courierEbike');
      case 'GorgeRush':
        return new PushbikeCourier(this, x, y, 'courierPushbike');
    }
  }

  private updateCouriers(delta: number): void {
    for (let i = this.couriers.length - 1; i >= 0; i--) {
      const c = this.couriers[i];
      if (!c || !c.active || c.sprite.y > 300) {
        c?.destroy();
        this.couriers.splice(i, 1);
        continue;
      }
      c.update(delta);

      // Pen hits (generous courier bounds — rule 9)
      let killed = false;
      for (let p = this.pens.length - 1; p >= 0; p--) {
        const pen = this.pens[p];
        if (!pen || !pen.active) continue;
        if (Phaser.Geom.Intersects.RectangleToRectangle(pen.getBounds(), c.getHitBounds())) {
          pen.destroy();
          this.pens.splice(p, 1);
          if (c.hit()) {
            this.score.addCourier(c.brand);
            c.destroy();
            this.couriers.splice(i, 1);
            killed = true;
            this.playSfx('courierCrash', 0.8);
          }
          break;
        }
      }
      if (killed) continue;

      // Player collision (raw bounds — player hitbox already forgiving)
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.sprite.getBounds(), c.getBounds())) {
        const dead = this.player.takeDamage();
        c.destroy();
        this.couriers.splice(i, 1);
        this.playSfx('heartLost', 0.9);
        if (dead) {
          this.gameOver('courier');
          return;
        }
      }
    }
  }

  private updatePowerups(): void {
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      if (!p || !p.active) {
        this.powerups.splice(i, 1);
        continue;
      }
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.sprite.getBounds(), p.getBounds())) {
        this.applyPowerUp(p.kind);
        p.destroy();
        this.powerups.splice(i, 1);
        this.playSfx('powerupPickup', 0.7);
      }
    }
  }

  private updateTrams(delta: number): void {
    for (let i = this.trams.length - 1; i >= 0; i--) {
      const tram = this.trams[i];
      if (!tram) {
        this.trams.splice(i, 1);
        continue;
      }
      tram.update(delta);
      if (tram.offscreen) {
        tram.destroy();
        this.trams.splice(i, 1);
      } else if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.sprite.getBounds(), tram.getBounds())) {
        this.gameOver('tram');
        return;
      }
    }
  }

  private firePen(): void {
    this.pens.push(new OzempicPen(this, this.player.sprite.x, this.player.sprite.y - 30));
    this.playSfx('ozempicFire', 0.7);
  }

  private applyPowerUp(kind: PowerUpKind): void {
    switch (kind) {
      case 'ammo':
        this.player.addAmmo(POWERUP.ammo.shots);
        break;
      case 'boost':
        this.player.applyBoost(POWERUP.boost.durationMs);
        break;
      case 'shield':
        this.player.applyShield();
        break;
      case 'magpie':
        for (let idx = this.couriers.length - 1; idx >= 0; idx--) {
          const c = this.couriers[idx];
          if (c && c.active && Math.abs(c.sprite.x - this.player.sprite.x) < POWERUP.magpie.radius) {
            this.score.addCourier(c.brand);
            c.destroy();
            this.couriers.splice(idx, 1);
          }
        }
        break;
    }
  }

  private spawnTram(): void {
    const warning = new TramWarning(this);
    this.tramWarnings.push(warning);
    this.playSfx('tramBell', 1.0);
    this.audio?.duck();

    this.time.delayedCall(TRAM.warningMs, () => {
      if (!this.scene.isActive()) return;
      const idx = this.tramWarnings.indexOf(warning);
      if (idx >= 0) this.tramWarnings.splice(idx, 1);
      warning.destroy();
      this.trams.push(new Tram(this));
    });
  }

  private refreshHud(): void {
    this.hud.update({
      lives: this.player.lives,
      ammo: this.player.ammo,
      score: this.score.value,
      secondsLeft: this.timeLeft,
    });
  }

  private drawRoadBase(): void {
    const g = this.roadBase;
    g.clear();
    g.fillStyle(COLOURS.road, 1);
    g.fillRect(0, ROAD.topY, 480, ROAD.bottomY - ROAD.topY);
    g.fillStyle(COLOURS.footpath, 1);
    g.fillRect(0, ROAD.topY, ROAD.footpathWidth, ROAD.bottomY - ROAD.topY);
    g.fillRect(480 - ROAD.footpathWidth, ROAD.topY, ROAD.footpathWidth, ROAD.bottomY - ROAD.topY);
  }

  private drawRoadLines(): void {
    const period = ROAD.dashLength + ROAD.dashGap;
    const start = ROAD.topY - period + (this.roadScroll % period);
    const g = this.roadLines;
    g.clear();
    g.fillStyle(COLOURS.footpath, 0.85);
    for (const x of ROAD.lineColumns) {
      for (let y = start; y < ROAD.bottomY; y += period) {
        const top = Math.max(y, ROAD.topY);
        const bottom = Math.min(y + ROAD.dashLength, ROAD.bottomY);
        if (bottom > top) g.fillRect(x - ROAD.dashWidth / 2, top, ROAD.dashWidth, bottom - top);
      }
    }
  }

  private playMusic(key: 'drivingLoopA'): void {
    if (!this.audio || this.audio.isMuted) return;
    try {
      this.audio.playMusic(key);
    } catch (e) {
      console.info('[Drive] music failed:', key, e);
    }
  }

  private playSfx(key: Parameters<Audio['playSfx']>[0], volume: number): void {
    if (!this.audio || this.audio.isMuted) return;
    try {
      this.audio.playSfx(key, volume);
    } catch (e) {
      console.info('[Drive] sfx failed:', key, e);
    }
  }

  /** Death — hand off to GameOverScene with the right death-cause line. */
  private gameOver(cause: 'courier' | 'tram'): void {
    if (this.endingRun) return;
    this.endingRun = true;
    this.audio?.stopMusic();
    const message = cause === 'tram' ? MESSAGES.tramDeath : this.levelData.deathLine;
    this.scene.start(SCENES.GameOver, {
      message,
      score: this.score.value,
      levelId: this.levelId,
    });
  }

  /** Level cleared — award the clear bonus, show a checkpoint card. */
  private completeLevel(): void {
    if (this.endingRun) return;
    this.endingRun = true;
    this.audio?.stopMusic();
    this.score.addLevelClear(Math.max(0, this.timeLeft));

    const cx = 240;
    this.add
      .text(cx, 110, 'CHECKPOINT', { fontFamily: 'Bungee', fontSize: '24px', color: COLOUR_HEX.text })
      .setOrigin(0.5);
    this.add
      .text(cx, 140, `${this.levelData.name} complete. ${MESSAGES.checkpoint}`, {
        fontFamily: 'JetBrains Mono',
        fontSize: '9px',
        color: COLOUR_HEX.cyan,
      })
      .setOrigin(0.5);
    this.add
      .text(cx, 160, `SCORE: ${this.score.value}`, {
        fontFamily: 'JetBrains Mono',
        fontSize: '10px',
        color: COLOUR_HEX.bile,
      })
      .setOrigin(0.5);

    // TODO: when level 2 (Fitzroy) exists, advance instead of returning to menu.
    this.time.delayedCall(1600, () => this.scene.start(SCENES.Menu));
  }
}
