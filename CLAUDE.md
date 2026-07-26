# CLAUDE.md — Peacock Travel · The Family Atlas

Static travel-planning site for the Peacock family (Grant, Annamaria, Hailey, Jean-Luc — Dublin).
One landing page + one richly-researched page per booked trip. No build step, no CDN code —
everything vendored; only map tiles and Wikimedia photos stream at runtime.
One shared engine renders every trip page from its data file; the landing renders from a
trip registry. A new trip = data file + thin shell + one registry entry (see the playbook).

**Live:** https://w5pvst9r7g-ui.github.io/PeacockTravel/ · **Branch:** `claude/elegant-clarke-w9i5ro`
(every push auto-deploys via `.github/workflows/pages.yml` — there is no staging).
Moving the repo? `docs/MIGRATION.md` is the checklist; `tools/set-site-url.mjs` rewrites the URL.

## Read next (docs/)

| Doc | When |
|---|---|
| `docs/architecture.md` | Touching any code — file map, TRIP/TRIPS schemas, engine APIs |
| `docs/playbook-new-trip.md` | Adding a trip page (data-file recipe + step 5 · Learn) |
| `docs/family-profile.md` | Before ANY recommendation — the preference library |
| `docs/standards.md` | Research, ratings honesty, image licensing, copy voice |
| `docs/operations.md` | Verifying, deploying, environment profiles, hard-won gotchas |
| `docs/trip-log.md` | Current trip status, open decisions, debrief debts |
| `docs/MIGRATION.md` | Moving the repo / onboarding a new owner |

## Golden rules

1. **Verify before push.** Every change runs through the harness from repo root:
   `node tools/shoot.mjs <page> <prefix>` (desktop+mobile, console, overflow) and, for
   trip-page or engine changes, `node tools/probe.mjs <page>` (~34 interaction checks).
   Both exit 0 = green. Sandbox proxy noise (wikimedia/cartocdn, blocked at the transport
   layer) is filtered automatically; a 404 on a local asset is never filtered and fails.
2. **Honesty bar.** Family standard is 4.5★ Google with real review volume. Never round up,
   never invent; below-bar picks are shown with flags (`bar: 'near' | 'icon'`), and every
   figure traces to a source URL in `research/*.md`.
3. **Images are licensed or absent.** Wikimedia Commons only, license + author verified,
   credit rendered on the page, always layered over an illustrated fallback that stands alone.
4. **One engine, two live pages.** trip.js / trip-map.js / trip.css serve every trip —
   any engine change is verified on BOTH shipped pages before push. Trip-specific behavior
   belongs in the data file (TRIP.meta / TRIP.map), never forked into the engine.
5. **Trip truth lives in two places:** flights/refs in Gmail + the Drive cowork project
   (`trips.md`, folder `1Y2tCzMlbHGqvv19UTCS57T_-Js5P7X1t`); everything the site asserts in
   `assets/data/<trip>-data.js` with receipts in `research/`.
6. **Recommendations come from `docs/family-profile.md`.** Read it before suggesting
   anything; paste its Hard rules + Tastes into research-agent prompts; when the family
   reveals a preference — any session — write it there in the same session.

## Quick commands

```bash
python3 -m http.server 8000                    # serve locally
node tools/shoot.mjs rabat.html rb             # visual verify (desktop+mobile → tools/shots/)
node tools/probe.mjs milan.html                # interaction probe (exit 0 = all checks pass)
node tools/set-site-url.mjs --dry-run          # where the site URL is hardcoded
git push -u origin claude/elegant-clarke-w9i5ro  # ships to production
jq -r '.workflow_runs[0].conclusion' <saved actions_list output>  # deploy check (result too big to inline)
```

## Environment

**Any machine:** `cd tools && npm i` once (with system Chrome: `npm i --omit=optional`),
then the quick commands above just work. Runtime libraries are vendored in the repo.

**This remote sandbox specifically:**
- Egress proxy allows **npm, git, MCP servers** only. Browsers/curl to the open web fail —
  by design. Expect cert-blocked `wikimedia`/`cartocdn` requests in the harness (filtered).
  Chromium is pre-installed at `/opt/pw-browsers/chromium`; the harness finds it.
- Container is ephemeral — after a recycle, re-run `cd tools && npm i`.
- Research is done through background **general-purpose agents** using WebSearch/WebFetch.
  Tell them explicitly: *do the work yourself, no sub-agent delegation, Write the file before
  finishing* — a delegating agent once exited empty-handed (its orphans did report back, but
  don't rely on that).
- Foreground `sleep` is blocked (use `run_in_background`); no cron/scheduler tooling has
  been reliably present — `/loop` requests run as consecutive passes, each pass =
  review → one material improvement → verify → push.
