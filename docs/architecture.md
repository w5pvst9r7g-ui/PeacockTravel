# Architecture

## File map

```
index.html                 Landing — Three.js dotted globe (DUB→RBA + DUB→MIL arcs), trip cards
rabat.html / milan.html    Trip pages (same template DNA, per-trip hero scenes)
assets/
  css/base.css             Design system: palette tokens, fonts, nav, footer, [hidden] fix
      landing.css          Landing-only styles
      rabat.css            THE shared trip-page stylesheet (rb-* classes) — both trips use it
      milan.css            Small Milan overrides (hero bg, photo tint, footer stripe)
      vendor/              leaflet.css, MarkerCluster.css (+images/)
  js/ landing.js           Globe + landing animations
      rabat.js / milan.js  Trip page logic (render from data, animations, deep links, print…)
      rabat-map.js / milan-map.js   Leaflet map engines (per-trip constants, same API)
      vendor/              gsap, ScrollTrigger, three, leaflet, leaflet.markercluster
  data/ rabat-data.js      window.RABAT  (legacy global name)
        milan-data.js      window.TRIP   (the go-forward global name)
        land-dots.js       Globe land grid (generated: tools/gen-dots.mjs)
        morocco-outline.js / italy-outline.js   Map inset outlines (world-atlas 50m)
  fonts/                   Fraunces + Space Grotesk variable woff2 (@fontsource)
research/                  Source-cited research packs per trip (content + images)
tools/                     shoot.mjs, shoot-sections.mjs (verify harness), gen-dots.mjs
docs/                      This knowledge base
.github/workflows/pages.yml  Auto-deploy to GitHub Pages on push
```

Milan's `milan.js`/`milan-map.js` were produced by scripted transforms of the Rabat files
(see git history) — treat the pairs as siblings; a fix found in one usually belongs in both.

## The TRIP data schema (single source the page renders from)

```js
window.TRIP = {
  heroPhoto: { src, alt, credit, page } | null,   // Wikimedia hotlink; fades over illustration
  eatPhoto:  { src, credit } | null,              // dining-section arch photo
  pois: [{
    id, type: 'sight'|'food'|'stay'|'transit',
    name, lat, lng, area, desc, why,
    rating: { score|null, count|null, src|null },  // Booking.com src renders as n/10 badge
    img:   { src, credit }?,                       // photo banner in map card
    city?: 'Varenna',                              // Google-Maps query city (default Milan/Rabat)
    // food only:
    price: '€'|'€€'|'€€€', cuisine, bar: 'clear'|'near'|'icon', kid?: true,
    // stay only:
    style, book (Booking URL with dates+party), pick?: true   // front-runner ribbon
  }],
  days: [{
    n, dow, date, title, color, vibe, alt?,        // alt renders as the ⇄ dashed badge
    stops: [{ t, ic, label, note,
              poi?: id            // marker/card + route point
              anchor?: {lat,lng}  // route point without a card
              gq?: 'query'        // Google-link-only stop (off-map, e.g. Casablanca/Bergamo lunch)
    }]
  }],
  hoods: [{ name, tag, color, txt }],
  practical: [{ icon, k, v }]
}
```

Stop icon names (`ic`): plane bag food shop camera leaf tea landmark boat music bar paw art
beach sunset train moon — filled 24×24 paths in the ICONS dict of each page's JS.

## Map engine API (rabat-map.js / milan-map.js)

`window.RabatMap` / `window.MilanMap` expose: `init()` (idempotent, lazy-booted by an
IntersectionObserver 600px out), `setDay(n|'all', fly?)`, `focusPoi(id)` (force-inits),
`thumb(n)` → static mini-map SVG string for itinerary day cards.

Inside: CARTO Positron tiles (`light_all`, Night toggle → `dark_all`, persisted in
localStorage `rbMapStyle`), markercluster (night/gold badges, `disableClusteringAtZoom: 15`),
Catmull-Rom-sampled day routes + numbered badges + manifest panel, custom overlays
(district polygons, canals/rowboat, gold railway lines to the airports), Italy/Morocco inset,
geolocate button, designed error tiles, `errorTileUrl`, scale + attribution. Per-trip constants
at the top of each file: thumbnail BBOX/geometry, HOME bounds (+portrait variant), maxBounds,
minZoom, overlay coordinates.

Z-order contract: `.rb-map__canvas { z-index: 1 }` creates a stacking context that cages
Leaflet's internal panes below our panels (zoom rail, inset, manifest, card at z 5–6).

## Page-logic responsibilities (rabat.js / milan.js)

Render itinerary/eat/stays/hoods/practical from data · trip clock (countdown chip, today/past
day tags, mid-trip auto day-select; test via `window.__RB_NOW`) · Google-Maps links everywhere
· deep links `#poi=<id>` / `#day=<n>` (+ copy-link button; curtain skipped on deep-linked
arrival) · dining filter chips · stay Cards/Compare sortable table + walk-time badges
(straight-line km × 13 min) · print stylesheet + button · hero photo/eat photo progressive
loaders · GSAP: curtain, hero letters, parallax, reveals (`once: true`), counters.
