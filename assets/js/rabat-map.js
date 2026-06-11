/* Peacock Travel — custom Rabat map (SVG, projected from real lat/lng)
   Stylised cartography; relationships and positions follow real coordinates. */
window.RabatMap = (function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- projection ---------- */
  var BBOX = { latMin: 33.928, latMax: 34.078, lngMin: -6.935, lngMax: -6.736 };
  var KMX = 111.32 * Math.cos(34.02 * Math.PI / 180); /* km per deg lng */
  var KMY = 110.57;                                    /* km per deg lat */
  var S = 52;                                          /* px per km */
  var W = (BBOX.lngMax - BBOX.lngMin) * KMX * S;
  var H = (BBOX.latMax - BBOX.latMin) * KMY * S;

  function P(lat, lng) {
    return {
      x: (lng - BBOX.lngMin) * KMX * S,
      y: (BBOX.latMax - lat) * KMY * S
    };
  }
  function pts(arr) { return arr.map(function (c) { return P(c[0], c[1]); }); }

  /* smooth path through points (Catmull-Rom → cubic Bézier) */
  function smooth(points, closed) {
    var p = points;
    if (p.length < 3) return 'M' + p.map(function (q) { return q.x + ' ' + q.y; }).join(' L');
    var d = 'M' + p[0].x.toFixed(1) + ' ' + p[0].y.toFixed(1);
    var n = p.length;
    var last = closed ? n : n - 1;
    for (var i = 0; i < last; i++) {
      var p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      if (!closed) { p0 = p[Math.max(0, i - 1)]; p2 = p[Math.min(n - 1, i + 1)]; p3 = p[Math.min(n - 1, i + 2)]; }
      var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += 'C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ',' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ',' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }
    if (closed) d += 'Z';
    return d;
  }
  function poly(points) {
    return 'M' + points.map(function (q) { return q.x.toFixed(1) + ' ' + q.y.toFixed(1); }).join(' L') + 'Z';
  }

  /* ---------- geography (lat/lng control points) ---------- */
  /* Atlantic coast, Rabat side, SW → river mouth headland */
  var COAST_RABAT = [
    [33.920, -6.960], [33.938, -6.930], [33.952, -6.912], [33.966, -6.897],
    [33.980, -6.882], [33.994, -6.870], [34.006, -6.861], [34.016, -6.854],
    [34.024, -6.847], [34.0295, -6.8408], [34.0322, -6.8378]
  ];
  /* west breakwater out + back into the mouth */
  var JETTY_W = [[34.0322, -6.8378], [34.0372, -6.8382], [34.0340, -6.8345]];
  /* Bou Regreg west/Rabat bank, mouth → upstream, off the east edge */
  var RIVER_W = [
    [34.0340, -6.8345], [34.0312, -6.8328], [34.0288, -6.8311], [34.0268, -6.8291],
    [34.0252, -6.8266], [34.0243, -6.8240], [34.0238, -6.8214], [34.0227, -6.8186],
    [34.0203, -6.8160], [34.0172, -6.8142], [34.0136, -6.8128], [34.0098, -6.8118],
    [34.0060, -6.8105], [34.0028, -6.8075], [34.0000, -6.8030], [33.9978, -6.7975],
    [33.9962, -6.7905], [33.9950, -6.7810], [33.9945, -6.7700], [33.9940, -6.7300]
  ];
  /* east breakwater */
  var JETTY_E = [[34.0392, -6.8362], [34.0368, -6.8330]];
  /* Bou Regreg east/Salé bank, mouth → upstream (≈300–450 m off the west bank) */
  var RIVER_E = [
    [34.0368, -6.8330], [34.0344, -6.8305], [34.0320, -6.8285], [34.0300, -6.8262],
    [34.0285, -6.8240], [34.0276, -6.8215], [34.0270, -6.8190], [34.0258, -6.8160],
    [34.0234, -6.8130], [34.0203, -6.8105], [34.0166, -6.8090], [34.0128, -6.8078],
    [34.0095, -6.8060], [34.0065, -6.8030], [34.0040, -6.7988], [34.0020, -6.7935],
    [34.0006, -6.7868], [33.9996, -6.7780], [33.9990, -6.7680], [33.9985, -6.7300]
  ];
  /* Salé coast, east jetty → NE */
  var COAST_SALE = [
    [34.0392, -6.8362], [34.0398, -6.8300], [34.0420, -6.8230], [34.0455, -6.8130],
    [34.0500, -6.8020], [34.0550, -6.7900], [34.0605, -6.7770], [34.0660, -6.7640],
    [34.0720, -6.7480]
  ];
  /* marina basin on the Salé bank (stylised) */
  var MARINA = [
    [34.0300, -6.8262], [34.0285, -6.8240], [34.0290, -6.8225],
    [34.0305, -6.8230], [34.0312, -6.8250]
  ];
  /* medina boundary */
  var MEDINA = [
    [34.0310, -6.8395], [34.0230, -6.8440], [34.0172, -6.8422],
    [34.0248, -6.8288], [34.0300, -6.8320], [34.0317, -6.8366]
  ];
  /* kasbah */
  var KASBAH = [
    [34.0338, -6.8366], [34.0322, -6.8388], [34.0303, -6.8374],
    [34.0307, -6.8352], [34.0323, -6.8344]
  ];
  /* tram line L1 (Salé → bridge → centre → Agdal) */
  var TRAM = [
    [34.0440, -6.8160], [34.0360, -6.8210], [34.0302, -6.8244], [34.0252, -6.8268],
    [34.0218, -6.8330], [34.0188, -6.8372], [34.0160, -6.8367], [34.0095, -6.8425],
    [34.0010, -6.8495], [33.9930, -6.8555]
  ];
  var BRIDGE = [[34.0250, -6.8266], [34.0303, -6.8243]];
  var AVENUE = [[34.0258, -6.8360], [34.0190, -6.8368], [34.0160, -6.8367], [34.0080, -6.8378]];

  var COLORS = {
    water: '#16415d', waterDeep: '#0d2433',
    landRabat: '#24332c', landSale: '#212f2c',
    medina: 'rgba(200, 85, 44, 0.16)', kasbah: 'rgba(86, 110, 220, 0.25)',
    green: 'rgba(40, 120, 90, 0.4)',
    line: 'rgba(247, 241, 227, 0.16)',
    sight: '#2fbf9a', food: '#e0764f', stay: '#7d96ff', transit: '#d9b97f'
  };

  /* ---------- state ---------- */
  var svg, gGeo, gRoute, gMarkers, gNums, stage, tip, card, cardBody, scaleBar;
  var vb = { x: 0, y: 0, w: W, h: H };
  var HOME, FULL;
  var markers = {};   /* poiId -> {el, x, y, type} */
  var activeDay = 'all';
  var layerOn = { sight: true, food: true, stay: true, transit: true };
  var poiById = {};

  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function rectFromLatLng(latTop, lngLeft, latBot, lngRight, pad) {
    var a = P(latTop, lngLeft), b = P(latBot, lngRight);
    var w = b.x - a.x, h = b.y - a.y;
    pad = pad === undefined ? 0.12 : pad;
    var r = { x: a.x - w * pad, y: a.y - h * pad, w: w * (1 + pad * 2), h: h * (1 + pad * 2) };
    /* match stage aspect */
    var ar = stage.clientWidth / stage.clientHeight;
    if (r.w / r.h < ar) { var nw = r.h * ar; r.x -= (nw - r.w) / 2; r.w = nw; }
    else { var nh = r.w / ar; r.y -= (nh - r.h) / 2; r.h = nh; }
    return r;
  }

  /* ---------- drawing ---------- */
  function drawBase() {
    /* water background */
    el('rect', { x: -200, y: -200, width: W + 400, height: H + 400, fill: COLORS.water }, gGeo);
    /* subtle bathymetry waves */
    for (var i = 0; i < 5; i++) {
      var off = 18 + i * 26;
      var wave = COAST_RABAT.map(function (c) { return [c[0] + off / (KMY * S) * 0.7, c[1] - off / (KMX * S)]; });
      el('path', { d: smooth(pts(wave)), fill: 'none', stroke: 'rgba(150,205,220,0.07)', 'stroke-width': 1.2 }, gGeo);
    }

    /* Rabat land: coast → headland → west jetty → river west bank → SE corner → S/W edges */
    var rabatLand = pts(COAST_RABAT)
      .concat(pts(JETTY_W))
      .concat(pts(RIVER_W))
      .concat([{ x: W + 200, y: H + 200 }, { x: -200, y: H + 200 }]);
    el('path', { d: poly(rabatLand), fill: COLORS.landRabat }, gGeo);

    /* Salé land: east jetty → river east bank → SE edge → E edge → NE corner → Salé coast reversed */
    var saleLand = pts(JETTY_E)
      .concat(pts(RIVER_E))
      .concat([{ x: W + 200, y: P(34.0052, -6.73).y }, { x: W + 200, y: -200 }])
      .concat(pts(COAST_SALE).reverse());
    el('path', { d: poly(saleLand), fill: COLORS.landSale }, gGeo);

    /* shorelines — crisp light edges so water reads instantly */
    function line(p) { return 'M' + p.map(function (q) { return q.x.toFixed(1) + ' ' + q.y.toFixed(1); }).join(' L'); }
    var shore = { fill: 'none', stroke: 'rgba(165,215,228,0.5)', 'stroke-width': 1.6, 'stroke-linejoin': 'round' };
    el('path', Object.assign({ d: line(pts(COAST_RABAT).concat(pts(JETTY_W)).concat(pts(RIVER_W))) }, shore), gGeo);
    el('path', Object.assign({ d: line(pts(COAST_SALE.slice().reverse()).concat(pts(JETTY_E)).concat(pts(RIVER_E))) }, shore), gGeo);

    /* marina basin */
    el('path', { d: smooth(pts(MARINA), true), fill: COLORS.water, stroke: 'rgba(165,215,228,0.45)', 'stroke-width': 1.2 }, gGeo);

    /* little sails on the Atlantic */
    [[34.0470, -6.8760], [34.0395, -6.8580], [34.0560, -6.8420]].forEach(function (b) {
      var c = P(b[0], b[1]);
      el('path', { d: 'M' + c.x + ' ' + (c.y - 5) + ' L' + (c.x + 3.4) + ' ' + (c.y + 2.6) + ' L' + (c.x - 3.4) + ' ' + (c.y + 2.6) + ' Z', fill: 'rgba(247,241,227,0.55)' }, gGeo);
    });

    /* districts */
    el('path', { d: smooth(pts(MEDINA), true), fill: COLORS.medina, stroke: 'rgba(224,118,79,0.5)', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, gGeo);
    el('path', { d: smooth(pts(KASBAH), true), fill: COLORS.kasbah, stroke: 'rgba(125,150,255,0.6)', 'stroke-width': 1.4 }, gGeo);

    /* greens */
    [[34.0306, -6.8348, 7], [34.0067, -6.8203, 13], [34.0017, -6.8410, 17], [33.954, -6.883, 20], [34.012, -6.846, 9], [33.985, -6.824, 14]].forEach(function (g) {
      var c = P(g[0], g[1]);
      el('circle', { cx: c.x, cy: c.y, r: g[2], fill: COLORS.green }, gGeo);
    });

    /* roads / tram */
    el('path', { d: smooth(pts(AVENUE)), fill: 'none', stroke: COLORS.line, 'stroke-width': 2.4 }, gGeo);
    el('path', { d: smooth(pts(TRAM)), fill: 'none', stroke: 'rgba(217,185,127,0.45)', 'stroke-width': 1.6, 'stroke-dasharray': '8 5' }, gGeo);
    var b1 = P(BRIDGE[0][0], BRIDGE[0][1]), b2 = P(BRIDGE[1][0], BRIDGE[1][1]);
    el('line', { x1: b1.x, y1: b1.y, x2: b2.x, y2: b2.y, stroke: 'rgba(247,241,227,0.55)', 'stroke-width': 4, 'stroke-linecap': 'round' }, gGeo);
    el('line', { x1: b1.x, y1: b1.y, x2: b2.x, y2: b2.y, stroke: COLORS.waterDeep, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, gGeo);

    /* rowboat crossing (animated dashes drift across) */
    var r1 = P(34.0284, -6.8306), r2 = P(34.0306, -6.8270);
    el('line', { x1: r1.x, y1: r1.y, x2: r2.x, y2: r2.y, stroke: 'rgba(150,205,220,0.85)', 'stroke-width': 1.6, 'stroke-dasharray': '2 5', 'stroke-linecap': 'round', class: 'mp-rowboat' }, gGeo);

    /* arrival ping at the airport */
    var ap = P(34.0376, -6.7516);
    var ping = el('g', { class: 'mp-ping', transform: 'translate(' + ap.x + ' ' + ap.y + ')' }, gGeo);
    el('circle', { cx: 0, cy: 0, r: 10, fill: 'none', stroke: 'rgba(217,164,65,0.7)', 'stroke-width': 1.6, class: 'mp-ping__ring' }, ping);

    /* labels */
    label('ATLANTIC  OCEAN', 34.0560, -6.9080, 21, -27, true);
    label('Bou Regreg', 34.0148, -6.8088, 12.5, 38, true);
    label('R A B A T', 34.0075, -6.8650, 19, 0);
    label('S A L É', 34.0520, -6.7950, 16, 0);
    label('Medina', 34.0228, -6.8402, 9.5, 0);
    label('Kasbah', 34.0344, -6.8404, 9, 0);
    label('Hassan', 34.0182, -6.8268, 9, 0);
    label('Ville Nouvelle', 34.0108, -6.8420, 9, 0);
    label('Agdal', 33.9905, -6.8565, 10, 0);
    label('Souissi', 33.9840, -6.8330, 10, 0);
    label('Hay Riad', 33.9590, -6.8740, 10, 0);
    label('marina', 34.0322, -6.8198, 7.5, 0, true);
  }

  function label(txt, lat, lng, size, rot, water) {
    var c = P(lat, lng);
    var t = el('text', {
      x: c.x, y: c.y,
      'font-size': size,
      'letter-spacing': size > 14 ? 3 : 1.5,
      'text-anchor': 'middle',
      class: 'mp-label' + (water ? ' mp-label--water' : ''),
      transform: rot ? 'rotate(' + rot + ' ' + c.x + ' ' + c.y + ')' : ''
    }, gGeo);
    t.textContent = txt;
  }

  /* marker shapes by type */
  function markerShape(type, g) {
    if (type === 'sight') {
      el('path', { d: 'M0 -8 L7 0 L0 8 L-7 0 Z', fill: COLORS.sight, stroke: '#f7f1e3', 'stroke-width': 1.6, class: 'bg' }, g);
    } else if (type === 'food') {
      el('circle', { cx: 0, cy: 0, r: 7, fill: COLORS.food, stroke: '#f7f1e3', 'stroke-width': 1.6, class: 'bg' }, g);
      el('circle', { cx: 0, cy: 0, r: 2.2, fill: '#f7f1e3' }, g);
    } else if (type === 'stay') {
      el('rect', { x: -6.5, y: -6.5, width: 13, height: 13, rx: 3.5, fill: COLORS.stay, stroke: '#f7f1e3', 'stroke-width': 1.6, class: 'bg' }, g);
    } else {
      el('path', { d: 'M0 -8 L7.5 6 L-7.5 6 Z', fill: COLORS.transit, stroke: '#f7f1e3', 'stroke-width': 1.6, class: 'bg' }, g);
    }
  }

  function drawMarkers(pois) {
    pois.forEach(function (poi) {
      poiById[poi.id] = poi;
      var c = P(poi.lat, poi.lng);
      var g = el('g', { class: 'mp-marker', 'data-id': poi.id, 'data-type': poi.type, tabindex: 0, role: 'button', 'aria-label': poi.name }, gMarkers);
      markerShape(poi.type, g);
      markers[poi.id] = { el: g, x: c.x, y: c.y, type: poi.type };
      g.addEventListener('click', function (e) { e.stopPropagation(); openCard(poi.id); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(poi.id); } });
      g.addEventListener('pointerenter', function () { showTip(poi, c); });
      g.addEventListener('pointerleave', hideTip);
    });
    layoutMarkers();
  }

  /* counter-scale markers so they keep apparent size while zooming */
  function layoutMarkers() {
    var f = vb.w / HOME.w;
    Object.keys(markers).forEach(function (id) {
      var m = markers[id];
      m.el.setAttribute('transform', 'translate(' + m.x + ' ' + m.y + ') scale(' + (f * 1.0).toFixed(3) + ')');
    });
    gNums.setAttribute('data-f', f);
    Array.prototype.forEach.call(gNums.children, function (n) {
      var x = +n.getAttribute('data-x'), y = +n.getAttribute('data-y');
      n.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + f.toFixed(3) + ')');
    });
    Array.prototype.forEach.call(gRoute.querySelectorAll('.mp-route'), function (p) {
      p.setAttribute('stroke-width', (2.6 * f).toFixed(2));
      p.setAttribute('stroke-dasharray', (7 * f).toFixed(1) + ' ' + (7 * f).toFixed(1));
    });
    updateScaleBar();
  }

  /* ---------- tooltip & card ---------- */
  function showTip(poi, c) {
    var pt = toScreen(c.x, c.y);
    tip.textContent = poi.name + (poi.rating && poi.rating.score ? '  ·  ' + poi.rating.score + (poi.rating.src === 'Booking.com' ? '/10' : '★') : '');
    tip.style.left = pt.x + 'px';
    tip.style.top = pt.y + 'px';
    tip.hidden = false;
  }
  function hideTip() { tip.hidden = true; }

  function toScreen(x, y) {
    var r = stage.getBoundingClientRect();
    return { x: (x - vb.x) / vb.w * r.width, y: (y - vb.y) / vb.h * r.height };
  }

  function stars(score) {
    var pct = Math.max(0, Math.min(100, score / 5 * 100));
    return '<span class="mc-stars" style="position:relative;color:rgba(28,36,32,0.2)">★★★★★<i style="position:absolute;left:0;top:0;width:' + pct + '%;overflow:hidden;color:#d9a441;font-style:normal">★★★★★</i></span>';
  }

  var TYPE_LABEL = { sight: 'Sight', food: 'Table', stay: 'Stay', transit: 'Getting around' };
  function openCard(id) {
    var poi = poiById[id];
    if (!poi) return;
    Object.keys(markers).forEach(function (k) { markers[k].el.classList.toggle('is-active', k === id); });
    var r = poi.rating || {};
    var ratingHtml = '';
    if (r.score && r.src === 'Booking.com') {
      ratingHtml = '<div class="mc-rating"><span class="mc-badge" style="background:#d9a441;color:#0c1512;font-weight:700;border-radius:6px;padding:2px 7px">' + r.score.toFixed(1) + '</span><b>/10 ' + r.src + '</b><span>' + (r.count ? r.count.toLocaleString('en') + ' reviews' : '') + '</span></div>';
    } else if (r.score) {
      ratingHtml = '<div class="mc-rating">' + stars(r.score) + '<b>' + r.score.toFixed(1) + '</b><span>' + (r.count ? '~' + r.count.toLocaleString('en') + ' reviews · ' : '') + (r.src || '') + '</span></div>';
    } else if (r.src) {
      ratingHtml = '<div class="mc-rating"><span>' + r.src + '</span></div>';
    }
    cardBody.innerHTML =
      '<p class="mc-type" style="--c:' + COLORS[poi.type] + '">' + TYPE_LABEL[poi.type] + (poi.cuisine ? ' · ' + poi.cuisine : '') + (poi.style ? ' · ' + poi.style : '') + '</p>' +
      '<h3 class="mc-name">' + poi.name + '</h3>' +
      '<p class="mc-area">' + poi.area + (poi.price ? ' · ' + poi.price : '') + '</p>' +
      ratingHtml +
      '<p class="mc-desc">' + poi.desc + '</p>' +
      (poi.why ? '<p class="mc-why">' + poi.why + '</p>' : '') +
      (poi.book ? '<a class="mc-book" href="' + poi.book + '" target="_blank" rel="noopener">Check availability for our dates →</a>' : '');
    card.hidden = false;
    /* gently centre the marker */
    var m = markers[id];
    flyTo({ x: m.x - vb.w / 2, y: m.y - vb.h / 2, w: vb.w, h: vb.h });
  }
  function closeCard() {
    card.hidden = true;
    Object.keys(markers).forEach(function (k) { markers[k].el.classList.remove('is-active'); });
  }

  /* ---------- day routes ---------- */
  function dayStops(day) {
    var out = [];
    day.stops.forEach(function (s) {
      var c = null, id = null;
      if (s.poi && poiById[s.poi]) { c = P(poiById[s.poi].lat, poiById[s.poi].lng); id = s.poi; }
      else if (s.anchor) { c = P(s.anchor.lat, s.anchor.lng); }
      if (c) out.push({ c: c, id: id, label: s.label });
    });
    return out;
  }

  function setDay(d, fly) {
    activeDay = d;
    gRoute.innerHTML = '';
    gNums.innerHTML = '';
    document.querySelectorAll('.rb-map__tab').forEach(function (b) {
      b.classList.toggle('is-active', String(b.getAttribute('data-day')) === String(d));
    });
    applyLayerVisibility();
    if (d === 'all') { if (fly !== false) flyTo(HOME); return; }

    var day = window.RABAT.days[d - 1];
    var stops = dayStops(day);
    if (!stops.length) return;

    /* route */
    var path = el('path', { d: smooth(stops.map(function (s) { return s.c; })), class: 'mp-route' }, gRoute);
    path.setAttribute('stroke', day.color || '#d9a441');

    /* numbered badges */
    stops.forEach(function (s, i) {
      var g = el('g', { class: 'mp-num', 'data-x': s.c.x, 'data-y': s.c.y, role: 'button', 'aria-label': 'Stop ' + (i + 1) + ': ' + s.label }, gNums);
      el('circle', { cx: 0, cy: 0, r: 9.5, fill: day.color || '#d9a441', stroke: '#f7f1e3', 'stroke-width': 1.8 }, g);
      var t = el('text', { x: 0, y: 3.4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: '#f7f1e3', 'font-family': 'Space Grotesk, sans-serif' }, g);
      t.textContent = i + 1;
      if (s.id) g.addEventListener('click', function (e) { e.stopPropagation(); openCard(s.id); });
    });

    /* draw-in animation */
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(path.style, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', delay: 0.3, onComplete: function () { layoutMarkers(); } });
    } else {
      path.style.strokeDashoffset = 0;
      layoutMarkers();
    }

    /* fit route */
    if (fly !== false) {
      var xs = stops.map(function (s) { return s.c.x; }), ys = stops.map(function (s) { return s.c.y; });
      var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
      var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
      var pad = Math.max((maxX - minX), (maxY - minY)) * 0.22 + 30;
      flyTo(fitAspect({ x: minX - pad, y: minY - pad, w: (maxX - minX) + pad * 2, h: (maxY - minY) + pad * 2 }));
    }
    layoutMarkers();
  }

  function fitAspect(r) {
    var ar = stage.clientWidth / stage.clientHeight;
    if (r.w / r.h < ar) { var nw = r.h * ar; r.x -= (nw - r.w) / 2; r.w = nw; }
    else { var nh = r.w / ar; r.y -= (nh - r.h) / 2; r.h = nh; }
    return r;
  }

  function applyLayerVisibility() {
    Object.keys(markers).forEach(function (id) {
      var m = markers[id];
      var visible = layerOn[m.type] !== false;
      if (activeDay !== 'all') {
        var day = window.RABAT.days[activeDay - 1];
        var inDay = day.stops.some(function (s) { return s.poi === id; });
        m.el.style.opacity = inDay ? 1 : (visible ? 0.22 : 0);
        m.el.style.pointerEvents = (inDay || visible) ? 'auto' : 'none';
      } else {
        m.el.style.opacity = visible ? 1 : 0;
        m.el.style.pointerEvents = visible ? 'auto' : 'none';
      }
    });
  }

  /* ---------- view control ---------- */
  function setViewBox(r) {
    vb = r;
    svg.setAttribute('viewBox', r.x.toFixed(1) + ' ' + r.y.toFixed(1) + ' ' + r.w.toFixed(1) + ' ' + r.h.toFixed(1));
  }
  var flyTween = null;
  function flyTo(r) {
    hideTip();
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (flyTween) flyTween.kill();
      var s0 = { x: vb.x, y: vb.y, w: vb.w, h: vb.h };
      flyTween = gsap.to(s0, {
        x: r.x, y: r.y, w: r.w, h: r.h,
        duration: 1.25, ease: 'power3.inOut',
        onUpdate: function () { setViewBox({ x: s0.x, y: s0.y, w: s0.w, h: s0.h }); layoutMarkers(); }
      });
    } else {
      setViewBox(r);
      layoutMarkers();
    }
  }

  function zoom(factor, cx, cy) {
    var r = stage.getBoundingClientRect();
    cx = cx === undefined ? r.width / 2 : cx;
    cy = cy === undefined ? r.height / 2 : cy;
    var mx = vb.x + cx / r.width * vb.w;
    var my = vb.y + cy / r.height * vb.h;
    var nw = Math.min(Math.max(vb.w / factor, W * 0.045), W * 1.4);
    var nh = nw * vb.h / vb.w;
    flyTo({ x: mx - (mx - vb.x) * nw / vb.w, y: my - (my - vb.y) * nh / vb.h, w: nw, h: nh });
  }

  function updateScaleBar() {
    if (!scaleBar) return;
    var r = stage.getBoundingClientRect();
    var kmPerPx = vb.w / S / r.width;
    var targetPx = 90;
    var km = kmPerPx * targetPx;
    var nice = [0.25, 0.5, 1, 2, 5, 10].reduce(function (a, b) { return Math.abs(b - km) < Math.abs(a - km) ? b : a; });
    scaleBar.querySelector('i').style.width = (nice / kmPerPx).toFixed(0) + 'px';
    scaleBar.querySelector('b').textContent = nice < 1 ? (nice * 1000) + ' m' : nice + ' km';
  }

  /* ---------- pan / pinch ---------- */
  function bindPointer(canvas) {
    var pointers = new Map();
    var start = null;

    canvas.addEventListener('pointerdown', function (e) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      canvas.setPointerCapture(e.pointerId);
      if (pointers.size === 1) {
        start = { px: e.clientX, py: e.clientY, vb: { x: vb.x, y: vb.y, w: vb.w, h: vb.h }, moved: false };
        canvas.classList.add('is-panning');
        if (flyTween) flyTween.kill();
      } else if (pointers.size === 2) {
        var arr = Array.from(pointers.values());
        start = {
          pinch: true,
          d0: Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y),
          mid: { x: (arr[0].x + arr[1].x) / 2, y: (arr[0].y + arr[1].y) / 2 },
          vb: { x: vb.x, y: vb.y, w: vb.w, h: vb.h }
        };
      }
    });

    canvas.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId) || !start) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      var r = stage.getBoundingClientRect();
      if (start.pinch && pointers.size === 2) {
        var arr = Array.from(pointers.values());
        var d1 = Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y);
        var f = Math.min(Math.max(d1 / start.d0, 0.3), 3.5);
        var nw = Math.min(Math.max(start.vb.w / f, W * 0.045), W * 1.4);
        var nh = nw * start.vb.h / start.vb.w;
        var mx = start.vb.x + (start.mid.x - r.left) / r.width * start.vb.w;
        var my = start.vb.y + (start.mid.y - r.top) / r.height * start.vb.h;
        setViewBox({ x: mx - (mx - start.vb.x) * nw / start.vb.w, y: my - (my - start.vb.y) * nh / start.vb.h, w: nw, h: nh });
        layoutMarkers();
      } else if (!start.pinch) {
        var dx = (e.clientX - start.px) * vb.w / r.width;
        var dy = (e.clientY - start.py) * vb.h / r.height;
        if (Math.abs(e.clientX - start.px) + Math.abs(e.clientY - start.py) > 4) start.moved = true;
        setViewBox({ x: start.vb.x - dx, y: start.vb.y - dy, w: start.vb.w, h: start.vb.h });
        layoutMarkers();
      }
    });

    function up(e) {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) { canvas.classList.remove('is-panning'); start = null; }
    }
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    canvas.addEventListener('dblclick', function (e) {
      var r = stage.getBoundingClientRect();
      zoom(1.7, e.clientX - r.left, e.clientY - r.top);
    });

    canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.25 : 0.8, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
  }

  /* ---------- inset ---------- */
  function drawInset() {
    var insetSvg = document.getElementById('inset-svg');
    if (!insetSvg || !window.MA_OUTLINE) return;
    var lats = MA_OUTLINE.map(function (c) { return c[0]; });
    var lngs = MA_OUTLINE.map(function (c) { return c[1]; });
    var la0 = Math.min.apply(null, lats), la1 = Math.max.apply(null, lats);
    var lo0 = Math.min.apply(null, lngs), lo1 = Math.max.apply(null, lngs);
    var sc = Math.min(108 / (lo1 - lo0), 108 / (la1 - la0));
    function ip(c) { return { x: 6 + (c[1] - lo0) * sc, y: 6 + (la1 - c[0]) * sc * 0.86 }; }
    var d = 'M' + MA_OUTLINE.map(function (c) { var p = ip(c); return p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' L') + 'Z';
    el('path', { d: d, fill: 'rgba(47,191,154,0.18)', stroke: 'rgba(47,191,154,0.8)', 'stroke-width': 1.2 }, insetSvg);
    var rb = ip([34.02, -6.84]);
    el('circle', { cx: rb.x, cy: rb.y, r: 3.2, fill: '#d9a441' }, insetSvg);
    el('circle', { cx: rb.x, cy: rb.y, r: 6.5, fill: 'none', stroke: '#d9a441', 'stroke-width': 1 }, insetSvg);
  }

  /* ---------- init ---------- */
  function init() {
    stage = document.getElementById('map-stage');
    var canvas = document.getElementById('map-canvas');
    tip = document.getElementById('map-tip');
    card = document.getElementById('map-card');
    cardBody = document.getElementById('map-card-body');
    if (!stage || !canvas || !window.RABAT) return;

    svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid slice', 'aria-label': 'Stylised map of Rabat and Salé' });
    canvas.appendChild(svg);
    gGeo = el('g', {}, svg);
    gRoute = el('g', {}, svg);
    gMarkers = el('g', {}, svg);
    gNums = el('g', {}, svg);

    var portrait = stage.clientWidth < stage.clientHeight;
    HOME = portrait
      ? rectFromLatLng(34.046, -6.862, 34.000, -6.800, 0.05)
      : rectFromLatLng(34.052, -6.882, 33.994, -6.782, 0.04);
    FULL = fitAspect({ x: 0, y: 0, w: W, h: H });

    drawBase();
    drawMarkers(window.RABAT.pois);
    drawInset();

    /* scale bar + compass */
    scaleBar = document.createElement('div');
    scaleBar.className = 'rb-map__scale';
    scaleBar.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1 L11 11 L8 8.6 L5 11 Z" fill="#f7f1e3"/></svg><em>N</em><i></i><b></b>';
    stage.appendChild(scaleBar);

    setViewBox(HOME);
    layoutMarkers();

    bindPointer(canvas);
    document.getElementById('zoom-in').addEventListener('click', function () { zoom(1.45); });
    document.getElementById('zoom-out').addEventListener('click', function () { zoom(0.69); });
    document.getElementById('zoom-reset').addEventListener('click', function () { closeCard(); setDay('all'); });
    document.getElementById('map-card-close').addEventListener('click', closeCard);
    svg.addEventListener('click', function (e) { if (e.target === svg || e.target.parentNode === gGeo) closeCard(); });

    document.querySelectorAll('.rb-map__tab').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = b.getAttribute('data-day');
        closeCard();
        setDay(d === 'all' ? 'all' : +d);
      });
    });
    document.querySelectorAll('.rb-map__layer').forEach(function (b) {
      b.addEventListener('click', function () {
        var l = b.getAttribute('data-layer');
        layerOn[l] = !layerOn[l];
        b.classList.toggle('is-on', layerOn[l]);
        applyLayerVisibility();
      });
    });

    window.addEventListener('resize', function () { setViewBox(vb); layoutMarkers(); });
  }

  return {
    init: init,
    focusPoi: function (id) {
      if (!markers[id]) return;
      var m = markers[id];
      var nw = Math.min(vb.w, HOME.w * 0.5);
      var nh = nw * vb.h / vb.w;
      openCard(id);
      flyTo({ x: m.x - nw / 2, y: m.y - nh / 2, w: nw, h: nh });
    },
    setDay: setDay
  };
})();
