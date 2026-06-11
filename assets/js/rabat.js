/* Peacock Travel — Rabat page logic */
(function () {
  'use strict';

  var R = window.RABAT;
  if (!R) return;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- nav ---------------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- hero photo (progressive enhancement) ---------------- */
  if (R.heroPhoto) {
    var wrap = document.getElementById('hero-photo-wrap');
    var img = document.getElementById('hero-photo');
    img.alt = R.heroPhoto.alt || '';
    img.addEventListener('load', function () {
      wrap.classList.add('is-loaded');
      var credit = document.createElement('a');
      credit.className = 'rb-hero__credit';
      credit.href = R.heroPhoto.page;
      credit.target = '_blank';
      credit.rel = 'noopener';
      credit.textContent = R.heroPhoto.credit;
      document.querySelector('.rb-hero').appendChild(credit);
      requestAnimationFrame(function () { credit.classList.add('is-on'); });
    });
    img.src = R.heroPhoto.src;
  }

  /* ---------------- stop icons (filled 24×24 glyphs) ---------------- */
  var ICONS = {
    plane: 'M22 16v-2l-8.5-5V3.5C13.5 2.67 12.83 2 12 2s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1.25L16 22v-1.5L13.5 19v-5.5L22 16z',
    bag: 'M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2h2v2h-2V4zm-1.5 13H8V9h1.5v8zm3.25 0h-1.5V9h1.5v8zM16 17h-1.5V9H16v8z',
    food: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
    shop: 'M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm0 8c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z',
    camera: 'M12 15.2c1.77 0 3.2-1.43 3.2-3.2s-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2 1.43 3.2 3.2 3.2zM9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z',
    leaf: 'M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93-2.77 2.34-4.71 5.61-5.39 9.32 2.6 1.23 5.8.78 7.95-1.37C19.43 14.47 20 4 20 4S9.53 4.57 6.05 8.05z',
    tea: 'M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z',
    landmark: 'M6.5 10h-2v7h2v-7zm6 0h-2v7h2v-7zm8.5 9H2v2h19v-2zm-2.5-9h-2v7h2v-7zM11.5 1 2 6v2h19V6l-9.5-5z',
    boat: 'M3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6zm14 15c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2z',
    music: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
    bar: 'M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7 5.66 5h12.68l-1.78 2H7.43z',
    paw: 'M4.5 12c1.38 0 2.5-1.12 2.5-2.5S5.88 7 4.5 7 2 8.12 2 9.5 3.12 12 4.5 12zm4.5-4c1.38 0 2.5-1.12 2.5-2.5S10.38 3 9 3 6.5 4.12 6.5 5.5 7.62 8 9 8zm6 0c1.38 0 2.5-1.12 2.5-2.5S16.38 3 15 3s-2.5 1.12-2.5 2.5S13.62 8 15 8zm4.5 4c1.38 0 2.5-1.12 2.5-2.5S20.88 7 19.5 7 17 8.12 17 9.5s1.12 2.5 2.5 2.5zm-2.83 2.65c-.93-1.09-1.71-2.02-2.65-3.11-.49-.57-1.12-1.14-1.87-1.39-.12-.04-.24-.07-.36-.09-.28-.04-.58-.06-.79-.06s-.51.02-.79.07c-.12.02-.24.05-.36.09-.75.25-1.38.82-1.87 1.39-.94 1.09-1.72 2.02-2.65 3.11-1.39 1.39-2.47 3.27-1.7 5.18.75 1.86 2.78 2.04 4.61 1.61.81-.19 2.16-.41 2.76-.41s1.95.22 2.76.41c1.83.43 3.86.25 4.61-1.61.77-1.91-.31-3.79-1.7-5.18z',
    art: 'M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm5.5 11c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3-4c-.83 0-1.5-.67-1.5-1.5S13.67 6 14.5 6s1.5.67 1.5 1.5S15.33 9 14.5 9zM5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S7.33 13 6.5 13 5 12.33 5 11.5zm6-4c0 .83-.67 1.5-1.5 1.5S8 8.33 8 7.5 8.67 6 9.5 6s1.5.67 1.5 1.5z',
    beach: 'M13.127 14.56l1.43-1.43 6.44 6.443L19.57 21zm4.293-5.73l2.86-2.86c-3.95-3.95-10.35-3.96-14.3-.02 3.93-1.3 8.31-.25 11.44 2.88zM5.95 5.98c-3.94 3.95-3.93 10.35.02 14.3l2.86-2.86C5.7 14.29 4.65 9.91 5.95 5.98zm.02-.02-.01.01c-.38 3.01 1.17 6.88 4.3 10.02l5.73-5.73c-3.13-3.13-7-4.68-10.02-4.3z',
    sunset: 'M12 7a5 5 0 0 0-5 5h10a5 5 0 0 0-5-5zM2 13h20v2H2zM11 2.5h2V6h-2zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zM18.4 4.2l1.4 1.4-2.1 2.1-1.4-1.4z',
    train: 'M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'
  };
  function icon(name) {
    var d = ICONS[name];
    if (!d) return '';
    return '<span class="rb-stop__ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="' + d + '"/></svg></span>';
  }

  /* ---------------- Google Maps links ---------------- */
  var POI = {};
  R.pois.forEach(function (p) { POI[p.id] = p; });
  function gmapsUrl(q) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }
  function gmapsForPoi(p) {
    /* generic transit spots resolve better by coordinates; named venues by name */
    var q = (p.type === 'transit') ? (p.lat + ',' + p.lng) : (p.name + ', Rabat');
    return gmapsUrl(q);
  }
  function gLink(href, cls) {
    return '<a class="' + cls + '" href="' + href + '" target="_blank" rel="noopener">Google ↗</a>';
  }

  /* ---------------- live countdown chip ---------------- */
  (function () {
    var chips = document.querySelector('.rb-hero__chips');
    if (!chips) return;
    var dep = new Date('2026-06-19T07:55:00+01:00');
    var ret = new Date('2026-06-22T15:05:00+01:00');
    var now = new Date();
    var dayMs = 86400000;
    var txt;
    if (now < dep) {
      var d = Math.ceil((dep - now) / dayMs);
      txt = d <= 1 ? '🛫 Boarding day — pack the bags!' : '🛫 T-minus ' + d + ' days';
    } else if (now <= ret) {
      var n = Math.floor((now - dep) / dayMs) + 1;
      txt = '🌞 Day ' + n + ' — we’re in Morocco';
    } else {
      txt = '🏡 Home with stories';
    }
    var chip = document.createElement('span');
    chip.className = 'rb-chip rb-chip--live';
    chip.textContent = txt;
    chips.appendChild(chip);
  })();

  /* ---------------- render: itinerary ---------------- */
  var rail = document.getElementById('days-rail');
  R.days.forEach(function (day) {
    var art = document.createElement('article');
    art.className = 'rb-day';
    art.style.setProperty('--day-c', day.color);
    art.setAttribute('data-num', '0' + day.n);
    var stopsHtml = day.stops.map(function (s) {
      var btns = '';
      if (s.poi) btns += '<button class="rb-stop__map" data-poi="' + s.poi + '">⌖ map</button>';
      var g = s.gq ? gmapsUrl(s.gq) : (s.poi && POI[s.poi] ? gmapsForPoi(POI[s.poi]) : null);
      if (g) btns += gLink(g, 'rb-stop__map rb-stop__map--g');
      return '<li class="rb-stop">' +
        '<span class="rb-stop__t">' + s.t + '</span>' +
        '<span class="rb-stop__name">' + icon(s.ic) + s.label + '</span>' +
        '<span class="rb-stop__btns">' + btns + '</span>' +
        '<span class="rb-stop__note">' + s.note + '</span>' +
        '</li>';
    }).join('');
    art.innerHTML =
      '<div class="rb-day__badge"><i>' + day.n + '</i></div>' +
      '<header class="rb-day__head">' +
        '<span class="rb-day__dow">' + day.dow + ' · ' + day.date + '</span>' +
        '<h3 class="rb-day__title">' + day.title + '</h3>' +
      '</header>' +
      '<p class="rb-day__vibe">' + day.vibe + '</p>' +
      (day.alt ? '<p class="rb-day__alt">⇄ ' + day.alt + '</p>' : '') +
      '<ol class="rb-stops">' + stopsHtml + '</ol>';
    rail.appendChild(art);
  });

  /* ---------------- render: eat list ---------------- */
  var eatList = document.getElementById('eat-list');
  var KID_IDS = { darnaji: 1, typotes: 1, milena: 1, huna: 1, maure: 1, dhow: 1 };
  function eatBucket(area) {
    if (/Medina|Kasbah|river|Bab/i.test(area)) return 'old';
    if (/Agdal|Hay Riad|Prestigia/i.test(area)) return 'south';
    return 'centre';
  }
  /* filter chips */
  var chipsBar = document.createElement('div');
  chipsBar.className = 'rb-eat__chips';
  chipsBar.innerHTML =
    '<button class="is-on" data-f="all">All tables</button>' +
    '<button data-f="old">Old town</button>' +
    '<button data-f="centre">Centre</button>' +
    '<button data-f="south">Agdal &amp; south</button>' +
    '<button data-f="kid">Kid wins</button>' +
    '<button data-f="cheap">€ cheap eats</button>';
  eatList.parentNode.insertBefore(chipsBar, eatList);
  chipsBar.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    /* settle any pending scroll-reveals so filtered rows never re-appear mid-animation */
    if (window.gsap) gsap.set('#eat-list .reveal', { clearProps: 'opacity,transform,visibility' });
    chipsBar.querySelectorAll('button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
    var f = b.getAttribute('data-f');
    var rows = eatList.querySelectorAll('.rb-row');
    rows.forEach(function (r) {
      var show = f === 'all' ||
        (f === 'kid' && r.hasAttribute('data-kid')) ||
        (f === 'cheap' && r.getAttribute('data-price') === '€') ||
        r.getAttribute('data-bucket') === f;
      r.style.display = show ? '' : 'none';
    });
    /* hide group headers whose rows are all hidden */
    eatList.querySelectorAll('.rb-eat__group').forEach(function (h) {
      var any = false, n = h.nextElementSibling;
      while (n && !n.classList.contains('rb-eat__group')) {
        if (n.style.display !== 'none') any = true;
        n = n.nextElementSibling;
      }
      h.style.display = any ? '' : 'none';
    });
  });
  var groups = [
    { key: 'clear', label: 'Clears the bar', note: '4.5★ and up' },
    { key: 'near', label: 'A whisker under', note: '4.3–4.4 — still very good' },
    { key: 'icon', label: 'Icons, eyes open', note: 'below the bar, worth it anyway' }
  ];
  var foods = R.pois.filter(function (p) { return p.type === 'food'; });
  var n = 0;
  groups.forEach(function (g) {
    var items = foods.filter(function (f) { return f.bar === g.key; });
    if (!items.length) return;
    var head = document.createElement('li');
    head.className = 'rb-eat__group reveal';
    head.innerHTML = g.label + '<small>' + g.note + '</small>';
    eatList.appendChild(head);
    items.forEach(function (f) {
      n++;
      var li = document.createElement('li');
      li.className = 'rb-row reveal';
      li.setAttribute('data-bucket', eatBucket(f.area));
      li.setAttribute('data-price', f.price);
      if (KID_IDS[f.id]) li.setAttribute('data-kid', '');
      var r = f.rating;
      var starsW = r.score ? (r.score / 5 * 100).toFixed(0) : 0;
      li.innerHTML =
        '<span class="rb-row__num">' + (n < 10 ? '0' + n : n) + '</span>' +
        '<div><p class="rb-row__name">' + f.name + '</p>' +
        '<p class="rb-row__meta"><b>' + f.cuisine + '</b> · ' + f.area + ' · <span style="white-space:nowrap">' + f.price + '</span></p></div>' +
        '<div class="rb-row__rating">' +
          '<span class="rb-row__score"><b>' + r.score.toFixed(1) + '</b>' +
          '<span class="rb-row__stars" style="--w:' + starsW + '%">★★★★★<i>★★★★★</i></span></span>' +
          '<span class="rb-row__count">' + (r.count ? '~' + r.count.toLocaleString('en') + ' reviews' : '') + ' · ' + r.src + '</span>' +
        '</div>' +
        '<div class="rb-row__actions">' +
          (f.bar === 'near' ? '<span class="rb-row__flag rb-row__flag--near">just under</span>' : '') +
          (f.bar === 'icon' ? '<span class="rb-row__flag rb-row__flag--icon">vibes pick</span>' : '') +
          '<button class="rb-row__map" data-poi="' + f.id + '">⌖ map</button>' +
          gLink(gmapsForPoi(f), 'rb-row__map rb-row__map--g') +
        '</div>' +
        '<p class="rb-row__why">' + f.why + '</p>';
      eatList.appendChild(li);
    });
  });

  /* ---------------- render: stays ---------------- */
  var stayGrid = document.getElementById('stay-grid');
  function perNight(price) {
    var m = price.match(/(\d[\d,]*)\s*(?:–\s*(\d[\d,]*))?/);
    if (!m) return '';
    var a = Math.round(parseInt(m[1].replace(/,/g, ''), 10) / 3);
    var b = m[2] ? Math.round(parseInt(m[2].replace(/,/g, ''), 10) / 3) : null;
    return '≈ €' + a + (b ? '–' + b : '') + ' a night';
  }
  /* distance context: walking/taxi time from each stay to the anchors */
  function km(aLat, aLng, bLat, bLng) {
    var dy = (bLat - aLat) * 110.57;
    var dx = (bLng - aLng) * 111.32 * Math.cos(34.02 * Math.PI / 180);
    return Math.sqrt(dx * dx + dy * dy);
  }
  var KASBAH = [34.0317, -6.8359], HASSANT = [34.0226, -6.8208];
  function distLine(s) {
    var kKas = km(s.lat, s.lng, KASBAH[0], KASBAH[1]);
    var kHas = km(s.lat, s.lng, HASSANT[0], HASSANT[1]);
    var wKas = Math.max(2, Math.round(kKas * 13));
    var wHas = Math.max(2, Math.round(kHas * 13));
    if (/Salé/.test(s.area)) return '⛵ rowboat across + ' + wKas + ' min → Kasbah';
    if (wKas > 32) return '🚕 ~' + Math.max(6, Math.round(kKas * 3)) + ' min by taxi → Kasbah';
    return '🚶 ' + wKas + ' min → Kasbah · ' + wHas + ' min → Hassan Tower';
  }
  R.pois.filter(function (p) { return p.type === 'stay'; }).forEach(function (s) {
    var d = document.createElement('article');
    d.className = 'rb-stay-card reveal' + (s.pick ? ' is-pick' : '');
    var isBooking = s.rating.src === 'Booking.com';
    d.innerHTML =
      (s.pick ? '<span class="rb-stay-card__ribbon">★ Front-runner</span>' : '') +
      '<div class="rb-stay-card__row"><span class="rb-stay-card__style">' + s.style + '</span>' +
      '<span class="rb-stay-card__price">' + s.price + '<small>' + perNight(s.price) + '</small></span></div>' +
      '<h3 class="rb-stay-card__name">' + s.name + '</h3>' +
      '<p class="rb-stay-card__area">' + s.area + '</p>' +
      '<p class="rb-stay-card__dist" title="Straight-line estimate from real coordinates">' + distLine(s) + '</p>' +
      '<div class="rb-stay-card__rating">' +
        '<span class="rb-stay-card__badge">' + s.rating.score.toFixed(1) + (isBooking ? '' : '★') + '</span>' +
        '<span>' + (s.rating.count ? s.rating.count.toLocaleString('en') + ' reviews · ' : '') + s.rating.src + '</span>' +
      '</div>' +
      '<p class="rb-stay-card__desc">' + s.desc + '</p>' +
      '<p class="rb-stay-card__why">' + s.why + '</p>' +
      '<div class="rb-stay-card__actions">' +
        '<a class="rb-stay-card__book" href="' + s.book + '" target="_blank" rel="noopener">Check dates</a>' +
        '<button class="rb-stay-card__loc" data-poi="' + s.id + '">⌖ map</button>' +
        gLink(gmapsForPoi(s), 'rb-stay-card__loc rb-stay-card__loc--g') +
      '</div>';
    stayGrid.appendChild(d);
  });

  /* ---------------- render: hoods & practical ---------------- */
  var hoodsRow = document.getElementById('hoods-row');
  R.hoods.forEach(function (h) {
    var d = document.createElement('article');
    d.className = 'rb-hood reveal';
    d.style.setProperty('--hc', h.color);
    d.innerHTML = '<span class="rb-hood__tag">' + h.tag + '</span><h3>' + h.name + '</h3><p>' + h.txt + '</p>';
    hoodsRow.appendChild(d);
  });
  var pracGrid = document.getElementById('practical-grid');
  R.practical.forEach(function (p) {
    var d = document.createElement('article');
    d.className = 'rb-prac reveal';
    d.innerHTML = '<span class="rb-prac__icon" aria-hidden="true">' + p.icon + '</span><h3>' + p.k + '</h3><p>' + p.v + '</p>';
    pracGrid.appendChild(d);
  });

  /* ---------------- dining arch photo (progressive) ---------------- */
  var eatPhoto = document.getElementById('eat-photo');
  if (eatPhoto) {
    eatPhoto.addEventListener('load', function () {
      document.getElementById('eat-arch').classList.add('is-loaded');
    });
    eatPhoto.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Moroccan_TAGINE.JPG/640px-Moroccan_TAGINE.JPG';
  }

  /* ---------------- map ---------------- */
  if (window.RabatMap) window.RabatMap.init();

  /* "⌖ map" buttons — fly the map to the poi */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-poi]');
    if (!btn) return;
    var id = btn.getAttribute('data-poi');
    document.getElementById('map').scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    var delay = prefersReduced ? 80 : 650;
    setTimeout(function () { window.RabatMap && window.RabatMap.focusPoi(id); }, delay);
  });

  /* ---------------- animations ---------------- */
  if (!window.gsap || prefersReduced) return;
  gsap.registerPlugin(ScrollTrigger);

  /* intro curtain */
  var curtain = document.createElement('div');
  curtain.className = 'rb-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML =
    '<div class="rb-curtain__inner">' +
      '<svg class="rb-curtain__star" viewBox="0 0 64 64"><rect x="14" y="14" width="36" height="36" fill="none" stroke="#d9a441" stroke-width="2"/><rect x="14" y="14" width="36" height="36" fill="none" stroke="#d9a441" stroke-width="2" transform="rotate(45 32 32)"/></svg>' +
      '<p class="rb-curtain__word">الرباط</p>' +
      '<p class="rb-curtain__sub">Peacock Travel · Trip № 1</p>' +
    '</div>';
  document.body.appendChild(curtain);
  document.body.style.overflow = 'hidden';
  gsap.timeline({ onComplete: function () { curtain.remove(); } })
    .from('.rb-curtain__star', { rotate: 90, scale: 0.6, opacity: 0, duration: 0.55, ease: 'power3.out' })
    .from('.rb-curtain__word, .rb-curtain__sub', { y: 18, opacity: 0, duration: 0.45, ease: 'power3.out', stagger: 0.08 }, '-=0.3')
    .to(curtain, {
      yPercent: -100, duration: 0.75, ease: 'power4.inOut', delay: 0.35,
      onStart: function () { document.body.style.overflow = ''; }
    });

  /* hero letters + chips */
  gsap.from('.rb-hero__title span', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07, delay: 1.45 });
  gsap.from('.rb-hero__kicker, .rb-hero__arabic, .rb-hero__chips .rb-chip', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: 1.8 });

  /* pointer parallax on the hero scene (desktop) */
  if (window.matchMedia('(pointer: fine)').matches) {
    var hero = document.querySelector('.rb-hero');
    var qSky = gsap.quickTo('.rb-hero__sky', 'x', { duration: 0.9, ease: 'power2.out' });
    var qFar = gsap.quickTo('.rb-hero__far', 'x', { duration: 0.7, ease: 'power2.out' });
    var qNear = gsap.quickTo('.rb-hero__near', 'x', { duration: 0.5, ease: 'power2.out' });
    hero.addEventListener('pointermove', function (e) {
      var f = (e.clientX / window.innerWidth - 0.5);
      qSky(f * -10); qFar(f * -22); qNear(f * -34);
    });
  }

  /* hero parallax */
  gsap.to('.rb-hero__sky', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '.rb-hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.rb-hero__far', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.rb-hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.rb-hero__content', { yPercent: -14, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.rb-hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.rb-sun, .rb-sun-core', { attr: { cy: 480 }, ease: 'none', scrollTrigger: { trigger: '.rb-hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* reveals */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    gsap.from(el, {
      y: 34, opacity: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }
    });
  });

  /* itinerary stops cascade + progress line */
  gsap.utils.toArray('.rb-day').forEach(function (day) {
    gsap.from(day.querySelectorAll('.rb-stop'), {
      x: -28, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.07,
      scrollTrigger: { trigger: day, start: 'top 78%', once: true }
    });
  });
  gsap.to('#days-progress', {
    height: '100%', ease: 'none',
    scrollTrigger: { trigger: '#days-rail', start: 'top 60%', end: 'bottom 55%', scrub: 0.4 }
  });

  /* fact counters */
  document.querySelectorAll('.rb-fact b[data-count]').forEach(function (b) {
    var target = +b.getAttribute('data-count');
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: b, start: 'top 90%', once: true },
      onUpdate: function () { b.textContent = Math.round(obj.v); }
    });
  });
})();
