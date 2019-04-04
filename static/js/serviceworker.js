const CACHE_NAME = 'toshimaen';
let urlsToCache = [
  '/toshimaen/',
  '/toshimaen/static/css/reset.min.css',
  '/toshimaen/static/css/swiper.min.css',
  '/toshimaen/static/css/common.css',
  '/toshimaen/static/scr/common.js',
  '/toshimaen/static/scr/jquery.min.js',
  '/toshimaen/static/scr/swiper.min.js',
  '/toshimaen/static/scr/manifest.json',
  '/toshimaen/static/scr/serviceworker.js',
];

// インストール処理
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(urlsToCache);
    })
  );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response ? response : fetch(event.request);
    })
  );
});