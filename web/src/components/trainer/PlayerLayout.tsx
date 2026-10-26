import type { ReactNode } from "react";

export interface PlayerLayoutProps {
  mode: string;
  /** exposed as data attributes for tests and debugging */
  lineKey?: { course: string; line: string };
  /** the mode tab strip */
  tabs?: ReactNode;
  /** the scoreboard: course title, line counter, streak */
  scoreboard: ReactNode;
  /** the painted progress line */
  bar: ReactNode;
  /** the coach's note */
  coach: ReactNode;
  board: ReactNode;
  /** slim eval bar (rendered beside the board on desktop, above it on mobile) */
  evalBar?: ReactNode;
  overlay?: ReactNode;
  controls: ReactNode;
  /** the lane picker, under the control row on desktop and under the note on a phone */
  lanes?: ReactNode;
}

/**
 * Desktop: the board on the left, a folding table on the right holding tabs, scoreboard, progress line, note, controls.
 * Under the control row the lane picker fills what is left of the table's height and scrolls inside it.
 * Mobile (<820px): the table dissolves (display: contents) and the pieces stack:
 * tabs + scoreboard + progress, eval bar + board, note, lane picker, action bar.
 */
export function PlayerLayout({ mode, lineKey, tabs, scoreboard, bar, coach, board, evalBar, overlay, controls, lanes }: PlayerLayoutProps) {
  return (
    <div className="og-player" data-mode={mode} data-course-id={lineKey?.course} data-line-id={lineKey?.line}>
      <div className="og-player__stage">
        {evalBar}
        <div className="og-player__board">
          {board}
          {overlay}
        </div>
      </div>
      <div className="og-player__panel">
        <div className="og-player__top">
          {tabs}
          <div className="og-player__score">{scoreboard}</div>
          <div className="og-player__bar">{bar}</div>
        </div>
        <div className="og-player__coach">{coach}</div>
        <div className="og-player__controls">{controls}</div>
        {lanes ? <div className="og-player__lanes">{lanes}</div> : null}
      </div>
    </div>
  );
}
