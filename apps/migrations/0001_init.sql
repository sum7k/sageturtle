-- One row per phone that chose a language. No name and no phone number: only what the app needs to count and to group people.
-- `pin` and `variants` are empty until the person registers.
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,   -- milliseconds
  created_day TEXT NOT NULL,     -- YYYY-MM-DD in India's time
  last_day TEXT NOT NULL,        -- the last day this person tapped anything
  lang TEXT NOT NULL,
  pin TEXT NOT NULL,             -- six digit PIN code of their place, or ''
  variants TEXT NOT NULL         -- JSON list, such as ["farm","shop"], or []
);
CREATE INDEX users_created_day ON users (created_day);
CREATE INDEX users_last_day ON users (last_day);

-- Taps, one row per person, button and day. `button` is "book", "icon:<picture>" for a tap on a greyed picture,
-- or "seen:<picture>" when the picture was shown on Home that day. Counting rows gives distinct users; adding `count` gives taps.
CREATE TABLE taps (
  day TEXT NOT NULL,
  button TEXT NOT NULL,
  user_id TEXT NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (day, button, user_id)
) WITHOUT ROWID;
CREATE INDEX taps_button ON taps (button, user_id);

-- Answers to "What functionality would you want next?". No longer written since 2026-11-28: the question was removed.
CREATE TABLE wishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  lang TEXT NOT NULL,
  text TEXT NOT NULL
);
