/* POWER RENT — skrypt premium */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- scroll progress bar (wstrzykiwany) ---
  var bar = document.createElement('div');
  bar.id = 'progress';
  document.body.appendChild(bar);

  // --- floating call button on mobile (wstrzykiwany) ---
  var fab = document.createElement('a');
  fab.href = 'tel:664201202';
  fab.className = 'call-fab';
  fab.setAttribute('aria-label', 'Zadzwoń: 664 201 202');
  fab.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.3 2.2Z"/></svg>';
  document.body.appendChild(fab);

  var header = document.querySelector('.site-header');
  function onScroll() {
    var h = document.documentElement;
    var st = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (st / max) * 100 : 0) + '%';
    if (header) header.classList.toggle('scrolled', st > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- mobile menu ---
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var isOpen = item.classList.toggle('open');
      ans.style.maxHeight = isOpen ? ans.scrollHeight + 'px' : '0px';
    });
  });

  // --- scroll reveal ---
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  // --- count-up numbers ---
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (reduce) { el.textContent = target; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: .5 });
      counters.forEach(function (c) { cio.observe(c); });
    } else {
      counters.forEach(animateCount);
    }
  }

  // --- 3D tilt ---
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.tilt').forEach(function (wrap) {
      var inner = wrap.querySelector('.tilt-in') || wrap;
      wrap.addEventListener('pointermove', function (e) {
        var r = wrap.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5;
        var py = (e.clientY - r.top) / r.height - .5;
        inner.style.transform = 'rotateY(' + (px * 9).toFixed(2) + 'deg) rotateX(' + (-py * 9).toFixed(2) + 'deg) translateY(-6px)';
      });
      wrap.addEventListener('pointerleave', function () { inner.style.transform = ''; });
    });
  }

  // --- forms (demo) ---
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form-ok');
      if (ok) { ok.classList.add('show'); ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      form.reset();
    });
  });
})();
