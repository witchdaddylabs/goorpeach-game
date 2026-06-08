/**
 * Audio — the central audio manager (CLAUDE.md rule 3). No scene calls
 * this.sound.play directly. Handles mute, ducking between music tracks, and the
 * browser-blocks-audio-until-first-interaction quirk.
 *
 * Audio gotcha (CLAUDE.md): use Phaser.Sound.WebAudioSoundManager and call
 * context.resume() on the MenuScene Start click. Verify on Safari iOS.
 *
 * Instantiate after assets are loaded in PreloadScene. The first user gesture
 * (Start button) must call unlock() before any play() will work reliably.
 */
import Phaser from 'phaser';
import { AUDIO_PATHS } from '../config';

export class Audio {
  private music: Phaser.Sound.BaseSound | null = null;
  private currentMusicKey: string | null = null;
  private muted = false;
  private musicVolume = 0.65;
  private sfxVolume = 0.85;

  constructor(private readonly soundManager: Phaser.Sound.BaseSoundManager) {}

  /**
   * Must be called from a user gesture (pointerdown/up on the Start button).
   * Resumes the WebAudio context on browsers that suspend it until interaction.
   * Safe to call multiple times.
   */
  async unlock(): Promise<void> {
    // Access the underlying WebAudio context (the documented gotcha path)
    const wa = this.soundManager as unknown as { context?: AudioContext };
    const ctx = wa.context;
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Non-fatal — some browsers are strict; player can tap again.
      }
    }
  }

  /** Start or switch a music loop. Keys from AUDIO_PATHS. */
  playMusic(key: keyof typeof AUDIO_PATHS, opts: { volume?: number; loop?: boolean } = {}): void {
    if (this.muted) return;

    this.stopMusic();

    const audioKey = key as string;
    this.music = this.soundManager.add(audioKey, {
      loop: opts.loop ?? true,
      volume: (opts.volume ?? this.musicVolume) * (this.muted ? 0 : 1),
    });
    this.currentMusicKey = audioKey;
    (this.music as Phaser.Sound.BaseSound).play();
  }

  stopMusic(): void {
    if (this.music) {
      this.music.stop();
      this.music.destroy();
      this.music = null;
    }
    this.currentMusicKey = null;
  }

  /** One-shot sound effect. */
  playSfx(key: keyof typeof AUDIO_PATHS, volume = 1.0): void {
    if (this.muted) return;
    const vol = Math.max(0, Math.min(1, volume * this.sfxVolume));
    this.soundManager.play(key as string, { volume: vol });
  }

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.music) {
      // BaseSound typing in Phaser is loose; the concrete sound (WebAudio/HTML5) has setVolume
      (this.music as any).setVolume(m ? 0 : this.musicVolume);
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setMusicVolume(v: number): void {
    this.musicVolume = Math.max(0, Math.min(1, v));
    if (this.music && !this.muted) {
      (this.music as any).setVolume(this.musicVolume);
    }
  }

  setSfxVolume(v: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, v));
  }

  /**
   * Temporarily duck music volume for important SFX (tram bell, big impacts, boss).
   * Restores after a short time. No tween for minimal first implementation.
   */
  duck(factor = 0.3, restoreAfterMs = 650): void {
    if (!this.music || this.muted) return;
    const original = this.musicVolume;
    (this.music as any).setVolume(original * factor);
    window.setTimeout(() => {
      if (this.music && !this.muted) {
        (this.music as any).setVolume(original);
      }
    }, restoreAfterMs);
  }

  get isMuted(): boolean {
    return this.muted;
  }

  /** Current music key (for debug / resume after settings) */
  get currentMusic(): string | null {
    return this.currentMusicKey;
  }
}
