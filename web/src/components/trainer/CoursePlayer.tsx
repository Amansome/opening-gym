import { useCallback, useState } from "react";
import type { Course, Line, Mode } from "../../lib/types";
import { CourtMap, laneTarget } from "../ui/CourtMap";
import type { LaneStatus } from "../ui/CourtMap";
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
  /** start on this exact line (from ?line=): Learn plays it, Practice puts it first */
  initialLine?: string;
}

/** A line chosen on purpose. `seq` changes with every choice so choosing the same lane again restarts it. */
interface Pick {
  lineId: string;
  mode: Mode;
  seq: number;
}

function CoursePlayerInner({ course, initialMode, initialLine }: CoursePlayerProps) {
  const { cp } = useCourseProgress(course);
  const { streak, refresh: refreshStreak } = useStreak();
  const firstMode: Mode = initialMode && initialMode !== "dojo" ? initialMode : "learn";
  const [requested, setRequested] = useState<Mode>(firstMode);
  const [pick, setPick] = useState<Pick | null>(
    initialLine && course.lines.some((l) => l.id === initialLine) && (firstMode === "learn" || firstMode === "practice")
      ? { lineId: initialLine, mode: firstMode, seq: 0 }
      : null,
  );
  const selectMode = useCallback((m: Mode) => {
    const next = m === "dojo" ? "learn" : m;
    setRequested(next);
    setPick((p) => (p && p.mode === next ? p : null)); // a choice belongs to the mode it started
  }, []);
  const onPick = useCallback((line: Line, status: LaneStatus) => {
    const next = laneTarget(status);
    setRequested(next);
    setPick((p) => ({ lineId: line.id, mode: next, seq: (p?.seq ?? 0) + 1 }));
  }, []);

  // A locked mode falls back to Learn.
  const mode: Mode = cp && !cp.unlocked[requested] ? "learn" : requested;
  const active = pick && pick.mode === mode ? pick : null;
  const modeKey = `${mode}:${active?.seq ?? 0}`;

  const props: ModeProps = {
    course,
    cp,
    streak,
    refreshStreak,
    selectMode,
    pick: active?.lineId,
    lanes: (currentLineId) => <CourtMap course={course} mode={mode} variant="picker" onPick={onPick} currentLineId={currentLineId} />,
    backTo: { to: "/openings", label: "Openings" },
    tabs: <ModeTabs mode={mode} progress={cp} onSelect={selectMode} />,
  };

  switch (mode) {
    case "practice":
      return <PracticeMode key={modeKey} {...props} />;
    case "drill":
      return <DrillMode key={modeKey} {...props} />;
    case "time":
      return <TimeMode key={modeKey} {...props} />;
    default:
      return <LearnMode key={modeKey} {...props} />;
  }
}

export function CoursePlayer(props: CoursePlayerProps) {
  return <CoursePlayerInner key={props.course.id} {...props} />;
}
