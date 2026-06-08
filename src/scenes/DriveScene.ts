import Phaser from 'phaser';
import { SCENES, COLOUR_HEX, TRAM, POWERUP, COLOURS } from '../config';
import { LEVELS } from '../data/levels';
import { PlayerCar } from '../entities/PlayerCar';
import { OzempicPen } from '../entities/OzempicPen';
import { Courier } from '../entities/Courier';
import { PowerUp } from '../entities/PowerUp';
import type { PowerUpKind } from '../types';
import { Score } from '../systems/Score';
import { Audio } from '../systems/Audio';

/**
 * DriveScene — the core driving level, parameterised by level id. All level
 * config (length, waves, power-up spawns, tileset) comes from src/data/levels.ts
 * (CLAUDE.md rule 2). Auto-scrolls forward; ends at the checkpoint after
 * durationMs.
 *
 * Level 1 (Richmond) playable with:
 * - Steering + brake + firing
 * - Scrolling road (real assets)
 * - Courier traffic from level data + pen hits + player damage
 * - Powerups (ammo, boost, shield, magpie)
 * - 1-2 trams with telegraph
 * - Basic score + HUD
 * - Level timer / end condition
 */
export class DriveScene extends Phaser.Scene {
  private audio?: Audio;
  private player!: PlayerCar;
  private levelData!: (typeof LEVELS)[0];
  private timeLeft: number = 0;
  private timerText!: Phaser.GameObjects.Text;
  private road1!: Phaser.GameObjects.Image;
  private road2!: Phaser.GameObjects.Image;
  private scrollSpeed: number = 0;
  private pens: OzempicPen[] = [];
  private couriers: Courier[] = [];
  private powerups: PowerUp[] = [];
  private score: Score = new Score();
  private lastFireTime: number = 0;
  private fireCooldown: number = 280;
  private fireKey!: Phaser.Input.Keyboard.Key;
  private livesText!: Phaser.GameObjects.Text;
  private ammoText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;

  // Scheduled spawns from level data
  private nextCourierWaveIndex: number = 0;
  private nextPowerupIndex: number = 0;
  private nextTramIndex: number = 0;
  private tramWarnings: Phaser.GameObjects.Graphics[] = [];
  private trams: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super(SCENES.Drive);
  }

  create(): void {
    const cx = 240;
    const cy = 135;

    // Enable arcade physics for player + projectiles
    this.physics.world.setBounds(0, 40, 480, 190);

    // Level data
    this.levelData = LEVELS.find((l) => l.id === 1)!;
    this.scrollSpeed = this.levelData.scrollSpeed;
    this.timeLeft = this.levelData.durationMs / 1000;

    // === Scrolling road (two copies of the dumped Road_test.png for loop) ===
    this.road1 = this.add.image(cx, cy, 'roadTest').setOrigin(0.5);
    this.road2 = this.add.image(cx, cy - 270, 'roadTest').setOrigin(0.5);
    const bgScale = Math.min(480 / this.road1.width, 270 / this.road1.height) * 1.08;
    this.road1.setScale(bgScale);
    this.road2.setScale(bgScale);

    // === UI / HUD ===
    this.add
      .text(cx, 26, this.levelData.name.toUpperCase(), {
        fontFamily: 'Bungee',
        fontSize: '18px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);

    this.timerText = this.add
      .text(cx, 46, '', {
        fontFamily: 'JetBrains Mono',
        fontSize: '11px',
        color: COLOUR_HEX.caution,
      })
      .setOrigin(0.5);

    this.livesText = this.add.text(60, 265, '', {
      fontFamily: 'JetBrains Mono',
      fontSize: '8px',
      color: COLOUR_HEX.text,
    }).setOrigin(0.5);

    this.ammoText = this.add.text(180, 265, '', {
      fontFamily: 'JetBrains Mono',
      fontSize: '8px',
      color: COLOUR_HEX.cyan,
    }).setOrigin(0.5);

    this.scoreText = this.add.text(320, 265, '', {
      fontFamily: 'JetBrains Mono',
      fontSize: '8px',
      color: COLOUR_HEX.bile,
    }).setOrigin(0.5);

    // Controls hint
    this.add
      .text(cx, 250, 'A/D ←→ steer • S↓ brake • SPACE fire • P menu', {
        fontFamily: 'JetBrains Mono',
        fontSize: '6px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);

    // === Player ===
    this.player = new PlayerCar(this, cx, cy + 55, 'playerClean');

    // === Audio ===
    this.audio = this.registry.get('audio') as Audio | undefined;
    if (this.audio && !this.audio.isMuted) {
      try {
        this.audio.playMusic('drivingLoopA');
      } catch {}
    }

    // P to return
    this.input.keyboard?.on('keydown-P', () => this.endLevel());

    // Fire key (Space)
    this.fireKey = this.input.keyboard!.addKey('SPACE');

    this.updateHUD();
  }

  update(_time: number, delta: number): void {
    if (!this.player) return;

    this.player.update(delta, Date.now());

    // === Road scrolling ===
    const scroll = this.scrollSpeed * (delta / 1000);
    this.road1.y += scroll;
    this.road2.y += scroll;

    const resetThreshold = 135 + 270;
    const loopDistance = 540;
    if (this.road1.y > resetThreshold) this.road1.y -= loopDistance;
    if (this.road2.y > resetThreshold) this.road2.y -= loopDistance;

    // === Firing (Space) ===
    if (this.fireKey.isDown && _time - this.lastFireTime > this.fireCooldown && this.player.canFire()) {
      this.player.consumeAmmo();
      this.firePen();
      this.lastFireTime = _time;
      this.updateHUD();
    }

    // === Update / cleanup pens ===
    for (let i = this.pens.length - 1; i >= 0; i--) {
      const pen = this.pens[i];
      if (!pen || !pen.active || pen.sprite.y < 20) {
        if (pen) pen.destroy();
        this.pens.splice(i, 1);
      }
    }

    // === Spawn from level data (predictable, fixed) ===
    const elapsed = (this.levelData.durationMs / 1000 - this.timeLeft) * 1000;
    const LANE_XS = [170, 240, 310];

    // Courier waves
    while (
      this.nextCourierWaveIndex < this.levelData.courierWaves.length &&
      elapsed >= (this.levelData.courierWaves[this.nextCourierWaveIndex]?.triggerMs ?? Infinity)
    ) {
      const wave = this.levelData.courierWaves[this.nextCourierWaveIndex]!;
      wave.spawns.forEach((spawn, idx) => {
        const x = LANE_XS[idx % LANE_XS.length] ?? 240;
        const texture = spawn.brand === 'GoorPeach' ? 'courierScooter' : spawn.brand === 'ChewSnog' ? 'courierEbike' : 'courierPushbike';
        this.couriers.push(new Courier(this, x, 30, texture, spawn.brand));
      });
      this.nextCourierWaveIndex++;
    }

    // Powerups
    while (
      this.nextPowerupIndex < this.levelData.powerUpSpawns.length &&
      elapsed >= (this.levelData.powerUpSpawns[this.nextPowerupIndex]?.triggerMs ?? Infinity)
    ) {
      const p = this.levelData.powerUpSpawns[this.nextPowerupIndex]!;
      const idx = this.nextPowerupIndex % 3;
      const px = LANE_XS[idx] ?? 240;
      this.powerups.push(new PowerUp(this, px, 90 + idx * 25, p.kind));
      this.nextPowerupIndex++;
    }

    // Trams (fixed from config for now, simple graphics)
    while (this.nextTramIndex < TRAM.spawnTimes.length && elapsed >= (TRAM.spawnTimes[this.nextTramIndex] ?? Infinity)) {
      this.spawnTram();
      this.nextTramIndex++;
    }

    // === Update couriers + pen hits + player collision ===
    for (let i = this.couriers.length - 1; i >= 0; i--) {
      let c = this.couriers[i];
      if (!c || !c.active) {
        this.couriers.splice(i, 1);
        continue;
      }

      // Pen hits
      let hit = false;
      for (let p = this.pens.length - 1; p >= 0; p--) {
        const pen = this.pens[p];
        if (pen && pen.active && Phaser.Geom.Intersects.RectangleToRectangle(pen.sprite.getBounds(), c.sprite.getBounds())) {
          pen.destroy();
          this.pens.splice(p, 1);
          this.score.addCourier(c.brand);
          c.destroy();
          this.couriers.splice(i, 1);
          hit = true;
          if (this.audio && !this.audio.isMuted) {
            try { this.audio.playSfx('courierCrash', 0.8); } catch {}
          }
          break;
        }
      }
      if (hit) continue;

      // Player collision
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.sprite.getBounds(), c.sprite.getBounds())) {
        const dead = this.player.takeDamage();
        c.destroy();
        this.couriers.splice(i, 1);
        if (this.audio && !this.audio.isMuted) {
          try { this.audio.playSfx('heartLost', 0.9); } catch {}
        }
        this.updateHUD();
        if (dead) {
          this.endLevel(true);
          return;
        }
      }
    }

    // === Powerup collection ===
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
        if (this.audio && !this.audio.isMuted) {
          try { this.audio.playSfx('powerupPickup', 0.7); } catch {}
        }
        this.updateHUD();
      }
    }

    // === Simple trams (graphics + collision = instant death for now) ===
    for (let i = this.trams.length - 1; i >= 0; i--) {
      const tram = this.trams[i];
      if (!tram) {
        this.trams.splice(i, 1);
        continue;
      }
      tram.y += TRAM.speed * (delta / 1000);
      if (tram.y > 300) {
        tram.destroy();
        this.trams.splice(i, 1);
      } else if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.sprite.getBounds(), tram.getBounds())) {
        this.endLevel(true); // tram death
        return;
      }
    }

    // Cleanup warnings
    for (let i = this.tramWarnings.length - 1; i >= 0; i--) {
      const w = this.tramWarnings[i];
      if (!w || w.y > 300) {
        if (w) w.destroy();
        this.tramWarnings.splice(i, 1);
      }
    }

    // === Timer ===
    this.timeLeft -= delta / 1000;
    this.updateTimerText();

    if (this.timeLeft <= 0) {
      this.endLevel();
    }

    this.updateHUD();
  }

  private firePen(): void {
    if (!this.player) return;

    const pen = new OzempicPen(this, this.player.sprite.x, this.player.sprite.y - 30);
    this.pens.push(pen);

    if (this.audio && !this.audio.isMuted) {
      try {
        this.audio.playSfx('ozempicFire', 0.7);
      } catch {}
    }
  }

  private updateTimerText(): void {
    const sec = Math.max(0, Math.ceil(this.timeLeft));
    this.timerText.setText(`${sec}s`);
  }

  private updateHUD(): void {
    if (this.livesText) this.livesText.setText(`LIVES:${this.player.lives}`);
    if (this.ammoText) this.ammoText.setText(`AMMO:${this.player.ammo}`);
    if (this.scoreText) this.scoreText.setText(`SCORE:${this.score.value}`);
  }

  private applyPowerUp(kind: PowerUpKind): void {
    if (!this.player) return;
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
        // Clear nearby couriers
        for (let idx = this.couriers.length - 1; idx >= 0; idx--) {
          const c = this.couriers[idx];
          if (c && c.active && Math.abs(c.sprite.x - this.player.sprite.x) < POWERUP.magpie.radius) {
            c.destroy();
            this.couriers.splice(idx, 1);
            this.score.addCourier(c.brand);
          }
        }
        break;
    }
  }

  private spawnTram(): void {
    const tramY = 20;
    // Warning lights (telegraph)
    const warn = this.add.graphics();
    warn.fillStyle(COLOURS.caution, 1);
    warn.fillRect(180, tramY, 12, 8);
    warn.fillRect(288, tramY, 12, 8);
    this.tramWarnings.push(warn);

    this.time.delayedCall(TRAM.warningMs, () => {
      if (!this.scene || !this.scene.isActive()) return;
      // Actual tram (long rectangle as proxy)
      const tram = this.add.rectangle(240, tramY, TRAM.width, TRAM.height, COLOURS.tramBody);
      this.trams.push(tram);

      if (this.audio && !this.audio.isMuted) {
        try { this.audio.playSfx('tramBell', 1.0); } catch {}
      }
    });
  }

  private endLevel(tramDeath: boolean = false): void {
    if (this.audio) this.audio.stopMusic();

    const cx = 240;
    this.add
      .text(cx, 110, tramDeath ? 'TRAM!' : 'CHECKPOINT!', {
        fontFamily: 'Bungee',
        fontSize: '24px',
        color: COLOUR_HEX.text,
      })
      .setOrigin(0.5);

    // Add level clear bonus
    this.score.addLevelClear(Math.max(0, this.timeLeft));

    const msg = tramDeath
      ? 'You got cleaned up by a W-class. Classic Melbourne.'
      : 'Richmond complete. Good pace.';

    this.add
      .text(cx, 140, msg, {
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

    this.time.delayedCall(1600, () => {
      this.scene.start(SCENES.Menu);
    });
  }
}
