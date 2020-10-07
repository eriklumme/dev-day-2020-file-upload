importScripts('idb-min.js');
importScripts('db.js');

const SYNC_TAG = 'sync';
const SYNC_ENABLED = 'sync' in self.registration;

/**
 * If sync is enabled, add a listener for it. Otherwise, run _onSync immediately.
 */
if (SYNC_ENABLED) {
    console.warn("Sync is enabled");

    self.addEventListener('sync', async e => {
        if (e.tag === SYNC_TAG) {
            let error;
            try {
                e.waitUntil(_onSync());
            } catch (e) {
                error = true;
                throw e;
            } finally {
                if (error && e.lastChance) {
                    console.warn("Last chance");
                    await _requestSync();
                }
            }
        }
    });
} else {
    console.warn("Sync is not enabled");
    _onSync().catch(e => console.error(e));
}

/**
 * Save failed defect requests to the DB
 */
self.addEventListener('fetch', async function(event) {
    const request = event.request;
    if (request.url.endsWith('/postDefect')) {
        event.respondWith(
            fetch(request.clone())
                .then(response => {
                    _onDefectPosted(request, response.clone());
                    return response;
                })
                .catch(e => {
                    self.DefectActions.add({request});
                    throw e;
                }).finally(() => _requestSync())
        );
    }
});

/**
 * Action taken when we are requested to sync. Will replay failed requests.
 */
_onSync = async function() {
    const defectActions = self.DefectActions();
    let defects = await defectActions.getAll();
    defects = defects.sort((a, b) => a.id < b.id ? -1 : 1);
    for(let defect of defects) {
        try {
            console.warn(`Replaying request ${defect.id}`);
            const response = await fetch(defect.request.clone());
            await _onDefectPosted(defect.request, response);
            await defectActions.remove(defect.id);
        } catch (e) {
            console.warn(`Could not replay request with ID [${defect.id}`);
            throw e;
        }
    }

    const fileActions = self.FileActions();
    let files = await fileActions.getAll();
    files = files.sort((a, b) => a.id < b.id ? -1 : 1).filter(file => file.defectId);
    for(let file of files) {
        try {
            console.warn(`Posting file ${file.id}`);
            await _postFile(file);
            await defectActions.remove(file.id);
        } catch (e) {
            console.warn(`Could not post file with ID [${file.id}`);
            throw e;
        }
    }

    console.warn("Sync completed");
};


_requestSync = async () => {
    if (SYNC_ENABLED) {
        await self.registration.sync.register(SYNC_TAG);
    }
}

_onDefectPosted = async function(request, response, cached) {
    await request.json().then(json => {
        // Extract the fileId from the JSON payload of the request
        if (json.fileId) {
            return Promise.all([
                response.text(),
                self.FileActions().get(json.fileId)
            ]);
        }
        if (cached) {
            console.warn("It was cached!");
        } else {
            console.warn("It was NOT cached!");
        }
    }).then(result => {
        if (result?.length > 1) {
            // The defect's ID is returned from the server after posting it
            const defectId = result[0];
            // and the file is loaded based on the file ID
            const file = result[1];

            if (defectId && file) {
                file.defectId = defectId;
                return self.FileActions().update(file);
            }
        }
    }).then(e => console.error("Updated! " + e));
}

_postFile = async file => {
    console.warn("Posting file..");
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('defectId', file.defectId);
    console.log(file);

    return await fetch('/file', {
        method: 'POST',
        body: formData
    }).then(response => {
        console.log("Response");
        console.log(response);
    });
};