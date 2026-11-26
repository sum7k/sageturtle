# Open, as of 2026-11-26

## Waiting on sumeet

- Review and merge pull request 2 (sum7k/sageturtle).
- In Vercel, project "sageturtle": set Root Directory to `apps`. Until then the preview link shows "page not found", because Vercel builds the top of the repository.
- Check Claude's choices marked (C) in `decisions.md`, above all: the limit of three variants, the five clashing pairs, the group tile names, the table of lists per variant, and the Hindi spoken lines.

## Designed, with small gaps

- Home at night and Home with no network still show the old farmer tiles, not the grouped ones.
- Me is drawn only for a farmer. A child's own view of Me is not drawn.
- Scanning someone's code and the payment result after "remove ads" are not drawn.
- The drawn screens were never checked as renders by Claude (the canvas type does not allow it unless asked).

## Not designed

The inside of the ten apps: Learn, Earn, Reminders, Hobbies, Meetings, Messages, Discussions, Events, Yellow Pages,
Advertise. The design map says what each does for each variant, but there are no screens. Suggested first: Messages,
because the lists of people and the class both lead into it.

## Built (pull request 2) and not built

Built: wordless landing by browser, first run, Home with grouped tiles and arranging, the Khabri deck, Me with lists and
settings. 24 tests pass. Everything is saved on the phone (localStorage).

Not built:
- The backend, and the server check of the passkey.
- Translation: app names and khabars are English; only dates follow the language. Spoken lines exist in English and Hindi only.
- The ten apps, the mic, code scanning, place by location, family profiles, child control, the class, remove ads.
- Offline mode, night colours, sending khabar alerts.
- The khabar pipeline. Four hand-written khabars with Wikipedia sources stand in.
- Dragging to reorder tiles (arrows for now).

## Suggested order

1. Merge pull request 2 and fix the Vercel setting.
2. Backend: accounts by passkey, the person's profile, variants and lists.
3. Family profiles and child control, then the lists (scan a code) and the class.
4. Khabri's pipeline and translation.
5. Design and build the ten apps one at a time, Messages first.
