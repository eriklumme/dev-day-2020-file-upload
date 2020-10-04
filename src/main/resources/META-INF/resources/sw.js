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
    const request = event.request;
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
self.addEventListener('fetch', async function(event) {
    const request = event.request;
    if (request.url.endsWith('/postDefect')) {
        console.log("Logging request 7");
        const requestClone = event.request.clone();

        return fetch(request).then(response => {

            requestClone.json().then(json => {
                // Extract the fileId from the JSON payload of the request
                if (json.fileId) {
                    Promise.all([
                        response.text(),
                        self.getFile(json.fileId)
                    ]).then(result => {
                        // The defect's ID is returned from the server after posting it
                        const defectId = result[0];
                        // and the file is loaded based on the file ID
                        const file = result[1];

                        if (defectId && file) {
                            file.defectId = defectId;
                            self.updateFile(file).then(_ => console.log(
                                `File ${json.fileId} has been updated to defect ID [${defectId}] :)`));
                        }
                    });
                }
            });

            return response;
        });
    }
});