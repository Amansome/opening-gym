---
name: Opening Gym
description: A tournament-day school gym for chess openings: sanded maple floor, white folding-table panels, painted court lines, varsity numerals.
colors:
  maple-floor: "#e8cd9c"
  worn-lane: "#dcbb82"
  folding-table: "#fbf8f1"
  recessed-table: "#f2eadb"
  table-hairline: "#d8c6a3"
  chalk-line: "#9a7f52"
  gym-ink: "#22190d"
  soft-ink: "#5b4628"
  chalk-white: "#ffffff"
  court-blue: "#1f4fbf"
  court-green: "#1a7a43"
  court-red: "#c22f27"
  court-yellow: "#f2b705"
  blue-ink: "#1a43a3"
  green-ink: "#146136"
  red-ink: "#a1241d"
  yellow-ink: "#7a5a00"
  highlighter: "#fbe08a"
  scoreboard-housing: "#1f1608"
  scoreboard-text: "#f6ebd8"
  board-maple: "#eed7a9"
  board-blue: "#6585c6"
  board-coordinate: "#3b2a12"
typography:
  display:
    fontFamily: "Saira Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(3rem, 9vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 0.93
    letterSpacing: "0"
  headline:
    fontFamily: "Saira Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.005em"
  title:
    fontFamily: "Saira Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.005em"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
  label:
    fontFamily: "Saira Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.05em"
  score:
    fontFamily: "Graduate, Saira Condensed, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0"
rounded:
  xs: "4px"
  sm: "8px"
  md: "14px"
  full: "50%"
spacing:
  xs: "6px"
  sm: "12px"
  md: "16px"
  lg: "28px"
  xl: "48px"
  section: "72px"
  court-line: "6px"
components:
  button-primary:
    backgroundColor: "{colors.court-blue}"
    textColor: "{colors.chalk-white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-default:
    backgroundColor: "{colors.folding-table}"
    textColor: "{colors.gym-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-default-hover:
    backgroundColor: "{colors.recessed-table}"
  button-ghost:
    backgroundColor: "{colors.maple-floor}"
    textColor: "{colors.soft-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-on-blue-close:
    backgroundColor: "{colors.court-yellow}"
    textColor: "{colors.gym-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 28px"
    height: "54px"
  chip:
    backgroundColor: "{colors.folding-table}"
    textColor: "{colors.blue-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "5px 12px"
    height: "36px"
  chip-hover:
    backgroundColor: "{colors.court-blue}"
    textColor: "{colors.chalk-white}"
  badge-beginner:
    backgroundColor: "{colors.folding-table}"
    textColor: "{colors.green-ink}"
    rounded: "{rounded.xs}"
    padding: "1px 8px"
  panel:
    backgroundColor: "{colors.folding-table}"
    textColor: "{colors.gym-ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  scoreboard:
    backgroundColor: "{colors.scoreboard-housing}"
    textColor: "{colors.scoreboard-text}"
    rounded: "{rounded.sm}"
    padding: "10px 14px 12px"
  scoreboard-numeral:
    textColor: "{colors.court-yellow}"
    typography: "{typography.score}"
  tab-active:
    backgroundColor: "{colors.folding-table}"
    textColor: "{colors.gym-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    height: "46px"
  input:
    backgroundColor: "{colors.folding-table}"
    textColor: "{colors.gym-ink}"
    rounded: "10px"
    height: "44px"
  site-header:
    backgroundColor: "{colors.court-blue}"
    textColor: "{colors.chalk-white}"
    height: "60px"
---

# Design System: Opening Gym

## Overview

**Creative North Star: "The Tournament-Day Gym"**

A school gym set up for a scholastic chess tournament. The floor is sanded maple, the work sits on white folding tables, and everything that organizes the page is a line painted on the floor in a court colour. You warm up, run your lines, and score; the interface reads like the room you do that in, not like an app shell. Light ("day") is the default. The dark theme is "after hours": a varnished dark floor under arena light, same structure and same line colours, lifted for the dark.

Density is working-gym, not showroom: panels are close to their content, headings are signage-loud, and the board is always the biggest thing on a trainer screen. Depth is a table resting on a floor, not a card floating in space. Colour is spent on meaning. Each practice mode owns one painted line colour, and the court-blue header band and primary actions are the only large colour fields.

The system refuses the category default of a dark app shell with a purple accent, a white coach speech bubble beside the board, and a grid of mode tiles (a brand commitment in PRODUCT.md). The coach's note is a caption hung under a painted line. Modes are a tab strip and a list of lanes.

**Key Characteristics:**
- Maple floor ground, folding-table panels, court lines as the only structural ornament.
- One line colour per mode: Learn blue, Practice green, Drill red, Time yellow, Dojo black.
- Signage headings (Saira Condensed, uppercase at page level), varsity numerals (Graduate) for scores and streaks, plain system UI for reading.
- Standard web controls throughout; the world lends type, colour, density and the lane motif, never control shapes.
- Soft offset shadows, single elevation step per surface; no glass, no gradients as decoration.

## Colors

A warm, saturated-but-grounded palette: wood neutrals tinted toward amber, four primary-grade paint colours used as lines, and one near-black ink. Values below are the light theme and are normative in the frontmatter; the dark theme is described at the end of this section.

### Primary
- **Court Blue** (#1f4fbf): the brand and the Learn mode. The header band, primary buttons, the Pick-an-opening action, selected segmented-control state, and the rule above a course article. White text on it clears 4.5:1.
- **Blue Ink** (#1a43a3): Court Blue as text or icon on a table or floor (links, chip labels, focus outline inside panels). Use this, not Court Blue, for blue type on cream.

### Secondary
- **Court Green** (#1a7a43): Practice mode and success: practice tab line, correct-move note line and tick disc, pros panel top rule, "beginner" badge border. **Green Ink** (#146136) is its text form.
- **Court Red** (#c22f27): Drill mode and mistakes: drill tab line, wrong-move note line, destructive confirm borders, cons panel rule. **Red Ink** (#a1241d) is its text form.
- **Court Yellow** (#f2b705): Time mode and "look here": the sideline under the header, due lanes, the current move chip, selection and `::selection`, the scoreboard numerals, the primary button when it sits on blue or on the scoreboard. Text on yellow is Gym Ink (#22190d). **Yellow Ink** (#7a5a00) is its text form on cream.
- **Court Black** (the Gym Ink value): Dojo mode and the black-side group rule.

### Neutral
- **Maple Floor** (#e8cd9c): the page ground and the heatmap bed. **Worn Lane** (#dcbb82) is the floor pressed or recessed: footer, scrollbar track, ghost-button hover, empty heat cells.
- **Folding Table** (#fbf8f1): every panel that holds work. **Recessed Table** (#f2eadb) is an inset area inside a table: hover rows, empty tracks, table headers.
- **Table Hairline** (#d8c6a3): 1px dividers inside tables. **Chalk Line** (#9a7f52): control borders, chalk outlines for unstarted lanes, 3:1 against the table.
- **Gym Ink** (#22190d): all primary text. **Soft Ink** (#5b4628): secondary text, 4.5:1 on floor and table.
- **Scoreboard Housing** (#1f1608) with **Scoreboard Text** (#f6ebd8): the dark wall scoreboard, dark in both themes, carrying yellow Graduate numerals.
- **Highlighter** (#fbe08a): last-move and note washes.
- **Board Maple** (#eed7a9), **Board Blue** (#6585c6), **Board Coordinate** (#3b2a12): the board's light squares, dark squares, and the coordinates printed in the mat margin.

### Named Rules
**The One Line, One Meaning Rule.** A painted colour always means the same thing: blue Learn/brand, green Practice/correct, red Drill/mistake, yellow Time/due/your-move, black Dojo. Do not recolour a line for variety; do not introduce a fifth line colour.

**The Ink Form Rule.** Court colours are paint, not type. When a court colour has to be text or an icon on a table, use its Ink form (blue, green, red, yellow). Paint stays for lines, fills and discs.

**The After Hours Rule.** Dark theme keeps the same roles with lifted values: floor #1d150d, table #2a2017, ink #f6ebd8, soft ink #d0bc98, and paints lifted to blue #6f95f2, green #45c07a, red #f0675d, yellow #f7c948, board dark squares #4d6aa8. Focus rings switch from blue to yellow. It is not an inverted palette; the wood stays warm.

## Typography

**Display Font:** Saira Condensed (600 and 800, self-hosted via @fontsource; fallback Arial Narrow, system-ui)
**Body Font:** the system UI stack (system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial)
**Score Font:** Graduate (400, self-hosted; fallback Saira Condensed, serif)

**Character:** Gym signage over plain reading text. Saira Condensed is the painted lettering on the wall: heavy, narrow, uppercase when it is a page title or a control. Graduate is the varsity numeral on the scoreboard, reserved for scores, streaks, counts and the wordmark. The body is deliberately unremarkable system UI so explanations read as plain English.

### Hierarchy
- **Display** (800, clamp(3rem, 9vw, 5.4rem), line-height 0.93, tracking 0): the Home hero only, uppercase, with a yellow painted underline on the key phrase.
- **Headline** (800, clamp(1.9rem, 3.6vw, 2.6rem), 1.05): section headings; page titles (h1) step up to clamp(2.4rem, 5.6vw, 3.6rem) uppercase. Always balanced wrapping.
- **Title** (600, 1.45rem, 1.15): panel titles, article subheads, lane and course names (course row names set at 1.4rem/800).
- **Body** (400, 1rem, 1.55): UI copy. Article prose sets at 1.07rem/1.7 with a 70ch measure; the coach's note at 1.06rem/1.55 within 62ch.
- **Label** (600, 1.1rem, tracking 0.05em, uppercase, Saira Condensed): buttons, tabs, chips, badges, table heads. Smaller variants run 0.95 to 1rem with 0.06 to 0.08em tracking.
- **Score** (400 Graduate, 1.75rem scoreboard cell, up to 2.6rem on Progress, 3 to 5.2rem on end-of-run panels, tracking 0, tabular numerals): scores, streaks, line counters.

### Named Rules
**The Zero Numeral Rule.** Graduate's zero is a bare oval that reads as an icon. Any numeral string that starts with 0 is set in Saira Condensed 800 at a slightly larger size (`data-zero`), everywhere a score appears. Never show a zero in Graduate.

**The Signage Case Rule.** Uppercase is for signage: page titles, buttons, tabs, table heads, scoreboard labels. Sentences, notes and article text stay sentence case in the system face. Uppercase never carries more than a few words.

**The Wordmark Rule.** The only place Graduate appears as lettering rather than numerals is the wordmark in the header and footer.

## Layout

A single centred column on the floor: max width 1200px, gutters 16px on phones and 24px from 720px. Sections are separated by generous floor (72px between Home sections, 48px between article blocks) with tight grouping inside panels (10 to 16px). Structure is announced by a horizontal painted line (6px, `court-width`) under or above a heading, not by boxes around everything.

The trainer is the system's centre of gravity: a two-column grid, the board mat on the left (a column that fills the available height, `100dvh - 156px`) and a 340 to 420px folding-table panel on the right holding mode tabs, scoreboard, progress line, coach's note, controls and the lane picker. Below 820px the table dissolves: tabs and scoreboard first, then the board, then the note, with a sticky action bar. Home is a split first viewport (promise and action at left, live demo table 468px at right) from 960px, stacked below it. Course articles add a 230px sticky table of contents beside the prose from 1000px. The openings roster is a container-query list that moves from a two-line row (under 520px) to a lane-inline row (520px) to a seven-column table row (900px).

Breakpoints in use: 560 (streak unit and theme label appear), 720 (desktop nav replaces the bottom tab bar, wider gutter), 820 (trainer table), 960 (hero split), 1000 (article ToC). Everything holds at 360px with no horizontal scroll; touch targets are 44px.

### Named Rules
**The Line Under, Not Box Around Rule.** Group and section headings take a painted line, not a bordered box. Boxes are for things that hold work: a folding-table panel.

## Elevation & Depth

Hybrid: tonal layering plus one soft offset shadow. The floor is flat. Panels (folding tables) rest on it with a soft, downward-offset shadow; recessed areas are tonal (Recessed Table inside Folding Table), not shadowed. In dark theme the panel shadow gains a 1px hairline ring so tables stay legible against the dark floor. Hover on a primary action lifts it 1px and swaps to the larger shadow; pressed states drop the shadow and push 1px down.

### Shadow Vocabulary
- **Table** (`box-shadow: 0 1px 0 rgb(80 50 10 / 0.08), 0 8px 22px rgb(80 50 10 / 0.16)`): the trainer panel, the board mat, the Home demo table, the sticky filter bar, overlays.
- **Table, small** (`box-shadow: 0 1px 0 rgb(80 50 10 / 0.08), 0 3px 8px rgb(80 50 10 / 0.12)`): standard panels, tables, stat boxes, FAQ rows, default buttons.
- **Result disc** (`box-shadow: 0 0 0 2px var(--table), 0 2px 5px rgb(34 25 13 / 0.4)`): tick and cross on a board square.

### Named Rules
**The Table On The Floor Rule.** Shadows describe a physical table on a floor: soft, offset downward, brown-tinted (never black, never a coloured glow, never a zero-blur block). One elevation per surface; do not stack a border under a wide shadow on the same panel.

## Shapes

Softly squared, like folding-table corners and taped control edges. Controls and small surfaces take 8px; panels and the roster take 14px; badges, tabs and track ends take 3 to 6px; inputs 10px. Markers on the board and the result discs are the only true circles (plus the side-dot and idea bullets). Lanes are rectangles with a 3px corner. Lines are straight and horizontal: painted rules run along the top or bottom of a surface, never as a side stripe, and unstarted lanes are chalk outlines (2px dashed or inset outline in Chalk Line), not hollow pills. Controls carry a 2px border in Chalk Line; panels carry no border.

## Components

### Buttons
Signage lettering on a taped-edge control.
- **Shape:** 8px radius, 44px minimum height (54px large, 38px small), Saira Condensed 600 uppercase, 2px Chalk Line border.
- **Default:** Folding Table fill, Gym Ink text, small table shadow.
- **Primary:** Court Blue fill and border, white text; lifts 1px on hover. On the blue close band and on the scoreboard the primary flips to Court Yellow with Gym Ink text.
- **Ghost:** transparent, Soft Ink text, Worn Lane hover. **Danger:** table fill, Court Red border, Red Ink text.
- **Focus:** 3px outline, 2px offset, blue on cream and yellow on blue, header and dark theme.
- **Trainer buttons** (`og-btn`) take the current mode colour as fill and border, so the action button of a Drill screen is red.

### Chips and Badges
- **Chip:** 8px radius, 2px Court Blue border, Blue Ink label, fills blue with white text on hover. Used for quick-picks.
- **Badge:** 6px radius, 1.5px border, Saira label; tone sets border and text to the Ink form on a 10% tint: beginner green, intermediate yellow, advanced and warning red, main line blue, neutral Chalk Line.
- **Due pill:** a yellow chip with Gym Ink text, the one place yellow is used as a label fill.

### Panels (Folding Tables)
- **Corner Style:** 14px. **Background:** Folding Table. **Shadow:** Table, small (Table for the trainer panel).
- **Top rule:** a 6px painted line in the panel's meaning colour (demo blue, quick-picks yellow, pros green, cons red, course map in the mode colour).
- **Internal Padding:** 14 to 20px. Cards are not nested.

### Inputs and Selects
- 44px tall, 10px radius, 2px Chalk Line border on Folding Table, native select with a drawn caret; hover and focus border go Court Blue. Placeholder text is Soft Ink at full opacity (4.5:1). Caret colour is Court Blue.

### Navigation
- **Header:** a 60px Court Blue band with a 5px Court Yellow sideline painted under it. Nav labels are Saira Condensed 600 uppercase at 1.15rem; the current page is marked by a 5px yellow underline inset at the bottom of the band. The streak badge (Graduate numeral, yellow when active) and the theme toggle ("After hours") sit at right as outlined 40px controls.
- **Mobile:** below 720px the nav moves to a fixed four-item bottom tab bar on the same blue with a 3px yellow top line and the current item marked by a 5px yellow bar at its top. The trainer page omits the bar.
- **Footer:** Worn Lane ground, 6px yellow line along its top edge.

### Mode Tabs
A standard tab strip. The selected tab is marked by a 5px painted line in its mode colour under it plus a 10% tint of that colour on the table; locked modes carry a lock icon and stay visible. Inactive tabs are Soft Ink. Count in Graduate numerals.

### Scoreboard
The dark wall scoreboard above the coach's note (and on Progress): Scoreboard Housing fill, 8px radius, line title in Saira Condensed uppercase, numerals in Graduate in Court Yellow, labels in dim Scoreboard Text. Streak sits right. Alerts light the numeral red (#ff9a90), success flashes green (#7fdca7). It stays dark in both themes.

### Court Line (progress) and Coach's Note
- **Progress line:** a 10px painted track on Recessed Table whose fill is the mode colour, filling as the line is played (draining for the Time clock).
- **Coach's note:** a caption hung under a 6px painted line whose colour states the verdict (mode colour by default, green correct, red wrong, blue fine, yellow hint or other line), a state label in Saira Condensed with a drawn disc icon, then the plain-English reason at 1.06rem. Not a bubble: no fill, no tail, no avatar.

### Court Map (signature component)
A course's lines drawn as lanes: one row per line, a name in Saira Condensed at left, status and move count at right, and a track strip. Learned lanes are painted solid in the mode colour at full width, due lanes are painted yellow with a darkened inset edge, new lanes are empty chalk-outlined tracks (no fill, so length never reads as progress), trap lanes are outlined red. Tap or click a lane to train it; the selected lane takes a 12% tint and a 2px inset outline in its colour. Three sizes: the article section (a folding table with a 6px top rule, name and track side by side from 640px), the in-trainer picker (scrolling, fading its last row), and a per-row strip in the roster and Progress. The status text always repeats the paint (Learned, Due, New), so colour never carries meaning alone.

### Openings Roster
A single folding table of one-row courses: a 52px board thumbnail with a 1.5px outline, name in Saira Condensed 800 (1.4rem), one-line summary, side/difficulty/style badges, line count and a lane strip. Hover tints to Recessed Table and underlines the name with a 3px yellow rule; the whole row is one link target. Group headings (White, Black, Both sides) carry a 6px line in blue, black or red.

### Board
The board mat is a Folding Table frame (8px radius, Table shadow) with coordinates printed in the margin in Saira Condensed, around an 8x8 grid of Board Maple and Board Blue squares inside a 2px Board Coordinate outline. Markers are painted in court colours: yellow last move and selection, green expected-move arrow, red wrong arrow, a drawn tick or cross disc on the square. The eval strip beside it is a Scoreboard Housing bar filled with Board Maple, with a yellow midline.

### Heatmap
Twelve weeks of squares on a Maple Floor bed: empty days are Worn Lane with an inset hairline, activity steps through four mixes of Court Blue into the floor (38%, 62%, 84%, 100%), today carries a 2px Gym Ink outline.

## Do's and Don'ts

### Do:
- **Do** let a horizontal painted line (6px) announce structure: under a page head, above a panel, under a group title.
- **Do** give every mode its one line colour (Learn blue, Practice green, Drill red, Time yellow, Dojo black) on its tab line, progress fill, trainer button and end-of-run panel.
- **Do** set scores, streaks and counts in Graduate with tabular numerals, and set any value starting with 0 in Saira Condensed 800.
- **Do** keep the body in the system UI stack at 16px with 65 to 75ch measure and let Saira Condensed carry only signage: headings, labels, buttons, tabs.
- **Do** use Ink forms (#1a43a3, #146136, #a1241d, #7a5a00) for any court colour used as text on cream; keep text on yellow at Gym Ink.
- **Do** draw lanes with a state that has a text twin: Learned, Due, New always appear as words beside their paint.
- **Do** keep standard web controls (buttons, tabs, selects, inputs, details) and theme their browser surfaces from the palette: selection is yellow, caret and accent are blue, scrollbars are Chalk Line on Worn Lane.
- **Do** keep light as the default ("day") and dark as "after hours" with the same roles in lifted values.
- **Do** animate with the exponential ease-out (`cubic-bezier(0.22, 1, 0.36, 1)`, trainer `0.16, 1, 0.3, 1`): progress fills grow over 320 to 500ms, the end-of-run line paints across over 720ms, the demo note settles in over 400ms; reduced motion cuts all of it.

### Don't:
- **Don't** use a purple accent, a dark app shell as the default theme, a white speech bubble beside the board, or a grid of mode tiles. Modes are tabs and lanes.
- **Don't** use a vertical stripe: painted lines run along the top or bottom of a surface, never as a coloured left or right border on cards, rows or callouts.
- **Don't** give a court colour a second meaning, or colour a line decoratively; a line with no state to report is Chalk Line or Table Hairline.
- **Don't** use the system sans for page titles, or Graduate for body or headings; the world's two display voices are Saira Condensed (signage) and Graduate (numerals only).
- **Don't** shadow with zero offset glows or hard offset blocks; shadows are brown, soft and downward.
- **Don't** nest panels inside panels; recessed areas are tonal (Recessed Table), not carded.
- **Don't** let a lane's length read as progress: a new line is an empty outlined track, and only learned or due lanes are painted, at full width.
- **Don't** load fonts from a remote host; the faces are self-hosted.
