# Peacock Travel — The Family Atlas

A fully self-contained static site for planning (and now remembering) the Peacock
family's trips.

**Live:** https://w5pvst9r7g-ui.github.io/PeacockTravel/ — every push to the working branch
auto-deploys via GitHub Actions.

**Project knowledge base:** `CLAUDE.md` (start here) + `docs/` — architecture, the
new-trip playbook, the family preference library, research/licensing standards,
operations & gotchas, the live trip log, and `docs/MIGRATION.md` for moving the repo.

## Pages

- **`index.html`** — landing: an interactive 3D dotted globe (Three.js) tracing the
  family's flight arcs, trip cards, and a departures board — all rendered from the trip
  registry (`assets/data/trips-index.js`), so statuses flip to "Travelling now" /
  "Travelled ✓" by themselves as dates pass.
- **`milan.html`** — Milano 2026 (Thu 9 → Sun 12 Jul, FR7799/FR4845, booking A567VA):
  Duomo-rooftop morning, Lake Como Saturday, Bergamo Città Alta finale, Last Supper
  booking playbook, live-priced family stays.
- **`rabat.html`** — Rabat 2026 (Fri 19 → Mon 22 Jun, FR 162/163, booking H7M9XX):
  Casablanca Friday, rowboat-and-Kasbah Saturday, storks over Chellah — the page that
  built the engine.

Both trip pages run on the same shared engine (`assets/js/trip.js` + `trip-map.js` +
`assets/css/trip.css`): day-by-day itinerary with mini-map route thumbnails and a live
countdown chip · a real-geography interactive map (grey CARTO/OSM basemap on vendored
Leaflet, Paper/Night toggle, marker clustering, numbered day routes with a synced
manifest, photo detail cards, district tints, railway lines, geolocation, designed
fallback tiles, lazy boot, `#poi=`/`#day=` deep links) · verified Google ratings with
honest below-bar flags and filter chips · stays with live Booking.com pricing, computed
walk/taxi times and a sortable comparison table · trip-time awareness (countdown, today's
chapter, auto day-select mid-trip) · a print-ready paper trip sheet · licensed Wikimedia
photography layered over illustrated fallbacks. Everything trip-specific lives in the
trip's data file — see `docs/architecture.md`.

## Running

Pure static — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
```

No build step, no CDN dependencies: GSAP, Three.js, Leaflet, fonts (Fraunces + Space
Grotesk) and geo data are vendored under `assets/`. At runtime the pages stream only two
kinds of external content: CARTO/OSM map tiles and Wikimedia Commons photography — both
degrade gracefully (designed fallback tiles; illustrated heroes that stand alone).

Dev tools (screenshot/interaction harness): `cd tools && npm i` once, then **from the
repo root**: `node tools/shoot.mjs <page>.html <prefix>` and
`node tools/probe.mjs <page>.html` — see `docs/operations.md`.

## Structure

```
assets/
  css/         base.css (design system) · landing.css · trip.css (shared trip engine)
               · milan.css (accents) · vendor/
  js/          landing.js (globe + registry-driven landing) · trip.js (shared page logic)
               · trip-map.js (shared map engine) · vendor/
  data/        trips-index.js (trip registry) · rabat-data.js · milan-data.js
               · land-dots.js · morocco-outline.js · italy-outline.js
  fonts/       variable woff2 + OFL.txt
research/      research packs behind the content (ratings sources, image licensing)
tools/         self-contained dev harness: shoot/probe/gen-dots/set-site-url (npm i inside)
docs/          knowledge base incl. MIGRATION.md and the family preference library
```

## Licensing

Personal family project — the family's own content (copy, data, illustrations,
research) is not licensed for reuse. Vendored third-party components (GSAP, Three.js,
Leaflet, markercluster, the Fraunces & Space Grotesk fonts) remain under their own
licenses — see `THIRD-PARTY.md` and `assets/fonts/OFL.txt`.

## Data honesty

Every rating was researched with sources recorded in `research/` (Rabat: 11 Jun 2026,
Milan: 12 Jun 2026). Restaurants that miss the family's 4.5★ bar are shown with flags
rather than hidden or rounded up. Stay prices come from live Booking.com searches for
2 adults + 2 children on the exact trip dates.

Hero photos: Rabat — MarwanAndrew, CC BY-SA 4.0 · Milan — Daniel Case, CC BY-SA 3.0,
both via Wikimedia Commons, credited on-page.
