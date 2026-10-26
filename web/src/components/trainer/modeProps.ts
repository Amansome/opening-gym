import type { ReactNode } from "react";
import type { Course, Mode } from "../../lib/types";
import type { CourseProgress, StreakInfo } from "../../lib/progress";

/** What CoursePlayer hands to each mode component. */
export interface ModeProps {
  course: Course;
  cp: CourseProgress | null;
  streak: StreakInfo;
  refreshStreak: () => Promise<StreakInfo>;
  /** the mode tab strip, already wired */
  tabs: ReactNode;
  selectMode: (mode: Mode) => void;
}
