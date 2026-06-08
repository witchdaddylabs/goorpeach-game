/**
 * config.ts — the single home for ALL game constants.
 *
 * CLAUDE.md rule 1: never hardcode a speed, HP, spawn rate, time, or colour in a
 * scene or entity. If a designer would tune it, it lives here.
 * CLAUDE.md rule 6: sprite/audio paths are constants here, never typed inline.
 *
 * This is the scaffold seed — the locked palette is filled in; gameplay numbers
 * and asset paths are stubbed with TODOs for the implementation sessions.
 */

/* -------------------------------------------------------------------------- */
/* Rendering (locked — see CLAUDE.md)                                          */
/* -------------------------------------------------------------------------- */

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;

/* -------------------------------------------------------------------------- */
/* Palette — late-90s Melbourne (locked, 10 tokens from docs/BRIEF.md)         */
/* No hardcoded hex anywhere else; reference these tokens.                      */
/* -------------------------------------------------------------------------- */

export const COLOURS = {
  road: 0x3a3a42, // Asphalt — warmer than black
  footpath: 0xe8d8b0, // Cream — Memphis-era, footpaths / tram trim
  magenta: 0xff2e9a, // Hot pink — UI accent, GorgeRush brand
  cyan: 0x00d4d4, // 90s teal — UI highlights, power-up glows
  caution: 0xffd900, // Sign yellow — HUD warnings, tram caution lights
  hazard: 0xff7a1c, // Neon orange — GoorPeach brand, hazard markings
  bile: 0x39ff14, // Highlighter green — ChewSnog brand
  tramBody: 0x3a8c54, // W-class tram body green
  text: 0xf4f0e0, // Bone — UI text on dark backgrounds
  textDark: 0x1a1a22, // Charcoal — UI text on cream backgrounds
} as const;

/** String forms for CSS / Phaser text styles that need a "#rrggbb". */
export const COLOUR_HEX = {
  road: '#3a3a42',
  footpath: '#e8d8b0',
  magenta: '#ff2e9a',
  cyan: '#00d4d4',
  caution: '#ffd900',
  hazard: '#ff7a1c',
  bile: '#39ff14',
  tramBody: '#3a8c54',
  text: '#f4f0e0',
  textDark: '#1a1a22',
} as const;

/* -------------------------------------------------------------------------- */
/* Fonts (locked — see docs/BRIEF.md typography)                               */
/* -------------------------------------------------------------------------- */

export const FONTS = {
  title: 'Bungee', // titles, HUD numbers, level cards
  mono: 'JetBrains Mono', // tabular HUD elements
} as const;

/* -------------------------------------------------------------------------- */
/* Scene keys — registered in main.ts                                          */
/* -------------------------------------------------------------------------- */

export const SCENES = {
  Boot: 'BootScene',
  Preload: 'PreloadScene',
  Menu: 'MenuScene',
  LevelSelect: 'LevelSelectScene',
  Drive: 'DriveScene',
  Boss: 'BossScene',
  GameOver: 'GameOverScene',
  Victory: 'VictoryScene',
} as const;

/* -------------------------------------------------------------------------- */
/* Asset paths (relative to /public) — TODO: fill in as assets land            */
/* -------------------------------------------------------------------------- */

export const SPRITE_PATHS = {
  // TODO: e.g. playerClean: 'sprites/commodore-clean.png' — see docs/ASSETS.md
} as const;

export const AUDIO_PATHS = {
  // TODO: e.g. menuLoop: 'audio/menu-loop.mp3' — see docs/ASSETS.md
} as const;

/* -------------------------------------------------------------------------- */
/* localStorage keys (used only via systems/Persistence.ts)                    */
/* -------------------------------------------------------------------------- */

export const STORAGE_KEYS = {
  highestUnlockedLevel: 'gp.unlocked',
  settings: 'gp.settings',
} as const;

/* -------------------------------------------------------------------------- */
/* Gameplay constants — TODO: tune during implementation                       */
/* -------------------------------------------------------------------------- */

export const PLAYER = {
  startingLives: 3, // 3 hearts — see docs/BRIEF.md
  // TODO: steerSpeed, brakeForce, hitbox dimensions, etc.
} as const;
