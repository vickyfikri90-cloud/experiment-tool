A single-image drop zone: a 208×120 `input-bg` area that shows the image once chosen, with a file-name row and a clear button underneath. It is hand-written for this system and is not in the repository.

## When to use
Use it for one image that drives the preview, such as a background, texture or photo. Use `MultiImageUpload` for sets (carousel slides, galleries) and `FileUpload` for non-image files.

## Consumer provides
- Markup: `.field.image-upload` with a `.field-label` and `.image-upload__drop[role=button][tabindex=0]`. The drop zone holds `img.image-upload__icon[data-icon="upload"]`, `.image-upload__hint`, `img.image-upload__img[data-upload-image]` and `input[type=file][accept="image/*"]`. Below it goes `.input-wrap.input-wrap--label.image-upload__file` with `[data-upload-name]`, `[data-upload-meta]` and `button.upload-clear[data-upload-clear]`.
- `ExperimentKit.ImageUpload(root, { accept, maxSize, fit, value, name, label, onChange(file | null, url), onError(reason, file) })` returns `{ element, input, getFile(), getURL(), setFile(file, notify?), setURL(url, name?, notify?), clear(notify?) }`.

## Behaviour
- You can click, press Enter or Space, or drop an image. `getURL()` returns an object URL that you can use directly as `background-image` or `src`. The previous object URL is revoked whenever the image is replaced or cleared.
- `value` / `setURL` seed an existing image (a data: or blob URL). `fit` sets `object-fit` and defaults to `cover`.
- The name row appears only when an image is set.
