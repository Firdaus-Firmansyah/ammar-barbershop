const CACHE_NAME = 'ammar-barbershop-v1';
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache hit
        }
        return fetch(event.request);
      })
  );
});
