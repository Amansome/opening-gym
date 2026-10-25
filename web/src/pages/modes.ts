import type { IconName } from "../components/ui/Icon";

export interface ModeInfo {
  key: "learn" | "practice" | "drill" | "time" | "dojo";
  name: string;
  color: string; // CSS variable
  icon: IconName;
  blurb: string;
}

export const MODES: ModeInfo[] = [
  { key: "learn", name: "Learn", color: "var(--accent)", icon: "eye", blurb: "Play the line against the coach. Every move comes with a plain-English reason, and hints are always on." },
  { key: "practice", name: "Practice", color: "var(--practice)", icon: "repeat", blurb: "Replay what you learned with no hints. Lines you are about to forget come back first." },
  { key: "drill", name: "Drill", color: "var(--drill)", icon: "flame", blurb: "Line after line with no safety net. One mistake ends the run, so aim for a new best streak." },
  { key: "time", name: "Time", color: "var(--time)", icon: "clock", blurb: "Sixty seconds on the clock. Correct lines add time, but the clock keeps getting faster." },
  { key: "dojo", name: "Dojo", color: "var(--dojo)", icon: "target", blurb: "Every course you have started, mixed together. This is where a repertoire becomes instinct." },
];
