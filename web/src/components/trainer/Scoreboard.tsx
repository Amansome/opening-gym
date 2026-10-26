import { Icon } from "./icons";

export interface ScoreStat {
  id: string;
  label: string;
  value: string | number;
  /** small trailing text, spaces included: the " of 8" in "3 of 8", or "s" on a clock */
  of?: string;
  testId?: string;
  /** lit red (a clock running low) */
  alert?: boolean;
  /** a short flash next to the numerals, e.g. "+3s" */
  flash?: string | null;
}

export interface ScoreboardProps {
  title: string;
  stats: ScoreStat[];
  streakDays?: number;
}

/**
 * The scoreboard housing: course title, the mode's own numerals (line counter, run streak, clock) and the day streak,
 * in varsity numerals. It stays dark in both themes, like the physical thing on the gym wall.
 */
export function Scoreboard({ title, stats, streakDays }: ScoreboardProps) {
  return (
    <div className="og-score">
      <p className="og-score__title" title={title}>
        {title}
      </p>
      <div className="og-score__cells">
        {stats.map((s) => (
          <div className={`og-score__cell${s.alert ? " is-alert" : ""}`} key={s.id} data-testid={s.testId}>
            <span className="og-score__label">{s.label}</span>{" "}
            <span className="og-score__value">
              {s.value}
              {s.of && <span className="og-score__of">{s.of}</span>}
              {s.flash && <span className="og-score__flash">{s.flash}</span>}
            </span>
          </div>
        ))}
        {!!streakDays && (
          <div className="og-score__cell og-score__cell--streak" data-testid="day-streak" title="Day streak">
            <span className="og-score__label">Day streak</span>{" "}
            <span className="og-score__value">
              <Icon name="flame" size={16} />
              {streakDays}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
