/* Rewrite the site's base URL everywhere it is hardcoded — for repo moves.
   Usage (from the repo root; from tools/ drop the "tools/" prefix — paths resolve
   from this file either way):
     node tools/set-site-url.mjs --dry-run                 # show current base + hits
     node tools/set-site-url.mjs https://user.github.io/Repo/
   Self-locating: reads the CURRENT base from index.html's og:url, then exact-string
   replaces it across *.html, README.md, CLAUDE.md and docs/*.md. Re-runnable.
   Deliberately does NOT touch .github/workflows/pages.yml — the branch triggers are
   a separate decision; docs/MIGRATION.md owns that step. */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const arg = process.argv[2];
const dry = arg === '--dry-run' || !arg;

const index = readFileSync(join(ROOT, 'index.html'), 'utf8');
const m = index.match(/property="og:url" content="([^"]+?)\/?"/);
if (!m) { console.error('Could not find og:url in index.html — aborting.'); process.exit(1); }
const current = m[1].replace(/\/$/, '');

const files = [
  ...readdirSync(ROOT).filter(f => f.endsWith('.html') || f === 'README.md' || f === 'CLAUDE.md'),
  ...readdirSync(join(ROOT, 'docs')).map(f => join('docs', f)).filter(f => f.endsWith('.md')),
];

if (dry) {
  console.log('Current base: ' + current + '\nOccurrences:');
  for (const f of files) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    src.split('\n').forEach((line, i) => {
      if (line.includes(current)) console.log(`  ${f}:${i + 1}  ${line.trim()}`);
    });
  }
  console.log('\nRun with the new base URL to rewrite, e.g.\n  node tools/set-site-url.mjs https://<user>.github.io/<Repo>/'
    + '\n  (from the repo root; from tools/ drop the "tools/" prefix)');
  process.exit(0);
}

const next = arg.replace(/\/$/, '');
if (!/^https?:\/\//.test(next)) { console.error('New base must be an absolute http(s) URL.'); process.exit(1); }
let total = 0;
for (const f of files) {
  const p = join(ROOT, f);
  const src = readFileSync(p, 'utf8');
  if (!src.includes(current)) continue;
  const n = src.split(current).length - 1;
  writeFileSync(p, src.split(current).join(next));
  console.log(`  ${f}: ${n} replaced`);
  total += n;
}
console.log(total
  ? `Done — ${total} occurrence(s): ${current} → ${next}\nRemember: pages.yml branch triggers + the manual Pages enable are separate (docs/MIGRATION.md).`
  : 'Nothing to replace — already on that base?');
