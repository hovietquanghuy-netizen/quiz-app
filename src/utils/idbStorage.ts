import type { StateStorage } from 'zustand/middleware';

// IndexedDB storage cho zustand persist.
// localStorage chỉ chứa được ~5MB nên không đủ cho deck có hình ảnh (base64);
// IndexedDB cho phép hàng trăm MB. Dữ liệu cũ trong localStorage được
// tự động di trú sang IndexedDB ở lần đọc đầu tiên.

const DB_NAME = 'quiz-app-db';
const STORE_NAME = 'zustand-persist';

let dbPromise: Promise<IDBDatabase> | null = null;

const openDb = (): Promise<IDBDatabase> => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE_NAME);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
};

const withStore = <T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> =>
  openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const req = action(tx.objectStore(STORE_NAME));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );

export const idbStorage: StateStorage = {
  getItem: async (name) => {
    const value = await withStore<unknown>('readonly', (store) => store.get(name));
    if (typeof value === 'string') return value;

    // Di trú một lần từ localStorage (bản cũ của app)
    const legacy = localStorage.getItem(name);
    if (legacy !== null) {
      await withStore('readwrite', (store) => store.put(legacy, name));
      localStorage.removeItem(name);
      return legacy;
    }
    return null;
  },
  setItem: async (name, value) => {
    await withStore('readwrite', (store) => store.put(value, name));
  },
  removeItem: async (name) => {
    await withStore('readwrite', (store) => store.delete(name));
  },
};
