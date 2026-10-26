import { CourseCard } from "../../components/ui/CourseCard";
import "../create.css";
import { LinkButton } from "../../components/ui/Button";
import { useCourseProgressMap } from "../../components/ui/hooks";
import { useCustomCourses } from "../../lib/custom";

/** "Create a course" button plus, when the user has made any, their courses as cards. */
export function MyCourses() {
  const { courses } = useCustomCourses();
  const progressMap = useCourseProgressMap(courses);
  return (
    <>
      <div className="cc-create-row">
        <LinkButton to="/create" variant={courses.length ? "secondary" : "primary"}>Create a course</LinkButton>
        {courses.length === 0 ? <span className="cc-create-hint">Build your own repertoire from the board, a PGN or a Lichess study.</span> : null}
      </div>
      {courses.length > 0 ? (
        <section className="cc-mine" aria-labelledby="g-mine">
          <div className="cc-mine-head">
            <h2 id="g-mine" className="cc-mine-title">My courses</h2>
            <span className="cc-mine-count">{courses.length}</span>
          </div>
          <div className="card-grid">
            {courses.map((c) => <CourseCard key={c.id} course={c} progress={progressMap[c.id]} />)}
          </div>
        </section>
      ) : null}
    </>
  );
}
