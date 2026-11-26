# sageturtle
Base repository for all my professional work

## Website

All code lives in `software/`. A static placeholder landing page is in `software/public/`, served by a
Cloudflare Worker (static assets only, config in `software/wrangler.jsonc`) at https://sageturtle.me
and https://www.sageturtle.me.

Deploy manually with `cd software && npx wrangler deploy`, or let Cloudflare Workers Builds deploy on
every push to `main` (set the build's root directory to `software`). Copy `software/.env.example` to
`software/.env` for local deploy credentials; `.env` is gitignored.
