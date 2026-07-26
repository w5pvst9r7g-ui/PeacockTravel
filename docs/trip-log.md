# Trip log — status, open decisions, alarms

Update this file whenever a trip page ships, a decision closes, or a date passes.
(Bookings source of truth: Gmail + Drive `trips.md`. This log is the site's working state.)
Last updated: 12 Jun 2026.

## 🇲🇦 Rabat — 19–22 Jun 2026 · `rabat.html` · SHIPPED
- FR162 DUB 07:55→RBA 11:20 · FR163 RBA 11:40→DUB 15:05 · ref **H7M9XX** · €560.42 ·
  Dublin parking booked. Data global: `window.RABAT`.
- Plan: Fri = Casablanca day (16:00 Hassan II Mosque tour slot; Friday slots 9/10/15/16h),
  Sat = Rabat monuments + rowboat + Kasbah, Sun = zoo/pizza/Chellah, Mon = home.
- **Open:** hotel not booked. Front-runner on page: Dar Shaeir (€464/3n, Booking 9.3/889).
- **Do before 19 Jun:** book stay · book Hassan II Mosque tour + Rick's Café (Friday) ·
  reserve Dar Rbatia (Fri… note: itinerary now has Rbatia on **Saturday** dinner) ·
  print the trip sheet.

## 🇮🇹 Milan — 9–12 Jul 2026 · `milan.html` · SHIPPED
- FR7799 DUB 19:20→MXP 22:55 (Thu) · FR4845 **BGY** 17:25→DUB 19:00 (Sun) · ref **A567VA** ·
  €917.92 · Dublin parking booked (Express Red, DUBMP17810786865). First family Italy trip.
  Data global: `window.TRIP`.
- Plan: Thu late arrival (€110 fixed taxi; 00:26 last Cadorna train as plan B) ·
  Fri Duomo-rooftop 09:00 → Galleria → Luini → tram → Castello → Navigli/Conchetta ·
  Sat Lake Como (kids free on Trenord — Io Viaggio in Famiglia form; €15.20 ferry day pass;
  Lido di Menaggio swim anchor; 19:37 train home rule) ·
  Sun Gae Aulenti splash → Bergamo: left-luggage €6 → Città Alta funicular →
  13:30 down-rule → BGY (bag drop closes **16:45**; Fast Track €9).
- **Open:** hotel not booked. Front-runner on page: Ostello Bello Centrale (€854/3n,
  24h desk for the 00:30 arrival). Cheapest: Midway €722 (TA-score caveat).
- **Dated alarms:**
  - **Wed 1 Jul & Wed 8 Jul, 12:00 CET** — official Last Supper weekly ticket drops
    (May–Aug batch sold out; resellers €45–120pp are the fallback; under-18 free but seated).
  - **~9 Jun onward** — Trippa reservations open ~1 month ahead and vanish in minutes.
  - **This week** — book: Duomo Combo 09:00 slot (Fri 10), Science-Museum/Toti (if Sat flips
    to plan B), Conchetta (Fri dinner), stay.
  - Sat 4 Jul — Lombardy saldi start; their weekend = sales week one (crowds + bargains).

## Later (booked, no pages yet)
- 🇲🇻 Maldives — 23 Jul–~6 Aug 2026, two weeks, family.
- 🇦🇺 Queensland — mid-Dec 2026–early Jan 2027, ~3 weeks.
- Landing page lists these in the manifest note; build pages on request.

## Standing conventions
- Kids' ages for pricing searches: **8 and 10 (assumption — never confirmed)**.
- Countdown/trip-clock logic keys off flight datetimes in each page's JS (`DEP`/`RET`,
  `dayStart`) — Rabat's flips to "in Morocco" mode 19–22 Jun automatically; Milan's 9–12 Jul.
- After Rabat ends its chip reads "Home with stories" — consider a post-trip pass
  (photos section? mark the card "travelled ✓" on the landing page).
