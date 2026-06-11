import { readFileSync, writeFileSync } from 'fs';
import * as topojson from 'topojson-client';
import { geoContains } from 'd3-geo';

const topo = JSON.parse(readFileSync('./node_modules/world-atlas/land-110m.json', 'utf8'));
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
writeFileSync('land-dots.json', JSON.stringify(dots));
console.log('dots:', dots.length);
