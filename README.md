# DoorPeach Apocalypse

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

Asset sourcing (public Path B + generated Path A) is documented in `docs/ASSETS.md` (with specific repo links) and `CREDITS.md`. Start with the recommended public packs for roads + vehicle bases to unblock DriveScene.

## Run it

```bash
npm install
npm run dev      # local dev at localhost:5173
npm run build    # type-checks, then outputs /dist
npm run preview  # preview the built dist locally
```

## Current state — first milestone complete

**BootScene + PreloadScene + MenuScene (with working audio unlock) are playable.**

- Loading screen shows a real progress bar driven against the queued asset count (5 items for the menu phase: menuLoop + 2 SFX + 2 placeholder sprite refs).
- Menu has chunky Bungee title, minimal Melbourne skyline silhouette, four large buttons, and a mute toggle.
- **START is the audio unlock gesture** (critical CLAUDE.md gotcha). It resumes the WebAudio context, starts the menu loop, stores the Audio manager on the registry, then transitions to the DriveScene placeholder.
- The DriveScene currently contains only a level header + "next steps" text so the full load → menu → START flow is visibly testable (music continues). Real DriveScene (PlayerCar, scrolling, level data from data/levels.ts, no couriers) is the immediate next piece of work.

The rest of the game (couriers, trams, power-ups, full levels, boss, HUD, touch, Victory, etc.) remains at the original clean stubs. Scoreboard backend + client is already fully wired (see docs/SCOREBOARD.md).

### Next step (per CLAUDE.md working pattern)

1. DriveScene — level 1 (Richmond) only + PlayerCar entity (steering, brake, damage states). No couriers yet.
2. Then OzempicPen, Courier base + first subclass, etc.

Verify in the browser after each increment. `npm run dev` then open localhost:5173 (landscape recommended). Click START on a fresh tab or iOS Safari to test the audio unlock path. Press P on the placeholder drive screen to loop back to the menu.

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
