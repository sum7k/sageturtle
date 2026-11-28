# Decisions so far

As of 2026-11-28. (S) = decided by sumeet. (C) = chosen by Claude under the "decide when clear" rule, open to change.

## Launch plan (2026-11-28)

- (S) The product is BodhiLabs (bodhilabs.org), renamed from SageTurtle. The GitHub repository stays `sum7k/sageturtle`, branch `dev`.
- (S) Apps are made and released one by one. Home has 11 buttons. The first row is open: Book (a study app that teaches reading; a book icon), Horoscope, Khabri. The other eight are locked: a tap shows a lock and is counted.
- (S) Icons on the buttons are placeholders for now.
- (S) Every tap is counted on Cloudflare, with distinct users. An admin panel is at bodhilabs.org/admin.
- (S) A simple registration is required before Home.
- (S) The spot on Home where the khabar card was is for advertisements later. For now it asks "What functionality would you want next?" and opens a form.
- (S) Text in 11 Indian languages, English among them. No voice. Media only where it truly adds value. People who cannot read are taught in Book.
- (C) The eight locked buttons are Earnings, Reminders, Hobbies, Meetings, Messages, Discussions, Events, Directory, each with its name. Adverts and Wisdom wait.
- (C) The 11 languages are the earlier twelve without Punjabi, which has the fewest speakers of the twelve.
- (C) Taps and registrations are kept in Cloudflare D1; the admin panel is checked by Cloudflare Access. Details in `apps/tradeoffs.md`.
- (C) Book v1 is the letters of the person's language; a tap shows a letter large and the phone's own voice says it. Horoscope v1 is a sign and one line of gentle advice a day.

## Platform

- (S) A PWA. The website's landing page asks for one thing: Install.
- (S) One backend for all variants. Only config, names and theme differ.
- (S) Text first, no voice (2026-11-28; before that it was voice first).
- (S) Eleven languages on the first screen. (C) Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam.
- (S) No phone number and no OTP. The fingerprint (a passkey) is the whole account. (C) The phone's own PIN is the fallback.
- (S) Free with ads for adults. 1,200 rupees a year removes ads, paid by UPI through Dodo Payments. Kids are free with no ads. (C) Teens see no ads.
- (S) Home has one ad spot on top (2026-11-28; before that Home had no ads). No ads on a card whose main content is a player.
- (S) Age check is postponed (in `apps/backlog.md`).

## The interface

- (S) Screens use words in the chosen language (2026-11-28; before that there was no written text and every screen spoke).
- (C) Words are few: a name under each icon, a short heading on a screen. The landing page follows the browser's language until one is chosen.
- (C) Every icon-only control has an accessibility label.
- (S) Khabri's theme for everything: sky `#eaf4ff`, navy `#14174a`, gold `#ffc531`, tints `#fff0bf #ffe3dc #ddf3e4 #e9e4ff`, Anek Latin and Source Serif 4, sun-and-hill art, round cards.

## Variants and names

- (S) 11 variants. Parent is not a variant; Guardian is a role any adult can hold.
- (S) Every account belongs to an adult. Kids and Teens are profiles the adult makes in Me.
- (S) Kids: no scores or points, no blessings. A kid can message only guardians.
- (S) News is called Khabri in every variant.
- (S) Every app name is one word and a noun, never a verb ("verbs bring a kind of agitation associated with time").
- (S) A person can hold a variable number of variants.
- (C) At most three. Five pairs clash: Looking for a job + Office job, Retired + Office job, Retired + Looking for a job, Teacher + Office job, Student + Retired. Kids and Teens stand alone. This gives 97 kinds of person (11 + 31 + 55).
- (C) Adding or removing a variant asks for the lock.

## Home

- (C) Order of first run: landing, language, lock, PIN code, what you do, khabar alerts, Home.
- (C) Home: date and place, the ad spot, eleven buttons three in a row. No bottom bar, no mic. Me opens from the round picture.

The four lines below describe Home after all apps open. They are not in the launch build.

- (S) One tile per app. Where the person's variants call the app by different names, the tile opens into those versions (Earnings opens into Mandi and Leads). With one name it opens straight away.
- (C) Closed group tiles are named Learning, Earnings, Reminders, Hobbies, Meetings, Messages, Discussions, Events, Directory, Adverts.
- (S) Default tile order, by Cheiro's numbers on a phone keypad (2026-11-27): Earnings, Wisdom, Meetings; Discussions, Learning, Hobbies; Messages, Reminders, Events; Directory, the mic, Adverts. Learning is the centre. People can still rearrange.
- (S) People can keep a favourite on top, hide (archive) a tile and reorder. (C) By long press; moving by arrows in the first build; no folders, because grouping does that job.

## Khabri

- (S) Pushed, ad-free, Indian khabar. Rebuilt inside the sageturtle repository, not kept as a separate site.
- (S) No levels to choose. One khabar, easiest part first, more detail as one reads on.
- (C) One khabar at a time on its card. Swipe left to like (a gold heart), right for not for me. Listen and share.
- (C) No gear and no You page. Those facts live in Me; the day items (tithi, rashi, seasonal note) come as a card in the deck.
- Voice of a khabar: very simple English, short sentences, time and place first, calm and joyful, say khabar not "news", no em dashes, true with sources shown.
- (S) Sources: no crawling. Topics from chosen X handles (about 50 USD a month approved), shown as X's own embeds. Written khabars from government sources. PB-SHABD is in the backlog.

## Wisdom

- (S) A new app called Wisdom, the tab "of god", is the first tab. It was first named Religion; sumeet renamed it on 2026-11-27 because Religion sounded a little scary, and Wisdom is calmer and more neutral. It holds a list of quotations, each rewritten as a moral science short story. The stories differ by variant. It is built last. Details are still to be talked through.
- (C) Same name in every variant. An oil lamp is its picture. (S) Its tile is top centre on Home (position 2).
- (C) The quotation is shown word for word with its source and is never rewritten. Only the story is new. Every variant's story ends in the same one-line moral.
- (C) A person with several variants changes between their stories. A kid's story is three pictures, heard first, with no share.
- (C) One new quotation a day. No ads, no comments, no scores. Stories are written ahead per variant and language and served as saved files.
- Not decided: which traditions, the sources, who checks, whether a person picks a tradition. All in `apps/wisdom/backlog.md`.

## Calls and messages

- (S) One-to-one calls and messages are handed off by link: the phone's dialer (`tel:`), SMS (`sms:`), WhatsApp (`wa.me/<number>`) or Telegram (`t.me`), whichever that person uses. No APIs, no fees.
- (S) Kids are never handed off. They keep in-app calls and messages with guardians. Voice in the app can later use Cloudflare Realtime.
- (S) Build nothing that cannot scale easily to 100 crore users. Hosting is Cloudflare only.
- (S) The other person's number comes from Reach me in Me: one optional mobile number, never checked by OTP, and one app for messages. It is not the account (2026-11-28).
- (C) A row has a handset (dialer) and the chosen app's mark (message). Telegram opens by number. A teen's Reach me is filled by the guardian, without Telegram. Groups (class chat, speak to all, class call) stay in the app.

## How we work

- (S) Step 1 of every app includes a one-page product case: problem, job per variant, non-goals, one number with guardrails, the riskiest assumption, and a test with 5 real people before building (2026-11-28). See root `docs/sdlc.md`.

## Messages

Designed on 2026-11-28 (`apps/messages/`). Screens are not approved yet.

- (C) Messages is the door to people: the lists from Me with hand-off buttons, one screen for every adult variant. The variant sets the tile's name and which list comes first.
- (C) No inbox and no unread count for adults, because BodhiLabs cannot see outside apps. People are ordered by who was last reached.
- (C) Only two kinds of chat live inside the app: a child with a guardian, and a class. Open groups belong to Discussions.
- (C) An in-app message is a voice note, a sticker or typed text. No photos, files or transcripts yet.
- (C) The owner of a child's account hears all the child's chats. A kid's flag tells the owner.
- (C) A class of kids talks as parents and teachers; older classes as students and teachers. A teen's parent does not hear the class chat. Office hours hold back alerts to the teacher.
- (C) Until the backend exists, only hand-off is real; in-app chats are a demo on one phone.

## Me, people and the class

- (S) Me is an app of its own (the thirteenth, now that Wisdom is added): profile, username, family, child control, the lists of people, settings.
- (S) A person keeps separate lists of people. (C) The set is Family, Friends, Work, Trade, Neighbours, Class. A variant shows only the lists that fit. One person can be in several lists. People join only by scanning each other's code.
- (S) The class is one shared group seen through each role. The teacher makes it and people join by the class code. Teacher: students, speak to all, homework, call, office hours. Parent: the class sits under the child, a fingerprint lets a teacher in, other parents are visible. Kid: manages nothing, the teacher is a guardian. Teen: classmates and a class chat the teacher can see.
- (C) Child control has four things: time each day, sleep time, guardians, which apps are on.
