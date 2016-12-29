this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        // # root
        './',
        './index.html',
        // # CSS
        './css/te3s.css',
        './css/tetris.css',
        './css/touch.css',
        // # Fonts
        './fonts/te3s.eot',
        './fonts/te3s.svg',
        './fonts/te3s.ttf',
        './fonts/te3s.woff',
        // # Images
        './img/touch-icon-iphone-6-plus.png',
        // # JS
        './js/tetris.js'
      ]);
    })
  );
});
