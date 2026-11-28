# CubeGullak: backlog

Things parked on purpose for the whole CubeGullak folder. Each line says what it is and what it needs before work can start. Newest at the bottom. The apps suite has its own list in `apps/backlog.md`.

- **Remove every mention of Broadvale, fixing each one in context.** The company is now CubeGullak (cubegullak.com), a single-owner company, and Surya is a product under it (decided 2026-11-26). Do not find-and-replace: each mention needs the right new wording. Found on 2026-11-26:
  - `docs/` and `work/` in this folder: 106 mentions in 11 files (`docs/spec.md`, `docs/existing-site.md`, `work/plan/p1.md`, `work/prompt/v0.md` to `v6.md`, `work/prompt/ITERATION_BRIEF.md`). They cover the company name "Broadvale AI Private Limited", the tagline, the nav label "Broadvale AI", the domain `broadvaleai.com`, the subdomains for Khabri, Kasoti and Shiksha, and the mailbox `namaste@broadvaleai.com`.
  - `tradeoffs.md` in this folder: 5 mentions (domain redirects, the mailbox, the Worker route for Khabri).
  - Khabri repo, `app/layout.jsx` line 4: the fallback site address `https://khabri.broadvaleai.com`.
  - Claude's project notes: one line that calls these files "the Broadvale site build".
  - Not searched: `.env`, and the live systems (DNS, Vercel, Cloudflare, Amazon SES, Supabase).
  Needs: the new addresses (is the site cubegullak.com, and do Khabri, Kasoti and Shiksha move to subdomains of it?), the new mailbox, and a decision on whether `docs/existing-site.md` stays as a record of the old live site.
- **Finish the site build plan.** The site spec is final (`docs/spec.md`). The build plan stopped after round 1 of 7 (`work/plan/p1.md`, brief in `work/plan/PLAN_BRIEF.md`). Needs: the Broadvale item above settled first, because the spec and plan are written around the old company name and domain.
