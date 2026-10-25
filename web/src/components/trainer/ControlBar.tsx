import { Link } from "react-router-dom";
import { Icon } from "./icons";
import type { IconName } from "./icons";

export interface ControlSpec {
  id: string;
  label: string;
  icon: IconName;
  onClick?: () => void;
  /** render as a link to this route instead of a button */
  to?: string;
  /** toggle state (renders aria-pressed) */
  pressed?: boolean;
  disabled?: boolean;
  badge?: number;
}

export function ControlBar({ controls }: { controls: ControlSpec[] }) {
  return (
    <div className="og-controls" role="toolbar" aria-label="Trainer controls">
      {controls.map((c) => {
        const inner = (
          <>
            <span className="og-control__icon">
              <Icon name={c.icon} size={22} />
              {!!c.badge && <span className="og-control__badge">{c.badge}</span>}
            </span>
            <span className="og-control__label">{c.label}</span>
          </>
        );
        if (c.to && !c.disabled) {
          return (
            <Link key={c.id} to={c.to} className="og-control" aria-label={c.label} data-testid={`control-${c.id}`}>
              {inner}
            </Link>
          );
        }
        return (
          <button
            key={c.id}
            type="button"
            className={`og-control${c.pressed ? " is-on" : ""}`}
            onClick={c.onClick}
            disabled={c.disabled || (!!c.to && !c.onClick)}
            aria-label={c.label}
            aria-pressed={c.pressed}
            data-testid={`control-${c.id}`}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
