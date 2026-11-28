# Tradeoffs and choices: Surya site build

Each line is a choice made without asking, with the reason and what we gave up. Only the current choice is kept. Lines that need you are marked `Human:`. The full round-by-round history, with superseded choices and process notes, is in `work/tradeoffs-by-round.md`.

Format: `- [where] Choice. Why. Cost / what we gave up.`

## Stack

- [stack] Next.js on Cloudflare for the website. Python FastAPI on Fly.io for Kasoti. Why: the live site is already Next.js, and the Kasoti risk code is Python. Cost: two runtimes to deploy.
- [stack] The Model gateway, the Language module and the Kasoti chat loop run in Next.js. The Python service has no model keys. It does only pricing math, Panchang and daily rates. Why: one gateway holds all model keys and cost logs. Cost: Kasoti reads documents in TypeScript, not Python.
- [stack] `KASOTI_API_URL` and `KASOTI_API_SECRET` become `PY_SERVICE_URL` and `PY_SERVICE_SECRET`. `NEXT_PUBLIC_SUPABASE_URL` becomes `SUPABASE_URL`. New keys: `SUPABASE_ANON_KEY`, `ADMIN_EMAILS`, `IP_HASH_SALT`, `NEXT_PUBLIC_CF_BEACON_TOKEN`. Why: the service does more than Kasoti, and the browser never calls Supabase. Cost: you must give 4 more values.
- [stack] The Python service fetches gold and repo rates into a new table `kasoti_rates`. pg_cron only deletes old rows and sums usage. Why: pg_cron is poor at fetching web pages. Cost: one more scheduled job to watch.
- [stack] A deploy script loads `.env` into Cloudflare Worker secrets and Fly.io secrets. Why: Workers do not read a `.env` file at run time. Cost: a key change needs a redeploy.
- [stack] The Python service has three paths: `POST /describe`, `POST /price`, `GET /panchang`, each with the header `X-Service-Secret`. The footer's Panchang line is cached for the day. Why: v5 named no paths. Cost: none.
- [stack] The Python service gets a fourth path: `POST /transliterate`. Why: Aksharamukha is a Python library, and v6 gave the Language module (in Next.js) no way to call it. Cost: Lipi Setu and Gita Path transliteration need the Python service to be up.
- [stack] The browser never calls Supabase, also not for the admin email link. The link is asked for and completed through server routes. An admin gets a Supabase session cookie; visitors still get only four cookies. Why: v6 said "the browser never calls Supabase, except the admin email link" and also "the anon key is used only on the server". Both cannot be true. Cost: none.
- [stack] The database schema is SQL migration files, applied through the Supabase MCP. The daily job only deletes old rows. The admin Usage tab reads `usage_events` directly. Why: `.env` has no database URL, and the service key cannot create tables. Cost: the build needs Supabase MCP access.

## Build plan (round 1)

- [plan] Next.js 15.5.29, not 16. OpenNext supports it and Next 16 changes middleware. TypeScript 5.9, not 7. Why: older, proven pair for OpenNext. Cost: no Next 16 features.
- [plan] One JS package (`apps/web`) plus `services/py`. No Turborepo, no shared packages. pnpm 12, Node 24. Why: fewer parts. Cost: types shared by relative import.
- [plan] Fix: the Worker has a daily cron trigger that calls the Python `/rates/refresh`. Why: the spec says Python refreshes rates, but a sleeping Fly machine cannot wake itself. Cost: a small `scheduled` handler.
- [plan] Fix: Fly machine always on (1 GB, Mumbai). Why: no cold start in a chat turn. Cost: about USD 6 a month.
- [plan] Fix: admin login mail is made by us through SES (`generateLink` + our mail), not Supabase's mail. Why: Supabase's built-in mail is rate-limited and needs SMTP. Cost: about 40 lines. Fallback: `signInWithOtp`.
- [plan] Fix: a Worker route with no script for `khabri.broadvaleai.com/*`, because the wildcard Worker route would otherwise catch it. Why: the spec says khabri keeps working. Cost: one API call in the deploy script.
- [plan] `limits` is one key-value table for caps and all switches. `language_routes` has `write` as a fifth task row. Why: fewer tables. Cost: keys are strings.
- [plan] RLS on, zero policies, for every table. Server uses the service key after checking the admin. Why: simplest way to meet "no anonymous access". Cost: none.
- [plan] Language routes are found by a probe script that tests each language, task and provider once, not typed by hand. Why: I could not verify provider language coverage. Cost: a few cents at M9.
- [plan] Catalog of 121 apps is generated from the spec table by a script. Why: one source of truth. Cost: spec table format must stay stable.
- [plan] Kasoti formulas and constants are fixed in plan section 7.6 as first drafts. Why: spec C.3 says the plan fixes them. Cost: they need review (spec section 9).
- [plan] Listen highlights sentences; word highlight only where Google gives timing. Why: Sarvam gives no timing and the spec allows sentence marks. Cost: less polish.
- [plan] Fonts come from `@fontsource/*` npm packages copied into `public/fonts` by script. Why: no download from Google at build, same files. Cost: if a package is missing, use the Noto font of that script.
- [plan] No audio cache, no R2, no Redis, no queue in phase 1. Why: fewer services. Cost: repeated speech of the same curated text is paid each time (open question 4).
- [plan] Round 1 is a first full draft. Known weak spots: provider API details (Sarvam, Google), OpenNext custom-worker details, exact costs. They are in the open questions of p1.

## Site

- [site] Rebuild Portfolio, Team, Careers and Blog (with its posts) from the live HTML, at the same URLs. Reuse the old repo only if it is already in the folder. Why: the build must not wait for the old code. Cost: small differences from the old pages are possible.
- [site] `www.broadvaleai.com` redirects to the apex. A duplicate pre-registration gets no second email. Every public form uses a honeypot and Turnstile. Why: v5 did not say. Cost: none.
- [site] `kasoti.broadvaleai.com` and `shiksha.broadvaleai.com` redirect to `/kasoti` and `/shiksha`. Why: you said apps on Surya live on subdomains. The paths stay the real address. Cost: none.
- [site] Small basics added: page title, description and share image, `sitemap.xml`, `robots.txt`, a calm "This page is not here." page, a "Skip to content" link. Why: a public site needs them and they are cheap. Cost: none.
- [site] "WCAG AA, checked in the build" is now only "WCAG AA". Why: an automated check is a test, and you said no tests. Cost: nobody verifies contrast automatically.

## Home page

- [home] Business half = Day theme, People half = Night theme, with the sun on the line between them. People half has no button. Why: the split shows both themes at once.

## Design

- [design] Phase 1 shows symbols, not drawn deity figures: a sun for Surya, a flute and feather for Kasoti, a veena and lotus for Shiksha. Why: this is respectful and easy to keep minimal. Cost: less visual richness.
- [design] Night theme is set by `html[data-theme="noir"]`, not by the dark mode of the device. Cookie `bv_preview` holds `v1` (Day) or `v2` (Night). Why: the live site does this, and the v3 rule did not fit the clock rule. Cost: the site ignores the device's dark mode. This changes the v3 line.
- [design] One main button per screen. No pop-ups or carousels. The footer shows today's tithi and sunrise for New Delhi. Why: calm and auspicious. Cost: visitors in other cities see the Delhi sunrise.
- [design] Day corners 8 px, touch targets 44 px, focus ring 2 px `canal`. The footer tithi line links to Panchang Gyan. Cost: none.
- [design] The theme clock uses IST. The toggle holds until the next 06:00 or 19:00. Why: v5 did not say which clock, and a toggle that lasts forever would end the clock rule. Cost: a visitor abroad gets Day and Night by Indian time.
- [design] Night main button: no fill, a 1 px `foreground` line and text. Day main button: `banyan` fill, `on-banyan` text. Why: Night `banyan` is 1.05:1 on the Night background. Cost: Night buttons look lighter.
- [design] Surya's symbol draws its lines in `foreground` in Day, with a `mustard` disc. Why: Day `mustard` is only 1.5:1 on the Day background. Cost: the Day sun is less golden.
- [design] On home, the sun, "Surya" and its line sit on the seam. Each is drawn twice and clipped at the seam, so each half shows its own theme's colours. On a phone they sit just above the seam. Why: one colour cannot read on both halves. Cost: a little more CSS.
- [design] Allowed motion is a closed list: 600 ms fades, a 600 ms theme cross-fade, the sun rise (1.2 s, first visit), the half widen (400 ms, desktop hover), the diya flame. Why: v5 asked for the sun rise and the widen but said "fades only". Cost: none.
- [design] One site-wide language menu in the nav holds the 23 languages and the Large text switch (root size 125%), kept in cookie `bv_lang`. A first visit uses the browser's language if it is listed. `Shell` no longer has a language switch. Why: v5 placed the switch in two places and left it out of the nav list. Cost: none.
- [design] Headings use Anek in each script where it exists. Body uses Mukta (Latin, Devanagari) or Noto Sans of the script. Kashmiri and Sindhi use Noto Naskh Arabic. Urdu uses Noto Nastaliq Urdu. Why: Anek and Mukta come from one foundry, so headings match across scripts. Cost: up to 2 extra font files for each language outside Latin and Devanagari.
- [design] Line height: Latin 1.5, Indic 1.7, Perso-Arabic 2.0. Manipuri is shown in Meetei Mayek, Santali in Ol Chiki. Why: Indic marks above and below need room, and these are the official scripts. Cost: a Manipuri reader used to the Bengali script must switch.
- [design] Digits are 0–9 everywhere. Native digits appear only in Ginti. Why: most Indian apps use 0–9. Cost: less local feel.
- [design] Only four cookies: `bv_preview`, `bv_lang`, `bv_seen`, `bv_sid`. None track. Why: no consent banner is needed. Cost: none.
- [design] Symbol geometry is fixed in Appendix E.1 (48 × 48 grid, 1.5 stroke, sizes 96, 64 and 24 px). Why: the build can draw them without guessing. Cost: hand-drawn SVG may look plain until a designer redraws it.
- [design] On a phone the nav shows the 24 px sun on the left, and there is no hamburger menu. The footer line also names the day's festival. Emoji joins the "never" list. Each symbol has an accessible name that says whose it is (for example "Saraswati Mata's veena and lotus"). Why: Kasoti and Shiksha must stay visible at the top right on a phone. The festival name fits the auspicious tone. Cost: the phone nav is tight at 320 px width.

## Login

- [auth] No customer login in phase 1. Kasoti and Shiksha are anonymous. Only a founder admin page uses Supabase Auth. Why: fewer moving parts. Cost: no saved history across devices. Quotes are saved in the browser and can be shared by link.

## Security

- [security] All writes go through server routes. The browser has no Supabase key. Pre-registration form uses Cloudflare Turnstile and a honeypot field. Cost: slightly more server code.
- [security] A visitor's first paid call of the day must pass an invisible Turnstile check. New table `visitor_days` keeps the pass and the day's spend for each `bv_sid`. Why: without it a script can drop the cookie and use up the ₹3,000 day cap, and then real users see "Resting for today". Cost: one more table. A visitor whose browser blocks Turnstile cannot use the paid features.

## Privacy

- [privacy] Photos and uploaded files are never stored. Shared quotes and admin pages are `noindex`. Why: children's photos and personal papers. Cost: a user must upload a paper again to re-price.
- [privacy] An IP address is kept only as a salted hash, for 1 day, to count new Kasoti sessions. "Notify me" emails and reports are kept 1 year. Pre-registrations and the admin log are not deleted automatically. Why: v5 gave no retention for these. Cost: a "Notify me" email may be deleted before its app opens.
- [privacy] PII masking applies to typed and transcribed text. A file or photo goes to a model once, as it is, and is never stored. What the model reads from it is masked before storage. Why: an image cannot be masked before a model reads it. Cost: a PAN on an uploaded paper reaches the model provider.
- [privacy] `content_cache` holds only outputs for fixed inputs (chips, curated text). Text, voice and photos from a user are never stored, and their translations are not stored either. Why: v6 said "Shiksha stores no child's data" but cached translated user text. Cost: the same pasted text is translated again and costs again.
- [privacy] Fonts are Google Fonts files served from our own domain. The only third-party scripts are Cloudflare Web Analytics and Turnstile. Why: no visitor data goes to Google, and no consent banner is needed. Cost: the font files are part of our deploy.

## Legal

- [legal] The legal pages go live as the build writes them. A lawyer reads them later. Why: nothing waits for a human. Cost: legal risk until the lawyer reads them. Human: have a lawyer read `/privacy` and `/terms`, and confirm that the DPDP child rule does not apply.
- [legal] `/privacy` gives `namaste@broadvaleai.com` for data questions. Why: the DPDP Act asks for a contact. Cost: someone must read that mailbox.

## Safety

- [safety] Help line numbers are back: Tele-MANAS 14416 and Childline 1098 in the Shiksha footer and in replies to distress, and 1930 in Cyber Suraksha. Kasoti shows only the "not advice" line, which Dhan Gyan also shows. Why: students and children use the site, and it costs about 250 bytes. Cost: numbers can change. Human: confirm the three numbers are current (section 9).

## Models

- [llm] Claude is the default model. Gemini is the fallback. Why: quality of tool use. Cost: price.

## Languages

- [language] New `write` quality per language. Where it is "fair", the model answers in English and the answer is machine translated. It starts at "fair" for Bodo, Dogri, Santali, Kashmiri, Sindhi, Manipuri, Konkani and Maithili. Why: models write weakly in these languages, and nobody reads the output before launch. Cost: answers in these 8 languages read like a translation, cost one more paid call, and do not stream.
- [language] Transliteration starts at "none" for Kashmiri, Sindhi and Urdu. Where it is "none", an app name is shown in Latin and Lipi Setu hides that target. Why: Aksharamukha loses information when it writes Perso-Arabic scripts. Cost: readers of these three languages see Latin app names.

## Speech

- [speech] Sarvam first for Indian speech and translation, Google second. Six languages start with no voice. Why: Sarvam is strongest on Indian languages. Cost: two vendors.

## Cost caps

- [cost] Caps: ₹25 for each Kasoti session, ₹10 for each Shiksha visitor per day, ₹3,000 for each product per day, with a kill switch. Why: no revenue yet. Cost: a long Kasoti session may stop early.

## Data

- [data] New tables `shiksha_content` (curated text for Shiksha) and `admin_log` (who changed what). Why: v3 used both ideas but named no table. Cost: none.

## Admin

- [admin] "Reports" becomes "Review": user reports, drafts to approve, and review marks to clear. New table `review_marks`, seeded with one row per Kasoti module and one for Gita Path. `describe()` no longer returns `review`. Why: v5 had no way to clear "Beta" or "Text check pending". Cost: none.
- [admin] The first admins come from `ADMIN_EMAILS` in `.env`. Why: someone must be able to log in on day one. Cost: none.

## Sources

- [sources] Gita verses come from the `gita/gita` dataset on GitHub (The Unlicense, 701 verses). The English meaning comes from Annie Besant's translation (1895) on English Wikisource. Why: both are free to use in India and the USA. I checked that the verse numbers match: chapter 13 has 35 verses in both. Cost: Besant's English is old in style ("thee", "thou"). Gita Press prints count 700 verses, so the Sanskrit reader will find one more verse (13.1) than in the print.
- [sources] Hitopadesha text comes from Sanskrit Wikisource. The fallback and check print is Max Müller's 1864 edition on archive.org. Sanskrit Pravesh takes 20 two-line verses from the first page. They show "Text check pending" until a Sanskrit reader checks them. Why: the text is ancient and the page is open. Cost: a wiki page can have typing mistakes until someone checks.
- [sources] Mahakavya Katha (LATER) will use Romesh C. Dutt's condensed verse of both epics (1899). Each chapter shows a model summary, marked as a draft. Why: an Indian author, public domain everywhere, already cut into short sections. Cost: Dutt writes in old English verse, so the summary must carry the meaning.
- [sources] Festival dates come from the Government of India yearly holiday lists (DoPT). The second source is the Rashtriya Panchang. Panchang Gyan never computes a festival date. Why: festival rules have many exceptions, and the list is official. Cost: someone must add the next year each December. A regional festival that is not in the list is missing.
- [sources] Samvidhan Saar imports article numbers, titles and text from the official English PDF on legislative.gov.in. A summary is drafted when an article is first opened. Why: it is the official text, and drafting on first use is cheap. Cost: the first visitor to an article waits for the draft.
- [sources] I checked the source URLs. The GitHub, Wikisource and archive.org pages were fetched and read. Gutenberg, sacred-texts.com, DoPT, the Positional Astronomy Centre and the Legislative Department were confirmed by web search only, because they block automated reading or returned an error. Cost: the build may meet the same blocks. Then it uses the fallback in Appendix F.1.

## Kasoti

- [kasoti] Data older than 7 days shows a warning.
- [kasoti] Do not store web search snippets. Store the URL, title, date and our own one-line summary. Why: no need to check the Brave licence. Cost: a saved quote shows less of the source text.
- [kasoti] Keep the ₹25 session cap. At 80% of it Kasoti stops research and gives the answer, with lower confidence. Why: the user always gets an answer and the cost stays bounded. Cost: an Expert answer may have less research.
- [kasoti] "Beta" is per module. An actuary reviews term life, motor, health and home. A finance advisor reviews gold, used vehicle and the two loans. No person is named. Why: one reviewed module should not wait for the rest. Human: name the two reviewers.
- [kasoti] Amounts are shown in Indian style (₹12,50,000, lakh, crore). Why: Indian users read it faster. Cost: none.
- [kasoti] A module has at most 4 required inputs, so a chat fits in 8 questions. Other inputs use defaults, shown in the assumptions. Cost: less precise prices.
- [kasoti] If two modules fit, Kasoti asks one chip question, prices one and offers the other after. Side-by-side compare stays LATER.
- [kasoti] After a file is read, Kasoti shows what it read and asks "Right?". Why: a wrong number from a photo ruins the price. Cost: one more tap.
- [kasoti] Limits: 6 messages a minute per session, 20 new sessions a day per IP, up to 3 files (PDF 10 MB and 5 pages, photo 8 MB). "Save as PDF" is the browser print dialog. Cost: a school or office behind one IP may hit the daily session limit.
- [kasoti] Crop, startup share and cyber use the analogue method in phase 1. Modules 9–11 are designed as LATER. Why: the first 8 modules get reviewed before more risk math is added. Cost: answers for these three are always "Low" confidence.
- [kasoti] `price()` returns a `unit` (₹, ₹ a year, or % a year). `range` is the 10th to 90th percentile. `risk_score` is 0–100 in five bands of 20. Why: a loan needs a rate, and the risk bar needs fixed steps. Cost: the bands are crude.
- [kasoti] At 100% of the ₹25 session cap the chat closes: "This chat is full. Please start a new one." Why: v5 did not say. Cost: a long chat must restart.
- [kasoti] A sent message can be edited. The edit replaces the message and its answer. Why: a speech transcript can be wrong. Cost: an edit costs another model call.
- [kasoti] `describe` now also lists `research` figures: the market figures a module needs from the web, each with a low, a high and a default. The model reads each figure from a public page and passes it with its source. Python uses the default for a figure that is missing or out of range. Why: modules 3 to 6 need web rates, but `price` had no input for them. Cost: a wrong figure that is inside the range can still move the price.
- [kasoti] The page draws the price line, the risk bar and the confidence word from the `price` result. `price` also returns `risk_band` and `extras` (EMI, premium split and so on). The model may write only numbers from `price`, from the user, or quoted from a source. Why: the rule "the LLM never sets the number" is now enforced by code. Cost: the first line of every answer has a fixed shape.
- [kasoti] New tool `ask` shows one question card and waits. The calculator tool is dropped. Tools are now `ask`, `describe`, `price`, `search`, `fetch`, `read_file`. The fast model tier asks. The strong tier researches, calls `price` and writes. Why: all arithmetic stays in Python, and v6 did not say how the model shows a card. Cost: Kasoti cannot do a free sum for the user.
- [kasoti] Math frame: 10,000 Monte Carlo draws with a fixed seed. The fair price is the median. The range is the 10th to 90th percentile. `risk_score` is one loss measure per module (Appendix C.3), read at the caution percentile. The build plan fixes formulas and constants. Why: v6 did not say what risk each module measures. Cost: the 8 loss measures are my choice, and the reviewers may change them. The two loan measures use fixed scales (40% of income, or 10% of turnover, gives 60).
- [kasoti] `price` alone sets `confidence`. It drops one level for a daily rate older than 7 days, for a "Not sure" on a required input, and for two or more research gaps. A research gap is a research figure that is missing or out of range. Why: the page draws confidence from the `price` result, so the chat loop must not change it. Cost: a failed source lowers confidence only when it leaves a figure missing.
- [kasoti] `analogue` is now a Python module. The model finds 3 to 10 comparable prices. Python returns the median, the range and a risk score. It has no review mark and shows "Estimate, no model". A house or land price also goes to `analogue`. Why: v6 said the LLM never sets the number, but the analogue method let it do so. Cost: with fewer than 3 comparable prices Kasoti gives no number.
- [kasoti] Kasoti also gives the help line (Tele-MANAS 14416, Childline 1098) when a user shows distress. Why: a person who asks about a loan may be under debt stress. Cost: none.
- [kasoti] The question order moved from Appendix C.2 into the Kasoti base prompt (G.2). At most 8 cards, the tone card included. If the tone card is not answered, Kasoti uses Detailed and Balanced. The "Right?" check after a file does not count. Why: one place for each rule, and v6 could reach 8 cards before the tone card. Cost: none.
- [kasoti] Kasoti replies in the language of the user's last message, which the Language module detects. The first opening chip is now "Is my term insurance quote fair?". Module 6 is renamed "Home insurance". Admin can switch off a single module. Why: no module works out a cover amount or a house price, and v6 did not say how the reply language is found. Cost: none.
- [kasoti] A shared quote shows the card answers, not only bands. Why: gold and used vehicle take typed numbers, such as weight and asking price. Cost: the receiver sees those numbers.
- [kasoti] The LLM never sets the final price. Python modules compute it. Why: a model can invent a number. Cost: Kasoti cannot price what no module covers, except by the analogue method.
- [kasoti] Caution (Careful, Balanced, Relaxed) sets the risk percentile (90, 75, 50). Why: it gives the tone choice a clear meaning. Cost: the rule is crude. The reviewer may change it.

## Shiksha

- [shiksha] 22 scheduled languages plus English. Translations are cached the first time someone asks for them.
- [shiksha] The model never writes Gita verses. The verses are curated and a person checks them. Panchang is calculated with the Skyfield library. Human: name a person to check the verses.
- [shiksha] No personal data from children. Exam apps make new practice questions. They do not copy real past papers.
- [shiksha] Gita Path is switched on before a person checks the verses. It shows "Text check pending". Why: nothing waits for a human. Cost: an unchecked verse may be shown for some time. Human: name a Sanskrit reader.
- [shiksha] The six weak voice languages (Bodo, Dogri, Santali, Kashmiri, Sindhi, Manipuri) keep the mic hidden until a person checks 10 sentences and sets the quality in admin. Why: a hidden mic is safer than bad voice. Cost: voice for these languages stays off until someone checks.
- [shiksha] The sign language app will embed the official ISLRTC videos with the YouTube player. The Braille app uses the public Bharati Braille table. Both are LATER. Why: official sources are safer than our own. Cost: we depend on those videos staying online.
- [shiksha] Admin can switch off any single Shiksha app. Why: a fast stop for a bad app. Cost: small extra work.
- [shiksha] Every NOW app has an input, an output and a screen (Appendix B.2). Screens use only 14 shared components (B.1). Why: the build can start from the table. Cost: a new app idea may need a new component.
- [shiksha] `content` apps use public-domain or official text only. The model drafts only meanings, summaries, number names and picture words, marked "Draft, review pending" until an admin approves. Why: no copyright risk, nothing waits for a human. Cost: Samvidhan Saar summaries show a "Draft" mark for some time.
- [shiksha] Varnamala Gaana speaks each letter and word with text to speech in phase 1. It does not sing, and its purpose line says "spoken". Why: speech cannot sing well. Cost: no singing until it is built. The 60 line drawings are made by the build agent and may look plain.
- [shiksha] Translation, like voice, can be "none" per language and per task. The feature is hidden with "This is coming for your language." Cost: some languages lose translation until checked.
- [shiksha] Sanskrit speech uses the Hindi voice. Cost: Sanskrit sounds imperfect.
- [shiksha] Panchang cities are a fixed list of 100. Cost: a small town must pick a near city.
- [shiksha] Akshar Abhyas checks only how much of the letter is covered (70% covered, under 30% outside). It does not check stroke order. Cost: a wrong stroke order passes.
- [shiksha] Photo apps (Ganit Guru, Prakriti Parichay, Uttar Jaanch) are cut to 1,280 px in the browser, read by model vision and never stored. Uttar Jaanch marks are labelled "an estimate". Prakriti Parichay shows two guesses and a "do not touch or eat" warning. Why: a wrong plant or animal name can be unsafe. Cost: a user must upload again to re-check.
- [shiksha] An `llm` app with chip-only input may be cached by hash (Itihas Yatra, Dhan Gyan topic chips). Why: lower cost. Cost: the same chips give the same text.
- [shiksha] All 121 apps are named and phase 1 builds 30. The last 11 named, all LATER: Kram Khel, Sthan Maan, Prayogshala, Matdan Gyan, Mahakavya Katha, Chhatravritti Abhyas, Dwibhashi Path, Poshan Mitra, Dastavez Saathi, Pashu Palan, Vaani Patal. Why: one for each category that had a gap. Cost: other ideas (riddles, dance, music instruments) got no slot.
- [shiksha] Bol Likh, Anuvad Setu and Shravan Saathi are now `rule`, not `llm`. A `rule` app may call the Language module (speech, translation, script). Why: they have no task prompt, and translation must follow the Sarvam, Google, model order. Cost: none.
- [shiksha] Matdan Gyan (elections) is `content`, not `llm`. Why: it is close to politics, and curated text keeps the model away from parties. Cost: the text must be written and checked.
- [shiksha] Mahakavya Katha uses a public-domain retelling of the Ramayana and Mahabharata. Why: copyright, and the model never writes sacred text. Cost: old retellings use old English, so the simple version is a draft until reviewed.
- [shiksha] One shared base prompt for all Shiksha `llm` apps, plus one task prompt per app. Kasoti has its own base prompt. Why: the safety rules live in one place. Cost: a rule meant for one app reaches all of them.
- [shiksha] Phase 2 order: the LATER apps with the most "Notify me" requests first. Ties go to the app that needs no new component. Why: real demand decides. Cost: a useful app with few requests may wait.
- [shiksha] A "Continue" row on `/shiksha` shows up to 4 recent apps, from the browser. Why: a returning user finds the app at once. Cost: none on the server.
- [shiksha] App names are not translated. The build writes each in Latin and Devanagari. Aksharamukha writes the other scripts. Why: a name is a name, and Devanagari converts well to other Indic scripts. Cost: a Tamil reader sees a Hindi-style name.
- [shiksha] The picture set is 60 named things in 6 groups (20 animals, 13 plants and food, 7 sky and land, 4 body, 10 home, 6 play and travel). No people, no deities. Why: one neutral set serves every script, and three later apps can use it. Cost: in some scripts a few letters have no matching picture. They show a word only.
- [shiksha] Any curated text that does not come from a source in Appendix F.1 is a draft with the mark "Draft, review pending". This includes lists written by the build: number names, the 100 Sanskrit words, the 32 history events, the 8 Vedic Ganit methods. The 8 methods are now named. The history events follow the NCERT syllabus. Why: v6 did not say who writes these lists. Cost: more screens show the draft mark at launch.
- [shiksha] The build writes each task prompt from the app's row in Appendix B.2. One email to the "Notify me" list when an app opens is LATER. Component `Shell` is renamed `AppFrame`. Why: v6 left the first two open, and "Shell" was easy to confuse with the product shell. Cost: task prompts are not reviewed before launch. They are on the human review list.

## Surya

- [surya] MCP server is LATER. In phase 1, Surya exists only as internal modules (model gateway, language, usage log).
- [surya] Training, when it is built, runs on AWS or GCP GPU. No new outside provider. Why: both are already backends. Cost: it may cost more than a GPU specialist.
- [surya] Usage INR = provider cost × a fixed USD-to-INR rate in config. Why: internal billing needs no live currency feed. Cost: the INR figures drift from the real rate.
- [surya] Phase 1 uses Supabase, Cloudflare, Fly.io, AWS (email) and GCP (fallback model, translation, speech). Azure is LATER. It stays in the Surya vision as a backend for speech and GPU. Why: phase 1 has no need for it, and `.env` has no Azure key. Cost: one of the six backends you named is not used yet.

## Tests

- [tests] No tests, as you asked.

## SDLC and plan (apps)

- [plan] The unrolled plan is one file, `work/sdlc-plan.md`. Why: `work/plan/` holds the old site build plan, and this name ties the file to `docs/sdlc.md`. Cost: two things called "plan" sit in `work/`.
- [sdlc] Each step has a fixed output: `apps/<app>/idea.md`, `docs/screens.md`, `docs/data-flows.md`, a pull request, a preview link. Why: a step is done only when its file exists. Cost: Khabri, Me and the ten apps need folders they do not have yet.
- [sdlc] Before Terraform exists, the phone preview is a plain Wrangler deploy of the phone-only build. Why: step 5 comes before step 8, and Vercel is dropped. Cost: one small Cloudflare setup is made by hand first and moved under Terraform later.
- [plan] The order of the nine apps after Messages is left open. Why: no basis to choose yet. Cost: one more decision after Messages.

