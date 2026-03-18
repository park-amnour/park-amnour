const CACHE_NAME = 'amnour-park-media-v1';
const MEDIA_DOMAINS = [
  'insforge.app',
  'covered.ai',
  'unsplash.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache check for media domains
  const isMediaRequest = MEDIA_DOMAINS.some(domain => url.hostname.includes(domain));
  const isImageOrVideo = 
    event.request.destination === 'image' || 
    event.request.destination === 'video' ||
    url.pathname.match(/\.(mp4|webm|jpg|jpeg|png|webp|gif|svg)$/i);

  if (isMediaRequest && isImageOrVideo) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) return response;
          
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});
