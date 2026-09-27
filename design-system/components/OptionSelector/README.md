A searchable dropdown: type to filter, arrow keys to move, Enter or click to choose.

## Consumer provides
- `.field.option-selector` with a `.field-label` and `.input-wrap.input-wrap--label.option-selector__wrap` holding `input.option-selector__input` and an empty `.option-selector__menu[role=listbox]`.
- `ExperimentKit.OptionSelector(root, { options, value, label, onChange(value, item) })` — options are strings or `{ value, label }`. Returns `{ element, input, getValue(), getLabel(), setValue(), openMenu(), closeMenu() }`.

## Behaviour
- Escape or clicking outside reverts to the last selection. Only one selector menu is open at a time (`option-selector:close-all`).
- The black menu can extend past the panel. Give its container `overflow: visible`.
