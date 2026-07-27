// ReWear Production Service Worker
const CACHE_NAME = 'rewear-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve(true);
        })
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Always bypass API calls and WebSocket connections to ensure live data
  if (event.request.url.includes('/api/') || event.request.url.includes('socket.io')) {
    return;
  }
});
