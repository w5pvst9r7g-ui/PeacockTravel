# Third-party components

This is a personal family project; the family's own content (text, data, illustrations,
research) is not licensed for reuse. The third-party components below are vendored under
`assets/` or used at runtime/dev-time, each under its own license.

## Vendored libraries (`assets/js/vendor/`, `assets/css/vendor/`)

| Component | Version | License | Source |
|---|---|---|---|
| GSAP + ScrollTrigger | 3.12.5 | GreenSock Standard License ("no charge" use) — see https://gsap.com/community/standard-license/ · headers preserved in the minified files | https://gsap.com |
| Three.js | r149 | MIT · © 2010–2023 three.js authors | https://github.com/mrdoob/three.js |
| Leaflet | 1.9.4 | BSD 2-Clause · © 2010–2023 Volodymyr Agafonkin, © 2010–2011 CloudMade | https://leafletjs.com (license: https://github.com/Leaflet/Leaflet/blob/main/LICENSE) |
| Leaflet.markercluster | 1.5.3 | MIT · © 2012 David Leaver | https://github.com/Leaflet/Leaflet.markercluster (the vendored file ships without a header comment; license per the repository) |

Note on GSAP: the Standard License permits free use in projects that don't charge end
users. This site is free and personal, which fits; if the project ever becomes part of a
paid product, review the license (Club GSAP) before shipping.

## Fonts (`assets/fonts/`)

| Font | License | Copyright |
|---|---|---|
| Fraunces (variable, roman + italic) | SIL Open Font License 1.1 — full text in `assets/fonts/OFL.txt` | © 2020 The Fraunces Project Authors (github.com/undercasetype/Fraunces) |
| Space Grotesk (variable) | SIL Open Font License 1.1 — full text in `assets/fonts/OFL.txt` | © 2020 The Space Grotesk Project Authors (github.com/floriankarsten/space-grotesk) |

Both were vendored from the Fontsource variable-font packages
(`@fontsource-variable/fraunces`, `@fontsource-variable/space-grotesk`). The OFL
requires the license text to accompany the font files — keep `OFL.txt` next to the
`.woff2` files if they move.

## Runtime services (nothing vendored)

- **Basemap tiles** — CARTO Positron / Dark Matter over OpenStreetMap data. Attribution
  "© OpenStreetMap contributors · © CARTO" is rendered on every map (required — don't
  remove the attribution control). CARTO's free basemaps are for non-commercial /
  low-volume use; this site qualifies.
- **Photography** — Wikimedia Commons hotlinks only, verified licenses (PD / CC0 /
  CC BY / CC BY-SA), with author + license credited on the page where each image
  renders and full receipts in `research/*-images.md` (policy: docs/standards.md).

## Dev-time only (`tools/package.json`, not shipped)

puppeteer-core (Apache-2.0), @sparticuz/chromium (MIT, optional), topojson-client
(ISC), d3-geo (ISC), world-atlas (ISC — data derived from Natural Earth, public
domain). The globe's `assets/data/land-dots.js` and the country outlines are generated
from Natural Earth data via world-atlas.
