# Migration — moving this repo to a new home

The checklist for pointing this project at a new repository/owner (and for any fresh
Claude session inheriting it). Everything here was learned the hard way once.

## Move checklist (in order)

1. **Create the new repository** and push the full history
   (`git push --mirror <new-remote>`, or push the working branch + `main`).
2. **Enable GitHub Pages manually** — Settings → Pages → Source: **GitHub Actions**.
   ⚠️ The workflow token *cannot* create the Pages site; the first deploy run fails with
   "Resource not accessible by integration" until a human clicks this (exactly how run
   №1 failed in the original repo). One-time step per repo.
3. **Branch triggers** — `.github/workflows/pages.yml` deploys on pushes to
   `claude/elegant-clarke-w9i5ro` and `main`. Edit that list to the new working branch.
   Every push to a listed branch IS a production deploy; there is no staging.
4. **Rewrite the site URL** — `node tools/set-site-url.mjs --dry-run` shows the current
   base and every occurrence (og:urls in the 3 pages, README, CLAUDE.md, docs); then
   `node tools/set-site-url.mjs https://<user>.github.io/<Repo>/` rewrites them.
5. **Verify locally** — `cd tools && npm i`, then `node tools/shoot.mjs index.html x`
   and `node tools/probe.mjs rabat.html` / `milan.html` (see docs/operations.md;
   on a machine with Chrome installed, `npm i --omit=optional` skips the big
   fallback-Chromium download).
6. **Push, then confirm the deploy** — Actions tab, or via MCP: `actions_list` on
   pages.yml (the JSON overflows chat context — jq the saved response).
7. **Update the Drive cowork project** — `peacock_travel_site.md` in the travel folder
   records the live URL; fix it there so the other project doesn't point at the old home.

## What the new owner must know

- **The whole repo is published.** Pages uploads path `.` — `docs/`, `research/`,
  `tools/` sources included. Nothing secret can live anywhere in this repo.
- **Personal data ships on purpose** (family decision, 2026): see inventory below.
  If the new home changes that calculus, scrub before the first deploy, not after.
- **GSAP Standard License** allows this free personal use; re-check it if the project
  ever becomes part of anything paid (THIRD-PARTY.md).
- **CARTO basemap + Wikimedia hotlinks** are runtime services — the map attribution
  control and photo credits are license requirements, not decoration.
- The knowledge base is `CLAUDE.md` + `docs/` (architecture, playbook, standards,
  operations, trip-log, family-profile). A fresh session should read CLAUDE.md first.

## Personal-data inventory (kept by choice — documented, not scrubbed)

| Data | Where |
|---|---|
| Family first names + roles | index.html (crew section), README, docs/, trip pages |
| Flight numbers, dates, seat row 23 | index.html board (pre-trip states), trip pages, trips-index.js, trip data files |
| Ryanair booking refs **H7M9XX** (Rabat), **A567VA** (Milan) | README, docs/trip-log.md, trip-page hero chips / practical sections |
| Dublin parking ref **DUBMP17810786865** | assets/data/milan-data.js (day-1 stop note), docs/trip-log.md |
| Kids' assumed ages (8/10) | docs/standards.md, docs/family-profile.md, research/ |
| Trip dates incl. future absences (Maldives, Queensland) | trips-index.js, docs/trip-log.md, landing board |
| Drive folder id of the cowork project | CLAUDE.md, docs/playbook-new-trip.md |

Deliberately **not** in this repo: contact details (emails, phones), home address,
schools, and the booking-process internals that live in the private Drive project.
Keep it that way — standards.md: "never add data the family didn't already expose."

## If the container/session is new (no repo move)

Nothing above applies — just `cd tools && npm i` and read CLAUDE.md's environment
section for the sandbox-vs-normal-machine differences.
