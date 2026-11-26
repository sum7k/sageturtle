# sageturtle
Base repository for all my professional work

## Website

A static placeholder landing page lives in `public/`. It is served by a Cloudflare Worker
(static assets only, config in `wrangler.jsonc`) at https://sageturtle.me and https://www.sageturtle.me.

Deploy manually with `npx wrangler deploy`, or let Cloudflare Workers Builds deploy on every push to `main`.
