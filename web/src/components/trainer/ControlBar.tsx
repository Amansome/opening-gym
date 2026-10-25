import { Icon } from "./icons";
import type { IconName } from "./icons";

export interface ControlSpec {
  id: string;
  label: string;
  icon: IconName;
  onClick: () => void;
  disabled?: boolean;
  badge?: number;
}

export function ControlBar({ controls }: { controls: ControlSpec[] }) {
  return (
    <div className="og-controls" role="toolbar" aria-label="Trainer controls">
      {controls.map((c) => (
        <button
          key={c.id}
          type="button"
          className="og-control"
          onClick={c.onClick}
          disabled={c.disabled}
          aria-label={c.label}
          data-testid={`control-${c.id}`}
        >
          <span className="og-control__icon">
            <Icon name={c.icon} size={22} />
            {!!c.badge && <span className="og-control__badge">{c.badge}</span>}
          </span>
          <span className="og-control__label">{c.label}</span>
        </button>
      ))}
    </div>
  );
}
