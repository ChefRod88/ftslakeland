# Florida Theological Seminary site — status & next steps

_Last updated: 2026-08-27_

## Where things stand

The site went from static HTML mockups to a real, deployed web application.

**Live:** https://ftslakeland.rodney-5e8.workers.dev
**Repo branch:** `real-site` (nothing merged to `main` yet)
**Stack:** React Router v8 (framework mode) → SSR on Cloudflare Workers · D1 (SQLite) ·
KV (rate limiting) · R2 (file uploads, not yet enabled) · Resend (email, not yet keyed) ·
Turnstile (spam, test keys) · Anedot (giving, unchanged)

### What was done

| Area | Status |
| --- | --- |
| Content pages | `/`, `/programs`, `/admissions`, `/history`, `/accreditation`, `/give`, `/portal` (coming soon), `/contact`, `/privacy` — all real routes, content in `app/data/*.ts` |
| Homepage | Full port of the redesigned homepage incl. mobile menu, sticky header, scroll-reveal |
| Inquiry form (`/contact`) | Works: validation → Turnstile → rate limit → D1 (`inquiries`) → email → audit log |
| Sponsorship form (`/accreditation`) | Works: same pipeline → `sponsorship_requests` |
| Application (`/admissions/apply`) | Works: one-page sectioned form, **Save & finish later** (emailed resume link), reference codes (`FTS-XXXXXX`), optional pastor-letter upload (needs R2) |
| Staff area (`/admin`) | Read-only dashboard + lists + application detail + file download; gated by Cloudflare Access (currently returns 404 in prod because Access isn't configured) |
| Hardening | CSP + security headers, 301s from old `/screens/*.html` URLs, `/sitemap.xml`, `/robots.txt` |
| Infra | D1 database created + migrated (remote), KV namespace created, deployed via `wrangler` |
| Docs | `README.md` (dev/deploy), `TODO.md` (placeholder + ops checklist) |

### Known demo-mode caveats

These are fine for a stakeholder walkthrough but **must be resolved before public launch**:

1. **Email is off** — no `RESEND_API_KEY`. Submissions save to D1 and show the success
   screen, but no notification email is sent to the registrar or the applicant.
2. **Turnstile uses test keys** — the bot-check widget is a dummy that always passes.
3. **File upload is disabled** — R2 is not enabled on the Cloudflare account. The
   application form hides the upload field and tells applicants to email the letter.
4. **`/admin` is unreachable in prod** — no Cloudflare Access policy yet, so the
   defence-in-depth guard returns 404.
5. **Placeholder content is still live** — `[accrediting body]`, placeholder tuition
   figures, "cohort of twelve", generic term dates, unconfirmed president quote.
6. **API token was shared in chat** — roll it at dash.cloudflare.com/profile/api-tokens.

---

## Recommended next steps

### 1. Launch blockers (do these before sharing the URL publicly)

- [ ] **Real content** — fill `app/data/site.ts`, `app/data/admissions.ts`,
      `app/data/programs.ts`: accrediting body name, tuition figures, term start date,
      cohort size, and confirm the president quote/name. Full list in `TODO.md`.
- [ ] **Email** — create a Resend account, verify a sending domain (add the DNS records),
      set `wrangler secret put RESEND_API_KEY`, and set `FROM_EMAIL` in `wrangler.toml`
      to an address on that domain (e.g. `admissions@ftslakeland.org`).
- [ ] **Turnstile** — create a widget in the Cloudflare dashboard for the real domain,
      put the site key in `wrangler.toml [vars] TURNSTILE_SITE_KEY`, and
      `wrangler secret put TURNSTILE_SECRET_KEY`.
- [ ] **Protect `/admin`** — Cloudflare Zero Trust → Access → Applications → self-hosted
      app for `<domain>/admin/*`, policy limited to seminary staff emails.
- [ ] **Custom domain** — add the seminary domain to Cloudflare, then a route/custom
      domain binding for the Worker. Update `SITE_URL` in `wrangler.toml`.
- [ ] **Enable R2** (optional but recommended) — dashboard → R2 → enable (needs a card
      on file; free tier is generous), `wrangler r2 bucket create ftslakeland-uploads`,
      uncomment the `[[r2_buckets]]` block in `wrangler.toml`, `wrangler types`, redeploy.
      Then the application accepts the pastor's-letter attachment again.
- [ ] **Move deploys off the pasted token** — connect the GitHub repo in the Cloudflare
      dashboard (Workers & Pages, build command `npm run build`) so pushes to `real-site`
      (or `main` after merge) deploy automatically. Then revoke the manual token.
- [ ] **Merge `real-site` → `main`** once reviewed.

### 2. Content & polish (soon after launch)

- [ ] Replace remote `static.wixstatic.com` images with local files in `app/` and
      `app/data/site.ts` (CSP already restricts `img-src` to self + that host).
- [ ] Real favicon and social-share image in `public/` (currently framework defaults);
      add Open Graph / Twitter card meta per route.
- [ ] Fill in the real Fall schedule, course catalog, and degree-requirements pages —
      right now the footer links point at `/admissions` as a stand-in.
- [ ] Social links in the footer (currently only `/privacy`).
- [ ] Per-program detail pages (`/programs/:slug`) and per-era history detail if wanted.
- [ ] Tighten CSP: swap `script-src 'unsafe-inline'` for a nonce on React Router's
      hydration script.

### 3. Operations

- [ ] Playwright end-to-end tests for the three form flows (happy path, validation,
      spam-blocked) wired into CI.
- [ ] A backup/export routine for the D1 tables (applications are records worth keeping).
- [ ] Decide a retention policy for inquiries and draft applications; document it in
      `/privacy` (which currently says "as long as needed").
- [ ] Monitoring: Workers has observability enabled in `wrangler.toml`; set up an alert
      on error rate.

### 4. The student portal (separate project, when ready)

The portal was deliberately deferred. When the seminary wants it:

- **Recommended:** connect an existing Student Information System (Populi, Classe365,
  Anthology, Blackbaud) rather than build one — grades, transcripts, registration, and
  tuition billing are a lot of surface area with real compliance weight (FERPA-adjacent).
- If building in-house anyway: it fits the current stack (D1 + Workers + an auth
  library), but budget for auth, sessions, password reset, an admin CRUD surface, and
  a security review. The `KV` binding is already in place for sessions.
- Either way, `/portal` currently ships as a branded "coming soon" page.

### 5. Content management (optional)

No CMS today — a developer edits `app/data/*.ts`. If seminary staff need to change page
copy, tuition, or news themselves, add a Git-based CMS (Decap/Sveltia, Pages CMS) or a
small D1-backed admin editor. Not needed for launch.
