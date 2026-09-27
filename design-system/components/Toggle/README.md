An on/off switch row: a 24×16 track with a label, built on `<button role="switch">`.

## Consumer provides
- `.field.toggle-field` with a `.field-label` and `.toggle-stack` of `button.toggle-row` (`.toggle-switch > .toggle-switch__knob` + `.toggle-row__label`). Add `is-on` / `disabled` in markup for the initial state.
- `ExperimentKit.Toggle(root, { label, rowLabel, checked, disabled, onChange(checked, row, index) })` → `{ element, rows[], getChecked(), setChecked(), setDisabled() }`. Options apply to the first row.

## Rules
- On = `control-fill` track; off = `control-fill-off`; disabled = 50% opacity.
