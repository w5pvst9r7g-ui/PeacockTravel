# Peacock Travel — The Family Atlas

A fully self-contained static site for planning the Peacock family's trips.

## Pages

- **`index.html`** — landing page: an interactive 3D dotted globe (Three.js) tracing the
  Dublin → Rabat flight arc, the departures board of upcoming trips, and the family crew.
- **`rabat.html`** — the Rabat 2026 trip (Fri 19 → Mon 22 Jun, FR 162/163, booking H7M9XX):
  - day-by-day itinerary, every stop linked to the map
  - custom interactive SVG map of Rabat & Salé, projected from real coordinates
    (day routes, restaurant/stay/sight layers, pan/zoom/pinch, detail cards, Morocco inset)
  - the table list — restaurants with verified Google ratings (honest flags for icons below the 4.5★ bar)
  - stay options with live Booking.com pricing for the trip dates and deep links
  - neighbourhood guide, optional Casablanca day-trip, practical facts

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

## Data honesty

Every rating on the Rabat page was researched 11 Jun 2026 with sources recorded in
`research/rabat-content.md`. Restaurants that miss the family's 4.5★ bar are shown with
flags rather than hidden or rounded up. Stay prices come from a live Booking.com search
for 2 adults + 2 children, 19–22 Jun 2026.

Hero photo: MarwanAndrew, CC BY-SA 4.0, via Wikimedia Commons.
