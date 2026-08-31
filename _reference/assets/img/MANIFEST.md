# Image manifest

Every image on the site is currently loaded **remotely** from `static.wixstatic.com`
(the seminary's existing Wix site). Nothing is stored in this repo yet. Before launch,
download each file into `site/assets/img/` under the proposed name and swap the URLs.

| Proposed local file | Remote source (base media id) | Used in | Notes |
| --- | --- | --- | --- |
| `logo.png` | `25e3e6_30003ad300bd47fba73446ca0a3646db~mv2.png` | `assets/partials/header.html`, `screens/programs.html`, `screens/mobile.html`, `all-screens.html` | Masthead wordmark/logo lockup. Served by Wix at 147×159. |
| `seal.png` | `25e3e6_cedf12f16d8047c0b4f98d674b0ed9dc~mv2.png` | `index.html` (hero seal), `assets/partials/footer.html`, `screens/accreditation.html`, `screens/home-split.html`, `all-screens.html` | Institutional seal. Wix master 490×590, transparent. |
| `sanctuary.jpg` | `c8f730948dd845cda5c9ac044c3c2bef.jpg` | `index.html` (hero art), `screens/home-split.html`, `screens/mobile.html`, `all-screens.html` | "The sanctuary where classes have met since 1901." Wix fill 980×651. |
| `president.jpg` | `25e3e6_cea4b614dd4446cf86f98275dc260ef0~mv2.jpg` | `index.html` (President section) | Portrait of Dr. Frank O'Harroll, Sr. Wix fill 335×387. |
| `verse-bg.jpg` | `5bb82d4a799849efa1a5cacda245f8fd.jpg` | `assets/styles.css` — `.verse::before` background | Scripture band backdrop, sits at 15% opacity. Wix fill 980×654. |

## Full remote URLs (as currently referenced)

```
https://static.wixstatic.com/media/25e3e6_30003ad300bd47fba73446ca0a3646db~mv2.png/v1/fill/w_147,h_159,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/updated%202024%20logo%20for%20florida%20theological%20seminary%20and%20bible%20college%20inc.png
https://static.wixstatic.com/media/25e3e6_cedf12f16d8047c0b4f98d674b0ed9dc~mv2.png/v1/fill/w_490,h_590,al_c,lg_1,q_85,enc_avif,quality_auto/25e3e6_cedf12f16d8047c0b4f98d674b0ed9dc~mv2.png
https://static.wixstatic.com/media/c8f730948dd845cda5c9ac044c3c2bef.jpg/v1/fill/w_980,h_651,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c8f730948dd845cda5c9ac044c3c2bef.jpg
https://static.wixstatic.com/media/25e3e6_cea4b614dd4446cf86f98275dc260ef0~mv2.jpg/v1/fill/w_335,h_387,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/25e3e6_cea4b614dd4446cf86f98275dc260ef0~mv2.jpg
https://static.wixstatic.com/media/5bb82d4a799849efa1a5cacda245f8fd.jpg/v1/fill/w_980,h_654,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5bb82d4a799849efa1a5cacda245f8fd.jpg
```

## Status

- No striped / labelled image placeholders exist in the committed files. Every `<img>` and
  CSS background points at one of the five real Wix assets above.
- Remote URLs are left in place for now (per instructions). When localising, keep the same
  five filenames so `_headers` `Cache-Control: immutable` on `/assets/*` applies.
