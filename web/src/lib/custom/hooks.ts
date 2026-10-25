import { useEffect, useState } from "react";
import { allCourses, onCustomCoursesChange } from "../courses";
import type { Course } from "../types";
import { customCoursesReady } from "./registry";

/** The user's custom courses (re-renders when they change) and whether the saved ones have finished loading. */
export function useCustomCourses(): { courses: Course[]; ready: boolean } {
  const read = () => ({ courses: allCourses().filter((c) => c.custom), ready: customCoursesReady() });
  const [state, setState] = useState(read);
  useEffect(() => {
    const update = () => setState(read());
    update();
    return onCustomCoursesChange(update);
  }, []);
  return state;
}
