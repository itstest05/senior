/* ============================================================
   senixr — script.js
   Pure vanilla JavaScript · zero dependencies
   ============================================================ */
'use strict';

/* ---------- 1) Footer year ---------- */
(function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/* ---------- 2) Tab title + favicon spoof (easter egg) ----------
   When the tab goes hidden, the browser tab disguises itself as
   something innocent. Come back, and it's home again.             */
(function initTabSpoof() {
  const faviconEl = document.querySelector("link[rel='shortcut icon']");
  if (!faviconEl) return;

  const original = {
    title: document.title,
    href: faviconEl.href,
  };

  const spoofs = [
    { title: 'Google - Search', letter: 'G', color: '#4285f4' },
    { title: 'Inbox (1) - Mail', letter: 'M', color: '#ea4335' },
    { title: 'Untitled document - Docs', letter: 'D', color: '#fbbc05' },
    { title: 'Stack Overflow - Where Developers Learn', letter: 'S', color: '#f48024' },
  ];

  let index = 0;

  function makeFavicon(letter, color) {
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
      "<rect width='100' height='100' rx='18' fill='" + color + "'/>" +
      "<text x='50' y='72' font-size='56' font-family='monospace' font-weight='bold' " +
      "text-anchor='middle' fill='#fff'>" + letter + '</text></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      const s = spoofs[index % spoofs.length];
      index += 1;
      document.title = s.title;
      faviconEl.href = makeFavicon(s.letter, s.color);
    } else {
      document.title = original.title;
      faviconEl.href = original.href;
    }
  });
})();

/* ---------- 3) Console greeting (for the curious ones) ---------- */
(function consoleGreeting() {
  if (typeof console === 'undefined') return;
  console.log(
    '%cwell, well, well... a view-source reader.',
    'color:#fff;font-family:monospace;font-size:14px;font-weight:bold'
  );
  console.log(
    '%cno trackers, no frameworks, no secrets. everything you see is vanilla html/css/js.\nnow go build something cool.',
    'color:#888;font-family:monospace;font-size:12px'
  );
})();
