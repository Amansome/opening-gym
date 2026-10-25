// A very small in-memory IndexedDB, just enough surface for idb-keyval (open / one object store /
// put / get / delete / getAll / getAllKeys). Lets the tests drive the real idbBackend and idb-keyval code.
type Handler = (() => void) | null;

class FakeRequest<T = unknown> {
  result!: T;
  error: unknown = null;
  onsuccess: Handler = null;
  onerror: Handler = null;
  oncomplete: Handler = null;
  onabort: Handler = null;
  onupgradeneeded: Handler = null;
  transaction?: FakeTransaction;
  resolveLater(value: T, delay = 0) {
    setTimeout(() => {
      this.result = value;
      this.onsuccess?.();
    }, delay);
  }
}

class FakeTransaction {
  oncomplete: Handler = null;
  onabort: Handler = null;
  onerror: Handler = null;
  error: unknown = null;
  private db: FakeDb;
  readonly mode: string;
  constructor(db: FakeDb, mode: string) {
    this.db = db;
    this.mode = mode;
    setTimeout(() => this.oncomplete?.(), 5); // after every request of this transaction has fired
  }
  objectStore(name: string) {
    if (name !== this.db.storeName) throw new Error("NotFoundError");
    return new FakeObjectStore(this.db, this);
  }
}

class FakeObjectStore {
  private db: FakeDb;
  readonly transaction: FakeTransaction;
  constructor(db: FakeDb, transaction: FakeTransaction) {
    this.db = db;
    this.transaction = transaction;
  }
  private req<T>(value: T) {
    const r = new FakeRequest<T>();
    r.resolveLater(value);
    return r;
  }
  put(value: unknown, key: string) {
    if (this.db.factory.failWrites) throw new Error("QuotaExceededError");
    this.db.rows.set(key, structuredClone(value));
    return this.req(key);
  }
  get(key: string) {
    return this.req(structuredClone(this.db.rows.get(key)));
  }
  delete(key: string) {
    this.db.rows.delete(key);
    return this.req(undefined);
  }
  getAllKeys() {
    return this.req([...this.db.rows.keys()].sort());
  }
  getAll() {
    return this.req([...this.db.rows.keys()].sort().map((k) => structuredClone(this.db.rows.get(k))));
  }
}

class FakeDb {
  readonly factory: FakeIndexedDB;
  constructor(factory: FakeIndexedDB) {
    this.factory = factory;
  }
  storeName = "";
  rows = new Map<string, unknown>();
  onclose: Handler = null;
  createObjectStore(name: string) {
    this.storeName = name;
  }
  transaction(_store: string, mode: string) {
    return new FakeTransaction(this, mode);
  }
}

/** A factory instance owns its databases, so two `idbBackend()`s over the same factory share data (a "reload"). */
export class FakeIndexedDB {
  private dbs = new Map<string, FakeDb>();
  /** set to make open() fail, like Firefox private mode */
  failOpen = false;
  /** set to make writes throw, like a full disk */
  failWrites = false;
  open(name: string) {
    const req = new FakeRequest<FakeDb>();
    setTimeout(() => {
      if (this.failOpen) {
        req.error = new Error("SecurityError");
        req.onerror?.();
        return;
      }
      let db = this.dbs.get(name);
      req.result = db as FakeDb;
      if (!db) {
        db = new FakeDb(this);
        this.dbs.set(name, db);
        req.result = db;
        req.onupgradeneeded?.();
      }
      req.onsuccess?.();
    }, 0);
    return req;
  }
  /** Raw view of what is stored, for assertions. */
  dump(name = "opening-gym"): Record<string, unknown> {
    return Object.fromEntries(this.dbs.get(name)?.rows ?? []);
  }
}
