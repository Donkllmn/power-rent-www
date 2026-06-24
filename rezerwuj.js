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

  /* ---- NAVBAR: ustaw DOKŁADNIE JEDEN przycisk "Rezerwuj online" (bez duplikatów) ---- */
  function fixNav() {
    if (!CFG.fixNav) return;
    var heads = document.querySelectorAll('#hdr, header, .hd, .site-header, .navbar');

    // 1) zbierz kandydatów (linki rezerwacji w nagłówku, z pominięciem treści, stopki i telefonu)
    var cands = [];
    Array.prototype.forEach.call(heads, function (h) {
      if (h.closest && h.closest('footer')) return;
      Array.prototype.forEach.call(h.querySelectorAll('a'), function (a) {
        if (cands.indexOf(a) !== -1) return;
        if (a.closest && a.closest('.reg-toc, .reg-body, .reg-hero, main, article, footer, .footer, .prz-band, .prz-cta')) return;
        var t = (a.textContent || '').trim();
        var href = (a.getAttribute('href') || '');
        if (/tel:/i.test(href) || /\d{3}\s?\d{3}\s?\d{3}/.test(t)) return;     // pomiń telefon
        if (/rezerw/i.test(t) || /rezerwacje\.html/i.test(href)) cands.push(a);
      });
    });

    // 2) wybierz JEDEN: najpierw realny przycisk (klasa btn / href rezerwacje.html), potem pierwszy z brzegu
    var primary = null;
    for (var i = 0; i < cands.length; i++) {
      var cl = (cands[i].className || ''), hr = (cands[i].getAttribute('href') || '');
      if (/\bbtn\b/.test(cl) || /rezerwacje\.html/i.test(hr)) { primary = cands[i]; break; }
    }
    if (!primary && cands.length) primary = cands[0];

    if (primary) {
      primary.setAttribute('href', bookHref());
      if (!primary.querySelector('*')) primary.textContent = 'Rezerwuj online';
      primary.setAttribute('data-prz-nav', '1');
    } else {
      // brak jakiegokolwiek przycisku → dołóż jeden (o ile go jeszcze nie ma)
      var host = document.querySelector('.nav-actions') ||
                 document.querySelector('header .wrap') ||
                 document.querySelector('header');
      if (host && !host.querySelector('[data-prz-nav],[data-prz-add]')) {
        var add = document.createElement('a');
        add.className = 'btn btn-red prz-nav-add';
        add.setAttribute('href', bookHref());
        add.setAttribute('data-prz-add', '1');
        add.textContent = 'Rezerwuj online';
        add.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:11px;background:var(--grad-red,linear-gradient(135deg,#E11D2A,#C20E1B));color:#fff;font-weight:800;text-decoration:none;margin-left:auto';
        host.appendChild(add);
        primary = add;
      }
    }

    // 3) BEZPIECZNIK: usuń ewentualne DUPLIKATY "Rezerwuj online" w nagłówku (zostaw tylko wybrany)
    Array.prototype.forEach.call(heads, function (h) {
      if (h.closest && h.closest('footer')) return;
      Array.prototype.forEach.call(h.querySelectorAll('a'), function (a) {
        if (a === primary) return;
        var txt = (a.textContent || '').trim().toLowerCase();
        if ((a.hasAttribute('data-prz-nav') || a.hasAttribute('data-prz-add') || txt === 'rezerwuj online') && a.parentNode) {
          a.parentNode.removeChild(a);
        }
      });
    });
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


/* ====== PowerBot (globalny czat) — auto-inject na każdej stronie ====== */
(function(){
  'use strict';
  if(document.getElementById('pbot')) return;            /* już osadzony na tej stronie */
  /* ===== PowerBot — globalny widget, auto-inject na każdej stronie ===== */
  var __css = ".pbot{--fb:'Inter',system-ui,sans-serif;--fd:'Space Grotesk',system-ui,sans-serif;--bg:#fbfbfa;--ink:#0e1014;--ink-soft:#374151;--mut:#5f6877;--surface:#ffffff;--surface2:#f4f5f3;--line:#e9e9e4;--line-h:#deded7;--accent:#e3121a;--accent-d:#b90e15;--accent-l:#ff5a60;--accent-soft:#fdeaea;--on-accent:#ffffff;--accent-glow:0 10px 24px -8px rgba(227,18,26,.5);--accent-glow2:rgba(227,18,26,.35);--maxw:1200px;--hw:700;--hls:-.02em;--h1w:800;--rbtn:12px;--rcard:20px;--shadow:0 8px 24px -12px rgba(13,16,22,.18);--shadow-lg:0 18px 50px -20px rgba(13,16,22,.28);--logo:#0e1014;--nav-tx:#39414f;--head-bg:rgba(255,255,255,.92);--head-line:#e6e8ec;--ghost-bg:rgba(255,255,255,.08);--ghost-bd:rgba(255,255,255,.22);--ghost-tx:#fff;--hero-bg:#f3f4f2;--hero-tx:#0e1014;--hero-sub:#5f6877;--hero-eye:#e4121a;--hero-eye-bg:#ffffff;--hero-eye-bd:#e9e9e4;--hero-sep:#e1e1db;--tex:rgba(0,0,0,.04);--panel:#ffffff;--panel-bd:#e9e9e4;--float-bg:#ffffff;--center-veil:linear-gradient(180deg,rgba(8,9,13,.55),rgba(8,9,13,.8));--soft-panel:#f5f6f8;--dark-panel:linear-gradient(165deg,#14171e,#0d0f14);--abroad-bg:linear-gradient(115deg,#b90e15,#7d0c12);--badge-bg:rgba(14,16,20,.82);--badge-tx:#fff;--chip-tx:#41495a;--gold:#f6b73c;--foot-bg:#0d0f14;--showpad:110px}\n\n/* ===== availability: custom calendars ===== */\n.qf.qdate .ctl{position:relative;cursor:pointer}\n.qf.qdate input{cursor:pointer}\n.cal-pop{position:absolute;top:calc(100% + 11px);left:-3px;z-index:60;width:288px;background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow-lg);padding:14px}\n.cal-pop[hidden]{display:none}\n.cal-pop::before{content:\"\";position:absolute;top:-7px;left:26px;width:13px;height:13px;background:var(--surface);border-left:1px solid var(--line);border-top:1px solid var(--line);transform:rotate(45deg)}\n.cal-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}\n.cal-h span{font-family:var(--fd);font-weight:700;font-size:14.5px;color:var(--ink);text-transform:capitalize}\n.cal-nav{width:30px;height:30px;border-radius:9px;border:1px solid var(--line);background:var(--surface2);color:var(--ink);font-size:18px;line-height:1;cursor:pointer;display:grid;place-items:center;transition:.15s}\n.cal-nav:hover{background:var(--accent);color:#fff;border-color:var(--accent)}\n.cal-dow{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px}\n.cal-dow span{text-align:center;font-size:11px;font-weight:600;color:var(--mut);padding:4px 0}\n.cal-g{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}\n.cal-g>span{height:34px}\n.cal-d{height:34px;border:0;background:transparent;border-radius:9px;font-family:var(--fb);font-size:13.5px;font-weight:600;color:var(--ink);cursor:pointer;transition:background .14s,color .14s}\n.cal-d:hover:not(:disabled){background:var(--accent-soft);color:var(--accent-d)}\n.cal-d.td{box-shadow:inset 0 0 0 1.5px var(--accent)}\n.cal-d.se{background:var(--accent);color:#fff;box-shadow:var(--accent-glow)}\n.cal-d:disabled{color:#c7ccd4;cursor:not-allowed}\n\n/* ===== availability: results ===== */\n.avail-results{margin-top:16px;background:var(--surface);border:1px solid var(--line);border-radius:22px;box-shadow:var(--shadow);padding:22px;animation:aresIn .4s ease}\n.avail-results[hidden]{display:none}\n@keyframes aresIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n.ares-top{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid var(--line)}\n.ares-eyebrow{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--accent);margin-bottom:5px}\n.ares-top h3{font-family:var(--fd);font-size:clamp(18px,2.4vw,24px);font-weight:700;color:var(--ink);line-height:1.15}\n.ares-top .btn{height:44px}\n.ares-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:16px}\n.ares-card{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:var(--surface);box-shadow:0 8px 24px -16px rgba(18,20,25,.22);transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s,border-color .25s}\n.ares-card:hover{transform:translateY(-5px);box-shadow:0 24px 46px -22px rgba(18,20,25,.34);border-color:var(--line-h)}\n.ares-img{position:relative;aspect-ratio:16/10;overflow:hidden}\n.ares-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s}\n.ares-card:hover .ares-img img{transform:scale(1.06)}\n.ares-ok{position:absolute;top:10px;left:10px;display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.94);color:#15803d;font-size:11.5px;font-weight:700;padding:5px 11px;border-radius:30px;box-shadow:0 6px 16px -6px rgba(0,0,0,.3)}\n.ares-ok i{width:7px;height:7px;border-radius:50%;background:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.18)}\n.ares-b{padding:14px 15px 16px;display:flex;flex-direction:column;flex:1}\n.ares-type{font-size:11.5px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--accent)}\n.ares-b h4{font-family:var(--fd);font-size:17px;font-weight:700;color:var(--ink);margin:3px 0 9px}\n.ares-sp{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:13px}\n.ares-sp span{font-size:11.5px;color:var(--ink-soft);background:var(--surface2);border:1px solid var(--line);border-radius:7px;padding:4px 9px}\n.ares-ft{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:8px}\n.ares-pr{display:flex;flex-direction:column;gap:1px;line-height:1.25}\n.ares-calc{font-size:11px;color:var(--mut);font-weight:600}\n.ares-total{font-family:var(--fd);font-weight:800;font-size:19px;color:var(--accent);margin-top:1px}\n.ares-kauc{font-size:10.5px;color:var(--mut)}\n.ares-go{font-size:13px;font-weight:700;color:var(--accent);white-space:nowrap;flex:none}\n.ares-note{margin-top:16px;font-size:12.5px;color:var(--mut);background:var(--surface2);border:1px dashed var(--line-h);border-radius:12px;padding:12px 15px}\n\n/* ===== PowerBOT ===== */\n.pbot{position:fixed;right:20px;bottom:20px;z-index:120;font-family:var(--fb)}\n.pbot-tag{position:absolute;right:74px;bottom:15px;background:#fff;color:var(--ink);font-family:var(--fd);font-weight:600;font-size:13.5px;padding:9px 15px;border-radius:30px;box-shadow:0 12px 30px -10px rgba(13,16,22,.35);border:1px solid var(--line);white-space:nowrap;pointer-events:none;animation:pbtagin .5s .9s both}\n.pbot-tag b{color:var(--accent);font-weight:800}\n.pbot-tag::after{content:\"\";position:absolute;top:50%;right:-6px;width:12px;height:12px;background:#fff;border-right:1px solid var(--line);border-top:1px solid var(--line);transform:translateY(-50%) rotate(45deg)}\n.pbot.open .pbot-tag{opacity:0;visibility:hidden;transform:translateX(6px);transition:.22s}\n@keyframes pbtagin{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}\n.pbot-launch{position:relative;width:62px;height:62px;border-radius:50%;border:2.5px solid var(--accent);cursor:pointer;background:#fff;box-shadow:0 14px 34px -8px var(--accent-glow2),0 6px 16px rgba(0,0,0,.2);display:grid;place-items:center;padding:0;transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s,background .25s,border-color .25s}\n.pbot.open .pbot-launch{background:linear-gradient(140deg,var(--accent-l),var(--accent-d));border-color:transparent}\n.pbot-launch:hover{transform:translateY(-3px) scale(1.04)}\n.pbot-launch::after{content:\"\";position:absolute;inset:0;border-radius:50%;animation:pbpulse 2.6s ease-out infinite;pointer-events:none}\n@keyframes pbpulse{0%{box-shadow:0 0 0 0 rgba(227,18,26,.42)}70%{box-shadow:0 0 0 15px rgba(227,18,26,0)}100%{box-shadow:0 0 0 0 rgba(227,18,26,0)}}\n.pbot-ic{position:absolute;display:grid;place-items:center;color:#fff;transition:opacity .25s,transform .25s}\n.pbot-ic svg{width:30px;height:30px}.pbot-ic-x svg{width:24px;height:24px}\n.pbot-ic-bot{inset:0;border-radius:50%;overflow:hidden}\n.pbot-mascot{width:100%;height:100%;object-fit:cover;display:block}\n.pbot-ic-x{opacity:0;transform:rotate(-90deg) scale(.6)}\n.pbot.open .pbot-ic-bot{opacity:0;transform:rotate(90deg) scale(.6)}\n.pbot.open .pbot-ic-x{opacity:1;transform:none}\n.pbot.open .pbot-launch::after{display:none}\n.pbot-badge{position:absolute;top:-3px;right:-3px;min-width:21px;height:21px;border-radius:11px;background:var(--accent);color:#fff;font-size:11.5px;font-weight:800;display:grid;place-items:center;border:2.5px solid #fff;padding:0 4px;box-shadow:0 3px 8px -2px rgba(0,0,0,.3)}\n.pbot-panel{position:absolute;right:0;bottom:78px;width:374px;max-width:calc(100vw - 32px);height:540px;max-height:calc(100vh - 120px);background:var(--surface);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 70px -22px rgba(13,16,22,.5);display:flex;flex-direction:column;overflow:hidden;transform-origin:bottom right;animation:pbopen .32s cubic-bezier(.2,.9,.3,1)}\n.pbot-panel[hidden]{display:none}\n@keyframes pbopen{from{opacity:0;transform:translateY(16px) scale(.94)}to{opacity:1;transform:none}}\n.pbot-head{display:flex;align-items:center;gap:11px;padding:14px 14px 13px;background:linear-gradient(135deg,var(--accent-d),var(--accent));color:#fff}\n.pbot-ava{width:44px;height:44px;border-radius:50%;background:#fff;overflow:hidden;flex:none;box-shadow:0 4px 12px -4px rgba(0,0,0,.3)}\n.pbot-ava svg{width:24px;height:24px;color:#fff}\n.pbot-id{flex:1;line-height:1.25}.pbot-id b{font-family:var(--fd);font-size:16px;display:block}\n.pbot-id span{font-size:11.5px;opacity:.92;display:flex;align-items:center;gap:6px}\n.pbot-on{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 3px rgba(74,222,128,.3)}\n.pbot-x{width:32px;height:32px;border-radius:9px;border:none;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;display:grid;place-items:center;transition:background .15s;flex:none}\n.pbot-x:hover{background:rgba(255,255,255,.28)}.pbot-x svg{width:17px;height:17px}\n.pbot-body{flex:1;overflow-y:auto;padding:16px 14px 8px;background:var(--bg);display:flex;flex-direction:column;gap:11px}\n.pmsg{display:flex;gap:8px;max-width:88%}\n.pmsg.user{align-self:flex-end;flex-direction:row-reverse}\n.pmsg.bot{align-self:flex-start}\n.pmsg.pacts{padding-left:34px;max-width:100%}\n.pacts-in{display:flex;flex-wrap:wrap;gap:7px}\n.pava{width:27px;height:27px;border-radius:50%;background:#fff;overflow:hidden;flex:none;align-self:flex-end;border:1px solid var(--line)}\n.pava-img{width:100%;height:100%;object-fit:cover;display:block}\n.pbub{padding:10px 13px;border-radius:15px;font-size:13.6px;line-height:1.5;box-shadow:0 2px 8px -4px rgba(18,20,25,.2)}\n.pmsg.bot .pbub{background:var(--surface);color:var(--ink);border:1px solid var(--line);border-bottom-left-radius:5px}\n.pmsg.user .pbub{background:linear-gradient(135deg,var(--accent),var(--accent-d));color:#fff;border-bottom-right-radius:5px}\n.pbub a{font-weight:700;text-decoration:underline}\n.pmsg.bot .pbub a{color:var(--accent-d)}.pmsg.user .pbub a{color:#fff}\n.ptyping .pbub{display:flex;gap:4px;align-items:center;padding:13px}\n.pdot{width:7px;height:7px;border-radius:50%;background:var(--mut);opacity:.5;animation:pbdot 1.2s infinite}\n.pdot:nth-child(2){animation-delay:.18s}.pdot:nth-child(3){animation-delay:.36s}\n@keyframes pbdot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}\n.pbot-quick{display:flex;flex-wrap:wrap;gap:7px;padding:10px 14px;background:var(--bg);border-top:1px solid var(--line)}\n.pchip{font-family:var(--fb);font-size:12.5px;font-weight:600;color:var(--accent-d);background:var(--surface);border:1px solid var(--accent-soft);border-radius:30px;padding:7px 13px;cursor:pointer;transition:.16s}\n.pchip:hover{background:var(--accent);color:#fff;border-color:var(--accent)}\n.pchip-act{background:var(--accent-soft);border-color:transparent}\n.pbot-input{display:flex;align-items:center;gap:8px;padding:11px 12px;background:var(--surface);border-top:1px solid var(--line)}\n.pbot-input input{flex:1;border:1.5px solid var(--line);background:var(--surface2);border-radius:24px;padding:11px 15px;font-family:var(--fb);font-size:14px;color:var(--ink);outline:none;transition:border-color .15s,background .15s;min-width:0}\n.pbot-input input:focus{border-color:var(--accent);background:var(--surface)}\n.pbot-input button{width:42px;height:42px;border-radius:50%;border:none;background:linear-gradient(135deg,var(--accent),var(--accent-d));color:#fff;cursor:pointer;display:grid;place-items:center;flex:none;transition:transform .15s;box-shadow:var(--accent-glow)}\n.pbot-input button:hover{transform:scale(1.06)}.pbot-input button svg{width:18px;height:18px}\n.pbot-foot{font-size:11px;color:var(--mut);text-align:center;padding:8px 12px;background:var(--surface);border-top:1px solid var(--line)}\n.pbot-foot a{color:var(--accent-d);font-weight:700;text-decoration:none}\n\n/* highlight a section after PowerBOT scrolls the user to it */\n.pr-flash{position:relative;animation:prflash 2.3s cubic-bezier(.4,0,.2,1)}\n@keyframes prflash{\n 0%{box-shadow:0 0 0 0 rgba(227,18,26,0)}\n 8%{box-shadow:0 0 0 6px rgba(227,18,26,.55),0 22px 55px -12px rgba(227,18,26,.5)}\n 26%{box-shadow:0 0 0 1px rgba(227,18,26,.2)}\n 42%{box-shadow:0 0 0 6px rgba(227,18,26,.5),0 22px 55px -12px rgba(227,18,26,.42)}\n 60%{box-shadow:0 0 0 1px rgba(227,18,26,.15)}\n 76%{box-shadow:0 0 0 5px rgba(227,18,26,.4),0 22px 55px -12px rgba(227,18,26,.34)}\n 100%{box-shadow:0 0 0 0 rgba(227,18,26,0)}\n}\n.pr-flash::after{content:\"PowerBot Ci\u0119 tu przeni\u00f3s\u0142 \u2726\";position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--accent),var(--accent-d));color:#fff;font-family:var(--fb);font-size:11.5px;font-weight:700;padding:4px 12px;border-radius:30px;white-space:nowrap;box-shadow:0 8px 20px -6px var(--accent-glow2);z-index:8;animation:prtag 2.3s ease forwards;pointer-events:none}\n@keyframes prtag{0%{opacity:0;transform:translateX(-50%) translateY(6px)}10%{opacity:1;transform:translateX(-50%) translateY(0)}80%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-4px)}}\n@media(prefers-reduced-motion:reduce){.pr-flash{animation:none;box-shadow:0 0 0 3px var(--accent)!important}.pr-flash::after{animation:none}}\n\n/* move FAB to bottom-left so it never clashes with PowerBOT */\n.fab{right:auto;left:16px;bottom:16px}\n\n@media(max-width:680px){\n  .pbot{right:14px;bottom:14px}\n  .pbot-panel{width:calc(100vw - 24px);height:calc(100vh - 128px);right:-2px;bottom:74px}\n  .ares-grid{grid-template-columns:1fr 1fr;gap:12px}\n  .ares-top .btn{width:100%}\n  .cal-pop{width:290px;left:auto;right:-3px}\n  .cal-pop::before{left:auto;right:26px}\n}\n@media(max-width:430px){.ares-grid{grid-template-columns:1fr}}\n@media(prefers-reduced-motion:reduce){.pbot-launch::after{animation:none}.avail-results,.pbot-panel{animation:none}}\n\n.totop{right:auto;left:22px}";
  var __s=document.createElement('style');__s.setAttribute('data-powerbot','1');__s.textContent=__css;document.head.appendChild(__s);
  var PR_AVA='<img class="pava-img" src="https://d8j0ntlcm91z4.cloudfront.net/user_3FBNDxDErwwR0aW1mMDAvNcPYWS/hf_20260618_230728_d01bdf65-7455-4623-96cf-573e9246f76f.png" alt="">';
  var __h=document.createElement('div');__h.innerHTML="<div class=\"pbot\" id=\"pbot\"><span class=\"pbot-tag\" id=\"pbotTag\"><b>Power</b>Bot</span><button class=\"pbot-launch\" id=\"pbotLaunch\" aria-label=\"Otw\u00f3rz czat PowerBot\"><span class=\"pbot-ic pbot-ic-bot\"><img class=\"pbot-mascot\" src=\"https://d8j0ntlcm91z4.cloudfront.net/user_3FBNDxDErwwR0aW1mMDAvNcPYWS/hf_20260618_230728_d01bdf65-7455-4623-96cf-573e9246f76f.png\" alt=\"PowerBot\" loading=\"lazy\"></span><span class=\"pbot-ic pbot-ic-x\"><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4' stroke-linecap='round'><path d='M6 6l12 12M18 6 6 18'/></svg></span><span class=\"pbot-badge\">1</span></button><div class=\"pbot-panel\" id=\"pbotPanel\" role=\"dialog\" aria-label=\"PowerBot\" hidden><div class=\"pbot-head\"><div class=\"pbot-ava\"><img class=\"pbot-mascot\" src=\"https://d8j0ntlcm91z4.cloudfront.net/user_3FBNDxDErwwR0aW1mMDAvNcPYWS/hf_20260618_230728_d01bdf65-7455-4623-96cf-573e9246f76f.png\" alt=\"PowerBot\" loading=\"lazy\"></div><div class=\"pbot-id\"><b>PowerBot</b><span><i class=\"pbot-on\"></i>Online \u00b7 zwykle od razu</span></div><button class=\"pbot-x\" id=\"pbotClose\" aria-label=\"Zamknij\"><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4' stroke-linecap='round'><path d='M6 6l12 12M18 6 6 18'/></svg></button></div><div class=\"pbot-body\" id=\"pbotBody\"></div><div class=\"pbot-quick\" id=\"pbotQuick\"></div><form class=\"pbot-input\" id=\"pbotForm\"><input id=\"pbotText\" placeholder=\"Napisz wiadomo\u015b\u0107\u2026\" autocomplete=\"off\"><button type=\"submit\" aria-label=\"Wy\u015blij\"><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 2 11 13M22 2l-7 20-4-9-9-4z'/></svg></button></form><div class=\"pbot-foot\">Demo \u00b7 pe\u0142na AI wkr\u00f3tce \u00b7 pilne? <a href=\"tel:+48664201202\">664 201 202</a></div></div></div>";
  if(__h.firstElementChild)document.body.appendChild(__h.firstElementChild);
  function flash(el){if(!el)return;try{var o=el.style.boxShadow;el.style.transition='box-shadow .35s';el.style.boxShadow='0 0 0 3px rgba(227,18,26,.55)';setTimeout(function(){el.style.boxShadow=o||'';},1100);}catch(e){}}
  var pbot=document.getElementById('pbot');
  if(pbot){
    var launch=document.getElementById('pbotLaunch'),panel=document.getElementById('pbotPanel'),closeB=document.getElementById('pbotClose'),
        body=document.getElementById('pbotBody'),quick=document.getElementById('pbotQuick'),form=document.getElementById('pbotForm'),text=document.getElementById('pbotText'),
        badge=launch.querySelector('.pbot-badge');
    var started=false, convo=[], AI_URL='/api/chat';
    var QUICK=['Jakie auto wybrać?','Sprawdź dostępność','Auto na przeprowadzkę','Bus 9-osobowy','Cennik','Wynajem za granicę','Kaucja i warunki','Pomoc drogowa 24/7','Najem długoterminowy','Kontakt'];
    function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
    function linkify(s){s=s.replace(/(https?:\/\/[^\s<]+)/g,function(u){return '<a href="'+u+'" target="_blank" rel="noopener">'+u+'</a>';});s=s.replace(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi,function(m){return '<a href="mailto:'+m+'">'+m+'</a>';});s=s.replace(/(\d{3})[ \-](\d{3})[ \-](\d{3})/g,function(m,a,b,c){return '<a href="tel:+48'+a+b+c+'">'+a+' '+b+' '+c+'</a>';});return s.replace(/\n/g,'<br>');}
    function strip(h){return h.replace(/<[^>]+>/g,'');}
    function addUser(t){var m=document.createElement('div');m.className='pmsg user';m.innerHTML='<div class="pbub">'+esc(t)+'</div>';body.appendChild(m);body.scrollTop=body.scrollHeight;}
    function addBot(html){var m=document.createElement('div');m.className='pmsg bot';m.innerHTML='<span class="pava">'+PR_AVA+'</span><div class="pbub">'+html+'</div>';body.appendChild(m);body.scrollTop=body.scrollHeight;return m;}
    function addActs(labels){var a=document.createElement('div');a.className='pmsg bot pacts';a.innerHTML='<div class="pacts-in">'+labels.map(function(l){return '<button type="button" class="pchip pchip-act" data-go="'+l+'">'+l+'</button>';}).join('')+'</div>';body.appendChild(a);body.scrollTop=body.scrollHeight;}
    function typing(){var m=document.createElement('div');m.className='pmsg bot ptyping';m.innerHTML='<span class="pava">'+PR_AVA+'</span><div class="pbub"><span class="pdot"></span><span class="pdot"></span><span class="pdot"></span></div>';body.appendChild(m);body.scrollTop=body.scrollHeight;return m;}
    function renderQuick(){quick.innerHTML=QUICK.map(function(q){return '<button type="button" class="pchip">'+q+'</button>';}).join('');}
    function reply(txt){
      var s=txt.toLowerCase();
      if(/d[lł]ugotermin|abonament|miesi[ęe]czn|na sta[lł]e|na d[lł]u[żz]ej|flot[aęy] dla firm/.test(s)) return 'Najem długoterminowy (miesięczny) — taniej, ceny netto, faktura VAT, auto serwisowane. Świetne dla firm. Zadzwoń po indywidualną wycenę: <a href="tel:+48664201202">664 201 202</a>.|Cennik';
      if(/za granic|zagranic|granic|niemc|holandi|w[lł]och|francj|czech|s[lł]owac|europ|wyjazd za/.test(s)) return 'Tak, można wyjechać za granicę — OC i assistance działają też poza Polską. Kaucja i opłata zależą od kraju; szczegóły w cenniku każdego auta lub telefonicznie: <a href="tel:+48664201202">664 201 202</a>.|Cennik';
      if(/przeprowadzk|mebl|agd|du[żz]e rzeczy|du[żz]e gabaryt|spakowa|kanap|lod[óo]wk|pralk/.test(s)) return 'Na przeprowadzkę najlepszy największy furgon lub kontener z windą — do 8 europalet, spora ładowność, od <b>300 zł</b>. Na drobne rzeczy wystarczy mikrobus (od 200 zł). Sprawdź wolny termin albo dzwoń: 664 201 202.|Sprawdź dostępność|Cennik';
      if(/9[\- ]?osob|dziewi[ęe][ćc]|busem|ekip|grup[aęy]|wesel|wycieczk|przew[oó]z os[oó]b|9 miejsc/.test(s)) return 'Bus 9-osobowy (Renault Trafic, automat, kat. B) — od <b>250 zł</b>. Idealny na ekipę, grupę albo rodzinę, bez specjalnych uprawnień. Sprawdź dostępność na górze strony.|Sprawdź dostępność';
      if(/kaucj|warunk|wymag|dokument|prawo jazdy|ile lat|od ilu lat|wiek|umow|co potrzeb/.test(s)) return 'Wynajem od 18 lat z ważnym prawem jazdy (kat. B wystarcza do całej floty, też busa 9-os.). Kaucja w Polsce 1000 zł. W cenie OC + assistance, faktura VAT, auto od ręki — formalności około 10 minut.|Sprawdź dostępność';
      if(/jakie auto|jaki samoch|dobierz|doradz|co wybra|co polec|pole[cć]|nie wiem jak|przewoz|przewie[źz]|transport|[lł]adun|co najlep|pomó[żz] wybra/.test(s)) return 'Powiedz, co przewozisz i ile tego jest — dobiorę auto. W skrócie: paczki i drobne → mikrobus (od 200 zł), meble i AGD → dostawcze L2H1 (od 280 zł), przeprowadzka → największy furgon lub winda (od 300 zł), świeże i mrożone → chłodnia (od 350 zł), przewóz auta → laweta (od 250 zł).|Sprawdź dostępność|Cennik';
      if(/dost[ęe]pn|rezerw|woln|kiedy|na jutro|na dzi[śs]|na weekend/.test(s)) return 'Sprawdzisz to w wyszukiwarce na górze strony — wybierz typ auta oraz termin (od/do), a pokażę wolne pojazdy. Rezerwację potwierdzamy telefonicznie: <a href="tel:+48664201202">664 201 202</a>.|Sprawdź dostępność';
      if(/cennik|cen[aęy]|ile kosztuje|koszt|stawk|p[lł]ac/.test(s)) return 'Krótko z cennika: dostawcze od <b>200 zł/doba</b>, osobowe od <b>200 zł</b>, laweta od <b>250 zł</b>, chłodnia od <b>350 zł</b>. Pełny cennik: <a href="cennik-foto.html">zobacz tutaj</a>.|Cennik';
      if(/laweta|pomoc drog|awari|holow|zepsu|powerhol|ko[lł]o|paliw/.test(s)) return 'Pomoc drogowa <b>POWERHOL24</b> działa 24/7: <a href="tel:+48664201202">664 201 202</a>. Auto zastępcze, dowóz i wypompowanie paliwa, wymiana koła, transport do 3 aut jednocześnie.';
      if(/kontakt|telefon|adres|gdzie|mail|dojazd|numer/.test(s)) return 'Power Rent · ul. Mokra 2A, 26-600 Radom.<br>Tel: <a href="tel:+48664201202">664 201 202</a> / <a href="tel:+48692422337">692 422 337</a><br>E-mail: <a href="mailto:bartosz.k@power.radom.pl">bartosz.k@power.radom.pl</a>';
      if(/godzin|otwar|czynne|robocz/.test(s)) return 'Najszybciej złapiesz nas telefonicznie: <a href="tel:+48664201202">664 201 202</a>. Wydanie auta nawet w 10 minut, formalności do minimum.';
      if(/dzi[ęe]k|spoko|^ok$|super|dobra|pasuje/.test(s)) return 'Jasne! Gdyby coś jeszcze — jestem tutaj. A najszybciej: <a href="tel:+48664201202">664 201 202</a>. 🚐';
      if(/cze[śs][ćc]|hej|witam|dzie[ńn] dobry|siema|hello|^hi$/.test(s)) return 'Cześć! 👋 Jestem PowerBot. Pomogę dobrać auto, z cennikiem, dostępnością, pomocą drogową i kontaktem. Co przewozisz albo na kiedy potrzebujesz auta?';
      return 'Przepraszam, nie jestem w stanie odpowiedzieć na wszystkie pytania. Skontaktuj się z naszym biurem pod numerem telefonu: <a href="tel:+48664201202">664 201 202</a>. Chętnie pomożemy.|Sprawdź dostępność|Cennik';
    }
    function persist(){try{sessionStorage.setItem('pbot_open',pbot.classList.contains('open')?'1':'0');sessionStorage.setItem('pbot_convo',JSON.stringify(convo.slice(-20)));}catch(e){}}
    function fallback(t){var c=reply(t),parts=c.split('|');addBot(parts[0]);if(parts.length>1)addActs(parts.slice(1));convo.push({role:'assistant',content:strip(parts[0])});persist();}
    function handle(t){addUser(t);convo.push({role:'user',content:t});persist();var tp=typing();fetch(AI_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:convo})}).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(d){tp.remove();var a=(d&&d.reply)?String(d.reply).trim():'';if(!a)throw 0;convo.push({role:'assistant',content:a});addBot(linkify(esc(a)));persist();}).catch(function(){tp.remove();fallback(t);});}
    function act(label){if(label==='Sprawdź dostępność'){var q=document.getElementById('szukaj');if(q){if(window.innerWidth<760)closeP();persist();q.scrollIntoView({behavior:'smooth',block:'center'});var card=document.getElementById('availCard'),qt=document.getElementById('qtype');setTimeout(function(){flash(card);if(qt&&window.innerWidth>=760)qt.focus();},430);}else{persist();location.href='index.html#szukaj';}return;}if(label==='Cennik'){persist();location.href='cennik-foto.html';return;}handle(label);}
    function start(){if(started)return;started=true;renderQuick();addBot('Cześć! 👋 Jestem <b>PowerBot</b> — pomogę dobrać auto i ogarnąć wynajem. Co chcesz przewieźć albo na kiedy potrzebujesz pojazdu?');}
    function openP(){panel.hidden=false;pbot.classList.add('open');if(badge)badge.style.display='none';start();persist();setTimeout(function(){if(window.innerWidth>=760)text.focus();},140);}
    function closeP(){panel.hidden=true;pbot.classList.remove('open');persist();}
    launch.addEventListener('click',function(){panel.hidden?openP():closeP();});
    closeB.addEventListener('click',closeP);
    quick.addEventListener('click',function(e){var b=e.target.closest('.pchip');if(b)act(b.textContent);});
    body.addEventListener('click',function(e){var a=e.target.closest('[data-go]');if(a)act(a.getAttribute('data-go'));});
    form.addEventListener('submit',function(e){e.preventDefault();var v=text.value.trim();if(!v)return;text.value='';handle(v);});
    (function(){var sc=[];try{sc=JSON.parse(sessionStorage.getItem('pbot_convo')||'[]');}catch(e){sc=[];}if(sc&&sc.length){started=true;if(badge)badge.style.display='none';renderQuick();sc.forEach(function(m){if(m.role==='user')addUser(m.content);else addBot(linkify(esc(m.content)));});convo=sc.slice();}var op=false;try{op=sessionStorage.getItem('pbot_open')==='1';}catch(e){}if(op)openP();})();
  }
})();
