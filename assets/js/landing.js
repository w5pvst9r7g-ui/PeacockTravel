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
  var RBA = { lat: 34.0209, lng: -6.8417 };
  var MIL = { lat: 45.4642, lng: 9.1900 };

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

  /* land dots */
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
    var nearRoute =
      (Math.abs(dots[i][0] - DUB.lat) < 4 && Math.abs(dots[i][1] - DUB.lng) < 6) ||
      (Math.abs(dots[i][0] - RBA.lat) < 4 && Math.abs(dots[i][1] - RBA.lng) < 6) ||
      (Math.abs(dots[i][0] - MIL.lat) < 3 && Math.abs(dots[i][1] - MIL.lng) < 4);
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

  /* graticule hint: faint ring at equator + meridian of route */
  var ringMat = new THREE.LineBasicMaterial({ color: 0x2e8f74, transparent: true, opacity: 0.14 });
  var ringPts = [];
  for (i = 0; i <= 90; i++) {
    var a = i / 90 * Math.PI * 2;
    ringPts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
  }
  globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), ringMat));

  /* flight arc */
  var a3 = latLngToVec3(DUB.lat, DUB.lng, 1);
  var b3 = latLngToVec3(RBA.lat, RBA.lng, 1);
  var arcPts = [];
  var SEG = 140;
  for (i = 0; i <= SEG; i++) {
    var t = i / SEG;
    var p = new THREE.Vector3().copy(a3).lerp(b3, t).normalize();
    p.multiplyScalar(1 + 0.16 * Math.sin(Math.PI * t));
    arcPts.push(p);
  }
  var arcGeo = new THREE.BufferGeometry().setFromPoints(arcPts);
  var arcMat = new THREE.LineBasicMaterial({ color: 0xecc77f, transparent: true, opacity: 0.95 });
  var arcLine = new THREE.Line(arcGeo, arcMat);
  arcLine.geometry.setDrawRange(0, prefersReduced ? SEG + 1 : 0);
  globe.add(arcLine);

  /* second arc: Dublin → Milano */
  var m3 = latLngToVec3(MIL.lat, MIL.lng, 1);
  var arcPts2 = [];
  for (i = 0; i <= SEG; i++) {
    var t2 = i / SEG;
    var p2 = new THREE.Vector3().copy(a3).lerp(m3, t2).normalize();
    p2.multiplyScalar(1 + 0.14 * Math.sin(Math.PI * t2));
    arcPts2.push(p2);
  }
  var arcGeo2 = new THREE.BufferGeometry().setFromPoints(arcPts2);
  var arcLine2 = new THREE.Line(arcGeo2, new THREE.LineBasicMaterial({ color: 0x43d6ad, transparent: true, opacity: 0.85 }));
  arcLine2.geometry.setDrawRange(0, prefersReduced ? SEG + 1 : 0);
  globe.add(arcLine2);

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
  makeMarker(a3, 0xf7f1e3, 0.014);
  makeMarker(b3, 0xd9a441, 0.02);
  makeMarker(m3, 0x43d6ad, 0.017);

  /* plane dot travelling the arc */
  var plane = new THREE.Mesh(
    new THREE.SphereGeometry(0.013, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff3d6 })
  );
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

  /* orientation: face the midpoint of the route */
  var mid = new THREE.Vector3().copy(a3).lerp(b3, 0.5).normalize();
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
  var hero = document.querySelector('.hero');
  var pinDub = document.getElementById('pin-dub');
  var pinRba = document.getElementById('pin-rba');
  var pinMil = document.getElementById('pin-mil');
  var pinWorld = new THREE.Vector3();
  var camDir = new THREE.Vector3();

  function placePin(el, anchor, visibleFrac) {
    anchor.clone().applyEuler(globe.rotation).multiplyScalar(1.02 * globe.scale.x);
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

    /* arc draw */
    var arcFrac = prefersReduced ? 1 : Math.min(1, Math.max(0, (el - ARC_DELAY) / (INTRO_MS - 400)));
    arcLine.geometry.setDrawRange(0, Math.floor(easeOut(arcFrac) * SEG) + 1);
    var arcFrac2 = prefersReduced ? 1 : Math.min(1, Math.max(0, (el - ARC_DELAY - 900) / (INTRO_MS - 400)));
    arcLine2.geometry.setDrawRange(0, Math.floor(easeOut(arcFrac2) * SEG) + 1);

    /* plane shuttles along the arc after intro */
    var pt;
    if (arcFrac >= 1 && !prefersReduced) {
      var cycle = ((now * 0.00012) % 1.3);
      var tt = Math.min(1, cycle);
      pt = sampleArc(easeInOut(tt));
      plane.position.copy(pt);
      plane.visible = cycle <= 1.02;
    } else {
      pt = sampleArc(easeOut(arcFrac));
      plane.position.copy(pt);
      plane.visible = arcFrac > 0.02;
    }

    /* pendulum sway + drag */
    if (!dragging) idleTimer += 16;
    var sway = prefersReduced ? 0 : Math.sin(now * 0.00012) * 0.22;
    dragYaw += (targetDragYaw - dragYaw) * 0.08;
    dragPitch += (targetDragPitch - dragPitch) * 0.08;
    globe.rotation.y = baseYaw + sway + dragYaw;
    globe.rotation.x = basePitch + dragPitch;

    placePin(pinDub, a3, arcFrac > 0.05 ? 1 : 0);
    placePin(pinRba, b3, arcFrac > 0.92 ? 1 : 0);
    placePin(pinMil, m3, arcFrac2 > 0.92 ? 1 : 0);

    renderer.render(scene, camera);
  }

  function sampleArc(t) {
    var idx = Math.min(SEG, Math.max(0, t * SEG));
    var lo = Math.floor(idx), hi = Math.min(SEG, lo + 1);
    return new THREE.Vector3().copy(arcPts[lo]).lerp(arcPts[hi], idx - lo);
  }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  requestAnimationFrame(frame);
})();
