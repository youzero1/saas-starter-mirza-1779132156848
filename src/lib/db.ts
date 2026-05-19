/**
 * Lightweight IndexedDB wrapper that mimics a simple async database.
 * This gives the app a real async DB layer (IndexedDB) while remaining
 * fully client-side — no backend or Supabase required.
 *
 * NOTE: To swap in a real backend later, replace the functions below
 * with fetch() calls to your API while keeping the same signatures.
 */

const DB_NAME = 'JobListingsDB';
const DB_VERSION = 2;

const LISTINGS_STORE = 'listings';
const USERS_STORE = 'users';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(LISTINGS_STORE)) {
        const store = db.createObjectStore(LISTINGS_STORE, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const uStore = db.createObjectStore(USERS_STORE, { keyPath: 'id' });
        uStore.createIndex('email', 'email', { unique: true });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode
): IDBObjectStore {
  return db.transaction(storeName, mode).objectStore(storeName);
}

function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─── Generic CRUD ────────────────────────────────────────────────────────────

export async function dbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return wrap<T[]>(tx(db, storeName, 'readonly').getAll());
}

export async function dbGet<T>(storeName: string, id: string): Promise<T | undefined> {
  const db = await openDB();
  return wrap<T | undefined>(tx(db, storeName, 'readonly').get(id));
}

export async function dbPut<T>(storeName: string, record: T): Promise<void> {
  const db = await openDB();
  await wrap(tx(db, storeName, 'readwrite').put(record));
}

export async function dbDelete(storeName: string, id: string): Promise<void> {
  const db = await openDB();
  await wrap(tx(db, storeName, 'readwrite').delete(id));
}

export async function dbCount(storeName: string): Promise<number> {
  const db = await openDB();
  return wrap<number>(tx(db, storeName, 'readonly').count());
}

export async function dbGetByIndex<T>(
  storeName: string,
  indexName: string,
  value: string
): Promise<T[]> {
  const db = await openDB();
  const store = tx(db, storeName, 'readonly');
  const index = store.index(indexName);
  return wrap<T[]>(index.getAll(value));
}

// ─── Store name exports ───────────────────────────────────────────────────────

export { LISTINGS_STORE, USERS_STORE };
