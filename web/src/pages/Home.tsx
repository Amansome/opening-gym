import { Link } from "react-router-dom";
import { QuickPicks } from "../components/ui/QuickPicks";
import { APP_NAME, TAGLINE, SITE_DESCRIPTION } from "../config";
import { CourseCard } from "../components/ui/CourseCard";
import { LinkButton } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import type { IconName } from "../components/ui/Icon";
import { MiniBoard, thumbnailFen } from "../components/ui/MiniBoard";
import { useCourseProgressMap, useDocumentMeta, useStartedCourses } from "../components/ui/hooks";
import { courses, getCourse } from "../lib/courses";
import { MODES } from "./modes";

const LEVEL_ORDER = { beginner: 0, intermediate: 1, advanced: 2 } as const;

const WHY: { icon: IconName; title: string; text: string }[] = [
  { icon: "heart", title: "Free, for good", text: "No trial, no paywall, no premium tier. Every course and every mode is open to everyone." },
  { icon: "code", title: "Open source", text: "The code and the course content are public. Read them, fix a note, or add a course of your own." },
  { icon: "offline", title: "Works offline", text: "Once loaded, the whole trainer runs in your browser. Drill on a train or a plane." },
  { icon: "shield", title: "Your data stays with you", text: "No account and no analytics. Progress is stored on your device, with a JSON backup you can export any time." },
];

export default function Home() {
  useDocumentMeta({ description: SITE_DESCRIPTION });
  const started = useStartedCourses();
  const progressMap = useCourseProgressMap(courses);
  const hasStarted = !!started && started.length > 0;
  const featured = [...courses]
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || (a.side === "both" ? 1 : 0) - (b.side === "both" ? 1 : 0))
    .slice(0, 9);
  const totalLines = courses.reduce((n, c) => n + c.lines.length, 0);
  const heroCourse = getCourse("italian-game") ?? courses[0];
  const [first, ...rest] = TAGLINE.split(/(?<=\.)\s+/);
  const continueId = started?.[0];

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Free chess opening trainer</p>
            <h1 className="hero-title">
              {first} <span className="hero-accent">{rest.join(" ")}</span>
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
            <ul className="hero-stats" aria-label="Catalogue size">
              <li><strong>{courses.length}</strong> openings</li>
              <li><strong>{totalLines}</strong> lines</li>
              <li><strong>5</strong> training modes</li>
            </ul>
          </div>
          {heroCourse ? (
            <div className="hero-visual" aria-hidden="true">
              <MiniBoard fen={thumbnailFen(heroCourse)} className="hero-board" />
              <div className="hero-bubble">
                <span className="hero-bubble-name">Coach</span>
                <p>Bishop to c4. It eyes f7, the weakest square in Black's camp, and gets ready for castling.</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <div className="section container">
        <QuickPicks headingId="picks-h" />
      </div>

      <section className="section container" aria-labelledby="courses-h">
        <div className="section-head">
          <h2 id="courses-h" className="section-title">Start with an opening</h2>
          <Link to="/openings" className="section-link">
            See all {courses.length} openings <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="card-grid">
          {featured.map((c) => (
            <CourseCard key={c.id} course={c} progress={progressMap[c.id]} />
          ))}
        </div>
      </section>

      <section className="section container" aria-labelledby="how-h">
        <h2 id="how-h" className="section-title">How it works</h2>
        <p className="section-lead">
          Five modes, each one a step up. New modes unlock as you learn lines, so there is always a next thing to do.
        </p>
        <ol className="steps">
          {MODES.map((m, i) => (
            <li key={m.key} className="step" style={{ ["--mode" as string]: m.color }}>
              <span className="step-icon"><Icon name={m.icon} size={22} /></span>
              <span className="step-num">Step {i + 1}</span>
              <h3>{m.name}</h3>
              <p>{m.blurb}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section container" aria-labelledby="why-h">
        <h2 id="why-h" className="section-title">Built to be yours</h2>
        <div className="why-grid">
          {WHY.map((w) => (
            <div key={w.title} className="why-card">
              <span className="why-icon"><Icon name={w.icon} size={22} /></span>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
