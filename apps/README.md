# SageTurtle apps

One installable web app that holds the twelve apps. Who the person is (their variant) decides what each app is called
and which apps and lists of people they see.

This is the first slice: first run, Home, the Khabri deck and Me. Everything is kept on the phone; the shared backend comes next.

## Rules that shape the code

- **No written instructions.** Screens use pictures and voice. Text is kept only for language names, numbers, names of
  people, places and apps, and content such as a khabar. Every icon-only control has an accessibility label.
- **A tap speaks and selects.** The gold tick goes on.
- **App names are one word and a noun**, never a verb (`lib/variants.js`).
- **The lock is the account**: a passkey opened by fingerprint, face or the phone's PIN. No phone number, no OTP.
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
- No offline mode, no night colours, no khabar alerts being sent.
