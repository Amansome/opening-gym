import type { ReactNode } from "react";

export type IconName =
  | "book"
  | "target"
  | "flame"
  | "hourglass"
  | "lock"
  | "bulb"
  | "undo"
  | "restart"
  | "flip"
  | "next"
  | "back"
  | "check"
  | "star"
  | "knight"
  | "trophy"
  | "warning"
  | "gauge"
  | "search"
  | "cross"
  | "checks"
  | "fork"
  | "play";

const PATHS: Record<IconName, ReactNode> = {
  book: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  flame: <path d="M12 2c.3 3.2-2.8 5.1-4.4 8C6.4 12.2 6 13.4 6 14.6A6 6 0 0 0 12 21a6 6 0 0 0 6-6.4c0-2.6-1.4-4.6-3-6.4-.3 1.4-1 2.3-2 2.8.7-3.6.1-6.7-1-9zM12 20a2.8 2.8 0 0 1-2.8-2.8c0-1.7 1.6-2.5 2.8-4.4 1.2 1.9 2.8 2.7 2.8 4.4A2.8 2.8 0 0 1 12 20z" />,
  hourglass: <path d="M6 3h12M6 21h12M7 3v3.5c0 1.6 1 2.6 2.4 3.6L12 12l-2.6 1.9C8 14.9 7 15.9 7 17.5V21M17 3v3.5c0 1.6-1 2.6-2.4 3.6L12 12l2.6 1.9c1.4 1 2.4 2 2.4 3.6V21" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.7.6 1 1.3 1 2.1h5c0-.8.3-1.5 1-2.1A6 6 0 0 0 12 3z" />,
  undo: <path d="M9 14L4 9l5-5M4 9h9a6 6 0 0 1 0 12h-3" />,
  restart: <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />,
  flip: <path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />,
  next: <path d="M5 5l8 7-8 7zM17 5v14" />,
  back: <path d="M19 5l-8 7 8 7zM7 5v14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  star: <path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z" />,
  knight: <path d="M7 21h11v-2.5l-2-1.5c0-3 3-4 3-8a7 7 0 0 0-7-6c-1.5 0-2.6.4-3.5 1L8 6l2 2-4 4 1.5 2 3-1.5-1 3.5c-.8 1.2-2.5 2-2.5 4z" />,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4" />,
  warning: <path d="M12 3L2 21h20zM12 10v5M12 18v.5" />,
  gauge: (
    <>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M8 12h8" />
    </>
  ),
  cross: <path d="M6 6l12 12M18 6L6 18" />,
  checks: <path d="M2.5 13l4.5 4.5L15 8M11 16l2 2L22 8" />,
  fork: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="9" r="2" />
      <path d="M6 7v10M18 11c0 4-4 4-10 7" />
    </>
  ),
  play: <path d="M7 4l12 8-12 8z" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L21 21" />
    </>
  ),
};

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const filled = name === "flame" || name === "star" || name === "knight" || name === "play";
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      fillRule="evenodd"
      stroke="currentColor"
      strokeWidth={name === "flame" ? 1 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
