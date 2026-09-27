A vanilla-JS kit for UI experiments: a live preview on the left and a Figma-style control panel on the right, plus an exportable HTML snippet. The panel is quiet, dense and monochrome so the experiment in the preview is the only thing with personality.

## Content

- Labels are short nouns in sentence or title case: "Background color", "Easing", "Code", "Width". `.field-label` capitalizes the first letter; don't write labels in all caps.
- Menu options name the mode, not the action: "Fixed", "Hug Content". A hugged dimension shows its measured size: "Hug (160)".
- Buttons say what you get: "Download HTML".
- No emoji, no marketing copy, no helper paragraphs inside the panel.

## Layout

- The shell is `ControlPanel`: `.cp-app` holds `.cp-preview` (flex 1) and `.panel` (`panel-width`, 241px, scrolls). Below 768px the preview sits on top at 40% of the viewport and the panel scrolls beneath.
- Every control lives in a `.field`: `field-width` (240px) wide, `field-padding-x` (16px) each side, `field-gap` (16px) below. Label → control is `row-gap` (8px); side-by-side controls sit in a `.row` with `row-gap`.
- Every interactive row is `control-height` (24px). Keep it — the whole panel reads as one rhythm of 24px rows.
- Separate sections with `Divider`, not extra whitespace.

## Colour

- Ground is `surface`. Controls are `input-bg` fills with no border; text is `ink`.
- Labels and input icons use `ink-muted`. It sits at 3.9:1 on `surface` (3.6:1 on `input-bg`) — below 4.5:1 for small text. Keep it exact for fidelity; use `ink` if a label must be legible for accessibility.
- Selected/on states use `control-fill` (slider fill and thumb, toggle on, checked box). Off states use `control-fill-off` / `checkbox-border`.
- Dropdown menus invert: `menu-bg` black with `menu-text`, hovered option `menu-item-active`, `radius-menu`, `shadow-menu`.
- `bezier-handle` blue appears only in the Cubic Bézier editor. Don't spend it elsewhere.
- Focus: `.input-wrap` gets a 1px `focus-border` border; toggle/checkbox rows get a 1px `focus-border` outline at 1px offset. At 2.7:1 on `surface` it is under the 3:1 focus-ring floor — use `control-fill` for the ring where accessibility matters.

## Typography

- Set every control value, row label, menu option and button in `control` (Inter 500, 11/16, 0.055px tracking).
- Set field labels in `field-label` (Inter 500, 9/14, 0.27px) in `ink-muted`.
- `code` (DM Mono 500, 9/16) is only for the Snippet Output textarea.
- Both faces load from Google Fonts: `Inter:wght@100..900` and `DM+Mono:wght@500`.

## Shape and depth

- Corners: `radius-control` (5px) on inputs, tracks, buttons and options; `radius-menu` (8px) on menus and toggles; `radius-checkbox` (4px); `radius-app` (12px) on the shell.
- No shadows except `shadow-menu` on dropdowns, `shadow-thumb` on the slider thumb and `shadow-swatch` inside a colour swatch. Separation comes from `input-bg` fills and hairlines (`divider-line`, `hairline`, `border-subtle`).

## Behaviour

- Every control is a plain DOM template plus an `init<Name>(root, options)` function returning a small controller (`getValue`, `setValue`…). In this system they are `ExperimentKit.<Name>(root, options)`.
- Wire every `onChange` to one `applyAll()` that updates the preview, then calls `snippet.update()`.
- Text inputs select-all on focus; numeric inputs step with ↑/↓ (Shift = ×8) via `ExperimentKit.utils.bindNumericArrowKey`.
- State classes are `is-*`: `is-on`, `is-checked`, `is-indeterminate`, `is-open`, `is-fixed`, `is-active`, `is-disabled`. Query with `data-*` attributes.
- Only one menu is open at a time: menus close each other through `dimension-menu:close-all`, `option-selector:close-all` and `color-selector:close-all`.
- Escape user text in generated snippets with `ExperimentKit.utils.escapeHtml`.

## Iconography

- Three tiny inline SVG icons ship in the bundle as data URIs (`ExperimentKit.icons`): `chevron` (8×5), `check` (7×7, white), `check-indeterminate` (7×3, white). Put `<img data-icon="…">` in markup and the component fills `src` at init.
- The upload controls add five more in the same style: `upload`, `file`, `image`, `close` (8×8) and `plus` (10×10). ColorSelector adds `eyedropper` (12×12), and SizeControl adds `link` / `link-broken` (12×12). They are single-ink `#09090B` shown at 50% opacity, except the remove button's `close`, which is inverted to white on `menu-bg`.
- Input prefixes are letters ("W", "H") in `ink-muted`, not icons. The Cubic Bézier input carries its own easing glyph inline.

## Uploads

- Use `FileUpload` for one non-image file, `ImageUpload` for one image and `MultiImageUpload` for a set of images. All three accept click, keyboard (Enter or Space) and drag-and-drop.
- They follow the panel rules. `FileUpload` is a 24px `input-wrap` row. `ImageUpload` is a 120px `input-bg` drop area with a file-name row under it. `MultiImageUpload` is a 3-column grid of square tiles with `row-gap` gaps and `radius-control` corners.
- Empty-state text is `ink-muted` ("Choose file", "Drop image or click"). A chosen file's name is `ink` and its size is `ink-muted`. Dragging over a drop target shows the `focus-border` border, the same as a focused input.
- Remove buttons on thumbnails are 16px `menu-bg` circles that appear on hover or focus.
- Use `ImageUpload.getURL()` or `MultiImageUpload.getItems()[i].url` directly as `src` or `background-image` in the preview. Object URLs are revoked for you.

## Color and tooltips

- Use `ColorSelector` when a color is chosen by eye and `ColorInput` when it is typed. Both return the same `rgba()` string. The picker popover is white (`surface`, `hairline` border, `radius-menu`, `shadow-menu`). It has no presets. Exact values go in its H / S / B fields or the hex field. The eyedropper beside B samples a color from the screen (Chromium browsers only; disabled elsewhere).
- Label icon-only or letter-prefixed controls with `data-tooltip` and call `ExperimentKit.Tooltip()` once. Tooltips are always `menu-bg` black with `menu-text` white, in the `control` style, a few words at most.

## Size

- Use `SizeControl` for fixed pixel sizes: W and H side by side in one `.row`, with the lock ratio button as the third item. Locked shows the `link` icon on an `input-bg` fill; unlocked shows `link-broken` at 50% with no fill.
- Use `DimensionControl` when a side can hug its content.

## Figma variables

- Every token in `tokens.json` has a `figma` block: variable `type` (COLOR, FLOAT shown as Number in Figma, STRING), `scopes` taken from its usage note, a suggested `name` (`color/…`, `spacing/…`, `radius/…`, `size/…`, `typography/…`), and a unit-free `value` where Figma needs one.
- Scopes follow where a token is used:
  - text colors → Text fill,
  - backgrounds and control fills → Frame / Shape fill,
  - borders and bézier lines → Stroke,
  - shadow colors → Effect color,
  - spacing → Gap (also covers padding),
  - radius → Corner radius,
  - size → Width & height,
  - Typography → Font family / weight / size / line height / letter spacing.
- Shadows can't be variables in Figma; each one is described as an Effect style.
- `radius-round` (50%) becomes 10 px in Figma, and `preview-box`'s unitless line-height 1 becomes 14 px.

## Not synced

- Only the 13 kit controls in `components-manifest.js` are included. The experiment components (HoverButton, RotateXButton, StaggerTextButton, HeadingEntrance, the carousels, HorizontalParallax, ArcScrollTransition) and their images were left out on purpose.
- No font files: Inter and DM Mono are Google-hosted in the source.
- No logo exists in the repository.
- The 13 synced components are the repo's own scripts and CSS, concatenated verbatim. Nothing was rebuilt or rewritten.
- Added after the sync: `FileUpload`, `ImageUpload`, `MultiImageUpload`, `ColorSelector`, `Tooltip` and `SizeControl`. They were written in the kit's pattern (DOM template + `init<Name>`) and are appended to the end of `bundle.js` and `bundle.css`. They are also in the repo as `Components/<Name>/` (local commits `14364f9` and `250a0e4`, not yet pushed at the time of writing). A re-sync from GitHub should take them from there.

---

## Consuming this system (generated — do not edit)

Every path named below is under `project/` in this design system: read `project/api/tokens.md`, not `api/tokens.md`.

If the text above differs on what to load or read, follow this section.

`components/bundle.js` defines `window.ExperimentKit` (19 components); `components/bundle.css` is its stylesheet; `tokens.css` is every token as a CSS variable plus `@font-face` for the fonts. Build any UI by mounting these components; never hand-build a control or draw an icon the system provides.

- **Standalone page:** inline `tokens.css` and `components/bundle.css` in a `<style>`, then the library files and `components/bundle.js` as classic scripts (a file containing `</style`, `</script` or `<!--` breaks an inline element: write the sequence `<\/style`, `<\/script` or `\x3C!--` in your copy, or load that file by URL).
- **Design canvas:** bring `components/bundle.css`, `components/bundle.js` and `components/index.d.ts` (for the editor’s props panel) onto the canvas in full, as the canvas type’s design-system components reference says (a server-side copy first where it offers one); load the stylesheet before the script; mount with `<x-import component-from-global-scope="ExperimentKit.<Comp>" …>`.
- **Slides deck, or any surface that cannot run the bundle:** tokens only — the values are on `api/tokens.md`; the deck takes `tokens.json` by file path for its colour pickers.

**Read, per thing:** a component’s props, parts and examples: `api/components/<Comp>.md`; token values: `api/tokens.md`. After this README, fetch the cards and fonts you need in ONE message as parallel calls — none depends on another.

**Two rules.** Before you use a thing — a component, a token group, an icon, an asset — read its card from the index below; a value you did not read from a card is a guess. `tokens.json`, `manifest.json`, `components/index.d.ts` and `design-system.json` are sources for tools: hand them over. `components/<Comp>/README.md` is the long-form second read a card links to; `SKILL.md` and `artifact-type/` beside them are authoring guidance, not needed to consume the system.

## Index (generated — do not edit)

**Tokens**

- `api/tokens.md` — Every token: surface, text, border, palette, type, spacing, radius, shadow, size. (7.3k)

**Components** (`api/components/<Comp>.md`, 19)

- **Shell**: `ControlPanel` — The shell for every experiment: a live preview area on the left and a 241px scrollable control panel on the right
- **Primitives**: `Field` — The wrapper for one labelled panel control: a .field-label above one or more .rows · `InputWrap` — The 24px grey input used everywhere: a text/number with an optional letter or icon prefix and optional suffix · `DimensionControl` — Figma-style width/height input that switches between a fixed pixel value and "Hug Content" · `ColorInput` — Hex + opacity field with a live swatch and an optional full-width colour preview · `SnippetOutput` — A read-only code box showing the experiment's exported HTML, with a Download HTML button · `Slider` — A numeric value box beside a draggable 144px track · `SliderTick` — A slider whose track shows tick marks and snaps to them · `Divider` — A 1px hairline that separates sections of the control panel · `OptionSelector` — A searchable dropdown: type to filter, arrow keys to move, Enter or click to choose · `Toggle` — An on/off switch row: a 24×16 track with a label, built on  · `Checkbox` — A checkbox row with checked, unchecked and indeterminate states, built on  · `CubicBezierInput` — A cubic-bézier easing editor: a 208×200 draggable curve above a text input, kept in sync · `FileUpload` — A single-file picker in the shape of a 24px panel input: a file icon, the file name and size, and a clear button · `ImageUpload` — A single-image drop zone: a 208×120 input-bg area that shows the image once chosen, with a file-name row and a clear button underneath · `MultiImageUpload` — A three-column grid of square thumbnails with an add tile · `ColorSelector` — A color field with a picker popover · `Tooltip` — A small black tooltip with white text that labels controls on hover or keyboard focus · `SizeControl` — Width and height inputs side by side in one row, with a lock aspect ratio button
