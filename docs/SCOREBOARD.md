# Scoreboard — global high scores

A single global Top-20 leaderboard, ranked on the final score of a full run, with
classic 3-letter arcade initials. No accounts, no personal data.

This is a deliberate amendment to the original "no backend, no database" rule in
`CLAUDE.md` — see the note there. It is the only server-side piece in the project.

## Architecture

- **Store:** Cloudflare **D1** (SQLite). One table, `scores` (see
  `migrations/0001_create_scores.sql`).
- **API:** a Cloudflare **Pages Function** at `/api/scores`
  (`functions/api/scores.ts`), same-origin with the static site — no second host.
- **Client:** `src/systems/Scoreboard.ts` is the only code that talks to the API.
  It falls back to a localStorage board (via `src/systems/Persistence.ts`) when
  the API is unreachable, so the static site still works offline.
- **Scoring:** `src/systems/Score.ts` tallies a run from the `SCORING` constants
  in `src/config.ts`. The board UI is `src/scenes/ScoreboardScene.ts`.

## API

`GET /api/scores`
→ `{ "top": ScoreEntry[] }` — up to 20 entries, score DESC.

`POST /api/scores` with `{ "initials": "AAA", "score": 1234, "levelReached": 3 }`
→ `201 { "rank": 7, "top": ScoreEntry[] }`

`ScoreEntry = { initials, score, levelReached, createdAt }`.

Validation (server): `initials` must match `/^[A-Z]{3}$/`, `score` an integer in
`0..1_000_000`, `levelReached` an integer in `1..5`. Invalid → `400`.

### Anti-cheat note

There is no cryptographic protection — a determined user can POST a fake score.
That is an accepted trade-off for a casual parody game. If abuse appears, add a
KV-backed rate limit inside `functions/api/scores.ts`; nothing else changes.

## One-time setup (needs your Cloudflare login)

I cannot provision the remote database for you — these run once on your account:

```bash
npx wrangler login
npx wrangler d1 create goorpeach-scores      # copy the printed database_id
# paste that id into wrangler.toml → [[d1_databases]].database_id
npm run db:migrate:remote                     # create the table in production
```

In the Cloudflare Pages dashboard, bind the D1 database to the Pages project as
`DB` (Settings → Functions → D1 bindings) so production matches `wrangler.toml`.

## Local development

Local D1 is a SQLite file under `.wrangler/` (gitignored); no login required:

```bash
npm run db:migrate:local     # create the table locally
npm run dev:full             # build + serve site AND Functions on localhost:8788
```

Both scripts share a local D1 store under `.wrangler/pdev` (gitignored) so the
migration and the dev server always see the same table. Quick check:

```bash
curl localhost:8788/api/scores
curl -X POST localhost:8788/api/scores \
  -H 'content-type: application/json' \
  -d '{"initials":"AAA","score":12345,"levelReached":3}'
```

`npm run dev` (Vite, port 5173) serves only the static SPA — the API is absent,
so the client uses its localStorage fallback. Use `dev:full` to exercise the real
API + D1.
