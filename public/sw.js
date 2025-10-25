// Simple Service Worker for PWA
const CACHE_NAME = 'vncdc-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  // Only handle http and https requests (skip chrome-extension:// and other schemes)
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip caching for API requests - always fetch fresh data
  if (event.request.url.includes('api-stc-v2.vncdc.gov.vn')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          })
          .catch((error) => {
            // Silently handle cache errors
            console.log('Cache put failed:', error);
          });
        
        return response;
      })
      .catch(() => {
        // Try to serve from cache if network fails
        return caches.match(event.request);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

