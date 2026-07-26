# Playbook — adding a trip page

Proven twice (Rabat, Milan), then the engine was unified — a new trip is now a **data file
+ thin page shell + one registry entry**; the engine (trip.js / trip-map.js / trip.css) is
never copied. milan-data.js is the shape reference of record. Budget a session; the
research agents run ~10–15 min in parallel with the build.

## 0 · Facts first (never guess)
0. **Read `docs/family-profile.md`** — the preference library. Its Hard rules + relevant
   Tastes sections get pasted into every research-agent prompt in step 1; its "Signals
   to confirm" tells the agents what to probe this trip.
1. Gmail: search the destination — the Ryanair itinerary is usually forwarded by Annamaria
   (`Fwd: Ryanair Travel Itinerary`). Extract: flight numbers, airports (**check for
   split-airport returns** — Milan was in-MXP/out-BGY), times, booking ref, price, passengers.
2. Drive cowork project (folder `1Y2tCzMlbHGqvv19UTCS57T_-Js5P7X1t`): `trips.md` row for the
   trip (parking status, notes) + `travel_planning.md` for the family's booking checklist
   (calendar-invite rule, parking, quad-room requirement) and destination preferences
   (water, adventure, food; kid-paced; unlike Ireland).
3. Note what's still OPEN (usually the hotel) — that's what the Stay section must decide.

## 1 · Research (background agents, in parallel)
- **Content agent** (general-purpose): sections = restaurants (12–14, Google ≥4.5 target,
  flag below-bar, coords 4dp, day-of-week closures!), stays (family-of-four units), sights
  (booking leads + prices + closure days vs the actual trip days), itinerary under the real
  constraints (arrival hour, split airports, day-trip options), neighbourhoods, practicals,
  map coordinates. **Prompt must say: no sub-agent delegation; Write the output file before
  finishing.** Output → `research/<trip>-content.md`.
- **Imagery agent**: Wikimedia Commons only; per subject the file page, direct URL, 1280px
  thumb, dimensions, author, license, VERIFIED/PARTIAL. Direct URLs follow the MD5 scheme —
  cross-check every path yourself: `printf '%s' "File_name.jpg" | md5sum | cut -c1-2`
  → `/<a>/<ab>/`. Output → `research/<trip>-images.md`. Ship VERIFIED-license files only.
- **Booking.com MCP** (yourself, meanwhile): live search for the exact dates,
  2 adults + 2 children **ages 8, 10 (assumption — real ages unknown; keep consistent)**;
  then a `hotel_names` pass for the agent's shortlist. Record 3-night totals; keep the
  booking URLs (they carry dates+party) for the `book` field.

## 2 · Build (start while agents run — stub data first)
1. `assets/data/<trip>-data.js` — the only substantial file. Copy milan-data.js as the
   shape reference; fill `window.TRIP` (full schema: docs/architecture.md):
   - `meta` — dep/ret with the right UTC offsets + dayDates + destination tz (from step 0),
     curtain word + trip №, `city` for Google queries, eatBucket chips, `stayDist`
     anchors = the trip's two walk targets (Duomo/Castello → local equivalents), plus
     `far` (taxi vs metro voice) and any `special` cases (the Salé rowboat pattern).
   - `map` — HOME (+portrait) and maxBounds wide enough for day-trip markers (day tabs
     flying out of the city is a signature moment), minZoom, thumb bbox + refLat,
     stylised thumb lines + overlay geometry (declare shared point arrays above
     `window.TRIP`; `_ellipse()` in milan-data.js shows computed geometry), inset outline
     (generate via the `tools/gen-dots.mjs` pattern from world-atlas 50m →
     `assets/data/<country>-outline.js`).
   - Stub a few pois/days first so the shell smoke-tests; swap in researched content
     when the agents land.
2. `<trip>.html` — copy milan.html; swap the bespoke parts only: og: meta (og:image =
   hero photo 1280), hero scene SVG (sky gradient + 2–3 silhouette layers in the city's
   palette), title letters (one italic-gold), chips, brief lede + 4 facts, day-tab labels
   (one per day), extra-section card, footer word. Script tags already point at the
   shared engine (outline → data → trip-map.js → trip.js) — copy them as-is.
3. `assets/css/<trip>.css` — hero bg + photo tint + footer stripe only (see milan.css).
   Everything else is trip.css (shared). Body class: `trip-page <slug>`.
4. Landing — exactly two touches: one registry entry in `assets/data/trips-index.js`
   (the file header documents every field) + one `<template id="art-<slug>">` card scene
   in index.html. Cards, globe arc + pin, board, marquee and footer links all follow.

## 3 · Verify (all of it, headless)
- `node tools/shoot.mjs <trip>.html x` — zero non-noise issues both viewports (exit 0).
- `node tools/probe.mjs <trip>.html` — the committed interaction probe covers the whole
  checklist: every day tab (routes, manifest, numbered badges), a photo-poi card incl.
  its Google-Maps query, thumbs, `#poi=`/`#day=` cold loads (curtain skipped), dining
  filters, Compare toggle + sorting, and `__TRIP_NOW` pre/mid/post simulations
  (chip text, today tags, auto day-select). All checks must PASS (exit 0).
- Photo-state test (manual): rewrite `img.src` to a local asset in-page to see loaded
  layout; a dead URL to see the fallback.
- Engine rule: if you touched trip.js / trip-map.js / trip.css at all, shoot + probe
  **both existing pages** too.

## 4 · Ship & close the loop
- Commit (message = what a reader needs, session link footer), push → auto-deploy;
  confirm the run via `actions_list` + `jq` on the saved output file.
- Update `docs/trip-log.md` (status, open decisions, dated booking alarms) and README's
  feature list if the engine grew.
- Send the user screenshots: hero, itinerary, the map's signature flight, tables, stays.
- Flag loudly anything time-critical found in research (sold-out tickets, reservation
  windows) — those beat design polish in the final message.

## 5 · Learn (after the trip — how the atlas gets smarter)
- Ask the family what landed and what flopped; append a dated entry to the log in
  `docs/family-profile.md` (template inside).
- Promote signals seen twice into the Tastes section; prune anything disproven (leave a
  dated note, don't silently delete). Check off any "Signals to confirm" the trip answered.
- Whenever the user reveals a preference mid-conversation — any session, any topic —
  write it into the profile then and there.
