import { Link } from "react-router-dom";
import type { CourseProgress } from "../../lib/progress";
import { trainableLines } from "../../lib/courses";
import type { Course } from "../../lib/types";
import { LevelBadge, SideBadge, StyleBadge } from "./Badge";
import { CourseBoard } from "./MiniBoard";
import { ProgressBar } from "./ProgressBar";

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
      <div className="course-card-body">
        <h3 className="course-card-title">
          <Link to={`/opening/${course.id}`} className="course-card-link">
            {course.title}
          </Link>
        </h3>
        <div className="badge-row">
          <LevelBadge level={course.level} />
          <SideBadge side={course.side} />
          <StyleBadge course={course} />
        </div>
        <p className="course-card-summary">{course.summary}</p>
        <div className="course-card-foot">
          <div className="course-card-meta">
            <span>{course.lines.length} lines</span>
            <span>
              {started ? `${learned}/${total} learned` : "Not started"}
              {due > 0 ? <strong className="due-pill">{due} due</strong> : null}
            </span>
          </div>
          <ProgressBar value={learned} max={total} label={`${course.title} progress`} />
        </div>
      </div>
    </article>
  );
}
