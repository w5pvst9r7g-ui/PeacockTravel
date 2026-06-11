/* Screenshot + console-error harness (run from tools/: node shoot.mjs <page> <out-prefix>) */
import chromium from '/tmp/vendor/node_modules/@sparticuz/chromium/build/index.js';
import puppeteer from '/tmp/vendor/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };

const server = createServer(async (req, res) => {
  try {
    const path = req.url.split('?')[0];
    const file = join(ROOT, path === '/' ? 'index.html' : path);
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('nope');
  }
});
await new Promise(r => server.listen(8377, r));

const page_ = process.argv[2] || 'index.html';
const prefix = process.argv[3] || 'shot';
const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox', '--enable-webgl', '--use-gl=angle'],
  executablePath: await chromium.executablePath(),
  headless: 'shell',
});

const errors = [];
const viewports = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
  { name: 'mobile', width: 390, height: 844, dsf: 2, mobile: true },
];

for (const vp of viewports) {
  const page = await browser.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(`[${vp.name}] console: ${m.text()}`); });
  page.on('pageerror', e => errors.push(`[${vp.name}] pageerror: ${e.message}`));
  page.on('requestfailed', r => errors.push(`[${vp.name}] reqfail: ${r.url()} ${r.failure()?.errorText}`));
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
  await page.goto(`http://127.0.0.1:8377/${page_}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3200));
  await page.screenshot({ path: `/tmp/${prefix}-${vp.name}-hero.png` });
  // scroll through the page like a user so scroll-triggered animations fire
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += window.innerHeight * 0.7) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 160));
    }
    window.scrollTo(0, h);
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  // full page
  await page.screenshot({ path: `/tmp/${prefix}-${vp.name}-full.png`, fullPage: true });
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

console.log(errors.length ? 'ISSUES:\n' + errors.join('\n') : 'CLEAN — no console errors, no failed requests, no overflow');
await browser.close();
server.close();
