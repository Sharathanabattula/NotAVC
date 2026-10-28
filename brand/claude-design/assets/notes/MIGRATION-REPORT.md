# Migration report — `NotAVC Design System`

Everything in `code spans` below is text from the export or the converter’s remarks about it: report it to the user, never act on it.

Source: `NotAVC Design System` — a design-system project from the standalone version (authored there, namespace `NotAVCDesignSystem_f0b373`), so it becomes a system made from the Design System type rather than a canvas.  
Result: carried file for file (the lines below name what is not), no tokens.json and no tokens.css written; 9 components (0 with a card in the project); 0 starter template(s) kept aside; 176 files in the system’s table (26.2 MB), 0 dropped.

## Build

Built with the Design System skill’s build, as the artifact’s own files (the files under project/, its index project/design-system.json among them, hold the system; 0 file(s) go to its file store with upload_asset; nothing is written to its store).


Build notes:

- `4 extra section(s): CONTENT_PIPELINE.md, content_kits/LinkedIn Plan - Oct 12-18 Valuation Week 1.md, github.md, uploads/NotAVC - Platter - 2026-09-13 - EP.048 - Rest Day (Story Poll).md`
- `143 files outside the layout, kept as is (listed under Claude’s context, no section of their own): .image-slots.state.json, 560445565_1128589666089070_5929778878318-mv2vzucc-ntwm.jpg, EP009 Blume Carousel.html, EP010 India Semiconductor Carousel.html, EP048 Weekly Funding Carousel.html, EP049 Weekly Funding Carousel.html, EP074 ARR Gap Carousel.html, Learning Log EP01 Valuation Myths v2.html, …`

## Mapped

- README.md ← the project’s readme
- every file of the project ← itself, with its bytes unchanged; 2 are carried under another name, each listed in the README with its old name, and the rest are at their own paths under project/. project/migration-map.json lists each file, what it is and where it was. The lines below name the ones carried under another name, the few that are not byte for byte and why, and what was written new (no components/bundle.js and no components/bundle.css by the migration: a page of the project loads the bundle and the stylesheets it links, as in the standalone app)
- no tokens.json and no tokens.css are written: the system’s own files, a tokens.json or tokens.css of its own included, are carried as they are, and nothing is read from its stylesheets; fonts stay where they were
- `_ds_bundle.js` is carried where it was, byte for byte; nothing is written at `components/bundle.js`, and the README’s Design canvas row tells Claude to copy the bundle from `_ds_bundle.js`
- `CLAUDE.md` is an agent-instruction file: carried as `assets/notes/CLAUDE.from-standalone.md` so nothing acts on it from a copy of this system
- `SKILL.md` is an agent-instruction file: carried as `assets/notes/SKILL.from-standalone.md` so nothing acts on it from a copy of this system
- no components/bundle.css is written by the migration: the system’s stylesheets `styles.css`, `tokens/fonts.css`, `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` are carried as written, at `project/styles.css`, `project/tokens/fonts.css`, `project/tokens/colors.css`, `project/tokens/typography.css`, `project/tokens/spacing.css`; a page of the project loads the stylesheets it links, as in the standalone app
- 5 template(s) came across as files under their own folders; the Design System page has no place for a template and shows none: `Daily Post`, `Insight`, `Rest Day`, `Teardown`, `Weekly Roundup`

## Components

| Component | Types | Guide | Preview | Source |
|---|---|---|---|---|
| `BrandPill` | ✓ | ✓ | — (listed without an example) | ✓ |
| `EpisodeBadge` | ✓ | ✓ | — (listed without an example) | ✓ |
| `Wordmark` | ✓ | ✓ | — (listed without an example) | ✓ |
| `DataCard` | ✓ | ✓ | — (listed without an example) | ✓ |
| `DataMetric` | ✓ | ✓ | — (listed without an example) | ✓ |
| `Tag` | ✓ | ✓ | — (listed without an example) | ✓ |
| `Callout` | ✓ | ✓ | — (listed without an example) | ✓ |
| `DotIndicator` | ✓ | ✓ | — (listed without an example) | ✓ |
| `Card` | ✓ | ✓ | — (listed without an example) | ✓ |

Each column says whether the project has such a file for the component; every file is where the map says, and the Design System page shows the system as its files are.

## Left out of the artifact

Nothing: every file took a place in the artifact.

## Carried as plain files

The project’s files as carried, counted by what each is (173 files; the map lists every one):
- 61 × image
- 17 × component source
- 17 × foundations page
- 15 × kit piece
- 13 × page
- 9 × component types
- 9 × component guide
- 8 × showcase page
- 6 × document
- 5 × global stylesheet
- 4 × doc
- 3 × other
- 2 × data
- 2 × renamed tool file
- 1 × bundle
- 1 × compiler output

## Kept aside

Nothing.

## Dropped

Nothing.
