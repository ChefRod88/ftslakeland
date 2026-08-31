# Prompt for an LLM / coding agent

Copy everything below the line into Copilot Chat (or Claude/Cursor) with this repo open.

---

You are working in a repo of **static HTML UI mockups** for Florida Theological Seminary and Bible College (Lakeland, FL — founded 1901, accredited 2026). There is no framework, no build step, and no package.json. Do not introduce React, Tailwind, a bundler, or npm dependencies unless I explicitly ask.

## Current state

- `site/index.html` — all nine mockup screens stacked on one page, with an anchor nav of screen ids at the top.
- `site/screens/*.html` — the same nine screens, one per file:
  - `1a-programs.html` — Programs page, laid out as a registrar's ledger (rows with a spec column)
  - `1b-admissions.html` — Admissions, with step 1 of the application inside the hero, plus a tuition table and FAQ
  - `1c-history.html` — Our History, vertical timeline 1901–2026 with fire markers for the 1921 and 1927 fires
  - `1d-accreditation.html` — Accreditation announcement landing page
  - `1e-home-broadside.html` — Homepage direction A: large typographic broadside, no photo hero
  - `1f-home-split.html` — Homepage direction B: full-bleed split, photo left / program index right
  - `1g-student-portal.html` — Logged-in student dashboard
  - `1h-give.html` — Give page for donors and supporting churches
  - `1i-mobile.html` — Three 390px mobile screens (homepage, programs list, portal)
- `.devcontainer/devcontainer.json` — serves `site/` on port 8000 in Codespaces.
- `README.md` — run instructions.

## Design system (do not drift from this)

- Colors: navy `#0E1830`, deep navy `#16233F`, near-black `#070D1B`, brass `#C79A3F`, light brass `#E3C177`, oxblood `#7A2029`, bone `#F1EEE7`, bone-2 `#E4DFD3`, body text `#2C313C`, muted `#6A7183`.
- Type: **Fraunces** for headings and numerals, **Spectral** for body prose, **Barlow Condensed** uppercase with wide letter-spacing for labels, nav, and buttons.
- Buttons and labels are uppercase Barlow Condensed, letter-spacing ~.15em, square corners (no border radius anywhere except avatars).
- Rules and hairlines carry the structure — 1px borders and dotted leaders, not shadows or cards with rounded corners.
- Tone of copy: plain, concrete, unsentimental. Short sentences. No marketing superlatives, no emoji.

## What I want you to do

1. **Reorganize into a maintainable static site** without changing any visual output:
   - Extract the repeated inline styles into one shared `site/assets/styles.css` with CSS custom properties for the palette and type, plus utility/component classes (`.btn`, `.eyebrow`, `.masthead`, etc.). Keep the rendered result pixel-identical.
   - Extract the repeated header, announcement bar, and footer into a single source (either an HTML partial injected by a small vanilla `site/assets/include.js`, or a tiny Node build script — your call, but keep it dependency-free).
   - Move images to `site/assets/img/` where they are local; leave remote URLs as-is but list them in a manifest.
2. **Normalize file naming and add a real index**: `site/index.html` becomes a proper landing/contact-sheet page linking to each screen with a short description, rather than the stacked canvas. Move the stacked canvas to `site/all-screens.html`.
3. **Flag every placeholder** before anything ships. Search for and list in a `TODO.md`: tuition dollar figures, credit-hour prices, the `$46,200 / $75,000` fundraising numbers, `31 supporting churches`, cohort size "twelve", the September 8 term start, `[accrediting body]`, faculty names (Dr. Whitfield, Rev. Daniels), the fake student "Rev. Marcus Bell", and the striped image placeholders.
4. **Accessibility pass**: real `<button>`/`<a>` semantics for anything interactive (several are currently `<span>`), visible `:focus-visible` styles in brass, alt text on every image, one `<h1>` per page, and a landmark structure (`header`/`nav`/`main`/`footer`).
5. **Responsive pass**: the desktop screens are authored at fixed 1280px inside a canvas wrapper. Make each screen fluid down to 360px using the mobile screens in `1i-mobile.html` as the reference for how sections should stack.

Work in small commits, one numbered task per commit, and tell me what changed after each. Do not restyle, recolor, rewrite copy, or "improve" layouts — only restructure. If a change would alter the rendered design, stop and ask me first.
