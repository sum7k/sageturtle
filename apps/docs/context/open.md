# Open, as of 2026-11-28

## Waiting on sumeet

- Deploy BodhiLabs and set up Cloudflare Access for `/admin` (`apps/README.md`).
- Look at the 11 language drawings and say which to change.
- Check Claude's choices marked (C) in `decisions.md`, above all: the limit of three variants, the five clashing pairs, the group tile names and the table of lists per variant.
- Find five people for the Messages test (`apps/messages/docs/case.md`): a shopkeeper, a farmer, a parent of a young child, a teacher and a person over 60.
- React to the six Messages screens (canvas row 13), and to Claude's choices in `apps/messages/tradeoffs.md`, above all: no inbox for adults, only two kinds of in-app chat, and a teen's parent not hearing the class chat.
- Talk through Wisdom: the open points are in `apps/wisdom/backlog.md`, and Claude's choices in `apps/wisdom/tradeoffs.md`.

## Designed, with small gaps

- Home at night and Home with no network still show the old farmer tiles, not the grouped ones.
- Home at night and Home with no network do not show the Wisdom tile or the new tile order. The landing page still shows 12 app pictures.
- Wisdom is drawn for farming, a shop and a kid only, with placeholder text.
- Me is drawn only for a farmer. A child's own view of Me is not drawn.
- Messages: typing, the sticker picker, the step after the flag, no network and night colours are not drawn. Four points in `apps/messages/docs/data-flows.md` are not settled.
- Scanning someone's code and the payment result after "remove ads" are not drawn.
- The drawn screens were never checked as renders by Claude (the canvas type does not allow it unless asked).

## Not designed

The inside of nine apps: Learn, Earn, Reminders, Hobbies, Meetings, Discussions, Events, Yellow Pages, Advertise. The
design map says what each does for each variant, but there are no screens. Messages is designed (`apps/messages/`).
Messages leaves two things to others: open groups go to Discussions, and calls inside the app go to Meetings.

## Built and not built (branch `dev`)

Built for the first release: landing, the language screen with picture tiles and greetings, Home with Book, ten greyed
picture buttons and the joker, Book's word matching and letters, install as an app with offline opening and an "Open the app" button,
counts of pictures shown and tapped, and the admin panel. Words in 11 languages. Horoscope, Khabri, Me and registration are built but not linked.
The server holds phones and taps (Cloudflare D1). 34 tests pass. A push to `dev` deploys through Cloudflare Workers Builds.

Not done:
- **Deploy.** Not live yet. Needs `npm run deploy` from `apps/` with Cloudflare sign-in, and a Cloudflare Access application for `/admin` (steps in `apps/README.md`).
- The ten Indian languages were written by Claude and are not checked by native speakers. Khabars are English only. Horoscope lines are English and Hindi only.
- The greeting and Book's words use the phone's own voice. Some phones have no voice for some languages (Odia above all), and then nothing is heard. Recorded sound files would fix it.
- The 11 language drawings are placeholders. Book has only 12 words.
- The server does not check the passkey yet, and an account cannot move to a new phone.
- Nothing stops fake registrations yet (a check such as Turnstile comes when needed).
- The eight locked apps, code scanning, family profiles, child control, the class, remove ads.
- Offline mode, night colours, sending khabar alerts, the khabar pipeline (four hand-written khabars stand in).
- The drawn screens (canvas) and the Messages design still show the old voice-first, wordless design.

## Order of work

The steps are in `docs/sdlc.md` (root). The unrolled items, their status and what comes next are in `work/sdlc-plan.md` (root).
There is no live link yet: the app is ready to deploy to Cloudflare but is not deployed.
