/**
 * Audio — central audio manager (CLAUDE.md rule 3).
 * One-shots use short trimmed assets + maxMs caps so loop files never stack.
 */
import Phaser from 'phaser';
import { AUDIO_PATHS, AUDIO_SFX } from '../config';

type SfxKey = keyof typeof AUDIO_PATHS;

/** Keys that must be time-capped — value is max playback ms from AUDIO_SFX. */
const TIMED_ONE_SHOTS: Partial<Record<SfxKey, number>> = {
  ozempicFire: AUDIO_SFX.ozempicFireMaxMs,
  heartLost: AUDIO_SFX.heartLostMaxMs,
  powerupPickup: AUDIO_SFX.powerupPickupMaxMs,
  gameoverSting: AUDIO_SFX.gameoverStingMaxMs,
  victorySting: AUDIO_SFX.victoryStingMaxMs,
  tiguanStart: AUDIO_SFX.tiguanStartMaxMs,
  courierCrash: AUDIO_SFX.courierCrashMaxMs,
  tramBell: AUDIO_SFX.tramBellMaxMs,
  tramImpact: AUDIO_SFX.tramImpactMaxMs,
};

export class Audio {
  private music: Phaser.Sound.BaseSound | null = null;
  private currentMusicKey: string | null = null;
  private muted = false;
  private musicVolume = 0.65;
  private sfxVolume = 0.85;
  private readonly stopTimers = new Map<string, number>();

  constructor(private readonly soundManager: Phaser.Sound.BaseSoundManager) {}

  /** Call from MenuScene Start (user gesture). */
  async unlock(): Promise<void> {
    const sm = this.soundManager as Phaser.Sound.WebAudioSoundManager;
    if (typeof sm.unlock === 'function') {
      sm.unlock();
    }
    const ctx = (sm as unknown as { context?: AudioContext }).context;
    if (ctx?.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Player can tap Start again.
      }
    }
  }

  playMusic(key: SfxKey, opts: { volume?: number; loop?: boolean } = {}): void {
    if (this.muted) return;
    this.stopMusic();
    const audioKey = key as string;
    this.music = this.soundManager.add(audioKey, {
      loop: opts.loop ?? true,
      volume: opts.volume ?? this.musicVolume,
    });
    this.currentMusicKey = audioKey;
    this.music.play();
  }

  playSfx(key: SfxKey, volume = 1.0): void {
    if (this.muted) return;
    const capMs = TIMED_ONE_SHOTS[key];
    if (capMs !== undefined) {
      const seek = key === 'tramBell' ? AUDIO_SFX.tramBellSeekSec : AUDIO_SFX.courierCrashSeekSec;
      this.playTimedSfx(key, capMs, volume, seek);
      return;
    }
    const vol = Math.max(0, Math.min(1, volume * this.sfxVolume));
    this.soundManager.play(key as string, { volume: vol });
  }

  playTimedSfx(key: SfxKey, maxMs: number, volume = 1.0, seek = 0): void {
    if (this.muted) return;
    this.clearStopTimer(key);
    this.resumeContext();
    // Cut any still-playing instance of this key before starting (stops fire-stack doubling).
    this.soundManager.stopByKey(key as string);
    const vol = Math.max(0, Math.min(1, volume * this.sfxVolume));
    this.soundManager.play(key as string, { volume: vol, seek });
    const timer = window.setTimeout(() => {
      this.soundManager.stopByKey(key as string);
      this.stopTimers.delete(key as string);
    }, maxMs);
    this.stopTimers.set(key as string, timer);
  }

  /** Tram ding — dedicated path via add()+play (more reliable than bare play()). */
  playTramBell(volume = AUDIO_SFX.tramBellVolume): void {
    if (this.muted) return;
    this.clearStopTimer('tramBell');
    this.resumeContext();
    this.soundManager.stopByKey('tramBell');

    const vol = Math.max(0, Math.min(1, volume * this.sfxVolume));
    const sound = this.soundManager.add('tramBell', { volume: vol });
    const cleanup = (): void => {
      if (sound.isPlaying) sound.stop();
      sound.destroy();
    };
    sound.once(Phaser.Sound.Events.COMPLETE, cleanup);
    sound.play();

    const timer = window.setTimeout(() => {
      cleanup();
      this.stopTimers.delete('tramBell');
    }, AUDIO_SFX.tramBellMaxMs);
    this.stopTimers.set('tramBell', timer);
  }

  playCourierCrash(volume = 1.0): void {
    this.playTimedSfx('courierCrash', AUDIO_SFX.courierCrashMaxMs, volume, AUDIO_SFX.courierCrashSeekSec);
  }

  stopTramBell(): void {
    this.stopTimedSfx('tramBell');
  }

  stopTimedSfx(key: SfxKey): void {
    this.clearStopTimer(key);
    this.soundManager.stopByKey(key as string);
  }

  stopSfx(key: SfxKey): void {
    this.stopTimedSfx(key);
  }

  stopAllSfx(): void {
    for (const key of [...this.stopTimers.keys()]) {
      this.clearStopTimer(key as SfxKey);
    }
    this.stopTimers.clear();
    for (const sound of this.soundManager.getAllPlaying()) {
      if (sound !== this.music) {
        sound.stop();
      }
    }
  }

  stopMusic(): void {
    if (this.music) {
      this.music.stop();
      this.music.destroy();
      this.music = null;
    }
    this.currentMusicKey = null;
  }

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.music) {
      (this.music as unknown as { setVolume(v: number): void }).setVolume(m ? 0 : this.musicVolume);
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setMusicVolume(v: number): void {
    this.musicVolume = Math.max(0, Math.min(1, v));
    if (this.music && !this.muted) {
      (this.music as unknown as { setVolume(v: number): void }).setVolume(this.musicVolume);
    }
  }

  setSfxVolume(v: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, v));
  }

  duck(factor = 0.3, restoreAfterMs = 650): void {
    if (!this.music || this.muted) return;
    const original = this.musicVolume;
    (this.music as unknown as { setVolume(v: number): void }).setVolume(original * factor);
    window.setTimeout(() => {
      if (this.music && !this.muted) {
        (this.music as unknown as { setVolume(v: number): void }).setVolume(original);
      }
    }, restoreAfterMs);
  }

  get isMuted(): boolean {
    return this.muted;
  }

  get currentMusic(): string | null {
    return this.currentMusicKey;
  }

  private clearStopTimer(key: SfxKey): void {
    const audioKey = key as string;
    const timer = this.stopTimers.get(audioKey);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.stopTimers.delete(audioKey);
    }
  }

  private resumeContext(): void {
    const sm = this.soundManager as Phaser.Sound.WebAudioSoundManager;
    const ctx = (sm as unknown as { context?: AudioContext }).context;
    if (ctx?.state === 'suspended') {
      void ctx.resume();
    }
  }
}