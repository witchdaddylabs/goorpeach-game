/**
 * main.ts — Phaser game init ONLY (CLAUDE.md). No game logic here.
 *
 * Rendering is locked: 480×270 internal resolution, pixel-art, FIT-scaled and
 * centred. The look is chunky on purpose — do not "fix" the pixels.
 *
 * Mobile-first / touch conventions (carried into every scene):
 *  - The game is landscape-locked; portrait shows a rotate prompt.
 *  - Touch is the primary input. ui/TouchControls.ts emits the SAME events as
 *    keyboard, so scenes never branch on input source (CLAUDE.md rule 5).
 *  - Honour `prefers-reduced-motion`: the CRT scanline overlay and screen shake
 *    default OFF when the OS requests reduced motion (toggleable in Settings).
 *
 * Scaffold stub: scenes are stubs and not yet registered. The implementation
 * sessions add them to the `scene` array below, starting with BootScene.
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLOUR_HEX } from './config';

// Initial scenes for first playable milestone (Boot → Preload → Menu).
// Additional scenes registered here as we follow the CLAUDE.md working pattern
// one step at a time. They remain safe empty shells until implemented.
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { DriveScene } from './scenes/DriveScene';
import { GameOverScene } from './scenes/GameOverScene';
import { BossScene } from './scenes/BossScene';
import { VictoryScene } from './scenes/VictoryScene';
import { ScoreboardScene } from './scenes/ScoreboardScene';
// Later (not started yet):
// import { LevelSelectScene } from './scenes/LevelSelectScene';
// etc.

/** Whether the player's OS asks us to minimise motion (WCAG 2.1). */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: COLOUR_HEX.textDark,
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  // Boot → Preload (progress) → Menu → Drive → GameOver is the playable loop so far.
  // Remaining scenes (Boss, Victory, LevelSelect, Scoreboard) registered as each is
  // implemented to a verifiable state and tested in the browser.
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    DriveScene,
    GameOverScene,
    BossScene,
    VictoryScene,
    ScoreboardScene,
  ],
};

// eslint-disable-next-line no-new -- Phaser.Game registers itself on construction.
new Phaser.Game(config);
