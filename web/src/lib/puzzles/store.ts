// Puzzle progress: solved / failed / streaks per puzzle, in IndexedDB (idb-keyval store "opening-gym-puzzles"/"kv")
// with a memory-only fallback when IndexedDB is unavailable.
import { createStore, get, set, type UseStore } from "idb-keyval";
import type { PuzzleMeta, PuzzleProgress, PuzzleRecord } from "./types";

export interface PuzzleKv {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

export function memoryKv(): PuzzleKv & { readonly data: Map<string, unknown> } {
  const data = new Map<string, unknown>();
  return {
    data,
    async get(k) {
      const v = data.get(k);
      return v === undefined ? undefined : JSON.parse(JSON.stringify(v));
    },
    async set(k, v) {
      data.set(k, JSON.parse(JSON.stringify(v)));
    },
  };
}

/** IndexedDB, degrading to memory the first time anything fails. */
export function idbKv(timeoutMs = 3000): PuzzleKv {
  const memory = memoryKv();
  let degraded = typeof indexedDB === "undefined";
  let store: UseStore | undefined;
  const getStore = (): UseStore | undefined => {
    if (degraded) return undefined;
    try {
      store ??= createStore("opening-gym-puzzles", "kv");
      return store;
    } catch {
      degraded = true;
      return undefined;
    }
  };
  const guard = <T,>(p: Promise<T>): Promise<T> =>
    Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error("IndexedDB timed out")), timeoutMs))]);
  return {
    async get(k) {
      const s = getStore();
      if (s) {
        try {
          return await guard(get(k, s));
        } catch {
          degraded = true;
        }
      }
      return memory.get(k);
    },
    async set(k, v) {
      const s = getStore();
      if (s) {
        try {
          await guard(set(k, v, s));
          return;
        } catch {
          degraded = true;
        }
      }
      await memory.set(k, v);
    },
  };
}

const KEY = "progress";
const emptyMeta = (): PuzzleMeta => ({ streak: 0, bestStreak: 0 });
const empty = (): PuzzleProgress => ({ records: {}, meta: emptyMeta() });

function sanitize(raw: unknown): PuzzleProgress {
  if (!raw || typeof raw !== "object") return empty();
  const r = raw as Partial<PuzzleProgress>;
  const records: Record<string, PuzzleRecord> = {};
  for (const [id, v] of Object.entries(r.records ?? {})) {
    if (!v || typeof v !== "object") continue;
    const x = v as Partial<PuzzleRecord>;
    records[id] = {
      solved: Number(x.solved) || 0,
      failed: Number(x.failed) || 0,
      streak: Number(x.streak) || 0,
      bestStreak: Number(x.bestStreak) || 0,
      last: x.last === "failed" ? "failed" : "solved",
      at: Number(x.at) || 0,
    };
  }
  return { records, meta: { streak: Number(r.meta?.streak) || 0, bestStreak: Number(r.meta?.bestStreak) || 0 } };
}

export interface PuzzleStore {
  load(): Promise<PuzzleProgress>;
  /** A clean solve is first try with no solution shown. */
  recordSolved(id: string, clean: boolean): Promise<PuzzleProgress>;
  recordFailed(id: string): Promise<PuzzleProgress>;
  reset(): Promise<PuzzleProgress>;
}

export function createPuzzleStore(kv: PuzzleKv, now: () => number = Date.now): PuzzleStore {
  let state: PuzzleProgress | null = null;
  let chain: Promise<unknown> = Promise.resolve();
  const ensure = async (): Promise<PuzzleProgress> => {
    if (!state) state = sanitize(await kv.get(KEY).catch(() => undefined));
    return state;
  };
  // Writes are serialised so two quick results never overwrite each other.
  const mutate = (fn: (s: PuzzleProgress) => void): Promise<PuzzleProgress> => {
    const run = chain.then(async () => {
      const s = await ensure();
      fn(s);
      await kv.set(KEY, s).catch(() => {});
      return JSON.parse(JSON.stringify(s)) as PuzzleProgress;
    });
    chain = run.catch(() => {});
    return run;
  };
  const rec = (s: PuzzleProgress, id: string): PuzzleRecord =>
    (s.records[id] ??= { solved: 0, failed: 0, streak: 0, bestStreak: 0, last: "solved", at: 0 });
  return {
    async load() {
      const s = await ensure();
      return JSON.parse(JSON.stringify(s)) as PuzzleProgress;
    },
    recordSolved(id, clean) {
      return mutate((s) => {
        const r = rec(s, id);
        r.solved++;
        r.last = "solved";
        r.at = now();
        if (clean) {
          r.streak++;
          r.bestStreak = Math.max(r.bestStreak, r.streak);
          s.meta.streak++;
          s.meta.bestStreak = Math.max(s.meta.bestStreak, s.meta.streak);
        } else {
          r.streak = 0;
          s.meta.streak = 0;
        }
      });
    },
    recordFailed(id) {
      return mutate((s) => {
        const r = rec(s, id);
        r.failed++;
        r.last = "failed";
        r.streak = 0;
        r.at = now();
        s.meta.streak = 0;
      });
    },
    reset() {
      return mutate((s) => {
        s.records = {};
        s.meta = emptyMeta();
      });
    },
  };
}

/** App-wide store. */
export const puzzleStore: PuzzleStore = createPuzzleStore(idbKv());
