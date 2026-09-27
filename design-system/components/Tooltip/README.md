A small black tooltip with white text that labels controls on hover or keyboard focus. It is hand-written for this system and is not in the repository.

## When to use
Use it for icon-only buttons, letter prefixes ("W", "H") and any control whose purpose isn't obvious from its label. Keep it to a few words. Never put required information only in a tooltip.

## Consumer provides
- Add `data-tooltip="Width in px"` to any element, plus `data-tooltip-placement="top|bottom|left|right"` if needed (the default is `top`).
- Call `ExperimentKit.Tooltip(root = document, { delay })` once per page. It returns `{ element, attach(el, text, placement?), show(el), hide() }`. Calling it again on the same root returns the same controller.

## Look
- `menu-bg` black with `menu-text` white (21:1), in the `control` style (Inter 500, 11/16). Padding is 4px 8px, with `radius-control`, `shadow-menu`, a 4px arrow and a max width of 200px.
- One shared bubble is fixed to the viewport, placed 6px from the target. It flips to the opposite side when it doesn't fit and is clamped 4px inside the edges, with the arrow still pointing at the target.

## Behaviour
- It appears after `delay` (400ms by default) on hover, and moves instantly between neighbouring targets. It also appears on `:focus-visible` (keyboard only), and hides on leave, blur, pointer down, scroll or Escape.
- The target gets `aria-describedby` pointing at the bubble while it's shown.
- The 120ms fade is removed under `prefers-reduced-motion`.
