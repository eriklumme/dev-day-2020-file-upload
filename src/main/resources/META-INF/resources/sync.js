importScripts('idb-min.js');
importScripts('db.js');

const SYNC_TAG = 'sync';
const SYNC_ENABLED = 'sync' in self.registration;

/**
 * If sync is enabled, add a listener for it. Otherwise, run _onSync immediately.
 */
if (SYNC_ENABLED) {
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
        let error;
        const fetchPromise = fetch(request.clone())
            .then(response => {
                if (!response.ok) {
                    throw `Failed to post defect, status is ${response.status}`;
                }
                _onDefectPosted(request.clone(), response.clone());
                return response;
            })
            .catch(e => {
                error = e;
                return _requestToDefect(request)
                    .then(defect => self.DefectActions().add(defect))
                    .then(() => {
                        throw error;
                    });
            })
            .finally(() => _requestSync())
        event.respondWith(fetchPromise);
        event.waitUntil(fetchPromise);
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
            const request = _defectToRequest(defect);
            const response = await fetch(request.clone());
            await _onDefectPosted(request, response);
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
            await _postFile(file);
            await fileActions.remove(file.id);
        } catch (e) {
            console.warn(`Could not post file with ID [${file.id}`);
            throw e;
        }
    }
};


_requestSync = async () => {
    if (SYNC_ENABLED) {
        await self.registration.sync.register(SYNC_TAG);
    }
}

_onDefectPosted = async function(request, response) {
    await request.json().then(json => {
        // Extract the fileId from the JSON payload of the request
        if (json.fileId) {
            return Promise.all([
                response.text(),
                self.FileActions().get(json.fileId)
            ]);
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
    });
}

_postFile = async file => {
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('defectId', file.defectId);

    return await fetch('/file', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (!response.ok) {
            throw `Failed to post file, status is ${response.status}`;
        }
    });
};

_requestToDefect = async function(request) {
    const headers = {};
    for (const [key, value] of request.headers.entries()) {
        headers[key] = value;
    }
    return {
        url: request.url,
        data: {
            method: request.method,
            headers: headers,
            body: await request.clone().arrayBuffer()
        }
    }
}

_defectToRequest = function(defect) {
    return new Request(defect.url, defect.data);
}

