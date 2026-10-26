import type { CSSProperties } from "react";

interface Props {
  value: number;
  max: number;
  label: string;
  /** How many of the `value` lines are due for review: painted yellow at the end of the lane. */
  due?: number;
  /** CSS colour for the painted lane (defaults to court blue). */
  color?: string;
}

/** A painted court lane that fills as you learn: solid for learned lines, yellow for lines that are due. */
export function ProgressBar({ value, max, label, due = 0, color }: Props) {
  const pct = (n: number) => (max > 0 ? Math.min(100, (n / max) * 100) : 0);
  const dueN = Math.min(Math.max(due, 0), value);
  const steady = pct(value - dueN);
  const dueW = pct(dueN);
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      style={color ? ({ ["--lane" as string]: color } as CSSProperties) : undefined}
    >
      <div className="progress-bar-fill" style={{ width: `${steady}%` }} />
      {dueW > 0 ? <div className="progress-bar-due" style={{ left: `${steady}%`, width: `${dueW}%` }} /> : null}
    </div>
  );
}
