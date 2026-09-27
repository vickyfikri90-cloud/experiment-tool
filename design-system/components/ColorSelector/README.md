A color field with a picker popover. The row looks like `ColorInput` (swatch, hex, opacity %). Clicking the swatch opens a white popover with a saturation/brightness area, a hue strip, an opacity strip, H / S / B number fields and an eyedropper button. It is hand-written for this system and is not in the repository.

## When to use
Use it when the user needs to find a color by eye. Use the synced `ColorInput` when typing a hex value is enough, and use either one consistently within a panel.

## Consumer provides
- Markup: `.field.color-selector` with a `.field-label` and `.input-wrap.color-wrap.color-selector__wrap`. The row holds `button.color-selector__trigger[data-color-trigger] > .swatch[data-color-swatch]`, `input[data-color-hex]` and `.opacity-wrap > input[data-color-opacity]` with a `%` suffix. The popover is `.color-selector__popover` with `[data-color-sv]`, `[data-color-hue]`, `[data-color-alpha]` (each holding a `.color-selector__thumb`; alpha also holds `.color-selector__alpha-fill`) and `.color-selector__hsb` holding three `.input-wrap`s with `.input-icon` letters and `input[data-color-h]`, `input[data-color-s]`, `input[data-color-b]`, followed by `button.color-selector__eyedropper[data-color-eyedropper] > img` (the icon is filled in at init).
- `ExperimentKit.ColorSelector(root, { value, opacity, label, onChange(color, { hex, opacity }) })` returns `{ element, hexInput, opacityInput, getColor(), getHex(), getOpacity(), setValue(hex, opacity?, notify?), open(), close(), destroy() }`. Call `destroy()` before removing the element (route change, re-render); it ends any eyedropper pick and removes document listeners.
- `getColor()` returns the same `rgba()` string as `ColorInput`, so the two can be swapped without changing `applyAll()`.

## Behaviour
- The popover opens below the row, 208px wide, on `surface` (white) with a `hairline` border, `radius-menu` and `shadow-menu`. It closes on outside click, on Escape (focus returns to the swatch), or when another menu opens. Only one menu is open at a time.
- You can drag or click in the area and strips. Arrow keys step by 1 (Shift steps by 10). The hex field updates live and normalizes on blur. The opacity field steps with ↑/↓.
- H (0–360), S (0–100) and B (0–100) update the color as you type. Out-of-range values are clamped, and ↑/↓ steps by 1 (Shift steps by 8). All fields stay in sync with the area, strips and hex, except the one you're typing in.
- The eyedropper (a 24×24 `input-bg` button beside B) picks any color on screen with the browser's EyeDropper API. While picking, the button turns `control-fill` with a white icon, and Escape cancels. The picked color replaces the hex and keeps the current opacity. In browsers without the API (Firefox, Safari) the button stays visible but is disabled at 50% opacity, with a tooltip explaining why.
- Only one eyedropper session runs per page, and it is always ended explicitly. On macOS, Chrome runs the picker as a separate helper process (`ColorSampler`) that can be left running if the page disappears mid-pick. So each pick is aborted when:
  - a color is picked or Escape is pressed,
  - the eyedropper button is clicked again,
  - another pick starts,
  - the popover closes or `destroy()` is called,
  - the page is hidden, unloaded, reloaded or frozen,
  - 30 seconds pass without a pick.
- Call `ExperimentKit.cancelEyedropper()` yourself before a hot reload or teardown the kit can't see (e.g. a dev-server HMR hook).
- Focus on the area and strips shows a 1px `focus-border` outline.
- Greys keep the current hue, so the hue strip doesn't jump.
