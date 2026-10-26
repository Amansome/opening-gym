import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./icons";

export interface OverlayProps {
  title: string;
  subtitle?: ReactNode;
  /** "celebrate" and "over" paint the court line and flip the scoreboard; "neutral" is a plain card (e.g. the Time start screen) */
  tone?: "celebrate" | "neutral" | "over";
  /** day streak, e.g. value 1 with label "day streak" */
  streak?: { value: number; label: string; message?: string };
  /** the final score of a run, set large on the scoreboard */
  score?: { value: string | number; label: string };
  stats?: { label: string; value: string }[];
  children?: ReactNode;
}

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * End-of-line / end-of-run panel laid over the board. The one authored motion moment of the trainer: a court line is
 * painted across the top of the card and the scoreboard numerals flip into place behind it, one after another.
 * With reduced motion everything simply appears.
 */
export function Overlay({ title, subtitle, tone = "neutral", streak, score, stats, children }: OverlayProps) {
  const hasBoard = !!streak || !!score || (stats && stats.length > 0);
  let n = 0;
  return (
    <div className={`og-overlay og-overlay--${tone}`} role="dialog" aria-modal="false" aria-label={title} data-testid="overlay">
      <div className="og-overlay__card">
        <div className="og-overlay__paint" aria-hidden="true" />
        <h2 className="og-overlay__title">{title}</h2>
        {subtitle && <p className="og-overlay__sub">{subtitle}</p>}
        {hasBoard && (
          <div className="og-housing">
            {streak && (
              <div className="og-housing__streak" data-testid="streak-burst">
                <Icon name="flame" size={26} className="og-housing__flame" />
                <span className="og-housing__big og-flip" style={idx(n++)}>
                  {streak.value}
                </span>
                <span className="og-housing__label">{streak.label}</span>
                {streak.message && <span className="og-housing__msg">{streak.message}</span>}
              </div>
            )}
            {score && (
              <div className="og-housing__score" data-testid="final-score">
                <span className="og-housing__big og-housing__big--score og-flip" style={idx(n++)}>
                  {score.value}
                </span>
                <span className="og-housing__label">{score.label}</span>
              </div>
            )}
            {stats && stats.length > 0 && (
              <dl className="og-housing__stats">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dd className="og-flip" style={idx(n++)}>
                      {s.value}
                    </dd>
                    <dt>{s.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}
        {children && <div className="og-overlay__actions">{children}</div>}
      </div>
    </div>
  );
}
