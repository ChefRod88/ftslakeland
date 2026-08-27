# Before launch

The site is functional, but it must not go public with invented data. Everything below
lives in `app/data/*.ts` (a developer edits it — there is no CMS yet) unless noted.

## Placeholder content — needs real values from the seminary

| What | Where | Note |
| --- | --- | --- |
| **Accrediting body name** | `app/data/site.ts` → `accreditingBody` | Shows as `[accrediting body]` on `/` and `/accreditation`. |
| **Tuition figures** ($120/term, $65/cr, $95/cr) | `app/data/admissions.ts` → `tuition` | Marked "placeholder pending final board approval" on `/admissions`. |
| **Cohort size "twelve"** | `app/data/programs.ts` → Master's & Doctorate `description` | |
| **Term start date** | `app/data/admissions.ts` (`admissionSteps`), `app/data/site.ts` | "Fall term" is generic; add the real date. |
| **Faculty names** | not currently shown (were "Dr. Whitfield" / "Rev. Daniels" in the old portal mock) | Add when faculty pages are built. |
| **President quote / name** | `app/routes/home.tsx` (President section) | "Dr. Frank O'Harroll, Sr." — confirm this is current and approved. |
| **Fundraising numbers** ($46,200 / $75,000, 31 churches) | not shown yet | The old Give mockup had them; `/give` is now generic. Add real numbers if you want the thermometer back. |
| **Archival photo, c.1904** | `app/data/timeline.ts` → `imagePlaceholder` | Renders as a labelled placeholder box on `/history`. |
| **Course catalog / schedule / degree-requirements pages** | footer + `/admissions` link to `/admissions` as a stand-in | Real documents or pages needed. |
| **Social links** | footer currently links only to `/privacy` | Add Facebook/YouTube/Instagram URLs when ready. |

## Contact details — confirm these are correct (not obviously placeholder)

- Phone `863-683-3879`, email `fltheologicalseminary@gmail.com` (`app/data/site.ts`).
  Consider a dedicated `admissions@` address for `FROM_EMAIL`.
- Registrar name "Sis. Linda Silas".
- Address `115 W 5th Street, Lakeland, FL 33805`.
- Anedot donation URL `https://secure.anedot.com/florida-theological-seminary/donate`
  (`app/data/site.ts` → `giveUrl`). Decide: link out (current) or embed on `/give`.

## Operations — needed before or at launch

- Create the D1 database, KV namespace, and R2 bucket; paste real IDs into `wrangler.toml`
  (see README). Run `wrangler d1 migrations apply DB --remote`.
- Set `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` as Wrangler secrets; replace the
  Turnstile **site** key in `wrangler.toml [vars]`; set production `SITE_URL` / `FROM_EMAIL`.
- Add Resend's DNS records for the sending domain.
- Put a Cloudflare Access policy on `/admin/*` limited to staff emails.
- Point the seminary domain at the Worker.

## Nice to have (not blockers)

- Replace remote `static.wixstatic.com` images with local files in `app/data/site.ts`
  and `app/` assets (CSP already restricts `img-src` to self + that host).
- Real favicon / social share image (`public/`), currently the framework default.
- CSP uses `script-src 'unsafe-inline'` for React Router's hydration script; move to a
  nonce if you want it stricter.
- Playwright tests for the three form flows.
- `/history` and `/programs` could gain per-item detail pages.
