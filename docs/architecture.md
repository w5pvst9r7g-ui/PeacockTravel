# Architecture

One shared engine renders every trip page from its data file; the landing renders from a
trip registry. Adding a trip touches data + thin shell files only — no engine copying.
(Historical note: class prefixes `rb-`/`mc-`/`lf-` date from when Rabat was the only page;
they are shared names now, not Rabat-specific.)

## File map

```
index.html                 Landing — Three.js dotted globe, cards/board/marquee from the registry
rabat.html / milan.html    Trip-page shells (bespoke hero scenes; same body plan)
assets/
  css/base.css             Design system: palette tokens, fonts, nav, footer, [hidden] fix
      landing.css          Landing-only styles
      trip.css             THE shared trip-page stylesheet (rb-* classes, all trips)
      milan.css            Milan accents only (hero bg, photo tint, footer stripe)
      vendor/              leaflet.css, MarkerCluster.css (+images/)
  js/ landing.js           Globe + landing sections, driven by window.TRIPS
      trip.js              Shared trip-page logic (renders from window.TRIP)
      trip-map.js          Shared Leaflet map engine (window.TripMap, config from TRIP.map)
      vendor/              gsap, ScrollTrigger, three, leaflet, leaflet.markercluster
  data/ trips-index.js     window.TRIPS — the trip registry (landing's single source)
        rabat-data.js      window.TRIP for the Rabat page (meta + map + content)
        milan-data.js      window.TRIP for the Milan page
        land-dots.js       Globe land grid (generated: tools/gen-dots.mjs)
        morocco-outline.js / italy-outline.js   Map inset outlines (world-atlas 50m)
  fonts/                   Fraunces + Space Grotesk variable woff2 (+ OFL.txt — keep together)
research/                  Source-cited research packs per trip (content + images)
tools/                     Self-contained dev harness — package.json, shoot/probe/gen-dots,
                           lib/harness.mjs, set-site-url.mjs; output → tools/shots/ (gitignored)
docs/                      This knowledge base (incl. family-profile.md, MIGRATION.md)
THIRD-PARTY.md             Licenses of everything vendored
.github/workflows/pages.yml  Auto-deploy to GitHub Pages on push (publishes the WHOLE repo)
```

## The TRIP data schema (a trip page's single source)

Load order in the shell: outline → data → trip-map.js → trip.js.

```js
window.TRIP = {
  meta: {                     // ── engine config: trip identity + behavior
    slug, city,               // city = Google-Maps query suffix (poi.city overrides per-poi)
    inPlace,                  // chip wording mid-trip: "we're in Italia"
    curtain: { word, sub },   // intro curtain
    dep, ret,                 // ISO datetimes WITH UTC offsets (flight moments)
    tz,                       // destination UTC offset, e.g. '+02:00'
    dayDates: ['2026-07-09', …],  // one calendar date per itinerary day (drives day count,
                              //   today/past tags, chip day number, auto day-select)
    nights,                   // per-night maths + compare-table header
    stayDist: {               // stay-card distance lines
      anchors: [{label,lat,lng}, {label,lat,lng}],   // walk targets (col header = anchors[0])
      far: { emoji, label, perKmMin, minMin },       // >32 walk-min mode (taxi/metro)
      special?: [{ re, template, short }]            // area-regex overrides;
    },                        //   template: '⛵ rowboat across + {min} min → Kasbah'
    eatBuckets: [{ key, label, re?, default?: true }] // area filter chips, in chip order
  },
  map: {                      // ── map-engine config (trip-map.js)
    home, homePortrait,       // fitBounds pairs (landscape/portrait stages)
    maxBounds, minZoom,
    inset: { outlineGlobal: 'IT_OUTLINE', dot: [lat, lng] },
    thumb: { bbox: {latMin,latMax,lngMin,lngMax}, refLat,   // refLat also fixes walk-time km()
             lines: [ptsArray, …] },                        // thumbnail-only geography
    geometry: {                                             // live-map overlays
      polygons:  [{ pts, style, tooltip? }],
      polylines: [{ pts, style, tooltip?, curve?: false }]  // curve defaults ON (Catmull-Rom)
    }
  },
  heroPhoto: { src, alt, credit, page } | null,   // Wikimedia hotlink over the illustration
  eatPhoto:  { src, alt, credit } | null,         // dining arch photo (+ #eat-credit fill)
  pois: [{
    id, type: 'sight'|'food'|'stay'|'transit',
    name, lat, lng, area, desc, why,
    rating: { score, count|null, src },
      // score MUST be a number for food & stay — trip.js calls .toFixed(1) unguarded and a
      //   null throws inside the top-level IIFE, killing every later render on the page.
      // src is interpolated raw for food & stay — a null prints the literal "null".
      // score/count/src may be null ONLY for sight & transit (trip-map.js guards those).
      // src === 'Booking.com' renders the score as an n/10 gold badge instead of stars.
    img:   { src, credit }?,                       // photo banner in map card
    city?: 'Varenna',                              // per-poi Google-Maps city override
    price,   // REQUIRED on food AND stay (different shapes, below); optional on
             //   sight/transit, where trip-map.js appends it to the map card's area line.
    // food only:
    cuisine, bar: 'clear'|'near'|'icon', kid?: true,   // ≥1 food poi must set kid (probe asserts it)
    //   price is exactly '€' | '€€' | '€€€' — '€' is what the "cheap eats" chip matches
    // stay only:
    style, book (Booking URL with dates+party), pick?: true,  // front-runner ribbon
    //   price is the TOTAL for the whole stay: '€854 · 3 nights', ranges allowed as
    //   '≈ €700–840 · 3 nights' (en-dash, optional ≈). perNight() parses the first number
    //   (and the second for ranges) and divides by meta.nights; the compare table prints
    //   price.split('·')[0] and sorts on the first number — keep the ' · N nights' suffix
    //   and the comma thousands separators.
  }],
  days: [{
    n, dow, date, title, color, vibe, alt?,        // alt renders as the ⇄ dashed badge
    stops: [{ t, ic, label, note,
              poi?: id            // marker/card + route point
              anchor?: {lat,lng}  // route point without a card
              gq?: 'query'        // Google-link-only stop (off-map, e.g. Casablanca lunch)
    }]
  }],
  hoods: [{ name, tag, color, txt }],
  practical: [{ icon, k, v }]
}
```

Data files are plain scripts: geometry can be computed (`_ellipse()` in milan-data.js) and
shared between `thumb.lines` and `geometry` by declaring `var` arrays above `window.TRIP`.
Rabat's thumbnail coast/rivers are thumbnail-only; its medina/kasbah polygons are
overlay-only — the two sets are independent on purpose.

Stop icon names (`ic`): plane bag food shop camera leaf tea landmark boat music bar paw art
beach sunset train moon — filled 24×24 paths in trip.js's ICONS dict (a shared superset).

## The TRIPS registry (the landing's single source)

`assets/data/trips-index.js` → `window.TRIPS`: one entry per trip (field list documented in
the file header). Status upcoming/travelling/travelled is computed from dep/ret at load
(honours `__TRIP_NOW`). Cards render for entries with `page`; globe arcs/pins for entries
with `coords`; the departures board + marquee follow the featured trip (live, else next
upcoming); pageless entries (Maldives, Queensland) keep the board truthful. Camera + plane
follow the featured *destination* (next upcoming with coords, else most recently returned).
Card art is cloned from the `<template>` named by the entry's `art` field (convention
`art-<slug>`); a missing or unknown `art` falls back silently to `art-generic`.

## Map engine API (trip-map.js)

`window.TripMap`: `init()` (idempotent, lazy-booted by an IntersectionObserver 600px out),
`setDay(n|'all', fly?)`, `focusPoi(id)` (force-inits), `thumb(n)` → static mini-map SVG.

Inside: CARTO Positron tiles (`light_all`, Night toggle → `dark_all`, persisted as
localStorage `ptMapStyle`, legacy `rbMapStyle` read as fallback), markercluster
(`disableClusteringAtZoom: 15`), Catmull-Rom day routes + numbered badges + manifest panel,
data-driven overlays/inset (see TRIP.map), geolocate, designed error tiles, scale +
attribution (license-required — keep).

Z-order contract: `.rb-map__canvas { z-index: 1 }` creates a stacking context that cages
Leaflet's internal panes below our panels (zoom rail, inset, manifest, card at z 5–6).

## Page-logic responsibilities (trip.js)

Render itinerary/eat/stays/hoods/practical from data · trip clock (countdown chip, today/
past tags, mid-trip auto day-select — all calendar-day based via meta.dayDates; test with
`window.__TRIP_NOW`, legacy `__RB_NOW` honoured) · Google-Maps links everywhere
(poi.city || meta.city) · deep links `#poi=<id>` / `#day=<n>` (validated against
days.length; curtain skipped on deep-linked arrival) · dining filter chips (meta.eatBuckets
+ kid/cheap) · stay Cards/Compare sortable table + walk-time badges (straight-line km × 13
min at map.thumb.refLat) · print stylesheet + button · hero/eat photo progressive loaders ·
GSAP: curtain, hero letters, parallax, reveals (`once: true`), counters.

Engine rule: **one engine, two live pages** — any change to trip.js / trip-map.js /
trip.css must be verified on BOTH pages (shoot + probe) before push.
