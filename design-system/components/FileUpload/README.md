A single-file picker in the shape of a 24px panel input: a file icon, the file name and size, and a clear button. It is hand-written for this system and is not in the repository.

## When to use
Use it when an experiment needs one non-image file, such as a font, JSON, SVG or HTML snippet. Use `ImageUpload` for one image and `MultiImageUpload` for several.

## Consumer provides
- Markup: `.field.file-upload` with a `.field-label` and `.input-wrap.file-upload__wrap[role=button][tabindex=0]`. Inside it go `.input-icon > img[data-icon="file"]`, `[data-upload-name]` (its text is the placeholder), `[data-upload-meta]`, `button.upload-clear[data-upload-clear][hidden]` and `input[type=file].upload-file-input`.
- `ExperimentKit.FileUpload(root, { accept, maxSize, placeholder, label, onChange(file | null), onError(reason, file) })` returns `{ element, input, getFile(), setFile(file, notify?), clear(notify?), setDisabled(disabled) }`.

## Behaviour
- Clicking the row, pressing Enter or Space, or dropping a file onto it opens or accepts one file. Dragging over it shows the `focus-border` border.
- `accept` works the same way as the native attribute (`.html,.css`, `image/*`, `text/plain`). A rejected file calls `onError('type' | 'size', file)` and changes nothing.
- The empty state shows the placeholder in `ink-muted`. Once filled, the name is in `ink` and the size in `ink-muted`.
- Wire `onChange` to `applyAll()` like every other control.
