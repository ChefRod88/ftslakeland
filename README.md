# Florida Theological Seminary — website

Public site for Florida Theological Seminary and Bible College (Lakeland, FL). Built with
**React Router v8** (framework mode) running SSR on **Cloudflare Workers**, with **D1**
(SQLite) for form submissions, **R2** for uploaded files, **KV** for rate limiting,
**Resend** for email, and **Turnstile** for spam protection. Giving runs through **Anedot**.

The logged-in student portal is intentionally out of scope — `/portal` is a "coming soon"
page for now.

## Requirements

- Node 20+
- A Cloudflare account (for deploy and for local D1/R2/KV simulation via Wrangler)

## Develop

```bash
npm install
cp .dev.vars.example .dev.vars          # fill in keys, or leave blank for console-logged email
npm run db:migrate:local               # create local D1 tables
npm run dev                            # http://localhost:5173
```

`npm run dev` runs Vite + the Cloudflare plugin, so `context.get(cloudflare).env` gives the
same bindings locally as in production (local D1/R2/KV live under `.wrangler/`).

Other scripts: `npm run build`, `npm run typecheck`, `npm run preview`, `npm run deploy`.

## Project layout

```
app/
  root.tsx              document shell, fonts, global CSS
  routes.ts             route table
  context.ts            RouterContext holding the Cloudflare env/ctx
  routes/               one file per page; layout.tsx wraps the public site,
                        admin/ is a separate Access-gated area
  components/           Header, Footer, Announce, form.tsx (Field, Turnstile)
  data/                 site.ts, programs.ts, timeline.ts, admissions.ts —
                        structured content a developer edits (no CMS)
  lib/                  db, applications, validation (zod), email (Resend),
                        turnstile, ratelimit, staff, ids
  app.css              the whole design system (tokens + components)
workers/app.ts          Workers entry: redirects, security headers, SSR handler
migrations/             D1 schema
_reference/             the old static mockups, kept for visual comparison (not served)
```

## Forms

All three post with progressive enhancement (they work with JavaScript disabled):

| Route | Table | Emails |
| --- | --- | --- |
| `/contact` (inquiry) | `inquiries` | registrar + auto-reply |
| `/accreditation` (church sponsorship) | `sponsorship_requests` | registrar + auto-reply |
| `/admissions/apply` (application) | `applications`, `application_files` | registrar + applicant, with a `FTS-XXXXXX` reference |

The application supports **Save & finish later**: it stores a draft keyed by a random
`resume_token` and emails the applicant a link back (`/admissions/apply?resume=…`).

Every form runs: honeypot field → Turnstile verify → KV rate limit → zod validation →
D1 insert → email (via `sendEmailSafe`, so a mail failure never drops a stored submission)
→ `form_events` audit row.

## First-time Cloudflare setup

Create the resources and paste the real IDs into `wrangler.toml` (they are `0000…`
placeholders now):

```bash
wrangler d1 create ftslakeland                 # -> database_id
wrangler kv namespace create KV                 # -> id
wrangler r2 bucket create ftslakeland-uploads
wrangler d1 migrations apply DB --remote        # create tables in prod
```

Secrets (production):

```bash
wrangler secret put RESEND_API_KEY             # from resend.com
wrangler secret put TURNSTILE_SECRET_KEY       # from Cloudflare -> Turnstile
```

`TURNSTILE_SITE_KEY` is public and lives in `wrangler.toml [vars]` — replace the test key.
Also set `SITE_URL` and `FROM_EMAIL` there for production.

**Email domain:** add Resend's DNS records for whatever domain `FROM_EMAIL` uses, or mail
will not deliver.

**Protect `/admin`:** in the Cloudflare dashboard → Zero Trust → Access → Applications, add
a self-hosted application for `your-domain/admin/*` with a policy limited to seminary staff
emails. The app also refuses `/admin` requests on a real hostname that lack the
`Cf-Access-Authenticated-User-Email` header, but Access is the real gate.

## Deploy

```bash
npm run deploy        # build + wrangler deploy
```

or connect the repo in the Cloudflare dashboard (Workers & Pages → build command
`npm run build`).

## Before the site goes live

See `TODO.md` — placeholder figures, the accrediting body name, faculty names, and term
dates still need real values from the seminary.
