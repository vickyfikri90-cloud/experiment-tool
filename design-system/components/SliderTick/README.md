A slider whose track shows tick marks and snaps to them.

## Consumer provides
- Same markup as Slider inside `.slider-tick-field`, plus `.slider-ticks` with N `.slider-tick-mark` spans.
- `ExperimentKit.SliderTick(root, options)` — Slider's options; `tickCount` defaults to the number of marks (or 7). Returns the Slider controller.

## Rules
- Keep the number of `.slider-tick-mark` spans equal to `tickCount`. ↑/↓ moves one tick.
