window.initRippleButtonExperiment = function initRippleButtonExperiment() {
  const preview = document.querySelector('[data-experiment-preview="button-ripple"]');
  const panelRoot = document.querySelector('[data-experiment-panel="button-ripple"]');
  if (!preview || !panelRoot || preview.dataset.experimentReady === '1') return;

  const utils = window.ComponentUtils;
  const ripple = window.initRippleButton(preview, {});
  const btn = ripple.element;

  const controls = {
    labelText: document.getElementById('exp-button-ripple-label-text'),
    fontSize: document.getElementById('exp-button-ripple-font-size'),
    fontWeight: document.getElementById('exp-button-ripple-font-weight'),
    paddingX: document.getElementById('exp-button-ripple-padding-x'),
    radius: document.getElementById('exp-button-ripple-radius'),
    tileSize: document.getElementById('exp-button-ripple-tile-size'),
    tileGap: document.getElementById('exp-button-ripple-tile-gap'),
    waves: document.getElementById('exp-button-ripple-waves'),
    wavelength: document.getElementById('exp-button-ripple-wavelength'),
    glow: document.getElementById('exp-button-ripple-glow'),
    intensity: document.getElementById('exp-button-ripple-intensity'),
    duration: document.getElementById('exp-button-ripple-duration'),
    count: document.getElementById('exp-button-ripple-count'),
    gap: document.getElementById('exp-button-ripple-gap'),
    fade: document.getElementById('exp-button-ripple-fade'),
  };

  const originSelector = window.initOptionSelector(document.getElementById('exp-button-ripple-origin-root'), {
    value: 'click',
    options: [
      { value: 'click', label: 'Click point' },
      { value: 'center', label: 'Center' },
    ],
    onChange: applyAll,
  });

  const easing = window.initCubicBezierInput(document.getElementById('exp-button-ripple-easing-root'), {
    onChange: applyAll,
  });

  const dimensions = window.initDimensionControlGroup(panelRoot, {
    width: {
      initialMode: 'hug',
      measure: () => Math.max(Math.round(btn.offsetWidth), 0),
      onChange: applyAll,
    },
    height: {
      initialMode: 'fixed',
      measure: () => Math.max(Math.round(btn.offsetHeight), 0),
      onChange: applyAll,
    },
  });

  const bgColor = window.initColorSelector(document.getElementById('exp-button-ripple-bg-color-root'), {
    onChange: applyAll,
  });

  const textColor = window.initColorSelector(document.getElementById('exp-button-ripple-text-color-root'), {
    onChange: applyAll,
  });

  const dotColor = window.initColorSelector(document.getElementById('exp-button-ripple-glow-color-root'), {
    onChange: applyAll,
  });

  const snippet = window.initSnippetOutput(document.getElementById('exp-button-ripple-snippet-root'), {
    filename: 'button-ripple.html',
    getContent: generateSnippet,
    updateOnInit: false,
  });

  utils.bindInputWrapInputs(panelRoot);

  Object.values(controls).forEach((input) => {
    if (!(input instanceof HTMLInputElement)) return;
    input.addEventListener('input', applyAll);
    if (input !== controls.labelText) utils.bindNumericArrowKey(input, applyAll);
  });

  const colorFields = [
    ['bg', bgColor],
    ['text', textColor],
    ['dot', dotColor],
  ];

  function collectSettings() {
    const data = {
      label: controls.labelText.value,
      fontSize: controls.fontSize.value,
      fontWeight: controls.fontWeight.value,
      paddingX: controls.paddingX.value,
      radius: controls.radius.value,
      tileSize: controls.tileSize.value,
      tileGap: controls.tileGap.value,
      waves: controls.waves.value,
      wavelength: controls.wavelength.value,
      glow: controls.glow.value,
      intensity: controls.intensity.value,
      duration: controls.duration.value,
      count: controls.count.value,
      gap: controls.gap.value,
      fade: controls.fade.value,
      origin: originSelector.getValue(),
      easing: easing.getRaw(),
      widthMode: dimensions.width.getMode(),
      widthValue: dimensions.width.getValue(),
      heightMode: dimensions.height.getMode(),
      heightValue: dimensions.height.getValue(),
    };
    colorFields.forEach(([key, field]) => {
      data[`${key}Hex`] = field.hexInput.value;
      data[`${key}Opacity`] = field.opacityInput.value;
    });
    return data;
  }

  function applySettings(data) {
    if (!data) return;

    if (data.label != null) controls.labelText.value = data.label;
    ['fontSize', 'fontWeight', 'paddingX', 'radius', 'tileSize', 'tileGap', 'waves', 'wavelength', 'glow', 'intensity', 'duration', 'count', 'gap', 'fade']
      .forEach((key) => {
        if (data[key] != null) controls[key].value = data[key];
      });
    if (data.origin != null) originSelector.setValue(data.origin, false);
    if (data.easing != null) easing.setRaw(data.easing, false);

    colorFields.forEach(([key, field]) => {
      if (data[`${key}Hex`] != null) field.hexInput.value = data[`${key}Hex`];
      if (data[`${key}Opacity`] != null) field.opacityInput.value = data[`${key}Opacity`];
      field.updateUI(false);
    });

    if (data.widthMode) {
      dimensions.width.setMode(data.widthMode, false);
      if (data.widthMode === 'fixed' && data.widthValue != null) {
        dimensions.width.element.querySelector('.dimension-fixed-input').value =
          String(data.widthValue).replace(/px$/i, '');
      }
    }

    if (data.heightMode) {
      dimensions.height.setMode(data.heightMode, false);
      if (data.heightMode === 'fixed' && data.heightValue != null) {
        dimensions.height.element.querySelector('.dimension-fixed-input').value =
          String(data.heightValue).replace(/px$/i, '');
      }
    }
  }

  window.ExperimentSettings = window.ExperimentSettings || {};
  window.ExperimentSettings['button-ripple'] = {
    collect: collectSettings,
    apply: applySettings,
  };

  function getConfig() {
    return {
      label: controls.labelText.value,
      width: dimensions.width.getValue(),
      height: dimensions.height.getValue(),
      fontSize: Math.max(1, utils.parsePx(controls.fontSize.value, 16)),
      fontWeight: Math.min(900, Math.max(100, Math.round(utils.parsePx(controls.fontWeight.value, 500)))),
      paddingX: Math.max(0, utils.parsePx(controls.paddingX.value, 28)),
      radius: Math.max(0, utils.parsePx(controls.radius.value, 28)),
      bg: bgColor.getColor(),
      color: textColor.getColor(),
      dotColor: dotColor.getColor(),
      tileSize: Math.max(1, utils.parsePx(controls.tileSize.value, 6)),
      tileGap: Math.max(0, utils.parsePx(controls.tileGap.value, 1)),
      waves: Math.min(8, Math.max(1, Math.round(utils.parsePx(controls.waves.value, 3)))),
      wavelength: Math.max(2, utils.parsePx(controls.wavelength.value, 14)),
      glow: Math.max(0, utils.parsePx(controls.glow.value, 2)),
      intensity: Math.min(100, Math.max(0, utils.parsePx(controls.intensity.value, 45))),
      duration: Math.max(100, utils.parseMs(controls.duration.value, 1200)),
      count: Math.min(5, Math.max(1, Math.round(utils.parsePx(controls.count.value, 2)))),
      gap: Math.max(0, utils.parseMs(controls.gap.value, 220)),
      fade: Math.min(100, Math.max(0, utils.parsePx(controls.fade.value, 60))),
      origin: originSelector.getValue(),
      easingRaw: easing.getRaw() || '0.25, 0.1, 0.25, 1',
    };
  }

  function cssSize(value, fallback) {
    return value.toLowerCase() === 'auto' ? 'auto' : `${utils.parsePx(value, fallback)}px`;
  }

  function rippleOptions(config) {
    return {
      dotColor: config.dotColor,
      tileSize: config.tileSize,
      tileGap: config.tileGap,
      waves: config.waves,
      wavelength: config.wavelength,
      glow: config.glow,
      intensity: config.intensity,
      duration: config.duration,
      count: config.count,
      gap: config.gap,
      fade: config.fade,
      origin: config.origin,
      easingRaw: config.easingRaw,
    };
  }

  function applyAll() {
    const config = getConfig();

    ripple.setLabel(config.label);
    ripple.set(rippleOptions(config));
    ripple.applyStyles({
      width: cssSize(config.width, 0),
      height: cssSize(config.height, 56),
      padding: `0 ${config.paddingX}px`,
      borderRadius: `${config.radius}px`,
      background: config.bg,
      color: config.color,
      fontSize: `${config.fontSize}px`,
      fontWeight: String(config.fontWeight),
    });

    dimensions.width.updateLabel();
    dimensions.height.updateLabel();
    snippet.update();
  }

  const pending = window.__pendingExperimentDefaults?.['button-ripple'];
  if (pending) applySettings(pending);
  applyAll();

  function generateSnippet() {
    const config = getConfig();
    const label = utils.escapeHtml(config.label);
    const options = JSON.stringify(rippleOptions(config), null, 2).replace(/\n/g, '\n      ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ripple Button</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      overflow: hidden;
    }

${window.RippleButtonSnippet?.css || ''}

    .ripple-button {
      width: ${cssSize(config.width, 0)};
      height: ${cssSize(config.height, 56)};
      padding: 0 ${config.paddingX}px;
      border-radius: ${config.radius}px;
      background: ${config.bg};
      color: ${config.color};
      font-size: ${config.fontSize}px;
      font-weight: ${config.fontWeight};
    }
  </style>
</head>
<body>
  <button id="btn" class="ripple-button" type="button">${label}</button>

  <script>
${window.RippleButtonSnippet?.js || ''}
    window.initRippleButton(document.getElementById('btn'), ${options});
  <\/script>
</body>
</html>`;
  }

  preview.dataset.experimentReady = '1';
};
