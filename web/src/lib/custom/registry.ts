// Keeps lib/courses' custom-course registry in sync with the store.
import { registerCustomCourses } from "../courses";
import type { Course } from "../types";
import { deleteCustomCourse, listCustomCourses, saveCustomCourse } from "./store";

let booted = false;
let bootPromise: Promise<void> | undefined;

/** true once the saved courses were loaded and registered (pages use this to avoid a false "not found") */
export function customCoursesReady(): boolean {
  return booted;
}

export async function refreshCustomCourses(): Promise<Course[]> {
  let list: Course[] = [];
  try {
    list = await listCustomCourses();
  } catch {
    /* start with none */
  }
  booted = true;
  registerCustomCourses(list);
  return list;
}

/** Loads saved courses once. Safe to call many times. */
export function bootCustomCourses(): Promise<void> {
  bootPromise ??= refreshCustomCourses().then(() => undefined);
  return bootPromise;
}

export async function saveAndRegister(course: Course): Promise<void> {
  await saveCustomCourse(course);
  await refreshCustomCourses();
}

export async function deleteAndRegister(id: string): Promise<void> {
  await deleteCustomCourse(id);
  await refreshCustomCourses();
}
