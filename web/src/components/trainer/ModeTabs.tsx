import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Mode } from "../../lib/types";
import type { CourseProgress } from "../../lib/progress";
import { Icon } from "./icons";
import type { IconName } from "./icons";

type TabMode = Exclude<Mode, "dojo">;

const TABS: { mode: TabMode; label: string; icon: IconName }[] = [
  { mode: "learn", label: "Learn", icon: "book" },
  { mode: "practice", label: "Practice", icon: "target" },
  { mode: "drill", label: "Drill", icon: "flame" },
  { mode: "time", label: "Time", icon: "hourglass" },
];

/** The small numeral on a tab and its plain-words meaning. */
function counter(mode: TabMode, cp: CourseProgress | null): { big: string; small: string } {
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

export interface ModeTabsProps {
  mode: Mode;
  progress: CourseProgress | null;
  onSelect: (mode: Mode) => void;
}

/**
 * A standard tab strip. The selected tab is marked by a painted line in its mode colour; locked tabs stay focusable
 * (aria-disabled) so the unlock hint shows on focus, hover and, always, on a phone.
 */
export function ModeTabs({ mode, progress, onSelect }: ModeTabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [peek, setPeek] = useState<TabMode | null>(null);
  const locked = (m: TabMode) => !!progress && !progress.unlocked[m];
  const anyLocked = TABS.some((t) => locked(t.mode));
  const hint = progress?.nextUnlockHint ?? "Locked";

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next >= 0) {
      e.preventDefault();
      refs.current[TABS[next].mode]?.focus();
    }
  };

  return (
    <div className="og-tabs">
      <div className="og-tabs__strip" role="tablist" aria-label="Training modes">
        {TABS.map((t, i) => {
          const isLocked = locked(t.mode);
          const active = mode === t.mode;
          const c = counter(t.mode, progress);
          return (
            <button
              key={t.mode}
              ref={(el) => {
                refs.current[t.mode] = el;
              }}
              type="button"
              role="tab"
              id={`og-tab-${t.mode}`}
              className={`og-tab og-tab--${t.mode}${active ? " is-active" : ""}${isLocked ? " is-locked" : ""}`}
              aria-selected={active}
              aria-disabled={isLocked || undefined}
              aria-describedby={isLocked ? "og-tabs-hint" : undefined}
              tabIndex={active || (!TABS.some((x) => x.mode === mode) && i === 0) ? 0 : -1}
              title={isLocked ? hint : c.small ? `${t.label}: ${c.big ? c.big + " " : ""}${c.small}` : t.label}
              data-testid={`tile-${t.mode}`}
              onClick={() => {
                if (!isLocked) onSelect(t.mode);
              }}
              onKeyDown={(e) => onKeyDown(e, i)}
              onMouseEnter={() => isLocked && setPeek(t.mode)}
              onMouseLeave={() => setPeek(null)}
              onFocus={() => isLocked && setPeek(t.mode)}
              onBlur={() => setPeek(null)}
            >
              <span className="og-tab__icon" aria-hidden="true">
                <Icon name={isLocked ? "lock" : t.icon} size={16} />
              </span>
              <span className="og-tab__name">{t.label}</span>
              {!isLocked && c.big && <span className="og-tab__count">{c.big}</span>}
            </button>
          );
        })}
      </div>
      {anyLocked && (
        <p className={`og-tabs__hint${peek ? " is-peek" : ""}`} id="og-tabs-hint" data-testid="unlock-hint">
          <Icon name="lock" size={14} />
          {hint}
        </p>
      )}
    </div>
  );
}
