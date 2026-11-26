# SageTurtle apps: context

Written on 2026-11-26 at the end of the design chat, so that a new chat can start fresh. Read this folder first.

- `README.md` (this file): what SageTurtle is, where everything lives, how to start.
- `decisions.md`: every decision so far, and who made it.
- `open.md`: what is waiting, what is not designed, what is not built, and what comes next.

## What SageTurtle is

One installable web app (a PWA) that holds twelve apps for people in India: Khabri (khabar), Learn, Earn, Reminders,
Hobbies, Meetings, Messages, Discussions, Events, Yellow Pages (directory), Advertise, and Me. Who the person is decides
what each app is called and what it does. There are 11 variants: Kids, Teens, and nine adult ones (Student, Looking for a
job, Office job, Shop or business, Daily work, Farming, Home, Teacher, Retired).

sumeet is the single owner of SageTurtle (sageturtle.me), to be a One Person Company. Surya is a product, not a company.
The old company name Broadvale is being removed (root `backlog.md`).

## Where things live

| What | Where |
| :--- | :--- |
| Design map (variants, names, rules), living | https://claude.ai/artifact/KBQ1Cuj8GjVKK5e9nT5A6G, source `apps/docs/variant-map.html` |
| Drawn screens (canvas, 30 phone screens), living | https://claude.ai/artifact/Jgem7AE3dhZSPvVkV6bqS1, source `apps/shell/docs/canvas/` |
| Screens in words | `apps/shell/docs/screens.md` |
| Choices and their cost | `apps/tradeoffs.md`, `apps/shell/tradeoffs.md` |
| Parked work | `apps/backlog.md`, `apps/shell/backlog.md`, root `backlog.md` |
| Code | github.com/sum7k/sageturtle, folder `apps/` (Next.js). First slice is pull request 2, branch `claude/project-thread-cb35su` |
| Old Khabri site (reference only) | github.com/sum7k/Khabri |

The folder `/Users/sumeet/SageTurtle` on sumeet's computer holds the docs and is not a git repository. The code is only
in the GitHub repository. This context folder is kept in both.

## Folder rules

Every app folder, starting from the root (Surya), has `idea.md`, `backlog.md`, `tradeoffs.md`, `docs/` (design that stays
true) and `work/` (intermediate results). Tradeoffs are written `- [where] Choice. Why. Cost.`, with `Human:` on the ones
sumeet decided. Nothing is deleted: a removed thing moves to a `.trash` folder at the same level, and `.trash` is never
read for guidance. Never read or print `.env`.

## How sumeet likes to work

- Brief, simple replies. Plain words.
- Claude is the junior analyst and engineer: decide what is reasonably clear, do it, say what was decided, and log it in
  `tradeoffs.md`. Ask only for taste, money, brand, legal risk, or when there is no basis to choose.
- Look up basic facts instead of asking.
- Clean up stale content in the same pass as each change.

## How to start a new chat

For software: "Continue from pull request 2 in sum7k/sageturtle. Read apps/README.md and apps/docs/context first."
For design: "Read apps/docs/context, then design <app> on the shell canvas."
