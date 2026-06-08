# Sprites — GoorPeach Apocalypse

Place final PNGs here (transparent background) with exact filenames matching `src/config.ts` → `SPRITE_PATHS`.

All assets must be:
- Chunky low-resolution pixel art in late-1990s GTA 1 (1997) / Micro Machines V3 style.
- Hard edges, flat fills, **no anti-aliasing, no gradients, no soft shadows**.
- Target sizes exactly as listed in `docs/ASSETS.md` (e.g. player 64×128, couriers ~48×80, road tiles 64×64).
- Recoloured using the exact palette tokens from `src/config.ts` / `docs/BRIEF.md`:
  - GoorPeach = hazard (#ff7a1c)
  - ChewSnog = bile (#39ff14)
  - GorgeRush = magenta (#ff2e9a)
  - Player car hi-vis accents in magenta/pink where appropriate.
  - Tram = tramBody green (#3a8c54) + cream footpath trim.

## Current status (downloaded & organized)
- Kenney RPG Urban Pack (CC0): ~480+ individual tiles extracted to `kenney/` (roads, urban details, vehicles, markings — excellent base for our road tileset + generic cars).
- OpenGameArt top-down vehicles pack (CC0): Several cars (Audi, Police, Ambulance with animation frames, Viper, Mini truck/van, Taxi, Truck, Car) in `vehicles/`.
- OpenGameArt "Road_test.png": Large combined top-down road tileset image (direct download).
- These are raw public sources. You will still need to:
  - Slice / select the best tiles.
  - Recolour to our exact palette (hazard, bile, magenta, tramBody, etc.).
  - Pixelate / resize to match the sizes in docs/ASSETS.md (e.g. 64x64 roads, 64x128 player, ~48x80 couriers).
  - Create brand variants and animation frames (wobbles, turns, pulses).
  - Add Melbourne-specific details (tram tracks, bike lanes, hazard markings).

The remaining itch.io packs the team wanted (marcusvh 2D Top Down Cars, chasersgaming Road Tiles, styloo scooter) could not be auto-fetched in this environment (itch.io "Name your own price = $0" requires a browser visit to generate the download token). Easy to grab manually:

1. Go to the page, set price to $0 (or "Name your own price" and continue without paying).
2. Click Download — you'll get the zip/PNG.
3. Copy the files here and rename/adapt to match the keys in src/config.ts SPRITE_PATHS.

Links (from docs/ASSETS.md):
- marcusvh 2D Top Down Pixel Art Car Pack: https://marcusvh.itch.io/2d-cars
- chasersgaming Road Tile Set: https://chasersgaming.itch.io/road-tile-set
- styloo Simple scooter: https://styloo.itch.io/scooter (CC0, good color variants for GoorPeach courier)

Once you drop them, I can help organize, or we can expand PreloadScene to load more of them.

Next: adapt a road tileset + 1-2 car bases first so DriveScene can use real graphics.

## Recommended sourcing (see docs/ASSETS.md for full details + links)
Path B (public, ~40-50% of needs as bases):
- Kenney RPG Urban Kit (CC0) — best roads + generic vehicles
- chasersgaming Road Tile Set
- marcusvh 2D Top Down Pixel Art Car Pack
- styloo Simple scooter (CC0)
- OpenGameArt top-down road tiles (CC0)

Adapt: recolour, pixelate down if needed, slice animations (wobble loops, turn frames, pulse, etc.), add game-specific details (food bags on couriers, tram tracks + bike lanes + hazard markings on roads).

Path A (generate bespoke):
- The Nerd, Tiguan, exact W-class tram, Melbourne landmarks (Skipping Girl, MCG, etc.), glowing food bags, Ozempic pen, power-up icons.
- Use the precise prompt template in docs/ASSETS.md.

After dropping files, the PreloadScene (and later scenes) will load them via the keys in config.

Update `CREDITS.md` (root) for every source + licence.
