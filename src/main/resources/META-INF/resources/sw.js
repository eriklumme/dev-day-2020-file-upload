importScripts('/VAADIN/static/server/workbox/workbox-sw.js');
importScripts('idb-min.js');
importScripts('db.js');

workbox.setConfig({
    modulePathPrefix: '/VAADIN/static/server/workbox/'
});
workbox.precaching.precacheAndRoute([
    { url: 'icons/icon-144x144.png', revision: '456714318' },
    { url: 'icons/icon-192x192.png', revision: '-1481948590' },
    { url: 'icons/icon-512x512.png', revision: '789785684' },
    { url: 'icons/icon-16x16.png', revision: '1782914653' },
    { url: 'offline.html', revision: '-963326905' },
    { url: 'manifest.webmanifest', revision: '99940210' }
]);
self.addEventListener('fetch', function(event) {
    var request = event.request;
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(function() {
                    return caches.match('offline.html');
                })
        );
    }

});

// Defect posts
self.addEventListener('fetch', function(event) {
    const request = event.request;
    if (request.url.endsWith('/postDefect')) {
        return fetch(request)
            .then(response => {
                response.text().then(uuid => console.log("Uuid: " + uuid));
                return response;
            });
    }
});