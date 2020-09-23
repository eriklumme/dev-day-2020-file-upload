const FILES = 'files';

self._createFileDB = function() {
    if (!('indexedDB' in self)) {
        return null;
    }
    return idb.openDB('FileDB', 5, {
        upgrade: upgradeDb => {
            if (!upgradeDb.objectStoreNames.contains(FILES)) {
                upgradeDb.createObjectStore(FILES, { keyPath: 'id', autoIncrement: true });
            }
        }
    });
}

/**
 * Adds a file and returns its ID
 */
self.addFile = function(file) {
    return self._createFileDB()
        .then(db => {
            const tx = db.transaction(FILES, 'readwrite');
            return Promise.all([
                tx.store.add({ file }),
                tx.done
            ]).then(result => result[0]);
        });
}

/**
 * Gets a file based on its ID
 */
self.getFile = function(id) {
    return self._createFileDB().then(db => db.get(FILES, id));
}

/**
 * Updates a file object
 */
self.updateFile = function(fileObj) {
    return self._createFileDB().then(db => db.put(FILES, fileObj));
}