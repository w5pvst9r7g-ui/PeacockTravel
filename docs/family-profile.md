# Family profile — the preference library

**Every recommendation flows through this file.** Read it before researching a trip;
write to it whenever the family reveals a preference. This is how the atlas gets to know
the family better with every trip — treat it as append-and-promote, never rewrite:
add categories and log entries freely, promote a repeated signal into Tastes, and only
delete something when the family contradicts it (note the reversal in the log).

Schema v1 · started 26 Jul 2026 · seeded from the Drive cowork project
(`travel_planning.md`, `trips.md`, and `data/preferences.json` — the machine-readable
twin the flight scanner uses; last synced from its 18 Jul 2026 version, re-sync when it
changes), docs/standards.md, and the choices actually made on the Rabat + Milan pages.
Process rules (booking checklist, parking how-to, calendar invite rule) live in the
Drive project — this file is *taste*, not *process*.
This file is public with the rest of the repo — never add personal data the family
hasn't already exposed or explicitly asked to record (no emails, no addresses, no school
names, and none of the work-calendar keywords from preferences.json — those stay in
Drive).

## Travellers

- **Grant** — route plotter. · **Annamaria** — chief booker (Ryanair itineraries usually
  arrive via her Gmail forwards). · **Hailey** — snack scout, votes beach. ·
  **Jean-Luc** — window watcher, votes dinosaurs.
- Home base **Dublin (DUB)**, drive + park at the airport. Four seats together, ideally
  one row.
- Kids' ages for pricing searches: **8 and 10 — ASSUMPTION, never confirmed.** Keep it
  consistent in every search; confirm with the family when it naturally comes up, then
  update here and in docs/standards.md.

## Hard rules (never violate)

- **4.5★ Google bar with real review volume** — flag below-bar picks, never round up
  (full policy: docs/standards.md).
- **One room sleeps four** — quad/family room or apartment; never split the family.
- **Wikimedia-verified images only** on the site (docs/standards.md).
- Booking process (parking trigger, calendar invite, records) is the Drive project's
  checklist — the site never invents booking state; Gmail is truth.

## Tastes by category

*(Add categories at the end; date-stamp any promotion from the log.)*

- **Ratings — top Google ratings only.** The family's №1 filter: 4.5★+ on Google with a
  healthy review count before anything gets recommended — restaurants, sights, stays
  alike. Below-bar entries appear only grouped-and-flagged (`near` / `icon`), never
  silently mixed in. (Enforcement details: Hard rules + docs/standards.md.)
- **Activities — water, adventure, food.** The family's stated big three (Drive
  planning guide). Every itinerary should score on at least two of them; the third
  usually shows up as a market/food-queue moment.
- **Water** — the reliable hit. Swimming anchors made both itineraries (Bou Regreg
  rowboat crossing, Lido di Menaggio); Maldives is two whole weeks of it. Every trip
  should have at least one "get wet" moment.
- **Food** — street-food queues and market energy over white tablecloths: Luini's
  panzerotti queue, tagine at Dar Naji, gelato strategy as itinerary content. One
  below-bar "vibes pick" per trip is allowed when the *why* is stated (Café Maure's
  ramparts view, Ratanà's critics).
- **Pace** — kid-paced: one big anchor per day, built-in playground/park/splash valves,
  cheerful-but-hard exit rules ("Funicular down — 13:30", "the 19:37 train home").
  Prefer civilised flight times over red-eye savings.
- **Views & heights** — rooftops and ramparts land every time: Duomo terraces, Kasbah
  lookout, Città Alta funicular. Book the earliest slot; mornings beat crowds and heat.
- **Transport as attraction** — trains, trams, ferries, funiculars and rowboats are
  itinerary items, not logistics. The kids will demand a second crossing.
- **Stays** — value-structural: apartments/aparthotels and character stays (riads,
  Ostello Bello's 24h-desk sociability) over €3k hotels; location that shortens small
  legs beats stars. Live Booking.com totals for the exact dates decide it.
- **Climate & feel** — "distinctly different from Ireland": warm, Mediterranean, exotic,
  culturally distinct. Deprioritise northern-European lookalikes. Plan seasonally;
  offer a few options per slot; block anchor trips early; avoid unintended repeats
  (a destination Hailey did solo is NOT "done" as a family trip).
- **Destination priorities, in the family's own weights** (preferences.json
  `fit_weights`): **novelty first** (3), then climate (2), then wishlist match and
  season (1.5 each), then activity supply (1). When two options tie on vibes, the one
  nobody has been to wins.
- **Weekend-hop shape & flight windows** (preferences.json — the scanner's rules, and
  good defaults for any short-trip suggestion): 2–4 nights · guideline budget
  ~€300 pp return · outbound Thu 17:30–22:00 or Fri 06:30–11:30 · return Sun departing
  ≥10:00 and landing DUB ≤22:00 (Mondays only when the calendar is marked good) ·
  **never** depart before 06:00 or land after 23:00 — "family with two kids: no
  red-eyes, no very-late landings" · under-seat bags only on hops · budget carriers
  fine (Ryanair dominates DUB). Big anchor trips (Maldives, Queensland) play by their
  own rules — these windows govern the in-between weekends.

## Learned per trip (append-only log)

### Template
```
### <Trip> — <dates> · logged <date>
- Landed: …
- Flopped / friction: …
- New signals: …
```

### Rabat — 19–22 Jun 2026 · logged 26 Jul 2026 (from the plan as shipped)
- Planned around: Friday = Casablanca day (Hassan II Mosque tour + Rick's Café),
  rowboat crossing + Kasbah golden hour, zoo + pizza day, storks at Chellah at 16:00.
- Stay decision was value-led: medina riads at ~€150/night beat hotel pricing;
  front-runner Dar Shaeir (Booking 9.3/889).
- Six kid-win tables out of twelve — kid logistics were content, not an afterthought.
- **Post-trip debrief not yet captured** — ask the family what actually landed and
  append here (first real test of this log).

### Milan — 9–12 Jul 2026 · logged 26 Jul 2026 (from the plan as shipped)
- Planned around: Duomo rooftop 09:00 slot, Lake Como Saturday with a swim anchor,
  Bergamo Città Alta finale with hard down-rule, Navigli dinner.
- Structural price truth: the whole workable shortlist sat €0.7–1.9k for 3 nights (Hotel
  Midway €722 up to 21HoS Navigli €1,872) against one €3.7k design-4★ splurge (Room Mate
  Giulia) — drove the shortlist; Ostello Bello Centrale front-ran on the 00:30 arrival
  (24h desk). Note: cheap did NOT mean apartment-only — the cheapest option was a hotel.
- Reservation-window lesson: Last Supper weekly drops + Trippa's 1-month window —
  **research must surface booking-window alarms early**, they beat design polish.
- **Post-trip debrief not yet captured** — ask and append.

## Signals to confirm

*(Hypotheses agents should probe on the next trip — move up to Tastes once confirmed.)*

- Real kid ages (replaces the 8/10 assumption everywhere).
- Museum tolerance: how long before the kids melt — did anything indoor hold them?
- Spice/adventurous-eating ceiling (tagine yes; how far does it stretch?).
- Beach vs pool preference (Maldives will answer this).
- Hostel-style social stays: did Ostello Bello's vibe work for the family?
- Heat ceiling for midday activities (Rabat June + Milan July are data points).

## How the loop runs

1. **Before research** (playbook step 0): read this file; paste Hard rules + relevant
   Tastes into every research-agent prompt.
2. **During planning**: when the user states a preference in conversation, write it here
   in the same session (CLAUDE.md golden rule).
3. **After the trip** (playbook step 5 · Learn): ask what landed/flopped, append a log
   entry, promote repeated signals into Tastes, prune disproven ones with a note.
