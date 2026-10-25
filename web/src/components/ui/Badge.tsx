import type { ReactNode } from "react";
import type { Course, LineKind, Level, Side } from "../../lib/types";

export function Badge({ children, tone = "neutral", title }: { children: ReactNode; tone?: string; title?: string }) {
  return (
    <span className="badge" data-tone={tone} title={title}>
      {children}
    </span>
  );
}

const LEVEL_LABEL: Record<Level, string> = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
export function LevelBadge({ level }: { level: Level }) {
  return <Badge tone={level}>{LEVEL_LABEL[level]}</Badge>;
}

export function sideLabel(side: Side): string {
  return side === "white" ? "White" : side === "black" ? "Black" : "Both sides";
}
export function SideBadge({ side }: { side: Side }) {
  return (
    <Badge tone={`side-${side}`}>
      <span className="side-dot" data-side={side} aria-hidden="true" />
      {sideLabel(side)}
    </Badge>
  );
}

export function KindBadge({ kind }: { kind: LineKind }) {
  if (kind === "warning") return <Badge tone="warning" title="A mistake to recognise and avoid">Trap to avoid</Badge>;
  if (kind === "alternative") return <Badge tone="alt">Alternative</Badge>;
  return <Badge tone="main">Main line</Badge>;
}

export function StyleBadge({ course }: { course: Course }) {
  return course.style ? <Badge tone="style">{course.style}</Badge> : null;
}
