# Playbook — adding a trip page

Proven twice (Rabat, Milan). Milan is the copy-source of record: it uses the `window.TRIP`
global and the newest engine. Budget a session; the research agents run ~10–15 min in parallel
with the build.

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
1. `assets/data/<trip>-data.js` — stub `window.TRIP` with a few pois/days so the template
   smoke-tests; replace with the researched file when agents land.
2. `assets/js/<trip>-map.js` — copy milan-map.js; swap: global name, thumbnail BBOX + KMX
   latitude, thumb/overlay geometry (rings/rivers/rails of the new city), HOME (+portrait),
   maxBounds (wide enough for day-trip markers — day tabs flying out of the city is a
   signature moment), minZoom, inset outline (generate via `tools/gen-dots.mjs` pattern from
   world-atlas 50m → `assets/data/<country>-outline.js`), Google-query default city.
3. `assets/js/<trip>.js` — copy milan.js; swap DEP/RET datetimes (mind time zones),
   `dayStart` month/day math, curtain word + trip №, walk anchors + labels
   (Duomo/Castello → local equivalents), eatBucket regexes + chip labels, countdown wording.
4. `<trip>.html` — copy milan.html; new hero scene SVG (sky gradient + 2–3 silhouette layers
   in the city's palette), title letters (one italic-gold), chips, brief lede + 4 facts,
   day-tab labels, extra-section card, footer word, og: meta (og:image = hero photo 1280).
5. `assets/css/<trip>.css` — hero bg + photo tint + footer stripe only. Everything else is
   rabat.css (shared).
6. Landing: trip card (new SVG art), globe arc + pin + board line in landing.js
   (follow the MIL diff), manifest note if the roster changed.

## 3 · Verify (all of it, headless)
- `node tools/shoot.mjs <trip>.html x` — zero non-blocked issues both viewports.
- Interaction probe (copy /tmp patterns from history or improvise): each day tab (routes,
  manifest, numbered badges), `focusPoi` card **with a photo poi**, deep link
  `#poi=…` cold-load, stay Compare toggle + a sort, dining filter, `__RB_NOW` mid-trip
  simulation (chip text, past/today tags, auto day-select).
- Photo-state test: rewrite `img.src` to a local asset in-page to see loaded layout;
  a dead URL to see the fallback.

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
