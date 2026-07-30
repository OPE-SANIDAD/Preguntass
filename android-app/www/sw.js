/* Oposita Sanidad — Service Worker
   Cachea el "app shell" (HTML, manifest, iconos) para que la app instale y
   abra sin conexión. Las preguntas se descargan aparte desde CONTENT_URL y
   ya se cachean por la propia app en localStorage (ver index.html), así que
   aquí no hace falta duplicar esa lógica: solo interceptamos esas peticiones
   con una estrategia "red primero, caché como respaldo" por si acaso.
*/

const CACHE_VERSION = 'v1';
const SHELL_CACHE = `osap-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `osap-runtime-${CACHE_VERSION}`;

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    // App shell: caché primero, red como respaldo (y refresco en segundo plano)
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const clone = res.clone();
              caches.open(SHELL_CACHE).then((cache) => cache.put(req, clone));
            }
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  } else {
    // Contenido remoto (preguntas en GitHub, fuentes de Google, etc.):
    // red primero, caché de runtime como respaldo si no hay conexión.
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
