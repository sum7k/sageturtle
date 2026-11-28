# SDLC plan: the unrolled items

As of 2026-11-28. Every step of `docs/sdlc.md`, for every app, with its real status. Update the status here when an
item moves. Parked work is not copied here; each line points to its backlog.

Status: ✅ done · 🟡 partly done · ⏳ waiting on sumeet · ⬜ not started · 🚫 blocked

## Next, in order

1. ⏳ sumeet: deploy the BodhiLabs launch build and set up Cloudflare Access for `/admin` (steps in the repository's `apps/README.md`). The build is on `dev`: 11 buttons, tap counts, admin panel, words in 11 languages (2026-11-28).
2. ✅ Reach me is agreed (sumeet, 2026-11-28). Its code is on the `dev` branch.
3. 🟡 Cloudflare: the Wrangler config, the Worker and the D1 database `bodhilabs` exist; nothing is deployed yet.
4. ⬜ Close the shell's screen gaps (listed in `apps/docs/context/open.md`).
5. ⏳ sumeet: react to the six Messages screens, and find five people for the Messages test (`apps/messages/docs/case.md`). Then Messages steps 4 and 5.
6. ⬜ The other nine apps, steps 1 to 5, one at a time. Their order is not decided, except that Wisdom is built last.
7. ⬜ Part B, when all thirteen apps have reached step 3.
8. ⏳ sumeet: talk through Wisdom (`apps/wisdom/backlog.md`). This does not block the items above.

## A. Per app

| App | 1 Idea | 2 Screens | 3 Data and flows | 4 Build | 5 Preview |
| :--- | :-: | :-: | :-: | :-: | :-: |
| Shell and Me | 🟡 | 🟡 | ⬜ | 🟡 | 🚫 |
| Khabri | 🟡 | 🟡 | ⬜ | 🟡 | 🚫 |
| Messages | ✅ | 🟡 | 🟡 | ⬜ | ⬜ |
| Learning | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| Earnings | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| Reminders | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| Hobbies | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| Meetings | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| Discussions | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| Events | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| Directory | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| Adverts | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| Wisdom (built last) | 🟡 | 🟡 | ⬜ | ⬜ | ⬜ |

Step 1 now includes a one-page product case (`docs/case.md`, added 2026-11-28). It is written for Messages only. Shell and
Me, Khabri and Wisdom still need theirs.

### Shell and Me

1. 🟡 Idea: `apps/shell/idea.md`. The product case is not written. Me has no `idea.md` of its own; it is described in `apps/idea.md`.
2. 🟡 Screens: 30 screens are drawn on the canvas and written in `apps/shell/docs/screens.md`. sumeet has not approved
   them as a whole. Gaps are in `apps/docs/context/open.md`. Parked: `apps/shell/backlog.md`.
3. ⬜ Data and flows: not written. The stopped HLD draft has guesses only.
4. 🟡 Build: the launch build is on `dev` (31 tests): registration, Home with 11 buttons, tap counts, the form, the admin
   panel, Me. What is not built is listed in `open.md`.
5. 🚫 Preview: there is no working preview link. Needs item 3 of "Next".

### Khabri

1. 🟡 Idea: in `apps/idea.md` and `decisions.md`. It has no folder of its own yet.
2. 🟡 Screens: four screens are drawn (card, swipe, watch, day card). Not approved as a whole.
3. ⬜ Data and flows: not written. The pipeline is not designed.
4. 🟡 Build: the deck is on `dev`, with four hand-written khabars in English. No pipeline, no translation, no alerts.
5. 🚫 Preview: same as the shell.

Parked for Khabri, in `apps/backlog.md`: the X developer account, the four levels in the old Khabri repository,
PB-SHABD, the wire agency licence.

### Messages

1. ✅ Idea: `apps/messages/idea.md` covers all 11 variants, and the product case is `apps/messages/docs/case.md` (2026-11-28). Its test with 5 people is not run.
2. 🟡 Screens: six are drawn on the canvas (row 13) and written in `apps/messages/docs/screens.md`. Not approved.
3. 🟡 Data and flows: `apps/messages/docs/data-flows.md`. Four points are not settled and are listed at its end.
4. ⬜ Build. Until the backend, only hand-off is real; the in-app chats are a demo on one phone.
5. ⬜ Preview.

Parked: `apps/messages/backlog.md`. Choices: `apps/messages/tradeoffs.md`.

### The nine other apps

For each of Learning, Earnings, Reminders, Hobbies, Meetings, Discussions, Events, Directory, Adverts:

1. 🟡 Idea: the design map says what the app does for each variant. Still to do: make `apps/<app>/` and write its `idea.md` and its product case.
2. ⬜ Screens.
3. ⬜ Data and flows.
4. ⬜ Build. Home already shows the app's tile (pull request 2); the tile opens nothing.
5. ⬜ Preview.

### Wisdom

The top centre tile on Home, and the last app to be built (sumeet, 2026-11-26).

1. 🟡 Idea: `apps/wisdom/idea.md` covers all 11 variants. sumeet has not talked it through yet. Open points:
   `apps/wisdom/backlog.md`.
2. 🟡 Screens: four are drawn on the canvas (the quotations, a story for farming, for a shop, for a kid) and written in
   `apps/wisdom/docs/screens.md`. Placeholder text only. Not approved.
3. ⬜ Data and flows.
4. ⬜ Build: after every other app. Home shows its tile only in the drawing.
5. ⬜ Preview.

## B. Platform

| # | Step | Status | Note |
| :- | :--- | :-: | :--- |
| 6 | Requirements and privacy | 🚫 | Parked until all apps reach step 3 (`apps/backlog.md`). A stopped draft is in `apps/work/platform-docs-draft/`; it is not agreed |
| 7 | HLD | 🚫 | Same. The draft is `apps/work/platform-docs-draft/hld.md` |
| 8 | Terraform on Cloudflare | ⬜ | After step 7 |
| 9 | Backend wiring, one pull request per app (13) | ⬜ | After step 8 |
| 10 | Staging with a few real users | ⬜ | Parked items that must be settled before real users: the age check (`apps/backlog.md`), getting an account back (`apps/shell/backlog.md`) |
| 11 | Launch | ⬜ | |
