const OFFLINE_DB = 'OfflineDB';
const FILES = "files";
const DEFECTS = "defects";

const _createOfflineDB = () => {
    if (!('indexedDB' in self)) {
        return null;
    }
    return idb.openDB(OFFLINE_DB, 1, {
        upgrade: upgradeDb => {
            if (!upgradeDb.objectStoreNames.contains(FILES)) {
                upgradeDb.createObjectStore(FILES, { keyPath: 'id', autoIncrement: true });
            }
            if (!upgradeDb.objectStoreNames.contains(DEFECTS)) {
                upgradeDb.createObjectStore(DEFECTS, { keyPath: 'id', autoIncrement: true });
            }
        }
    });
}

const _dbActions = table => {
    return {
        async add(object) {
            return _createOfflineDB().then(db => {
                const tx = db.transaction(table, 'readwrite');
                return Promise.all([
                    tx.store.add(object),
                    tx.done
                ]).then(result => result[0]);
            })
        },
        async get(id) {
            return _createOfflineDB().then(db => db.get(table, id));
        },
        async getAll() {
            return _createOfflineDB().then(db => db.getAll(table));
        },
        async remove(id) {
            return _createOfflineDB().then(db => db.delete(table, id));
        },
        async update(object) {
            return _createOfflineDB().then(db => db.put(table, object));
        }
    }
}

self.FileActions = () => _dbActions(FILES);
self.DefectActions = () => _dbActions(DEFECTS);