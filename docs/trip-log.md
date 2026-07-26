# Trip log — status, open decisions, alarms

Update this file whenever a trip page ships, a decision closes, or a date passes.
(Bookings source of truth: Gmail + Drive `trips.md`. This log is the site's working state.)
Last updated: 26 Jul 2026.

## 🇲🇦 Rabat — 19–22 Jun 2026 · `rabat.html` · TRAVELLED ✓
- FR162/FR163 · ref **H7M9XX** · €560.42 · was: Fri Casablanca day, Sat monuments +
  rowboat + Kasbah, Sun zoo/pizza/Chellah. Landing card auto-shows "Travelled ✓".
- **Post-trip debrief not captured** — run playbook step 5 · Learn: ask what landed,
  append to `docs/family-profile.md`, close this line.

## 🇮🇹 Milan — 9–12 Jul 2026 · `milan.html` · TRAVELLED ✓
- FR7799 (MXP in) / FR4845 (BGY out) · ref **A567VA** · €917.92 · parking Express Red.
  Was: Duomo rooftop Fri, Lake Como Sat, Bergamo finale Sun.
- **Post-trip debrief not captured** — step 5 · Learn, same as Rabat. Especially probe:
  did the Last Supper Wednesday-drop hunt work? Ostello-style stay verdict? Como swim?

## 🇲🇻 Maldives — 23 Jul–~6 Aug 2026 · NO PAGE · TRAVELLING NOW
- The family is there right now (landing board shows "Now travelling"). Two weeks.
- No page was requested — if one is wanted post-trip (photo log?), it's a new kind of
  page (retrospective, not planning); pitch before building.
- Post-trip: this trip answers the beach-vs-pool and heat-ceiling signals in
  `docs/family-profile.md` — capture them.

## 🇦🇺 Queensland — mid-Dec 2026–early Jan 2027 · NO PAGE · UPCOMING
- ~3 weeks, Christmas in the Australian summer. Booked (per Drive trips.md).
- Registry entry exists (board shows it as "Then Queensland · Christmas"). Build the
  page on request — Southern-Hemisphere summer will stress-test the playbook's
  seasonal assumptions nicely.

## Known debts (not blocking, but the honesty bar notices)
- **Three Milan stays have prices but no research entry**: Hotel Midway, Milan Retreats
  Duomo, Heart Milan Apartments Duomo appear in `milan-data.js` with live prices, but
  `research/milan-content.md` has no row for them — so those figures can't be traced to a
  source URL as `docs/standards.md` requires. Fix by re-running the Booking.com pass and
  recording the sources; don't invent them.
- Post-trip debriefs owed for both trips (see above) — the first real exercise of the
  `docs/family-profile.md` learning loop.

## Standing conventions
- Kids' ages for pricing searches: **8 and 10 (assumption — never confirmed)**; also
  tracked in `docs/family-profile.md` → Signals to confirm.
- Trip-clock logic is data-driven (`TRIP.meta.dep/ret/dayDates`); the landing computes
  upcoming/travelling/travelled from `trips-index.js` and flips cards automatically —
  no manual status edits needed anywhere.
- Post-trip content passes (photo sections, past-tense card copy) are deliberately
  unbuilt — the cards still speak pre-trip voice under a "Travelled ✓" badge. Pitch it
  as its own piece of work if wanted.
