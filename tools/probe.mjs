/* Interaction probe for a trip page — assertion-based, engine-agnostic.
   Usage (from repo root or tools/):  node tools/probe.mjs <page.html> [out-prefix]

   Works before AND after engine unification: it finds the engine via
   window.TripMap || window.MilanMap || window.RabatMap and the data via
   window.TRIP || window.RABAT. Checks: every day tab (route badges + manifest),
   a photo POI card (incl. the Google-Maps href city — regression test), thumbs,
   #poi=/#day= deep links (curtain must be skipped), eat filter chips, the stay
   Compare table + sorting, and the trip clock at pre/mid/post-trip instants.
   Exit code 1 if any check fails or a page error fires. */
import { launchBrowser, serveRepo, shotPath, isSandboxNoise, sleep } from './lib/harness.mjs';

const page_ = process.argv[2] || 'rabat.html';
const prefix = process.argv[3] || page_.replace(/\.html$/, '');
const BASE = 'http://127.0.0.1:8379/';

/* Legacy pages keep trip datetimes in page JS, not data — fall back by name.
   Post-unification, TRIP.meta.dep/ret/dayDates take precedence. */
const LEGACY = {
  'rabat.html': { city: 'Rabat', dep: '2026-06-19T07:55:00+01:00', ret: '2026-06-22T15:05:00+01:00', day2: '2026-06-20T12:00:00+01:00' },
  'milan.html': { city: 'Milan', dep: '2026-07-09T19:20:00+01:00', ret: '2026-07-12T19:00:00+01:00', day2: '2026-07-10T12:00:00+02:00' },
};

const results = [];
const check = (name, ok, detail) => { results.push({ name, ok: !!ok, detail: detail || '' }); };
const pageErrors = [];

const server = await serveRepo(8379);
const browser = await launchBrowser();

async function newPage(hash, nowIso) {
  const p = await browser.newPage();
  p.on('pageerror', e => { if (!isSandboxNoise(e.message)) pageErrors.push(e.message); });
  if (nowIso) await p.evaluateOnNewDocument(iso => { window.__TRIP_NOW = iso; window.__RB_NOW = iso; }, nowIso);
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await p.goto(BASE + page_ + (hash || ''), { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await p.evaluate(() => {
    window.__ENG = window.TripMap || window.MilanMap || window.RabatMap;
    window.__DATA = window.TRIP || window.RABAT;
  });
  return p;
}

async function bootMap(p) {
  await p.evaluate(() => { document.getElementById('map')?.scrollIntoView({ block: 'start' }); window.__ENG.init(); });
  for (let i = 0; i < 20; i++) {
    if (await p.evaluate(() => !!document.querySelector('#map-canvas .leaflet-marker-pane'))) break;
    await sleep(400);
  }
}

/* ---------- main page: data shape, days, card, thumbs, filters, table ---------- */
const p = await newPage();
const info = await p.evaluate(() => {
  const D = window.__DATA;
  const byId = {};
  D.pois.forEach(q => { byId[q.id] = q; });
  const dayStops = D.days.map(d => d.stops.filter(s => (s.poi && byId[s.poi]) || s.anchor).length);
  const photo = D.pois.find(q => q.img && q.type !== 'stay') || D.pois.find(q => q.img);
  return {
    days: D.days.length,
    dayStops,
    pois: D.pois.length,
    stays: D.pois.filter(q => q.type === 'stay').length,
    photoPoi: photo ? { id: photo.id, name: photo.name, city: photo.city || null } : null,
    meta: D.meta ? { city: D.meta.city, dep: D.meta.dep, ret: D.meta.ret } : null,
  };
});
check('data: has days + pois', info.days >= 2 && info.pois > 10, `${info.days} days, ${info.pois} pois`);

await bootMap(p);
check('map: booted (marker pane present)', await p.evaluate(() => !!document.querySelector('#map-canvas .leaflet-marker-pane')));

for (let n = 1; n <= info.days; n++) {
  await p.evaluate(d => window.__ENG.setDay(d), n);
  await sleep(1500);
  const st = await p.evaluate(() => ({
    nums: document.querySelectorAll('.lf-num').length,
    manifest: !!document.querySelector('.rb-map__manifest') && !document.querySelector('.rb-map__manifest').hidden,
    manifestBtns: document.querySelectorAll('.rb-map__manifest button').length,
    activeTab: document.querySelector('.rb-map__tab.is-active')?.getAttribute('data-day'),
  }));
  check(`day ${n}: ${info.dayStops[n - 1]} numbered stops`, st.nums === info.dayStops[n - 1], `got ${st.nums}`);
  check(`day ${n}: manifest visible with matching rows`, st.manifest && st.manifestBtns === info.dayStops[n - 1], `btns ${st.manifestBtns}`);
  check(`day ${n}: tab state synced`, st.activeTab === String(n), `active=${st.activeTab}`);
  if (n === 1) await p.screenshot({ path: shotPath(`${prefix}-probe-day1.png`) });
}
await p.evaluate(() => window.__ENG.setDay('all'));
await sleep(900);
check('day all: manifest hidden', await p.evaluate(() => document.querySelector('.rb-map__manifest')?.hidden === true));

/* tab wiring via a real click (not just the API) */
await p.evaluate(() => document.querySelector('.rb-map__tab[data-day="2"]').click());
await sleep(1200);
check('tab click: day 2 activates', await p.evaluate(() => document.querySelector('.rb-map__tab.is-active')?.getAttribute('data-day') === '2'));

/* photo POI card + Google-Maps href (the poi.city regression test) */
if (info.photoPoi) {
  await p.evaluate(id => window.__ENG.focusPoi(id), info.photoPoi.id);
  await sleep(1800);
  const card = await p.evaluate(() => ({
    open: !document.getElementById('map-card').hidden,
    name: document.querySelector('#map-card-body .mc-name')?.textContent,
    gmaps: document.querySelector('#map-card-body a[href*="google.com/maps"]')?.href || '',
    hasPhotoFigure: !!document.querySelector('#map-card-body .mc-photo'),
  }));
  const wantCity = info.photoPoi.city || (info.meta && info.meta.city) || LEGACY[page_]?.city || '';
  const wantQ = encodeURIComponent(info.photoPoi.name + ', ' + wantCity).replace(/%20/g, '+');
  const gotQ = (card.gmaps.split('query=')[1] || '').replace(/%20/g, '+');
  check('card: opens with right name + photo slot', card.open && card.name === info.photoPoi.name && card.hasPhotoFigure, card.name);
  check('card: gmaps query uses the poi’s own city', gotQ === wantQ, `want ${decodeURIComponent(wantQ)} got ${decodeURIComponent(gotQ)}`);
  await p.screenshot({ path: shotPath(`${prefix}-probe-card.png`) });
}

/* thumbs for every day (empty only if a day has <2 plottable stops) */
const thumbs = await p.evaluate(days => {
  const out = [];
  for (let n = 1; n <= days; n++) out.push((window.__ENG.thumb(n) || '').length);
  return out;
}, info.days);
thumbs.forEach((len, i) => {
  const expectEmpty = info.dayStops[i] < 2;
  check(`thumb day ${i + 1}: ${expectEmpty ? 'empty (single stop)' : 'renders svg'}`, expectEmpty ? len === 0 : len > 200, `len=${len}`);
});

/* eat filter chips — self-consistent against row attributes */
const filters = await p.evaluate(() => {
  const bar = document.querySelector('.rb-eat__chips');
  const rows = () => Array.from(document.querySelectorAll('#eat-list .rb-row'));
  const visible = () => rows().filter(r => r.style.display !== 'none').length;
  const out = { total: rows().length };
  bar.querySelector('[data-f="kid"]').click();
  out.kidVisible = visible();
  out.kidTagged = rows().filter(r => r.hasAttribute('data-kid')).length;
  bar.querySelector('[data-f="cheap"]').click();
  out.cheapVisible = visible();
  out.cheapTagged = rows().filter(r => r.getAttribute('data-price') === '€').length;
  bar.querySelector('[data-f="all"]').click();
  out.allVisible = visible();
  return out;
});
check('filter: kid rows match tagged rows', filters.kidVisible === filters.kidTagged && filters.kidTagged > 0, `${filters.kidVisible}/${filters.kidTagged}`);
check('filter: cheap rows match € rows', filters.cheapVisible === filters.cheapTagged, `${filters.cheapVisible}/${filters.cheapTagged}`);
check('filter: "all" restores every row', filters.allVisible === filters.total, `${filters.allVisible}/${filters.total}`);

/* stay compare table + sort */
const table = await p.evaluate(stays => {
  document.querySelector('.rb-stay__toggle [data-v="table"]').click();
  const wrap = document.querySelector('.rb-stay__tablewrap');
  const rowCount = wrap.querySelectorAll('tbody tr').length;
  const scores = () => Array.from(wrap.querySelectorAll('tbody tr td:nth-child(3) b')).map(b => parseFloat(b.textContent));
  wrap.querySelector('.is-sort[data-k="score"]').click();
  const asc = scores();
  document.querySelector('.rb-stay__tablewrap .is-sort[data-k="score"]').click();
  const desc = scores();
  return { visible: !wrap.hidden, rowCount, ascOk: asc.every((v, i) => !i || v >= asc[i - 1]), descOk: desc.every((v, i) => !i || v <= desc[i - 1]), stays };
}, info.stays);
check('compare: table shows all stays', table.visible && table.rowCount === info.stays, `${table.rowCount}/${info.stays}`);
check('compare: score sorts asc then desc', table.ascOk && table.descOk);
await p.screenshot({ path: shotPath(`${prefix}-probe-table.png`) });
await p.close();

/* ---------- deep links (cold loads; curtain must be skipped) ---------- */
if (info.photoPoi) {
  const p2 = await newPage('#poi=' + info.photoPoi.id);
  await sleep(3000);
  const dl = await p2.evaluate(() => ({
    curtain: !!document.querySelector('.rb-curtain'),
    cardOpen: !document.getElementById('map-card')?.hidden,
  }));
  check('deep link #poi=: card opens, curtain skipped', dl.cardOpen && !dl.curtain, JSON.stringify(dl));
  await p2.close();
}
{
  const p3 = await newPage('#day=2');
  await sleep(3000);
  const dl = await p3.evaluate(() => ({
    curtain: !!document.querySelector('.rb-curtain'),
    activeTab: document.querySelector('.rb-map__tab.is-active')?.getAttribute('data-day'),
  }));
  check('deep link #day=2: day traced, curtain skipped', dl.activeTab === '2' && !dl.curtain, JSON.stringify(dl));
  await p3.close();
}

/* ---------- trip clock at fixed instants ---------- */
const meta = info.meta && info.meta.dep ? info.meta : LEGACY[page_];
if (meta) {
  const iso = d => new Date(d).toISOString();
  const sims = [
    { label: 'pre-trip', now: iso(new Date(meta.dep).getTime() - 2 * 86400000), chipRe: /T-minus|Boarding day/ },
    { label: 'mid-trip', now: meta.day2 || iso(new Date(meta.dep).getTime() + 1.5 * 86400000), chipRe: /Day 2/ },
    { label: 'post-trip', now: iso(new Date(meta.ret).getTime() + 2 * 86400000), chipRe: /Home with stories/ },
  ];
  for (const sim of sims) {
    const ps = await newPage('', sim.now);
    await sleep(3000);
    const st = await ps.evaluate(() => ({
      chip: document.querySelector('.rb-chip--live')?.textContent || '',
      today: document.querySelector('.rb-day.is-today')?.getAttribute('data-num') || null,
      activeTab: document.querySelector('.rb-map__tab.is-active')?.getAttribute('data-day'),
    }));
    check(`clock ${sim.label}: chip reads right`, sim.chipRe.test(st.chip), st.chip);
    if (sim.label === 'mid-trip') {
      check('clock mid-trip: day 2 tagged today', st.today === '02', `data-num=${st.today}`);
      check('clock mid-trip: map auto-selects day 2', st.activeTab === '2', `active=${st.activeTab}`);
    }
    await ps.close();
  }
}

/* ---------- report ---------- */
await browser.close();
server.close();
const fails = results.filter(r => !r.ok);
for (const r of results) console.log(`${r.ok ? ' PASS' : ' FAIL'}  ${r.name}${r.detail ? '  — ' + r.detail : ''}`);
if (pageErrors.length) console.log('PAGE ERRORS:\n  ' + pageErrors.join('\n  '));
console.log(`\n${results.length - fails.length}/${results.length} checks passed` + (fails.length ? ` — ${fails.length} FAILED` : ''));
process.exit(fails.length || pageErrors.length ? 1 : 0);
