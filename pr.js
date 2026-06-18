/* ===== Power Rent — silnik efektów ===== */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };

  /* ---- premium loader ---- */
  var loader = document.getElementById('pr-loader');
  var done = false;
  function ready() {
    if (done) return; done = true;
    document.body.classList.add('ready');
    if (loader) { loader.classList.add('done'); setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 750); }
  }
  window.addEventListener('load', function () { setTimeout(ready, 350); });
  setTimeout(ready, 2600); // bezpiecznik gdyby load nie odpalił

  /* ---- rotating word (kinetic) ---- */
  var rot = document.getElementById('rotw');
  if (rot && !reduce) {
    var words = (rot.getAttribute('data-words') || '').split('|').filter(Boolean);
    if (words.length > 1) {
      var ri = 0;
      rot.style.transition = 'opacity .4s ease, transform .4s ease';
      setInterval(function () {
        rot.style.opacity = '0'; rot.style.transform = 'translateY(-8px)';
        setTimeout(function () {
          ri = (ri + 1) % words.length; rot.textContent = words[ri];
          rot.style.opacity = '1'; rot.style.transform = 'none';
        }, 400);
      }, 2400);
    }
  }

  /* ---- reveal on scroll (sections + cards) ---- */
  var rev = [].slice.call(document.querySelectorAll('.reveal, .card'));
  if (!('IntersectionObserver' in window) || reduce) {
    rev.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (e) { io.observe(e); });
  }

  /* ---- animated counters ---- */
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function animCount(el) {
    var to = parseFloat(el.getAttribute('data-count')) || 0, dur = 1200, st = null;
    function step(ts) {
      if (!st) st = ts;
      var p = Math.min((ts - st) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) raf(step); else { el.textContent = to; el.classList.add('pop'); }
    }
    raf(step);
  }
  if (counters.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
    } else {
      var cio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { animCount(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { cio.observe(c); });
    }
  }

  /* ---- parallax (mouse + scroll) ---- */
  if (!reduce) {
    var pl = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (pl.length) {
      var mx = 0, my = 0, tmx = 0, tmy = 0, sy = window.pageYOffset;
      window.addEventListener('mousemove', function (e) {
        tmx = (e.clientX / window.innerWidth - 0.5);
        tmy = (e.clientY / window.innerHeight - 0.5);
      }, { passive: true });
      window.addEventListener('scroll', function () { sy = window.pageYOffset; }, { passive: true });
      (function loop() {
        mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
        for (var i = 0; i < pl.length; i++) {
          var el = pl[i];
          var d = parseFloat(el.getAttribute('data-parallax')) || 20;
          var ys = parseFloat(el.getAttribute('data-py')) || 0;
          el.style.transform = 'translate3d(' + (mx * d).toFixed(2) + 'px,' + (my * d + sy * ys).toFixed(2) + 'px,0)';
        }
        raf(loop);
      })();
    }
  }

  /* ---- 3D tilt + cursor glow ---- */
  if (!reduce && fine) {
    [].slice.call(document.querySelectorAll('[data-tilt]')).forEach(function (card) {
      var max = parseFloat(card.getAttribute('data-tilt')) || 9;
      card.addEventListener('mouseenter', function () { card.classList.add('is-tilt'); });
      card.addEventListener('mousemove', function (e) {
        var b = card.getBoundingClientRect();
        var px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * max).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * max).toFixed(2) + 'deg) translateY(-6px)';
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('is-tilt'); card.style.transform = '';
      });
    });
  }

  /* ---- magnetic buttons ---- */
  if (!reduce && fine) {
    [].slice.call(document.querySelectorAll('[data-magnetic]')).forEach(function (btn) {
      var s = parseFloat(btn.getAttribute('data-magnetic')) || 0.35;
      btn.addEventListener('mousemove', function (e) {
        var b = btn.getBoundingClientRect();
        var x = e.clientX - b.left - b.width / 2, y = e.clientY - b.top - b.height / 2;
        btn.style.transform = 'translate(' + (x * s).toFixed(1) + 'px,' + (y * s).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---- header shadow on scroll ---- */
  var hd = document.querySelector('.ph-header');
  if (hd) {
    var onScroll = function () { hd.classList.toggle('scrolled', window.pageYOffset > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---- dostępność floty (kropki + statusy) ---- */
  var MON = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];
  function fmtDate(iso) {
    if (!iso) return '';
    var p = ('' + iso).split('-'); if (p.length !== 3) return iso;
    var d = new Date(+p[0], +p[1] - 1, +p[2]); if (isNaN(d.getTime())) return iso;
    return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
  }
  function applyAvailability() {
    var AV = window.PR_AVAILABILITY || {};
    [].slice.call(document.querySelectorAll('.avail')).forEach(function (el) {
      var a = AV[el.getAttribute('data-slug')] || { status: 'in' };
      var out = a.status === 'out', full = el.classList.contains('full');
      el.classList.remove('is-in', 'is-out'); el.classList.add(out ? 'is-out' : 'is-in');
      var b = el.querySelector('b'); if (!b) return;
      if (out) b.textContent = full ? (a.from ? 'Niedostępne · wolne od ' + fmtDate(a.from) : 'Obecnie niedostępne') : 'Zajęte';
      else b.textContent = full ? 'Dostępne od ręki' : 'Dostępne';
    });
  }
  window.PR = window.PR || {}; window.PR.refreshAvailability = applyAvailability;
  applyAvailability();

  /* ---- cennik: wybór segmentu (okładki → flota) ---- */
  (function () {
    var intro = document.getElementById('segIntro');
    var fleet = document.getElementById('segFleet');
    if (!intro || !fleet) return;
    var cards = [].slice.call(document.querySelectorAll('#segGrid .card'));
    var chips = [].slice.call(document.querySelectorAll('#segSwitch .fchip'));
    var title = document.getElementById('segTitle');
    var sub = document.getElementById('segSub');

    function animateIn(list) {
      list.forEach(function (c, i) {
        c.classList.remove('in');
        c.style.transition = 'none';
        void c.offsetWidth;
        c.style.transition = '';
        c.style.transitionDelay = (i * 0.06) + 's';
        c.classList.add('in');
      });
      setTimeout(function () { list.forEach(function (c) { c.style.transitionDelay = ''; }); }, 800 + list.length * 60);
    }

    function showSeg(key) {
      var ref = document.querySelector('#segSwitch [data-f="' + key + '"]');
      intro.style.display = 'none';
      fleet.hidden = false;
      var vis = [];
      cards.forEach(function (c) {
        var on = c.getAttribute('data-seg') === key;
        c.style.display = on ? '' : 'none';
        if (on) vis.push(c);
      });
      chips.forEach(function (c) { c.classList.toggle('active', c === ref); });
      if (ref) { title.textContent = ref.getAttribute('data-name'); sub.textContent = ref.getAttribute('data-sub'); }
      animateIn(vis);
      var y = fleet.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    function showCovers() {
      fleet.hidden = true;
      intro.style.display = '';
      var y = intro.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    [].slice.call(document.querySelectorAll('[data-cover]')).forEach(function (b) {
      b.addEventListener('click', function () { showSeg(b.getAttribute('data-cover')); });
    });
    chips.forEach(function (c) {
      c.addEventListener('click', function () { showSeg(c.getAttribute('data-f')); });
    });
    var bk = document.querySelector('[data-seg-back]');
    if (bk) bk.addEventListener('click', showCovers);
  })();

  /* ---- przełącznik najmu krótko/długoterminowego (podstrony) ---- */
  [].slice.call(document.querySelectorAll('[data-rent-toggle]')).forEach(function (tg) {
    var wrap = tg.closest('.pwrap'); if (!wrap) return;
    tg.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.pt-opt') : null; if (!b) return;
      wrap.setAttribute('data-mode', b.getAttribute('data-mode'));
      [].forEach.call(tg.querySelectorAll('.pt-opt'), function (o) { o.classList.toggle('active', o === b); });
    });
  });

  /* ---- wyjazdy zagraniczne: finder (spotlight + siatka + szukajka) ---- */
  (function () {
    var find = document.querySelector('.kfind');
    if (!find) return;
    var spot = find.querySelector('[data-kspot]');
    var tiles = [].slice.call(find.querySelectorAll('.ktile'));
    var filter = find.querySelector('[data-kfilter]');
    var empty = find.querySelector('.kempty');
    var coarse = window.matchMedia && !matchMedia('(pointer: fine)').matches;
    var norm = function (s) { return (s || '').toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };

    function select(tile, scroll) {
      if (!tile || !spot) return;
      spot.setAttribute('data-empty', '0');
      spot.querySelector('[data-kspot-flag]').textContent = tile.getAttribute('data-flag');
      spot.querySelector('[data-kspot-name]').textContent = tile.getAttribute('data-name');
      spot.querySelector('[data-kspot-dep]').textContent = tile.getAttribute('data-dep');
      spot.querySelector('[data-kspot-fee]').textContent = tile.getAttribute('data-fee');
      spot.querySelector('[data-kspot-feewrap]').className = 'kspot-v fee ' + (tile.getAttribute('data-tier') || '');
      tiles.forEach(function (t) { t.classList.toggle('on', t === tile); });
      var card = spot.querySelector('.kspot-card');
      if (card) { card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); }
      if (scroll) spot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    tiles.forEach(function (t) {
      t.addEventListener('click', function () { select(t, coarse); });
    });

    if (filter) {
      filter.addEventListener('input', function () {
        var q = norm(this.value), shown = 0, only = null;
        tiles.forEach(function (t) {
          var hit = (t.getAttribute('data-c') || '').indexOf(q) > -1;
          t.style.display = hit ? '' : 'none';
          if (hit) { shown++; only = t; }
        });
        if (empty) empty.hidden = shown > 0;
        if (q && shown === 1) select(only, false);
      });
    }

    [].slice.call(find.querySelectorAll('[data-kgo]')).forEach(function (c) {
      c.addEventListener('click', function () {
        var slug = c.getAttribute('data-kgo'), t = null;
        tiles.forEach(function (x) { if (x.getAttribute('data-c') === slug) t = x; });
        if (t) { t.style.display = ''; select(t, true); }
      });
    });
  })();

  /* ---- smaczki: pasek postępu przewijania, wróć na górę, easter egg ---- */
  (function () {
    var spi = document.querySelector('.scroll-prog i');
    var totop = document.querySelector('[data-totop]');
    var doc = document.documentElement;
    function prog() {
      if (!spi) return;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      var pct = (doc.scrollTop || document.body.scrollTop) / max * 100;
      spi.style.width = (pct < 0 ? 0 : pct > 100 ? 100 : pct) + '%';
    }
    function topbtn() {
      if (!totop) return;
      if ((window.scrollY || window.pageYOffset) > 620) totop.classList.add('show');
      else totop.classList.remove('show');
    }
    var ticking = false;
    function onScroll() {
      if (!ticking) { raf(function () { prog(); topbtn(); ticking = false; }); ticking = true; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', prog, { passive: true });
    prog(); topbtn();
    if (totop) totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    function toast(html, ms) {
      var t = document.querySelector('[data-toast]');
      if (!t) return;
      t.innerHTML = html; t.classList.add('show');
      clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, ms || 2600);
    }
    var seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], pos = 0;
    document.addEventListener('keydown', function (e) {
      var k = e.keyCode;
      pos = (k === seq[pos]) ? pos + 1 : (k === seq[0] ? 1 : 0);
      if (pos === seq.length) {
        pos = 0;
        document.body.classList.add('turbo');
        toast('🏁 <b>Tryb turbo PowerRent!</b> Brrm brrm 🚐', 3400);
        setTimeout(function () { document.body.classList.remove('turbo'); }, 9000);
      }
    });
  })();
})();
