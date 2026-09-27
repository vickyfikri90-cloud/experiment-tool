A three-column grid of square thumbnails with an add tile. Each thumbnail can be removed, and a footer shows the count and a Clear all button. It is hand-written for this system and is not in the repository.

## When to use
Use it for experiments that take a set of images, such as carousel slides, parallax layers or gallery items. Use `ImageUpload` for a single image.

## Consumer provides
- Markup: `.field.multi-image-upload` with a `.field-label` and `.multi-image-upload__grid[role=list]`. The grid holds `button.multi-image-upload__add > img[data-icon="plus"]` and `input[type=file][multiple]`. The footer, `.multi-image-upload__footer`, holds `[data-upload-count]` and `button.multi-image-upload__clear[data-upload-clear]`. Thumbnails are rendered for you.
- `ExperimentKit.MultiImageUpload(root, { accept, max, maxSize, value, label, onChange(files, items), onError(reason, file) })` returns `{ element, input, getFiles(), getItems(), add(list, notify?), remove(index, notify?), clear(notify?) }`.

## Behaviour
- The add tile opens the picker, which allows multiple files. You can also drop files anywhere on the grid, which then shows the `focus-border` border. New images are appended in order.
- Hovering or focusing a thumbnail shows a 16px black remove button. After a removal, focus moves to the next thumbnail or to the add tile.
- The add tile hides once `max` is reached. Extra files, wrong types and oversized files call `onError('max' | 'type' | 'size', file)`.
- `items` are `{ file, url, name }`. `value` seeds existing images as `{ url, name }`. Object URLs are revoked on removal.
