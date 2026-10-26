import { Link } from "react-router-dom";
import type { CourseProgress } from "../../lib/progress";
import { trainableLines } from "../../lib/courses";
import type { Course } from "../../lib/types";
import { LevelBadge, SideBadge, StyleBadge } from "./Badge";
import { CourseBoard } from "./MiniBoard";
import { ProgressBar } from "./ProgressBar";

/**
 * One roster row: mini board, title, level, style, line count, and a painted progress lane once the course is started.
 * `showSide` adds the side badge; leave it off where a heading already says which side the list is for.
 */
export function CourseCard({ course, progress, showSide = true }: { course: Course; progress?: CourseProgress; showSide?: boolean }) {
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
        {showSide ? <span className="rc-cell rc-side"><SideBadge side={course.side} /></span> : null}
        <span className="rc-cell rc-level"><LevelBadge level={course.level} /></span>
        <span className="rc-cell rc-style"><StyleBadge course={course} /></span>
        <p className="rc-cell rc-lines">
          <span className="rc-num">{course.lines.length}</span> lines
        </p>
      </div>
      {started ? (
        <div className="rc-cell rc-lane">
          <p className="rc-lane-text">
            {learned}/{total} learned
            {due > 0 ? <strong className="due-pill">{due} due</strong> : null}
          </p>
          <ProgressBar value={learned} max={total} due={due} label={`${course.title} progress`} />
        </div>
      ) : (
        <div className="rc-cell rc-lane" data-empty="" aria-hidden="true">
          <span className="rc-chalk" />
        </div>
      )}
    </article>
  );
}

/** Column labels for a roster group. Visual only: every cell already says what it is. */
export function RosterHead({ showSide = true }: { showSide?: boolean }) {
  return (
    <div className="roster-head" aria-hidden="true" data-nosides={showSide ? undefined : ""}>
      <span />
      <span>Opening</span>
      {showSide ? <span>Side</span> : null}
      <span>Level</span>
      <span>Style</span>
      <span>Lines</span>
      <span>Progress</span>
    </div>
  );
}
