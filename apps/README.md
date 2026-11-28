# BodhiLabs apps

One installable web app (bodhilabs.org) that will hold eleven apps, released one by one.
Until 2026-11-28 the product was called SageTurtle.

## What is live in this build

- **Home has eleven buttons** (`lib/buttons.js`). The first row is open: Book, Horoscope, Khabri. The other eight are
  locked: a tap shows a lock and "Coming soon", and the tap is counted. The icons are placeholders.
- **The top of Home is the ad spot.** For now it asks "What functionality would you want next?" and opens a form (`/wish`).
- **Registration is first run**: language, lock, PIN code, what you do, khabar alerts. At the end the server gives the
  phone an id. The server is told the language, PIN code and work, never a name or a number.
- **The lock is the account**: a passkey opened by fingerprint, face or the phone's PIN. No phone number, no OTP.
- **Words in eleven languages** (`lib/strings.js`): Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu,
  Kannada, Odia, Malayalam. No voice. The one exception is Book, where the phone's own voice says a letter.
- **Book** (v1): the letters of the person's language. **Horoscope** (v1): pick a sign, read one line a day.
- **Khabri**: one khabar at a time, read whole on its card. Swipe left to like, right for not for me. Say khabar, not
  "news". No em dashes. True, with sources shown.
- **Me**: name, lists of people, settings, Reach me. Calls and messages are handed off by plain links (`lib/reach.js`).
- **Admin panel** at `/admin`: registered and active users, taps and distinct users per button, users by language and
  work, and the answers from the form.

Rules kept for later apps: app names are one word and a noun; a person can hold up to three kinds of work
(`lib/variants.js`).

## How it runs on Cloudflare

The pages are static files (`next build` writes `out/`). Cloudflare serves them without running any code. One Worker
(`worker/`) answers only `/api/*` and `/admin`, and keeps its data in one D1 database (`migrations/`):

| Table | One row per | Used for |
| :--- | :--- | :--- |
| `users` | registered phone | registered, new and active users; language and work |
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
