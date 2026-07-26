/* Shared harness plumbing for shoot.mjs / probe.mjs.
   Run the tools from anywhere (repo root or tools/) — paths resolve from this file.

   Browser resolution order:
     1. $PEACOCK_CHROME — explicit executable override
     2. common system installs (incl. the remote sandbox's /opt/pw-browsers)
     3. @sparticuz/chromium (optionalDependency — for sandboxes with no system browser)
*/
import { existsSync, mkdirSync } from 'fs';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

export const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const SHOTS_DIR = fileURLToPath(new URL('../shots/', import.meta.url));

const SYSTEM_CHROME = [
  '/opt/pw-browsers/chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];

export async function launchBrowser(extraArgs = []) {
  const found = process.env.PEACOCK_CHROME || SYSTEM_CHROME.find(p => existsSync(p));
  if (found) {
    return puppeteer.launch({
      executablePath: found,
      headless: true,
      // swiftshader flags: headless boxes have no GPU, and Chrome 128+ refuses
      // software WebGL (the landing globe) without the explicit opt-in
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', ...extraArgs],
    });
  }
  const { default: chromium } = await import('@sparticuz/chromium');
  return puppeteer.launch({
    args: [...chromium.args, '--no-sandbox', ...extraArgs],
    executablePath: await chromium.executablePath(),
    headless: 'shell',
  });
}

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json',
};

export async function serveRepo(port) {
  const server = createServer(async (req, res) => {
    try {
      const path = req.url.split('?')[0].split('#')[0];
      const file = join(REPO_ROOT, path === '/' ? 'index.html' : decodeURIComponent(path));
      if (!file.startsWith(REPO_ROOT)) throw new Error('outside root');
      const data = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404); res.end('nope');
    }
  });
  await new Promise(r => server.listen(port, r));
  return server;
}

export function shotPath(name) {
  mkdirSync(SHOTS_DIR, { recursive: true });
  return join(SHOTS_DIR, name);
}

/* Sandbox noise: the egress proxy MITMs unknown hosts, so wikimedia/cartocdn
   requests fail with cert errors. Real failures are everything else. */
export function isSandboxNoise(msg) {
  return /ERR_CERT|cartocdn|wikimedia|Failed to load resource/.test(msg);
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));
