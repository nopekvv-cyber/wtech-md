# wtech.md

Production website for wtech.md, a software studio in Chișinău. The site is trilingual: Romanian at `/`, Russian at `/ru`, and English at `/en`.

## Production architecture

- **Vercel** runs the Next.js application and server functions.
- **Supabase Postgres** stores leads, admin settings, delivery state, and shared rate-limit windows.
- **GitHub** is the deployment source. A push to the production branch triggers Vercel.
- Optional Telegram, SMTP, Anthropic, Cal.com, and Umami integrations remain environment-driven.

The Supabase service role key is server-only. No browser bundle receives it, and Row Level Security blocks anonymous table access.

## Local setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

For a live local database, create a Supabase project, run `supabase/schema.sql`, and fill `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

## Verification

```bash
npm run check
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

The browser suite uses an isolated in-memory adapter and a local Telegram mock. Production refuses database-backed operations unless Supabase is configured; `/api/health` returns `503` until it can reach the `settings` table.

## Admin and leads

`/admin` edits contact channels, prices, proof numbers, and social links. `/admin/leads` stores and manages every contact, call, audit, and Ana chat lead. CSV export remains available at `/admin/leads.csv`.

Set `ADMIN_PASSWORD` and a random `ADMIN_SESSION_SECRET` in Vercel. Admin cookies are HTTP-only, same-site, scoped to `/admin`, and signed consistently across serverless instances.

## Database

Run [supabase/schema.sql](supabase/schema.sql) once in the Supabase SQL Editor. It creates:

- `leads`
- `settings`
- `rate_limits`
- `consume_rate_limit(...)`
- `prune_rate_limits()`

No anonymous or authenticated client policies are created. Application database access uses the server-side service role.

## Deployment

See [DEPLOY.md](DEPLOY.md) for GitHub, Supabase, Vercel, environment variables, domain cutover, and verification.
