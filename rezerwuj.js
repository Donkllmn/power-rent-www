/* =====================================================================
   Power Rent — przyciski rezerwacji (telefon + online) na KAŻDEJ stronie.
   ---------------------------------------------------------------------
   JAK UŻYĆ:
   1) Wgraj ten plik do katalogu strony (tam gdzie oferta.html, cennik-foto.html itd.).
   2) Na KAŻDEJ podstronie (oferta, cennik-foto, o-nas, uslugi, index ORAZ wszystkie
      auto-*.html) dodaj tuż przed </body>:
         <script src="rezerwuj.js" defer></script>
   3) (Opcjonalnie) Tam, gdzie chcesz przyciski DOKŁADNIE w treści (np. pod ceną auta),
      wstaw pusty znacznik:
         <div id="rezerwuj-cta"></div>
      Jeśli go nie wstawisz, skrypt sam dołoży ładną sekcję przed stopką.
   ---------------------------------------------------------------------
   Zmiana numeru / adresu kreatora — patrz CFG poniżej.
   ===================================================================== */
(function () {
  var CFG = {
    phoneDisplay: '664 201 202',      // numer pokazywany na przycisku
    phoneTel: '+48664201202',         // numer do dzwonienia (tel:)
    bookUrl: 'rezerwacje.html',       // adres kreatora rezerwacji online
    sticky: true,                     // przyklejony pasek na dole (telefon)
    fallback: true                    // dołóż sekcję przed stopką, gdy brak <div id="rezerwuj-cta">
  };
  if (window.__przLoaded) return;
  window.__przLoaded = true;

  var ICON_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4M8.5 14l2.5 2.5 4.5-5"/></svg>';
  var ICON_TEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2"/></svg>';

  function pairHtml() {
    return '<a class="prz-btn prz-online" href="' + CFG.bookUrl + '">' + ICON_CAL + '<span>Zarezerwuj online</span></a>' +
           '<a class="prz-btn prz-call" href="tel:' + CFG.phoneTel + '">' + ICON_TEL + '<span>Zarezerwuj telefonicznie · ' + CFG.phoneDisplay + '</span></a>';
  }
  function barHtml() {
    return '<a class="prz-btn prz-online" href="' + CFG.bookUrl + '">' + ICON_CAL + '<span>Rezerwuj online</span></a>' +
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
      '@media(min-width:701px){.prz-bar{display:none}}';
    var s = document.createElement('style');
    s.setAttribute('data-prz', '1');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function run() {
    injectCSS();

    // 1) miejsca wskazane ręcznie w treści
    var slots = document.querySelectorAll('#rezerwuj-cta,.rezerwuj-cta,[data-rezerwuj]');
    var placed = 0;
    Array.prototype.forEach.call(slots, function (el) {
      el.classList.add('prz-cta');
      el.innerHTML = pairHtml();
      placed++;
    });

    // 2) fallback — sekcja przed stopką, gdy nigdzie nie wskazano
    if (!placed && CFG.fallback) {
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
