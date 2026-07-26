# Standards — research, honesty, licensing, voice

## Ratings honesty (the family bar)
- Target: **Google 4.5★+ with a healthy review count**. State score + ~count + source next
  to every venue; `~` marks estimates. Where Google isn't verifiable, use a labelled
  alternative (Tripadvisor, Restaurant Guru, TheFork, Booking) — never present it as Google.
  For **food and stay** picks the alternative's *numeric* score still goes in `score` (the
  engine renders it unguarded — a null crashes the page); name the true provenance in `src`.
  Shipped pattern: milan-data.js's `src: 'Google-mirror · TA 4.1'`.
- Below-bar places are not hidden — they're grouped and flagged:
  `bar: 'clear'` (≥4.5) · `'near'` (4.3–4.4, "just under") · `'icon'` ("vibes pick", we say
  exactly why we'd still go: Café Maure's view, Luini's queue, Ratanà's critics).
- Booking.com scores are /10 and render as a gold badge, not stars. Don't convert scales.
- Every figure needs a source URL in the trip's `research/*-content.md`. Ratings get a
  "checked <month year>" stamp in the section sub-copy.
- Verify **day-of-week closures against the actual trip days** (Luini/Nerino closed Sundays
  reshaped Milan's plan; Friday prayers reshaped Rabat's). Build the closure matrix.

## Live pricing
- Stays quote **live Booking.com totals for the exact dates and party** (2 adults +
  2 children, assumed ages 8/10 — assumption is documented, keep it consistent), with
  per-night maths derived in-page. `book` links carry dates+party so one tap re-checks.
- Say the structural truth prices reveal — but quote the shipped set, not a remembered
  band (Milan: everything liveable — 3★ hotels, hostel family rooms, apartments and
  aparthotels — landed €0.7–1.9k for 3 nights, against a single €3.7k design-4★ address).

## Image licensing (non-negotiable)
- Wikimedia Commons only. Ship **VERIFIED licenses only**: PD/CC0/CC BY/CC BY-SA, with
  author + license recorded and a visible credit chip on the page (hero credit links the
  file page). PARTIAL-status finds stay in the research file until manually confirmed.
- Direct URLs are deterministic: `commons/<a>/<ab>/<File>` where `<a><ab>` = first hex chars
  of `md5(filename_with_underscores)`; thumbs `commons/thumb/<a>/<ab>/<File>/<W>px-<File>`.
  Always re-derive the hash locally before shipping a URL.
- Every photo is progressive enhancement over an illustrated fallback: hidden until `load`
  fires, absent without complaint (the sandbox proves the fallback on every screenshot).

## Design language (why the site looks like one thing)
- Palette tokens in base.css: night/cream/sand + teal/mint/gold/terracotta/majorelle.
  Type: Fraunces (display; one italic-gold letter in each trip's hero wordmark) +
  Space Grotesk (UI). Motifs: eight-point zellige stars, crenellated skyline section
  transitions, arch-framed photos, grain overlay, per-day colors (terracotta/teal/
  majorelle/gold for days 1–4).
- Every animation respects `prefers-reduced-motion`. Anything that can fail (photos, tiles,
  JS) degrades to something that still looks intentional.

## Copy voice
- First-person-plural family voice ("our base", "the kids will demand a second crossing").
  Specific numbers over adjectives. Kid logistics are content, not an afterthought.
  Warnings are cheerful but hard ("Funicular down — the hard rule").
- Trip pages may carry booking refs (family accepts this on the public site — flagged and
  acknowledged for Rabat). Never add data the family didn't already expose.
