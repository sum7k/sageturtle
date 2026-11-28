> DRAFT, stopped on 2026-11-26. sumeet: this cannot be written until each of the ten remaining apps is designed. Not agreed, not for guidance. Per-app parts are guesses from the design map.

# CubeGullak: requirements that are not features

Written 2026-11-26. One set for the whole platform, because the backend is shared. What each app does is in the design
map (`variant-map.html`); this file says how well the platform must do it. Privacy needs are in `privacy.md`. The design
that meets these is in `hld.md`.

(S) = sumeet's rule. (C) = Claude's proposed target, open to change. Numbers marked "estimate" are worked out, not
measured.

## 1. Scale

- (S) Build nothing that cannot scale easily to 100 crore users.
- (S) Data is split by family. No celebrity-style bursts are expected: nobody has crores of followers.
- (C) A family is one adult's account plus the child profiles that adult made. No single piece of storage ever holds
  more than one family, one group, or one small area of the country.
- (C) Sizing used in this design, as the far end, not as a forecast:

| What | Number |
| :--- | :--- |
| People with an account or profile | 100 crore |
| Families | about 60 crore |
| People active in a month | 50 crore |
| People active in a day | 30 crore |
| Requests to the backend per active person per day | 50 |
| Requests per second, average and peak | about 1.7 lakh and 5 lakh |
| Khabars written per day, before languages | about 50 |
| Khabar alerts sent per day | up to 30 crore (at most one per person per day) |

- (C) The largest single group is a discussion circle. A circle is cut by district and language so that none passes
  about 1 lakh members. A class is under 200.
- (C) Growth must need no redesign: going from 1 lakh to 100 crore people adds storage units of the same kind, never a
  bigger machine.

## 2. Speed

Measured on a cheap Android phone (2 GB memory) on a slow 4G line, in India.

| What | Target (C) |
| :--- | :--- |
| Landing page shown | 2 seconds |
| First open after install, Home usable | 3 seconds |
| Later opens, Home usable | 1 second, with or without network |
| A tap speaks its name | 0.1 second (the sound is already on the phone) |
| A khabar's Listen starts | 1 second |
| Backend answer, 95 of 100 requests | 0.3 second |
| App code sent on first load | under 200 KB compressed |
| Data used in a normal day, no video | under 5 MB |

- (C) The backend is up 99.9% of the time. Reading Khabri and anything already on the phone must keep working when the
  backend is down.

## 3. Offline use

- (C) The app shell, the person's own data, the spoken lines of the chosen language and the last 20 khabars are kept on
  the phone. Space for all of this stays under 30 MB.
- (C) Anything the person does offline is kept in a waiting line on the phone and sent when the network returns. The
  person never loses what they said or typed.
- (C) A tile that cannot work offline is dimmed, not hidden.

## 4. Languages

- (S) Twelve: Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi.
- (C) Everything a person hears or reads comes in all twelve: spoken lines, app names, khabars, lessons, and the privacy
  notice. Content that people make themselves (a listing, a message) stays in the language it was made in.
- (C) Urdu runs right to left and uses its own font.
- (C) A thirteenth language is added by adding data, not code.

## 5. Voice first

- (S) Every screen can be heard and every input can be spoken. Reading and typing are optional.
- (S) No written instructions, headings or button words on screens.
- (C) Fixed lines (screen and button names) are recorded once per language and kept on the phone. They cost nothing per
  use and work offline.
- (C) A khabar or lesson is turned into sound once per language when it is made, not each time it is played.
- (C) The speak button uses the phone's own speech recognition where the browser has it. The server is used only where
  the phone cannot do it. Live speech on a server is the one cost that grows with every use (see cost below).
- (C) Speech must work for the twelve languages with common accents. A wrong hearing must be easy to see and redo: the
  heard words are shown and spoken back.

## 6. Cost per person

- (C) Target: the platform costs under 10 paise per active person per month, not counting live speech. With live speech,
  under 1 rupee.
- Estimate with Cloudflare's November 2026 prices, for one person active 15 days a month:

| Part | Use in a month | Cost in US dollars |
| :--- | :--- | :--- |
| Requests to Workers | 600 | 0.00018 |
| Requests to the family's storage | 300 | 0.00005 |
| Rows written | 200 | 0.0002 |
| Storage kept (about 200 KB) | | 0.00004 |
| Alerts, files, the rest | | 0.0001 |
| Total | | about 0.0006, which is about 5 paise |

- Fixed costs that do not grow with people: writing about 50 khabars a day in 12 languages with sound, and X's API
  (about 50 US dollars a month).
- Live speech on a server costs roughly 0.5 rupee a minute at usual vendor prices (estimate, vendors not yet compared;
  see `shell/backlog.md` "Price of voice"). One minute a day would cost about 15 rupees a month, 300 times everything
  else. This is why the phone's own recognition comes first.
- (C) Video is never stored or sent by CubeGullak. It plays from YouTube. Music plays from Spotify.

## 7. Phones and browsers

- (S) A PWA. No app store.
- (C) Android 9 and later with Chrome or Samsung Internet. iPhone with iOS 16.4 and later (the first version where an
  installed web app can receive alerts).
- (C) Works on a 5 inch screen, 2 GB memory, and a phone with no fingerprint sensor (the phone's PIN is the key).
- Desktop is not decided (`shell/backlog.md`).

## 8. Safety and trust

- (S) Rules for Kids and Teens are checked by the backend on every request, not only by the screen.
- (S) A kid can talk only to guardians and is never handed off to another app.
- (C) Any change to a child's profile leaves a record the owner can see.
- (C) A report button on every chat, post, listing and advert. A report about a child is looked at within 24 hours.
- (C) Every khabar shows its source and date.

## 9. Running it

- (S) Hosting is Cloudflare only.
- (C) One person can run it. No servers to patch, no manual scaling, deploys by one command, and every lasting resource
  is written in Terraform.
- (C) A daily copy of every shared database, kept 30 days. Family storage can be rolled back to any point in the last
  30 days.
- (C) Costs, errors and speed are visible on one dashboard, with an alert when any target here is missed.

## 10. What each app needs

Only where an app adds something to the shared needs above.

| App | Works offline | Its own need |
| :--- | :--- | :--- |
| Khabri | Last 20 khabars with sound | A new khabar reaches every phone within 30 minutes of being written. Same feed for everyone in the same language, variants and area, so it can be cached. |
| Learn | Lessons the person saved | A lesson is small: pictures and sound, video only by YouTube. Kids have no scores. |
| Earn | Saved listings, the tracker | Listings are by area. A fake payer or recruiter can be reported and removed within a day. |
| Reminders | Fully | A reminder must ring on time even if the app is closed and the phone was offline when it was set. |
| Hobbies | Saved activities | Groups are small and local. |
| Meetings | The schedule | Adults' calls are handed off to the phone. In-app group calls come later. |
| Messages | Reading old messages, writing into the waiting line | A message in a group arrives within 2 seconds. Kids' chats are visible to the parent. |
| Discussions | Reading saved threads | Every post is checked before strangers see it in Teens' forums. Off for Kids. |
| Events | Saved events | By area and date. |
| Yellow Pages | Saved entries | Search by voice, by area. 6 crore businesses at the far end. Hidden for Kids. |
| Advertise | Drafts | An advert is made by voice in under two minutes. Adverts are placed by area and variant, never by a person's history. |
| Me | Fully, except adding people | The lock is asked for a child's profile, a variant change and a payment. |

## 11. Not targets yet

- Live speech vendor and price (`shell/backlog.md`).
- In-app calls (`shell/backlog.md` and the hand-off decision).
- Getting an account back after a lost phone (`shell/backlog.md`).
