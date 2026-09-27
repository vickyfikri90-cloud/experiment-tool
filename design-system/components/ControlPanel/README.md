The shell for every experiment: a live preview area on the left and a 241px scrollable control panel on the right.

## When to use
Once per experiment page, as the root layout. All other controls go inside its `.panel`.

## Consumer provides
- Markup: `.cp-app` > `.cp-preview` (your experiment) + `aside.panel[data-control-panel]` (your fields). `.cp-app--fullscreen` fills the viewport.
- `ExperimentKit.ControlPanel(root)` → `{ element, append(node), setHTML(html) }` — finds the panel by `[data-control-panel]`, `[data-cp-panel]` or `.panel`.

## Rules
- Panel width is `panel-width` (241px). Don't change it without updating every field's CSS.
- Below 768px the preview stacks on top (40vh, zoomed 0.8) and the panel scrolls under it.
- Wire all panel controls to one `applyAll()` that updates the preview and then `snippet.update()`.
