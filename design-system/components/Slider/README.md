A numeric value box beside a draggable 144px track.

## Consumer provides
- `.slider-field` with `.slider-field__label` and a `.slider-field__row` holding `.slider-value-wrap > .slider-value-input` and `.slider-track-wrap > .slider-track > .slider-fill + button.slider-thumb`. All four nodes are required.
- `ExperimentKit.Slider(root, { min, max, step, value, tickCount, onChange(value) })` → `{ element, input, track, getValue(), setValue(), resetToDefault(), getDefaultValue(), getTickValues() }`.

## Behaviour
- Drag the thumb, click the track, type, or ↑/↓. Double-clicking the thumb resets to `value`.
