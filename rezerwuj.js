/* =====================================================================
   Power Rent — rezerwacja na KAŻDEJ stronie (navbar + treść).
   ---------------------------------------------------------------------
   CO ROBI:
   1) Naprawia przycisk w NAVBARZE na każdej podstronie → "Rezerwuj online"
      kierujący do kreatora (rezerwacje.html). Działa na index, oferta,
      cennik, o-nas, uslugi ORAZ wszystkich auto-*.html.
   2) Na podstronie KONKRETNEGO auta dokleja do wszystkich linków rezerwacji
      ?seg=KOD — kreator otwiera się z już zaznaczonym segmentem.
   3) Dokłada w treści (przed stopką) sekcję "Rezerwuj online / telefonicznie"
      + przyklejony pasek na telefonie.
   ---------------------------------------------------------------------
   JAK UŻYĆ: na każdej podstronie tuż przed </body>:
        <script src="rezerwuj.js" defer></script>
   (Opcjonalnie miejsce w treści: <div id="rezerwuj-cta"></div>.)
   Zmiana numeru / adresu kreatora — patrz CFG poniżej.
   ===================================================================== */
(function () {
  var CFG = {
    phoneDisplay: '664 201 202',      // numer pokazywany na przycisku
    phoneTel: '+48664201202',         // numer do dzwonienia (tel:)
    bookUrl: 'rezerwacje.html',       // adres kreatora rezerwacji online
    sticky: true,                     // przyklejony pasek na dole (telefon)
    fallback: true,                   // dołóż sekcję przed stopką, gdy brak <div id="rezerwuj-cta">
    fixNav: true                      // popraw przycisk w navbarze
  };
  if (window.__przLoaded) return;
  window.__przLoaded = true;

  /* slug podstrony auta -> KOD segmentu w kreatorze (S,M,L,L+,XL,BUS,LAW,CHŁ,OSO) */
  var SLUG_SEG = {
    'auto-mikrobus':'S','auto-kangoo':'S',
    'auto-male':'M','auto-vivaro':'M',
    'auto-proace':'L',
    'auto-przedluzane':'L+',
    'auto-najwieksze':'XL','auto-kontener':'XL','auto-iveco35':'XL',
    'auto-daily-maxi':'XL','auto-boxer':'XL','auto-proace-bryg':'XL','auto-proace-max':'XL',
    'auto-chlodnia':'CHŁ',
    'auto-laweta':'LAW',
    'auto-bus':'BUS',
    'auto-sedan':'OSO','auto-suv':'OSO'
  };

  function currentSeg() {
    var slug = (location.pathname.split('/').pop() || '').replace(/\.html?$/i, '').toLowerCase();
    return SLUG_SEG[slug] || '';
  }
  var SEG = currentSeg();
  function bookHref() {
    return CFG.bookUrl + (SEG ? '?seg=' + encodeURIComponent(SEG) : '');
  }

  var ICON_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4M8.5 14l2.5 2.5 4.5-5"/></svg>';
  var ICON_TEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2"/></svg>';

  function pairHtml() {
    return '<a class="prz-btn prz-online" href="' + bookHref() + '">' + ICON_CAL + '<span>Zarezerwuj online</span></a>' +
           '<a class="prz-btn prz-call" href="tel:' + CFG.phoneTel + '">' + ICON_TEL + '<span>Zarezerwuj telefonicznie · ' + CFG.phoneDisplay + '</span></a>';
  }
  function barHtml() {
    return '<a class="prz-btn prz-online" href="' + bookHref() + '">' + ICON_CAL + '<span>Rezerwuj online</span></a>' +
           '<a class="prz-btn prz-call" href="tel:' + CFG.phoneTel + '">' + ICON_TEL + '<span>Zadzwoń</span></a>';
  }

  function injectCSS() {
    var css =
      '.prz-cta{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:18px 0}' +
      '.prz-cta.prz-center{justify-content:center}' +
      '.prz-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:9px;font:700 15px/1.1 inherit;padding:14px 22px;border-radius:13px;text-decoration:none;border:2px solid transparent;cursor:pointer;transition:transform .14s ease,box-shadow .16s ease,background .16s ease,border-color .16s ease,color .16s ease;white-space:nowrap}' +
      '.prz-btn svg{width:19px;height:19px;flex:0 0 auto}' +
      '.prz-btn:active{transform:translateY(1px) scale(.99)}' +
      '.prz-online{color:#fff;background:var(--grad-red,linear-gradient(135deg,#E11D2A,#C20E1B));box-shadow:0 10px 26px rgba(225,29,42,.32)}' +
      '.prz-online:hover{box-shadow:0 14px 32px rgba(225,29,42,.42);transform:translateY(-1px)}' +
      '.prz-call{color:#0E1116;background:#fff;border-color:#E4E7EC}' +
      '.prz-call:hover{border-color:#E11D2A;color:#E11D2A}' +
      '.prz-band{background:#0E1116;color:#fff;padding:42px 18px;text-align:center}' +
      '.prz-band .prz-in{max-width:780px;margin:0 auto}' +
      '.prz-band h3{font-size:clamp(22px,3.4vw,30px);font-weight:900;margin:0 0 8px;letter-spacing:-.01em}' +
      '.prz-band p{color:#A6ACB8;font-size:16px;line-height:1.5;margin:0 0 22px}' +
      '.prz-band .prz-call{background:transparent;color:#fff;border-color:rgba(255,255,255,.3)}' +
      '.prz-band .prz-call:hover{border-color:#fff;color:#fff}' +
      '@media(max-width:700px){' +
        '.prz-bar{position:fixed;left:0;right:0;bottom:0;z-index:200;display:flex;gap:8px;padding:9px 10px;padding-bottom:calc(9px + env(safe-area-inset-bottom));background:rgba(255,255,255,.97);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 -6px 22px rgba(0,0,0,.12)}' +
        '.prz-bar .prz-btn{flex:1 1 0;padding:13px 8px;font-size:14px;min-width:0}' +
        '.prz-bar .prz-btn span{overflow:hidden;text-overflow:ellipsis}' +
        'html.prz-has-bar body{padding-bottom:76px !important}' +
        'html.prz-has-bar .call-fab{display:none !important}' +
      '}' +
      'a[data-prz-nav]{color:#fff !important;background:var(--grad-red,linear-gradient(100deg,#FF4A3D,#E11D2A 55%,#B71420)) !important;border-color:transparent !important;position:relative;overflow:hidden;box-shadow:0 8px 22px rgba(225,29,42,.36);animation:przNavPulse 2.6s ease-in-out infinite}' +
      'a[data-prz-nav]:hover{color:#fff !important;transform:translateY(-2px);box-shadow:0 14px 32px rgba(225,29,42,.5)}' +
      'a[data-prz-nav]::after{content:"";position:absolute;top:0;left:-130%;width:55%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);pointer-events:none;animation:przNavShine 3.4s ease-in-out infinite}' +
      '@keyframes przNavShine{0%{left:-130%}55%{left:150%}100%{left:150%}}' +
      '@keyframes przNavPulse{0%,100%{box-shadow:0 8px 22px rgba(225,29,42,.34)}50%{box-shadow:0 12px 30px rgba(225,29,42,.6)}}' +
      '@media(prefers-reduced-motion:reduce){a[data-prz-nav]{animation:none}a[data-prz-nav]::after{display:none}}' +
      '@media(min-width:701px){.prz-bar{display:none}}';
    var s = document.createElement('style');
    s.setAttribute('data-prz', '1');
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---- NAVBAR: znajdź przycisk rezerwacji w nagłówku i ustaw "Rezerwuj online" ---- */
  function fixNav() {
    if (!CFG.fixNav) return;
    var heads = document.querySelectorAll('header, nav, .hd, .site-header, .navbar');
    var seen = [], found = false;
    Array.prototype.forEach.call(heads, function (h) {
      if (h.closest && h.closest('footer')) return;
      var links = h.querySelectorAll('a');
      Array.prototype.forEach.call(links, function (a) {
        if (seen.indexOf(a) !== -1) return;
        var t = (a.textContent || '').trim();
        var href = (a.getAttribute('href') || '');
        var looksLikeBook = /rezerw/i.test(t) ||
                            /rezerwacje\.html/i.test(href) ||
                            (/#rezerwacj/i.test(href) && /rezerw/i.test(t));
        // pomiń telefon
        if (/tel:/i.test(href) || /\d{3}\s?\d{3}\s?\d{3}/.test(t)) return;
        if (!looksLikeBook) return;
        seen.push(a);
        a.setAttribute('href', bookHref());
        // nie kasuj ikon — ustaw tekst tylko gdy nie ma elementów-dzieci
        if (!a.querySelector('*')) a.textContent = 'Rezerwuj online';
        a.setAttribute('data-prz-nav', '1');
        found = true;
      });
    });
    // awaryjnie: gdy w nagłówku nie ma żadnego przycisku rezerwacji — dołóż
    if (!found) {
      var host = document.querySelector('.nav-actions') ||
                 document.querySelector('header .wrap') ||
                 document.querySelector('header');
      if (host) {
        var a = document.createElement('a');
        a.className = 'btn btn-red prz-nav-add';
        a.setAttribute('href', bookHref());
        a.setAttribute('data-prz-nav', '1');
        a.textContent = 'Rezerwuj online';
        a.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:11px;background:var(--grad-red,linear-gradient(135deg,#E11D2A,#C20E1B));color:#fff;font-weight:800;text-decoration:none;margin-left:auto';
        host.appendChild(a);
      }
    }
  }

  /* ---- dołóż "Rezerwuj online" obok istniejących przycisków "Zadzwoń i zarezerwuj" ---- */
  function upgradePhoneCTAs() {
    var cands = document.querySelectorAll('a[href^="tel:"]');
    Array.prototype.forEach.call(cands, function (a) {
      var t = (a.textContent || '').toLowerCase();
      if (!/zarezerwuj|rezerwacj/.test(t)) return;                 // tylko CTA mówiące o rezerwacji
      if (a.closest('.prz-bar') || a.closest('.prz-band') || a.closest('.prz-cta')) return; // pomiń nasze
      var p = a.parentNode; if (!p) return;
      if (p.querySelector('[data-prz-inline]')) return;            // już dołożone
      var on = document.createElement('a');
      on.setAttribute('href', bookHref());
      on.setAttribute('data-prz-inline', '1');
      on.className = a.className;                                   // dziedzicz wygląd istniejącego przycisku
      on.textContent = 'Rezerwuj online';
      p.insertBefore(on, a);                                       // "online" jako pierwszy
    });
  }

  function run() {
    injectCSS();
    fixNav();
    upgradePhoneCTAs();

    // 1) miejsca wskazane ręcznie w treści
    var slots = document.querySelectorAll('#rezerwuj-cta,.rezerwuj-cta,[data-rezerwuj]');
    var placed = 0;
    Array.prototype.forEach.call(slots, function (el) {
      el.classList.add('prz-cta');
      el.innerHTML = pairHtml();
      placed++;
    });

    // 2) fallback — sekcja przed stopką, gdy nigdzie nie wskazano (pomiń, gdy strona ma własną sekcję CTA)
    var hasOwnCTA = document.querySelector('.cta-band, [data-no-prz-band]');
    if (!placed && CFG.fallback && !hasOwnCTA) {
      var band = document.createElement('section');
      band.className = 'prz-band';
      band.setAttribute('data-prz-band', '1');
      band.innerHTML = '<div class="prz-in"><h3>Rezerwuj auto — jak Ci wygodnie</h3>' +
        '<p>Sprawdź dostępność i zarezerwuj online w 2 minuty albo zadzwoń — doradzimy auto i podamy najlepszą cenę.</p>' +
        '<div class="prz-cta prz-center">' + pairHtml() + '</div></div>';
      var foot = document.querySelector('footer') || document.querySelector('#pbot') || document.querySelector('.footer');
      if (foot && foot.parentNode) foot.parentNode.insertBefore(band, foot);
      else (document.querySelector('main') || document.body).appendChild(band);
    }

    // 3) przyklejony pasek na telefonie
    if (CFG.sticky) {
      var bar = document.createElement('div');
      bar.className = 'prz-bar';
      bar.setAttribute('data-prz-bar', '1');
      bar.innerHTML = barHtml();
      document.body.appendChild(bar);
      document.documentElement.classList.add('prz-has-bar');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
