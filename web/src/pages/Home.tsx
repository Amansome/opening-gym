import { Link } from "react-router-dom";
import { QuickPicks } from "../components/ui/QuickPicks";
import { TAGLINE, SITE_DESCRIPTION, APP_NAME } from "../config";
import { CourseCard, RosterHead } from "../components/ui/CourseCard";
import { LinkButton } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { LineDemo } from "../components/ui/LineDemo";
import { useCourseProgressMap, useDocumentMeta, useStartedCourses } from "../components/ui/hooks";
import { courses } from "../lib/courses";
import { MODES } from "./modes";

const LEVEL_ORDER = { beginner: 0, intermediate: 1, advanced: 2 } as const;

const PROMISES: { title: string; text: string }[] = [
  { title: "Free, for good", text: "No trial, no paywall, no premium tier. Every course and every mode is open to everyone." },
  { title: "No account", text: "Nothing to sign up for. Progress is stored on your device, with a JSON backup you can export any time." },
  { title: "Works offline", text: "Once loaded, the whole trainer runs in your browser. Drill on a train or a plane." },
  { title: "Open source", text: "The code and the course content are public. Read them, fix a note, or add a course of your own." },
];

export default function Home() {
  useDocumentMeta({ description: SITE_DESCRIPTION });
  const started = useStartedCourses();
  const progressMap = useCourseProgressMap(courses);
  const hasStarted = !!started && started.length > 0;
  const featured = [...courses]
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || (a.side === "both" ? 1 : 0) - (b.side === "both" ? 1 : 0))
    .slice(0, 6);
  const totalLines = courses.reduce((n, c) => n + c.lines.length, 0);
  const [first, ...rest] = TAGLINE.split(/(?<=\.)\s+/);
  const continueId = started?.[0];

  return (
    <>
      <section className="hero">
        <svg className="hero-court" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
          <circle cx="300" cy="300" r="170" />
          <path d="M300 0v600M0 300h130M470 300h130" />
        </svg>
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title">
              <span className="hero-line">{first}</span>
              <span className="hero-line hero-mark">{rest.join(" ")}</span>
            </h1>
            <p className="hero-lead">
              {APP_NAME} teaches you the real lines move by move, explains the idea behind every one, then drills
              them with spaced repetition until they are automatic.
            </p>
            <div className="hero-cta">
              <LinkButton to="/openings" variant="primary" size="lg">
                Pick an opening <Icon name="arrow" size={18} />
              </LinkButton>
              {hasStarted && continueId ? (
                <LinkButton to={started.length > 1 ? "/dojo" : `/opening/${continueId}`} size="lg">
                  Continue training
                </LinkButton>
              ) : null}
            </div>
            <p className="hero-facts">
              {courses.length} openings and {totalLines} lines, each one explained. Free, no account, works offline.
            </p>
          </div>
          <LineDemo />
        </div>
      </section>

      <section className="section container" aria-labelledby="how-h">
        <h2 id="how-h" className="section-title">How it works</h2>
        <p className="section-lead">
          Five modes, each one painted in its own court line. New modes unlock as you learn lines, so there is always
          a next thing to do.
        </p>
        <ol className="lanes">
          {MODES.map((m) => (
            <li key={m.key} className="lane" style={{ ["--mode" as string]: m.color }}>
              <h3>{m.name}</h3>
              <p>{m.blurb}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section container" aria-labelledby="courses-h">
        <div className="section-head">
          <h2 id="courses-h" className="section-title">Start with an opening</h2>
          <Link to="/openings" className="section-link">
            See all {courses.length} openings <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="picks-layout">
          <div className="roster-group">
            <RosterHead />
            <div className="card-grid">
              {featured.map((c) => (
                <CourseCard key={c.id} course={c} progress={progressMap[c.id]} />
              ))}
            </div>
          </div>
          <QuickPicks headingId="picks-h" />
        </div>
      </section>

      <section className="close" aria-labelledby="close-h">
        <div className="container on-blue">
          <h2 id="close-h">Free. No account. Works offline.</h2>
          <dl className="promises">
            {PROMISES.map((p) => (
              <div key={p.title} className="promise">
                <dt>{p.title}</dt>
                <dd>{p.text}</dd>
              </div>
            ))}
          </dl>
          <LinkButton to="/openings" variant="primary" size="lg" className="close-cta">
            Pick an opening <Icon name="arrow" size={18} />
          </LinkButton>
        </div>
      </section>
    </>
  );
}
