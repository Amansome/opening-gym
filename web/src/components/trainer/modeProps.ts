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
  /** a line chosen from the lane picker (or ?line=): Learn plays exactly this line, Practice puts it first in the queue */
  pick?: string;
  /** where the scoreboard's back link goes (phones, where the breadcrumb is hidden) */
  backTo?: { to: string; label: string };
  /** the lane picker for the panel; pass the line on the board so its lane is marked */
  lanes?: (currentLineId?: string) => ReactNode;
}
