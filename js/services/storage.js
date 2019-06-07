// eslint-disable-next-line no-undef
const local = browser.storage.local;

const keysInUse = new Set();

export default class Storage {
    constructor(key) {
        if (keysInUse.has(key))
            throw new Error(`Storage key: ${key} already in use`);
        this.key = key;
    }

    getUniqueKey(key) {
        return `@${this.key}:${key}`;
    }

    set(key, value) {
        const withUniqueKey = this.getUniqueKey(key);
        return setLocalStorage({
            [withUniqueKey]: value,
        });
    }

    async get(key) {
        const withUniqueKey = this.getUniqueKey(key);
        const values = await getLocalStorage(withUniqueKey);
        return values[withUniqueKey] || null;
    }
}

export const setLocalStorage = (keys) => {
    return local.set(keys);
};

export const getLocalStorage = async (keys) => {
    return local.get(keys);
};

