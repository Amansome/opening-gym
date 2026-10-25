// Custom courses live in IndexedDB (idb-keyval store "opening-gym-custom" / "courses").
// If IndexedDB is unavailable (private mode, blocked, tests) the same API runs on an in-memory map.
import { createStore, del, entries, set } from "idb-keyval";
import type { UseStore } from "idb-keyval";
import type { Course } from "../types";

const memory = new Map<string, Course>();
let store: UseStore | undefined;
let degraded = false;

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

function getStore(): UseStore | undefined {
  if (degraded) return undefined;
  if (store) return store;
  try {
    if (typeof indexedDB === "undefined") throw new Error("indexedDB is not available");
    store = createStore("opening-gym-custom", "courses");
    return store;
  } catch {
    degraded = true;
    return undefined;
  }
}

/** true once IndexedDB failed this page load: courses then live only until the tab closes */
export function customStoreDegraded(): boolean {
  return degraded;
}

/** Test hook: forget the cached store handle and the memory fallback. */
export function resetCustomStore(): void {
  store = undefined;
  degraded = false;
  memory.clear();
}

async function withTimeout<T>(p: Promise<T>, ms = 4000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([p, new Promise<never>((_, rej) => (timer = setTimeout(() => rej(new Error("IndexedDB timed out")), ms)))]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function listCustomCourses(): Promise<Course[]> {
  const s = getStore();
  let list: Course[];
  if (s) {
    try {
      const all = await withTimeout(entries<string, Course>(s));
      list = all.map(([, v]) => v).filter((c) => c && typeof c === "object" && typeof c.id === "string");
    } catch {
      degraded = true;
      list = [...memory.values()];
    }
  } else list = [...memory.values()];
  return clone(list).sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
}

export async function saveCustomCourse(course: Course): Promise<void> {
  const value = clone({ ...course, custom: true });
  memory.set(course.id, value);
  const s = getStore();
  if (!s) return;
  try {
    await withTimeout(set(course.id, value, s));
  } catch {
    degraded = true;
  }
}

export async function deleteCustomCourse(id: string): Promise<void> {
  memory.delete(id);
  const s = getStore();
  if (!s) return;
  try {
    await withTimeout(del(id, s));
  } catch {
    degraded = true;
  }
}
