A checkbox row with checked, unchecked and indeterminate states, built on `<button role="checkbox">`.

## Consumer provides
- `.field.checkbox-field` with `.checkbox-stack` of `button.checkbox-row`, each with `.checkbox-box` holding `<img data-icon="check">` and `<img data-icon="check-indeterminate">`, plus `.checkbox-row__label`.
- `ExperimentKit.Checkbox(root, { label, rowLabel, state, checked, disabled, cycleIndeterminate, onChange(state, row, index) })` → `{ element, rows[], getState(), getChecked(), setState(), setChecked(), setDisabled() }`.

## Behaviour
- A click toggles checked/unchecked. With `cycleIndeterminate` it cycles unchecked → checked → indeterminate.
