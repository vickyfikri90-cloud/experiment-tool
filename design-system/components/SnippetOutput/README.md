A read-only code box showing the experiment's exported HTML, with a Download HTML button.

## Consumer provides
- `.field.code-field` with `textarea.snippet-output[data-snippet-output]` and `button.download-btn[data-snippet-download]`.
- `ExperimentKit.SnippetOutput(root, { getContent, filename, updateOnInit })` → `{ element, output, update() }`.

## Rules
- Call `snippet.update()` at the end of every `applyAll()`.
- Escape user text with `ExperimentKit.utils.escapeHtml` inside `getContent`.
- Uses `code` (DM Mono 9/16) — the only mono text in the kit.
