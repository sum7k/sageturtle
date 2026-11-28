# BodhiLabs apps

One installable web app (bodhilabs.org) that will hold eleven apps, released one by one.
Until 2026-11-28 the product was called SageTurtle.

## What is live in this build

- **No login at the start.** A person who cannot read yet must be able to get in.
- **The first screen is the language**, chosen without reading (`app/start/page.jsx`, `components/Region.jsx`): eleven
  picture tiles, one per language. A tap makes the tile say hello in that language; a second tap, or the gold tick,
  chooses it. One tile is picked in advance from the phone's language, or from the state the person is in
  (`firstGuess` in `lib/langs.js`). The drawings are placeholders, with no religious symbols.
- **Home has eleven buttons** (`lib/buttons.js`). Only Book is open. The other ten are locked: a tap shows a lock and
  "Coming soon", and the tap is counted. The icons are placeholders.
- **Book** (`lib/book.js`): a picture, a gold button that says the word, and three written words to choose from. A wrong
  word shakes and says itself; the right one turns green and the next picture comes. Twelve words per language. The
  letters are on a second page.
- **The top of Home is the ad spot.** For now it asks "What functionality would you want next?" and opens a form (`/wish`).
- **Words in eleven languages** (`lib/strings.js`): Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu,
  Kannada, Odia, Malayalam. The app does not speak, except the hello on a language tile and the words in Book, which
  use the phone's own voice.
- **It installs as an app** (manifest, icons and `public/sw.js`) and opens without network once it has been opened.
- **Counting.** Choosing a language gives the phone an id on the server. Taps are counted against it. The server is
  told only the language (and the PIN code and work once a person registers), never a name or a number.
- **Admin panel** at `/admin`: users, taps and distinct users per button, users by language and work, and the answers
  from the form.

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
| `taps` | person, button and day | taps (sum of `count`) and distinct users (count of people) |
| `wishes` | answer to the form | the list on the admin panel |

Taps wait on the phone until they reach the server, so none is lost without network (`lib/track.js`).

## Run

```
cd apps
npm install
npm test
cp .dev.vars.example .dev.vars   # opens /admin on localhost only
npm run preview                  # builds, makes a local database, serves http://localhost:8787
```

`npm run dev` runs the pages alone, without the Worker: taps and the form then fail quietly.

## Deploy

1. `npx wrangler login`, then `npm run deploy`. This builds, creates the tables in the `bodhilabs` D1 database and
   publishes the Worker to bodhilabs.org and www.bodhilabs.org.
2. In Cloudflare Zero Trust, add an Access application (self-hosted) for `bodhilabs.org/admin` with a policy that
   allows only the owner's email.
3. Put the team domain (such as `name.cloudflareaccess.com`) and the application's audience tag into `ACCESS_TEAM_DOMAIN`
   and `ACCESS_AUD` in `wrangler.jsonc`, and deploy again. Until both are set, `/admin` answers 403.

## Not done yet

See `docs/context/open.md`.
