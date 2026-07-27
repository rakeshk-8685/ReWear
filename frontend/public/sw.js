// ReWear Production Service Worker - Cache Invalidation & Network-First Strategy
const CACHE_NAME = 'rewear-v2-cache';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging obsolete cache:', key);
            return caches.delete(key);
          }
          return Promise.resolve(true);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 1. NEVER cache API requests, auth calls, or WebSocket streams
  if (
    url.includes('/api/') ||
    url.includes('/auth/') ||
    url.includes('socket.io') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // 2. Network-first strategy for HTML documents and JavaScript bundles to ensure new deployments load instantly
  if (event.request.mode === 'navigate' || url.endsWith('.html') || url.endsWith('.js')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
