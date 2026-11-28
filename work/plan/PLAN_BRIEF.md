# Brief for each plan iteration

We turn the final prompt `docs/spec.md` into a build plan, in 7 rounds. After round 7, a coding agent builds the site from the plan. Each round is done by a different model and effort level.

## Inputs (read all of them)

- `docs/spec.md` — the final product spec. The plan must build all of its phase 1 (NOW) scope. Do not change product decisions; if the spec is wrong or unbuildable, make the smallest fix and log it in `tradeoffs.md`.
- `work/plan/p{N-1}.md` — the previous plan round (none for round 1).
- `docs/` — the live site themes and the Surya background notes.
- `tradeoffs.md` — choices so far.

## Your output

Write `work/plan/p{N}.md`. Append your new choices to `tradeoffs.md` under "## Plan round N". Do not edit other files.

## What the plan must contain (by round 7)

1. **Architecture.** One diagram in text: what runs where (Cloudflare, Supabase, Fly.io, AWS, GCP, Azure), with the reason for each. Data flow for: pre-registration, Kasoti chat turn, Shiksha app call, translation/speech.
2. **Repo layout.** Exact folders and key files. One monorepo. Package manager and versions.
3. **Data.** Every Supabase table with columns, types, keys, RLS policy, and retention. SQL migration files by name.
4. **Env.** The full `.env` key list, which service reads each key, and where it comes from (which dashboard). One `.env` at repo root is the only source; the plan says how each deploy target gets its values from it (scripts, not hand copying).
5. **Milestones.** Ordered build steps. Each step: goal, files, commands, and a "done when" check that a human or agent can see (a URL loads, a row appears). No automated tests (the user said no tests).
6. **Deploy.** Exact commands for each target (Cloudflare, Fly.io, Supabase migrations), DNS records, and domains/subdomains.
7. **Per-product detail.** Home split, /business pre-register, Kasoti (chat loop, tool calls, Python modules, caps), Shiksha (shell, manifest, the 30 NOW apps, language routing), admin, old pages (Portfolio/Team/Careers/Blog).
8. **Credentials checklist.** What the human must provide (accounts, keys, MCP logins), in the order the build needs them.
9. **Risks.** Short list with fallback for each.

## What each round must do

1. **Answer the open questions** of the previous round. Decide each yourself; never wait for a human. Log choices in `tradeoffs.md`.
2. **Simpler and cleaner.** Fewer moving parts, fewer services, fewer files, where it does not cost function. Prefer one way of doing each thing.
3. **More complete.** Close gaps a builder would have to guess. Check versions and commands are real (you may run `npm view`, `--help`, or search docs).
4. **New open questions.** End with at most 8, for the next round. Round 7: empty, or human-only items.

## Writing style

Plain simple English. Short sentences. The reader is a strong engineer whose first language is not English. Keep the technical depth.

## When done

Reply with at most 10 lines: what changed, top decisions, new open questions.

## How to write the file

Never write the whole plan in one reply. A long single reply can hang. Write it in parts: one file per section in the scratchpad folder `/private/tmp/claude-501/-Users-sumeet-Products-Surya/b12d5aad-fbde-46a4-afda-3ca5fa420b98/scratchpad/plan-p{N}/`, each part under about 12 KB, each with its own Write call. Then join them with `cat` into `work/plan/p{N}.md`. You may copy unchanged parts of the previous round with a shell command and then edit them.

## The .env file

`.env` at the repo root already lists 21 key names. The values are empty for now; the user fills them. Read only the key names. Never print or copy values.
