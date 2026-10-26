/** Drawn navigation icons shared by the tool pages (same 2px round stroke as components/ui/Icon). */
const PATHS = {
  first: (
    <>
      <path d="M6 5v14" />
      <path d="M18 6l-8 6 8 6z" />
    </>
  ),
  prev: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  last: (
    <>
      <path d="M18 5v14" />
      <path d="M6 6l8 6-8 6z" />
    </>
  ),
};

export type ToolIconName = keyof typeof PATHS;

export function ToolIcon({ name, size = 20 }: { name: ToolIconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
