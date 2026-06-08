-- Global high-score table for GoorPeach Apocalypse.
-- Single board: ranked on score DESC. No accounts — 3-letter arcade initials.
CREATE TABLE IF NOT EXISTS scores (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  initials      TEXT    NOT NULL,                 -- exactly 3 uppercase letters
  score         INTEGER NOT NULL,                 -- non-negative
  level_reached INTEGER NOT NULL,                 -- 1..5
  created_at    INTEGER NOT NULL                  -- epoch milliseconds
);

-- The board query is ORDER BY score DESC, created_at ASC LIMIT N.
CREATE INDEX IF NOT EXISTS idx_scores_rank ON scores (score DESC, created_at ASC);
