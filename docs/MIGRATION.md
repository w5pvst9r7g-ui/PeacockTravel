# Migration — moving this repo to a new home

The checklist for pointing this project at a new repository/owner (and for any fresh
Claude session inheriting it). Everything here was learned the hard way once.

## Move checklist (in order)

1. **Create the new repository** and push the full history
   (`git push --mirror <new-remote>`). The repo has exactly one branch —
   `claude/elegant-clarke-w9i5ro`; there is no `main`, despite pages.yml listing one
   as a trigger.
2. **Enable GitHub Pages manually** — Settings → Pages → Source: **GitHub Actions**.
   ⚠️ The workflow token *cannot* create the Pages site; the first deploy run fails with
   "Resource not accessible by integration" until a human clicks this (exactly how run
   №1 failed in the original repo). One-time step per repo.
3. **Branch triggers** — `.github/workflows/pages.yml` deploys on pushes to
   `claude/elegant-clarke-w9i5ro` and `main`. A `--mirror` push carries the working
   branch over, so you may simply keep it. If you rename it, edit the list in pages.yml
   **and** every prose copy of the name: `CLAUDE.md` (the `**Branch:**` header line *and*
   the `git push -u origin …` quick command), `docs/operations.md` (Deploy, first bullet),
   and this step. `set-site-url.mjs` rewrites the base URL only, never branch names;
   README says "the working branch" generically and needs no edit. Verify with
   `grep -rn 'claude/elegant-clarke-w9i5ro' . --exclude-dir=.git --exclude-dir=node_modules`
   — 5 hits before a rename, 0 after.
   Every push to a listed branch IS a production deploy; there is no staging.
4. **Rewrite the site URL** — `node tools/set-site-url.mjs --dry-run` shows the current
   base and every occurrence (og:urls in the 3 pages, README, CLAUDE.md, docs); then
   `node tools/set-site-url.mjs https://<user>.github.io/<Repo>/` rewrites them.
5. **Verify locally** — install once with `(cd tools && npm i)` (on a machine with Chrome
   installed, `npm i --omit=optional` skips the big fallback-Chromium download), then
   **from the repo root**: `node tools/shoot.mjs index.html x`,
   `node tools/probe.mjs rabat.html`, `node tools/probe.mjs milan.html`
   (see docs/operations.md). Note the subshell parens — `cd tools && npm i` followed by
   `node tools/…` in the same shell looks for `tools/tools/shoot.mjs` and fails.
6. **Push, then confirm the deploy** — Actions tab, or via MCP: `actions_list` on
   pages.yml (the JSON overflows chat context — jq the saved response).
7. **Update the Drive cowork project** (only if you have access) — `peacock_travel_site.md`
   in the travel folder records the base site URL, both per-page URLs, the repo slug and
   the working-branch name; update all four or that project keeps pointing at the old
   home. No access? Skip it and drop the Drive references named below.

## What the new owner must know

- **The whole repo is published.** Pages uploads path `.` — `docs/`, `research/`,
  `tools/` sources included. Nothing secret can live anywhere in this repo.
- **Personal data ships on purpose** (family decision, 2026): see inventory below.
  If the new home changes that calculus, scrub before the first deploy, not after.
- **GSAP Standard License** allows this free personal use; re-check it if the project
  ever becomes part of anything paid (THIRD-PARTY.md).
- **CARTO basemap + Wikimedia hotlinks** are runtime services — the map attribution
  control and photo credits are license requirements, not decoration.
- **Two sources do NOT transfer with this repo.** The family's Gmail and the private Drive
  cowork project (folder `1Y2tCzMlbHGqvv19UTCS57T_-Js5P7X1t`: `trips.md`,
  `travel_planning.md`, `data/preferences.json`, `peacock_travel_site.md`) are authorized on
  the family's own account — a new owner cannot open either. Dependent workflows:
  `CLAUDE.md` golden rule 5, `docs/playbook-new-trip.md` step 0 items 1–2,
  `docs/trip-log.md` ("Bookings source of truth"), and the `docs/family-profile.md`
  re-sync. Either get access granted, or substitute your own booking source of truth and
  update those four references. Everything the site *asserts* already lives in
  `assets/data/*-data.js` with receipts in `research/` — the repo can rebuild and ship the
  existing pages unaided; only *adding a trip* and *re-syncing preferences* need the
  private sources.
- The knowledge base is `CLAUDE.md` + `docs/` (architecture, playbook, standards,
  operations, trip-log, family-profile). A fresh session should read CLAUDE.md first.

## Personal-data inventory (kept by choice — documented, not scrubbed)

Verified against the working tree 26 Jul 2026. If you scrub, work this table top-down —
and scrub this table too, since it quotes the values it inventories.

| Data | Where |
|---|---|
| Family first names + roles | index.html (hero lede + crew seat cards), CLAUDE.md, docs/family-profile.md, docs/playbook-new-trip.md, research/rabat-content.md, research/milan-content.md — **not** README, **not** the trip pages (surname only) |
| Flight numbers, dates, seat row 23 | assets/data/trips-index.js (board + card strings, rendered by landing.js), trip pages, trip data files, README, docs/trip-log.md, research/*-content.md; index.html crew section carries row 23 / seat letters only |
| Ryanair booking refs **H7M9XX** (Rabat), **A567VA** (Milan) | rabat.html + milan.html footer meta strip (hardcoded in the HTML — there is no TRIP field to blank), README, docs/trip-log.md, this table |
| Dublin parking ref **DUBMP17810786865** | assets/data/milan-data.js — the day **4** (Sunday) "FR4845 home" stop note; the only occurrence in the repo besides this table (docs/trip-log.md names the provider "Express Red", not the ref) |
| Kids' assumed ages (8/10) | assets/data/rabat-data.js + milan-data.js — `age=8&age=10` in all 16 stay `book` URLs, the only copy actually served to the public web; plus docs/standards.md, docs/family-profile.md, docs/playbook-new-trip.md, docs/trip-log.md (**not** research/) |
| Trip dates incl. future absences (Maldives, Queensland) | assets/data/trips-index.js, docs/trip-log.md, index.html manifest note (rendered from the registry) |
| Drive folder id of the cowork project | CLAUDE.md, docs/playbook-new-trip.md, docs/family-profile.md, this file |
| Travel preferences (budget guideline, flight-time windows, tastes) | docs/family-profile.md (recorded at the family's request) |

Deliberately **not** in this repo: contact details (emails, phones), home address,
schools, the work-calendar keywords from the Drive `preferences.json`, and the
booking-process internals that live in the private Drive project.
Keep it that way — standards.md: "never add data the family didn't already expose."

## If the container/session is new (no repo move)

Nothing above applies — just `(cd tools && npm i)` and read CLAUDE.md's environment
section for the sandbox-vs-normal-machine differences.
