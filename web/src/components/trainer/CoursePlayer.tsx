import { useCallback, useState } from "react";
import type { Course, Mode } from "../../lib/types";
import { ModeTabs } from "./ModeTabs";
import { LearnMode } from "./LearnMode";
import { PracticeMode } from "./PracticeMode";
import { DrillMode } from "./DrillMode";
import { TimeMode } from "./TimeMode";
import { useCourseProgress, useStreak } from "./hooks";
import type { ModeProps } from "./modeProps";
import "./trainer.css";

export interface CoursePlayerProps {
  course: Course;
  initialMode?: Mode; // defaults to "learn"
}

function CoursePlayerInner({ course, initialMode }: CoursePlayerProps) {
  const { cp } = useCourseProgress(course);
  const { streak, refresh: refreshStreak } = useStreak();
  const [requested, setRequested] = useState<Mode>(initialMode && initialMode !== "dojo" ? initialMode : "learn");
  const selectMode = useCallback((m: Mode) => setRequested(m === "dojo" ? "learn" : m), []);

  // A locked mode falls back to Learn.
  const mode: Mode = cp && !cp.unlocked[requested] ? "learn" : requested;

  const props: ModeProps = {
    course,
    cp,
    streak,
    refreshStreak,
    selectMode,
    tabs: <ModeTabs mode={mode} progress={cp} onSelect={selectMode} />,
  };

  switch (mode) {
    case "practice":
      return <PracticeMode key="practice" {...props} />;
    case "drill":
      return <DrillMode key="drill" {...props} />;
    case "time":
      return <TimeMode key="time" {...props} />;
    default:
      return <LearnMode key="learn" {...props} />;
  }
}

export function CoursePlayer(props: CoursePlayerProps) {
  return <CoursePlayerInner key={props.course.id} {...props} />;
}
