# Placeholders to resolve before launch

Every item below is invented copy or a stand-in destination in the mockups. Confirm or
replace each with real data. Line numbers are current as of this commit.

## Accrediting body

`[accrediting body]` — name of the agency that granted accreditation is not filled in.

- `site/index.html:55`
- `site/screens/accreditation.html:23`
- `site/all-screens.html:390`

## Tuition figures

All dollar amounts are guesses.

- `site/screens/admissions.html:76` — Adult Bible Studies, **$120 / term**
- `site/screens/admissions.html:77` — Undergraduate, **$65 / credit hour**
- `site/screens/admissions.html:78` — Graduate, **$95 / credit hour**
- `site/screens/give.html:28` — prose: "for want of **$65** a credit hour"
- `site/screens/give.html:44,45,46` — gift buttons **$65 / $260 / $1,000**
- `site/screens/give.html:48` — "**$260** covers one four-hour course … **$65** covers a single credit hour"
- `site/all-screens.html:263-265` — same tuition table in the stacked canvas

## Fundraising numbers (Give)

- `site/screens/give.html:30` — **$46,200 raised toward $75,000**
- `site/screens/give.html:31` — **31 supporting churches**
- `site/screens/give.html:33` — progress bar hard-coded to **61%** (`width:61%`)
- `site/all-screens.html:663-664` — same figures in the stacked canvas

## Cohort size

"**Cohort of twelve**" for the doctoral / advanced track.

- `site/screens/programs.html:151`
- `site/screens/mobile.html:86`
- `site/all-screens.html:173, 791`

## Term start date

"**September 8**" / "the week of September 8" / "Fall term begins September 8".

- `site/screens/admissions.html:28`
- `site/screens/home-broadside.html:28`
- `site/all-screens.html:215, 455`

## Faculty names

Invented: **Dr. Whitfield** (Systematic Theology II), **Rev. Daniels** (Baptist History & Polity).

- `site/screens/portal.html:61, 69`
- `site/screens/mobile.html:113, 121`
- `site/all-screens.html:612, 620, 818, 826`

## Fake student record

"**Rev. Marcus Bell**" pre-filled in the application name field; the portal is built around
this fictional student.

- `site/screens/admissions.html:33`
- `site/all-screens.html:220`
- Portal student stats — `Theology, third year · 14 credit hours completed of 96`,
  `Fall balance $390.00`:
  - `site/screens/portal.html:42, 75`
  - `site/screens/mobile.html:102, 126`
  - `site/all-screens.html:593, 626, 807, 831`

## Contact details to verify (not obviously placeholder, but confirm)

- Phone `863-683-3879` — footer partial, `admissions.html:20`, `portal.html:35`, `mobile.html`, `all-screens.html`
- Email `fltheologicalseminary@gmail.com` — footer partial `:34`, `index.html:257`
- Registrar contact "Sis. Linda Silas" — `index.html:257`, `portal.html:35`
- Address `115 W 5th Street, Lakeland, FL 33805` — footer partial
- Donation URL `https://secure.anedot.com/florida-theological-seminary/donate` —
  `site/screens/give.html:54` and the homepage "Make a gift" routes to this page.
- "one hundred and twenty-five years" / "125th year" — derived from 1901; reword if the
  count is meant to be exact at a specific date.

## Unbuilt destinations — every `href="#todo"`

These links have no real page yet. Point them somewhere or remove the affordance.

| File | Lines | What |
| --- | --- | --- |
| `site/assets/partials/footer.html` | 22–25, 41–43 | Course catalog, Fall schedule, Degree requirements, Alumni association; Facebook / YouTube / Instagram |
| `site/index.html` | 267, 268 | "Download the catalog", "Fall 2026 schedule" |
| `site/screens/programs.html` | 84, 104, 123, 143, 162, 168 | five "Program details →" links, "Download the catalog" |
| `site/screens/accreditation.html` | 25, 57, 62 | "Read the full statement", "Current student notice", "Talk to the registrar" |
| `site/screens/admissions.html` | 40 | application "Continue →" |
| `site/screens/home-broadside.html` | 36 | "Download the catalog" |
| `site/screens/portal.html` | 26–32, 44, 50, 78, 83 | all portal nav items + actions (portal is a static mockup) |
| `site/screens/mobile.html` | 35, 36, 54, 56, 63, 68, 73, 78, 83, 90, 107 | mobile CTAs and list items |

## Open design decision

`site/screens/home-broadside.html` and `site/screens/home-split.html` are two earlier
homepage directions. The live homepage (`site/index.html`) is a third. Decide whether to
keep the alternates or drop them; they are currently only linked from `site/mockups.html`.

## Images

Five real images load remotely from `static.wixstatic.com`. See
`site/assets/img/MANIFEST.md` — download and localise before launch.
