# Brief for each prompt iteration

Note (2026-11-26): the seven rounds are done. The final prompt, v7, now lives at `docs/spec.md`. Rounds v0 to v6 are kept here as history.

We are improving a product prompt in 7 rounds. The final prompt (v7) will be turned into a build plan and then built by a coding agent. Each round is done by a different model and effort level.

## Inputs (read all of them)

- `work/prompt/v0.md` — the user's original words. Never drop anything the user asked for.
- `work/prompt/v{N-1}.md` — the previous round. Your starting point.
- `docs/existing-site.md` — the live broadvaleai.com today: its two themes (Day and Night "noir"), fonts, pages. "The existing two themes" in v0 means these two.
- `idea.md` — the founder's earlier notes on Surya (an AI-first PaaS). Use what fits.

## Your output

Write `work/prompt/v{N}.md`. Do not edit other files.

## What each round must do

1. **Answer the open questions.** Take every item in the "Open questions" section of v{N-1}. Decide each one yourself. Do not ask the user. Record each answer in a "Decisions log" section: one line, the decision, and a short reason. Keep earlier decisions unless you have a strong reason; if you change one, say so. Fold the decisions into the main text too.
2. **More beautiful and minimalist.** Tighter structure. Fewer words per idea. No repetition. Also push the visual design of the site toward calm, minimal, auspicious.
3. **More functionality.** Add useful features and detail that fit the vision. Each addition must earn its place. Mark clearly what is built NOW (phase 1) and what is LATER.
4. **Shiksha's 121 apps.** Expand the list each round. By v7 all 121 must have a name and a one-line purpose, grouped into categories. Put the list in an appendix table.
5. **New open questions.** End with an "Open questions" section: at most 10, the most important unknowns for the next round. In v7, leave this list empty or only with items that truly need the human.

## Fixed constraints (from the user — never change)

- Domain broadvaleai.com. Three products: Surya, Kasoti, Shiksha.
- Surya = "AWS of India", AI-native, used only by API or MCP. Not public yet. Billing is internal. Backends: Supabase, Cloudflare, AWS, GCP, Azure, Fly.io; the platform decides what runs where. Apps on Surya live on *.broadvaleai.com subdomains.
- Home page = Surya landing, split vertically: Business half and People half, using the two existing themes. People side says "Coming soon". Business side leads to signup; for now signup says "Coming soon, please pre-register" and saves the email in a Supabase table.
- Top-right nav: Kasoti, then Shiksha.
- Kasoti = risk pricing engine. Python modules exposed as a library. Sleek LLM-style chat with a push-to-talk button. Asks easy questions (needs, capacity, tone, reason), uses tool calls + web research + deep analysis, outputs plain-language price and risk, depth matched to the user.
- Shiksha = 121 small education apps, every Indian language, translated or transcribed on demand.
- Symbols: Surya = the Sun, Kasoti = Krishna, Shiksha = Saraswati Mata. Religious, auspicious tone across the site. Respectful, never kitsch.
- No tests. One `.env` file with production keys. The user gives logins, MCP access and API keys.

## Tradeoffs file

The human will review everything only after it is built. So never wait on a human. Make an obvious assumption and pick a choice. Append every new choice from your round to `tradeoffs.md` at the repo root. Use the format given at the top of that file, under a heading for your round. If you change an earlier choice, add a new line that says so. Do not rewrite the old line. You may edit `tradeoffs.md` in addition to your output file.

## Writing style

Plain simple English. Short sentences. One idea per sentence. No idioms or metaphors in the spec text. The reader is a strong engineer whose first language is not English. Keep the technical depth.

## When done

Reply with at most 10 lines: what you changed, the top decisions, and the new open questions.
