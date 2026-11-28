> DRAFT, stopped on 2026-11-26. sumeet: this cannot be written until each of the ten remaining apps is designed. Not agreed, not for guidance. Per-app parts are guesses from the design map.

# CubeGullak: privacy, the DPDP law and threats

Written 2026-11-26. One set for the whole platform. This is a design note, not legal advice: a lawyer must read it
before launch (legal risk is sumeet's call).

How the facts were checked: the Rules were looked up on 2026-11-26 in published summaries (India Briefing, The Leaflet,
SCC Online, Storyboard18, and a copy of the Fourth Schedule). Section numbers and penalty amounts of the Act are from
the Act as Claude knows it, and are marked "Act". Lines marked "check" could not be confirmed from two sources and need
the Gazette text.

## 1. The law in short

- The Digital Personal Data Protection Act, 2023, and the DPDP Rules, 2025 (notified 13 to 14 November 2025).
- The duties that bind us (notice, consent, children, security, breaches, erasure, rights) start 18 months after
  notification: about **13 May 2027**. That is under six months from today. Anything launched before that date should
  already follow them.
- CubeGullak is the "data fiduciary". Cloudflare, Dodo Payments and any speech or writing vendor are "data processors"
  working under our contract. A person is the "data principal".
- A child is anyone under 18 (Act, section 2). So both Kids and Teens are children in law.
- Penalties (Act, Schedule): up to 250 crore rupees for weak security, up to 200 crore for not reporting a breach, up
  to 200 crore for breaking the children's rules.

## 2. What the law asks, and what CubeGullak does

| The law asks | CubeGullak does |
| :--- | :--- |
| A notice before consent: which data, why, how to withdraw, how to complain. Plain language, on its own, in English or the person's Indian language (Act, sections 5 and 6). | One notice screen in the first run, after the language is chosen. It is spoken aloud and can also be read, in all twelve languages. Each purpose is a picture with a spoken line and its own yes or no. This is the one place where written text is offered, because the law needs a notice a person can keep. |
| Consent is free, specific and as easy to withdraw as to give. | Me has a consent tile showing every yes and no. A tap withdraws. Withdrawing stops that use and never locks the person out of the rest. |
| Use data only for the stated purpose. Erase it when the purpose ends or consent is withdrawn. | Each field in the data model carries its purpose (see `hld.md`). Erasing an account erases the family's whole storage unit in one step. |
| Reasonable security: encryption, access control, logs kept one year, backups, the same in processor contracts (Rule 6). | See the threat model below and `hld.md` section 9. |
| A breach is told to each affected person without delay, and to the Board at once and in detail within 72 hours (Rule 7). | A written breach plan. People are told through an alert and a spoken card on Home, since we hold no phone number or email. |
| Erase after long inactivity. For large social, shopping and gaming services: 3 years with no use, with a warning 48 hours before (Rule 8, Third Schedule; the classes and their sizes need a check). | A family not opened for 3 years is warned by alert and then erased. We follow this from the start so nothing changes when we grow. |
| Keep logs and traffic data for at least one year (Rules 6 and 8). | Access logs are kept one year, then deleted. They hold ids, not names or content. |
| Publish who answers questions about data (Rule 9). Answer complaints within 90 days (Rule 14). | A named grievance contact on cubegullak.com and in Me. Target: 7 days. |
| Rights: see your data, correct it, erase it, name a nominee (Act, sections 11 to 14). | Me shows everything held. Each item can be changed or removed. Nominee is a person from the Family list. |
| Children: verifiable consent of the parent before any processing (Act, section 9; Rule 10). | See section 3. |
| Children: no tracking, no behavioural monitoring, no targeted advertising (Act, section 9). | See section 4. |
| A person with a disability who has a lawful guardian: the guardian's verified consent (Rule 11). | Not designed. Parked in `backlog.md`. |
| Sending data outside India is allowed unless the government restricts it (Act, section 16; Rule 15). | See section 6. |
| A "significant data fiduciary" must have a data protection officer in India, a yearly impact assessment and audit, and may be told to keep some data in India (Rule 13). | We are not one today. At crores of users we will be named one. The design must not block this (section 6). |

## 3. Parental consent for Kids and Teens

What we have: only an adult's account can make a child profile, and the owner's fingerprint approves it.

What the law needs more: the service must check that the person giving consent is an identifiable adult. A parent just
saying so is not enough. The Rules accept: details of identity and age that we already hold reliably, or details the
person gives backed by a token from an authorised body such as DigiLocker.

Today we hold nothing reliable about an adult's age: the account is a passkey, with no phone number and no document.
The age check is also parked. So this needs a decision.

**Proposed, not decided (waiting on sumeet):** when an adult adds the first child, ask once for a DigiLocker age token.
It answers one question, "is this person 18 or older", and we keep only the yes, the time and the token's reference. No
Aadhaar number, no name from the document, no picture of a card. Adults who never add a child are never asked.

Other points, chosen by Claude:

- The consent is recorded per child: who gave it, when, how the adult was verified, and which notice was heard.
- Consent covers named things: the profile, Khabri for children, lessons, reminders, guardians and their chats, the
  class. Each can be turned off in child control.
- The parent can withdraw at any time. The child's profile and its data are then erased.
- A guardian added later (a teacher, a grandparent) gets no power over consent. Only the owner has it.
- A child moving from Teens to adult at 18 gets their own account and gives their own consent. How the data moves is
  parked in `backlog.md`.
- An adult account that is really a child's (a child who signed up alone) is the gap the parked age check would close.
  Until then the notice asks the person to confirm they are 18 or older, and reports of a child on an adult account
  lead to the account being closed.

## 4. No tracking of children

The law bars tracking, behavioural monitoring and targeted advertising directed at children. The schools exemption in
the Fourth Schedule is for schools themselves, not for us. What this changes:

- **Khabri for Kids and Teens does not learn taste on the server.** The feed is set by the profile's kind, language and
  area, and by what the parent turned on. Likes stay on the phone and only reorder cards there.
- **No ads for Kids and Teens** (already decided).
- **No analytics tied to a child.** We count totals per variant and area, never per child.
- **Child control stays inside the family.** Time used each day and sleep time are counted on the phone and kept in the
  family's own storage, for the parent. This is the parent's tool, switched on by the parent, and it is named in the
  consent. We never use it for anything else.
- **A teacher can see a teen's class chat.** This is supervision by a person the parent let in, named in the consent,
  inside one class. It is not profiling. A lawyer should confirm this reading.
- **Location.** A child's profile holds the family's PIN code only. No live location.

## 5. Data we hold, why, and how long

| Data | Why | Kept |
| :--- | :--- | :--- |
| Passkey public key | To sign in | Until the account is erased |
| Name, username, picture, language, PIN code, variants | To show and speak the right things | Until changed or erased |
| Birthday (optional) | The day card in Khabri | Until removed |
| Lists of people, guardians, class membership | Messages, meetings, the class | Until removed |
| Child control settings and daily time used | The parent's control | Time used: 30 days |
| Consent records | To prove consent | 1 year after the account ends |
| Khabar likes (adults) | To order the feed | On the phone; a small copy for restore |
| Group messages and voice notes, kids' chats | To deliver them | 1 year, then erased (C) |
| Reminders, saved items, lesson place, job tracker | The apps | Until removed |
| Business card, listings, adverts | Yellow Pages, Advertise | Until removed. These are public by the person's choice |
| Payment record from Dodo | Remove ads, tax | 8 years (company and tax law, check) |
| Access logs (ids, time, action) | Security | 1 year |
| Alert address of the phone | To send alerts | Until alerts are turned off |

Not held at all: phone number for the account, OTP, email, Aadhaar number, live location, contacts from the phone, the
content of handed-off calls and messages, a face or voice print. Speech sent to a server is turned into words and not
kept.

The optional mobile number in "Reach me" is not decided and is not assumed here. If it comes, it is one more row:
shown only to people in the person's lists, erased on a tap.

## 6. Where the data sits

- Cloudflare offers no India-only storage. Its choices are regions (we choose Asia-Pacific) and legal zones for the EU
  and the US (checked 2026-11-26). So some copies may sit in Singapore or nearby.
- The law allows this today. No country has been restricted yet (check before launch).
- Risk: once we are named a significant data fiduciary, the government may order some data to stay in India. Cloudflare
  could not meet that today. The design keeps all storage behind one small layer in the code so that families can be
  moved to another store without changing the apps. This risk is accepted for now and logged in `tradeoffs.md`.

## 7. Each app

| App | Personal data it adds | Care needed |
| :--- | :--- | :--- |
| Khabri | Likes; alert address | Taste on the phone. No server taste for children. X embeds load X's own code, which can track: adults only see them after a tap, children never see X embeds. YouTube plays in its privacy mode. |
| Learn | Where the person stopped | No scores for Kids. No report of a child's progress to anyone but the parent and, for class homework, the teacher. |
| Earn | Skills, job tracker, payment tracking | Warn never to pay for a job. Kids: off for real money. Teens: no paid work. |
| Reminders | What and when, including medicines | Health details are sensitive: kept only in the family's storage, never used for ads. Family sees a senior's reminders only if the senior says yes. |
| Hobbies | Group membership | Teens' groups are moderated. |
| Meetings | Schedule, who was invited | Adults' calls leave the app; we hold no call record. |
| Messages | Kids' chats, group chats, voice notes | Parents can read a kid's chats and the kid is told so by a picture. Teacher sees the teen class chat. A report button on every chat. |
| Discussions | Posts | Public to the circle. An anonymous option hides the name from members, not from us; say so. Off for Kids. |
| Events | Saved events | A parent books for a kid. |
| Yellow Pages | A business card, by choice public | A homemaker's or worker's number is hidden by default. Listings can be copied by anyone who sees them; say so when listing. |
| Advertise | The advert, payment | Adverts are shown by area, variant and app, never by a person's history. So no consent for ad profiling is needed, because there is none. |
| Me | Everything about the person | The one place to see, change, withdraw and erase. |

## 8. Threat model

What we protect, in order: a child's safety; a family's private data; the truth of what Khabri says; people's money;
the service staying up.

Who might attack: a stranger seeking children; a scammer (fake jobs, fake buyers, fake adverts); a curious or angry
family member or ex-partner; someone holding an unlocked or stolen phone; a scraper copying listings; someone inside
(the owner's own access, a vendor); someone feeding lies into Khabri's inputs.

| Threat | What stops it | What is left |
| :--- | :--- | :--- |
| A stranger contacts a child | A kid can message only guardians. Guardians are added only by the owner with the lock. The backend checks this on every message. No search for people at all; lists grow only by scanning a code face to face. | A guardian the parent trusted wrongly. Parents can read the chats; report button. |
| A child leaves the child's profile | The owner's lock is needed. The backend refuses adult actions from a child's session whatever the screen sends. | A phone cannot tell whose finger it is. If the child's finger is saved on the phone, the child passes. The owner is told this when adding a child. |
| A fake teacher | A teacher reaches a child only after that child's parent lets them in with the lock. A class code alone gives no contact. | A real teacher who misbehaves: office hours, parent sees kid messages, report. |
| A child signs up as an adult | Notice asks for 18 or older. Reports close the account. | Open until the age check is chosen (`backlog.md`). |
| Stolen or unlocked phone | The lock is asked for child profiles, variant change, payment, consent change, erasing. Sessions end after 30 days unused. The owner can sign a phone out from another signed-in device. | Reading what is on screen. The phone's own lock is the guard. |
| A lost phone loses the account | Passkeys are backed up by Google or Apple by default. | If not backed up, the account is gone. Recovery is parked (`shell/backlog.md`). |
| One family reads another's data (a bug) | Each family has its own storage unit; code can open only the unit named in the signed session. Tests try to cross families on every route. | A bug in shared groups. Same tests there. |
| A scanned code is copied and reused | A code holds a signed pass that dies in 5 minutes and works once. Both sides must accept. | Two people tricked face to face. |
| Scams in Earn, Yellow Pages, Advertise | Verified marks for recruiters, payers and businesses. Warnings spoken on risky steps. Reports. New adverts checked before showing. No payments between people pass through us. | Scams that move to a phone call after hand-off, where we see nothing. |
| Hand-off shows a number | Not decided. If Reach me comes: shown only to people in the lists; kids never. | The other person keeps the number for good. |
| Harmful pictures or voice notes | Group and child chats only (one-to-one adult talk is not ours). Reports, removal within 24 hours, picture matching against known abuse material if a vendor is chosen. | Not yet chosen: parked in `backlog.md`. |
| Lies or hidden instructions in a post or page poison a khabar | A post is only a pointer. Facts come only from government sources and Wikipedia. The writer treats all fetched words as material, never as orders. Every khabar shows sources. A second pass checks each fact against the sources before it goes out. | A wrong fact in the source itself. A correction flow. |
| A forged payment message turns ads off | Dodo's messages are checked by their signature and then confirmed by asking Dodo. | None known. |
| Scraping of listings | Limits per phone and per area. No bulk list. | Slow copying by hand. |
| Flooding the service | Cloudflare's network, limits per session and per address, a challenge for odd traffic. | Cost of a very large attack. |
| The owner or a vendor looks at private data | Admin tools sit behind Cloudflare Access with a hardware key, show ids not content, and every look is logged. Vendor contracts carry the security terms the Rules ask for. | One person holds all the keys. Accepted while it is a one person company. |
| Secrets leak from code | Secrets live in Cloudflare's secret store, never in the repository. `.env` is never read or printed. | A leaked token until it is rotated. |
| Logs leak personal data | Logs hold ids and actions only. No names, no message text, no speech. | A mistake in new code: a check in review. |

## 9. Before launch

- A lawyer reads this file and the notice wording (waiting on sumeet).
- Decide how the parent is verified (section 3).
- Write the notice in twelve languages and record it.
- Name the grievance contact.
- Write the breach plan.
- Sign data processing terms with Cloudflare, Dodo and the speech vendor.
- Discussions and group Messages host what people post, so the intermediary rules (IT Rules, 2021: a grievance officer,
  removal timelines) also apply. Not studied here. Parked in `backlog.md`.
