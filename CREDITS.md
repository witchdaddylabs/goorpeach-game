# Credits

Asset attribution log. List every source so the project stays audit-clean
(docs/ASSETS.md). Add entries as assets land. 

**Public Path B sources (free commercial use) we are connecting to / using as bases:**
See docs/ASSETS.md "Recommended Public Sources (Path B)" for direct links, exact licences, and adaptation notes (recolour to our palette, pixelate to chunky low-res, match frame counts/sizes from the sprite table, brand the couriers, add tram tracks/bike lanes/hazards to roads, etc.).

## Sprites (bases sourced or recommended)

Downloaded / extracted into public/sprites/ (raw public sources — require adaptation: recolour to palette, pixelate, resize to exact dimensions in ASSETS.md sprite table, create brand variants + animation frames):

- Kenney RPG Urban Pack (CC0) — https://kenney-assets.itch.io/rpg-urban-kit (and direct https://www.kenney.nl/...). Hundreds of individual tiles now in `kenney/` (roads, markings, vehicles, urban details). Primary base for our road tileset + generic car silhouettes.
- Top-down vehicles sprites pack (CC0) — OpenGameArt (Unlucky Studio), https://opengameart.org/content/free-top-down-car-sprites-by-unlucky-studio. Cars including Audi, Police, Ambulance (with frames), Viper, trucks etc. in `vehicles/`.
- Large combined road tileset image (CC0) — OpenGameArt "top down Road Tileset", https://opengameart.org/content/top-down-road-tileset. `road_test.png` (big image to slice from).

Still recommended (itch.io "Name your own price = $0" — quick browser download):
- 2D Top Down Pixel Art Car Pack — marcusvh, https://marcusvh.itch.io/2d-cars (multiple colored cars + truck/trailer).
- Road Tile Set — chasersgaming, https://chasersgaming.itch.io/road-tile-set (direct roads + lights).
- Simple scooter Asset (CC0) — styloo, https://styloo.itch.io/scooter (color variants for courier base).

(The above three require one browser visit each to download the zip/PNG after setting price to 0.)

Real files dumped into public/sprites/ (organized under 2D TOP DOWN PIXEL CARS/, kenney/, vehicles/, plus sprite25_0.png):

- 2D Top Down Pixel Cars pack (marcusvh) — multiple colored sedans, compacts, coupes, sports cars, trucks. Used for playerClean + courier bases.
- Kenney tiles (CC0) — 486 individual tiles in kenney/ (roads, urban, vehicles).
- Road assets: sprite25_0.png (chasersgaming). The scrolling road is drawn
  procedurally from palette tokens, so the large OpenGameArt "Road_test.png"
  placeholder was removed to keep the build light.
- vehicles/ folder (additional top-down cars from OpenGameArt pack).

Full adaptation (recolour to exact GoorPeach/ChewSnog/GorgeRush palette, correct sizes, animations, tram tracks, brand details) still needed per docs/ASSETS.md.

## Audio

Real files the user dumped (now in public/audio/):

- zec53-sci-fi-and-menacing-synth-drums-loop-371304.mp3 → menuLoop
- freesound_community-video-game-music-loop-27629.mp3 → driving loops
- freesounds123-car-engine-335601.mp3 → engineRev / various
- freesound_community-tram-bell-29757.mp3 → tramBell
- freesound_community-large-crash-with-cataiff-14490.mp3 → crash / impact SFX

Source: freesound.org (verify per-file licence; many are CC0).

Pixabay is still recommended for additional loops (all CC0, direct downloads).

## Fonts

- **Bungee** — Google Fonts, Open Font Licence.
- **JetBrains Mono** — Google Fonts, Open Font Licence.

## Generated assets (Path A — unique Melbourne / game-specific)

Generated with Grok Imagine (2026-06-09), pixelated to target resolution, integrated under `public/sprites/generated/`.

- Player Commodore — clean, worn (2 HP), wrecked (1 HP) — `player-clean.png`, `player-worn.png`, `player-wrecked.png`
- The Nerd boss sprite — `boss-nerd.png`
- VW Tiguan boss escape vehicle — `boss-tiguan.png`
- W-class tram body — `tram-body.png`
- Tram crossing warning lights — `tram-warning-lights.png`
- Ozempic pen projectile — `ozempic-pen.png`
- Power-up icons — ammo, tram boost, parma shield, magpie — `powerup-*.png`
- Suburb landmarks — Skipping Girl, Vic Market, MCG, Kew mansion — `landmark-*.png`
- GoorPeach scooter courier base — `courier-scooter.png`

Still procedural / not yet generated: e-bike and pushbike courier sprites, food bag pulse animations, player turn animations, Nerd animation states (idle/feed/bolt/hit), Tiguan driving frames.
