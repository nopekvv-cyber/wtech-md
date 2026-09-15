# Security notes

Scope: the Next.js application on Vercel, Supabase Postgres, admin area, public forms, and optional notification/AI providers.

## Controls

- The Supabase service role key is used only by server modules and has no `NEXT_PUBLIC_` prefix.
- Row Level Security is enabled on every application table. Anonymous and authenticated browser roles receive no table privileges or policies.
- Public APIs validate strict schemas, normalize contact fields, enforce same-origin requests, use a honeypot/time gate, and apply a shared database rate limit.
- Leads are inserted before Telegram or SMTP is attempted. Notification delivery is tracked separately.
- Admin access uses a constant-time password comparison and an HTTP-only, SameSite=Strict, `/admin`-scoped signed cookie.
- `ADMIN_SESSION_SECRET` keeps sessions valid across serverless instances. Set a unique random value of at least 32 characters.
- Admin pages are excluded from indexing and caching. The service role key never reaches the browser.
- Logs avoid request bodies and credentials. CSV export neutralizes formula-looking cells.
- The content security policy, HSTS, frame denial, MIME sniffing protection, permissions policy, and referrer policy remain enabled.

## Operational requirements

- Keep the GitHub repository private until all copied configuration files and history are reviewed for secrets.
- Store production credentials only in Vercel encrypted environment variables and Supabase's own settings.
- Rotate any credential that was previously committed, shared in a ZIP, pasted into a public issue, or exposed in deployment output.
- Protect the GitHub, Supabase, Vercel, Cloudflare, Telegram, and Anthropic accounts with MFA.
- Review Vercel and Supabase logs after launch, and enable billing/usage alerts before traffic grows.
- Back up Supabase according to the project's plan and export leads periodically.

## Known limits

- The in-memory rate limiter is only a temporary fallback during a Supabase outage and cannot coordinate across Vercel instances.
- The single-password admin is suitable for one trusted operator. Add Supabase Auth with MFA before giving access to multiple staff members.
- Optional providers have their own retention and privacy terms. Enable only those the business has approved.
