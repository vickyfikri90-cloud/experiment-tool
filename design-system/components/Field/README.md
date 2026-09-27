The wrapper for one labelled panel control: a `.field-label` above one or more `.row`s.

## Consumer provides
- `<div class="field">` with `<label class="field-label" for>` (or `<span class="field-label">`) and a `.row` holding `.input-wrap`s.
- `ExperimentKit.Field(root)` → `{ element }` (no behaviour).

## Rules
- Always wrap controls in `.field`: 240px wide, 16px side padding, 16px below.
- Two controls side by side share one `.row` (8px gap).
