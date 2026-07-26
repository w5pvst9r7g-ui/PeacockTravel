/* One-shot generator for the landing globe's land-dot grid.
   Usage: node tools/gen-dots.mjs   (deps come from tools/package.json)
   Writes land-dots.json next to this script; the shipped file is the hand-wrapped
   assets/data/land-dots.js (window.LAND_DOTS = [...]) — regenerate, then re-wrap.
   The same world-atlas + topojson pattern builds country outlines for trip insets
   (assets/data/morocco-outline.js, italy-outline.js): swap land-110m for
   countries-50m, pick the country feature, sample its ring. */
import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import * as topojson from 'topojson-client';
import { geoContains } from 'd3-geo';

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'));
const land = topojson.feature(topo, topo.objects.land);

const dots = [];
const latStep = 2.0;
for (let lat = -58; lat <= 84; lat += latStep) {
  // keep longitudinal density roughly uniform on the sphere
  const lngStep = latStep / Math.max(0.25, Math.cos((lat * Math.PI) / 180));
  for (let lng = -180; lng < 180; lng += lngStep) {
    if (geoContains(land, [lng, lat])) {
      dots.push([Math.round(lat * 10) / 10, Math.round(lng * 10) / 10]);
    }
  }
}
const out = fileURLToPath(new URL('./land-dots.json', import.meta.url));
writeFileSync(out, JSON.stringify(dots));
console.log('dots:', dots.length, '→', out);
