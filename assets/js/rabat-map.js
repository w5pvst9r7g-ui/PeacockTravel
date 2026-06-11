/* Peacock Travel — Rabat map
   Real OpenStreetMap geography (grey CARTO Positron tiles via Leaflet),
   with the family's own layer on top: shaped markers, day routes, district
   tints and the railway to Casablanca. The stylised projection below is
   kept for the itinerary's mini-map thumbnails. */
window.RabatMap = (function () {
  'use strict';

  /* ---------- stylised projection (thumbnails only) ---------- */
  var BBOX = { latMin: 33.928, latMax: 34.078, lngMin: -6.935, lngMax: -6.736 };
  var KMX = 111.32 * Math.cos(34.02 * Math.PI / 180);
  var KMY = 110.57;
  var S = 52;

  function P(lat, lng) {
    return {
      x: (lng - BBOX.lngMin) * KMX * S,
      y: (BBOX.latMax - lat) * KMY * S
    };
  }
  function pts(arr) { return arr.map(function (c) { return P(c[0], c[1]); }); }

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

  /* coast & river control points (real coordinates, lightly stylised) */
  var COAST_RABAT = [
    [33.920, -6.960], [33.938, -6.930], [33.952, -6.912], [33.966, -6.897],
    [33.980, -6.882], [33.994, -6.870], [34.006, -6.861], [34.016, -6.854],
    [34.024, -6.847], [34.0295, -6.8408], [34.0322, -6.8378]
  ];
  var RIVER_W = [
    [34.0340, -6.8345], [34.0312, -6.8328], [34.0288, -6.8311], [34.0268, -6.8291],
    [34.0252, -6.8266], [34.0243, -6.8240], [34.0238, -6.8214], [34.0227, -6.8186],
    [34.0203, -6.8160], [34.0172, -6.8142], [34.0136, -6.8128], [34.0098, -6.8118],
    [34.0060, -6.8105], [34.0028, -6.8075], [34.0000, -6.8030], [33.9978, -6.7975],
    [33.9962, -6.7905], [33.9950, -6.7810], [33.9945, -6.7700], [33.9940, -6.7300]
  ];
  var RIVER_E = [
    [34.0368, -6.8330], [34.0344, -6.8305], [34.0320, -6.8285], [34.0300, -6.8262],
    [34.0285, -6.8240], [34.0276, -6.8215], [34.0270, -6.8190], [34.0258, -6.8160],
    [34.0234, -6.8130], [34.0203, -6.8105], [34.0166, -6.8090], [34.0128, -6.8078],
    [34.0095, -6.8060], [34.0065, -6.8030], [34.0040, -6.7988], [34.0020, -6.7935],
    [34.0006, -6.7868], [33.9996, -6.7780], [33.9990, -6.7680], [33.9985, -6.7300]
  ];
  var COAST_SALE = [
    [34.0392, -6.8362], [34.0398, -6.8300], [34.0420, -6.8230], [34.0455, -6.8130],
    [34.0500, -6.8020], [34.0550, -6.7900], [34.0605, -6.7770], [34.0660, -6.7640],
    [34.0720, -6.7480]
  ];
  /* overlays drawn on the live map */
  var MEDINA = [
    [34.0310, -6.8395], [34.0230, -6.8440], [34.0172, -6.8422],
    [34.0248, -6.8288], [34.0300, -6.8320], [34.0317, -6.8366]
  ];
  var KASBAH = [
    [34.0338, -6.8366], [34.0322, -6.8388], [34.0303, -6.8374],
    [34.0307, -6.8352], [34.0323, -6.8344]
  ];
  var RAIL = [
    [34.0160, -6.8367], [34.0110, -6.8430], [34.0030, -6.8490], [33.9920, -6.8570],
    [33.9760, -6.8700], [33.9580, -6.8860], [33.9380, -6.9060], [33.9180, -6.9280]
  ];
  var ROWBOAT = [[34.0284, -6.8306], [34.0306, -6.8270]];

  var COLORS = {
    sight: '#0e7c66', food: '#c8552c', stay: '#4a63d8', transit: '#9c7c2e'
  };

  /* ---------- state ---------- */
  var map, stage, card, cardBody;
  var markers = {};        /* poiId -> { m: L.Marker, type } */
  var cluster = null;      /* L.MarkerClusterGroup holding visible markers */
  var routeLayer = null;
  var numsLayer = null;
  var activeDay = 'all';
  var layerOn = { sight: true, food: true, stay: true, transit: true };
  var poiById = {};
  var HOME = [[33.990, -6.884], [34.058, -6.778]];
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Catmull-Rom sampling so routes curve gently */
  function curve(lls, per) {
    if (lls.length < 3) return lls;
    per = per || 10;
    var out = [], n = lls.length;
    for (var i = 0; i < n - 1; i++) {
      var p0 = lls[Math.max(0, i - 1)], p1 = lls[i], p2 = lls[i + 1], p3 = lls[Math.min(n - 1, i + 2)];
      for (var j = 0; j < per; j++) {
        var t = j / per, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    out.push(lls[n - 1]);
    return out;
  }

  /* ---------- markers ---------- */
  function shapeHTML(type) {
    var c = COLORS[type], s = '';
    if (type === 'sight') s = '<path d="M0 -7.6 L7 0 L0 7.6 L-7 0 Z"/>';
    else if (type === 'food') s = '<circle r="6.6"/><circle r="2" fill="#fff" stroke="none"/>';
    else if (type === 'stay') s = '<rect x="-6" y="-6" width="12" height="12" rx="3.2"/>';
    else s = '<path d="M0 -7.4 L7 5.6 L-7 5.6 Z"/>';
    return '<svg viewBox="-10 -10 20 20" width="24" height="24" style="overflow:visible">' +
      '<g fill="' + c + '" stroke="#fffdf6" stroke-width="1.8">' + s + '</g></svg>';
  }

  function tipText(poi) {
    var r = poi.rating || {};
    return poi.name + (r.score ? '  ·  ' + r.score + (r.src === 'Booking.com' ? '/10' : '★') : '');
  }

  function drawMarkers(pois) {
    cluster = L.markerClusterGroup({
      maxClusterRadius: 36,
      disableClusteringAtZoom: 15,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: function (c) {
        return L.divIcon({ className: 'lf-cluster', html: '<span>' + c.getChildCount() + '</span>', iconSize: [32, 32] });
      }
    }).addTo(map);
    pois.forEach(function (poi) {
      poiById[poi.id] = poi;
      var m = L.marker([poi.lat, poi.lng], {
        icon: L.divIcon({ className: 'lf-pin lf-pin--' + poi.type, html: shapeHTML(poi.type), iconSize: [24, 24], iconAnchor: [12, 12] }),
        keyboard: true, title: poi.name
      });
      m.bindTooltip(tipText(poi), { direction: 'top', offset: [0, -10], className: 'lf-tip' });
      m.on('click', function () { openCard(poi.id); });
      cluster.addLayer(m);
      markers[poi.id] = { m: m, type: poi.type, shown: true };
    });
  }

  /* ---------- detail card (unchanged design) ---------- */
  function stars(score) {
    var pct = Math.max(0, Math.min(100, score / 5 * 100));
    return '<span class="mc-stars" style="position:relative;color:rgba(28,36,32,0.2)">★★★★★<i style="position:absolute;left:0;top:0;width:' + pct + '%;overflow:hidden;color:#d9a441;font-style:normal">★★★★★</i></span>';
  }
  var TYPE_LABEL = { sight: 'Sight', food: 'Table', stay: 'Stay', transit: 'Getting around' };

  function openCard(id) {
    var poi = poiById[id];
    if (!poi) return;
    Object.keys(markers).forEach(function (k) {
      var el = markers[k].m.getElement();
      if (el) el.classList.toggle('is-active', k === id);
    });
    var r = poi.rating || {};
    var ratingHtml = '';
    if (r.score && r.src === 'Booking.com') {
      ratingHtml = '<div class="mc-rating"><span class="mc-badge" style="background:#d9a441;color:#0c1512;font-weight:700;border-radius:6px;padding:2px 7px">' + r.score.toFixed(1) + '</span><b>/10 ' + r.src + '</b><span>' + (r.count ? r.count.toLocaleString('en') + ' reviews' : '') + '</span></div>';
    } else if (r.score) {
      ratingHtml = '<div class="mc-rating">' + stars(r.score) + '<b>' + r.score.toFixed(1) + '</b><span>' + (r.count ? '~' + r.count.toLocaleString('en') + ' reviews · ' : '') + (r.src || '') + '</span></div>';
    } else if (r.src) {
      ratingHtml = '<div class="mc-rating"><span>' + r.src + '</span></div>';
    }
    var photoHtml = '';
    if (poi.img) {
      photoHtml = '<figure class="mc-photo"><img alt="" decoding="async" referrerpolicy="no-referrer">' +
        '<figcaption>' + poi.img.credit + ' · Wikimedia</figcaption></figure>';
    }
    cardBody.innerHTML = photoHtml +
      '<p class="mc-type" style="--c:' + COLORS[poi.type] + '">' + TYPE_LABEL[poi.type] + (poi.cuisine ? ' · ' + poi.cuisine : '') + (poi.style ? ' · ' + poi.style : '') + '</p>' +
      '<h3 class="mc-name">' + poi.name + '</h3>' +
      '<p class="mc-area">' + poi.area + (poi.price ? ' · ' + poi.price : '') + '</p>' +
      ratingHtml +
      '<p class="mc-desc">' + poi.desc + '</p>' +
      (poi.why ? '<p class="mc-why">' + poi.why + '</p>' : '') +
      '<div class="mc-links">' +
        (poi.book ? '<a class="mc-book" href="' + poi.book + '" target="_blank" rel="noopener">Check availability →</a>' : '') +
        '<a class="mc-book" href="https://www.google.com/maps/search/?api=1&query=' +
          encodeURIComponent(poi.type === 'transit' ? poi.lat + ',' + poi.lng : poi.name + ', Rabat') +
          '" target="_blank" rel="noopener">Google Maps ↗</a>' +
        '<button class="mc-book mc-copy" type="button">🔗 Copy link</button>' +
      '</div>';
    if (window.history && history.replaceState) history.replaceState(null, '', '#poi=' + id);
    var copyBtn = cardBody.querySelector('.mc-copy');
    copyBtn.addEventListener('click', function () {
      var url = location.origin + location.pathname + '#poi=' + id;
      var done = function () { copyBtn.textContent = '✓ Copied'; setTimeout(function () { copyBtn.textContent = '🔗 Copy link'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
      else done();
    });
    if (poi.img) {
      var ph = cardBody.querySelector('.mc-photo');
      var im = ph.querySelector('img');
      im.addEventListener('load', function () { ph.classList.add('is-loaded'); });
      im.src = poi.img.src;
      im.alt = poi.name;
    }
    card.hidden = false;
    map.panTo([poi.lat, poi.lng], { animate: !RM, duration: 0.8 });
  }
  function closeCard() {
    card.hidden = true;
    Object.keys(markers).forEach(function (k) {
      var el = markers[k].m.getElement();
      if (el) el.classList.remove('is-active');
    });
  }

  /* ---------- day routes ---------- */
  function dayStops(day) {
    var out = [];
    day.stops.forEach(function (s) {
      var ll = null, id = null;
      if (s.poi && poiById[s.poi]) { ll = [poiById[s.poi].lat, poiById[s.poi].lng]; id = s.poi; }
      else if (s.anchor) { ll = [s.anchor.lat, s.anchor.lng]; }
      if (ll) out.push({ ll: ll, id: id, label: s.label, t: s.t });
    });
    return out;
  }

  var manifest = null;
  function renderManifest(day, stops) {
    if (!manifest) {
      manifest = document.createElement('aside');
      manifest.className = 'rb-map__manifest';
      stage.appendChild(manifest);
    }
    if (!day) { manifest.hidden = true; return; }
    var rows = stops.map(function (s, i) {
      return '<button data-i="' + i + '"' + (s.id ? ' data-id="' + s.id + '"' : '') + '>' +
        '<i style="background:' + (day.color || '#d9a441') + '">' + (i + 1) + '</i>' +
        '<span><b>' + s.t + '</b>' + s.label + '</span></button>';
    }).join('');
    manifest.innerHTML = '<p style="--c:' + day.color + '">' + day.dow + ' — ' + day.title + '</p>' + rows;
    manifest.hidden = false;
    Array.prototype.forEach.call(manifest.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        if (id) { openCard(id); return; }
        map.flyTo(stops[+b.getAttribute('data-i')].ll, Math.max(map.getZoom(), 15), { animate: !RM });
      });
    });
  }

  function setDay(d, fly) {
    if (!map) return;
    activeDay = d;
    if (window.history && history.replaceState) history.replaceState(null, '', d === 'all' ? location.pathname : '#day=' + d);
    if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
    if (numsLayer) { map.removeLayer(numsLayer); numsLayer = null; }
    document.querySelectorAll('.rb-map__tab').forEach(function (b) {
      var on = String(b.getAttribute('data-day')) === String(d);
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    applyLayerVisibility();
    if (d === 'all') { renderManifest(null); if (fly !== false) map.flyToBounds(HOME, { animate: !RM, duration: 1.1 }); return; }

    var day = window.RABAT.days[d - 1];
    var stops = dayStops(day);
    renderManifest(day, stops);
    if (!stops.length) return;

    routeLayer = L.polyline(curve(stops.map(function (s) { return s.ll; })), {
      color: day.color || '#d9a441', weight: 3.5, dashArray: '8 8', opacity: 0.95, lineCap: 'round'
    }).addTo(map);

    numsLayer = L.layerGroup().addTo(map);
    stops.forEach(function (s, i) {
      var m = L.marker(s.ll, {
        icon: L.divIcon({
          className: 'lf-num',
          html: '<span style="background:' + (day.color || '#d9a441') + '">' + (i + 1) + '</span>',
          iconSize: [24, 24], iconAnchor: [12, 12]
        }),
        zIndexOffset: 600, title: s.label
      });
      m.bindTooltip(s.t + ' — ' + s.label, { direction: 'top', offset: [0, -10], className: 'lf-tip' });
      if (s.id) m.on('click', function () { openCard(s.id); });
      m.addTo(numsLayer);
    });

    if (fly !== false) map.flyToBounds(routeLayer.getBounds().pad(0.22), { animate: !RM, duration: 1.1 });
  }

  function applyLayerVisibility() {
    var day = activeDay !== 'all' ? window.RABAT.days[activeDay - 1] : null;
    Object.keys(markers).forEach(function (id) {
      var rec = markers[id];
      var show = layerOn[rec.type] !== false;
      if (day) {
        /* a day's own stops are told by the numbered badges — hide their type pins */
        var inDay = day.stops.some(function (s) { return s.poi === id; });
        if (inDay) show = false;
      }
      if (show && !rec.shown) { cluster.addLayer(rec.m); rec.shown = true; }
      if (!show && rec.shown) { cluster.removeLayer(rec.m); rec.shown = false; }
    });
  }

  /* ---------- our overlay geography on the real map ---------- */
  function drawOverlays() {
    L.polygon(MEDINA, { color: '#c8552c', weight: 1.6, dashArray: '5 4', fillColor: '#c8552c', fillOpacity: 0.08, interactive: false }).addTo(map);
    L.polygon(KASBAH, { color: '#4a63d8', weight: 1.6, fillColor: '#4a63d8', fillOpacity: 0.1, interactive: false }).addTo(map);
    L.polyline(curve(RAIL), { color: '#b8860b', weight: 2.5, dashArray: '10 6', opacity: 0.8 })
      .bindTooltip('ONCF railway → Casablanca · ~1 h', { sticky: true, className: 'lf-tip' }).addTo(map);
    L.polyline(ROWBOAT, { color: '#2b6f8f', weight: 2, dashArray: '2 6', opacity: 0.9, lineCap: 'round' })
      .bindTooltip('Blue rowboat crossing · 2.5–5 MAD', { sticky: true, className: 'lf-tip' }).addTo(map);
  }

  /* ---------- inset ---------- */
  function drawInset() {
    var insetSvg = document.getElementById('inset-svg');
    if (!insetSvg || !window.MA_OUTLINE) return;
    var SVGNS = 'http://www.w3.org/2000/svg';
    function el(name, attrs, parent) {
      var n = document.createElementNS(SVGNS, name);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(n);
      return n;
    }
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
    if (map) return; /* idempotent — callers may race */
    stage = document.getElementById('map-stage');
    var canvas = document.getElementById('map-canvas');
    card = document.getElementById('map-card');
    cardBody = document.getElementById('map-card-body');
    if (!stage || !canvas || !window.RABAT || !window.L) return;

    map = L.map(canvas, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      minZoom: 11,
      maxZoom: 18,
      maxBounds: [[33.80, -7.15], [34.22, -6.50]],
      maxBoundsViscosity: 0.8
    });
    map.attributionControl.setPrefix(false);
    if (stage.clientWidth < stage.clientHeight) HOME = [[34.000, -6.862], [34.048, -6.798]];

    var tileStyle = 'light_all';
    try { tileStyle = localStorage.getItem('rbMapStyle') === 'dark' ? 'dark_all' : 'light_all'; } catch (e) {}
    /* designed fallback tile (faint zellige grid) so dead tiles look intentional */
    function errTile(dark) {
      var bg = dark ? '%231a2425' : '%23e7e3d8', ln = dark ? '%23243231' : '%23d8d2c2';
      return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22%3E%3Crect width=%22256%22 height=%22256%22 fill=%22' + bg + '%22/%3E%3Cpath d=%22M0 64h256M0 128h256M0 192h256M64 0v256M128 0v256M192 0v256%22 stroke=%22' + ln + '%22 stroke-width=%221%22/%3E%3C/svg%3E';
    }
    var tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/' + tileStyle + '/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      errorTileUrl: errTile(tileStyle === 'dark_all')
    }).addTo(map);
    /* quiet loading hint while tiles stream in */
    var loadPill = document.createElement('div');
    loadPill.className = 'rb-map__loading';
    loadPill.textContent = 'fetching map…';
    loadPill.hidden = true;
    stage.appendChild(loadPill);
    tiles.on('loading', function () { loadPill.hidden = false; });
    tiles.on('load', function () { loadPill.hidden = true; });
    stage.classList.toggle('is-night', tileStyle === 'dark_all');

    /* paper / night basemap toggle */
    var styleBtn = document.createElement('button');
    styleBtn.className = 'rb-map__style';
    function styleLabel() { styleBtn.textContent = tileStyle === 'light_all' ? '◐ Night map' : '◐ Paper map'; }
    styleLabel();
    document.getElementById('map-layers').appendChild(styleBtn);
    styleBtn.addEventListener('click', function () {
      tileStyle = tileStyle === 'light_all' ? 'dark_all' : 'light_all';
      tiles.options.errorTileUrl = errTile(tileStyle === 'dark_all');
      tiles.setUrl('https://{s}.basemaps.cartocdn.com/' + tileStyle + '/{z}/{x}/{y}{r}.png');
      stage.classList.toggle('is-night', tileStyle === 'dark_all');
      styleLabel();
      try { localStorage.setItem('rbMapStyle', tileStyle === 'dark_all' ? 'dark' : 'light'); } catch (e) {}
    });

    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    map.fitBounds(HOME);

    /* wheel zoom only after the map has been clicked — keeps page scroll sane */
    map.on('click focus', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout blur', function () { map.scrollWheelZoom.disable(); });

    drawOverlays();
    drawMarkers(window.RABAT.pois);
    drawInset();

    /* find-us: live location while on the ground in Rabat */
    var locBtn = document.createElement('button');
    locBtn.id = 'map-locate';
    locBtn.setAttribute('aria-label', 'Show our location');
    locBtn.textContent = '📍';
    document.querySelector('.rb-map__zoom').appendChild(locBtn);
    var locLayer = null;
    locBtn.addEventListener('click', function () {
      locBtn.classList.add('is-busy');
      map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true, timeout: 8000 });
    });
    map.on('locationfound', function (e) {
      locBtn.classList.remove('is-busy');
      if (locLayer) map.removeLayer(locLayer);
      locLayer = L.layerGroup([
        L.circle(e.latlng, { radius: e.accuracy / 2, color: '#2b4bd8', weight: 1, fillOpacity: 0.08 }),
        L.marker(e.latlng, { icon: L.divIcon({ className: 'lf-here', html: '<span></span>', iconSize: [18, 18], iconAnchor: [9, 9] }), interactive: false })
      ]).addTo(map);
    });
    map.on('locationerror', function () {
      locBtn.classList.remove('is-busy');
      locBtn.textContent = '✕';
      setTimeout(function () { locBtn.textContent = '📍'; }, 1600);
    });

    document.getElementById('zoom-in').addEventListener('click', function () { map.zoomIn(); });
    document.getElementById('zoom-out').addEventListener('click', function () { map.zoomOut(); });
    document.getElementById('zoom-reset').addEventListener('click', function () { closeCard(); setDay('all'); });
    document.getElementById('map-card-close').addEventListener('click', closeCard);
    map.on('click', closeCard);

    document.querySelectorAll('.rb-map__tab').forEach(function (b) {
      b.setAttribute('aria-pressed', b.classList.contains('is-active') ? 'true' : 'false');
      b.addEventListener('click', function () {
        var d = b.getAttribute('data-day');
        closeCard();
        setDay(d === 'all' ? 'all' : +d);
      });
    });
    document.querySelectorAll('.rb-map__layer').forEach(function (b) {
      b.setAttribute('aria-pressed', 'true');
      b.addEventListener('click', function () {
        var l = b.getAttribute('data-layer');
        layerOn[l] = !layerOn[l];
        b.classList.toggle('is-on', layerOn[l]);
        b.setAttribute('aria-pressed', layerOn[l] ? 'true' : 'false');
        applyLayerVisibility();
      });
    });

    window.addEventListener('resize', function () { map.invalidateSize(); });
  }

  /* ---------- static mini-map thumbnail (stylised, self-contained) ---------- */
  function thumbSVG(n) {
    var day = window.RABAT.days[n - 1];
    if (!day) return '';
    var lookup = {};
    window.RABAT.pois.forEach(function (p) { lookup[p.id] = p; });
    var cs = [];
    day.stops.forEach(function (s) {
      if (s.poi && lookup[s.poi]) cs.push(P(lookup[s.poi].lat, lookup[s.poi].lng));
      else if (s.anchor) cs.push(P(s.anchor.lat, s.anchor.lng));
    });
    if (cs.length < 2) return '';
    var xs = cs.map(function (c) { return c.x; }), ys = cs.map(function (c) { return c.y; });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var pad = Math.max(maxX - minX, maxY - minY) * 0.28 + 16;
    var bx = minX - pad, by = minY - pad, bw = (maxX - minX) + pad * 2, bh = (maxY - minY) + pad * 2;
    var ar = 4 / 3;
    if (bw / bh < ar) { var nw = bh * ar; bx -= (nw - bw) / 2; bw = nw; }
    else { var nh = bw / ar; by -= (nh - bh) / 2; bh = nh; }
    var sw = bw / 110;
    var geo = '';
    [COAST_RABAT, COAST_SALE, RIVER_W, RIVER_E].forEach(function (line) {
      geo += '<path d="' + smooth(pts(line)) + '" fill="none" stroke="rgba(165,215,228,0.4)" stroke-width="' + sw + '"/>';
    });
    var route = '<path d="' + smooth(cs) + '" fill="none" stroke="' + day.color + '" stroke-width="' + (sw * 3) + '" stroke-dasharray="' + (sw * 6) + ' ' + (sw * 4) + '" stroke-linecap="round"/>';
    var dots = cs.map(function (c, i) {
      var r = (i === 0 || i === cs.length - 1) ? sw * 5 : sw * 3.4;
      return '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + day.color + '" stroke="#f7f1e3" stroke-width="' + (sw * 1.4) + '"/>';
    }).join('');
    return '<svg viewBox="' + bx.toFixed(1) + ' ' + by.toFixed(1) + ' ' + bw.toFixed(1) + ' ' + bh.toFixed(1) + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect x="' + (bx - bw) + '" y="' + (by - bh) + '" width="' + bw * 3 + '" height="' + bh * 3 + '" fill="#122019"/>' +
      geo + route + dots + '</svg>';
  }

  return {
    init: init,
    thumb: thumbSVG,
    focusPoi: function (id) {
      if (!map) init();
      var rec = markers[id];
      if (!rec || !map) return;
      openCard(id);
      map.flyTo(rec.m.getLatLng(), Math.max(map.getZoom(), 15), { animate: !RM, duration: 1 });
    },
    setDay: setDay
  };
})();
