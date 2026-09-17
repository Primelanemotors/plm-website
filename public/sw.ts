/**
 * Prime Lane Motors (PLM) — Service Worker
 * Enterprise Cache-First for static assets, Network-First with offline fallback for /acc shell.
 * Zero caching of authenticated Supabase real-time traffic or API mutations.
 */

const CACHE_NAME = 'plm-acc-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/acc',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install: Pre-cache essential app shell assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PLM SW] Pre-caching offline application shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge obsolete caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PLM SW] Removing deprecated cache:', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Strategy router
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Strictly bypass service worker for Supabase REST, Realtime websockets, Meta webhooks, and auth calls
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.includes('/rest/v1/') ||
    url.pathname.includes('/realtime/') ||
    url.pathname.includes('/auth/v1/') ||
    url.pathname.includes('/functions/v1/')
  ) {
    return; // Pass through directly to network
  }

  // 2. Navigation requests: Network-first, fallback to cached /acc shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/acc').then((cached) => cached || caches.match('/'));
      })
    );
    return;
  }

  // 3. Static assets: Stale-while-revalidate or Cache-first
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });
      })
    );
  }
});
