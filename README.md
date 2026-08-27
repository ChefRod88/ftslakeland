# Florida Theological Seminary — static site

Static HTML. No build step, no dependencies, no framework.

## Run locally

```bash
python3 -m http.server 8000 --directory site
```

Or in GitHub Codespaces: the devcontainer starts this server automatically on **port 8000**.

## Deploy to Cloudflare Pages

This is a plain static site — no build step. The deploy output directory is `site/`.

**Dashboard (Git integration):**
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Pick this repo. Build command: *(leave empty)*. Build output directory: `site`.
3. Save and deploy. `site/_redirects` and `site/_headers` are picked up automatically.

**CLI (no install):**
```bash
npx wrangler pages deploy site
```

`wrangler.toml` at the repo root pins the project name and `pages_build_output_dir`, so both
paths agree on `site/` as the root.

## Structure

Everything served lives in `site/`.

- `site/index.html` — the homepage
- `site/mockups.html` — internal contact sheet: one link per screen
- `site/all-screens.html` — all nine screens stacked on one page (design canvas)
- `site/screens/*.html` — one screen per file:

  | File | Screen |
  | --- | --- |
  | `programs.html` | Programs — registrar's ledger |
  | `admissions.html` | Admissions — application step 1, tuition table, FAQ |
  | `history.html` | Our History — timeline 1901–2026 |
  | `accreditation.html` | Accreditation announcement landing |
  | `home-broadside.html` | Homepage direction A — typographic broadside |
  | `home-split.html` | Homepage direction B — full-bleed split registry |
  | `portal.html` | Student portal — logged-in dashboard |
  | `give.html` | Give — donors and supporting churches |
  | `mobile.html` | Three 390px mobile screens |

Screen files were previously named `1a-programs.html` … `1i-mobile.html`.

## Shared code

- `site/assets/styles.css` — the homepage design system (palette + type tokens, `.btn`,
  `.eyebrow`, `.masthead`, hero, section, and footer components, responsive rules).
- `site/assets/screens.css` — shared reset for the standalone mockup screens, plus a
  responsive layer that reflows their fixed-1280px layout down to ~360px (`>1340px` renders
  unchanged). See `TODO.md` for the visual tuning still owed.
- `site/assets/partials/{announce,header,footer}.html` — the homepage announcement bar,
  masthead, and footer, injected by `site/assets/include.js` into `<div data-include="…">`
  placeholders. `includePartials()` returns a Promise; the homepage's behaviour script runs
  in its `.then()` so the injected header exists first. Partial paths are relative to `site/`.
- The nine `screens/*.html` keep their own bespoke, inline-styled chrome — it is visually
  different from the homepage masthead, so it is not swapped for the shared partial.

## Editing notes

- Fonts come from Google Fonts (Fraunces / Spectral / Barlow Condensed); the `<link>` is in each file's `<head>`.
- Palette: navy `#0E1830`, brass `#C79A3F`, oxblood `#7A2029`, bone `#F1EEE7`.
- Photography is the existing site's images (remote `static.wixstatic.com` URLs) plus placeholders where noted.
- Tuition figures, cohort sizes, dates, and faculty names are placeholders — see `TODO.md` before publishing.
