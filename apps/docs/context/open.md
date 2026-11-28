# Open, as of 2026-11-28

## Waiting on sumeet

- Review and merge pull request 2 (sum7k/sageturtle).
- Check Claude's choices marked (C) in `decisions.md`, above all: the limit of three variants, the five clashing pairs, the group tile names, the table of lists per variant, and the Hindi spoken lines.
- React to the six Messages screens (canvas row 13), and to Claude's choices in `apps/messages/tradeoffs.md`, above all: no inbox for adults, only two kinds of in-app chat, and a teen's parent not hearing the class chat.
- Talk through Wisdom: the open points are in `apps/wisdom/backlog.md`, and Claude's choices in `apps/wisdom/tradeoffs.md`.

## Designed, with small gaps

- Home at night and Home with no network still show the old farmer tiles, not the grouped ones.
- Home at night and Home with no network do not show the Wisdom tile or the new tile order. The landing page still shows 12 app pictures.
- The code (`apps/lib/home.js`) still has the old default tile order.
- Wisdom is drawn for farming, a shop and a kid only, with placeholder text.
- Me is drawn only for a farmer. A child's own view of Me is not drawn.
- Messages: typing, the sticker picker, the step after the flag, no network and night colours are not drawn. Four points in `apps/messages/docs/data-flows.md` are not settled.
- Scanning someone's code and the payment result after "remove ads" are not drawn.
- The drawn screens were never checked as renders by Claude (the canvas type does not allow it unless asked).

## Not designed

The inside of nine apps: Learn, Earn, Reminders, Hobbies, Meetings, Discussions, Events, Yellow Pages, Advertise. The
design map says what each does for each variant, but there are no screens. Messages is designed (`apps/messages/`).
Messages leaves two things to others: open groups go to Discussions, and calls inside the app go to Meetings.

## Built (pull request 2) and not built

Built: wordless landing by browser, first run, Home with grouped tiles and arranging, the Khabri deck, Me with lists and
settings. Reach me and the hand-off links are on the `dev` branch. 27 tests pass. Everything is saved on the phone (localStorage).

Not built:
- The backend, and the server check of the passkey.
- Translation: app names and khabars are English; only dates follow the language. Spoken lines exist in English and Hindi only.
- Hand-off is built only as far as the phone can go alone: Reach me, and call and message buttons on a person's row. Other people's numbers arrive only when code scanning and the backend exist. A teen's Reach me in child control is not built.
- The ten apps (Messages is designed, not built), the mic, code scanning, place by location, family profiles, child control, the class, remove ads.
- Offline mode, night colours, sending khabar alerts.
- The khabar pipeline. Four hand-written khabars with Wikipedia sources stand in.
- Dragging to reorder tiles (arrows for now).

## Order of work

The steps are in `docs/sdlc.md` (root). The unrolled items, their status and what comes next are in `work/sdlc-plan.md` (root).
There is no preview link now: Vercel is dropped, and the Cloudflare preview is not set up yet.
