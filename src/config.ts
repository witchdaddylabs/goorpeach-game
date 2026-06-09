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
  Settings: 'SettingsScene',
  Credits: 'CreditsScene',
} as const;

/* -------------------------------------------------------------------------- */
/* Asset paths (relative to /public) — see docs/ASSETS.md for full list        */
/* and recommended production order. Use chunky low-res GTA-1 style.           */
/* Coloured rects / graphics as placeholders until real PNGs + audio land.     */
/* -------------------------------------------------------------------------- */

export const SPRITE_PATHS = {
  // Player (VN Commodore) — Grok-generated GTA-1 style bespoke sprites
  playerClean: 'sprites/generated/player-clean.png',
  playerWorn: 'sprites/generated/player-worn.png',
  playerWrecked: 'sprites/generated/player-wrecked.png',

  // Couriers — Grok-generated brand sprites
  courierScooter: 'sprites/generated/courier-scooter.png',
  courierEbike: 'sprites/generated/courier-ebike.png',
  courierPushbike: 'sprites/generated/courier-pushbike.png',
  foodBag: 'sprites/generated/food-bag.png',

  // Player turn frames (composed into sheets at build time)
  playerTurnLeft: 'sprites/generated/player-turn-left.png',
  playerTurnRight: 'sprites/generated/player-turn-right.png',

  // Road / background — procedural scroll; tileset kept for future detail props
  roadTiles: 'sprites/sprite25_0.png',

  // Hazards + projectiles
  tramBody: 'sprites/generated/tram-body.png',
  tramWarningLights: 'sprites/generated/tram-warning-lights.png',
  ozempicPen: 'sprites/generated/ozempic-pen.png',

  // Power-ups (32×32 icons)
  powerupAmmo: 'sprites/generated/powerup-ammo.png',
  powerupBoost: 'sprites/generated/powerup-boost.png',
  powerupShield: 'sprites/generated/powerup-shield.png',
  powerupMagpie: 'sprites/generated/powerup-magpie.png',

  // Boss arena (Kew) — Nerd state sprites + Tiguan drive frame
  bossNerd: 'sprites/generated/boss-nerd.png',
  bossNerdFeed: 'sprites/generated/boss-nerd-feed.png',
  bossNerdHit: 'sprites/generated/boss-nerd-hit.png',
  bossNerdBolt: 'sprites/generated/boss-nerd-bolt.png',
  bossTiguan: 'sprites/generated/boss-tiguan.png',
  bossTiguanDrive: 'sprites/generated/boss-tiguan-drive.png',
  landmarkKewMansion: 'sprites/generated/landmark-kew-mansion.png',

  // Suburb landmarks (easter eggs per level)
  landmarkSkipGirl: 'sprites/generated/landmark-skip-girl.png',
  landmarkVicMarket: 'sprites/generated/landmark-vic-market.png',
  landmarkMcg: 'sprites/generated/landmark-mcg.png',

  // Legacy sourced vehicles (ambient variety)
  vehicleAudi: 'sprites/vehicles/Audi.png',
  vehiclePolice: 'sprites/vehicles/Police.png',
  vehicleAmbulance: 'sprites/vehicles/Ambulance.png',
} as const;

/** Horizontal sprite sheets — frame size + path; keys match PreloadScene texture names. */
export const SPRITE_SHEETS = {
  courierScooterSheet: { path: 'sprites/generated/courier-scooter-sheet.png', frameWidth: 48, frameHeight: 80 },
  courierEbikeSheet: { path: 'sprites/generated/courier-ebike-sheet.png', frameWidth: 48, frameHeight: 80 },
  courierPushbikeSheet: { path: 'sprites/generated/courier-pushbike-sheet.png', frameWidth: 40, frameHeight: 72 },
  foodBagSheet: { path: 'sprites/generated/food-bag-sheet.png', frameWidth: 24, frameHeight: 24 },
  playerTurnLeftSheet: { path: 'sprites/generated/player-turn-left-sheet.png', frameWidth: 64, frameHeight: 128 },
  playerTurnRightSheet: { path: 'sprites/generated/player-turn-right-sheet.png', frameWidth: 64, frameHeight: 128 },
  tramBodySheet: { path: 'sprites/generated/tram-body-sheet.png', frameWidth: 320, frameHeight: 96 },
  tiguanDriveSheet: { path: 'sprites/generated/tiguan-drive-sheet.png', frameWidth: 96, frameHeight: 64 },
} as const;

/** Phaser animation definitions — registered in PreloadScene.create(). */
export const ANIMS = {
  courierScooterWobble: { sheet: 'courierScooterSheet', start: 0, end: 3, rate: 8, repeat: -1 },
  courierEbikeWobble: { sheet: 'courierEbikeSheet', start: 0, end: 3, rate: 6, repeat: -1 },
  courierPushbikePedal: { sheet: 'courierPushbikeSheet', start: 0, end: 3, rate: 10, repeat: -1 },
  foodBagPulse: { sheet: 'foodBagSheet', start: 0, end: 3, rate: 6, repeat: -1 },
  playerTurnLeft: { sheet: 'playerTurnLeftSheet', start: 0, end: 4, rate: 14, repeat: 0 },
  playerTurnRight: { sheet: 'playerTurnRightSheet', start: 0, end: 4, rate: 14, repeat: 0 },
  tramRoll: { sheet: 'tramBodySheet', start: 0, end: 3, rate: 8, repeat: -1 },
  tiguanDrive: { sheet: 'tiguanDriveSheet', start: 0, end: 1, rate: 6, repeat: -1 },
} as const;

export const AUDIO_PATHS = {
  // Real audio dumped by user (from freesound / similar sources)
  menuLoop: 'audio/zec53-sci-fi-and-menacing-synth-drums-loop-371304.mp3',
  drivingLoopA: 'audio/freesound_community-video-game-music-loop-27629.mp3',
  drivingLoopB: 'audio/freesounds123-car-engine-335601.mp3',
  bossLoop: 'audio/freesound_community-video-game-music-loop-27629.mp3', // reuse for now

  // SFX — short trimmed clips only; never reuse loop/music files as one-shots (they stack/double).
  ozempicFire: 'audio/courier-crash-trimmed.mp3', // short pew (was engine loop — stacked every 280ms fire)
  courierCrash: 'audio/courier-crash-trimmed.mp3',
  engineRev: 'audio/freesounds123-car-engine-335601.mp3', // reserved for future boost sfx
  tiguanStart: 'audio/courier-crash-trimmed.mp3', // boss phase sting — short, not engine loop
  tramBell: 'audio/tram-bell-trimmed.mp3',
  tramImpact: 'audio/freesound_community-large-crash-with-cataiff-14490.mp3',
  heartLost: 'audio/courier-crash-trimmed.mp3', // short thud (was engine loop doubling under music)
  powerupPickup: 'audio/courier-crash-trimmed.mp3', // short blip — never reuse tram bell
  victorySting: 'audio/courier-crash-trimmed.mp3',
  gameoverSting: 'audio/courier-crash-trimmed.mp3',
} as const;

/** SFX timing — trim long samples so they do not stack or block the next cue. */
export const AUDIO_SFX = {
  /** Trimmed tram asset starts at the ding — no seek needed. */
  tramBellSeekSec: 0,
  tramBellMaxMs: 1400,
  tramBellVolume: 1.0,
  courierCrashMaxMs: 1200,
  courierCrashSeekSec: 0,
  /** One-shot caps — prevent long/loop sources stacking (ozempic fire cooldown is 280ms). */
  ozempicFireMaxMs: 260,
  heartLostMaxMs: 500,
  powerupPickupMaxMs: 700,
  gameoverStingMaxMs: 1500,
  victoryStingMaxMs: 1200,
  tiguanStartMaxMs: 800,
  tramImpactMaxMs: 1400,
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
/* Copy / messages (dry, Australian — see docs/BRIEF.md)                       */
/* Per-level courier death lines live with the level in data/levels.ts.        */
/* -------------------------------------------------------------------------- */

export const MESSAGES = {
  tramDeath: 'You got cleaned up by a W-class on a cross street. Classic Melbourne.',
  bossEscape: "He's gone to a Grill'd in Chadstone. You can't follow.",
  checkpoint: 'Checkpoint. Good pace.',
} as const;

/* -------------------------------------------------------------------------- */
/* Pause overlay (ui/PauseOverlay.ts) — P key in DriveScene + BossScene        */
/* -------------------------------------------------------------------------- */

export const PAUSE = {
  overlayAlpha: 0.78,
  titleYFrac: 0.26,
  btnStartYFrac: 0.4,
  btnGapFrac: 0.085,
  btnW: 168,
  depth: 10000,
} as const;

/** Default settings — persisted via systems/Persistence.ts (SettingsScene edits these). */
export const SETTINGS = {
  soundVolume: 0.85,
  musicVolume: 0.65,
  crtScanlines: true,
  touchSteerSensitivity: 1.0,
  touchInputMode: 'joystick' as const,
} as const;

export const SETTINGS_UI = {
  volumeStep: 0.05,
  volumeMin: 0,
  volumeMax: 1,
  sensitivityStep: 0.1,
  sensitivityMin: 0.5,
  sensitivityMax: 2.0,
} as const;

/* -------------------------------------------------------------------------- */
/* CRT scanline overlay (ui/CrtOverlay.ts) — toggle in Settings, default on    */
/* -------------------------------------------------------------------------- */

export const CRT = {
  depth: 9000,
  lineAlpha: 0.1,
  lineSpacing: 3,
  lineHeight: 1,
} as const;

/* -------------------------------------------------------------------------- */
/* Screen shake (systems/ScreenShake.ts) — off when reduced motion is on     */
/* -------------------------------------------------------------------------- */

export const SCREEN_SHAKE = {
  courierHitIntensity: 0.004,
  courierHitDurationMs: 120,
  tramDeathIntensity: 0.012,
  tramDeathDurationMs: 380,
} as const;

/* -------------------------------------------------------------------------- */
/* Particle bursts (systems/Particles.ts) — off when reduced motion is on    */
/* -------------------------------------------------------------------------- */

export const PARTICLES = {
  depth: 15,
  courierBurst: { count: 8, spread: 22, size: 3, durationMs: 280 },
  tramSparks: { count: 12, spread: 34, size: 4, durationMs: 420 },
} as const;

/* -------------------------------------------------------------------------- */
/* Suburb landmarks — fixed-time easter eggs per driving level (BRIEF.md)      */
/* -------------------------------------------------------------------------- */

export const LANDMARKS: Record<
  number,
  {
    showAtMs: number;
    hideAfterMs: number;
    xFrac: number;
    label: string;
    sprite: keyof typeof SPRITE_PATHS;
    displayW: number;
    displayH: number;
  }
> = {
  1: {
    showAtMs: 14000,
    hideAfterMs: 5500,
    xFrac: 0.78,
    label: 'SKIP GIRL',
    sprite: 'landmarkSkipGirl',
    displayW: 32,
    displayH: 48,
  },
  2: {
    showAtMs: 16000,
    hideAfterMs: 5500,
    xFrac: 0.2,
    label: 'VIC MKT',
    sprite: 'landmarkVicMarket',
    displayW: 64,
    displayH: 24,
  },
  3: {
    showAtMs: 12000,
    hideAfterMs: 5500,
    xFrac: 0.52,
    label: 'MCG',
    sprite: 'landmarkMcg',
    displayW: 96,
    displayH: 24,
  },
  4: {
    showAtMs: 18000,
    hideAfterMs: 6000,
    xFrac: 0.68,
    label: 'KEW MANSION',
    sprite: 'landmarkKewMansion',
    displayW: 80,
    displayH: 54,
  },
};

/* -------------------------------------------------------------------------- */
/* Gameplay constants — TODO: tune during implementation                       */
/* -------------------------------------------------------------------------- */

export const PLAYER = {
  startingLives: 3, // 3 hearts — see docs/BRIEF.md
  startingAmmo: 8, // tutorial ammo — topped up by frequent PEN pickups
  scale: 0.62, // smaller Commodore — easier to thread the lanes (was 0.85)
  /**
   * Damage hitbox as a fraction trimmed off each side of the sprite's display
   * bounds. The cleaned sprite has transparent padding, so raw getBounds() reads
   * far bigger than the visible car; this insets it to the car itself, kept
   * slightly forgiving on the player side (CLAUDE.md rule 9).
   */
  hitInsetXFrac: 0.24,
  hitInsetYFrac: 0.13,
  // Base dimensions (pixels at 480×270 internal res). Player-favouring hitboxes.
  width: 48,
  height: 96,
  // Steering / movement (tuned from config only)
  steerSpeed: 300, // px per second lateral at full lock (keyboard or full touch drag)
  forwardSpeed: 140, // fallback; each level passes scrollSpeed as the car's maxSpeed
  cruiseY: 168, // normal lane position (lower on screen = further back in the pack)
  brakeY: 202, // dropped back when braking hard
  brakeMinRatio: 0.18, // floor speed as a fraction of max (slows road scroll)
  brakeDecay: 0.32, // how quickly speed bleeds off under brake
  accelRate: 0.09, // recovery toward cruise when brake released
  yLerp: 0.22, // visual drop-back lerp toward cruiseY / brakeY
  boostMultiplier: 1.5,
  // Collision tuning (forgiving on player side per CLAUDE.md rule 9)
  hitboxPadding: 8,
  /** Texture keys (preloaded in PreloadScene) for progressive damage. */
  textures: { clean: 'playerClean', worn: 'playerWorn', wrecked: 'playerWrecked' },
  wornBelowLives: 3, // swap to worn texture below this count
  criticalLives: 1, // last heart — persistent hazard tint
  hitFlashTint: COLOURS.hazard,
  hitFlashMs: 250,
  shieldTint: COLOURS.bile,
  shieldFlashMs: 300,
  /** Body-roll when steering (clean sprite turn sheets). */
  turnAngle: 8,
  turnLerp: 0.28,
} as const;

/* -------------------------------------------------------------------------- */
/* Courier constants (from BRIEF.md table + CLAUDE.md rule 1)                */
/* -------------------------------------------------------------------------- */

export const COURIER = {
  hitGenerosity: 5, // px expansion when player shoots (rule 9)
  spawnInsetY: 14, // px below road.topY
  spriteDepth: 8,
  /** Compact rider hitboxes — scooters and bikes, not cars (docs/BRIEF.md). */
  body: {
    GoorPeach: { w: 16, h: 22 },
    ChewSnog: { w: 18, h: 24 },
    GorgeRush: { w: 14, h: 26 },
  } as const,
  /** On-screen sprite size (larger than hitbox for readability). */
  displaySize: {
    GoorPeach: { w: 24, h: 40 },
    ChewSnog: { w: 24, h: 40 },
    GorgeRush: { w: 20, h: 36 },
  } as const,
  /** Spritesheet texture keys per brand. */
  sheet: {
    GoorPeach: 'courierScooterSheet',
    ChewSnog: 'courierEbikeSheet',
    GorgeRush: 'courierPushbikeSheet',
  } as const,
  /** Looping wobble / pedal animations per brand. */
  anim: {
    GoorPeach: 'courierScooterWobble',
    ChewSnog: 'courierEbikeWobble',
    GorgeRush: 'courierPushbikePedal',
  } as const,
  foodBagSize: 12,
  brandColour: {
    GoorPeach: COLOURS.hazard,
    ChewSnog: COLOURS.bile,
    GorgeRush: COLOURS.magenta,
  } as const,
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

/** @deprecated Use getLayout().road — kept for types only. */
export const ROAD = {
  topY: 40,
  bottomY: 230,
  footpathWidth: 56,
  laneXs: [170, 240, 310],
  lineColumns: [205, 275],
  dashLength: 22,
  dashGap: 20,
  dashWidth: 4,
} as const;

/* -------------------------------------------------------------------------- */
/* Layout — landscape (480×270) and portrait (270×480) mobile bands           */
/* -------------------------------------------------------------------------- */

export interface RoadLayout {
  topY: number;
  bottomY: number;
  footpathWidth: number;
  laneXs: readonly number[];
  lineColumns: readonly number[];
  dashLength: number;
  dashGap: number;
  dashWidth: number;
}

export interface PlayerLayout {
  cruiseY: number;
  brakeY: number;
}

export interface TouchLayout {
  steerDeadzone: number;
  showHints: boolean;
  hintAlpha: number;
  steerZone: { x: number; y: number; w: number; h: number };
  brakeZone: { x: number; y: number; w: number; h: number };
  fireZone: { x: number; y: number; w: number; h: number };
  moveRange: number;
}

export interface TramLayout {
  length: number;
}

export interface GameLayout {
  width: number;
  height: number;
  portrait: boolean;
  centerX: number;
  centerY: number;
  road: RoadLayout;
  player: PlayerLayout;
  touch: TouchLayout;
  tram: TramLayout;
  hud: {
    titleY: number;
    timerY: number;
    footerY: number;
    hintY: number;
    livesX: number;
    ammoX: number;
    scoreX: number;
  };
}

export const LAYOUT_LANDSCAPE: GameLayout = {
  width: 480,
  height: 270,
  portrait: false,
  centerX: 240,
  centerY: 135,
  road: {
    topY: 40,
    bottomY: 230,
    footpathWidth: 56,
    laneXs: [170, 240, 310],
    lineColumns: [205, 275],
    dashLength: 22,
    dashGap: 20,
    dashWidth: 4,
  },
  player: { cruiseY: 168, brakeY: 202 },
  touch: {
    steerDeadzone: 8,
    showHints: true,
    hintAlpha: 0.12,
    steerZone: { x: 0, y: 140, w: 240, h: 130 },
    brakeZone: { x: 330, y: 170, w: 150, h: 100 },
    fireZone: { x: 330, y: 0, w: 150, h: 110 },
    moveRange: 40,
  },
  tram: { length: 148 },
  hud: { titleY: 26, timerY: 46, footerY: 265, hintY: 250, livesX: 60, ammoX: 180, scoreX: 320 },
};

export const LAYOUT_PORTRAIT: GameLayout = {
  width: 270,
  height: 480,
  portrait: true,
  centerX: 135,
  centerY: 240,
  road: {
    topY: 78,
    bottomY: 400,
    footpathWidth: 28,
    laneXs: [88, 135, 182],
    lineColumns: [108, 162],
    dashLength: 20,
    dashGap: 18,
    dashWidth: 3,
  },
  player: { cruiseY: 340, brakeY: 410 },
  touch: {
    steerDeadzone: 8,
    showHints: true,
    hintAlpha: 0.12,
    steerZone: { x: 0, y: 300, w: 135, h: 180 },
    brakeZone: { x: 175, y: 340, w: 95, h: 140 },
    fireZone: { x: 175, y: 78, w: 95, h: 110 },
    moveRange: 36,
  },
  tram: { length: 120 },
  hud: { titleY: 36, timerY: 58, footerY: 462, hintY: 446, livesX: 42, ammoX: 135, scoreX: 228 },
};

/* -------------------------------------------------------------------------- */
/* Ozempic pen projectile                                                      */
/* -------------------------------------------------------------------------- */

export const PEN = {
  speed: 480, // px/s up the screen
  width: 8,
  height: 16,
  colour: COLOURS.cyan,
  muzzleOffsetY: 30, // spawn this far ahead of the car
  despawnY: ROAD.topY - 4, // cull above the play band
  texture: 'ozempicPen',
} as const;

/* -------------------------------------------------------------------------- */
/* Touch controls (mobile-first — ui/TouchControls.ts)                         */
/* -------------------------------------------------------------------------- */

/** @deprecated Use getLayout().touch */
export const TOUCH = LAYOUT_LANDSCAPE.touch;

/* -------------------------------------------------------------------------- */
/* Tram constants — fixed spawns, 1.5s telegraph, instant death              */
/* -------------------------------------------------------------------------- */

export const TRAM = {
  warningMs: 1500, // telegraph lead time before the tram arrives
  crossDurationMs: 500, // cross the playable road in ~0.5s (docs/BRIEF.md)
  length: 148, // long axis — W-class body along the street
  height: 34, // short axis across the lane
  /**
   * Cross-street sits this many px above cruiseY (smaller Y). Braking drops the car
   * back below the crossing; cruising keeps you in the kill band.
   */
  crossAheadOffset: 32,
  /** Player-favouring hitbox — generous on X, tight on Y so braking clears the tram. */
  hitPaddingX: 6,
  hitPaddingY: 2,
  // Flashing crossing-light telegraph at the footpath edges of the cross-street
  lightInset: 10, // px in from each footpath edge
  lightW: 14,
  lightH: 10,
  flashMs: 180,
  duckFactor: 0.3,
  duckRestoreMs: 650,
  /** Ms after the ding before ducking music — keeps the bell upfront. */
  duckDelayMs: 80,
  // Note: fixed spawn times are per-level in data/levels.ts (tramSpawnTimes).
  // Direction alternates left→right / right→left per spawn index in DriveScene.
} as const;

/* -------------------------------------------------------------------------- */
/* Enhanced tram telegraph (entities/TramWarning.ts) — louder, clearer warning */
/* The base lights alone read as too subtle, so the telegraph now adds a       */
/* flashing hazard band across the road, direction chevrons, a label, the bell */
/* and a touch-haptic pulse. All tuning lives here (rule 1).                    */
/* -------------------------------------------------------------------------- */

export const TRAM_WARN = {
  /** Hazard zone painted across the road at the cross line — the kill band. */
  bandHeight: 30,
  bandAlphaSteady: 0.14, // always visible so the zone is never a surprise
  bandAlphaFlash: 0.4, // peak alpha on the flash beat
  bandColour: COLOURS.caution,
  borderColour: COLOURS.hazard,
  borderWidth: 2,
  /** Bigger, higher-contrast edge lights than the base TRAM.lightW/H. */
  lightW: 20,
  lightH: 16,
  lightOffAlpha: 0.18, // dimmer off-state than before (was 0.45) → harder flash
  /** Direction chevrons telegraph which way the W-class is coming from. */
  chevronCount: 3,
  chevronSize: 9,
  chevronGap: 13,
  chevronColour: COLOURS.hazard,
  /** Flashing label above the band. */
  label: 'TRAM',
  labelColour: COLOUR_HEX.caution,
  labelSize: '11px',
  labelOffsetY: 24, // px above the cross line
  /** Ring the bell this many times across the telegraph, plus a haptic buzz. */
  bellRings: 2,
  bellVolume: 1,
  vibrateMs: 70, // navigator.vibrate on touch devices
  depth: 7, // above road, below couriers/player
} as const;

/* -------------------------------------------------------------------------- */
/* Power-up constants (effects applied in DriveScene)                        */
/* -------------------------------------------------------------------------- */

export const POWERUP = {
  visualRadius: 12, // hit radius for collection
  iconSize: 24, // display size for sprite icons
  floatAmp: 3, // px bob amplitude
  floatHz: 1.2, // bob frequency
  spawnAboveRoad: 28, // scrolls down with the road into the player band
  textures: {
    ammo: 'powerupAmmo',
    boost: 'powerupBoost',
    shield: 'powerupShield',
    magpie: 'powerupMagpie',
  } as const,
  ammo: { shots: 4 },
  boost: { multiplier: 1.5, durationMs: 6000 },
  shield: { absorbs: 1 },
  magpie: { radius: 70 },
} as const;

/* -------------------------------------------------------------------------- */
/* Boss — The Nerd (Kew arena, two phases). All tuning here; see docs/BRIEF.md */
/* -------------------------------------------------------------------------- */

export const BOSS = {
  // Player moves freely within the arena (not lane-locked like driving).
  arena: { x: 40, y: 60, w: 400, h: 175 },
  playerSpeed: 155, // px/s
  playerScale: 0.7,
  nerd: {
    x: 240,
    y: 92,
    w: 84,
    h: 78,
    texture: 'bossNerd',
    textures: {
      idle: 'bossNerd',
      feed: 'bossNerdFeed',
      hit: 'bossNerdHit',
      bolt: 'bossNerdBolt',
    },
    feedFlashMs: 450,
    hitFlashMs: 220,
    boltRunMs: 380,
  },
  feed: {
    start: 30, // initial feed meter %
    winAt: 0, // drain to here to beat the boss
    phase2At: 100, // reaching here triggers the Tiguan escape
    passiveRisePerSec: 2.5, // creeps up — tuned player-favouring after playtest
    penDrain: 10, // % dropped per pen that hits the nerd
    deliveryRise: 12, // % gained when a courier reaches the nerd
    secondWind: 45, // meter reset after surviving an escape (still tense)
  },
  ammo: { start: 9, max: 12, regenMs: 500 }, // ammo regenerates in the arena
  feeder: { intervalMs: 2100, speed: 68, scale: 0.5, deliverDist: 30 },
  fireCooldown: 260,
  escape: {
    timeMs: 18000, // 18s to disable the Tiguan
    tiguanHp: 8, // pen hits to disable
    tiguanSpeed: 70, // px/s toward the exit
    tiguanScale: 0.85,
    tiguanTexture: 'tiguanDriveSheet',
    tiguanAnim: 'tiguanDrive',
    exitY: -50, // off the top = escaped
  },
} as const;
