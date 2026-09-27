Figma-style width/height input that switches between a fixed pixel value and "Hug Content".

## Consumer provides
- `.input-wrap.input-wrap--dimension[data-dimension-id="width"]` with `.dimension-control` (label + `.dimension-fixed-input`), a `.dimension-chevron` holding `<img data-icon="chevron">`, and `.dimension-menu` with `[data-dimension-mode="fixed|hug"]` buttons.
- `ExperimentKit.DimensionControl(wrap, { initialMode, measure, onChange })` or `ExperimentKit.DimensionControlGroup(root, { width: {...}, height: {...} })` keyed by `data-dimension-id`.
- Returns `{ element, getMode(), getValue(), setMode(), updateLabel(), closeMenu() }`. `getValue()` is `'auto'` in Hug mode, else the px string.

## Rules
- Call `updateLabel()` after the preview resizes so "Hug (N)" stays true.
- Only one dimension menu is open at a time (`dimension-menu:close-all`).
