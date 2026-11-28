# Decisions so far

As of 2026-11-28. (S) = decided by sumeet. (C) = chosen by Claude under the "decide when clear" rule, open to change.

## Launch plan (2026-11-28)

- (S) The product is BodhiLabs (bodhilabs.org), renamed from SageTurtle. The GitHub repository stays `sum7k/sageturtle`, branch `dev`.
- (S) Apps are made and released one by one, each built and put live on its own. Home has 11 buttons. First release: only Book (a study app that teaches reading; a book icon) is open. Horoscope and Khabri, the rest of the first row, open next. Locked buttons show a lock and count the tap.
- (S) No login at the start: the person may not be able to read. Registration comes later.
- (S) The first screen picks the language without reading: 11 drawn tiles, one per language (cartoon or line drawings of a place, food or dress; no religious symbols). A tap plays a short greeting in that language; a second tap chooses. One tile is pre-selected from the phone's language and the person's state.
- (S) Book starts with picture-and-sound matching: a picture (such as a bird), a button that says the word, and the person picks the right written word.
- (S) This version is for people who can see. People who are blind, deaf or mute get a separate app later.
- (S) The app installs on the phone (PWA).
- (S) Every level is a 4 by 4 grid of sixteen boxes; the ring "did not look good" (2026-11-28, replaces the ring). The twelve outer boxes are the level's houses: the subjects on Home (turned by the lagna), a subject's own steps inside it. The four in the middle are the same everywhere (their first content, Learned, Now, Next and Ask, was replaced the same day: see "The four in the middle" below). (S) The bottom right box is always the last house, the twelfth, and house 1 is the box just left of it; the count runs left along the bottom row, up the left side, across the top and down the right side (2026-11-28, replaces Claude's top-left start). The rising sign's subject is ringed in gold. Subject to sign, approved by sumeet: Mesha Body, Vrishabha Music, Mithuna Word, Karka Earth, Simha Rule, Kanya Number, Tula Art, Vrishchika Nature, Dhanu People, Makara Hand, Kumbha Money, Meena Lives (जीवनी). (C) Inside Word only house 3, Letters, is open, because the built game (pick the written word) belongs there by `gyan/docs/shabd.md`. (C) Strong means right at the first try three times in four, needs practice means less than half; this is kept on the phone only. (C) A learner may send five questions a day, 500 characters each; the phone looks for an answer at most once an hour and shows a red dot on "?".
- (C) The pictures are 40 emoji; each phone sees ten, a different ten each day; showings are recorded too, so pictures are ranked by the share of people who tapped.
- (S) The first row is named Gyan (ज्ञान, knowledge; was Book or Study), Vartaman (वर्तमान, the present; was Khabri) and Bhavishya (भविष्य, the future; was Horoscope), in every language (2026-11-28). Only Gyan is open. (C) The code keeps the old ids `book`, `khabri`, `horoscope`; English shows the Hindi names in Latin letters.
- (S) Voice rule (2026-11-28): everything the app speaks is heard in both a man's and a woman's voice, picked at random among Indian-accent voices, because two pitches make a word easier to catch. A neutral third voice is welcome if one exists. Other accents can come later. (C) For now the phone's own voices are used (`lib/speak.js`): each text is spoken twice, in random order. Phones do not say a voice's sex, so a voice is used when its name tells; otherwise the same voice is played lower and higher. No neutral voice exists on phones. Real men's and women's voices need recorded sound.
- (S) Recorded voices come from Sarvam AI (Bulbul), approved 2026-11-28. (C) A recording is made the first time it is asked for, saved in Cloudflare KV (`bodhilabs-voice`) and only read after that, so each is paid for once; only the app's fixed words, letters and greetings can be asked for (`worker/voice.js`, `lib/voice.js`). Speakers: shubh (man) and ishita (woman), the two Sarvam shows in all its languages; model bulbul:v3. Sarvam has no neutral voice and no Urdu, so Urdu uses the phone's voice. KV instead of R2 because R2 is not enabled on the account. The key is the Worker secret `SARVAM_API_KEY`.
- (S) PIVOT, 2026-11-28: BodhiLabs is for education only. The buttons on Home are the parts of the Gyan path: the time before school, one year, then ten years, each walked at the learner's own pace. They are arranged by Vedic astrology: by the lagna (the rising sign) of the moment, read the North Indian way (houses fixed, signs move). This replaces the eleven-apps plan and the picture-button test. What the eleven are (subjects or years), and the shape of Home (4x3 grid, or eleven around a centre), are still being decided: see `open.md`.
- (S) The first screen asks the phone for its place. A yes improves the language guess and sets the place for the lagna. A no changes nothing: the lagna is then worked out for Ujjain. (C) Built in `lib/place.js` and `lib/lagna.js` (sidereal, Lahiri ayanamsa). The place stays on the phone, rounded to about 10 km, and is not sent to the server. The language guess is the nearest of about 75 towns. Home does not use the lagna yet.
- (S) A simple admin dashboard for the phone, basics only, more later (2026-11-28). (C) `/admin` shows people today and in all, how far people get (first page, install, language, Gyan, picked a word, got one right), buttons pressed, state, who sent them, languages. State comes from Cloudflare at the first language choice; who sent them from `?from=name` in the link or the referring site. Visits and installs are counted without a person. Later ideas are in `backlog.md`. The door: a passcode set as the Worker secret `ADMIN_KEY` (at least 8 characters), remembered on the phone for a year by a cookie, 20 wrong tries a day; Cloudflare Access also still works.
- (S) In a browser tab the app is not usable: every app page goes by itself to the install page, which shows install, picture steps for the browser menu when there is no prompt, or Open the app if it is installed (2026-11-28). The installed app is never redirected. (C) localhost is exempt for development.
- (S) Gyan is walked by year, not by topic (2026-11-28, a major correction: a child who cannot read met the written stage 6 chapter under Number). Inside Gyan the twelve houses are the twelve stages; only the learner's stage and those behind it are open; inside a stage are its twelve subjects, and a subject shows only what was made for that stage. (C) `lib/stages.js`: a new learner is at stage 1; when every lesson made for the stage is seen to its end (in stage 3, every word of the game matched once) the next stage opens, quietly, with no marks; a stage with nothing made cannot be finished; Nature's picture lessons are in stage 1, the word game (written words) in stage 3, the chapter on zero in stage 6; Lives opens at every stage, and in stages 1 and 2 it is only heard, with no text. The `/word` grid is gone: Word's twelve houses are what Word holds at each stage. For review, the admin panel has "Open all stages" for the phone it is opened on, and `/gyan?all=1` and `/gyan?all=0` do the same.
- (S) The installed app must never ask to be installed (2026-11-28, seen on a Mac: Chrome moves the tab into the app window on install, and the install page stayed). (C) `lib/browser.js` knows the app window by any app display mode, the iPhone flag, an Android app referrer, or the start address `/app?source=pwa`, remembers it for the window, and the install page watches for the tab turning into the app.
- (S) Gyan is a cube of twelves (2026-11-28, like Vartaman): twelve stages, twelve subjects in each, twelve lessons in each subject at a stage, all on the same 4 by 4 grid with the twelfth house bottom right. (C) A lesson house is a unit that may hold several parts (lessons with the same `house`), so a school year fits; a house is ticked when all its parts were seen, and moving up a stage still needs every part seen; houses with nothing made are greyed; no names under the pictures before stage 3; `/subject` and `/lesson` replace the Nature and Number pages, and a chapter lesson still says whose voice it is told in and that the words are BodhiLabs' own.
- (S) Voices (2026-11-28, replaces Sarvam and the brief return to ElevenLabs the same day): the app calls no voice service and holds no key. Fixed content (lesson lines, lives, words, letters, greetings) is recorded beforehand into small files that the app plays; anything else, and anything not recorded yet, uses the device's own voice. To keep it cheap while testing, the files are made with sumeet's Mac's own voices (`npm run voices -- make hi`); ElevenLabs is used once, in a final round. (C) Files are AAC (.m4a) named by language, voice, line and a mark of the text, so a changed text is recorded again; the phone's voice picks premium, then enhanced voices first.
- (S) The four in the middle (2026-11-28, replaces Learned, Now, Next, Ask): 1 Me (मैं), 2 "?", 3 Settings, 4 the joker, left empty for now. Each behaves by level. Me: on Home the account (user name and password, family and backup come later); inside an app that app's progress and saved things. "?": on Home help with the app and questions to the admin; inside an app answers from that app's own content. Settings: the global ones on Home, the app's own inside. (C) Built as one page each, opened with `?in=top` or `?in=gyan`. Me on Home holds only the name, on the phone. Me inside Gyan shows the stage out of twelve and, from stage 3 only (nothing written is shown before a learner reads), the word game's words: going well, to practise, to come. Settings on Home: language and place; inside Gyan: voice (both, man, woman; both stays the rule) and speed (slow, normal, quick), which do not change a chapter's own teller. The corner button on Home is gone. The joker is greyed and a press is only counted. "Open all stages" stays out of the learner's Settings.
- (S) One more level on top (2026-11-28): Home is again a grid of sixteen, above learning. House 1 is Gyan (ज्ञान), which holds all of learning with its twelve subjects; house 2 is Vartaman (वर्तमान), the present, where news will be built. (C) The other ten houses are empty greyed boxes for now and a press is only counted; the lagna turns the subjects inside Gyan, not the top level; Gyan is at `/gyan`.
- (S) The number is twelve everywhere, not eleven (2026-11-28): twelve subjects, twelve houses, twelve languages. (C) The twelfth language is Punjabi (Gurmukhi; Sarvam has voices for it; Punjab and Chandigarh now guess Punjabi, not Hindi); its tile is an ear of wheat. (C) What the twelfth step of the path is belongs to the Gyan syllabus.
- (S) The spirit, written in the repo's `CLAUDE.md` (2026-11-28): every learner is an individual; no comparison, competition, ranks or "become like X"; lives and stories show struggle, effort and values, never a person to copy; the learner's progress is only their own.
- (S) The twelfth house is Lives (जीवनी); it is no longer called the joker, because it is biographies now (2026-11-28). It opens the life of one great person, a different one each time: artists, thinkers, scientists, anyone great, 121 in all, to read and to hear in the local language. Through a life a child sees why learning matters (2026-11-28; replaces the surprises and the dream professions). (C) Three placeholder lives until the 121 are written; a language with no text yet gets English; one voice, man or woman at random, reads a life.
- (S) Every tap is counted on Cloudflare, with distinct users. An admin panel is at bodhilabs.org/admin.
- (S) Users are not asked what they want: the "What functionality would you want next?" ad and form were removed the same day they were added (2026-11-28). The spot stays reserved for advertisements later.
- (S) After install the app should open by itself. (C) A page cannot do that, so the landing page shows one big "Open the app" button; the installed app starts at /app.
- (S) Text in 11 Indian languages, English among them. No voice. Media only where it truly adds value. People who cannot read are taught in Book.
- (C) The 11 languages are the earlier twelve without Punjabi, which has the fewest speakers of the twelve.
- (C) Taps and registrations are kept in Cloudflare D1; the admin panel is checked by Cloudflare Access. Details in `apps/tradeoffs.md`.
- (C) The greeting and Book's words are said by the phone's own voice, not by recordings. The tile drawings are Claude's placeholders: Taj Mahal, ABC, Howrah Bridge, Gateway of India, Charminar, a dosa, a kite, a pen, an elephant, the Konark wheel, a palm and boat.
- (C) Book has 12 words per language and three choices a round; pictures are emoji. Horoscope v1 (built, not open) is a sign and one line of gentle advice a day.

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
- (S) Every chapter is told in the voice of a great person of its field, in the first person and in their way of thinking; voices may repeat; never in an AI's voice (2026-11-28, rule in the repo's CLAUDE.md). (C) The screen says "told in the voice of X" and that the words are BodhiLabs' own, so nothing reads as a real quotation. (C) The sample is Number, stage 6, "Zero, fortune and debt", told as Brahmagupta: six lessons of six or seven scenes, each ending with four unmarked sums. (C) From stage 4 the spoken line is also written under the drawing, and a chapter is heard in one voice only (a man's for Brahmagupta), not in both. (C) Drawings hold numbers and signs only, so they still serve every language; a gold coin is a fortune and a red broken ring a debt.
