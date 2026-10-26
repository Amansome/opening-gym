import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Course, Line, Mode } from "../../lib/types";
import { useCourseProgress } from "./hooks";
import "./courtmap.css";

export type LaneStatus = "learned" | "due" | "new" | "trap";

const STATUS_LABEL: Record<LaneStatus, string> = { learned: "Learned", due: "Due", new: "New", trap: "Trap" };

/** the lane paint, and the same colour as readable text on a table */
const MODE_COLOR: Partial<Record<Mode, [string, string]>> = {
  learn: ["var(--court-blue)", "var(--accent-fg)"],
  practice: ["var(--court-green)", "var(--success-fg)"],
  drill: ["var(--court-red)", "var(--danger-fg)"],
};

/** New lines and traps open in Learn; lines you know open in Practice. */
export function laneTarget(status: LaneStatus): "learn" | "practice" {
  return status === "new" || status === "trap" ? "learn" : "practice";
}

function movesOf(plies: number): string {
  const m = Math.ceil(plies / 2);
  return `${m} ${m === 1 ? "move" : "moves"}`;
}

export interface CourtMapProps {
  course: Course;
  /** the trainer's current mode: learned lanes are painted in its colour */
  mode?: Mode;
  /** "full" is the article section with a key; "picker" is the compact list inside the trainer */
  variant?: "full" | "picker";
  /** picker: called when a lane is chosen (lanes are buttons). Without it, lanes are links to the trainer. */
  onPick?: (line: Line, status: LaneStatus) => void;
  /** picker: the line on the board right now */
  currentLineId?: string;
}

/**
 * The course drawn as a court map: every line is one lane, painted from the baseline for as many moves as the line
 * runs. Learned lanes are solid in the mode colour, due lanes are yellow, new lanes are a faint outline in the Learn blue.
 * Each lane starts that exact line: new ones in Learn, known ones in Practice.
 */
export function CourtMap({ course, mode = "learn", variant = "full", onPick, currentLineId }: CourtMapProps) {
  const progress = useCourseProgress(course);
  const listRef = useRef<HTMLOListElement>(null);
  const picker = variant === "picker";

  const lanes = useMemo(() => {
    const stats = new Map(progress?.lines.map((s) => [s.lineId, s]));
    const now = Date.now();
    return course.lines.map((line) => {
      const s = stats.get(line.id);
      const status: LaneStatus = line.kind === "warning" ? "trap" : s?.learned ? (s.due <= now ? "due" : "learned") : "new";
      return { line, status };
    });
  }, [course, progress]);

  // keep the line on the board in view inside the scrolling list (the page itself stays where it is)
  useEffect(() => {
    const list = listRef.current;
    const cur = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !cur || list.scrollHeight <= list.clientHeight) return;
    const top = cur.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + cur.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = Math.max(0, top - 6);
    }
  }, [currentLineId, lanes]);

  const maxPlies = Math.max(1, ...course.lines.map((l) => l.plies));
  const trainable = course.lines.filter((l) => l.kind !== "warning").length;
  const learnedCount = progress?.learnedCount ?? 0;
  const dueCount = lanes.filter((l) => l.status === "due").length;
  const base = `/opening/${course.id}`;
  const headId = `cm-title-${course.id}-${variant}`;
  const [laneColor, laneFg] = MODE_COLOR[mode] ?? MODE_COLOR.learn!;

  const summary = (
    <p className="cm-summary">
      <strong>{learnedCount}</strong> of {trainable} lines learned
      {dueCount > 0 ? <> · <strong className="cm-due-count">{dueCount} due</strong></> : null}
    </p>
  );

  return (
    <div
      className={`cm cm--${variant}`}
      style={{ ["--lane" as string]: laneColor, ["--lane-fg" as string]: laneFg } as CSSProperties}
      role={picker ? "group" : undefined}
      aria-labelledby={picker ? headId : undefined}
    >
      <div className="cm-head">
        {picker ? (
          <>
            <p className="cm-title" id={headId}>Pick a line</p>
            {summary}
          </>
        ) : (
          <>
            {summary}
            <ul className="cm-legend" aria-label="Key">
              <li><span className="cm-swatch" data-status="learned" aria-hidden="true" />Learned</li>
              <li><span className="cm-swatch" data-status="due" aria-hidden="true" />Due for review</li>
              <li><span className="cm-swatch" data-status="new" aria-hidden="true" />New</li>
              <li><span className="cm-swatch" data-status="trap" aria-hidden="true" />Trap to avoid</li>
            </ul>
          </>
        )}
      </div>
      <ol className="cm-lanes" ref={listRef} aria-label={`Lines in ${course.title}`}>
        {lanes.map(({ line, status }) => {
          const target = laneTarget(status);
          const style = { ["--end" as string]: (line.plies / maxPlies) * 100 } as CSSProperties;
          const current = picker && line.id === currentLineId;
          const title = `${line.name}${line.opening ? ` (${line.opening})` : ""}: ${target === "learn" ? "learn this line" : "practise this line"}`;
          const inner = (
            <>
              <span className="cm-name">{line.name}</span>
              <span className="cm-meta">
                <span className="cm-status" data-status={status}>{STATUS_LABEL[status]}</span>
                <span>{movesOf(line.plies)}</span>
                {line.kind === "alternative" ? <span>Alternative</span> : null}
              </span>
              <span className="cm-track" aria-hidden="true">
                <span className="cm-run" />
              </span>
              <span className="sr-only">
                {current ? ". On the board now" : ""}
                {status === "trap"
                  ? ". A mistake to recognise; opens in Learn."
                  : status === "new"
                    ? ". Not learned yet. Starts in Learn."
                    : status === "due"
                      ? ". Learned and due for review. Starts in Practice."
                      : ". Learned. Starts in Practice."}
              </span>
            </>
          );
          return (
            <li key={line.id} className="cm-lane" data-status={status} style={style}>
              {onPick ? (
                <button type="button" className="cm-link" title={title} aria-current={current ? "true" : undefined} onClick={() => onPick(line, status)}>
                  {inner}
                </button>
              ) : (
                <Link to={`${base}?mode=${target}&line=${encodeURIComponent(line.id)}`} className="cm-link" title={title}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      {picker ? null : (
        <p className="cm-foot">
          One lane for each line; the longer the painted lane, the more moves it runs. Tap a lane to train that line:
          new lines open in Learn, lines you know open in Practice.
        </p>
      )}
    </div>
  );
}
