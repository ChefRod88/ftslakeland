/**
 * Site-wide constants. A developer edits this file; there is no CMS yet.
 * Values marked TODO are placeholders — see TODO.md. They must be replaced
 * with real institutional data before the public launch.
 */

export const site = {
  name: "Florida Theological Seminary",
  legalName: "Florida Theological Seminary and Bible College, Inc.",
  shortName: "FTS",
  tagline: "Preparing the called for ministry",
  founded: 1901,
  accreditedYear: 2026,
  /** TODO: real accrediting body name. */
  accreditingBody: "[accrediting body]",
  address: {
    street: "115 W 5th Street",
    city: "Lakeland",
    state: "FL",
    zip: "33805",
  },
  phone: { display: "863-683-3879", href: "tel:8636833879" },
  email: "fltheologicalseminary@gmail.com",
  registrarName: "Sis. Linda Silas",
  giveUrl: "https://secure.anedot.com/florida-theological-seminary/donate",
} as const;

export const primaryNav = [
  { label: "Programs", to: "/programs" },
  { label: "Accreditation", to: "/accreditation" },
  { label: "Our History", to: "/history" },
  { label: "Campuses", to: "/#campuses" },
  { label: "Admissions", to: "/admissions" },
] as const;

export const images = {
  logo: "https://static.wixstatic.com/media/25e3e6_30003ad300bd47fba73446ca0a3646db~mv2.png/v1/fill/w_147,h_159,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/updated%202024%20logo%20for%20florida%20theological%20seminary%20and%20bible%20college%20inc.png",
  seal: "https://static.wixstatic.com/media/25e3e6_cedf12f16d8047c0b4f98d674b0ed9dc~mv2.png/v1/fill/w_490,h_590,al_c,lg_1,q_85,enc_avif,quality_auto/25e3e6_cedf12f16d8047c0b4f98d674b0ed9dc~mv2.png",
  sanctuary:
    "https://static.wixstatic.com/media/c8f730948dd845cda5c9ac044c3c2bef.jpg/v1/fill/w_980,h_651,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c8f730948dd845cda5c9ac044c3c2bef.jpg",
  president:
    "https://static.wixstatic.com/media/25e3e6_cea4b614dd4446cf86f98275dc260ef0~mv2.jpg/v1/fill/w_335,h_387,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/25e3e6_cea4b614dd4446cf86f98275dc260ef0~mv2.jpg",
} as const;
