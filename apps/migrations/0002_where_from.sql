-- Where people come from, and how many reach the first page.
ALTER TABLE users ADD COLUMN state TEXT NOT NULL DEFAULT '';  -- Indian state code such as UP, or a country code outside India; from Cloudflare, never asked
ALTER TABLE users ADD COLUMN ref TEXT NOT NULL DEFAULT '';    -- the site or app that sent the person, such as whatsapp or youtube.com; '' when unknown

-- Things counted without knowing who: a browser opening the first page ("visit"), an install ("install").
CREATE TABLE counts (
  day TEXT NOT NULL,
  name TEXT NOT NULL,
  n INTEGER NOT NULL,
  PRIMARY KEY (day, name)
) WITHOUT ROWID;
