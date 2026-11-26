# SageTurtle apps

One installable web app that holds the twelve apps. Who the person is (their variant) decides what each app is called
and which apps and lists of people they see.

This is the first slice: first run, Home, the Khabri deck and Me. Everything is kept on the phone; the shared backend comes next.

## Rules that shape the code

- **No written instructions.** Screens use pictures and voice. Text is kept only for language names, numbers, names of
  people, places and apps, and content such as a khabar. Every icon-only control has an accessibility label.
- **A tap speaks and selects.** The gold tick goes on.
- **App names are one word and a noun**, never a verb (`lib/variants.js`).
- **A person can hold up to three variants** (a farmer who runs a shop). Some pairs do not go together, which gives
  97 kinds of person (`allCombos` in `lib/variants.js`). Adding or removing a variant asks for the lock.
- **Home shows one tile per app** (`lib/home.js`). Where the person's variants call an app by different names, the tile
  carries the app's own name and opens into those versions (Earnings opens into Mandi and Leads). A long press arranges a
  tile: keep it on top, move it, or hide it. Hidden tiles wait behind the last tile. There are no folders.
- **The lock is the account**: a passkey opened by fingerprint, face or the phone's PIN. No phone number, no OTP.
- **Calls and messages are handed off** (`lib/reach.js`). A person's row opens the phone's dialer (`tel:`) or their chat in
  the app they chose in Reach me: WhatsApp (`wa.me`), Telegram (`t.me`) or SMS. Plain links, no APIs, no fees. Kids are never handed off.
  Reach me (asking for a mobile number) is a proposal the owner has not agreed to yet; see `docs/context/open.md`.
- **Khabri**: one khabar at a time, read whole on its card, easiest part first. Swipe left to like, right for not for me.
  Say khabar, not "news". No em dashes. True, with sources shown.

## Run

```
cd apps
npm install
npm run dev     # http://localhost:3000
npm test
```

In a browser that cannot install, the landing button simply goes on to first run.

## Not done yet

- Screen text follows the chosen language only for dates and language names; app names and khabars are English.
- Spoken lines exist in English and Hindi (Hindi not yet checked by a second speaker); other languages fall back to English.
- The passkey is made and asked for on the phone only; the server check comes with the backend.
- The ten app tiles, the mic, scanning a code, finding the place by location, family profiles, child control and
  remove ads say "coming soon".
- Other people's Reach me details arrive only with code scanning and the backend, so the row buttons show for nobody yet.
  A teen's Reach me in child control is not built.
- No offline mode, no night colours, no khabar alerts being sent.
