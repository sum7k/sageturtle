# BodhiLabs SDLC

Agreed with sumeet on 2026-11-26. This is how every app goes from idea to launch. The unrolled list of items, with
their status, is in `work/sdlc-plan.md`.

## A. For each app, repeated

The apps are the shell with Me, Khabri, the ten others, and Wisdom, which is built last.

| # | Step | What | Output | Done when |
| :- | :--- | :--- | :--- | :--- |
| 1 | Idea | What the app does for each variant, and a one-page product case | `apps/<app>/idea.md`, `apps/<app>/docs/case.md` | It covers all 11 variants, and the case names one number and one riskiest assumption |
| 2 | Screens | A clickable mock | Screens on the canvas, and `apps/<app>/docs/screens.md` | sumeet approves it |
| 3 | Data and flows | What it stores, who sees it, what it calls | `apps/<app>/docs/data-flows.md` | Nothing in it is a guess |
| 4 | Build | Code with tests | A pull request in `sum7k/sageturtle` | Tests pass and it is merged |
| 5 | Preview | sumeet tries it on a phone | A preview link | sumeet says it is fine |

Until step 9, a built app keeps its data on the phone only.

### The product case (added by sumeet, 2026-11-28)

One page per app, kept short. It has six parts:

1. The problem, in the person's own terms.
2. The job to be done, one line for each variant.
3. What the app is not for.
4. One number that shows it works, and the guardrails that must not get worse.
5. The riskiest assumption.
6. A test with 5 real people on the clickable screens of step 2, with a pass mark and what we do if it fails.

The test is run after step 2 and before step 4. An app is not built until its test is run, or sumeet waives it.

## B. Once, for the whole platform

This part starts when every app has reached step 3.

| # | Step | What | Output |
| :- | :--- | :--- | :--- |
| 6 | Requirements and privacy | Targets for scale, speed, offline use, languages and cost. The DPDP law, parental consent and a threat model | `apps/docs/requirements.md`, `apps/docs/privacy.md` |
| 7 | HLD | The Cloudflare design, the data model, the flows and Khabri's pipeline | `apps/docs/hld.md` |
| 8 | Terraform on Cloudflare | Terraform makes what lasts: domain and DNS, databases, buckets, queues, secrets, access rules. Its state sits in a Cloudflare bucket. Wrangler deploys the app code on each change | Terraform code in the repository |
| 9 | Backend wiring | Each app moves from phone-only data to the backend | One pull request per app |
| 10 | Staging | A few real users try the whole thing | A list of fixes, all closed |
| 11 | Launch | Open to everyone | The live app |

## C. After launch

Each change runs steps 1 to 5 again and ships on its own.

## Rules

- An app does not skip a step. Steps 4 and 5 do not wait for part B.
- Before step 8 exists, the preview in step 5 is a plain Wrangler deploy of the phone-only build.
- Parked work goes to the nearest `backlog.md`. Choices go to the nearest `tradeoffs.md`.
- Standing rules hold at every step: nothing that cannot scale easily to 100 crore users, Cloudflare only, and no
  written text on the screens.
