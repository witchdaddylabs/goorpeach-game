# GoorPeach Apocalypse — Game Brief

*Working title. Single source of truth for what this game is.*

-----

## Premise

You’re driving a beat-up VN Commodore from Richmond to Kew. The streets of inner Melbourne are clogged with food delivery riders — GoorPeach, ChewSnog, GorgeRush — all heading the same way you are. They’re feeding a giant IT nerd squatting in a Kew mansion. Your job: beat them there and Ozempic the nerd into submission before he escapes in his VW Tiguan.

Australian English throughout. Dry, deadpan tone. Reserve exclamation marks for impact moments only.

-----

## Player

**Beat-up VN Commodore.** Damage tells across the three lives:

- Full HP: clean(ish) panels, faded paint
- 2 hearts: cracked windscreen, missing bumper
- 1 heart: smoke trailing from bonnet, one headlight gone

**Controls (desktop):** A/D or ←/→ steer · S or ↓ brake · Space fire · P pause
**Controls (mobile):** drag-anywhere lower-left to steer · hold lower-right to brake · tap upper-right to fire · landscape lock (game prompts rotation if portrait)

-----

## Couriers

|Brand    |Vehicle |Behaviour                      |HP|Colour      |
|---------|--------|-------------------------------|--|------------|
|GoorPeach|Scooter |Fast, weaves erratically       |1 |Peach orange|
|ChewSnog |E-bike  |Tanky, holds lane              |2 |Bile green  |
|GorgeRush|Pushbike|Slow, swarms in clusters of 3–5|1 |Magenta     |

All carry glowing food bags. Bag size scales up by level — visual cue the nerd is getting hungrier.

-----

## Rogue trams (environmental hazard)

Iconic green-and-cream **W-class trams** spawn from cross streets perpendicular to the player. They cross the road in roughly half a second at full speed. Collision = **instant death** regardless of remaining hearts.

**Fairness via telegraphing.** Every tram spawn is announced 1.5 seconds before impact:

- Crossing-light pair flashes red on the road ahead at the cross-street position
- Approaching tram bell sound (`ding-ding`) plays loud and pans from the appropriate side

A player paying attention has time to brake or steer through. A player not paying attention dies. That’s the deal.

**Spawn rules:**

- 1–2 trams per driving level
- Never within the first 5 seconds of a level (no instant-death surprises)
- Never within 2 seconds of another tram (give the player time to recover composure)
- Never in the boss arena (Kew lawn — no tracks)
- Positions are fixed per level, configured in `data/levels.ts`, so learning the route matters

**Game-over line on tram death:** *“You got cleaned up by a W-class on a cross street. Classic Melbourne.”*

-----

## Levels

Four driving levels then a boss arena. Each driving level is 60–90s of scrolling auto-forward play ending at a checkpoint sign.

1. **Richmond** — Bridge Rd / Swan St. Mild traffic. Tutorial wave. Skipping Girl sign easter egg.
1. **Fitzroy** — Brunswick St. Hipster cluster. Tighter streets, more cyclists.
1. **Collingwood / Abbotsford** — Smith St → Johnston St. Industrial. More scooters.
1. **Approaching Kew** — Eastern Fwy → High St. Highway speed, dense traffic.
1. **Kew Boss Arena** — see below.

Level config lives in `src/data/levels.ts`. Adding a level = editing one file.

-----

## Power-ups

|Pickup          |Effect                       |Duration  |
|----------------|-----------------------------|----------|
|Ozempic pen ammo|+3 shots                     |one-shot  |
|Tram-line boost |+50% speed                   |6s        |
|Parma shield    |absorbs 1 hit                |until used|
|Magpie swoop    |clears all couriers in radius|one-shot  |

Spawn at **fixed positions per level** — no RNG. Predictability supports replay and mastery.

-----

## Lives & Damage

3 hearts. One heart per courier collision. Visual damage state updates on the Commodore sprite. Game over → restart from current suburb, not back to Richmond. Stored in localStorage so a refresh doesn’t lose progress.

-----

## The Boss — “The Nerd”

Giant heavy IT nerd, sat on a Kew lawn. Wears a Patagonia vest over a stained band tee. His VW Tiguan is parked behind him, dormant.

### Phase 1 — Feeding frenzy

Couriers pour into the arena from four edges, lining up to feed him. You circle the arena, shooting Ozempic pens. Each pen lands → nerd’s feed meter drops. Each courier reaches him and delivers → feed meter rises.

You can also ram couriers off course before they reach him (costs no ammo but risks collision damage).

### Phase 2 — The Tiguan escape

If the feed meter hits 100%, the nerd bolts for the Tiguan, gets in, and tries to drive off the screen. You have **15 seconds** to disable the Tiguan with Ozempic pens. The Tiguan moves fast and turns sharply. Couriers continue to harass.

- Tiguan disabled in time → switches back to Phase 1 with feed meter reset to 50% as second-wind difficulty.
- Tiguan escapes → game over: *“He’s gone to a Grill’d in Chadstone. You can’t follow.”*

### Win condition

Feed meter empties in Phase 1. Nerd flops backward. Pan up to the Boroondara skyline. Victory card.

-----

## Menus & Screens

- **Title screen** — city skyline silhouette, big chunky logo, Start / Level Select / Settings / Credits.
- **Level Select** — unlocks as you progress. Padlocks on locked levels.
- **Pause overlay** — translucent, four buttons: Resume / Restart Level / Quit to Menu / Mute toggle.
- **Settings** — sound volume, music volume, touch steer sensitivity, touch input mode (joystick vs swipe).
- **Game Over** — death-cause text + Restart / Quit. Three writing variants per level.
- **Victory** — confetti + skyline + “Kew is safe. For now.” + Restart / Menu.

-----

## Sound

- Menu loop — synth-y, slightly menacing
- Driving loop — faster, percussive (two variants, reused across the four suburbs)
- Boss loop — heavy and stupid
- SFX — Ozempic shoot, courier crash (comedic), engine rev, Tiguan engine start (Phase 2), heart lost, power-up pickup, victory sting, defeat sting

All sourced royalty-free from Pixabay / freesound. Full list in `ASSETS.md`.

-----

## Art direction

**Late-1990s top-down driving game.** Direct visual reference: **Grand Theft Auto 1 (1997)** — same camera angle, same chunky vehicle silhouettes, same colour temperature. Micro Machines V3 (1997) and Streets of SimCity (1998) are the supporting references.

**Rendering rules:**

- Phaser config: `pixelArt: true`, `roundPixels: true`, `antialias: false`
- Internal render resolution 480×270 scaled up — gives chunky-pixel “low colour depth” feel
- Subtle CRT scanline overlay at 20% opacity (toggleable in settings, default on)
- No drop shadows. No soft gradients. Hard edges, flat fills.

**Strong Melbourne signposting** in the background tiles: tram lines, painted bike lanes, hi-vis hazard markings. Easter eggs: Skipping Girl sign (Abbotsford), Vic Market awning, MCG silhouette, Brunswick St cafe row, Eastern Fwy overpass, Kew Victorian mansion.

**Locked palette — late-90s Melbourne:**

|Token        |Hex      |Use                                            |
|-------------|---------|-----------------------------------------------|
|`--road`     |`#3a3a42`|Asphalt — warmer than black, slightly bluish   |
|`--footpath` |`#e8d8b0`|Cream — Memphis-era, footpaths and tram trim   |
|`--magenta`  |`#ff2e9a`|Hot pink — UI accent, GorgeRush brand          |
|`--cyan`     |`#00d4d4`|90s teal — UI highlights, power-up glows       |
|`--caution`  |`#ffd900`|Sign yellow — HUD warnings, tram caution lights|
|`--hazard`   |`#ff7a1c`|Neon orange — GoorPeach brand, hazard markings |
|`--bile`     |`#39ff14`|Highlighter green — ChewSnog brand             |
|`--tram-body`|`#3a8c54`|W-class tram body green                        |
|`--text`     |`#f4f0e0`|Bone — UI text on dark backgrounds             |
|`--text-dark`|`#1a1a22`|Charcoal — UI text on cream backgrounds        |

**Courier brand colours** (already in the palette above):

- GoorPeach = hazard orange `#ff7a1c`
- ChewSnog = bile green `#39ff14`
- GorgeRush = magenta `#ff2e9a`

**Typography:** still Bungee (titles) and JetBrains Mono (HUD numerics), but render them at small sizes so the pixelation reads as 90s, not 2020s.

-----

## Copy / Voice

Australian English. Dry, deadpan. No corporate cheer.

**Game-over lines (per level):**

- Richmond: “You got smashed by a cyclist on Brunswick St. Embarrassing.”
- Fitzroy: “An e-bike clipped you outside a vegan bakery. Tragic.”
- Collingwood: “GorgeRush swarm. They didn’t even stop.”
- Kew approach: “Eastern Fwy at peak hour. Predictable, really.”
- Tram death (any level): “You got cleaned up by a W-class on a cross street. Classic Melbourne.”
- Boss escape: “He’s gone to a Grill’d in Chadstone. You can’t follow.”

**Victory:** “Kew is safe. For now.”

-----

## Out of scope (do not build)

- Multiplayer
- Online leaderboards
- User accounts / login
- In-app purchases
- Cutscenes beyond static victory/defeat cards
- Anything outside the five levels above
- Real brand names (Uber Eats, Menulog, DoorDash) — parody only