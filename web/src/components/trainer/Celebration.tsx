import type { ReactNode } from "react";
import { Icon } from "./icons";

const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  delay: ((i * 53) % 100) / 100,
  dur: 1.8 + ((i * 29) % 12) / 10,
  hue: [270, 140, 45, 200, 350][i % 5],
  rot: (i * 47) % 360,
  star: i % 4 === 0,
}));

export interface OverlayProps {
  title: string;
  subtitle?: ReactNode;
  /** "celebrate" adds confetti */
  tone?: "celebrate" | "neutral" | "over";
  /** big streak number with flame, e.g. "1" with label "day streak" */
  streak?: { value: number; label: string; message?: string };
  stats?: { label: string; value: string }[];
  children?: ReactNode;
}

export function Overlay({ title, subtitle, tone = "neutral", streak, stats, children }: OverlayProps) {
  return (
    <div className={`og-overlay og-overlay--${tone}`} role="dialog" aria-modal="false" aria-label={title} data-testid="overlay">
      {tone === "celebrate" && (
        <div className="og-confetti" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className={c.star ? "og-confetti__star" : "og-confetti__bit"}
              style={{
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.dur}s`,
                ["--hue" as string]: c.hue,
                ["--rot" as string]: `${c.rot}deg`,
              }}
            />
          ))}
        </div>
      )}
      <div className="og-overlay__card">
        {streak && (
          <div className="og-streak" data-testid="streak-burst">
            <Icon name="flame" size={36} className="og-streak__flame" />
            <div className="og-streak__num">{streak.value}</div>
            <div className="og-streak__label">{streak.label}</div>
            {streak.message && <div className="og-streak__msg">{streak.message}</div>}
          </div>
        )}
        <h2 className="og-overlay__title">{title}</h2>
        {subtitle && <p className="og-overlay__sub">{subtitle}</p>}
        {stats && (
          <dl className="og-overlay__stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dd>{s.value}</dd>
                <dt>{s.label}</dt>
              </div>
            ))}
          </dl>
        )}
        {children && <div className="og-overlay__actions">{children}</div>}
      </div>
    </div>
  );
}
