// Язык сайта. Английские страницы лежат по обычным адресам, русские лежат по тем же адресам с /ru/ в начале.
// Выбор в переключателе запоминается, и любая страница сразу открывается на нём.
// Старые ссылки вида privacy.html#ru считаются выбором языка: ведут на русскую версию и запоминаются.
(function () {
  var here = document.documentElement.lang;
  var want = location.hash === '#ru' || location.hash === '#en' ? location.hash.slice(1) : null;
  try {
    if (want) localStorage.setItem('lang', want);
    else want = localStorage.getItem('lang');
  } catch (e) {}
  var alt = want && want !== here && document.querySelector('link[rel="alternate"][hreflang="' + want + '"]');
  if (alt) location.replace(new URL(alt.href).pathname);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-lang]');
    if (a) try { localStorage.setItem('lang', a.getAttribute('data-lang')); } catch (e) {}
  });
})();
