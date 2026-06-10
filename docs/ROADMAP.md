# DoorPeach Apocalypse — "High End" Roadmap

*A backlog of ideas to lift the game from a polished weekend gag toward something
that feels genuinely premium. Nothing here is committed work — it's a menu of
options, ordered by how much each moves the "is this high end?" needle.*

*Constraints still apply (see `CLAUDE.md`): pure static web app, Phaser 3 + Vite,
no backend beyond the single `/api/scores` Function, no frameworks, no analytics.
Everything below fits within that.*

Last updated: 2026-06-10. Status of the base game: campaign, boss, scoreboard,
mobile touch, CRT post-FX, perf pass and installable PWA all shipped and live at
https://doorpeach-apocolypse.pages.dev.

---

## The two biggest "tells"

The things a discerning eye clocks first on any web game. Highest leverage.

### 1. Original audio  *(biggest single lever)*
- Soundtrack/SFX are currently placeholder freesound clips, and several sounds
  are reused (the same crash plays for hit / pickup / fire — see `AUDIO_PATHS`
  in `config.ts`).
- Bespoke late-90s synthwave / chiptune **track per suburb** (Richmond grungy →
  Kew sinister), distinct punchy one-shots, and **dynamic music** that intensifies
  near a tram telegraph or the boss.
- The system work (per-level track switching, a clean SFX map, ducking) can be
  scaffolded now so better files drop straight in later.

### 2. Cohesive bespoke art
- Sprites are individually fine but not a *unified* set — they want one palette,
  one lighting angle, one outline weight across every car, courier, tram and
  landmark.
- A signature **animated title logo**, real-feeling Melbourne landmarks, and
  Commodore damage states that actually look battered.
- Makes it feel art-directed rather than assembled.

---

## Game feel — the "juice" layer  *(all code, no assets — buildable now)*

- **Hit-stop**: 2–3 frame freeze on a courier kill / tram death. Tiny, huge.
- **Scene transitions**: fades / wipes instead of the current hard cuts.
- **Score pop-ups**: floating "+250" off a flattened courier; a combo counter;
  a multiplier for chaining kills without braking.
- **Near-miss rewards**: bonus + whoosh for threading a tram by a pixel — turns
  the brutal trams into a thrill rather than just punishment.
- **Attract mode**: the menu plays a looping self-driving demo behind the title,
  like a real arcade cabinet.

---

## Depth that earns the leaderboard

The global Top-20 exists, but a run is currently "survive." Give score-chasing
meaning:

- **Combos / multipliers** and a style system (weaving, near-misses) so skilled
  players score wildly higher.
- **Daily challenge**: a deterministic seed-of-the-day everyone competes on —
  fully client-side, no backend needed.
- **Unlockables**: alternate cars / skins for score milestones. Cheap, sticky.

---

## Delight & shareability  *(perfect for a thing shared between mates)*

- **Shareable score card**: on game-over, render a branded PNG ("I drove to Kew
  with 18,750 — beat that") via canvas to download / share.
- **Social preview**: Open Graph / Twitter meta + that card as the link preview,
  so the URL looks designed when pasted into a group chat.
- **Lean into the writing**: between-level vignettes, dry radio chatter, more of
  The Nerd's personality. Voice is free and makes it memorable.

---

## The long tail

- Colourblind-friendly palettes; remappable keys.
- A proper marketing landing page.
- More suburbs / bosses.

---

## Recommended first three (best ratio of "feels high-end" to effort)

1. **Original audio** — needs assets (generate/source + wire), or scaffold the
   system now.
2. **The juice layer** — hit-stop + transitions + score pop-ups. Pure code,
   buildable immediately.
3. **Shareable score cards + social preview** — pure code; ideal for spreading a
   game between friends.
