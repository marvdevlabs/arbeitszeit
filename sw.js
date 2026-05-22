/* Arbeitszeit-Rechner Service Worker
 *
 * Strategie:
 *   - Navigation (HTML)  → network-first, fallback auf Cache
 *     (verhindert weisse Seite bei iOS-Standalone wenn Cache stale)
 *   - Andere GET-Requests → stale-while-revalidate
 *
 * Install ist nicht-blockierend: schlägt cache.addAll fehl
 * (z.B. einzelne Datei 404), wird der SW trotzdem aktiv.
 */
const CACHE_NAME = 'arbeitszeit-v1.25.5';
const ASSETS = [
  '/arbeitszeit/',
  '/arbeitszeit/index.html',
  '/arbeitszeit/manifest.json',
  '/arbeitszeit/icon.svg',
  '/arbeitszeit/docs/images/seriously.jpg',
  '/arbeitszeit/docs/images/seriously-may4.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Pro Asset einzeln cachen, damit ein einziger Fehler den
      // gesamten Install nicht killt:
      Promise.all(
        ASSETS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch((err) =>
            console.warn('[SW] Asset konnte nicht gecacht werden:', url, err)
          )
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigation (HTML-Seite, z.B. iOS Standalone-Start) → network-first
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((c) =>
              c.put('/arbeitszeit/index.html', clone)
            );
          }
          return resp;
        })
        .catch(() =>
          caches.match('/arbeitszeit/index.html').then((cached) =>
            cached || caches.match('/arbeitszeit/')
          )
        )
    );
    return;
  }

  // Andere Resources → stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
