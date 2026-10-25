import type { Mode } from "../../lib/types";
import type { CourseProgress } from "../../lib/progress";
import { Icon } from "./icons";
import type { IconName } from "./icons";

type TileMode = Exclude<Mode, "dojo">;

const TILES: { mode: TileMode; label: string; icon: IconName; color: string }[] = [
  { mode: "learn", label: "Learn", icon: "book", color: "var(--accent)" },
  { mode: "practice", label: "Practice", icon: "target", color: "var(--practice)" },
  { mode: "drill", label: "Drill", icon: "flame", color: "var(--drill)" },
  { mode: "time", label: "Time", icon: "hourglass", color: "var(--time)" },
];

function counter(mode: TileMode, cp: CourseProgress | null): { big: string; small: string } {
  if (!cp) return { big: "", small: "" };
  switch (mode) {
    case "learn":
      return { big: `${cp.learnedCount}/${cp.totalLines}`, small: "learned" };
    case "practice":
      return cp.dueCount > 0 ? { big: `${cp.dueCount}`, small: "due" } : { big: "", small: "perfect your lines" };
    case "drill":
      return cp.bestDrillStreak > 0 ? { big: `${cp.bestDrillStreak}`, small: "best streak" } : { big: "", small: "one slip ends it" };
    case "time":
      return cp.bestTime > 0 ? { big: `${cp.bestTime}`, small: "best lines" } : { big: "", small: "60 seconds" };
  }
}

export interface ModeTilesProps {
  mode: Mode;
  progress: CourseProgress | null;
  onSelect: (mode: Mode) => void;
}

export function ModeTiles({ mode, progress, onSelect }: ModeTilesProps) {
  const firstLocked = TILES.find((t) => progress && !progress.unlocked[t.mode])?.mode;
  return (
    <div className="og-tiles" role="group" aria-label="Training modes">
      {TILES.map((t) => {
        const locked = !!progress && !progress.unlocked[t.mode];
        const active = mode === t.mode;
        const c = counter(t.mode, progress);
        const hint = locked && t.mode === firstLocked ? (progress?.nextUnlockHint ?? "Locked") : locked ? "Locked" : c.small;
        return (
          <button
            key={t.mode}
            type="button"
            className={`og-tile og-tile--${t.mode}${active ? " is-active" : ""}${locked ? " is-locked" : ""}`}
            style={{ ["--tile-color" as string]: t.color }}
            aria-pressed={active}
            aria-disabled={locked || undefined}
            aria-label={locked ? `${t.label}, locked. ${progress?.nextUnlockHint ?? ""}` : t.label}
            data-testid={`tile-${t.mode}`}
            onClick={() => {
              if (!locked) onSelect(t.mode);
            }}
          >
            <span className="og-tile__icon">
              <Icon name={t.icon} size={20} />
            </span>
            <span className="og-tile__body">
              <span className="og-tile__name">{t.label}</span>
              <span className="og-tile__hint">{hint}</span>
            </span>
            <span className="og-tile__count">
              {locked ? <Icon name="lock" size={16} /> : c.big}
            </span>
          </button>
        );
      })}
    </div>
  );
}
