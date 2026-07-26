# Operations — verify, deploy, environment, gotchas

## Verification harness (tools/ — self-contained, runs on any machine)

Setup once per machine: `(cd tools && npm i)` (with a system Chrome installed,
`npm i --omit=optional` skips the fallback-Chromium download). **All harness commands
below run from the repo root** — note the subshell parens above, or `cd` back first.
Browser resolution:
`$PEACOCK_CHROME` → common system paths (incl. this sandbox's `/opt/pw-browsers`) →
`@sparticuz/chromium`. All output lands in `tools/shots/` (gitignored).

- `node tools/shoot.mjs <page>.html <prefix>` — serves the repo on :8377, loads the page
  at 1440×900 and 390×844(dsf2), scroll-throughs to fire reveals, captures hero + fullPage,
  reports console errors / pageerrors / failed requests / horizontal overflow. Sandbox
  cert noise is counted separately; exit code 0 = clean.
- `node tools/probe.mjs <page>.html` — assertion-based interaction probe for a trip page:
  day tabs (badges/manifest/tab sync), photo-poi card + its Google-Maps query, thumbs,
  deep links (curtain skipped), eat filters, Compare table + sorting, trip clock at
  pre/mid/post instants (`__TRIP_NOW`). ~34 checks; exit 0 = all pass.
- `node tools/set-site-url.mjs [--dry-run | <new-base>]` — repo-move URL rewriter
  (docs/MIGRATION.md).
- `node tools/gen-dots.mjs` — regenerates the globe land grid (world-atlas → JSON;
  hand-wrap into assets/data/land-dots.js).
- **Expected failures in the sandbox:** `net::ERR_CONNECTION_RESET` (older sessions:
  `ERR_CERT_AUTHORITY_INVALID`) for `upload.wikimedia.org` and `*.cartocdn.com` — the
  egress proxy blocks unknown hosts. The tools filter these transport-layer failures
  automatically; anything they still report is real. In particular a **404 is never
  filtered** — a broken local asset fails the run, which is the point.
- Judge results programmatically when eyes disagree: `document.elementFromPoint`,
  ray-cast geometry checks, DOM state via `page.evaluate` — twice this caught "bugs"
  that were actually misread screenshots, and once the reverse.

## Deploy

- Push to `claude/elegant-clarke-w9i5ro` (or `main`) → `.github/workflows/pages.yml`
  deploys to https://w5pvst9r7g-ui.github.io/PeacockTravel/ (~40s). It is production;
  there's no staging. The artifact is the **whole repo** (docs/ and research/ included).
- Confirm: `mcp__github__actions_list` (pages.yml, per_page 1) — the response overflows,
  so `jq -r '.workflow_runs[0] | "\(.run_number) \(.status)/\(.conclusion)"'` on the saved file.
- Pages needed a one-time manual enable (Settings→Pages→GitHub Actions) — the workflow
  token cannot create the Pages site (run #1 failed exactly this way). Already done here;
  **required again after any repo move** — full checklist in docs/MIGRATION.md.

## Environment profiles

**This remote sandbox:** egress proxy allows npm/git/MCP only (browsers/curl to the open
web fail by design); headless Chromium pre-installed at `/opt/pw-browsers/chromium` (the
harness finds it); foreground `sleep` is blocked — background the wait instead
(`run_in_background` with a command that exits when the condition is true, e.g.
`until <cond>; do sleep 0.5; done` — it notifies you on exit).
The container is ephemeral: after a recycle, re-run `(cd tools && npm i)`.

**A normal machine:** `cd tools && npm i --omit=optional` and everything runs; no proxy
filters needed (wikimedia/cartocdn will actually load, so screenshots show real photos
and tiles).

Runtime libraries (GSAP, Three, Leaflet, fonts) are vendored in the repo — the npm set
is dev-tooling only.

## Gotchas (each cost real debugging time)

1. `loading="lazy"` inside a `display:none` container **never fetches** — card photos are
   eager, revealed on `load`.
2. `[hidden]` loses to any `display:` class rule — base.css carries the global
   `[hidden]{display:none!important}` fix. Don't remove it.
3. Leaflet's internal z-indexes (up to ~800) escape unless the container forms a stacking
   context — `.rb-map__canvas{z-index:1}` is load-bearing.
4. Puppeteer clicks can land on the fixed nav when `scrollIntoView` puts a control under it —
   a **test artifact**, not a page bug; probe.mjs drives controls via `evaluate` clicks.
5. fullPage screenshots distort `100svh` heroes (duplicated/stretched sections) — trust
   per-viewport shots; fullPage is for section inventory only.
6. GSAP `.from(...)` + ScrollTrigger leaves unfired elements at opacity 0 — reveals use
   `once:true`, the print stylesheet force-resets `opacity/transform`, and filters call
   `gsap.set(...,{clearProps})` before hiding rows.
7. Research agents that delegate to sub-agents can exit without writing output; orphaned
   sub-agents may still deliver results later as task notifications — harvest them, but
   prompt future agents to work solo and Write before finishing.
8. MCP `actions_list` responses exceed the token budget — always jq the saved file.
9. Cluster + day-selection: a selected day removes its own type-pins (numbered badges carry
   the story); marker visibility is add/remove from the cluster group, not opacity.
10. `zoom-reset` (⌂) = closeCard + setDay('all'); day tabs write `#day=`,
    cards write `#poi=` via replaceState (no hashchange loop).
11. Landing DOM injection must happen **before** the GSAP `.reveal` scan in landing.js —
    generated cards otherwise never animate in.
12. Chrome 128+ refuses software WebGL without `--use-angle=swiftshader
    --enable-unsafe-swiftshader` — the harness passes them; the globe needs them headless.
