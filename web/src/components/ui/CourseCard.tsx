import { Link } from "react-router-dom";
import type { CourseProgress } from "../../lib/progress";
import { trainableLines } from "../../lib/courses";
import type { Course } from "../../lib/types";
import { LevelBadge, SideBadge, StyleBadge } from "./Badge";
import { CourseBoard } from "./MiniBoard";
import { ProgressBar } from "./ProgressBar";

/** One roster row: mini board, title, side, level, style, line count and a painted progress lane. */
export function CourseCard({ course, progress }: { course: Course; progress?: CourseProgress }) {
  const total = progress?.totalLines ?? trainableLines(course).length;
  const learned = progress?.learnedCount ?? 0;
  const due = progress?.dueCount ?? 0;
  const started = learned > 0;
  return (
    <article className="course-card">
      <div className="course-card-board">
        <CourseBoard course={course} />
      </div>
      <div className="course-card-main">
        <h3 className="course-card-title">
          <Link to={`/opening/${course.id}`} className="course-card-link">
            {course.title}
          </Link>
        </h3>
        <p className="course-card-summary">{course.summary}</p>
      </div>
      <div className="rc-tags">
        <span className="rc-cell rc-side"><SideBadge side={course.side} /></span>
        <span className="rc-cell rc-level"><LevelBadge level={course.level} /></span>
        <span className="rc-cell rc-style"><StyleBadge course={course} /></span>
        <p className="rc-cell rc-lines">
          <span className="rc-num">{course.lines.length}</span> lines
        </p>
      </div>
      <div className="rc-cell rc-lane">
        <p className="rc-lane-text">
          {started ? `${learned}/${total} learned` : "Not started"}
          {due > 0 ? <strong className="due-pill">{due} due</strong> : null}
        </p>
        <ProgressBar value={learned} max={total} due={due} label={`${course.title} progress`} />
      </div>
    </article>
  );
}

/** Column labels for a roster group. Visual only: every cell already says what it is. */
export function RosterHead() {
  return (
    <div className="roster-head" aria-hidden="true">
      <span />
      <span>Opening</span>
      <span>Side</span>
      <span>Level</span>
      <span>Style</span>
      <span>Lines</span>
      <span>Progress</span>
    </div>
  );
}
