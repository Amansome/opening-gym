# Surface brief: Opening Gym web app (all routes)

Development-only. Never copy any of this into source comments, DOM, data attributes or anything the browser receives.

## Scope and visitor modes
- Operate: trainer (/opening/:id top), Dojo, Progress, Analysis, Check my games, Create a course, Openings directory.
- Read: course article (/opening/:id below the trainer), About.
- Persuade: Home first viewport only.

Audience: beginners under ~1000 (PRODUCT.md). Phone and laptop equally. Must not look like Chessreps.

## Direction contract

THESIS: Opening practice as a tournament-day school gym: you warm up, run your lines and score. It refuses the category default of a dark app shell with a purple accent, a white coach speech bubble beside the board, and a 2x2 grid of mode tiles.

OWN-WORLD: Sanded maple floor as the page ground; white folding-table panels with soft offset shadows hold the work. Painted court lines in royal blue, green, red and yellow are the structure: dividers, progress, selection and one colour per mode (Learn blue, Practice green, Drill red, Time yellow, Dojo black). Headings in Saira Condensed (gym signage), scores and streaks in Graduate (varsity numerals), body in the system UI stack. The board has maple light squares and court-blue dark squares, with coordinates printed in the margin. "After hours" dark theme: varnished dark floor under arena light.

STORY: A beginner picks an opening, plays the line with the coach's reason under every move, keeps the streak, and comes back tomorrow to run the lines again until they are automatic.

FIRST VIEWPORT: Home shows the wordmark and a one-line promise at left with the primary "Pick an opening" action in court blue. At right a live board plays a real course line move by move with its notes underneath, as the working proof. A court line runs under the header. Trainer: the board dominates the left; a scoreboard header (mode as a painted-line tab strip, line counter, streak in Graduate numerals) sits above the coach's note, which is set as a caption under a court line, not a speech bubble. Progress is a painted line that fills as you play.

FORM: Tournament Day Gym, user-chosen (1 of 3 presented; ranked 2nd of 7 grounded candidates). Signature move: court lines. Each mode owns a painted line colour, and each course's lines are drawn as lanes on a court map; learned lanes are painted solid, due lanes in yellow, new lanes as chalk outlines. Tap a lane to train it. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraints
- Standard web controls only (buttons, tabs, inputs, selects, links); the world lends type, palette, density and the court-line signature, never navigation or control shapes.
- Light ("day") is the default theme; dark is "after hours".
- No external font requests; fonts are self-hosted via @fontsource.
- Keep every feature, route, copy fact and behaviour; this is a visual and layout redesign.

## Unresolved
- None at build start.
