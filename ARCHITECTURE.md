# Opening Gym: architecture and team rules

A free, open-source, local-first chess opening trainer (a Chessreps alternative).
Read `REPORT.md` §2 (what Chessreps does) and §4 (our plan) before starting.

## Layout
```
chess-openings-research/
  data/courses.js          source of truth for course content (moves, notes, articles)
  data/*.tsv               Lichess CC0 opening names
  scripts/validate.js      validates courses, writes dist/courses.json AND web/src/data/courses.json
  web/                     the app: Vite + React 19 + TypeScript, static, no backend
    src/data/courses.json  GENERATED (run `npm run data` in web/). Never edit by hand
    src/lib/types.ts       shared contracts (orchestrator-owned; don't edit, ask instead)
    src/lib/courses.ts     course lookup helpers (orchestrator-owned)
    src/lib/progress/      spaced repetition, streaks, unlocks, scores (progress agent)
    src/lib/trainer/       pure training engine, no React (trainer agent)
    src/components/board/  cm-chessboard React wrapper (trainer agent)
    src/components/trainer/ CoursePlayer and TrainerSession UI (trainer agent)
    src/components/ui/      shared presentational bits: Button, Card, Badge… (shell agent)
    src/pages/              route pages (shell agent)
    src/styles/             tokens.css (design tokens) and global.css (shell agent)
    src/App.tsx, main.tsx   routing and shell (shell agent)
```

## Stack and licences
- `chess.js` (BSD-2): rules, SAN and PGN. `cm-chessboard` (MIT): the board, same as Chessreps uses.
- `ts-fsrs` (MIT): scheduling. `idb-keyval`: IndexedDB persistence. `react-router-dom` v7.
- Tests: `vitest` (jsdom). Run with `npm test` in `web/`.
- **All dependencies are already installed. Do not run `npm install <pkg>`.** If you truly need a
  new package, finish what you can and say so in your final report.

## Product rules
- Free and local-first: no accounts and no backend. Progress lives in IndexedDB, with JSON export/import.
- Every move has an explanation where the course provides one. The coach bubble is the heart of the UI.
- Modes: Learn (hints, notes) → Practice (no hints, due/weak first) → Drill (streak, one mistake ends
  the run) → Time (60 s, +time per correct line, clock speeds up) → Dojo (all started courses mixed).
- Line kinds: `main` and `alternative` lines are trained; `warning` lines (mistakes to avoid) are shown in
  Learn only, after the trainable lines.
- The user plays `course.side`. For `side: "both"` (the traps course), the user plays the side that
  makes the final move of the line (`userColor()` in `lib/courses.ts`).
- Dark theme by default with a light theme. Use the CSS variables in `src/styles/tokens.css`, never raw
  colours. Mobile first: works at 360 px wide with no horizontal scroll.
- Accessibility: keyboard focus states, aria-labels on icon buttons, reduced-motion support for celebrations.

## Team rules
- Only edit files in the area you own (above). Shared contracts live in `src/lib/types.ts` and
  `src/lib/progress/api.ts`. If one needs changing, explain why in your final report instead of editing it.
- Before finishing: `npx tsc -b` and `npm test` must pass in `web/`, and `npm run build` must succeed.
- Don't commit. The orchestrator reviews and commits.
- Don't copy Chessreps text, course content or branding. Write everything yourself.
