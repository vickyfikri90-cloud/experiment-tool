The 24px grey input used everywhere: a text/number `<input>` with an optional letter or icon prefix and optional suffix.

## Consumer provides
- `.input-wrap` > optional `.input-icon` ("W", or an `<img>`) + `<input>` + optional `.suffix-wrap > span` ("ms"). `.input-wrap--label` insets text when there's no icon.
- `ExperimentKit.InputWrap(root, { onChange, numeric, isOpacity, step })` → `{ element, input, getValue(), setValue(v) }`.

## Behaviour
- Selects all on focus. With `numeric`, ↑/↓ steps by 1 (Shift ×8); `isOpacity` clamps 0–100; `data-arrow-step="0.1"` for fractional fields.
- For bare inputs that don't need a controller, call `ExperimentKit.utils.bindInputWrapInputs(panel)` once.
