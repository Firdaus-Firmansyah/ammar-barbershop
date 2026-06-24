const CACHE_NAME = 'ammar-barbershop-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/variables.css',
  '/css/components.css',
  '/css/pages.css',
  '/css/animations.css',
  '/Image/Logo ammar barbershop.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force new service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  ); // Network First strategy to ensure latest app is loaded
});
