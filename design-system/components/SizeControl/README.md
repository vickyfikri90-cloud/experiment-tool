Width and height inputs side by side in one row, with a lock aspect ratio button. The button shows a chain icon when locked and a broken chain when unlocked. It lives in the repo at `Components/SizeControl/`.

## When to use
Use it for any element with a fixed pixel size: preview boxes, cards, images, canvases. Use `DimensionControl` instead when a side can also be "Hug Content".

## Consumer provides
- Markup: `.field.size-control` > `.row` holding two `.input-wrap`s (with `W` / `H` `.input-icon`s, `input[data-size-width]` and `input[data-size-height]`) and `button.size-control__lock[data-size-lock] > img`.
- `ExperimentKit.SizeControl(root, { width, height, locked, min, max, precision, step, label, onChange({ width, height, locked }) })` returns `{ element, widthInput, heightInput, lockButton, getValue(), getRatio(), setValue(w, h, notify?), getLocked(), setLocked(locked, notify?) }`.

## Behaviour
- Turning the lock on captures the current ratio. While locked, typing or arrow-stepping one side updates the other from that ratio, so values never drift. For example, 1920×1080 locked, then W=960, gives H=540.
- If either side is 0 when locking, the ratio is captured on the next edit that makes both sides non-zero.
- Values are clamped to `min` / `max` (default 0 to ∞) and rounded to `precision` decimals (default 0, whole px). ↑/↓ steps by `step` (default 1, Shift steps by 8).
- `setValue()` while locked re-captures the ratio from the new values.
- The lock button is 24×24:
  - off: transparent with a 50% `link-broken` icon,
  - on: `input-bg` fill with a 100% `link` icon,
  - hover: `hover-overlay`,
  - focus: `focus-border` border.
  `aria-pressed` and `data-tooltip` ("Lock / Unlock aspect ratio") follow the state.
- Icons are adapted from Lucide (ISC).
