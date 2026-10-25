import type { ReactNode } from "react";

export interface PlayerLayoutProps {
  mode: string;
  /** exposed as data attributes for tests and debugging */
  lineKey?: { course: string; line: string };
  header: ReactNode;
  bar: ReactNode;
  coach: ReactNode;
  board: ReactNode;
  overlay?: ReactNode;
  controls: ReactNode;
  tiles?: ReactNode;
}

/**
 * Desktop: board left, panel right (card).
 * Mobile (<820px): the panel dissolves (display: contents) and the pieces stack:
 * header, progress, coach bubble, board, mode tiles, action bar.
 */
export function PlayerLayout({ mode, lineKey, header, bar, coach, board, overlay, controls, tiles }: PlayerLayoutProps) {
  return (
    <div className="og-player" data-mode={mode} data-course-id={lineKey?.course} data-line-id={lineKey?.line}>
      <div className="og-player__board">
        {board}
        {overlay}
      </div>
      <div className="og-player__panel">
        <div className="og-player__head">{header}</div>
        <div className="og-player__bar">{bar}</div>
        <div className="og-player__coach">{coach}</div>
        {tiles && <div className="og-player__tiles">{tiles}</div>}
        <div className="og-player__controls">{controls}</div>
      </div>
    </div>
  );
}
