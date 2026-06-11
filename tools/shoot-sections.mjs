/* Section-by-section captures + map interaction test for rabat.html */
import chromium from '/tmp/vendor/node_modules/@sparticuz/chromium/build/index.js';
import puppeteer from '/tmp/vendor/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const data = await readFile(join(ROOT, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]));
    res.writeHead(200, { 'content-type': MIME[extname(req.url.split('?')[0])] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(8378, r));

const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox'],
  executablePath: await chromium.executablePath(),
  headless: 'shell',
});

const errors = [];
for (const vp of [
  { name: 'd', width: 1440, height: 900 },
  { name: 'm', width: 390, height: 844, dsf: 2, mobile: true },
]) {
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(`[${vp.name}] pageerror: ${e.message}`));
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf || 1, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
  await page.goto('http://127.0.0.1:8378/rabat.html', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2500));

  for (const sel of ['#brief', '#days', '#map', '#eat', '#stay', '#hoods', '#extra', '#practical']) {
    await page.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel);
    await new Promise(r => setTimeout(r, 900));
    await page.screenshot({ path: `/tmp/rb-${vp.name}-${sel.slice(1)}.png` });
  }

  // map interactions: day 2 tab
  await page.evaluate(() => document.querySelector('#map')?.scrollIntoView({ block: 'start' }));
  await new Promise(r => setTimeout(r, 800));
  await page.click('.rb-map__tab[data-day="2"]').catch(e => errors.push(`[${vp.name}] tab click: ${e.message}`));
  await new Promise(r => setTimeout(r, 2400));
  await page.screenshot({ path: `/tmp/rb-${vp.name}-map-day2.png` });

  // open a marker card
  await page.evaluate(() => window.RabatMap.focusPoi('kasbah'));
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: `/tmp/rb-${vp.name}-map-card.png` });
  await page.close();
}
console.log(errors.length ? 'ISSUES:\n' + errors.join('\n') : 'CLEAN');
await browser.close();
server.close();
