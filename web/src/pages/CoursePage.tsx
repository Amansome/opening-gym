import { Fragment, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CoursePlayer } from "../components/trainer/CoursePlayer";
import { KindBadge, LevelBadge, SideBadge, StyleBadge } from "../components/ui/Badge";
import { CourtMap } from "../components/ui/CourtMap";
import { Icon } from "../components/ui/Icon";
import { useCourseProgress, useDocumentMeta } from "../components/ui/hooks";
import { getCourse, trainableLines } from "../lib/courses";
import type { Course, Mode } from "../lib/types";
import { useCustomCourses } from "../lib/custom";
import { CustomActions } from "./create/CustomActions";
import NotFound from "./NotFound";

const MODES: Mode[] = ["learn", "practice", "drill", "time", "dojo"];

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

/** A PGN set as readable text: move numbers stand out from the moves. */
function PgnText({ text }: { text: string }) {
  const parts = text.split(/(\d+\.(?:\.\.)?)/);
  return (
    <>
      {parts.map((p, i) => (/^\d+\.(?:\.\.)?$/.test(p) ? <span key={i} className="pgn-no">{p}</span> : p))}
    </>
  );
}

interface TocItem { id: string; label: string }

function CourseArticle({ course, mode }: { course: Course; mode?: Mode }) {
  const a = course.article;
  const progress = useCourseProgress(course);
  const learned = new Set(progress?.lines.filter((l) => l.learned).map((l) => l.lineId));
  const trainable = trainableLines(course).length;

  const toc: TocItem[] = [
    { id: "overview", label: "Overview" },
    ...(a ? [{ id: "what-is", label: `What is the ${course.title}?` }] : []),
    ...(a?.howToReach ? [{ id: "how-to-reach", label: "How to reach it" }] : []),
    ...(a && (a.pros.length || a.cons.length) ? [{ id: "pros-cons", label: "Pros and cons" }] : []),
    ...(a?.variations?.length ? [{ id: "variations", label: "Main variations" }] : []),
    ...(a?.againstIt ? [{ id: "against", label: "Playing against it" }] : []),
    ...(a?.plans ? [{ id: "plans", label: "Plans for both sides" }] : []),
    ...(a?.history ? [{ id: "history", label: "History" }] : []),
    { id: "lines", label: "All lines in this course" },
    ...(a?.faq?.length ? [{ id: "faq", label: "FAQ" }] : []),
  ];

  return (
    <div className="article-layout">
      <aside className="toc" aria-label="On this page">
        <p className="toc-title">On this page</p>
        <ul>
          {toc.map((t) => (
            <li key={t.id}><a href={`#${t.id}`}>{t.label}</a></li>
          ))}
        </ul>
      </aside>

      <article className="article">
        <section id="overview">
          <h1 className="article-title">{course.title}</h1>
          <div className="badge-row">
            <LevelBadge level={course.level} />
            <SideBadge side={course.side} />
            <StyleBadge course={course} />
            {course.eco ? <span className="eco">ECO {course.eco}</span> : null}
          </div>
          <p className="article-lead">{course.summary}</p>
          {course.custom ? <CustomActions course={course} /> : null}
          {course.ideas.length > 0 ? (
            <>
              <h2>Key ideas</h2>
              <ul className="ideas">
                {course.ideas.map((idea, i) => <li key={i}>{idea}</li>)}
              </ul>
            </>
          ) : null}
        </section>

        {a ? (
          <>
            <section id="what-is">
              <h2>What is the {course.title}?</h2>
              <Paragraphs text={a.whatIs} />
            </section>
            {a.howToReach ? (
              <section id="how-to-reach">
                <h2>How to reach it</h2>
                <Paragraphs text={a.howToReach} />
              </section>
            ) : null}
            {a.pros.length || a.cons.length ? (
              <section id="pros-cons">
                <h2>Pros and cons</h2>
                <div className="pros-cons">
                  <div className="pc pc-pros">
                    <h3>Pros</h3>
                    <ul>{a.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
                  </div>
                  <div className="pc pc-cons">
                    <h3>Cons</h3>
                    <ul>{a.cons.map((p, i) => <li key={i}>{p}</li>)}</ul>
                  </div>
                </div>
              </section>
            ) : null}
            {a.variations?.length ? (
              <section id="variations">
                <h2>Main variations</h2>
                {a.variations.map((v, i) => (
                  <Fragment key={i}>
                    <h3>{v.name}</h3>
                    <figure className="pgn-figure">
                      <pre className="pgn" tabIndex={0}><PgnText text={v.pgn} /></pre>
                    </figure>
                    <Paragraphs text={v.text} />
                  </Fragment>
                ))}
              </section>
            ) : null}
            {a.againstIt ? (
              <section id="against">
                <h2>How to play against the {course.title}</h2>
                <Paragraphs text={a.againstIt} />
              </section>
            ) : null}
            {a.plans ? (
              <section id="plans">
                <h2>Plans for both sides</h2>
                <div className="plans">
                  <div className="plan">
                    <h3><span className="side-dot" data-side="white" aria-hidden="true" /> White's plans</h3>
                    <Paragraphs text={a.plans.white} />
                  </div>
                  <div className="plan">
                    <h3><span className="side-dot" data-side="black" aria-hidden="true" /> Black's plans</h3>
                    <Paragraphs text={a.plans.black} />
                  </div>
                </div>
              </section>
            ) : null}
            {a.history ? (
              <section id="history">
                <h2>History</h2>
                <Paragraphs text={a.history} />
              </section>
            ) : null}
          </>
        ) : null}

        <section id="lines" className="lines-section">
          <h2>All lines in this course</h2>
          <p className="muted">
            {course.lines.length} lines
            {progress ? ` · ${progress.learnedCount} of ${trainable} trainable lines learned` : ""}. Trap-to-avoid
            lines are shown in Learn mode only.
          </p>
          <CourtMap course={course} mode={mode} variant="full" />
          <details className="more lines-detail">
            <summary>Every line as a table, with moves and opening names</summary>
            <div className="table-wrap">
              <table className="lines-table">
                <thead>
                  <tr>
                    <th scope="col">Line</th>
                    <th scope="col">Kind</th>
                    <th scope="col" className="col-opening">Opening name</th>
                    <th scope="col" className="col-plies">Plies</th>
                    <th scope="col">Learned</th>
                  </tr>
                </thead>
                <tbody>
                  {course.lines.map((l) => (
                    <tr key={l.id}>
                      <th scope="row">
                        <span className="line-name">{l.name}</span>
                        {l.opening ? <span className="line-opening-sm">{l.opening}</span> : null}
                        <details className="line-pgn">
                          <summary>Moves</summary>
                          <code>{l.pgn}</code>
                        </details>
                      </th>
                      <td><KindBadge kind={l.kind} /></td>
                      <td className="col-opening">{l.opening ?? <span className="muted">-</span>}</td>
                      <td className="col-plies">{l.plies}</td>
                      <td>
                        {l.kind === "warning" ? (
                          <span className="muted" title="Warning lines are not drilled">n/a</span>
                        ) : learned.has(l.id) ? (
                          <span className="learned-yes"><Icon name="check" size={16} /><span className="sr-only">Learned</span></span>
                        ) : (
                          <span className="muted"><span aria-hidden="true">-</span><span className="sr-only">Not yet</span></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        {a?.faq?.length ? (
          <section id="faq">
            <h2>Frequently asked questions</h2>
            <div className="faq">
              {a.faq.map((f, i) => (
                <details key={i}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </div>
  );
}

export default function CoursePage() {
  const { courseId } = useParams();
  const { ready } = useCustomCourses(); // re-renders when custom courses load, change or are deleted
  const course = courseId ? getCourse(courseId) : undefined;
  const [params] = useSearchParams();
  const modeParam = params.get("mode") as Mode | null;
  const initialMode = modeParam && MODES.includes(modeParam) ? modeParam : undefined;
  const initialLine = params.get("line") ?? undefined; // a lane tapped in the "All lines" map starts that exact line

  const faq = course?.article?.faq;
  const jsonLd = useMemo(
    () =>
      faq?.length
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }
        : null,
    [faq],
  );
  useDocumentMeta({
    title: course ? `${course.title}: learn and train` : "Opening not found",
    description: course ? course.summary : "This opening does not exist.",
    jsonLd,
  });

  if (!course) {
    // a custom course may still be loading from IndexedDB: wait for the registry instead of showing a 404
    if (!ready && courseId?.startsWith("custom-")) {
      return <p className="container" style={{ padding: "48px 16px" }} role="status">Loading your course…</p>;
    }
    return <NotFound what="opening" />;
  }

  return (
    <>
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/openings">Openings</Link>
          <Icon name="chevron" size={14} />
          <span aria-current="page">{course.title}</span>
        </nav>
      </div>
      <div className="container player-slot">
        <CoursePlayer key={`${course.id}:${initialMode ?? ""}:${initialLine ?? ""}`} course={course} initialMode={initialMode} initialLine={initialLine} />
      </div>
      <div className="container">
        <CourseArticle course={course} mode={initialMode} />
      </div>
    </>
  );
}
