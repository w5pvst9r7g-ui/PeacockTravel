# Peacock Travel — The Family Atlas

A fully self-contained static site for planning the Peacock family's trips.

**Live:** https://w5pvst9r7g-ui.github.io/PeacockTravel/ — every push to the working branch
auto-deploys via GitHub Actions.

**Project knowledge base:** `CLAUDE.md` (session memory) + `docs/` — architecture, the
new-trip playbook, research/licensing standards, operations & gotchas, and the live trip log.

## Pages

- **`index.html`** — landing page: an interactive 3D dotted globe (Three.js) tracing the
  Dublin → Rabat and Dublin → Milano flight arcs, the departures board of upcoming trips,
  and the family crew.
- **`milan.html`** — Milano 2026 (Thu 9 → Sun 12 Jul, FR7799/FR4845, booking A567VA): first
  family trip to Italy — Duomo-rooftop morning, Lake Como Saturday, Bergamo Città Alta
  finale, Last Supper booking playbook, live-priced family stays, all on the same live-map
  engine as Rabat.
- **`rabat.html`** — the Rabat 2026 trip (Fri 19 → Mon 22 Jun, FR 162/163, booking H7M9XX):
  - day-by-day itinerary with per-stop icons, clickable mini-map route thumbnails,
    Google Maps links on every stop, and a live countdown chip in the hero
  - real-geography interactive map: grey OpenStreetMap basemap (CARTO Positron,
    vendored Leaflet) with a Paper/Night style toggle, marker clustering, day
    routes with numbered stops and a synced manifest, photo detail cards,
    medina/kasbah district tints, the ONCF railway to Casablanca, find-us
    geolocation, designed fallback tiles, lazy boot, and shareable deep links
    (#poi=…, #day=…)
  - the table list — verified Google ratings (honest flags below the 4.5★ bar)
    with old-town/centre/south, kid-wins and cheap-eats filters
  - stay options with live Booking.com pricing, computed walk/taxi times, a
    sortable comparison table, a front-runner pick, and booking + Google links
  - trip-time awareness (countdown, today's chapter, auto day-select mid-trip),
    a print-ready paper trip sheet, Friday Casablanca plan, neighbourhood guide,
    practical facts; licensed Wikimedia photography layered into the illustrated hero

## Running

Pure static — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
```

No build step, no CDN dependencies: GSAP, Three.js, fonts (Fraunces + Space Grotesk) and
geo data are vendored under `assets/`. The only network request is the Rabat hero photo,
hotlinked from Wikimedia Commons — if it can't load, the illustrated hero stands alone.

## Structure

```
assets/
  css/         base.css (design system) · landing.css · rabat.css
  js/          landing.js (globe) · rabat.js (page) · rabat-map.js (map engine) · vendor/
  data/        land-dots.js (globe) · morocco-outline.js (inset) · rabat-data.js (trip content)
  fonts/       variable woff2
research/      research packs behind the content (ratings sources, image licensing)
tools/         dev-only: dot-grid generator, headless-Chrome screenshot/verification harness
```

## Licensing

Personal family project — the family's own content (copy, data, illustrations,
research) is not licensed for reuse. Vendored third-party components (GSAP, Three.js,
Leaflet, markercluster, the Fraunces & Space Grotesk fonts) remain under their own
licenses — see `THIRD-PARTY.md` and `assets/fonts/OFL.txt`.

## Data honesty

Every rating on the Rabat page was researched 11 Jun 2026 with sources recorded in
`research/rabat-content.md`. Restaurants that miss the family's 4.5★ bar are shown with
flags rather than hidden or rounded up. Stay prices come from a live Booking.com search
for 2 adults + 2 children, 19–22 Jun 2026.

Hero photo: MarwanAndrew, CC BY-SA 4.0, via Wikimedia Commons.
