# CLAUDE.md — Peacock Travel · The Family Atlas

Static travel-planning site for the Peacock family (Grant, Annamaria, Hailey, Jean-Luc — Dublin).
One landing page + one richly-researched page per booked trip. No build step, no CDN code —
everything vendored; only map tiles and Wikimedia photos stream at runtime.

**Live:** https://w5pvst9r7g-ui.github.io/PeacockTravel/ · **Branch:** `claude/elegant-clarke-w9i5ro`
(every push auto-deploys via `.github/workflows/pages.yml` — there is no staging).

## Read next (docs/)

| Doc | When |
|---|---|
| `docs/architecture.md` | Touching any code — file map, TRIP data schema, map-engine API |
| `docs/playbook-new-trip.md` | Adding a trip page (the full recipe, proven twice) |
| `docs/standards.md` | Research, ratings honesty, image licensing, copy voice |
| `docs/operations.md` | Verifying, deploying, sandbox quirks, hard-won gotchas |
| `docs/trip-log.md` | Current trip status, open decisions, dated booking alarms |

## Golden rules

1. **Verify before push.** Every change runs through the headless-Chrome harness
   (`node tools/shoot.mjs <page> <prefix>` from repo root) at 1440px and 390px, plus an
   interaction probe for map/filter changes. Expected sandbox noise: cert-blocked
   `wikimedia`/`cartocdn` requests — filter those, chase everything else to zero.
2. **Honesty bar.** Family standard is 4.5★ Google with real review volume. Never round up,
   never invent; below-bar icons are shown with flags (`bar: 'near' | 'icon'`), and every
   figure traces to a source URL in `research/*.md`.
3. **Images are licensed or absent.** Wikimedia Commons only, license + author verified,
   credit rendered on the page, always layered over an illustrated fallback that stands alone.
4. **Rabat and Milan pages are shipped product.** New trips copy the engine
   (see playbook); they never refactor the live pages as a side effect.
5. **Trip truth lives in two places:** flights/refs in Gmail + the Drive cowork project
   (`trips.md`, folder `1Y2tCzMlbHGqvv19UTCS57T_-Js5P7X1t`); everything the site asserts in
   `assets/data/<trip>-data.js` with receipts in `research/`.

## Quick commands

```bash
python3 -m http.server 8000                    # serve locally
node tools/shoot.mjs rabat.html rb             # full-page verify (desktop+mobile, console, overflow)
node tools/shoot-sections.mjs                  # per-section captures + map interactions (Rabat)
git push -u origin claude/elegant-clarke-w9i5ro  # ships to production
jq -r '.workflow_runs[0].conclusion' <saved actions_list output>  # deploy check (result too big to inline)
```

## Environment (remote sandbox)

- Egress proxy allows **npm, git, MCP servers** only. Browsers/curl to the open web fail —
  by design. Headless Chrome comes from `@sparticuz/chromium` + `puppeteer-core`
  (already in `/tmp/vendor`; reinstall the same way if the container was recycled).
- Research is done through background **general-purpose agents** using WebSearch/WebFetch.
  Tell them explicitly: *do the work yourself, no sub-agent delegation, Write the file before
  finishing* — a delegating agent once exited empty-handed (its orphans did report back, but
  don't rely on that).
- No cron/scheduler tooling has been reliably present; `/loop` requests are executed as
  consecutive passes, each pass = review → one material improvement → verify → push.
