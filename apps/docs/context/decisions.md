# Decisions so far

As of 2026-11-26. (S) = decided by sumeet. (C) = chosen by Claude under the "decide when clear" rule, open to change.

## Platform

- (S) A PWA. The website's landing page asks for one thing: Install.
- (S) One backend for all variants. Only config, names and theme differ.
- (S) Voice first. Reading and typing are optional.
- (S) Twelve languages on the first screen: Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi.
- (S) No phone number and no OTP. The fingerprint (a passkey) is the whole account. (C) The phone's own PIN is the fallback.
- (S) Free with ads for adults. 1,200 rupees a year removes ads, paid by UPI through Dodo Payments. Kids are free with no ads. (C) Teens see no ads.
- (S) No ads on Home. No ads on a card whose main content is a player.
- (S) Age check is postponed (in `apps/backlog.md`).

## The interface

- (S) No written text as instruction. Pictures, icons, colour, motion and voice. The landing page has no words at all and shows, by browser, where to tap to install.
- (S) Inner screens have no headings and no button words. Text that is shown follows the chosen language.
- (C) Text is kept only for language names, numbers, names of people, places and apps, and content such as a khabar.
- (C) A tap speaks and selects. The gold tick goes on. Every icon-only control has an accessibility label.
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
- (C) Home: date and place, the Khabri card, app tiles three in a row, a wide gold mic. No bottom bar. Me opens from the round picture.
- (S) One tile per app. Where the person's variants call the app by different names, the tile opens into those versions (Earnings opens into Mandi and Leads). With one name it opens straight away.
- (C) Closed group tiles are named Learning, Earnings, Reminders, Hobbies, Meetings, Messages, Discussions, Events, Directory, Adverts.
- (S) People can keep a favourite on top, hide (archive) a tile and reorder. (C) By long press; moving by arrows in the first build; no folders, because grouping does that job.

## Khabri

- (S) Pushed, ad-free, Indian khabar. Rebuilt inside the sageturtle repository, not kept as a separate site.
- (S) No levels to choose. One khabar, easiest part first, more detail as one reads on.
- (C) One khabar at a time on its card. Swipe left to like (a gold heart), right for not for me. Listen and share.
- (C) No gear and no You page. Those facts live in Me; the day items (tithi, rashi, seasonal note) come as a card in the deck.
- Voice of a khabar: very simple English, short sentences, time and place first, calm and joyful, say khabar not "news", no em dashes, true with sources shown.
- (S) Sources: no crawling. Topics from chosen X handles (about 50 USD a month approved), shown as X's own embeds. Written khabars from government sources. PB-SHABD is in the backlog.

## Me, people and the class

- (S) Me is the twelfth app: profile, username, family, child control, the lists of people, settings.
- (S) A person keeps separate lists of people. (C) The set is Family, Friends, Work, Trade, Neighbours, Class. A variant shows only the lists that fit. One person can be in several lists. People join only by scanning each other's code.
- (S) The class is one shared group seen through each role. The teacher makes it and people join by the class code. Teacher: students, speak to all, homework, call, office hours. Parent: the class sits under the child, a fingerprint lets a teacher in, other parents are visible. Kid: manages nothing, the teacher is a guardian. Teen: classmates and a class chat the teacher can see.
- (C) Child control has four things: time each day, sleep time, guardians, which apps are on.
