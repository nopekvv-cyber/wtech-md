# Deploy wtech.md with GitHub, Supabase, and Vercel

## 1. Supabase

1. Create or select a Supabase project in a European region.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Project Settings → API, copy:
   - Project URL → `SUPABASE_URL`
   - Service role secret → `SUPABASE_SERVICE_ROLE_KEY`
4. Keep the service role secret out of GitHub and every `NEXT_PUBLIC_*` variable.

The schema enables Row Level Security and grants no browser-facing table policies. The service role is used only inside Vercel server functions.

## 2. GitHub

Create a private repository and push this project. `.env`, `.env.local`, `config/`, build output, browser reports, and test results are ignored. Confirm no secret is staged before the first push.

## 3. Vercel

Import the GitHub repository as a Next.js project. The repository includes `vercel.json` and runs server functions in Frankfurt (`fra1`).

Add these variables to Production, Preview, and Development unless a value should intentionally differ:

### Required

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD` — at least 8 characters
- `ADMIN_SESSION_SECRET` — random, at least 32 characters
- `NEXT_PUBLIC_SITE_URL=https://wtech.md`
- `TRUST_PROXY=1`
- `RATE_LIMIT_MAX=8`
- `ALLOWED_ORIGINS=https://wtech.md,https://www.wtech.md`

### Optional

- Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `LEADS_TO`
- Ana: Vercel AI Gateway uses the automatically injected `VERCEL_OIDC_TOKEN`; optionally set `ANTHROPIC_API_KEY` for a direct Anthropic connection. `CHAT_DISABLED=1` disables the chat.
- Contact and social fallbacks: the `NEXT_PUBLIC_*` fields in `.env.example`
- Analytics: `NEXT_PUBLIC_UMAMI_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`

Deploy after the variables are saved. Public `NEXT_PUBLIC_*` changes require another deployment. Server-only variable changes also trigger a redeployment from the Vercel settings interface.

## 4. Verify the temporary Vercel URL

Before moving the domain:

1. `/api/health` returns `{ "ok": true, "database": "connected" }`.
2. `/`, `/ru`, and `/en` load without console or network errors.
3. Submit a clearly labelled test lead and confirm it appears in Supabase `leads` and `/admin/leads`.
4. Sign into `/admin`, save one non-sensitive setting, refresh the public page, and confirm the value appears.
5. Mark the test lead handled and download the CSV.
6. Delete the clearly labelled test row after verification.

## 5. Move wtech.md to Vercel

Add `wtech.md` and `www.wtech.md` under Vercel Project → Settings → Domains. Vercel will show the exact DNS records required for the account. Apply those records in Cloudflare DNS.

Remove the existing Tunnel/CNAME routing for the same hostnames before adding Vercel's records; two origins must not compete for `wtech.md`. Keep the old NAS project available until the Vercel URL and database flows are verified.

Use Cloudflare's DNS proxy status recommended by Vercel during verification. Do not guess A or CNAME targets; use the values displayed for this Vercel project.

## 6. Production checks

- `https://wtech.md/api/health` confirms the database.
- `https://wtech.md`, `/ru`, `/en`, `/admin`, `robots.txt`, and `sitemap.xml` respond correctly.
- Forms create Supabase rows before optional notifications are attempted.
- Rate-limit state is shared through the Supabase RPC, with an instance-local fallback only during a database outage.
- Cloudflare no longer routes the apex or www hostnames through the old NAS tunnel.

## Rollback

If production verification fails, restore the previous Cloudflare tunnel DNS records and keep the Vercel project online only at its temporary URL while correcting the issue. Supabase data remains independent of either origin.
