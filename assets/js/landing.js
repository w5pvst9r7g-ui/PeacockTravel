/* Peacock Travel — landing interactions & globe */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- nav scroll state ---------------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- trip registry → landing state ---------------- */
  /* Everything trip-shaped below (cards, board, marquee, CTAs, manifest,
     footer links) renders from window.TRIPS — see assets/data/trips-index.js.
     Status honours the __TRIP_NOW test hook used by the trip pages. */
  var TRIPS = window.TRIPS || [];
  var _now = window.__TRIP_NOW ? new Date(window.__TRIP_NOW) : new Date();
  TRIPS.forEach(function (t) {
    t.depD = new Date(t.dep); t.retD = new Date(t.ret);
    t.status = _now < t.depD ? 'upcoming' : (_now <= t.retD ? 'travelling' : 'travelled');
  });
  var upcoming = TRIPS.filter(function (t) { return t.status === 'upcoming'; })
    .sort(function (a, b) { return a.depD - b.depD; });
  var liveTrip = TRIPS.filter(function (t) { return t.status === 'travelling'; })[0] || null;
  var featured = liveTrip || upcoming[0] || null; /* board + marquee voice */
  var pageTrips = TRIPS.filter(function (t) { return t.page; });
  var nextPageTrip = pageTrips.filter(function (t) { return t.status === 'upcoming'; })[0] || null;
  var latestPageTrip = pageTrips.slice().sort(function (a, b) { return b.depD - a.depD; })[0] || null;

  /* nav + hero CTAs */
  var navCta = document.getElementById('nav-cta');
  var heroCta = document.getElementById('hero-cta');
  if (nextPageTrip) {
    if (navCta) { navCta.href = nextPageTrip.page; navCta.innerHTML = 'Next stop\u00a0\u2192\u00a0' + nextPageTrip.name; }
    if (heroCta) { heroCta.href = nextPageTrip.page; heroCta.firstChild.textContent = 'Explore the ' + nextPageTrip.name + ' plan'; }
  } else if (latestPageTrip && heroCta) {
    heroCta.href = latestPageTrip.page;
    heroCta.firstChild.textContent = 'Revisit the ' + latestPageTrip.name + ' plan';
  }

  /* departures board */
  var board = document.getElementById('hero-board');
  if (board) {
    function bItem(html, cls) { return '<span class="hero__board-item' + (cls || '') + '">' + html + '</span>'; }
    var bHtml = '<span class="hero__board-dot" aria-hidden="true"></span>';
    var bStatus;
    if (featured) {
      bHtml += bItem('<b>' + (featured.status === 'travelling' ? 'Now travelling' : 'Next departure') + '</b> ' + (featured.route || featured.name));
      bHtml += bItem(featured.boardWhen);
      if (featured.boardDetail) bHtml += bItem(featured.boardDetail);
      var then = upcoming.filter(function (t) { return t !== featured; })[0];
      if (then) bHtml += bItem('Then ' + then.name + ' · ' + then.shortWhen);
      bStatus = featured.status === 'travelling' ? 'Living the plan\u00a0\u2197' : 'Boarding the plan\u00a0\u2197';
    } else {
      bHtml += bItem('<b>Home with stories</b> every trip flown');
      bHtml += bItem('The atlas is open — pitch the next one at dinner');
      bStatus = 'Where next?\u00a0\u2197';
    }
    bHtml += bItem(bStatus, ' hero__board-item--status');
    board.innerHTML = bHtml;
  }

  /* marquee — the featured trip's phrases, else the house voice */
  var track = document.getElementById('marquee-track');
  if (track) {
    var phrases = (featured && featured.marquee) ||
      ['The Family Atlas', 'Four passports, one map', 'Researched, rated, mapped', 'Window seats only'];
    var run = phrases.map(function (w) { return '<span>' + w.replace(/ /, '\u00a0') + '</span><i>✦</i>'; }).join('');
    track.innerHTML = run + run;
  }

  /* trip cards (inserted before the static "Where next?" card) */
  var grid = document.querySelector('.trips__grid');
  var emptyCard = grid && grid.querySelector('.trip-card--empty');
  var STATUS_TEXT = { upcoming: 'Planning live', travelling: 'Travelling now', travelled: 'Travelled ✓' };
  var GO_ARROW = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M4 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  if (grid) pageTrips.forEach(function (t) {
    var a = document.createElement('a');
    a.className = 'trip-card trip-card--live reveal' + (t.status === 'travelled' ? ' trip-card--past' : '');
    a.href = t.page;
    var tpl = document.getElementById(t.art) || document.getElementById('art-generic');
    if (tpl) a.appendChild(tpl.content.cloneNode(true));
    var body = document.createElement('div');
    body.className = 'trip-card__body';
    body.innerHTML =
      '<div class="trip-card__row">' +
        '<span class="trip-card__status' + (t.status === 'travelled' ? ' trip-card__status--past' : '') + '">' +
          (t.status === 'travelled' ? '' : '<i></i>') + STATUS_TEXT[t.status] + '</span>' +
        '<span class="trip-card__dates">' + t.dates + '</span>' +
      '</div>' +
      '<h3 class="trip-card__name">' + t.name + ' <span class="serif-i">' + t.place + '</span></h3>' +
      '<p class="trip-card__desc">' + t.desc + '</p>' +
      '<ul class="trip-card__facts">' + (t.facts || []).map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
      '<span class="trip-card__go">Open the plan ' + GO_ARROW + '</span>';
    a.appendChild(body);
    grid.insertBefore(a, emptyCard);
  });

  /* manifest note + footer links */
  var manifestEl = document.getElementById('trips-manifest');
  var manifestTrips = TRIPS.filter(function (t) { return t.manifest; });
  if (manifestEl && manifestTrips.length) {
    manifestEl.innerHTML = 'Also on the manifest: ' + manifestTrips.map(function (t) {
      return '<b>' + t.name + '</b> — ' + t.manifest;
    }).join(' · ') + '.';
  }
  var footerLinks = document.getElementById('footer-links');
  if (footerLinks) pageTrips.forEach(function (t) {
    var a = document.createElement('a');
    a.href = t.page;
    a.textContent = t.name + ' ' + t.depD.getFullYear();
    footerLinks.appendChild(a);
  });

  /* ---------------- GSAP reveals ---------------- */
  if (window.gsap && !prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero__line > *', {
      yPercent: 115,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.12,
      delay: 0.15
    });
    gsap.from('.hero__kicker, .hero__sub, .hero__actions, .hero__board', {
      y: 26,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.45
    });

    gsap.utils.toArray('main section:not(.hero) .reveal, .footer .reveal').forEach(function (el) {
      gsap.from(el, {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });
  }

  /* ---------------- globe ---------------- */
  var canvas = document.getElementById('globe');
  if (!canvas || !window.THREE || !window.LAND_DOTS) return;

  var DUB = { lat: 53.3498, lng: -6.2603 };
  /* destinations come from the registry: entries with coords, in booking order */
  var destTrips = TRIPS.filter(function (t) { return t.coords; });
  /* camera + plane follow the featured route: next upcoming destination,
     else the most recently returned one */
  var globeFeatured = destTrips.filter(function (t) { return t.status === 'upcoming'; })[0] ||
    destTrips.slice().sort(function (a, b) { return b.retD - a.retD; })[0] || null;

  canvas.setAttribute('aria-label', 'Rotating globe tracing the family\u2019s flights from Dublin' +
    (destTrips.length ? ' to ' + destTrips.map(function (t) { return t.pinLabel; }).join(' and ') : ''));

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (e) {
    canvas.style.display = 'none';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 3.15);

  var globe = new THREE.Group();
  scene.add(globe);

  function latLngToVec3(lat, lng, r) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lng + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  /* occluder sphere hides far-side dots */
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(0.985, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x0e1b16 })
  ));

  /* land dots — gold near Dublin and each destination */
  var dots = window.LAND_DOTS;
  var pos = new Float32Array(dots.length * 3);
  var col = new Float32Array(dots.length * 3);
  var cBase = new THREE.Color(0x39ab8c);
  var cAlt = new THREE.Color(0x247a61);
  var cGold = new THREE.Color(0xd9a441);
  var i, v, c;
  for (i = 0; i < dots.length; i++) {
    v = latLngToVec3(dots[i][0], dots[i][1], 1);
    pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
    var nearRoute = (Math.abs(dots[i][0] - DUB.lat) < 4 && Math.abs(dots[i][1] - DUB.lng) < 6);
    for (var dt = 0; dt < destTrips.length && !nearRoute; dt++) {
      var halo = destTrips[dt].halo || [4, 6];
      nearRoute = Math.abs(dots[i][0] - destTrips[dt].coords.lat) < halo[0] &&
                  Math.abs(dots[i][1] - destTrips[dt].coords.lng) < halo[1];
    }
    c = nearRoute ? cGold : (Math.random() > 0.5 ? cBase : cAlt);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  var dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dotGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  var dotMat = new THREE.PointsMaterial({
    size: 0.0155,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true
  });
  globe.add(new THREE.Points(dotGeo, dotMat));

  /* graticule hint: faint ring at equator */
  var ringMat = new THREE.LineBasicMaterial({ color: 0x2e8f74, transparent: true, opacity: 0.14 });
  var ringPts = [];
  for (i = 0; i <= 90; i++) {
    var a = i / 90 * Math.PI * 2;
    ringPts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
  }
  globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), ringMat));

  /* endpoint markers */
  function makeMarker(at, color, size) {
    var m = new THREE.Mesh(
      new THREE.SphereGeometry(size, 16, 16),
      new THREE.MeshBasicMaterial({ color: color })
    );
    m.position.copy(at.clone().multiplyScalar(1.005));
    globe.add(m);
    return m;
  }

  /* flight arcs — one per destination, drawn in registry order */
  var SEG = 140;
  var a3 = latLngToVec3(DUB.lat, DUB.lng, 1);
  makeMarker(a3, 0xf7f1e3, 0.014);
  var hero = document.querySelector('.hero');
  var labelsWrap = document.querySelector('.hero__labels');
  var arcs = destTrips.map(function (t) {
    var d3 = latLngToVec3(t.coords.lat, t.coords.lng, 1);
    var pts = [];
    for (var k = 0; k <= SEG; k++) {
      var tt = k / SEG;
      var p = new THREE.Vector3().copy(a3).lerp(d3, tt).normalize();
      p.multiplyScalar(1 + (t.lift || 0.15) * Math.sin(Math.PI * tt));
      pts.push(p);
    }
    var featured = t === globeFeatured;
    var line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: t.arcColor, transparent: true, opacity: featured ? 0.95 : 0.85 })
    );
    line.geometry.setDrawRange(0, prefersReduced ? SEG + 1 : 0);
    globe.add(line);
    makeMarker(d3, t.markerColor, featured ? 0.02 : 0.017);
    var pin = document.createElement('span');
    pin.className = 'hero__pin hero__pin--dest';
    pin.textContent = t.pinLabel;
    pin.style.background = t.pinColor;
    pin.style.borderColor = t.pinColor;
    if (labelsWrap) labelsWrap.appendChild(pin);
    return { trip: t, d3: d3, pts: pts, line: line, pin: pin, frac: 0 };
  });
  var featuredArc = null;
  arcs.forEach(function (arc) { if (arc.trip === globeFeatured) featuredArc = arc; });
  if (!featuredArc) featuredArc = arcs[0] || null;

  /* plane dot travelling the featured arc */
  var plane = new THREE.Mesh(
    new THREE.SphereGeometry(0.013, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff3d6 })
  );
  plane.visible = false;
  globe.add(plane);

  /* stars */
  var starN = 260;
  var starPos = new Float32Array(starN * 3);
  for (i = 0; i < starN; i++) {
    var sv = new THREE.Vector3().randomDirection().multiplyScalar(14 + Math.random() * 18);
    starPos[i * 3] = sv.x; starPos[i * 3 + 1] = sv.y; starPos[i * 3 + 2] = sv.z;
  }
  var starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
    color: 0x6fae9a, size: 0.05, transparent: true, opacity: 0.5
  })));

  /* orientation: face the midpoint of the featured route */
  var mid = featuredArc
    ? new THREE.Vector3().copy(a3).lerp(featuredArc.d3, 0.5).normalize()
    : a3.clone().normalize();
  var baseYaw = -Math.atan2(mid.x, mid.z);
  var basePitch = 0.42;
  globe.rotation.order = 'YXZ';

  /* interaction state */
  var dragYaw = 0, dragPitch = 0, targetDragYaw = 0, targetDragPitch = 0;
  var dragging = false, lastX = 0, lastY = 0, idleTimer = 0;

  canvas.addEventListener('pointerdown', function (e) {
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    targetDragYaw += (e.clientX - lastX) * 0.005;
    targetDragPitch += (e.clientY - lastY) * 0.003;
    targetDragPitch = Math.max(-0.7, Math.min(0.7, targetDragPitch));
    lastX = e.clientX; lastY = e.clientY;
    idleTimer = 0;
  });
  function endDrag() { dragging = false; }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  /* HTML pins */
  var pinDub = document.getElementById('pin-dub');
  var pinWorld = new THREE.Vector3();
  var camDir = new THREE.Vector3();

  function placePin(el, anchor, visibleFrac) {
    if (!el) return;
    pinWorld.copy(anchor).applyEuler(globe.rotation).multiplyScalar(1.02 * globe.scale.x);
    camDir.copy(camera.position).normalize();
    var facing = pinWorld.clone().normalize().dot(camDir);
    var proj = pinWorld.clone().project(camera);
    var cRect = canvas.getBoundingClientRect();
    var hRect = hero.getBoundingClientRect();
    var x = (proj.x * 0.5 + 0.5) * cRect.width + (cRect.left - hRect.left);
    var y = (-proj.y * 0.5 + 0.5) * cRect.height + (cRect.top - hRect.top);
    el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%, -160%)';
    el.style.opacity = facing > 0.22 ? String(Math.min(1, visibleFrac)) : '0';
  }

  /* sizing */
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* visibility gating */
  var heroVisible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
    }, { threshold: 0.02 }).observe(canvas);
  }

  /* intro + loop */
  var start = performance.now();
  var INTRO_MS = prefersReduced ? 0 : 2400;
  var ARC_DELAY = prefersReduced ? 0 : 700;
  if (!prefersReduced) globe.scale.setScalar(0.86);

  function frame(now) {
    requestAnimationFrame(frame);
    if (!heroVisible || document.hidden) return;

    var el = now - start;

    /* intro scale/fade */
    if (!prefersReduced && el < 1600) {
      var s = 0.86 + 0.14 * easeOut(Math.min(1, el / 1600));
      globe.scale.setScalar(s);
    } else {
      globe.scale.setScalar(1);
    }

    /* arc draw — staggered in registry order */
    arcs.forEach(function (arc, idx) {
      arc.frac = prefersReduced ? 1 : Math.min(1, Math.max(0, (el - ARC_DELAY - idx * 900) / (INTRO_MS - 400)));
      arc.line.geometry.setDrawRange(0, Math.floor(easeOut(arc.frac) * SEG) + 1);
    });

    /* plane shuttles along the featured arc after intro */
    if (featuredArc) {
      var pt;
      if (featuredArc.frac >= 1 && !prefersReduced) {
        var cycle = ((now * 0.00012) % 1.3);
        var tt = Math.min(1, cycle);
        pt = sampleArc(featuredArc.pts, easeInOut(tt));
        plane.position.copy(pt);
        plane.visible = cycle <= 1.02;
      } else {
        pt = sampleArc(featuredArc.pts, easeOut(featuredArc.frac));
        plane.position.copy(pt);
        plane.visible = featuredArc.frac > 0.02;
      }
    }

    /* pendulum sway + drag */
    if (!dragging) idleTimer += 16;
    var sway = prefersReduced ? 0 : Math.sin(now * 0.00012) * 0.22;
    dragYaw += (targetDragYaw - dragYaw) * 0.08;
    dragPitch += (targetDragPitch - dragPitch) * 0.08;
    globe.rotation.y = baseYaw + sway + dragYaw;
    globe.rotation.x = basePitch + dragPitch;

    placePin(pinDub, a3, arcs.length && arcs[0].frac > 0.05 ? 1 : 0);
    arcs.forEach(function (arc) { placePin(arc.pin, arc.d3, arc.frac > 0.92 ? 1 : 0); });

    renderer.render(scene, camera);
  }

  function sampleArc(pts, t) {
    var idx = Math.min(SEG, Math.max(0, t * SEG));
    var lo = Math.floor(idx), hi = Math.min(SEG, lo + 1);
    return new THREE.Vector3().copy(pts[lo]).lerp(pts[hi], idx - lo);
  }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  requestAnimationFrame(frame);
})();
