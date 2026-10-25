// Key-value persistence backends. The service keeps everything in memory and writes through to one of these.
// Layout (one record per key, so a review only rewrites the course it touched):
//   "meta"            -> { schemaVersion, streak, scores }
//   "course:<id>"     -> CourseState
import { createStore, del, entries, set, type UseStore } from "idb-keyval";

export interface KvBackend {
  loadAll(): Promise<Record<string, unknown>>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
}

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** In-memory backend. Used for tests and as the fallback when IndexedDB is unavailable. Values are cloned like IndexedDB would. */
export function memoryBackend(initial: Record<string, unknown> = {}): KvBackend & { readonly data: Map<string, unknown> } {
  const data = new Map<string, unknown>(Object.entries(initial).map(([k, v]) => [k, clone(v)]));
  return {
    data,
    async loadAll() {
      return Object.fromEntries([...data].map(([k, v]) => [k, clone(v)]));
    },
    async set(key, value) {
      data.set(key, clone(value));
    },
    async del(key) {
      data.delete(key);
    },
  };
}

export interface IdbBackendOptions {
  dbName?: string;
  storeName?: string;
  /** Give up on IndexedDB (and run memory-only) if opening/reading takes longer than this. */
  timeoutMs?: number;
}

export interface IdbBackend extends KvBackend {
  /** true once IndexedDB failed and data is memory-only for this page load */
  readonly degraded: boolean;
}

/** IndexedDB via idb-keyval with a dedicated store. Any failure (private mode, quota, blocked) degrades to memory-only. */
export function idbBackend(opts: IdbBackendOptions = {}): IdbBackend {
  const memory = memoryBackend();
  let degraded = false;
  let store: UseStore | undefined;

  const degrade = (err: unknown) => {
    // No indexedDB global at all (SSR, jsdom, very old browsers) is an environment fact, not worth a warning.
    if (!degraded && typeof indexedDB !== "undefined") {
      console.warn("[opening-gym] IndexedDB unavailable, progress is memory-only this session.", err);
    }
    degraded = true;
  };

  const getStore = (): UseStore | undefined => {
    if (degraded) return undefined;
    if (store) return store;
    try {
      if (typeof indexedDB === "undefined") throw new Error("indexedDB is not available");
      store = createStore(opts.dbName ?? "opening-gym", opts.storeName ?? "kv");
      return store;
    } catch (err) {
      degrade(err);
      return undefined;
    }
  };

  return {
    get degraded() {
      return degraded;
    },
    async loadAll() {
      const s = getStore();
      if (!s) return memory.loadAll();
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        const timeout = new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("IndexedDB timed out")), opts.timeoutMs ?? 4000);
        });
        const rows = await Promise.race([entries(s), timeout]);
        return Object.fromEntries(rows.map(([k, v]) => [String(k), v]));
      } catch (err) {
        degrade(err);
        return memory.loadAll();
      } finally {
        clearTimeout(timer);
      }
    },
    async set(key, value) {
      const s = getStore();
      if (s) {
        try {
          await set(key, value, s);
          return;
        } catch (err) {
          degrade(err);
        }
      }
      await memory.set(key, value);
    },
    async del(key) {
      const s = getStore();
      if (s) {
        try {
          await del(key, s);
          return;
        } catch (err) {
          degrade(err);
        }
      }
      await memory.del(key);
    },
  };
}
