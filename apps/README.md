# BodhiLabs apps

One installable web app (bodhilabs.org) that will hold eleven apps, released one by one.
Until 2026-11-28 the product was called SageTurtle.

## What is live in this build

- **No login at the start.** A person who cannot read yet must be able to get in.
- **The first screen is the language**, chosen without reading (`app/start/page.jsx`, `components/Region.jsx`): eleven
  picture tiles, one per language. A tap makes the tile say hello in that language; a second tap, or the gold tick,
  chooses it. One tile is picked in advance from the phone's language, or from the state the person is in
  (`firstGuess` in `lib/langs.js`). The drawings are placeholders, with no religious symbols.
- **Home has twelve buttons** (`lib/buttons.js`). Only Book is open. The other ten are lightly greyed out and carry
  no name: each shows one picture out of a pool of 40, and each phone sees a different ten each day. A tap on one
  only gets counted, together with which pictures were shown, so the admin panel can rank pictures by the share of
  people who tapped them. Nobody is asked anything.
- **The joker** is the twelfth button: an empty app with a joker card on it. A tap shows one surprise over the whole
  screen (a mic, a dice, a balloon and so on), never the same one twice in a row. The tap and what was shown are counted.
- **Book** (`lib/book.js`): a picture, a gold button that says the word, and three written words to choose from. A wrong
  word shakes and says itself; the right one turns green and the next picture comes. Twelve words per language. The
  letters are on a second page.
- **Words in eleven languages** (`lib/strings.js`): Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu,
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
| `taps` | person, thing and day | taps (sum of `count`) and distinct users (count of people). The thing is `book`, `icon:<picture>` for a tap, or `seen:<picture>` for a showing |
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
2. In Cloudflare Zero Trust, add an Access application (self-hosted) for `bodhilabs.org/admin` with a policy that
   allows only the owner's email.
3. Put the team domain (such as `name.cloudflareaccess.com`) and the application's audience tag into `ACCESS_TEAM_DOMAIN`
   and `ACCESS_AUD` in `wrangler.jsonc`, and deploy again. Until both are set, `/admin` answers 403.

## Not done yet

See `docs/context/open.md`.
