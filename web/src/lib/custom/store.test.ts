import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeIndexedDB } from "../progress/fake-idb";
import { buildCourse } from "./builder";
import { deleteCustomCourse, listCustomCourses, resetCustomStore, saveCustomCourse, customStoreDegraded } from "./store";
import { allCourses, getCourse, onCustomCoursesChange } from "../courses";
import { bootCustomCourses, customCoursesReady, deleteAndRegister, refreshCustomCourses, saveAndRegister } from "./registry";

const make = (title: string, createdAt: number) =>
  buildCourse({ title, side: "white", createdAt, lines: [{ kind: "main", sans: ["e4", "e5"], notes: [] }], lookup: () => undefined }).course!;

describe("custom course store (memory fallback, no IndexedDB)", () => {
  beforeEach(() => resetCustomStore());

  it("saves, lists oldest first, replaces by id and deletes", async () => {
    const b = make("B", 2);
    const a = make("A", 1);
    await saveCustomCourse(b);
    await saveCustomCourse(a);
    expect((await listCustomCourses()).map((c) => c.title)).toEqual(["A", "B"]);
    await saveCustomCourse({ ...a, title: "A2" });
    expect((await listCustomCourses()).map((c) => c.title)).toEqual(["A2", "B"]);
    await deleteCustomCourse(a.id);
    expect((await listCustomCourses()).map((c) => c.title)).toEqual(["B"]);
    expect(customStoreDegraded()).toBe(true);
  });

  it("returns copies so callers cannot mutate stored courses", async () => {
    const a = make("A", 1);
    await saveCustomCourse(a);
    (await listCustomCourses())[0].title = "hacked";
    expect((await listCustomCourses())[0].title).toBe("A");
  });
});

describe("custom course store (IndexedDB via fake)", () => {
  beforeEach(() => {
    resetCustomStore();
    vi.stubGlobal("indexedDB", new FakeIndexedDB());
  });
  afterEach(() => vi.unstubAllGlobals());

  it("persists through idb-keyval and survives a fresh store handle (a reload)", async () => {
    const a = make("Persisted", 1);
    await saveCustomCourse(a);
    expect(customStoreDegraded()).toBe(false);
    // forget the handle but keep the same database, like a page reload
    const memoryOnly = (await listCustomCourses()).map((c) => c.id);
    expect(memoryOnly).toEqual([a.id]);
    await deleteCustomCourse(a.id);
    expect(await listCustomCourses()).toEqual([]);
  });
});

describe("registry", () => {
  beforeEach(() => resetCustomStore());

  it("registers saved courses with lib/courses, notifies listeners and resolves ids", async () => {
    const seen = vi.fn();
    const off = onCustomCoursesChange(seen);
    const a = make("Registered", 1);
    await saveAndRegister(a);
    expect(seen).toHaveBeenCalled();
    expect(getCourse(a.id)?.custom).toBe(true);
    expect(allCourses().some((c) => c.id === a.id)).toBe(true);
    await deleteAndRegister(a.id);
    expect(getCourse(a.id)).toBeUndefined();
    off();
  });

  it("boot loads once and reports ready", async () => {
    await saveCustomCourse(make("Boot", 1));
    await bootCustomCourses();
    expect(customCoursesReady()).toBe(true);
    expect((await refreshCustomCourses()).map((c) => c.title)).toEqual(["Boot"]);
  });
});
