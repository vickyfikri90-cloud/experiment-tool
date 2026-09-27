Hex + opacity field with a live swatch and an optional full-width colour preview.

## Consumer provides
- `.input-wrap.color-wrap` with `[data-color-swatch]`, `[data-color-hex]`, `.opacity-wrap > [data-color-opacity]` + `%`; optional `[data-color-preview]` below.
- `ExperimentKit.ColorInput(root, { onChange(color) })` → `{ element, hexInput, opacityInput, getColor(), getHex(), updateUI() }`.

## Behaviour
- Hex works with or without `#`, 3 or 6 digits. Opacity is 0–100 in the UI; `getColor()` returns an `rgba()` string. ↑/↓ steps the opacity.
