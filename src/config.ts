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
  Scoreboard: 'ScoreboardScene',
} as const;

/* -------------------------------------------------------------------------- */
/* Asset paths (relative to /public) — see docs/ASSETS.md for full list        */
/* and recommended production order. Use chunky low-res GTA-1 style.           */
/* Coloured rects / graphics as placeholders until real PNGs + audio land.     */
/* -------------------------------------------------------------------------- */

export const SPRITE_PATHS = {
  // Player (VN Commodore) — using real dumped sedan from marcusvh 2D Top Down Pixel Cars pack
  playerClean: 'sprites/2D TOP DOWN PIXEL CARS/Sedan/sedan_red.png',
  // TODO: create damaged/wrecked variants + turn animations from the source

  // Couriers — using cars from the same pack as temporary bases (will recolour + reshape)
  courierScooter: 'sprites/2D TOP DOWN PIXEL CARS/Compact/compact_orange.png', // GoorPeach proxy
  courierEbike: 'sprites/2D TOP DOWN PIXEL CARS/Coupe/coupe_green.png',       // ChewSnog proxy
  courierPushbike: 'sprites/2D TOP DOWN PIXEL CARS/Sport/sport_blue.png',     // GorgeRush proxy (later recolour)

  // Road / background — the road itself is drawn procedurally (palette tokens,
  // chunky GTA-1 look) so no heavy background bitmap ships. Kept tileset ref for
  // future detail props.
  roadTiles: 'sprites/sprite25_0.png',           // chasersgaming road set

  // Additional vehicles from other dumped sources (for variety / boss / tram proxies)
  vehicleAudi: 'sprites/vehicles/Audi.png',
  vehiclePolice: 'sprites/vehicles/Police.png',
  vehicleAmbulance: 'sprites/vehicles/Ambulance.png',

  // TODO: the rest (food bags, powerups, tram, landmarks, boss, pen, damage states, animations)
  // will be added as the unique assets are generated or further sourced.
} as const;

export const AUDIO_PATHS = {
  // Real audio dumped by user (from freesound / similar sources)
  menuLoop: 'audio/zec53-sci-fi-and-menacing-synth-drums-loop-371304.mp3',
  drivingLoopA: 'audio/freesound_community-video-game-music-loop-27629.mp3',
  drivingLoopB: 'audio/freesounds123-car-engine-335601.mp3',
  bossLoop: 'audio/freesound_community-video-game-music-loop-27629.mp3', // reuse for now

  // SFX from the dump
  ozempicFire: 'audio/freesounds123-car-engine-335601.mp3', // placeholder engine for now
  courierCrash: 'audio/freesound_community-large-crash-with-cataiff-14490.mp3',
  engineRev: 'audio/freesounds123-car-engine-335601.mp3',
  tiguanStart: 'audio/freesounds123-car-engine-335601.mp3',
  tramBell: 'audio/freesound_community-tram-bell-29757.mp3',
  tramImpact: 'audio/freesound_community-large-crash-with-cataiff-14490.mp3',
  heartLost: 'audio/car_engine_demo.mp3', // tiny placeholder
  powerupPickup: 'audio/freesound_community-tram-bell-29757.mp3', // chime-like
  victorySting: 'audio/freesound_community-video-game-music-loop-27629.mp3',
  gameoverSting: 'audio/freesound_community-large-crash-with-cataiff-14490.mp3',
} as const;

/* -------------------------------------------------------------------------- */
/* localStorage keys (used only via systems/Persistence.ts)                    */
/* -------------------------------------------------------------------------- */

export const STORAGE_KEYS = {
  highestUnlockedLevel: 'gp.unlocked',
  settings: 'gp.settings',
  localScores: 'gp.localScores', // offline fallback cache — see systems/Scoreboard.ts
} as const;

/* -------------------------------------------------------------------------- */
/* Scoreboard + scoring                                                        */
/*                                                                             */
/* The leaderboard is a single global Top-N ranked on the final score of a     */
/* full run, with classic 3-letter arcade initials. It is served by a          */
/* Cloudflare Pages Function backed by D1 (see functions/api/scores.ts and     */
/* docs/SCOREBOARD.md). All access goes through systems/Scoreboard.ts.         */
/* -------------------------------------------------------------------------- */

export const LEADERBOARD = {
  /** Same-origin Pages Function route. */
  apiPath: '/api/scores',
  /** How many entries the board shows / the API returns. */
  topN: 20,
  /** Classic arcade initials length. */
  initialsLength: 3,
  /** Server-side sanity cap; submissions above this are rejected as bogus. */
  maxScore: 1_000_000,
  /** Levels are 1..5 (Richmond → Kew). */
  minLevel: 1,
  maxLevel: 5,
} as const;

/**
 * Scoring model — config-driven so it can be tuned. systems/Score.ts tallies a
 * run from these; DriveScene / BossScene feed it events during implementation.
 * Points by courier brand reflect difficulty (ChewSnog e-bikes are tanky).
 */
export const SCORING = {
  courierPoints: {
    GoorPeach: 100, // scooter — fast, fragile
    ChewSnog: 250, // e-bike — 2 HP, tanky
    GorgeRush: 75, // pushbike — slow, swarms
  },
  levelClearBonus: 1000,
  survivalBonusPerSecond: 10, // time left on the clock at level end
  bossDefeatBonus: 5000,
} as const;

/* -------------------------------------------------------------------------- */
/* Gameplay constants — TODO: tune during implementation                       */
/* -------------------------------------------------------------------------- */

export const PLAYER = {
  startingLives: 3, // 3 hearts — see docs/BRIEF.md
  startingAmmo: 5, // tutorial ammo
  scale: 0.85,
  // Base dimensions (pixels at 480×270 internal res). Player-favouring hitboxes.
  width: 48,
  height: 96,
  // Steering / movement (tuned from config only)
  steerSpeed: 220, // px per second lateral
  forwardSpeed: 140, // base auto-scroll feel (actual level uses scrollSpeed from levels.ts)
  brakeMultiplier: 0.55,
  boostMultiplier: 1.5,
  // Collision tuning (forgiving on player side per CLAUDE.md rule 9)
  hitboxPadding: 8,
} as const;

/* -------------------------------------------------------------------------- */
/* Ozempic pen projectile                                                      */
/* -------------------------------------------------------------------------- */

export const PEN = {
  speed: 480, // px/s up the screen
  scaleX: 0.22,
  scaleY: 0.55,
  tint: 0xaaddff,
  muzzleOffsetY: 30, // spawn this far ahead of the car
  despawnY: 20, // cull above this line
} as const;

/* -------------------------------------------------------------------------- */
/* Courier constants (from BRIEF.md table + CLAUDE.md rule 1)                */
/* -------------------------------------------------------------------------- */

export const COURIER = {
  scale: 0.72,
  hitGenerosity: 4, // px expansion of courier hitbox when player shoots (rule 9)
  GoorPeach: {
    hp: 1,
    speed: 160,
    weave: true,
    weaveAmp: 25, // px lateral
    weaveFreq: 2.5, // oscillations per second
  },
  ChewSnog: {
    hp: 2,
    speed: 95,
    weave: false,
    weaveAmp: 0,
    weaveFreq: 0,
  },
  GorgeRush: {
    hp: 1,
    speed: 65,
    weave: false,
    weaveAmp: 0,
    weaveFreq: 0,
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Road background (drawn procedurally) + lanes                               */
/* -------------------------------------------------------------------------- */

export const ROAD = {
  topY: 40, // play area top (below HUD band)
  bottomY: 230, // play area bottom
  footpathWidth: 56, // cream verge each side
  laneXs: [170, 240, 310], // courier / power-up lane centres
  // Scrolling dashed centre lines
  lineColumns: [205, 275], // x positions of dashed lane dividers
  dashLength: 22,
  dashGap: 20,
  dashWidth: 4,
} as const;

/* -------------------------------------------------------------------------- */
/* Touch controls (mobile-first — ui/TouchControls.ts)                         */
/* -------------------------------------------------------------------------- */

export const TOUCH = {
  steerDeadzone: 8, // px from anchor before a drag counts as left/right
  showHints: true, // faint zone overlays on touch devices
  hintAlpha: 0.12,
  // Input zones in internal 480×270 coords (per docs/BRIEF.md):
  //   drag lower-left to steer, hold lower-right to brake, tap upper-right to fire.
  steerZone: { x: 0, y: 140, w: 240, h: 130 },
  brakeZone: { x: 330, y: 170, w: 150, h: 100 },
  fireZone: { x: 330, y: 0, w: 150, h: 110 },
} as const;

/* -------------------------------------------------------------------------- */
/* Tram constants — fixed spawns, 1.5s telegraph, instant death              */
/* -------------------------------------------------------------------------- */

export const TRAM = {
  warningMs: 1500, // telegraph lead time before the tram arrives
  speed: 320,
  width: 120,
  height: 40,
  spawnX: 240, // tram enters down the centre cross-street
  spawnY: 20,
  // Flashing crossing-light telegraph
  lightXs: [180, 288],
  lightY: 20,
  lightW: 12,
  lightH: 8,
  flashMs: 180,
  // Fixed spawn times for level 1 (ms into level)
  spawnTimes: [12000, 38000],
} as const;

/* -------------------------------------------------------------------------- */
/* Power-up constants (effects applied in DriveScene)                        */
/* -------------------------------------------------------------------------- */

export const POWERUP = {
  visualRadius: 10, // chunky pickup icon radius
  ammo: { shots: 3 },
  boost: { multiplier: 1.5, durationMs: 6000 },
  shield: { absorbs: 1 },
  magpie: { radius: 70 },
} as const;
