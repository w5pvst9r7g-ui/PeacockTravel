# Operations — verify, deploy, environment, gotchas

## Verification harness (tools/)
- `node tools/shoot.mjs <page>.html <prefix>` — serves the repo on :8377, loads the page at
  1440×900 and 390×844(dsf2), scroll-throughs to fire reveals, captures hero + fullPage to
  `/tmp/<prefix>-*.png`, reports console errors / pageerrors / failed requests / horizontal
  overflow with offending elements.
- `node tools/shoot-sections.mjs` — per-section viewport captures + map interaction pass
  (Rabat-specific; adapt inline for other pages, see /tmp probe scripts in session history).
- **Expected failures in the sandbox:** `ERR_CERT_AUTHORITY_INVALID` / reqfail for
  `upload.wikimedia.org` and `*.cartocdn.com` — the egress proxy MITMs unknown hosts. Filter
  with `grep -vE "ERR_CERT|cartocdn|wikimedia|Failed to load resource"`; anything left is real.
- Judge results programmatically when eyes disagree: `document.elementFromPoint`, ray-cast
  geometry checks, DOM state via `page.evaluate` — twice this caught "bugs" that were
  actually misread screenshots, and once the reverse.

## Deploy
- Push to `claude/elegant-clarke-w9i5ro` → `.github/workflows/pages.yml` deploys to
  https://w5pvst9r7g-ui.github.io/PeacockTravel/ (~40s). It is production; there's no staging.
- Confirm: `mcp__github__actions_list` (pages.yml, per_page 1) — the response overflows, so
  `jq -r '.workflow_runs[0] | "\(.run_number) \(.status)/\(.conclusion)"'` on the saved file.
- Pages needed a one-time manual enable (Settings→Pages→GitHub Actions) — the workflow token
  cannot create the Pages site (run #1 failed exactly this way). Already done; remember if
  the repo is ever recreated.
- Timers: foreground `sleep` is blocked; use `Bash run_in_background: sleep N` + `TaskOutput`.

## Environment rebuild (container is ephemeral)
```bash
cd /tmp/vendor  # recreate if gone
npm i gsap three@0.149 leaflet@1.9.4 leaflet.markercluster@1.5.3 \
      @fontsource-variable/fraunces @fontsource-variable/space-grotesk \
      world-atlas@2 topojson-client d3-geo \
      @sparticuz/chromium@131 puppeteer-core@23
```
Vendored copies already live in the repo; the npm set is only for the harness (chromium) and
for regenerating data (gen-dots/outlines). Playwright browser downloads are blocked — use
`@sparticuz/chromium` with `puppeteer.launch({args:[...chromium.args,'--no-sandbox'],
executablePath: await chromium.executablePath(), headless:'shell'})`.

## Gotchas (each cost real debugging time)
1. `loading="lazy"` inside a `display:none` container **never fetches** — card photos are
   eager, revealed on `load`.
2. `[hidden]` loses to any `display:` class rule — base.css carries the global
   `[hidden]{display:none!important}` fix. Don't remove it.
3. Leaflet's internal z-indexes (up to ~800) escape unless the container forms a stacking
   context — `.rb-map__canvas{z-index:1}` is load-bearing.
4. Puppeteer clicks can land on the fixed nav when `scrollIntoView` puts a control under it —
   a **test artifact**, not a page bug; probe with `evaluate(() => el.click())` before
   "fixing" the page.
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
