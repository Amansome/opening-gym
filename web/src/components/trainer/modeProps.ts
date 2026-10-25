import type { ReactNode } from "react";
import type { Course, Mode } from "../../lib/types";
import type { CourseProgress, StreakInfo } from "../../lib/progress";

/** What CoursePlayer hands to each mode component. */
export interface ModeProps {
  course: Course;
  cp: CourseProgress | null;
  streak: StreakInfo;
  refreshStreak: () => Promise<StreakInfo>;
  /** the four mode tiles, already wired */
  tiles: ReactNode;
  selectMode: (mode: Mode) => void;
}
