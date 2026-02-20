# AncientWhiteArmyVet's RPG Tools v2020.1

Static, no-build **Dungeons & Dragons 5e** character helper tools (HTML/CSS/JS). Everything runs in the browser; there’s no bundler, no compilation, and no runtime backend required.

- GitHub repository: https://github.com/FrankJamison/AncientWhiteArmyVets-RPG-Tools-v2020.1
- Primary pages:
  - Home: [index.html](index.html)
  - Physical Stat Generator: [physical-stats.html](physical-stats.html)
  - Ability Score Generator: [abilities.html](abilities.html)
  - Pre-Generated Characters Browser: [pregen-characters.html](pregen-characters.html)

---

## Developer Quickstart

### Prerequisites

- Any modern browser (Chrome/Edge/Firefox)
- Git
- One of the following (recommended) for a local HTTP server:
  - Python 3, or
  - Node.js (for `npx serve`)

No additional dependencies are required.

### Clone

```bash
git clone https://github.com/FrankJamison/AncientWhiteArmyVets-RPG-Tools-v2020.1.git
cd AncientWhiteArmyVets-RPG-Tools-v2020.1
```

### Run locally (recommended)

Serving over HTTP avoids `file://` restrictions and matches real hosting.

Python (Windows):

```bash
py -m http.server 8000
```

Python (macOS/Linux):

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000/`

Node alternative:

```bash
npx serve
```

### Open directly (works, but not ideal)

You can open [index.html](index.html) directly in a browser, but some browsers are stricter about local file access and may behave differently than HTTP hosting.

### Optional: Apache / XAMPP (Windows)

If you prefer XAMPP/Apache:

1. Point Apache’s document root (or a vhost) at this repository folder.
2. Browse to the site via `http://localhost/<path>/` or your vhost URL.

Notes:

- Some developers map a custom hostname like `2020ancientwhitearmyvet.localhost` to `127.0.0.1`. That’s optional and environment-specific.
- VS Code tasks may exist in your local environment (for starting/stopping XAMPP, etc.), but they are not required and are not assumed by this repo.

---

## Repo Layout

- [index.html](index.html), [abilities.html](abilities.html), [physical-stats.html](physical-stats.html), [pregen-characters.html](pregen-characters.html) — top-level pages
- [css/](css/) — modular stylesheets
- [js/](js/) — feature scripts and simple “service” modules
- [images/](images/) — UI images + character portraits
- [documents/](documents/) — downloadable PDFs grouped by level

---

## How It Works (Code Tour)

### Ability Score Generator

- UI: [abilities.html](abilities.html)
- Logic: [js/abilityGenerator.js](js/abilityGenerator.js)

Flow:

1. A button click triggers a roll.
2. Rolls 6 abilities; each ability is `4d6` drop-lowest.
3. Renders results as:
   - “Assigned” (STR/DEX/CON/INT/WIS/CHA)
   - “Ordered” (sorted high → low)

Implementation note: the ordered view sorts the same array used for the assigned view. If you ever need both views from the same unsorted roll state, clone the array before sorting.

### Physical Stat Generator

- UI: [physical-stats.html](physical-stats.html)
- Race data model: [js/races.js](js/races.js)
- Generator logic: [js/physicalCharacteristics.js](js/physicalCharacteristics.js)

The race data includes numeric bases plus dice modifiers stored as strings like `"2d8"`.

D&D-style mechanics:

- Height = `BaseHeight + rollDice(HeightModifier)`
- Weight = `BaseWeight + (HeightModRoll × rollDice(WeightModifier))`

Developer note: race selection currently uses an explicit `if/else` mapping from UI label → race object. It’s easy to debug but is a candidate for a lookup-table refactor if you expand the race list further.

### Pre-Generated Characters Browser

- UI: [pregen-characters.html](pregen-characters.html)
- “API”/data source (in-memory): [js/characters-api.service.js](js/characters-api.service.js)
- Renderer: [js/characters.service.js](js/characters.service.js)
- Bootstrapping: [js/app.js](js/app.js)

The character list is rendered by creating DOM nodes (not templated strings). Character assets are derived from character properties (see conventions below).

---

## Content & Data Conventions

This project is “backend-free”, so filenames matter.

### Adding/updating a race

1. Add/update the race object in [js/races.js](js/races.js).
2. Ensure the UI label in [physical-stats.html](physical-stats.html) matches the value expected by [js/physicalCharacteristics.js](js/physicalCharacteristics.js).
3. Manually test a few generations and verify min/max ranges look sane.

### Adding/updating a pregenerated character

1. Add a new object to the `characters` array in [js/characters-api.service.js](js/characters-api.service.js).
2. Add portrait image:
   - Path: `images/characters/<character_name>.jpg`
   - `<character_name>` must exactly match `character.character_name` (including spaces/punctuation).
3. Add PDF:
   - Path: `documents/characters/<level>/`
   - Filename pattern used by the UI:
     - `<class> <level> [<build>] - <name>.pdf`

Where that pattern comes from:

- The download link is assembled in [js/characters.service.js](js/characters.service.js) using the selected class/level and the character’s build/name.

Tip: if you rename an image or PDF, update the corresponding character fields so the generated paths still match.

---

## Contributing / Development Workflow

### Branching

```bash
git checkout main
git pull
git checkout -b your-name/short-description
```

### What to validate before a PR

- Load `http://localhost:8000/` and click through each primary page
- Verify console is clean (or document any known logs)
- Confirm newly added character images and PDFs resolve correctly

### Style & conventions

- Keep changes small and localized (this is a static site).
- Prefer consistent naming with existing code.
- Avoid introducing new tooling unless it provides clear value (no-build is a core constraint).

---

## Troubleshooting

- Buttons not responding: open DevTools Console and verify scripts are loading (404s often indicate wrong relative paths due to server root).
- Missing character images: confirm `images/characters/<character_name>.jpg` exists and matches punctuation/case.
- Broken PDF links: confirm the PDF path and filename match the generated pattern.
- Weird behavior on `file://`: run a local HTTP server instead.

---

## Credits / License

Copyright © 2020 Frank Jamison.

This repository is a personal toolset for tabletop RPG character creation assistance.
