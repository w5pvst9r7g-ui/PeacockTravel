/* Peacock Travel — the trip registry (drives the landing page)
   One entry per trip, newest booking last. The landing derives everything
   trip-shaped from here: cards, globe arcs + pins, the departures board,
   marquee, manifest note, nav CTA and footer links. Booked-but-pageless
   trips carry no page/coords — they appear on the board + manifest only.

   Adding a trip = one entry here + (if it has a page) one
   <template id="art-<slug>"> card scene in index.html.

   Fields:
     slug             unique id
     name / place     card title pieces ("Milano" / "Italia")
     page             trip page href (omit while the page is unbuilt)
     dep / ret        ISO datetimes with UTC offsets — drive status
                      (upcoming / travelling / travelled) and ordering
     dates            display date range for the card + board
     desc             card paragraph
     facts[]          card fact chips
     art              <template> id with the card's bespoke SVG scene
     coords           destination lat/lng — globe arc + pin (omit = off-globe)
     arcColor         three.js hex int for the flight arc
     markerColor      three.js hex int for the destination dot
     pinColor         CSS color for the HTML pin chip
     lift             arc height factor  ·  halo [dLat, dLng] gold-dot spread
     pinLabel         globe pin text
     route            departures-board route ("DUB → RBA")
     boardWhen        board line 2 ("Fri 19 Jun 2026 · 07:55")
     boardDetail      board line 3 ("Ryanair FR 162 · 4 seats, row 23")
     shortWhen        "Then <name> · <shortWhen>" board line
     marquee[]        marquee phrases while this trip is the featured one
     manifest         one-liner for the "also on the manifest" note
*/
window.TRIPS = [
  {
    slug: 'rabat',
    name: 'Rabat', place: 'Morocco',
    page: 'rabat.html',
    dep: '2026-06-19T07:55:00+01:00',
    ret: '2026-06-22T15:05:00+01:00',
    dates: '19 – 22 Jun 2026',
    desc: 'Three nights between the Kasbah and the Atlantic. Flights booked — riads, tagines and the day-by-day map are ready for choosing.',
    facts: ['✈ FR 162 / 163 · booked', '👨‍👩‍👧‍👦 4 travellers', '🛏 Stay · choosing'],
    art: 'art-rabat',
    coords: { lat: 34.0209, lng: -6.8417 },
    arcColor: 0xecc77f, markerColor: 0xd9a441, pinColor: '#d9a441',
    lift: 0.16, halo: [4, 6],
    pinLabel: 'Rabat',
    route: 'DUB → RBA',
    boardWhen: 'Fri 19 Jun 2026 · 07:55',
    boardDetail: 'Ryanair FR 162 · 4 seats, row 23',
    shortWhen: '19 Jun · FR 162',
    marquee: ['Rabat الرباط', 'Atlantic light', 'Mint tea, two sugars', 'Kasbah blue', 'Storks over Chellah', 'Window seats only']
  },
  {
    slug: 'milan',
    name: 'Milano', place: 'Italia',
    page: 'milan.html',
    dep: '2026-07-09T19:20:00+01:00',
    ret: '2026-07-12T19:00:00+01:00',
    dates: '9 – 12 Jul 2026',
    desc: "First family trip to Italy: the Duomo's marble rooftop, Leonardo's canals, a lake on Saturday and home via Bergamo's walled hill town.",
    facts: ['✈ FR7799 / FR4845 · booked', '👨‍👩‍👧‍👦 4 travellers', '🛏 Stay · choosing'],
    art: 'art-milan',
    coords: { lat: 45.4642, lng: 9.1900 },
    arcColor: 0x43d6ad, markerColor: 0x43d6ad, pinColor: '#43d6ad',
    lift: 0.14, halo: [3, 4],
    pinLabel: 'Milano',
    route: 'DUB → MXP',
    boardWhen: 'Thu 9 Jul 2026 · 19:20',
    boardDetail: 'Ryanair FR7799 · in MXP, out BGY',
    shortWhen: '9 Jul · FR7799',
    marquee: ['Milano', 'Marble rooftops', 'Gelato strategy', 'A lake on Saturday', 'The Bergamo finale', 'Window seats only']
  },
  /* booked, no pages yet — board + manifest only */
  {
    slug: 'maldives',
    name: 'Maldives', place: 'Indian Ocean',
    dep: '2026-07-23T09:00:00+05:00',
    ret: '2026-08-06T21:00:00+05:00',
    dates: '23 Jul – 6 Aug 2026',
    route: 'Maldives',
    boardWhen: '23 Jul – 6 Aug 2026',
    boardDetail: 'Two weeks in the Indian Ocean',
    shortWhen: 'late July',
    marquee: ['Maldives', 'Indian Ocean blue', 'Two weeks barefoot', 'Snorkels first', 'Window seats only'],
    manifest: 'two weeks, late July'
  },
  {
    slug: 'queensland',
    name: 'Queensland', place: 'Australia',
    dep: '2026-12-15T10:00:00+10:00',
    ret: '2027-01-05T18:00:00+10:00',
    dates: 'Dec 2026 – Jan 2027',
    route: 'Queensland',
    boardWhen: 'Dec 2026 – Jan 2027',
    boardDetail: 'Three weeks of Australian summer',
    shortWhen: 'Christmas',
    marquee: ['Queensland', 'Christmas in summer', 'Reef days', 'Window seats only'],
    manifest: 'Christmas at home'
  }
];
