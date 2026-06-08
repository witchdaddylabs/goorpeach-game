# Audio — GoorPeach Apocalypse

Place final audio files here with exact basenames matching `src/config.ts` → `AUDIO_PATHS` (we load as .mp3; provide .ogg fallbacks if desired for broader browser support).

## Requirements
- Menu loop: synth-y, slightly menacing, 60–90s loopable, never resolves.
- Driving loops (A reused for Richmond/Fitzroy, B for Collingwood/Kew approach): faster, percussive.
- Boss loop: heavy and stupid, more bass.
- SFX: short, comedic/cartoon (courier crash), soft laser for Ozempic, engine rev on level start, diesel start for Tiguan Phase 2, tram bell (ding-ding, pans from side), metal crash for tram death, low thud for heart lost, cheerful brief chime for power-up, synth victory sting, sad-trombone-style game over sting.

## Sourcing (see docs/ASSETS.md)
**Primary: Pixabay** (https://pixabay.com/sound-effects/) — all CC0, free commercial, **no attribution required**.
Search the exact phrases from the Sound list in docs/ASSETS.md.

**Secondary: freesound.org** — check licence per file (add to CREDITS.md if CC-BY attribution is needed).

After download:
- Trim / loop cleanly in Audacity (or similar).
- Export as mp3 (and optionally ogg).
- Name exactly to match AUDIO_PATHS keys.
- Update `CREDITS.md` (root) with source + licence.

Sound can wait until core mechanics (DriveScene + first entities) are locked. Bad placeholder timing hurts more than no sound.

Current status: A couple of demo engine files attempted (direct CDN fetches from Pixabay searches are often session/JS dependent). Real files should be manually downloaded from Pixabay (search the exact descriptions in docs/ASSETS.md) and placed here with matching basenames from config.ts AUDIO_PATHS.

Pixabay is the easiest (all CC0, direct downloads after finding the track).
