// sw.js – Service Worker für Offline-Funktionalität
const CACHE_NAME = 'service-zeit-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installation: Dateien im Cache speichern
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cache geöffnet');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivierung: Alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Alter Cache gelöscht:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Netzwerk-Anfragen abfangen
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache-Treffer zurückgeben, sonst Netzwerk-Anfrage
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback bei Offline
        return caches.match('/index.html');
      })
  );
});