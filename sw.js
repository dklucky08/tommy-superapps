const CACHE_NAME = 'tsa-azure-v5.7';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
    clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.url.includes('status.json')) {
        e.respondWith(fetch(e.request).then(res => {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
            return res;
        }).catch(() => caches.match(e.request)));
    } else {
        e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
    }
});
