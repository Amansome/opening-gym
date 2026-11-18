import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { LinkButton } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useCourseProgressMap, useDocumentMeta } from "../components/ui/hooks";
import { getCourse } from "../lib/courses";
import type { CourseProgress } from "../lib/progress";
import "./start.css";

/** One course on the path, with the label shown in the step and a plain "pick this if" line when it is a choice. */
interface Opt {
  id: string;
  name: string;
  pick?: string;
}

interface Step {
  key: string;
  title: string;
  text: string;
  opts: Opt[];
  /** Only the last step has no course to finish: it is a set of daily habits. */
  habits?: boolean;
}

const STEPS: Step[] = [
  {
    key: "principles",
    title: "Opening principles",
    text: "Six short lines, each one habit that every good opening is built on. Learn these first and every opening after them makes sense.",
    opts: [{ id: "opening-principles", name: "Opening principles" }],
  },
  {
    key: "white",
    title: "Your first White opening",
    text: "Choose one and stay with it. Both are sound, and neither needs a lot of theory.",
    opts: [
      { id: "london-system", name: "London System", pick: "you want one setup you can play against almost anything, with the least to memorise." },
      { id: "italian-game", name: "Italian Game", pick: "you like open games where your pieces come out fast and your bishop eyes f7." },
    ],
  },
  {
    key: "e4",
    title: "An answer to 1.e4",
    text: "When White opens with the king's pawn, you need a reply you trust. Three good ones to choose from.",
    opts: [
      { id: "caro-kann", name: "Caro-Kann Defence", pick: "you want a solid position that is hard to crack, even if it is a little slower." },
      { id: "black-vs-e4-e5", name: "1...e5 (Open Games)", pick: "you want the classic fight with open lines and tactics, and do not mind learning more." },
      { id: "scandinavian", name: "Scandinavian Defence", pick: "you want the least theory. The queen comes out early here, the one principle it bends." },
    ],
  },
  {
    key: "d4",
    title: "An answer to 1.d4",
    text: "Black meets the queen's pawn with ...d5 and ...e6: a sturdy set-up that works against most White tries.",
    opts: [{ id: "queens-gambit-declined-black", name: "Queen's Gambit Declined" }],
  },
  {
    key: "traps",
    title: "Traps every player should know",
    text: "Short, memorable tricks. Learn them to spring them, and to stop yourself walking into them.",
    opts: [{ id: "opening-traps", name: "Opening traps" }],
  },
  {
    key: "habits",
    title: "Make it stick",
    text: "Openings fade unless you use them. Three habits keep them fresh.",
    opts: [],
    habits: true,
  },
];

const HABITS = [
  { to: "/dojo", name: "Daily Dojo", text: "One mixed session from every course you have started. Five minutes is enough." },
  { to: "/puzzles", name: "Puzzles", text: "Tactics from your own openings, so you can spot the shot when it comes." },
  { to: "/play", name: "Play it out", text: "Take your opening into a real game and see what happens after the book ends." },
];

interface Stat {
  learned: number;
  total: number;
  started: boolean;
  done: boolean;
}

function statOf(p: CourseProgress | undefined, id: string): Stat {
  const total = p?.totalLines ?? getCourse(id)?.lines.filter((l) => l.kind !== "warning").length ?? 0;
  const learned = p?.learnedCount ?? 0;
  return { learned, total, started: learned > 0, done: total > 0 && learned >= total };
}

/* ---------- The picker ---------- */

type Feel = "sharp" | "calm";
type Move = "e4" | "d4" | "unsure";
type Memo = "little" | "more";

interface Answers {
  feel?: Feel;
  move?: Move;
  memo?: Memo;
}

interface Pick {
  id: string;
  name: string;
  why: string;
}

function recommend(a: Required<Answers>): { white: Pick; black: Pick } {
  let white: Pick;
  if (a.move === "d4") {
    white = { id: "london-system", name: "London System", why: "It starts with 1.d4, and you play the same set-up against almost every reply." };
  } else if (a.move === "e4") {
    white = { id: "italian-game", name: "Italian Game", why: "It starts with 1.e4, and the plan is easy to follow: develop, castle, aim at f7." };
  } else if (a.memo === "little" || a.feel === "calm") {
    white = { id: "london-system", name: "London System", why: "It is one set-up you play against nearly everything, so there is less to remember." };
  } else {
    white = { id: "italian-game", name: "Italian Game", why: "It gives you open positions with real chances to attack, and the ideas are simple." };
  }

  let black: Pick;
  if (a.feel === "sharp" && a.memo === "more") {
    black = { id: "black-vs-e4-e5", name: "1...e5 (Open Games)", why: "It leads to open, tactical games, and it is the opening most of chess is built on." };
  } else if (a.feel === "sharp") {
    black = { id: "scandinavian", name: "Scandinavian Defence", why: "It is direct and needs very little theory. Your queen comes out early, so keep an eye on her." };
  } else {
    black = { id: "caro-kann", name: "Caro-Kann Defence", why: "It gives you a solid pawn structure and a bishop that is not locked in, with few traps to fall for." };
  }
  return { white, black };
}

const QUESTIONS: { key: keyof Answers; legend: string; options: { value: string; label: string }[] }[] = [
  {
    key: "feel",
    legend: "Do you like sharp attacks or calm, solid games?",
    options: [
      { value: "sharp", label: "Sharp attacks" },
      { value: "calm", label: "Calm and solid" },
    ],
  },
  {
    key: "move",
    legend: "Do you open 1.e4 or 1.d4?",
    options: [
      { value: "e4", label: "1.e4" },
      { value: "d4", label: "1.d4" },
      { value: "unsure", label: "Not sure yet" },
    ],
  },
  {
    key: "memo",
    legend: "How much do you want to memorise?",
    options: [
      { value: "little", label: "As little as possible" },
      { value: "more", label: "I don't mind learning more" },
    ],
  },
];

function Picker({ onPick }: { onPick: (ids: string[]) => void }) {
  const [answers, setAnswers] = useState<Answers>({});
  const complete = answers.feel && answers.move && answers.memo;
  const result = complete ? recommend(answers as Required<Answers>) : null;

  function answer(key: keyof Answers, value: string) {
    const next = { ...answers, [key]: value } as Answers;
    setAnswers(next);
    if (next.feel && next.move && next.memo) {
      const r = recommend(next as Required<Answers>);
      onPick([r.white.id, r.black.id]);
    }
  }

  function reset() {
    setAnswers({});
    onPick([]);
  }

  return (
    <section id="picker" className="panel picker" aria-labelledby="picker-h">
      <h2 id="picker-h" className="panel-title">Which opening suits me?</h2>
      <p className="muted picker-lead">Three questions. Your answers stay on this page and are not saved.</p>
      {QUESTIONS.map((q) => (
        <fieldset key={q.key} className="picker-q">
          <legend>{q.legend}</legend>
          <div className="picker-opts">
            {q.options.map((o) => (
              <button
                key={o.value}
                type="button"
                className="picker-btn"
                aria-pressed={answers[q.key] === o.value}
                onClick={() => answer(q.key, o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <div className="picker-result" aria-live="polite">
        {result ? (
          <>
            <h3>Try these</h3>
            <p>
              <strong>As White: {result.white.name}.</strong> {result.white.why}{" "}
              <Link to={`/opening/${result.white.id}`}>See the course</Link>
            </p>
            <p>
              <strong>Against 1.e4: {result.black.name}.</strong> {result.black.why}{" "}
              <Link to={`/opening/${result.black.id}`}>See the course</Link>
            </p>
            <p className="muted">Honest note: any of the choices on the path is good enough. The best opening is the one you will play.</p>
            <button type="button" className="link-btn" onClick={reset}>Start over</button>
          </>
        ) : (
          <p className="muted">Answer all three to get a recommendation.</p>
        )}
      </div>
    </section>
  );
}

/* ---------- The path ---------- */

function actionLabel(s: Stat): string {
  if (s.done) return "Review";
  return s.started ? "Continue" : "Start";
}

export default function StartHere() {
  useDocumentMeta({
    title: "Start here",
    description:
      "A guided path for beginners: learn the opening principles first, then one opening to play as White, an answer to 1.e4, an answer to 1.d4 and the traps every player should know.",
  });
  const ids = STEPS.flatMap((s) => s.opts.map((o) => o.id));
  const list = ids.map((id) => getCourse(id)).filter((c): c is NonNullable<typeof c> => !!c);
  const map = useCourseProgressMap(list);
  const ready = Object.keys(map).length > 0;
  const [picked, setPicked] = useState<string[]>([]);

  const stats = (step: Step): { opt: Opt; stat: Stat }[] => step.opts.map((opt) => ({ opt, stat: statOf(map[opt.id], opt.id) }));
  const courseSteps = STEPS.filter((s) => !s.habits);
  const doneStep = (s: Step) => stats(s).some((x) => x.stat.done);
  const nextKey = ready ? (courseSteps.find((s) => !doneStep(s))?.key ?? "habits") : undefined;
  const doneCount = ready ? courseSteps.filter(doneStep).length : 0;

  return (
    <div className="container start">
      <header className="page-head">
        <h1>Start here</h1>
        <p className="page-lead">
          New to openings? Follow this path. Principles first, then one opening for each job, in an order that builds
          on itself. Each step has one thing to do next.
        </p>
        {ready ? (
          <p className="page-meta">
            {doneCount === courseSteps.length
              ? "All five steps done. Keep them fresh with step 6."
              : `${doneCount} of ${courseSteps.length} steps done`}
          </p>
        ) : null}
      </header>

      <div className="start-grid">
        <ol className="path" aria-label="Learning path">
          {STEPS.map((step, i) => {
            const rows = stats(step);
            const done = !step.habits && ready && rows.some((r) => r.stat.done);
            const next = nextKey === step.key;
            const state = next ? "next" : done ? "done" : "todo";
            const choice = step.opts.length > 1;
            // Rows to show: a finished choice step only keeps the option that was finished.
            const shown = done && choice ? rows.filter((r) => r.stat.done) : rows;
            // The one primary action on the page: the option already started, else the picker's pick, else the first.
            let primaryId: string | undefined;
            if (next && !step.habits) {
              const started = [...rows].sort((a, b) => b.stat.learned - a.stat.learned).find((r) => r.stat.started);
              primaryId = started?.opt.id ?? rows.find((r) => picked.includes(r.opt.id))?.opt.id ?? rows[0].opt.id;
            }
            return (
              <li key={step.key} className="step" data-state={state} aria-current={next ? "step" : undefined}>
                <div className="step-num" aria-hidden="true">
                  {done ? <Icon name="check" size={22} /> : i + 1}
                </div>
                <div className="step-body">
                  <div className="step-head">
                    <h2 className="step-title">
                      <span className="sr-only">Step {i + 1}: </span>
                      {step.title}
                    </h2>
                    {next ? <span className="step-flag">Do this next</span> : null}
                    {done ? <span className="step-flag" data-tone="done">Done</span> : null}
                  </div>
                  {!done || next ? <p className="step-text">{step.text}</p> : null}

                  {step.habits ? (
                    <ul className="opts">
                      {HABITS.map((h, hi) => (
                        <li key={h.to} className="opt">
                          <div className="opt-main">
                            <p className="opt-name">{h.name}</p>
                            <p className="opt-text">{h.text}</p>
                          </div>
                          <div className="opt-side">
                            <LinkButton to={h.to} variant={next && hi === 0 ? "primary" : "secondary"} size="sm">
                              Open
                            </LinkButton>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="opts">
                      {shown.map(({ opt, stat }) => {
                        const isPick = picked.includes(opt.id) && choice && !stat.started;
                        const primary = primaryId === opt.id;
                        return (
                          <li key={opt.id} className="opt">
                            <div className="opt-main">
                              <p className="opt-name">
                                <Link to={`/opening/${opt.id}`}>{opt.name}</Link>
                                {isPick ? <Badge tone="main">Picked for you</Badge> : null}
                              </p>
                              {opt.pick ? <p className="opt-text">Pick this if {opt.pick}</p> : null}
                              {stat.started ? (
                                <ProgressBar
                                  value={stat.learned}
                                  max={stat.total}
                                  label={`${opt.name}: ${stat.learned} of ${stat.total} lines learned`}
                                  color={stat.done ? "var(--court-green)" : undefined}
                                />
                              ) : null}
                              <p className="opt-status" data-done={stat.done || undefined}>
                                {stat.done
                                  ? `Learned: all ${stat.total} lines`
                                  : stat.started
                                    ? `${stat.learned} of ${stat.total} lines learned`
                                    : `${stat.total} lines to learn`}
                              </p>
                            </div>
                            {(next || done || stat.started || choice) && (
                              <div className="opt-side">
                                <LinkButton
                                  to={`/opening/${opt.id}`}
                                  variant={primary ? "primary" : "secondary"}
                                  size={primary ? "md" : "sm"}
                                >
                                  {actionLabel(stat)}
                                  {primary ? <Icon name="arrow" size={16} /> : null}
                                </LinkButton>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {step.key === "principles" && (next || state === "todo") ? (
                    <p className="step-extra">
                      Want the Black view too? <Link to="/opening/opening-principles-black">Opening principles for Black</Link>{" "}
                      has five short lines on the same habits.
                    </p>
                  ) : null}
                  {choice && next && picked.length === 0 ? (
                    <p className="step-extra">
                      Not sure which? <a href="#picker">Answer three questions</a> and we will point you to one.
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        <aside className="start-aside">
          <Picker onPick={setPicked} />
        </aside>
      </div>
    </div>
  );
}
