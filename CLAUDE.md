# Claude Code — Build Rules for GoorPeach Apocalypse

*Read this every session. Then read `docs/BRIEF.md` for what the game is.*

-----

## What this is

A single-page browser game. Static HTML / JS. Built with Phaser 3 + TypeScript + Vite. Deployed as static files to Cloudflare Pages.

**One backend exception (added deliberately): the global high-score board.** It is a single Cloudflare Pages Function (`/api/scores`) backed by Cloudflare D1, same-origin with the static site — no second host, no auth, no accounts, no analytics, no personal data (3-letter arcade initials only). This is the ONLY server-side piece. Do not add any other backend, API routes, auth, accounts, or analytics. See `docs/SCOREBOARD.md`.

-----

## Stack (non-negotiable)

- **Phaser 3** (latest 3.x)
- **TypeScript strict** — no `any`, no `!` assertions, no `// @ts-ignore` without a comment explaining why
- **Vite** (vanilla-ts template)
- **localStorage** for local persistence (settings, unlocked levels, volume, offline scoreboard fallback)
- **Cloudflare Pages** for hosting, **Cloudflare D1** for the global high-score board only (see `docs/SCOREBOARD.md`)
- **No frameworks.** No React, Vue, Svelte. No state libraries. Phaser scenes ARE the state.
- **No CSS frameworks.** Inline styles on the canvas wrapper and pause overlay only. Phaser draws everything else.

-----

## Visual rendering (locked)

This is a late-1990s top-down driving game. Reference: GTA 1 (1997). Configure Phaser accordingly:

```ts
// in main.ts game config
{
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 480,
    height: 270,
  },
  // ... rest of config
}
```

Internal resolution 480×270 scaled to viewport. Chunky pixels are the look — do not “fix” them. All colour values are tokens defined in `config.ts` from the palette in `docs/BRIEF.md`. No hardcoded hex values in scenes or entities.

Subtle CRT scanline overlay rendered as a Phaser RenderTexture or shader at 20% opacity over the game layer. Toggleable in Settings, default on.

-----

## Folder structure (locked)

```
/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── wrangler.toml        # Cloudflare Pages + D1 binding (scoreboard only)
├── CLAUDE.md
├── functions/
│   └── api/
│       └── scores.ts    # Pages Function: GET/POST global high scores (D1)
├── migrations/
│   └── 0001_create_scores.sql
├── public/
│   ├── sprites/         # PNG sprite sheets
│   ├── audio/           # mp3 / ogg
│   └── fonts/
├── src/
│   ├── main.ts          # Phaser game init only
│   ├── config.ts        # ALL game constants (speeds, HP, spawn rates, colours, paths)
│   ├── types.ts         # shared TS types
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   ├── MenuScene.ts
│   │   ├── LevelSelectScene.ts
│   │   ├── DriveScene.ts        # parameterised by level id
│   │   ├── BossScene.ts
│   │   ├── GameOverScene.ts
│   │   ├── VictoryScene.ts
│   │   └── ScoreboardScene.ts   # global Top-20 board + initials entry
│   ├── entities/
│   │   ├── PlayerCar.ts
│   │   ├── Courier.ts           # base class
│   │   ├── ScooterCourier.ts
│   │   ├── EbikeCourier.ts
│   │   ├── PushbikeCourier.ts
│   │   ├── Tram.ts              # rogue W-class, instant-death hazard
│   │   ├── TramWarning.ts       # flashing crossing-light telegraph
│   │   ├── OzempicPen.ts
│   │   └── PowerUp.ts
│   ├── ui/
│   │   ├── HUD.ts
│   │   ├── TouchControls.ts
│   │   └── PauseOverlay.ts
│   ├── data/
│   │   └── levels.ts            # level config: length, courier waves, powerup spawns
│   └── systems/
│       ├── Persistence.ts       # localStorage wrapper
│       ├── Audio.ts             # central audio manager
│       ├── Score.ts             # run-score tally (config-driven)
│       └── Scoreboard.ts        # high-score API client (+ offline fallback)
└── docs/
    ├── BRIEF.md
    ├── SETUP.md
    ├── ASSETS.md
    └── SCOREBOARD.md
```

-----

## Rules

1. **All numbers come from `config.ts`.** Never hardcode speed, HP, spawn rate, time, or colour in a scene or entity file. If a designer would tune it, it’s in `config.ts`.
1. **Levels come from `data/levels.ts`.** Adding a new level = editing one file. Each level export: id, name, durationMs, scrollSpeed, courierWaves, powerUpSpawns, backgroundTileset.
1. **Audio goes through `systems/Audio.ts`.** No `this.sound.play(...)` in scenes directly. The Audio manager handles mute, ducking between music tracks, and the browser-blocks-audio-until-first-interaction quirk.
1. **Persistence goes through `systems/Persistence.ts`.** No raw `localStorage.setItem/getItem` in scenes. Wrap everything so we can swap to a different store later if needed.
1. **High scores go through `systems/Scoreboard.ts`.** No `fetch` to `/api/scores` in scenes. The Scoreboard manager handles the API call, rank, and the offline localStorage fallback. Run scoring lives in `systems/Score.ts`, tuned from `SCORING` in `config.ts`.
1. **Touch controls live in `ui/TouchControls.ts` only.** Keyboard handlers go in the relevant scene. Touch overlay is a single component that emits the same events keyboard does — scenes don’t know which input fired.
1. **Sprite paths are constants in `config.ts`.** Never type a file path string in a scene or entity.
1. **One scene per file.** No multi-scene files.
1. **Mobile-first.** Test at 390×844 portrait (must show rotate prompt) and 844×390 landscape (must be fully playable). Desktop is a happy bonus.
1. **Player-favouring collision boxes.** Slightly forgiving on player hitbox, slightly generous on courier hitbox when player shoots.
1. **Predictable spawn patterns over RNG.** Same level → same wave sequence. Players should be able to learn it.

-----

## Do not

- Add any backend, API routes, auth, user accounts, or analytics **beyond** the single `/api/scores` high-score Function (the one sanctioned exception — no auth, no accounts, no analytics, no PII)
- Add React, Vue, Svelte, or any UI framework
- Add Tailwind or any CSS framework
- Use real brand names (Uber Eats, Menulog, DoorDash). Parody names only: **GoorPeach, ChewSnog, GorgeRush**
- Add tracking pixels, ads, or third-party scripts
- Use a vague spinning “Loading…” spinner. Use a Phaser PreloadScene with a real progress bar drawn against actual asset count.
- Mix British and American English. Australian English: colour, customise, neighbour, centre, organise, realise.
- Use exclamation marks in body copy. Reserve for impact moments only.

-----

## When ambiguous

- Default to **fewer features, more polish.**
- Default to **predictable** over random.
- Default to **player-favouring** collision and timing.
- Default to **fixed** rather than configurable. New setting = new bug surface.

-----

## Audio gotcha — read this

Browsers block audio until first user interaction. The MenuScene’s Start button is the unlock point. `systems/Audio.ts` must use `Phaser.Sound.WebAudioSoundManager` and call `context.resume()` on that first click. Verify by testing on Safari iOS — that’s the strictest browser for this.

-----

## Build & deploy

```
npm run dev      # local dev at localhost:5173
npm run build    # outputs /dist
npm run preview  # preview the built dist locally
```

Cloudflare Pages auto-deploys from `main` branch.

- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite

-----

## Working pattern

Build **one scene at a time** to playable state, then move on. Do not scaffold the whole game in one prompt — output quality drops sharply. Suggested order:

1. BootScene + PreloadScene (asset loading with progress bar)
1. MenuScene (with working audio unlock)
1. DriveScene — level 1 (Richmond) only, no couriers
1. PlayerCar entity (steering, brake, damage states)
1. OzempicPen projectile + firing
1. Courier base class + ScooterCourier
1. EbikeCourier + PushbikeCourier
1. Tram + TramWarning (telegraph, instant-death collision, fixed spawn from data/levels.ts)
1. PowerUps (all four)
1. HUD (lives, ammo, level timer)
1. TouchControls overlay
1. GameOverScene
1. Remaining levels (Fitzroy → Approach Kew)
1. BossScene Phase 1
1. BossScene Phase 2 (Tiguan escape)
1. VictoryScene
1. Settings screen + Level Select
1. Polish pass: damage states, easter eggs, screen shake, particle effects, CRT scanline shader

Verify in browser between each step. Don’t stack three steps in one prompt.