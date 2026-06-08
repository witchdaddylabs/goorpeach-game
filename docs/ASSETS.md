# Assets — GoorPeach Apocalypse

*Complete list of art and sound. Two production paths per asset: generate or source.*

-----

## Sprite list

All top-down view. Transparent PNG. Sliced as sprite sheets where animation needed.

|Asset                                  |Frames                |Size (px)|Notes                                                               |
|---------------------------------------|----------------------|---------|--------------------------------------------------------------------|
|Player Commodore — clean               |1                     |64×128   |Faded paint, hi-vis pink hazard accents                             |
|Player Commodore — damaged (2 HP)      |1                     |64×128   |Cracked windscreen, missing bumper                                  |
|Player Commodore — wrecked (1 HP)      |1                     |64×128   |Smoke trail, one headlight gone                                     |
|Player Commodore — turning left        |5-frame anim          |64×128   |Subtle body roll                                                    |
|Player Commodore — turning right       |5-frame anim          |64×128   |Mirror of left                                                      |
|GoorPeach scooter + rider              |4-frame wobble loop   |48×80    |Peach orange                                                        |
|ChewSnog e-bike + rider                |4-frame wobble loop   |48×80    |Bile green                                                          |
|GorgeRush pushbike + rider             |6-frame pedal loop    |40×72    |Magenta                                                             |
|Food bag (glowing) — small             |8-frame pulse         |24×24    |Yellow halo                                                         |
|Food bag (glowing) — medium            |8-frame pulse         |32×32    |Yellow halo, brighter                                               |
|Food bag (glowing) — large             |8-frame pulse         |40×40    |Yellow halo, brightest                                              |
|Ozempic pen projectile                 |1                     |16×32    |White / blue, faint glint                                           |
|Power-up: ammo (Ozempic pen)           |8-frame float         |32×32    |Pen icon                                                            |
|Power-up: tram-line boost              |8-frame float         |32×32    |Tram-track stripe                                                   |
|Power-up: parma shield                 |8-frame float         |32×32    |Parma slice icon                                                    |
|Power-up: magpie swoop                 |8-frame float         |32×32    |Black + white wing                                                  |
|The Nerd — idle                        |4-frame breath        |256×256  |Patagonia vest over band tee                                        |
|The Nerd — receiving feed              |4-frame chomp         |256×256  |Inflates each frame                                                 |
|The Nerd — bolting to Tiguan           |6-frame run           |256×256  |Comically fast for his size                                         |
|The Nerd — hit by Ozempic              |4-frame wince         |256×256  |Deflates slightly                                                   |
|VW Tiguan — parked                     |1                     |192×128  |Black, smug grille                                                  |
|VW Tiguan — driving                    |8-frame wheel-spin    |192×128  |Diesel smoke from exhaust                                           |
|W-class tram — body                    |4-frame side-roll loop|320×96   |Green + cream, classic Melbourne livery                             |
|W-class tram — warning lights          |6-frame flash         |64×64    |Red crossing lights, pre-tram telegraph                             |
|Road tile set                          |64×64 tiles           |—        |Asphalt, painted bike lane, tram tracks, white line, hazard markings|
|Suburb landmark — Skipping Girl sign   |1                     |128×192  |Abbotsford easter egg                                               |
|Suburb landmark — Vic Market awning    |1                     |256×96   |Carlton skyline element                                             |
|Suburb landmark — MCG silhouette       |1                     |384×96   |Horizon element                                                     |
|Suburb landmark — Eastern Fwy overpass |1                     |320×128  |Level 4 transition                                                  |
|Suburb landmark — Kew Victorian mansion|1                     |384×256  |Boss arena backdrop                                                 |

-----

## How to produce sprites

Two paths. Mix freely. **All assets at chunky, low-resolution scale** to match the late-90s GTA 1 / Micro Machines reference. Don’t generate at 4K and downscale — generate close to target resolution, or apply heavy pixelation pass after.

### Path A — Generate

**Midjourney / Sora / DALL-E prompt template:**

> top-down 2D game sprite of [SUBJECT], **1997 Grand Theft Auto 1 art style**, chunky low-resolution pixels, flat colour fills, hard edges, no anti-aliasing, no gradient, transparent background, no shadow, [COLOUR] accent, single isolated asset, no text, no logos

Then run through remove.bg (or use the model’s transparent-bg output), pixelate down to target resolution in your editor, and drop into `/public/sprites/`. The pixelation pass is the look — don’t skip it.

**Best for:** the Nerd, the Tiguan, the W-class tram, Commodore damage states, suburb landmarks, food bags. Bespoke stuff that has to match the brief precisely.

### Path B — Source

**itch.io** has thousands of free top-down sprite packs. Search terms that work for the 90s aesthetic:

- “top down car pixel 90s”
- “GTA 1 style sprite”
- “16-bit top down car”
- “road tile pixel” → for the road tile set
- “Melbourne tram pixel” (long shot, but try)

Filter by “Free” and check the licence per pack. CC0 / public domain is cleanest. Many packs ask for credit only.

**Best for:** road tiles, generic background props, courier base vehicles before brand-painting them.

**Hybrid recommendation:** source the road tiles and generic vehicle silhouettes from itch.io / OpenGameArt / Kenney. Generate the bespoke assets (Nerd, Tiguan, W-class tram, Commodore damage/turning states, landmarks, glowing food bags, Ozempic pen, power-up icons). Saves about 60% of the asset-production time.

### Recommended Public Sources (Path B) — documented repos with free commercial use

These packs/repos are known, well-documented, and allow free (mostly CC0) use in commercial games. They can cover ~40-50% of the list above as bases that you recolour, pixelate to chunky low-res GTA1 style, slice into the exact frame counts/sizes in the sprite table, and brand-paint (GoorPeach hazard orange, ChewSnog bile green, GorgeRush magenta). Always check the exact licence on the page before use and add the source to `CREDITS.md`.

Prioritise in the same order as the production list (so DriveScene can get real assets soon).

**Top priority for early code (roads + base vehicles):**

- **Kenney RPG Urban Kit** (best starting point overall)
  - Link: https://kenney-assets.itch.io/rpg-urban-kit (or full collection at https://kenney.nl/assets)
  - License: **CC0 1.0 Universal** (free commercial, no attribution required)
  - Covers: Road tiles + markings, urban details (crosswalks, bike lanes, hazard paint), base vehicles/cars that can be adapted + recoloured for player Commodore and courier bases.
  - Notes: 480+ sprites, tilesheets + separate. Small zip. Extract road/vehicle layers and heavily edit to match our 64x64 tiles / 64x128 player / courier sizes and exact late-90s chunky pixel look. Add tram tracks and painted bike lanes manually.

- **chasersgaming Road Tile Set**
  - Link: https://chasersgaming.itch.io/road-tile-set
  - License: Free for commercial & non-commercial (CC0-style; credit appreciated but not required)
  - Covers: Top-down road tiles including double yellow lines, traffic lights, street lights.
  - Notes: Small direct PNG. Excellent base for our "asphalt + painted bike lanes + tram tracks + hi-vis hazard markings" requirement.

- **marcusvh 2D Top Down Pixel Art Car Pack**
  - Link: https://marcusvh.itch.io/2d-cars
  - License: Free for any project (commercial/non-commercial); author kindly requests credit (confirmed usable in comments).
  - Covers: 4 cars (compact, coupe, sedan, sports) + semi truck + trailer, each in 4 colours. Direct spritesheet.
  - Notes: Great generic bases. Use sedan/sports for VN Commodore (then paint faded + add hi-vis pink accents + create damage states). Recolour and reshape the others into scooter (GoorPeach), e-bike (ChewSnog), pushbike (GorgeRush) silhouettes. Add 4/5/6-frame wobble loops.

- **styloo Simple scooter Asset** (bonus for courier)
  - Link: https://styloo.itch.io/scooter
  - License: **CC0 1.0 Universal**
  - Covers: Simple scooter with many colour variants (good reference or base for GoorPeach scooter).
  - Notes: 3D low-poly with maps; render top-down orthographic views or use as strong reference for 2D pixel version + recolour to hazard orange.

**Other useful public sources:**
- OpenGameArt "top down Road Tileset" (CC0): https://opengameart.org/content/top-down-road-tileset — simple royalty-free road tiles you can extend.
- Search itch.io for "top down pixel car" / "16-bit top down car" / "retro vehicle pixel" filtered Free + CC0 or "free for commercial". GrafxKid and similar retro packs often appear in CC0 collections.
- General Kenney vehicle/road/urban packs (all CC0) — highly recommended for consistency.

**For audio (Path B — follow the exact descriptions in the Sound list above):**
- **Pixabay** (primary recommendation): https://pixabay.com/sound-effects/
  - All tracks CC0 (free commercial, **no attribution required**).
  - Search terms that match the brief: "synth menacing loop", "driving game loop", "boss battle synth", "car engine v6", "laser short", "comedic crash", "diesel engine start", "tram bell", "metal crash heavy", "low thud", "pickup chime", "victory fanfare", "defeat sad trombone".
  - Download, trim/loop in a free editor (Audacity), export as mp3 (and ogg for broader support) to match `AUDIO_PATHS`.
- **freesound.org**: Many matching tracks (search the descriptions). **Check licence per file** (most CC0, some CC-BY — if CC-BY you must credit the author + track in `CREDITS.md`).

**Unique / bespoke assets (Path A — generate or custom create)**
These have strong Melbourne / game-specific identity and are hard or impossible to source publicly without heavy modification that defeats the purpose:
- The Nerd (all 4 states: idle, feed, bolt, hit)
- VW Tiguan (parked + driving with diesel smoke)
- W-class tram (exact green+cream livery + 4-frame side-roll)
- Tram warning lights (specific crossing flash)
- Suburb landmarks (Skipping Girl sign, Vic Market awning, MCG silhouette, Eastern Fwy overpass, Kew Victorian mansion)
- Glowing food bags (small/medium/large with yellow halo + pulse)
- Ozempic pen projectile (white/blue with faint glint — very branded)
- Power-up icons (pen, tram-track stripe, parma slice, magpie wing — must read clearly at 32x32)

Use the exact Midjourney/Sora/DALL-E prompt template in the "Path A — Generate" section above, then remove.bg (or transparent output), heavy pixelation pass in your editor to target resolution, and drop into `/public/sprites/`.

### Visual references to share with collaborators

- **Grand Theft Auto 1 (1997)** — primary reference. Top-down Glasgow driving, exact camera angle.
- **Micro Machines V3 (1997)** — chunky vehicle silhouettes, exaggerated cartoon physics
- **Streets of SimCity (1998)** — Maxis-era city tops
- **Crazy Taxi (1999)** — colour saturation and energy
- **Saved by the Bell title sequence** — Memphis-era pink/cyan/yellow accent palette
- **VHS / VCR-era graphics** — scanlines, slight signal noise on overlays

-----

## Sound list

|Asset              |Source                         |Duration       |Notes                                   |
|-------------------|-------------------------------|---------------|----------------------------------------|
|Menu loop          |Pixabay “synth menacing loop”  |60–90s loopable|Slightly off-kilter, never resolves     |
|Driving loop A     |Pixabay “driving game loop”    |60s            |Reused: Richmond + Fitzroy              |
|Driving loop B     |Pixabay “driving game loop”    |60s            |Reused: Collingwood + Kew approach      |
|Boss loop          |Pixabay “boss battle synth”    |90s loop       |Heavier, stupider, more bass            |
|Ozempic pen fire   |freesound “laser short”        |<0.5s          |Soft, not aggressive                    |
|Courier crash      |freesound “comedic crash”      |<1s            |Cartoony, not painful                   |
|Engine rev         |freesound “car engine v6”      |<2s            |Plays on level start                    |
|Tiguan diesel start|freesound “diesel engine start”|<2s            |Plays on boss Phase 2 entry             |
|Tram approach bell |freesound “tram bell ding ding”|1.5s           |Telegraph warning, pans from impact side|
|Tram impact        |freesound “metal crash heavy”  |1s             |Plays once on instant-death collision   |
|Heart lost         |freesound “low thud”           |<0.5s          |Muted, regretful                        |
|Power-up pickup    |freesound “pickup chime”       |<0.5s          |Cheerful but brief                      |
|Victory sting      |freesound “victory fanfare”    |2–3s           |Synth, not orchestral                   |
|Game over sting    |freesound “defeat sad trombone”|2–3s           |Lean into the joke                      |

All Pixabay and freesound CC0 audio is free for commercial use, no attribution required. List sources in a `CREDITS.md` anyway — good practice.

-----

## Fonts

Two Google Fonts. Load via `<link>` in `index.html`.

- **Bungee** — for titles, HUD numbers, level cards. Chunky and sign-like. Matches the Melbourne signage vibe.
- **JetBrains Mono** — for any tabular HUD elements (lives counter, ammo count, level timer).

-----

## Asset production order (parallel to code)

Don’t wait for art to start coding. Use coloured rectangles as placeholders while we build mechanics. Drop in real sprites in the polish pass.

**Sourcing tip:** Start with the public Path B packs below for roads + generic vehicle bases (Kenney Urban + marcusvh cars + chasers road tiles + styloo scooter). These unblock DriveScene + first courier waves quickly. Generate the rest (Path A) in parallel.

Suggested order:

1. Player Commodore (clean) — needed for DriveScene (hardest unique — generate or heavily adapt a sedan base)
1. Three courier base sprites — needed for first wave testing (source generic + brand recolour)
1. Ozempic pen projectile — needed for firing mechanic
1. Power-up sprites (all four)
1. Road tile set — replaces flat-colour scrolling background (strong public source candidate)
1. Food bags
1. HUD icons (heart, ammo, level timer)
1. Damage state Commodore variants
1. Suburb landmarks (easter eggs)
1. The Nerd + Tiguan + boss arena backdrop

Sound can wait until mechanics are locked. Bad timing on placeholder sound is worse than no sound.

-----

## Licensing notes

- **Pixabay audio:** CC0, free for commercial, no attribution required
- **freesound:** check per-file licence (most are CC0, some are CC-BY which needs attribution)
- **itch.io packs:** check per-pack — usually CC0 or “free for commercial with credit”
- **Generated assets** (Midjourney / Sora / DALL-E): check the platform’s commercial terms per your subscription tier. Most paid tiers allow commercial use.
- **Google Fonts:** all Open Font Licence, free for commercial use, no attribution required

Maintain a `CREDITS.md` in the repo root listing every source even when not required. It’s good hygiene and makes any future audit trivial.