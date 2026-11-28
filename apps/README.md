# BodhiLabs apps

One installable web app (bodhilabs.org) for learning: twelve subjects, opened one by one.
Until 2026-11-28 the product was called SageTurtle.

## What is live in this build

- **No login at the start.** A person who cannot read yet must be able to get in.
- **The first screen is the language**, chosen without reading (`app/start/page.jsx`, `components/Region.jsx`): twelve
  picture tiles, one per language. A tap makes the tile say hello in that language; a second tap, or the gold tick,
  chooses it. One tile is picked in advance from the phone's language, or from the state the person is in
  (`firstGuess` in `lib/langs.js`). The drawings are placeholders, with no religious symbols.
- **Every level is a 4 by 4 grid** (`components/Grid.jsx`, `lib/grid.js`). The twelve outer boxes are the level's
  twelve houses, house 1 top left and then round with the clock. On Home (`app/home`, `lib/top.js`) house 1 is Gyan,
  house 2 is Vartaman (not built, only counted) and ten are empty. Inside Gyan (`app/gyan`) they are the eleven subjects
  and Lives (`lib/subjects.js`), turned by the rising sign (`lib/lagna.js`), whose subject is in house 1. Inside
  Word (`app/word`, `lib/word.js`) they are Word's own twelve houses in order; only Letters is open, and it is the
  word game. A press on a closed box is only counted. The language button is in the top corner of Home.
- **The four boxes in the middle are the same on every level**: Learned (`app/past`), Now (`app/now`, what goes well
  and what needs practice), Next (`app/next`) and Ask (`app/ask`). The first three read what the phone remembers of
  the word game (`lib/learn.js`, kept on the phone). Ask sends a typed question (`/api/ask`, table `questions`, five
  a day); it shows in the admin panel under Questions, and the answer written there shows in the app under the question.
- **Lives (जीवनी) opens one great life** (`lib/lives.js`, `app/life/page.jsx`): a short biography about how the person
  learned and grew, never the same one twice in a row, to read or to hear in a Sarvam voice (`/api/voice?life=<id>`).
  Three placeholder lives, in English and Hindi; the set of 121 is being written. Shown and heard are counted.
- **Lessons** (`lib/lessons.js`, `components/Lesson.jsx`, `components/LessonArt.jsx`): for stages 1 and 2, where
  nothing is read. A lesson is not a video file: it is a list of scenes, each a small SVG drawing that the phone moves
  itself (CSS, no animation library) and one spoken line (a Sarvam recording made once, `/api/voice?line=fire.2`). One
  drawing serves every language. Nature (`app/nature`) is open inside Gyan with the first three: fire, the five senses
  and animals, in Hindi and English; other languages hear English until their lines are written.
- **Gyan** (the reading app; `book` in the code, `lib/book.js`). Everything spoken is heard twice, in a man's and a
  woman's voice (`lib/speak.js`): a Sarvam recording made once and kept in Cloudflare KV (`worker/voice.js`), or the
  phone's own voice when there is none. The Sarvam key is the Worker secret `SARVAM_API_KEY`.
- **Book** (`lib/book.js`): a picture, a gold button that says the word, and three written words to choose from. A wrong
  word shakes and says itself; the right one turns green and the next picture comes. Twelve words per language. The
  letters are on a second page.
- **Words in twelve languages** (`lib/strings.js`): Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Punjabi,
  Kannada, Odia, Malayalam. The app does not speak, except the hello on a language tile and the words in Book, which
  use the phone's own voice.
- **Used only as the installed app.** Any app page opened in a browser tab is sent to the install page `/`
  (`components/Offline.jsx`, `mustInstall` in `lib/browser.js`); localhost is left alone. When Chrome gives no install
  prompt, the install page shows the way in pictures: the menu, then Install app. On iPhone: Share, then Add to Home Screen.
- **It installs as an app** (manifest, icons and `public/sw.js`). Nothing is cached until the first version is
  released (`public/sw.js`, `public/_headers`), so a release shows at once and the app needs network to open.
  The installed app starts at `/app`. A page cannot start an installed app, so after install the landing page turns
  into one big "Open the app" button (an Android intent link, `openAppUrl` in `lib/browser.js`).
- **Counting.** Choosing a language gives the phone an id on the server. Taps are counted against it. The server is
  told only the language (and the PIN code and work once a person registers), never a name or a number.
- **Admin panel** at `/admin`: users, how many opened Book, each picture with shown, tapped and share, and users by
  language and work.

Built but not linked from Home yet (later releases): Horoscope, Khabri, Me and registration (lock, PIN code, work,
alerts; `/start?step=register`).

Rules kept for later apps: app names are one word and a noun; a person can hold up to three kinds of work
(`lib/variants.js`).

## How it runs on Cloudflare

The pages are static files (`next build` writes `out/`). Cloudflare serves them without running any code. One Worker
(`worker/`) answers only `/api/*` and `/admin`, and keeps its data in one D1 database (`migrations/`):

| Table | One row per | Used for |
| :--- | :--- | :--- |
| `users` | phone that chose a language | users, new and active users; language; place and work once registered |
| `taps` | person, thing and day | taps (sum of `count`) and distinct users (count of people). The thing is `gyan`, `vartaman`, `top:<house>`, `word`, `book` (the word game), `subject:<id>`, `word:<house>`, `lives`, `life:<id>` (a life shown), `lesson:<id>` and `watched:<id>` (a lesson opened, and seen to its end), `heard`, `centre:<box>`, `answer` or `right` |
| `questions` | question from the Ask box | waiting and answered questions |
| `wishes` | (unused) | answers to a question that was removed on 2026-11-28 |

Taps wait on the phone until they reach the server, so none is lost without network (`lib/track.js`).

## Run

```
cd apps
npm install
npm test
cp .dev.vars.example .dev.vars   # opens /admin on localhost only
npm run preview                  # builds, makes a local database, serves http://localhost:8787
```

`npm run dev` runs the pages alone, without the Worker: taps then fail quietly.

## Deploy

1. A push to `dev` deploys by itself through Cloudflare Workers Builds, once the `bodhilabs` Worker is connected to this
   repository (Worker, Settings, Builds): branch `dev`, root directory `apps`, build command `npm run build`, deploy
   command `npm run ship` (applies D1 migrations, then publishes to bodhilabs.org and www.bodhilabs.org).
   Pushes to other branches do not deploy. By hand from a computer: `npx wrangler login`, then `npm run deploy`.
2. The admin panel `/admin` opens with a passcode: set the Worker secret `ADMIN_KEY` (8 characters or more) in the
   Cloudflare dashboard. The phone that typed it stays signed in for a year. Until it is set, `/admin` answers 403.
   Cloudflare Access also works: make an Access application for `bodhilabs.org/admin` and put its team domain and
   audience tag into `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` in `wrangler.jsonc`.

## Not done yet

See `docs/context/open.md`.
