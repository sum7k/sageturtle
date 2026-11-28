# Shell: the screens

Drawn at https://claude.ai/artifact/Jgem7AE3dhZSPvVkV6bqS1. The source of the drawings is in `canvas/`.

**Out of date since 2026-11-28.** The screens below and the canvas were drawn for the wordless, voice-first design
and for a Home with variant tiles and a mic. The launch build differs: screens use words in 11 languages, nothing
speaks, and Home is the ad spot plus 11 buttons (Book, Horoscope, Khabri open; eight locked). The code in the
repository (`apps/README.md`) is the truth for the launch; the canvas has not been redrawn yet.

## 1. Landing page (browser)

No words at all, because the language is not known yet. The page shows the turtle on the hill, a grid of 12 small app pictures, a speaker button, and a picture of where to tap. The picture depends on the browser:

- **Android and Chrome (also Edge, Samsung, desktop Chrome).** A large gold button with a download arrow and a hand pointing at it. A tap opens the phone's own install box.
- **iPhone Safari.** Safari has no install box. An arrow points at Safari's own three-dot button at the bottom right. Above it a strip of pictures shows the taps: three dots, share, add to home screen, then the app's icon. On iOS 26 with the default layout, share is inside the three-dot menu. On older versions and other layouts the share button is visible in the bar, so the arrow points at share and the strip starts there. Both are drawn.
- **Inside another app's browser (WhatsApp, Instagram and others).** Installing does not work there. An arrow points at that app's menu button at the top right. A strip shows: menu, open in browser, then install.

The speaker button plays one short line in the phone's language if it is one of the 12, else in Hindi and then English. Sound cannot start before a tap, so the page does not speak by itself.

## 2. Language (first open after install)

- Sees: 12 blocks, each with only the language name in its own script. The phone's language is already selected.
- Tap a block: it says its own name in that language and takes the ring. From this tap on, every screen speaks that language.
- Tick: go to Lock.

## 3. Lock

- Sees: one large gold fingerprint button with a hand pointing at it, and a small keypad button below.
- Hears: that the fingerprint or face is the key, and there is no password.
- The gold button opens the phone's own fingerprint or face box. This makes a passkey. The passkey is the account.
- The keypad button is the fallback: the phone's own PIN, for a phone with no sensor.
- No phone number, no OTP, no password.
- The lock is asked again only when the profile or variant changes, and before a payment. It is not asked on every open.

## 4. PIN code

- Sees: a house picture, six boxes, a big number pad with a gold mic key, and a round "find me" button.
- Three ways to fill it: tap the digits, press the mic and say them, or tap the find-me button to use the phone's location.
- When six digits are in, the place name shows and is spoken ("Varanasi, Uttar Pradesh"), so the person can check it.
- Tick: go to What you do.

## 5. What you do

- Sees: 9 picture blocks, each with a short name under it: Student, Looking for a job, Office job, Shop or business, Daily work, Farming, Home, Teacher, Retired.
- These are the 9 adult variants in plain words. Kids and Teens are not here.
- Tap: the block says its name and takes the ring. Tap again to remove it. A person can pick up to three. Picking one drops any that clash with it (see the design map, Kinds of person); with three picked the rest are dimmed. Tick: go to Khabar alerts.
- Opened again from Me, a change here asks for the lock.

## 6. Khabar alerts

- Sees: a ringing bell, an arrow, and a small khabar card. Below, a white cross and a larger gold tick.
- Hears: "Shall Khabri bring you khabar every day?"
- The tick opens the phone's own permission box for notifications. The cross skips it. Both go to Home.
- It has its own screen because Khabri is pushed, and a phone allows this question only after a tap.

## 7. Home

- Top left: today's date and the person's place. Top right: a round picture that opens Me (screen 10).
- First card: Khabri, with today's top khabar, a speaker button and an arrow button that opens Khabri.
- Below: one tile per app, three in a row, each with a picture and a name. The default order reads like a phone keypad, 1 to 9 and then the bottom row: Earnings, Wisdom, Meetings; Discussions, Learning, Hobbies; Messages, Reminders, Events; Directory, the mic, Adverts. Learning is at the centre and Wisdom is top centre (screen 12). An app that is off for the person is not shown. Me has no tile, because the round picture opens it.
- A person with one variant sees that variant's names. With several variants, a tile whose versions have different names carries the app's own name and two or three small dots; a second tap opens a white band under its row with one block per version (Earnings opens into Mandi and Leads). A tile with one name opens straight away.
- A long press arranges a tile. A white band shows a star (keep on top), two arrows (move earlier, move later), a crossed eye (hide) and a gold tick (done). Hidden tiles wait behind a last grey tile with a crossed eye and a count; a tap there brings one back. There are no folders.
- The gold mic button is the bottom centre cell, between Directory and Adverts, where the thumb reaches most easily. The person presses it and says what they want ("mandi price", "call the doctor"). The shell opens the right app or answers. The phone asks for the mic the first time.
- No bottom bar and no ads on Home.
- Inside an app, the date line at the top left leads back to Home, as in Khabri today.

## 8. Profiles

- Opens from the Family tile in Me. Back returns to Me.
- Sees: one row per profile (the owner and each child) with a picture and a name, a dashed "add a child" button with a plus and a person.
- A fingerprint mark on a child's row shows that the owner's fingerprint is needed.
- Tap a child's row: the owner's fingerprint is asked, then the app becomes that child's variant. Leaving the child's profile asks for the owner's fingerprint again.
- Add a child: see below.

## 9. Khabri

- Opens from the arrow on Home's Khabri card. Top: a home button, the date, the round picture for Me.
- One khabar at a time, read whole on its card: a drawn picture, the title, one line, round listen and share buttons, then the text. There are no levels to choose: the khabar starts with the easiest part and each paragraph adds detail.
- Swipe left to like (a gold heart shows), swipe right for not for me. Both bring the next khabar.
- A khabar to watch or listen has the player on top and the same khabar in text below. No ad on such a card.
- The day card (tithi, rashi, seasonal note) comes in the deck. Khabri has no gear and no You page here.

## 10. Me

- Opens from the round picture. Sees: the person's picture with a camera button, name and username, then the lists band and eight tiles, each with a picture and its present value: language, what I do, place, khabar alerts, birthday, lock, reach me, remove ads.
- A tile opens the same screen used at set-up. The Family list opens Profiles (screen 8).
- **Lists.** A white band under the name holds the person's lists: family, friends, work, trade, neighbours, class. Only the lists that fit the variant show. One list screen serves all: the person's own code and username, a gold button to scan someone's code, then requests (tick or cross) and people. Each person's row has two buttons: a handset that opens the phone's dialer, and the mark of the app that person uses (WhatsApp, Telegram or SMS) that opens their chat there. A person who has not filled Reach me has no buttons.
- **Reach me (sumeet agreed, 2026-11-28).** One mobile number, tapped or spoken like the PIN code, and three blocks to pick one app for messages: WhatsApp, Telegram or SMS. A dashed row shows how the person's own row will look to others. The cross clears it, so nobody is handed off to this person. It is optional, the number is not the account, and it is never checked by OTP. Adults fill their own. A guardian fills it for a teen in child control, with phone, SMS and WhatsApp only. Kids have none.
- **Hand-off.** One-to-one calls and messages leave CubeGullak by a plain link: `tel:` for a call, `wa.me/<number>`, `t.me/+<number>` or `sms:` for a message. WhatsApp has no link that starts a call, so a call always opens the dialer. Kids are never handed off; they keep calls and messages inside the app, with guardians only. Anything for a group (speak to the class, class chat, class call) also stays inside the app.
- **Child control.** Opens from a child's row after the owner's fingerprint. Time each day with minus and plus, sleep time, guardians who can talk to the child with a gold plus, the child's class, and a grid to turn apps on or off.
- **Remove ads.** A crossed loudspeaker, the price for 365 days and a UPI code. The fingerprint is asked before paying. Adults only.

## More states

- **Add a child (from screen 8).** A round picture with a camera button, the child's name with a gold mic to say it, and two blocks: a small figure with 6-12 and a taller figure with 13-17. The gold tick carries a fingerprint mark and asks for the owner's fingerprint, then returns to Profiles.
- **Listening (from the mic on Home).** A dark full screen. Gold bars move with the voice, the words appear as they are heard, and the large gold mic finishes. A cross at the top right stops and goes back.
- **Home with no network.** A peach card shows a cloud with a line through it and a gold try-again button. The Khabri card shows the last khabar saved on the phone, with a "saved" mark. Tiles that need the network are dimmed.
- **Home at night.** The same layout on a navy ground, with lighter navy cards, gold unchanged, dark tints and a moon with stars in place of the sun.

## 11. The class

One shared group, seen through each role. The teacher makes it; people join by scanning the class code.

- **Teacher.** A chip per class, a code button and a gold plus. The students' pictures in a grid. Office hours. At the bottom: give homework, a wide gold mic to speak to the whole class, start a class call. For kids the message goes to the parents.
- **Parent.** Opens from child control. The child and the class name, the teachers (call and message buttons that hand off, or a gold fingerprint to let a new teacher in), today's homework and dates with listen buttons, and the other parents with a gold mic.
- **Kid.** The next lesson with the teacher's picture, time and a wide gold join button; today's homework with a gold "done" tick; the guardians, the teacher among them. A kid cannot message classmates.
- **Teen.** The class name, the teachers, the classmates, homework, and a gold class chat button with an eye that shows the teacher can see it, beside a call button.

## 12. Wisdom

Four screens: the quotations, a story for farming, the same quotation for a shop, and for a kid. They are described in `apps/wisdom/docs/screens.md`.

## 13. Messages

Six screens: people and rooms for an adult, a guardian and a child, the kid, the kid talking to a guardian, the class chat for a teen, and a teacher speaking to the class. They are described in `apps/messages/docs/screens.md`.
