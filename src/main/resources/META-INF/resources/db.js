const FILES = 'files';

function _createFileDB() {
    if (!('indexedDB' in window)) {
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
function addFile(file) {
    return _createFileDB()
        .then(db => {
            const tx = db.transaction(FILES, 'readwrite');
            return Promise.all([
                tx.store.add({ file }),
                tx.done
            ]).then(result => result[0]);
        });
}