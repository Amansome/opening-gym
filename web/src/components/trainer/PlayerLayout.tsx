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
}

/**
 * Desktop: the board on the left, a folding table on the right holding tabs, scoreboard, progress line, note, controls.
 * Mobile (<820px): the table dissolves (display: contents) and the pieces stack:
 * tabs + scoreboard + progress, eval bar + board, note, action bar.
 */
export function PlayerLayout({ mode, lineKey, tabs, scoreboard, bar, coach, board, evalBar, overlay, controls }: PlayerLayoutProps) {
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
      </div>
    </div>
  );
}
