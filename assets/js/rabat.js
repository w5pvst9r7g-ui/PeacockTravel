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

  /* ---------------- render: itinerary ---------------- */
  var rail = document.getElementById('days-rail');
  R.days.forEach(function (day) {
    var art = document.createElement('article');
    art.className = 'rb-day';
    art.style.setProperty('--day-c', day.color);
    var stopsHtml = day.stops.map(function (s) {
      var mappable = s.poi || s.anchor;
      return '<li class="rb-stop">' +
        '<span class="rb-stop__t">' + s.t + '</span>' +
        '<span class="rb-stop__name">' + s.label + '</span>' +
        (mappable && s.poi ? '<button class="rb-stop__map" data-poi="' + s.poi + '">⌖ map</button>' : '<span></span>') +
        '<span class="rb-stop__note">' + s.note + '</span>' +
        '</li>';
    }).join('');
    art.innerHTML =
      '<div class="rb-day__badge">' + day.n + '</div>' +
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
        '</div>' +
        '<p class="rb-row__why">' + f.why + '</p>';
      eatList.appendChild(li);
    });
  });

  /* ---------------- render: stays ---------------- */
  var stayGrid = document.getElementById('stay-grid');
  R.pois.filter(function (p) { return p.type === 'stay'; }).forEach(function (s) {
    var d = document.createElement('article');
    d.className = 'rb-stay-card reveal';
    var isBooking = s.rating.src === 'Booking.com';
    d.innerHTML =
      '<div class="rb-stay-card__row"><span class="rb-stay-card__style">' + s.style + '</span>' +
      '<span class="rb-stay-card__price">' + s.price + '</span></div>' +
      '<h3 class="rb-stay-card__name">' + s.name + '</h3>' +
      '<p class="rb-stay-card__area">' + s.area + '</p>' +
      '<div class="rb-stay-card__rating">' +
        '<span class="rb-stay-card__badge">' + s.rating.score.toFixed(1) + (isBooking ? '' : '★') + '</span>' +
        '<span>' + (s.rating.count ? s.rating.count.toLocaleString('en') + ' reviews · ' : '') + s.rating.src + '</span>' +
      '</div>' +
      '<p class="rb-stay-card__desc">' + s.desc + '</p>' +
      '<p class="rb-stay-card__why">' + s.why + '</p>' +
      '<div class="rb-stay-card__actions">' +
        '<a class="rb-stay-card__book" href="' + s.book + '" target="_blank" rel="noopener">Check dates</a>' +
        '<button class="rb-stay-card__loc" data-poi="' + s.id + '">⌖ map</button>' +
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

  /* hero letters + chips */
  gsap.from('.rb-hero__title span', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07, delay: 0.2 });
  gsap.from('.rb-hero__kicker, .rb-hero__arabic, .rb-hero__chips .rb-chip', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: 0.55 });

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
