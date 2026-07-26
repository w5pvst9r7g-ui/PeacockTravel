/* Screenshot + console-error harness.
   Usage (from repo root or tools/):  node tools/shoot.mjs <page.html> <out-prefix>
   Captures hero + fullPage at 1440px and 390px into tools/shots/, reports console
   errors / pageerrors / failed requests / horizontal overflow. Sandbox cert noise
   (wikimedia, cartocdn) is listed separately and doesn't count as a failure. */
import { launchBrowser, serveRepo, shotPath, isSandboxNoise, sleep } from './lib/harness.mjs';

const page_ = process.argv[2] || 'index.html';
const prefix = process.argv[3] || 'shot';

const server = await serveRepo(8377);
const browser = await launchBrowser(['--enable-webgl', '--use-gl=angle']);

const errors = [];
const noise = [];
const push = m => (isSandboxNoise(m) ? noise : errors).push(m);
const viewports = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
  { name: 'mobile', width: 390, height: 844, dsf: 2, mobile: true },
];

for (const vp of viewports) {
  const page = await browser.newPage();
  page.on('console', m => { if (m.type() === 'error') push(`[${vp.name}] console: ${m.text()}`); });
  page.on('pageerror', e => push(`[${vp.name}] pageerror: ${e.message}`));
  page.on('requestfailed', r => push(`[${vp.name}] reqfail: ${r.url()} ${r.failure()?.errorText}`));
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
  await page.goto(`http://127.0.0.1:8377/${page_}`, { waitUntil: 'networkidle0', timeout: 30000 }).catch(e => push(`[${vp.name}] goto: ${e.message}`));
  await sleep(3200);
  await page.screenshot({ path: shotPath(`${prefix}-${vp.name}-hero.png`) });
  // scroll through the page like a user so scroll-triggered animations fire
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += window.innerHeight * 0.7) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 160));
    }
    window.scrollTo(0, h);
  });
  await sleep(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  // full page (100svh heroes distort here — per-viewport shots are authoritative)
  await page.screenshot({ path: shotPath(`${prefix}-${vp.name}-full.png`), fullPage: true });
  // horizontal overflow check
  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    const over = d.scrollWidth - d.clientWidth;
    const bad = [];
    if (over > 1) {
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > d.clientWidth + 1 && r.width > 4) bad.push(el.tagName + '.' + String(el.className).split(' ')[0] + ' right=' + Math.round(r.right));
      });
    }
    return { over, bad: bad.slice(0, 12) };
  });
  if (overflow.over > 1) errors.push(`[${vp.name}] horizontal overflow ${overflow.over}px: ${overflow.bad.join(' | ')}`);
  await page.close();
}

if (noise.length) console.log(`(sandbox noise: ${noise.length} cert-blocked requests — expected)`);
console.log(errors.length ? 'ISSUES:\n' + errors.join('\n') : 'CLEAN — no console errors, no failed requests, no overflow');
await browser.close();
server.close();
process.exit(errors.length ? 1 : 0);
