A cubic-bézier easing editor: a 208×200 draggable curve above a text input, kept in sync.

## Consumer provides
- The component's SVG markup (`[data-bezier-svg]`, curve, two handle lines, `[data-bezier-p1]`, `[data-bezier-p2]`) and `.input-wrap.cubic-bezier-value-input > [data-bezier-text]`.
- `ExperimentKit.CubicBezierInput(root, { value, onChange(css) })` → `{ element, textInput, getRaw(), getValue(), getValues(), setRaw(), setValues(x1, y1, x2, y2), updateUI() }`. `getValue()` returns `cubic-bezier(...)`.

## Behaviour
- Accepts `0.7, 0, 0.25, 1` or a full `cubic-bezier(...)`. X is clamped to 0–1 and Y to −0.5–1.5.
- Arrow keys on a focused handle nudge by 0.01 (Shift 0.05). Handles use `bezier-handle`, and the curve uses `bezier-curve`.
