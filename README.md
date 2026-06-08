# GoorPeach Apocalypse

A high-paced, Melbourne-specific arcade racer. Drive a beat-up VN Commodore from
Richmond to Kew through delivery-rider-infested streets, Ozempic-shoot the
couriers, dodge rogue W-class trams, and stop the nerd before he escapes in his
VW Tiguan. Late-1990s, GTA-1-style top-down look.

A single-page browser game — static HTML/JS, no backend, no accounts, no
tracking.

## Stack

- **Phaser 3** + **TypeScript** (strict)
- **Vite** (build / dev server)
- **localStorage** for local persistence (settings, unlocked levels, offline scores)
- **Cloudflare Pages** for static hosting, **Cloudflare D1** for the global
  high-score board only (`/api/scores` Pages Function — see `docs/SCOREBOARD.md`)

Built mobile-first and for touch, landscape-locked, with WCAG 2.1 base
accessibility. See `CLAUDE.md` for the non-negotiable build rules and
`docs/BRIEF.md` for the full game design.

## Run it

```bash
npm install
npm run dev      # local dev at localhost:5173
npm run build    # type-checks, then outputs /dist
npm run preview  # preview the built dist locally
```

## Current state — scaffold only

This repo is **scaffolded but not yet implemented**. The folder structure and a
stub file for every scene, entity, UI component, data file, and system exist and
type-check, but contain no game logic yet. The skeleton maps 1:1 to the locked
structure in `CLAUDE.md`, so each piece has an obvious home.

### Next step

Following the working pattern at the bottom of `CLAUDE.md`, build one scene at a
time, verifying in the browser between each:

1. **BootScene + PreloadScene** — asset loading with a real progress bar.
2. **MenuScene** — title screen with the audio-context unlock on Start.
3. **DriveScene + PlayerCar** — level 1 (Richmond) only, no couriers yet.

Then couriers, trams, power-ups, HUD, touch controls, remaining levels, the boss
fight, and a final polish pass — in that order.

## Repository layout

- `CLAUDE.md` — build rules (read every session).
- `docs/BRIEF.md` — game design, palette, levels, copy.
- `docs/ASSETS.md` — sprite/sound/font production guide and licensing.
- `docs/SETUP.md` — environment setup and deployment.
- `src/` — game source (scenes, entities, ui, data, systems) + `config.ts`
  (all constants) and `types.ts` (shared types).
- `functions/` — Cloudflare Pages Functions (`/api/scores` high-score endpoint).
- `migrations/` — D1 SQL migrations for the scoreboard.
- `public/` — static assets (sprites, audio, fonts).
- `docs/SCOREBOARD.md` — scoreboard architecture, API, and one-time D1 setup.
- `CREDITS.md` — asset attribution log.

## Australian English

All copy, comments, and identifiers use Australian spelling (colour, customise,
centre, organise). Do not mix in American spelling.
