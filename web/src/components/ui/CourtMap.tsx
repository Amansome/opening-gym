import { useMemo } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Course, Line, Mode } from "../../lib/types";
import { useCourseProgress } from "./hooks";

type Status = "learned" | "due" | "new" | "trap";

const STATUS_LABEL: Record<Status, string> = { learned: "Learned", due: "Due", new: "New", trap: "Trap" };

const MODE_COLOR: Partial<Record<Mode, string>> = {
  learn: "var(--court-blue)",
  practice: "var(--court-green)",
  drill: "var(--court-red)",
};

interface Lane {
  line: Line;
  status: Status;
  /** plies shared with the closest earlier lane: where this lane branches off its parent */
  fork: number;
  /** how many rows up the parent lane sits (0 = starts at the baseline) */
  span: number;
}

/** Longest shared opening of two lines, in plies. */
function sharedPlies(a: string[], b: string[]): number {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n;
}

/** Each line branches off the earlier line it shares the most moves with (the course's move tree, drawn flat). */
function layout(lines: Line[]): { fork: number; span: number }[] {
  return lines.map((l, i) => {
    let best = 0;
    let parent = -1;
    for (let j = 0; j < i; j++) {
      const n = sharedPlies(lines[j].sans, l.sans);
      if (n > best) {
        best = n;
        parent = j;
      }
    }
    return { fork: best, span: parent < 0 ? 0 : i - parent };
  });
}

function movesOf(plies: number): string {
  const m = Math.ceil(plies / 2);
  return `${m} ${m === 1 ? "move" : "moves"}`;
}

/**
 * The course drawn as a court map. Every line is a lane that runs from the baseline; lanes that share an opening
 * run together as a thin chalk line and branch where the moves differ. Learned lanes are painted solid in the mode
 * colour, due lanes in yellow, new lanes are chalk outlines. Each lane links to the trainer in the mode that fits it.
 */
export function CourtMap({ course, mode = "learn" }: { course: Course; mode?: Mode }) {
  const progress = useCourseProgress(course);
  const lanes = useMemo<Lane[]>(() => {
    const geo = layout(course.lines);
    return course.lines.map((line, i) => ({ line, status: "new" as Status, ...geo[i] }));
  }, [course]);

  const now = Date.now();
  const stats = new Map(progress?.lines.map((s) => [s.lineId, s]));
  const withStatus = lanes.map((l) => {
    const s = stats.get(l.line.id);
    const status: Status = l.line.kind === "warning" ? "trap" : s?.learned ? (s.due <= now ? "due" : "learned") : "new";
    return { ...l, status };
  });

  const maxPlies = Math.max(1, ...course.lines.map((l) => l.plies));
  const trainable = course.lines.filter((l) => l.kind !== "warning").length;
  const learnedCount = progress?.learnedCount ?? 0;
  const dueCount = withStatus.filter((l) => l.status === "due").length;
  const laneColor = MODE_COLOR[mode] ?? "var(--court-blue)";
  const base = `/opening/${course.id}`;

  return (
    <div className="cm" style={{ ["--lane" as string]: laneColor } as CSSProperties}>
      <div className="cm-head">
        <p className="cm-summary">
          <strong>{learnedCount}</strong> of {trainable} trainable lines learned
          {dueCount > 0 ? <> · <strong className="cm-due-count">{dueCount} due</strong></> : null}
        </p>
        <ul className="cm-legend" aria-label="Key">
          <li><span className="cm-swatch" data-status="learned" aria-hidden="true" />Learned</li>
          <li><span className="cm-swatch" data-status="due" aria-hidden="true" />Due for review</li>
          <li><span className="cm-swatch" data-status="new" aria-hidden="true" />New</li>
          <li><span className="cm-swatch" data-status="trap" aria-hidden="true" />Trap to avoid</li>
        </ul>
      </div>
      <ol className="cm-lanes" aria-label={`Lines in ${course.title}`}>
        {withStatus.map(({ line, status, fork, span }) => {
          const forkPct = (fork / maxPlies) * 100;
          const endPct = (line.plies / maxPlies) * 100;
          const target = status === "new" || status === "trap" ? "learn" : "practice";
          const style = {
            ["--fork" as string]: forkPct,
            ["--end" as string]: endPct,
            ["--span" as string]: span,
          } as CSSProperties;
          return (
            <li key={line.id} className="cm-lane" data-status={status} style={style}>
              <Link
                to={`${base}?mode=${target}`}
                className="cm-link"
                title={`${line.name}${line.opening ? ` (${line.opening})` : ""}: open in ${target === "learn" ? "Learn" : "Practice"}`}
              >
                <span className="cm-label">
                  <span className="cm-name">{line.name}</span>
                  <span className="cm-sub">
                    <span className="cm-status" data-status={status}>{STATUS_LABEL[status]}</span>
                    <span>{movesOf(line.plies)}</span>
                    {line.kind === "alternative" ? <span>Alternative</span> : null}
                  </span>
                  <span className="sr-only">
                    {status === "trap"
                      ? ". A mistake to recognise; shown in Learn mode only."
                      : status === "new"
                        ? ". Not learned yet. Opens Learn."
                        : status === "due"
                          ? ". Learned and due for review. Opens Practice."
                          : ". Learned. Opens Practice."}
                  </span>
                </span>
                <span className="cm-track" aria-hidden="true">
                  {span > 0 ? <span className="cm-join" /> : null}
                  {fork > 0 ? <span className="cm-trunk" /> : null}
                  <span className="cm-run" />
                  <span className="cm-node" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="cm-foot">
        Lanes that start together share their first moves. Tap a lane to train it: new lines open in Learn, lines
        you know open in Practice.
      </p>
    </div>
  );
}
