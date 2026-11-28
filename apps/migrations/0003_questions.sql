-- The "?" box: a learner's question and the answer written in the admin panel. `reply` is '' until answered.
CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,   -- milliseconds
  day TEXT NOT NULL,             -- YYYY-MM-DD in India's time
  user_id TEXT NOT NULL,
  lang TEXT NOT NULL,
  text TEXT NOT NULL,
  reply TEXT NOT NULL DEFAULT '',
  replied_at INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX questions_user ON questions (user_id, id);
CREATE INDEX questions_open ON questions (replied_at, id);
