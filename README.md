# AncientWhiteArmyVet's RPG Tools v2020.1

This project is a **no-build, static, browser-based** toolkit for creating and selecting **Dungeons & Dragons 5e** characters.

GitHub repository: https://github.com/FrankJamison/AncientWhiteArmyVets-RPG-Tools-v2020.1

From an employer/recruiter perspective, this repo demonstrates:

- Building a complete, shippable UI without a framework/build pipeline
- Clean separation of **data**, **logic**, and **presentation** for a small product
- Practical DOM programming (dynamic rendering, event handling, file/link generation)
- Responsive, themed UI design (CSS-driven layout, typography, and a hamburger menu)

**Primary pages**

- Home: [index.html](index.html)
- Physical Stat Generator: [physical-stats.html](physical-stats.html)
- Ability Score Generator: [abilities.html](abilities.html)
- Pre-Generated Characters Browser: [pregen-characters.html](pregen-characters.html)

---

## Product Overview

### What users can do

1. **Generate physical characteristics** (age/height/weight) that are appropriate for a chosen race.
2. **Roll ability scores** using the classic 4d6-drop-lowest method.
3. **Browse and download pregenerated characters** by class and level.

### Why it’s built this way

This site is intentionally lightweight: **static HTML + CSS + JavaScript**, running entirely in the browser. That keeps deployment simple (any static host works) while still providing a polished, interactive experience.

---

## UX & Visual Design

### Navigation / layout

- **Fixed header + fixed footer** keeps navigation and attribution visible.
- **Hamburger menu** implemented using a checkbox toggle + CSS transitions (no JS required for the menu).
- Pages share a consistent structure: `header → divider → main → footer`.

### Styling approach

- Global theme via [css/common.css](css/common.css) (typography, colors, buttons, shared layout utilities).
- Page layout/backgrounds via [css/main.css](css/main.css).
- Character card UI via [css/characters.css](css/characters.css).
- Reset layer via [css/reset.css](css/reset.css).

### Responsiveness

- Flexbox layouts collapse to a single column for smaller screens (e.g. ability/stat results panels, auth container).
- Pre-gen cards wrap naturally and remain readable at different widths.

---

## Technical Stack

- **HTML5 + CSS3** (Flexbox, gradients, CSS variables)
- **Vanilla JavaScript (ES6 class syntax where used)**
- **jQuery 1.12.4** (bundled) for simple event wiring and DOM updates in the generators
- **Google Fonts** (`Cinzel` / `Cinzel Decorative`) for the theme

There is **no build step** (no bundler, transpiler, or dependency manager required).

---

## Architecture & Code Tour (Developer-Facing)

### Folder structure

- [css/](css/) — modular stylesheets
- [js/](js/) — feature scripts and “service” modules
- [images/](images/) — UI images + character portraits
- [documents/](documents/) — downloadable PDFs by level

### 1) Ability Score Generator

- UI: [abilities.html](abilities.html)
- Logic: [js/abilityGenerator.js](js/abilityGenerator.js)

**Flow**

1. Button click triggers a roll.
2. Rolls 6 abilities; each ability is `4d6` with the lowest die dropped.
3. Renders results in two views:
   - “Assigned” (STR/DEX/CON/INT/WIS/CHA)
   - “Ordered” (descending)

**Implementation note**

- The ordered view sorts the same array that was used for the assigned view. This is fine for the current UX, but if you ever need both simultaneously from the same original roll order, you’d clone the array before sorting.

### 2) Physical Stat Generator

- UI: [physical-stats.html](physical-stats.html)
- Race data model: [js/races.js](js/races.js)
- Generator logic: [js/physicalCharacteristics.js](js/physicalCharacteristics.js)

**Data model**

- `races.js` defines:
  - a shared `character` object (current selection + calculated outputs)
  - one object per race with properties like `AdultAge`, `MaxAge`, `BaseHeight`, and dice modifiers stored as strings (e.g. `"2d8"`).

**Roll mechanics (D&D style)**

- Height = `BaseHeight + rollDice(HeightModifier)`
- Weight = `BaseWeight + (HeightModRoll × rollDice(WeightModifier))`

**Range calculations**

- Min/max values are computed using minimum and maximum possible dice results from the modifiers.

**Design tradeoff**

- Race selection uses a long `if/else` mapping from UI race label → race data object. It’s explicit and easy to debug, but a strong candidate for refactoring into a lookup table for maintainability.

### 3) Pre-Generated Characters Browser

- UI: [pregen-characters.html](pregen-characters.html)
- Data provider: [js/characters-api.service.js](js/characters-api.service.js)
- Renderer + filtering: [js/characters.service.js](js/characters.service.js)
- Form handler: [js/getCharacterSelection.js](js/getCharacterSelection.js)
- Boot script: [js/app.js](js/app.js)

**Pattern used**

- A small “service” returns character objects (currently in-memory, but shaped like it could be replaced by an API call).
- A UI class (`CharacterList`) renders cards by creating DOM nodes rather than concatenating large HTML strings.

**File/link generation**

- Character portraits are loaded from `images/characters/<character_name>.jpg`.
- PDF links are generated as:
  - `documents/characters/<level>/<class> <level> [<build>] - <name>.pdf`

This convention makes adding new content simple and keeps the UI code backend-free.

---

## Running Locally

### Option A: Open directly

Open [index.html](index.html) in a browser.

### Option B (recommended): Run a local web server

Serving over HTTP avoids file:// restrictions and better matches production hosting.

Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

Node (one option):

```bash
npx serve
```

### VS Code task

This workspace includes a task named **Open in Browser** that opens:
`http://2020ancientwhitearmyvet.localhost/`

If you don’t have that local hostname mapped, use the HTTP server approach above.

---

## Extending the Project

### Add / update a race

1. Add or update the race object in [js/races.js](js/races.js).
2. Ensure the UI label in [physical-stats.html](physical-stats.html) matches the race label used in [js/physicalCharacteristics.js](js/physicalCharacteristics.js).

### Add / update a pregenerated character

1. Add a new object in [js/characters-api.service.js](js/characters-api.service.js).
2. Add the portrait JPG to `images/characters/` using the **exact** `character_name` as the filename.
3. Add the PDF to `documents/characters/<level>/` following the naming convention described above.

---

## Quality Notes (What I’d Improve Next)

This repo is intentionally simple, but there are clear “next steps” that would raise maintainability and polish:

- Replace the large `if/else` race mapping with a data-driven lookup.
- Add lightweight linting/formatting (ESLint/Prettier) even without a build.
- Improve accessibility (e.g., consistent `alt` text, focus states, ARIA labeling for the hamburger menu).
- Remove debug `console.log` statements in the character list renderer.

---

## Troubleshooting

- Buttons not responding: check the DevTools Console for JavaScript errors and verify scripts are loading.
- Missing character images: confirm `images/characters/<character_name>.jpg` exists (punctuation/case must match).
- Broken PDF links: confirm the PDF filename matches the generated pattern.

---

## Credits / License

Copyright © 2020 Frank Jamison.

This repository is a personal toolset for tabletop RPG character creation assistance.
