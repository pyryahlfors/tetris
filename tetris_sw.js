var CACHE_NAME = 'tetris-cache-v1';
var urlsToCache = [
    './',
    './index.html',
    // # CSS
    './css/te3s.css',
    './css/tetris.css',
    './css/touch.css',
    // # Fonts
    './fonts/space-mono-v1-latin-regular.eot',
    './fonts/space-mono-v1-latin-regular.svg',
    './fonts/space-mono-v1-latin-regular.ttf',
    './fonts/space-mono-v1-latin-regular.woff',
    './fonts/space-mono-v1-latin-regular.woff2',
    // # Images
    './img/touch-icon-iphone-6-plus.png',
    // # JS
    './js/tetris.js'];



this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(urlsToCache);
    })
  );
});


this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
