import type { ReactNode } from "react";
import type { BubbleState } from "./useLineRunner";
import { Icon } from "./icons";

export interface CoachBubbleProps {
  bubble: BubbleState;
  /** buttons shown under the text ("Try again", "Let's go") */
  actions?: ReactNode;
  /** extra block above the notes (e.g. a "Trap to avoid" badge) */
  badge?: ReactNode;
}

export function CoachBubble({ bubble, actions, badge }: CoachBubbleProps) {
  const { text, notes, prompt, tone } = bubble;
  return (
    <div className="og-coach">
      <div className="og-coach__avatar" aria-hidden="true">
        <Icon name="knight" size={22} />
      </div>
      <div className={`og-coach__bubble og-coach__bubble--${tone}`} role="status" aria-live="polite" data-testid="coach-bubble">
        {badge}
        {text && <p className="og-coach__text">{text}</p>}
        {notes.map((n, i) => (
          <p className="og-coach__note" key={i}>
            <span className="og-coach__san">{n.san}</span> {n.text}
          </p>
        ))}
        {prompt && (
          <p className="og-coach__prompt" data-testid="coach-prompt">
            {prompt}
          </p>
        )}
        {actions && <div className="og-coach__actions">{actions}</div>}
      </div>
    </div>
  );
}
