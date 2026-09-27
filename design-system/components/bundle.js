/* @ds-bundle: {"format":4,"namespace":"ExperimentKit","components":[{"name":"ControlPanel"},{"name":"Field"},{"name":"InputWrap"},{"name":"DimensionControl"},{"name":"ColorInput"},{"name":"SnippetOutput"},{"name":"Slider"},{"name":"SliderTick"},{"name":"Divider"},{"name":"OptionSelector"},{"name":"Toggle"},{"name":"Checkbox"},{"name":"CubicBezierInput"},{"name":"FileUpload"},{"name":"ImageUpload"},{"name":"MultiImageUpload"},{"name":"ColorSelector"},{"name":"Tooltip"},{"name":"SizeControl"}]} */
/* Experiment Tool kit controls — concatenated verbatim from vickyfikri90-cloud/experiment-tool Components/ (load order of experiment-tool.js). */

/* ---- shared/utils.js ---- */
window.ComponentUtils = {
  parsePx(value, fallback) {
    const n = parseFloat(String(value).trim());
    return Number.isFinite(n) ? n : fallback;
  },

  parseMs(value, fallback) {
    return this.parsePx(value, fallback);
  },

  parseOpacity(value, fallback = 1) {
    const n = parseFloat(String(value).trim());
    if (!Number.isFinite(n)) return fallback;
    const opacity = n > 1 ? n / 100 : n;
    return Math.min(Math.max(opacity, 0), 1);
  },

  normalizeHex(value) {
    let hex = String(value).trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    return /^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex.toUpperCase()}` : value.trim();
  },

  hexToRgba(hex, alpha) {
    let h = this.normalizeHex(hex).replace('#', '');
    if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) return hex;

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  colorWithOpacity(colorValue, opacityValue) {
    const color = this.normalizeHex(colorValue);
    const opacity = this.parseOpacity(opacityValue, 1);

    if (!color) return `rgba(0, 0, 0, ${opacity})`;
    if (color.startsWith('rgba(') || color.startsWith('hsla(')) return color;
    if (color.startsWith('#')) return this.hexToRgba(color, opacity);
    if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
    }

    return color;
  },

  escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  bindInputBehavior(input) {
    if (!input || input.dataset.inputBehaviorBound) return;

    input.dataset.inputBehaviorBound = 'true';

    input.addEventListener('mousedown', (event) => {
      if (document.activeElement === input) {
        event.preventDefault();
      }
    });

    input.addEventListener('focus', () => {
      requestAnimationFrame(() => {
        if (document.activeElement !== input) return;
        input.select();
      });
    });
  },

  bindInputWrapInputs(root = document) {
    root.querySelectorAll('.input-wrap input').forEach((input) => {
      this.bindInputBehavior(input);
    });
  },

  // Binding the same input more than once (e.g. by a component and again by
  // the experiment app) shares one keydown handler, so each key press steps
  // once and every registered onChange still runs.
  // Step is 1 (Shift: 8) by default; set `options.step` or `data-arrow-step`
  // for fine-grained fields (e.g. 0.1 for scale, Shift steps 10×).
  bindNumericArrowKey(input, onChange, options = {}) {
    if (!input) return;

    let binding = input.__numericArrowKey;
    if (binding) {
      if (onChange) binding.handlers.push(onChange);
      if (options.isOpacity) binding.isOpacity = true;
      if (options.step != null) binding.step = options.step;
      return;
    }

    binding = {
      handlers: onChange ? [onChange] : [],
      isOpacity: !!options.isOpacity,
      step: options.step,
    };
    input.__numericArrowKey = binding;

    input.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

      event.preventDefault();

      const raw = input.value.trim();
      const match = raw.match(/^(-?\d*\.?\d+)(.*)$/);
      if (!match) return;

      const base = Number(binding.step ?? input.dataset.arrowStep) || 1;
      const step = event.shiftKey ? (base === 1 ? 8 : base * 10) : base;
      const delta = event.key === 'ArrowUp' ? step : -step;

      let next = Math.round((parseFloat(match[1]) + delta) * 1e6) / 1e6;
      const suffix = match[2];

      if (binding.isOpacity) {
        next = Math.min(100, Math.max(0, next));
      }

      input.value = `${next}${suffix}`;
      binding.handlers.forEach((handler) => handler());
    });
  },

  loadStylesheet(href, id) {
    if (document.querySelector(`link[data-component-style="${id}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.componentStyle = id;
    document.head.appendChild(link);
  },

  loadScript(src, id) {
    if (document.querySelector(`script[data-component-script="${id}"]`)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.dataset.componentScript = id;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  },
};

/* ---- shared/icons.js ---- */
window.ComponentIcons = {
  chevron: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB2aWV3Qm94PSIwIDAgOCA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBvcGFjaXR5PSIwLjQiIGQ9Ik0zLjcwMzEyIDQuNDA2MjVMMCAwLjcwMzEyNUwwLjcwMzEyNSAwTDEuMDYyNSAwLjM0Mzc1TDMuNzAzMTIgM0w2LjcwMzEyIDBMNy40MjE4OCAwLjcwMzEyNUw3LjA2MjUgMS4wNjI1TDMuNzAzMTIgNC40MDYyNVoiIGZpbGw9IiMwOTA5MEIiLz4KPC9zdmc+Cg==',
  check: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB2aWV3Qm94PSIwIDAgNyA3IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMC44MzMwMDggMy43NDk2N0wyLjQ5OTY3IDUuNDE2MzRMNS44MzMwMSAwLjgzMzAwOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjY2NjY3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==',
  'check-indeterminate': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIzIiB2aWV3Qm94PSIwIDAgNyAzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNC44MzMwMSAwQzUuNjYxNDQgMCA2LjMzMzAxIDAuNjcxNTczIDYuMzMzMDEgMS41QzYuMzMzMDEgMi4zMjg0MyA1LjY2MTQ0IDMgNC44MzMwMSAzSDEuNUMwLjY3MTU3MyAzIDAgMi4zMjg0MyAwIDEuNUMwIDAuNjcxNTczIDAuNjcxNTczIDAgMS41IDBINC44MzMwMVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
};

/* ---- Field/component.js ---- */
window.initField = function initField(root) {
  return { element: root.querySelector('.field') || root };
};

/* ---- InputWrap/component.js ---- */
window.initInputWrap = function initInputWrap(root, options = {}) {
  const input = root.querySelector('input');
  const onChange = options.onChange;

  if (input) {
    window.ComponentUtils.bindInputBehavior(input);
  }

  if (input && onChange) {
    input.addEventListener('input', onChange);
  }

  if (input && options.numeric) {
    window.ComponentUtils.bindNumericArrowKey(input, onChange, options);
  }

  return {
    element: root.querySelector('.input-wrap') || root,
    input,
    getValue() {
      return input?.value ?? '';
    },
    setValue(value) {
      if (input) input.value = value;
    },
  };
};

/* ---- DimensionControl/component.js ---- */
window.initDimensionControl = function initDimensionControl(root, options = {}) {
  const wrap = root.querySelector('.input-wrap--dimension') || root;
  const control = wrap.querySelector('.dimension-control');
  const modeLabel = wrap.querySelector('.dimension-mode-label');
  const menu = wrap.querySelector('.dimension-menu');
  const chevron = wrap.querySelector('.dimension-chevron');
  const fixedInput = wrap.querySelector('.dimension-fixed-input');
  const chevronImg = wrap.querySelector('[data-icon="chevron"]');

  if (chevronImg && window.ComponentIcons?.chevron) {
    chevronImg.src = window.ComponentIcons.chevron;
  }

  let mode = options.initialMode === 'fixed' ? 'fixed' : 'hug';
  const measure = options.measure || (() => 0);
  const onChange = options.onChange;

  function updateLabel() {
    if (mode !== 'hug') return;
    modeLabel.textContent = `Hug (${Math.max(Math.round(measure()), 0)})`;
  }

  function applyModeUI() {
    control.classList.toggle('is-fixed', mode === 'fixed');
    fixedInput.disabled = mode !== 'fixed';

    menu.querySelectorAll('[data-dimension-mode]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.dimensionMode === mode);
    });
  }

  function setMode(nextMode, shouldNotify = true) {
    const previousMode = mode;
    mode = nextMode === 'fixed' ? 'fixed' : 'hug';
    applyModeUI();

    if (mode === 'fixed') {
      if (previousMode === 'hug') {
        fixedInput.value = String(Math.max(Math.round(measure()), 0));
      }
    } else {
      updateLabel();
    }

    if (shouldNotify) onChange?.();
    else updateLabel();
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    wrap.classList.remove('is-menu-open');
  }

  function toggleMenu() {
    const willOpen = !menu.classList.contains('is-open');
    document.dispatchEvent(new CustomEvent('dimension-menu:close-all'));
    if (!willOpen) return;
    menu.classList.add('is-open');
    wrap.classList.add('is-menu-open');
  }

  menu.querySelectorAll('[data-dimension-mode]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      setMode(button.dataset.dimensionMode);
      closeMenu();
      // Focus only when the user picks Fixed, not on init/restore (it would
      // pop the keyboard on mobile).
      if (mode === 'fixed') {
        fixedInput.focus();
        fixedInput.select();
      }
    });
  });

  chevron.addEventListener('click', (event) => {
    event.preventDefault();
    toggleMenu();
  });

  modeLabel.addEventListener('click', (event) => {
    event.preventDefault();
    toggleMenu();
  });

  chevron.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  });

  window.ComponentUtils.bindInputBehavior(fixedInput);

  fixedInput.addEventListener('input', () => onChange?.());

  window.ComponentUtils.bindNumericArrowKey(fixedInput, () => onChange?.());

  wrap.addEventListener('dimension-menu:close', closeMenu);

  document.addEventListener('click', (event) => {
    if (event.target.closest('.input-wrap--dimension') === wrap) return;
    closeMenu();
  });

  document.addEventListener('dimension-menu:close-all', closeMenu);

  setMode(mode, false);

  return {
    element: wrap,
    getMode: () => mode,
    getValue() {
      return mode === 'hug' ? 'auto' : fixedInput.value.trim();
    },
    setMode,
    updateLabel,
    closeMenu,
  };
};

window.initDimensionControlGroup = function initDimensionControlGroup(root, configs = {}) {
  const instances = {};

  root.querySelectorAll('.input-wrap--dimension').forEach((wrap) => {
    const key = wrap.dataset.dimensionId;
    if (!key || !configs[key]) return;
    instances[key] = initDimensionControl(wrap, configs[key]);
  });

  return instances;
};

/* ---- ColorInput/component.js ---- */
window.initColorInput = function initColorInput(root, options = {}) {
  const utils = window.ComponentUtils;
  const hexInput = root.querySelector('[data-color-hex]');
  const opacityInput = root.querySelector('[data-color-opacity]');
  const swatch = root.querySelector('[data-color-swatch]');
  const preview = root.querySelector('[data-color-preview]');
  const onChange = options.onChange;

  function getColor() {
    return utils.colorWithOpacity(hexInput.value, opacityInput.value);
  }

  function updateUI(notify = true) {
    const color = getColor();
    if (swatch) swatch.style.background = color;
    if (preview) preview.style.background = color;
    if (notify) onChange?.(color);
  }

  utils.bindInputBehavior(hexInput);
  utils.bindInputBehavior(opacityInput);

  hexInput?.addEventListener('input', () => updateUI());
  opacityInput?.addEventListener('input', () => updateUI());

  if (opacityInput) {
    utils.bindNumericArrowKey(opacityInput, () => updateUI(), { isOpacity: true });
  }

  updateUI(false);

  return {
    element: root,
    hexInput,
    opacityInput,
    getColor,
    getHex: () => utils.normalizeHex(hexInput.value),
    updateUI,
  };
};

/* ---- SnippetOutput/component.js ---- */
window.initSnippetOutput = function initSnippetOutput(root, options = {}) {
  const output = root.querySelector('[data-snippet-output]');
  const downloadBtn = root.querySelector('[data-snippet-download]');
  const getContent = options.getContent || (() => '');
  const filename = options.filename || 'snippet.html';

  function update() {
    if (output) output.value = getContent();
  }

  downloadBtn?.addEventListener('click', () => {
    const blob = new Blob([getContent()], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  });

  if (options.updateOnInit !== false) {
    update();
  }

  return {
    element: root,
    output,
    update,
  };
};

/* ---- Slider/component.js ---- */
window.initSlider = function initSlider(root, options = {}) {
  const utils = window.ComponentUtils;
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const step = options.step ?? 1;
  const tickCount = options.tickCount ?? 0;
  const onChange = options.onChange;

  const input = root.querySelector('.slider-value-input');
  const track = root.querySelector('.slider-track');
  const fill = root.querySelector('.slider-fill');
  const thumb = root.querySelector('.slider-thumb');

  if (!input || !track || !fill || !thumb) {
    throw new Error('initSlider: missing slider elements');
  }

  let dragging = false;

  function clamp(value) {
    return Math.min(max, Math.max(min, value));
  }

  function parseValue(raw) {
    const n = parseFloat(String(raw).trim());
    return Number.isFinite(n) ? clamp(n) : min;
  }

  const defaultValue = parseValue(options.value ?? input.value);

  function getTickValues() {
    if (tickCount < 2) return null;

    return Array.from({ length: tickCount }, (_, index) => (
      min + (index / (tickCount - 1)) * (max - min)
    ));
  }

  function snapToTick(value) {
    const ticks = getTickValues();
    if (!ticks) return value;

    let nearest = ticks[0];
    let nearestDistance = Math.abs(value - nearest);

    ticks.forEach((tick) => {
      const distance = Math.abs(value - tick);
      if (distance < nearestDistance) {
        nearest = tick;
        nearestDistance = distance;
      }
    });

    return nearest;
  }

  function formatValue(value) {
    const rounded = Math.round(value * 1000) / 1000;
    return Number.isInteger(rounded) ? String(rounded) : String(rounded);
  }

  function toPercent(value) {
    if (max === min) return 0;
    return ((value - min) / (max - min)) * 100;
  }

  function setValue(raw, shouldNotify = true) {
    let value = parseValue(raw);
    const ticks = getTickValues();

    if (ticks) {
      value = snapToTick(value);
    } else if (step > 0) {
      value = Math.round((value - min) / step) * step + min;
      value = clamp(value);
    }

    input.value = formatValue(value);
    const percent = toPercent(value);
    fill.style.width = `${percent}%`;
    thumb.style.left = `${percent}%`;

    if (shouldNotify) onChange?.(value);
    return value;
  }

  function valueFromClientX(clientX) {
    const rect = track.getBoundingClientRect();
    const ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;
    const value = min + ratio * (max - min);
    return setValue(value);
  }

  function getCurrentTickIndex() {
    const ticks = getTickValues();
    if (!ticks) return -1;

    const current = parseValue(input.value);
    let index = ticks.findIndex((tick) => Math.abs(tick - current) < 0.001);
    if (index !== -1) return index;

    let nearestIndex = 0;
    let nearestDistance = Math.abs(current - ticks[0]);
    ticks.forEach((tick, tickIndex) => {
      const distance = Math.abs(current - tick);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = tickIndex;
      }
    });

    return nearestIndex;
  }

  function stopDragging() {
    dragging = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', stopDragging);
  }

  function onPointerMove(event) {
    if (!dragging) return;
    valueFromClientX(event.clientX);
  }

  track.addEventListener('pointerdown', (event) => {
    if (event.target === thumb) return;
    valueFromClientX(event.clientX);
  });

  thumb.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    dragging = true;
    thumb.setPointerCapture?.(event.pointerId);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDragging);
  });

  thumb.addEventListener('dblclick', (event) => {
    event.preventDefault();
    setValue(defaultValue);
  });

  input.addEventListener('input', () => {
    setValue(input.value);
  });

  input.addEventListener('change', () => {
    setValue(input.value);
  });

  if (tickCount >= 2) {
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

      const ticks = getTickValues();
      if (!ticks) return;

      event.preventDefault();

      let index = getCurrentTickIndex();
      index += event.key === 'ArrowUp' ? 1 : -1;
      index = Math.min(ticks.length - 1, Math.max(0, index));
      setValue(ticks[index]);
    });
  } else {
    utils.bindNumericArrowKey(input, () => setValue(input.value));
  }

  setValue(defaultValue, false);

  return {
    element: root.querySelector('.slider-field')
      || root.querySelector('.slider-tick-field')
      || root,
    input,
    track,
    getTickValues,
    getValue: () => parseValue(input.value),
    getDefaultValue: () => defaultValue,
    resetToDefault: () => setValue(defaultValue),
    setValue,
  };
};

/* ---- SliderTick/component.js ---- */
window.initSliderTick = function initSliderTick(root, options = {}) {
  const markCount = root.querySelectorAll('.slider-tick-mark').length;
  const tickCount = options.tickCount ?? (markCount || 7);

  return window.initSlider(root, { ...options, tickCount });
};

/* ---- Divider/component.js ---- */
window.initDivider = function initDivider(root) {
  return {
    element: root.querySelector('.panel-divider') || root,
  };
};

/* ---- OptionSelector/component.js ---- */
window.initOptionSelector = function initOptionSelector(root, options = {}) {
  const field = root.querySelector('.option-selector') || root;
  const wrap = root.querySelector('.option-selector__wrap');
  const input = root.querySelector('.option-selector__input');
  const menu = root.querySelector('.option-selector__menu');
  const labelEl = root.querySelector('.field-label');

  if (!wrap || !input || !menu) {
    throw new Error('initOptionSelector: missing option selector elements');
  }

  const defaultOptions = [
    'Achilees',
    'Matt Demon',
    'Odessey',
    'Christopher Nolan',
    'Christian Bale',
    'James Gunn',
    'Jason',
  ];

  const items = (options.options || defaultOptions).map((item) => {
    if (typeof item === 'string') return { value: item, label: item };
    return {
      value: item.value,
      label: item.label ?? String(item.value),
    };
  });

  const onChange = options.onChange;
  const escapeHtml = window.ComponentUtils?.escapeHtml || ((value) => String(value));

  let selectedValue = options.value ?? input.value ?? items[0]?.value ?? '';
  let filterActive = false;
  let activeIndex = 0;

  if (options.label && labelEl) {
    labelEl.textContent = options.label;
  }

  function selectedItem() {
    return items.find((item) => item.value === selectedValue)
      || items.find((item) => item.label === selectedValue)
      || null;
  }

  function selectedLabel() {
    return selectedItem()?.label ?? selectedValue;
  }

  input.value = selectedLabel();

  function getFiltered() {
    if (!filterActive) return items;

    const query = input.value.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => item.label.toLowerCase().includes(query));
  }

  function setActiveIndex(index) {
    const buttons = menu.querySelectorAll('.option-selector__option');
    if (!buttons.length) return;

    activeIndex = index;
    buttons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === activeIndex);
    });
    buttons[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }

  function renderMenu() {
    const filtered = getFiltered();

    if (!filtered.length) {
      menu.innerHTML = '';
      wrap.classList.remove('is-menu-open');
      menu.classList.remove('is-open');
      return;
    }

    if (activeIndex >= filtered.length) {
      activeIndex = Math.max(filtered.length - 1, 0);
    }

    wrap.classList.add('is-menu-open');
    menu.classList.add('is-open');
    menu.innerHTML = filtered.map((item, index) => (
      `<button type="button" class="option-selector__option${index === activeIndex ? ' is-active' : ''}" role="option" data-index="${index}">${escapeHtml(item.label)}</button>`
    )).join('');
  }

  function isOpen() {
    return menu.classList.contains('is-open');
  }

  function openMenu() {
    document.dispatchEvent(new CustomEvent('option-selector:close-all', {
      detail: { except: wrap },
    }));
    renderMenu();
  }

  function closeMenu() {
    wrap.classList.remove('is-menu-open');
    menu.classList.remove('is-open');
    filterActive = false;
  }

  function commitSelection(item, shouldNotify = true) {
    if (!item) return;

    selectedValue = item.value;
    input.value = item.label;
    closeMenu();

    if (shouldNotify) onChange?.(item.value, item);
  }

  function selectActive() {
    const filtered = getFiltered();
    const item = filtered[activeIndex];
    if (item) commitSelection(item);
  }

  function revertToSelected() {
    input.value = selectedLabel();
    closeMenu();
  }

  window.ComponentUtils?.bindInputBehavior(input);

  input.addEventListener('focus', () => {
    filterActive = false;
    activeIndex = 0;
    openMenu();
  });

  input.addEventListener('input', () => {
    filterActive = true;
    activeIndex = 0;
    openMenu();
  });

  input.addEventListener('keydown', (event) => {
    const filtered = getFiltered();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen()) {
        activeIndex = 0;
        openMenu();
        return;
      }
      if (!filtered.length) return;
      setActiveIndex((activeIndex + 1) % filtered.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen()) {
        activeIndex = 0;
        openMenu();
        return;
      }
      if (!filtered.length) return;
      setActiveIndex((activeIndex - 1 + filtered.length) % filtered.length);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (isOpen()) selectActive();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      revertToSelected();
      input.blur();
    }
  });

  menu.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  menu.addEventListener('mousemove', (event) => {
    const option = event.target.closest('.option-selector__option');
    if (!option) return;

    const index = Number(option.dataset.index);
    if (Number.isNaN(index) || index === activeIndex) return;

    setActiveIndex(index);
  });

  menu.addEventListener('click', (event) => {
    const option = event.target.closest('.option-selector__option');
    if (!option) return;

    const filtered = getFiltered();
    commitSelection(filtered[Number(option.dataset.index)]);
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.option-selector__wrap') === wrap) return;
    if (!isOpen()) return;
    revertToSelected();
  });

  document.addEventListener('option-selector:close-all', (event) => {
    if (event.detail?.except === wrap) return;
    if (isOpen()) revertToSelected();
  });

  return {
    element: field,
    input,
    getValue: () => selectedValue,
    getLabel: () => selectedLabel(),
    setValue(value, shouldNotify = false) {
      const match = items.find((item) => item.value === value)
        || items.find((item) => item.label === value);
      if (!match) return;
      commitSelection(match, shouldNotify);
    },
    openMenu,
    closeMenu: revertToSelected,
  };
};

/* ---- Toggle/component.js ---- */
window.initToggle = function initToggle(root, options = {}) {
  const field = root.querySelector('.toggle-field') || root;
  const labelEl = root.querySelector('.field-label');
  const rows = [...root.querySelectorAll('.toggle-row')];
  const onChange = options.onChange;

  if (!rows.length) {
    throw new Error('initToggle: missing toggle rows');
  }

  if (options.label && labelEl) {
    labelEl.textContent = options.label;
  }

  function applyRow(row, checked) {
    row.classList.toggle('is-on', checked);
    row.setAttribute('aria-checked', checked ? 'true' : 'false');
  }

  function isOn(row) {
    return row.classList.contains('is-on') || row.getAttribute('aria-checked') === 'true';
  }

  function bindRow(row, index) {
    applyRow(row, isOn(row));

    row.addEventListener('click', () => {
      if (row.disabled) return;

      const checked = !isOn(row);
      applyRow(row, checked);
      onChange?.(checked, row, index);
    });

    return {
      element: row,
      getChecked: () => isOn(row),
      setChecked(checked, shouldNotify = false) {
        applyRow(row, Boolean(checked));
        if (shouldNotify) onChange?.(Boolean(checked), row, index);
      },
      setDisabled(disabled) {
        row.disabled = Boolean(disabled);
        row.classList.toggle('is-disabled', Boolean(disabled));
      },
    };
  }

  const controls = rows.map(bindRow);
  const primary = controls[0];

  if (typeof options.checked === 'boolean') {
    primary.setChecked(options.checked);
  }

  if (typeof options.disabled === 'boolean') {
    primary.setDisabled(options.disabled);
  }

  if (options.rowLabel) {
    const text = primary.element.querySelector('.toggle-row__label');
    if (text) text.textContent = options.rowLabel;
  }

  return {
    element: field,
    rows: controls,
    getChecked: primary.getChecked,
    setChecked: primary.setChecked,
    setDisabled: primary.setDisabled,
  };
};

/* ---- Checkbox/component.js ---- */
window.initCheckbox = function initCheckbox(root, options = {}) {
  const field = root.querySelector('.checkbox-field') || root;
  const labelEl = root.querySelector('.field-label');
  const rows = [...root.querySelectorAll('.checkbox-row')];
  const onChange = options.onChange;
  const icons = window.ComponentIcons || {};

  if (!rows.length) {
    throw new Error('initCheckbox: missing checkbox rows');
  }

  if (options.label && labelEl) {
    labelEl.textContent = options.label;
  }

  root.querySelectorAll('[data-icon="check"]').forEach((img) => {
    if (icons.check) img.src = icons.check;
  });

  root.querySelectorAll('[data-icon="check-indeterminate"]').forEach((img) => {
    if (icons['check-indeterminate']) img.src = icons['check-indeterminate'];
  });

  function getState(row) {
    if (row.classList.contains('is-indeterminate') || row.getAttribute('aria-checked') === 'mixed') {
      return 'indeterminate';
    }
    if (row.classList.contains('is-checked') || row.getAttribute('aria-checked') === 'true') {
      return 'checked';
    }
    return 'unchecked';
  }

  function applyState(row, state) {
    row.classList.toggle('is-checked', state === 'checked');
    row.classList.toggle('is-indeterminate', state === 'indeterminate');
    row.setAttribute(
      'aria-checked',
      state === 'indeterminate' ? 'mixed' : state === 'checked' ? 'true' : 'false'
    );
  }

  function nextState(state) {
    if (options.cycleIndeterminate) {
      if (state === 'unchecked') return 'checked';
      if (state === 'checked') return 'indeterminate';
      return 'unchecked';
    }

    return state === 'checked' ? 'unchecked' : 'checked';
  }

  function bindRow(row, index) {
    applyState(row, getState(row));

    row.addEventListener('click', () => {
      if (row.disabled) return;

      const state = nextState(getState(row));
      applyState(row, state);
      onChange?.(state, row, index);
    });

    return {
      element: row,
      getState: () => getState(row),
      getChecked: () => getState(row) === 'checked',
      setState(state, shouldNotify = false) {
        const next = state === 'indeterminate' || state === 'checked' ? state : 'unchecked';
        applyState(row, next);
        if (shouldNotify) onChange?.(next, row, index);
      },
      setChecked(checked, shouldNotify = false) {
        this.setState(checked ? 'checked' : 'unchecked', shouldNotify);
      },
      setDisabled(disabled) {
        row.disabled = Boolean(disabled);
        row.classList.toggle('is-disabled', Boolean(disabled));
      },
    };
  }

  const controls = rows.map(bindRow);
  const primary = controls[0];

  if (options.state) {
    primary.setState(options.state);
  } else if (typeof options.checked === 'boolean') {
    primary.setChecked(options.checked);
  }

  if (typeof options.disabled === 'boolean') {
    primary.setDisabled(options.disabled);
  }

  if (options.rowLabel) {
    const text = primary.element.querySelector('.checkbox-row__label');
    if (text) text.textContent = options.rowLabel;
  }

  return {
    element: field,
    rows: controls,
    getState: primary.getState,
    getChecked: primary.getChecked,
    setState: primary.setState,
    setChecked: primary.setChecked,
    setDisabled: primary.setDisabled,
  };
};

/* ---- CubicBezierInput/component.js ---- */
window.initCubicBezierInput = function initCubicBezierInput(root, options = {}) {
  const utils = window.ComponentUtils;
  const textInput = root.querySelector('[data-bezier-text]');
  const svg = root.querySelector('[data-bezier-svg]');
  const curve = root.querySelector('[data-bezier-curve]');
  const line1 = root.querySelector('[data-bezier-line1]');
  const line2 = root.querySelector('[data-bezier-line2]');
  const handleP1 = root.querySelector('[data-bezier-p1]');
  const handleP2 = root.querySelector('[data-bezier-p2]');
  const onChange = options.onChange;

  const PLOT = { left: 29, top: 25, width: 150, height: 150 };
  const Y_MIN = -0.5;
  const Y_MAX = 1.5;
  const DEFAULT_VALUES = [0.7, 0, 0.25, 1];

  let values = [...DEFAULT_VALUES];
  let dragging = null;

  function clampX(value) {
    return Math.min(1, Math.max(0, value));
  }

  function clampY(value) {
    return Math.min(Y_MAX, Math.max(Y_MIN, value));
  }

  function clampValues(nextValues) {
    return [
      clampX(nextValues[0]),
      clampY(nextValues[1]),
      clampX(nextValues[2]),
      clampY(nextValues[3]),
    ];
  }

  function roundValue(value) {
    const rounded = Math.round(value * 1000) / 1000;
    return Number.isInteger(rounded) ? rounded : rounded;
  }

  function parseRaw(raw) {
    const trimmed = String(raw ?? '').trim();
    if (!trimmed) return [...DEFAULT_VALUES];

    let inner = trimmed;
    if (trimmed.startsWith('cubic-bezier(') && trimmed.endsWith(')')) {
      inner = trimmed.slice('cubic-bezier('.length, -1);
    }

    const parts = inner.split(',').map((part) => parseFloat(part.trim()));
    if (parts.length === 4 && parts.every((part) => Number.isFinite(part))) {
      return clampValues(parts);
    }

    return null;
  }

  function formatRaw(nextValues) {
    return nextValues.map(roundValue).join(', ');
  }

  function formatCss(nextValues) {
    return `cubic-bezier(${nextValues.map(roundValue).join(', ')})`;
  }

  function getEasing() {
    const parsed = parseRaw(textInput?.value);
    if (parsed) return formatCss(parsed);

    const raw = textInput?.value.trim();
    if (!raw) return formatCss(DEFAULT_VALUES);
    if (raw.startsWith('cubic-bezier(')) return raw;
    return raw;
  }

  function bezierToSvg(x, y) {
    return {
      x: PLOT.left + x * PLOT.width,
      y: PLOT.top + (1 - y) * PLOT.height,
    };
  }

  function pointFromClient(clientX, clientY) {
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;

    const local = point.matrixTransform(matrix.inverse());
    return {
      x: clampX((local.x - PLOT.left) / PLOT.width),
      y: clampY(1 - ((local.y - PLOT.top) / PLOT.height)),
    };
  }

  function updateVisual() {
    const [x1, y1, x2, y2] = values;
    const start = bezierToSvg(0, 0);
    const end = bezierToSvg(1, 1);
    const p1 = bezierToSvg(x1, y1);
    const p2 = bezierToSvg(x2, y2);

    curve.setAttribute(
      'd',
      `M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`
    );

    line1.setAttribute('x1', start.x);
    line1.setAttribute('y1', start.y);
    line1.setAttribute('x2', p1.x);
    line1.setAttribute('y2', p1.y);

    line2.setAttribute('x1', end.x);
    line2.setAttribute('y1', end.y);
    line2.setAttribute('x2', p2.x);
    line2.setAttribute('y2', p2.y);

    handleP1.setAttribute('cx', p1.x);
    handleP1.setAttribute('cy', p1.y);
    handleP2.setAttribute('cx', p2.x);
    handleP2.setAttribute('cy', p2.y);

    handleP1.setAttribute('aria-valuetext', `${roundValue(x1)}, ${roundValue(y1)}`);
    handleP2.setAttribute('aria-valuetext', `${roundValue(x2)}, ${roundValue(y2)}`);
  }

  function setValues(nextValues, notify = true, updateText = true) {
    values = clampValues(nextValues);

    if (updateText && textInput) {
      textInput.value = formatRaw(values);
    }

    updateVisual();

    if (notify) onChange?.(getEasing());
  }

  function setRaw(raw, notify = true) {
    const parsed = parseRaw(raw);
    if (parsed) {
      setValues(parsed, notify, true);
      return true;
    }

    updateVisual();
    if (notify) onChange?.(getEasing());
    return false;
  }

  function updateFromText(notify = true, normalize = false) {
    const parsed = parseRaw(textInput?.value);
    if (!parsed) {
      if (notify) onChange?.(getEasing());
      return;
    }

    values = parsed;
    if (normalize && textInput) {
      textInput.value = formatRaw(values);
    }
    updateVisual();
    if (notify) onChange?.(getEasing());
  }

  function stopDragging() {
    if (!dragging) return;

    dragging.handle.classList.remove('is-dragging');
    dragging = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', stopDragging);

    if (textInput) textInput.value = formatRaw(values);
    onChange?.(getEasing());
  }

  function onPointerMove(event) {
    if (!dragging) return;

    const point = pointFromClient(event.clientX, event.clientY);
    if (!point) return;

    const nextValues = [...values];
    if (dragging.index === 0) {
      nextValues[0] = point.x;
      nextValues[1] = point.y;
    } else {
      nextValues[2] = point.x;
      nextValues[3] = point.y;
    }

    setValues(nextValues, false, false);
  }

  function startDragging(handle, index, event) {
    event.preventDefault();
    dragging = { handle, index };
    handle.classList.add('is-dragging');
    handle.setPointerCapture?.(event.pointerId);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDragging);
  }

  function nudgeHandle(index, dx, dy) {
    const nextValues = [...values];
    nextValues[index * 2] = clampX(nextValues[index * 2] + dx);
    nextValues[index * 2 + 1] = clampY(nextValues[index * 2 + 1] + dy);
    setValues(nextValues, true, true);
  }

  function bindHandle(handle, index) {
    handle.addEventListener('pointerdown', (event) => startDragging(handle, index, event));

    handle.addEventListener('keydown', (event) => {
      const step = event.shiftKey ? 0.05 : 0.01;
      let handled = false;

      if (event.key === 'ArrowLeft') {
        nudgeHandle(index, -step, 0);
        handled = true;
      } else if (event.key === 'ArrowRight') {
        nudgeHandle(index, step, 0);
        handled = true;
      } else if (event.key === 'ArrowUp') {
        nudgeHandle(index, 0, step);
        handled = true;
      } else if (event.key === 'ArrowDown') {
        nudgeHandle(index, 0, -step);
        handled = true;
      }

      if (handled) event.preventDefault();
    });
  }

  if (textInput) {
    utils.bindInputBehavior(textInput);
    textInput.addEventListener('input', () => updateFromText(true, false));
    textInput.addEventListener('change', () => updateFromText(true, true));
  }

  bindHandle(handleP1, 0);
  bindHandle(handleP2, 1);

  const initialRaw = options.value ?? textInput?.value ?? formatRaw(DEFAULT_VALUES);
  setRaw(initialRaw, false);

  return {
    element: root.querySelector('.cubic-bezier-field') || root,
    textInput,
    getRaw: () => textInput?.value.trim() ?? '',
    getValue: getEasing,
    getValues: () => [...values],
    setRaw,
    setValues: (x1, y1, x2, y2) => setValues([x1, y1, x2, y2]),
    updateUI: (notify = false) => setValues(values, notify, true),
  };
};

/* ---- ControlPanel/component.js ---- */
window.initControlPanel = function initControlPanel(root) {
  const panel = root.querySelector('[data-control-panel]')
    || root.querySelector('[data-cp-panel]')
    || root.querySelector('.panel')
    || root;

  return {
    element: panel,
    append(node) {
      panel.appendChild(node);
    },
    setHTML(html) {
      panel.innerHTML = html;
    },
  };
};

/* ---- namespace ---- */
window.ExperimentKit = {
  ControlPanel: window.initControlPanel,
  Field: window.initField,
  InputWrap: window.initInputWrap,
  DimensionControl: window.initDimensionControl,
  DimensionControlGroup: window.initDimensionControlGroup,
  ColorInput: window.initColorInput,
  SnippetOutput: window.initSnippetOutput,
  Slider: window.initSlider,
  SliderTick: window.initSliderTick,
  Divider: window.initDivider,
  OptionSelector: window.initOptionSelector,
  Toggle: window.initToggle,
  Checkbox: window.initCheckbox,
  CubicBezierInput: window.initCubicBezierInput,
  utils: window.ComponentUtils,
  icons: window.ComponentIcons,
};

/* ==== Intentional additions — hand-written in the kit's pattern, NOT in the repository ==== */
/* FileUpload, ImageUpload, MultiImageUpload: DOM template + window.init<Name>(root, options) → controller. */

(function () {
  function svg(body, w, h) {
    return 'data:image/svg+xml;base64,' + btoa(
      '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" fill="none" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>'
    );
  }
  var icons = window.ComponentIcons || (window.ComponentIcons = {});
  icons.upload = svg('<path d="M6 8V1.5M6 1.5L3.25 4.25M6 1.5L8.75 4.25" stroke="#09090B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1.5 8.5V10.5H10.5V8.5" stroke="#09090B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>', 12, 12);
  icons.file = svg('<path d="M2.5 1H7L9.5 3.5V11H2.5V1Z" stroke="#09090B" stroke-width="1.1" stroke-linejoin="round"/><path d="M7 1V3.5H9.5" stroke="#09090B" stroke-width="1.1" stroke-linejoin="round"/>', 12, 12);
  icons.image = svg('<rect x="1" y="1.5" width="10" height="9" rx="1.5" stroke="#09090B" stroke-width="1.1"/><circle cx="4.25" cy="4.5" r="1" fill="#09090B"/><path d="M1.5 9L4.5 6.5L6.5 8L8.5 6L10.5 8" stroke="#09090B" stroke-width="1.1" stroke-linejoin="round"/>', 12, 12);
  icons.close = svg('<path d="M1 1L7 7M7 1L1 7" stroke="#09090B" stroke-width="1.2" stroke-linecap="round"/>', 8, 8);
  icons.plus = svg('<path d="M5 1V9M1 5H9" stroke="#09090B" stroke-width="1.2" stroke-linecap="round"/>', 10, 10);

  function fillIcons(root) {
    root.querySelectorAll('img[data-icon]').forEach(function (img) {
      var src = icons[img.dataset.icon];
      if (src && !img.getAttribute('src')) img.src = src;
    });
  }

  function acceptMatches(file, accept) {
    if (!accept) return true;
    var name = (file.name || '').toLowerCase();
    var type = (file.type || '').toLowerCase();
    return accept.split(',').some(function (raw) {
      var rule = raw.trim().toLowerCase();
      if (!rule) return false;
      if (rule.charAt(0) === '.') return name.slice(-rule.length) === rule;
      if (rule.slice(-2) === '/*') return type.indexOf(rule.slice(0, -1)) === 0;
      return type === rule;
    });
  }

  function formatSize(bytes) {
    if (!Number.isFinite(bytes)) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (Math.round(bytes / 102.4 / 1024) / 10) + ' MB';
  }

  // Click + keyboard open the picker; drag-and-drop adds `is-dragover`.
  function bindDropTarget(target, input, onFiles, clickSelector) {
    target.addEventListener('click', function (event) {
      if (event.target === input) return;
      if (event.target.closest('[data-upload-clear], [data-upload-remove]')) return;
      if (clickSelector && !event.target.closest(clickSelector)) return;
      if (target.classList.contains('is-disabled')) return;
      input.click();
    });
    target.addEventListener('keydown', function (event) {
      if (event.target !== target) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        input.click();
      }
    });
    var depth = 0;
    target.addEventListener('dragenter', function (event) {
      event.preventDefault();
      depth += 1;
      target.classList.add('is-dragover');
    });
    target.addEventListener('dragover', function (event) {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    });
    target.addEventListener('dragleave', function () {
      depth = Math.max(depth - 1, 0);
      if (!depth) target.classList.remove('is-dragover');
    });
    target.addEventListener('drop', function (event) {
      event.preventDefault();
      depth = 0;
      target.classList.remove('is-dragover');
      var files = event.dataTransfer ? Array.prototype.slice.call(event.dataTransfer.files) : [];
      if (files.length) onFiles(files);
    });
    input.addEventListener('change', function () {
      var files = Array.prototype.slice.call(input.files || []);
      input.value = '';
      if (files.length) onFiles(files);
    });
  }

  /* ---------------- FileUpload ---------------- */
  window.initFileUpload = function initFileUpload(root, options) {
    options = options || {};
    var field = root.querySelector('.file-upload') || root;
    var wrap = root.querySelector('.file-upload__wrap');
    var input = root.querySelector('input[type="file"]');
    var nameEl = root.querySelector('[data-upload-name]');
    var metaEl = root.querySelector('[data-upload-meta]');
    var clearBtn = root.querySelector('[data-upload-clear]');
    var labelEl = root.querySelector('.field-label');
    if (!wrap || !input || !nameEl) throw new Error('initFileUpload: missing file upload elements');

    var accept = options.accept != null ? options.accept : input.getAttribute('accept') || '';
    if (accept) input.setAttribute('accept', accept);
    var placeholder = options.placeholder || nameEl.textContent || 'Choose file';
    var maxSize = options.maxSize;
    var onChange = options.onChange;
    var onError = options.onError;
    var file = null;

    if (options.label && labelEl) labelEl.textContent = options.label;
    fillIcons(root);

    function render() {
      wrap.classList.toggle('is-filled', !!file);
      nameEl.textContent = file ? file.name : placeholder;
      nameEl.title = file ? file.name : '';
      if (metaEl) metaEl.textContent = file ? formatSize(file.size) : '';
      if (clearBtn) clearBtn.hidden = !file;
    }

    function setFile(next, notify) {
      if (next && accept && !acceptMatches(next, accept)) {
        if (onError) onError('type', next);
        return false;
      }
      if (next && maxSize && next.size > maxSize) {
        if (onError) onError('size', next);
        return false;
      }
      file = next || null;
      render();
      if (notify !== false && onChange) onChange(file);
      return true;
    }

    bindDropTarget(wrap, input, function (files) { setFile(files[0]); });
    if (clearBtn) {
      clearBtn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        setFile(null);
      });
    }

    render();

    return {
      element: field,
      input: input,
      getFile: function () { return file; },
      setFile: function (next, notify) { return setFile(next, notify === true); },
      clear: function (notify) { setFile(null, notify === true); },
      setDisabled: function (disabled) {
        wrap.classList.toggle('is-disabled', !!disabled);
        wrap.setAttribute('tabindex', disabled ? '-1' : '0');
        input.disabled = !!disabled;
      },
    };
  };

  /* ---------------- ImageUpload ---------------- */
  window.initImageUpload = function initImageUpload(root, options) {
    options = options || {};
    var field = root.querySelector('.image-upload') || root;
    var drop = root.querySelector('.image-upload__drop');
    var input = root.querySelector('input[type="file"]');
    var img = root.querySelector('[data-upload-image]');
    var nameEl = root.querySelector('[data-upload-name]');
    var metaEl = root.querySelector('[data-upload-meta]');
    var clearBtn = root.querySelector('[data-upload-clear]');
    var labelEl = root.querySelector('.field-label');
    if (!drop || !input || !img) throw new Error('initImageUpload: missing image upload elements');

    var accept = options.accept || input.getAttribute('accept') || 'image/*';
    input.setAttribute('accept', accept);
    var maxSize = options.maxSize;
    var onChange = options.onChange;
    var onError = options.onError;
    var state = null; // { file, url, name, owned }

    if (options.label && labelEl) labelEl.textContent = options.label;
    if (options.fit) img.style.objectFit = options.fit;
    fillIcons(root);

    function release() {
      if (state && state.owned) URL.revokeObjectURL(state.url);
    }

    function render() {
      var filled = !!state;
      field.classList.toggle('is-filled', filled);
      drop.classList.toggle('is-filled', filled);
      if (filled) img.src = state.url; else img.removeAttribute('src');
      img.alt = filled ? state.name : '';
      if (nameEl) nameEl.textContent = filled ? state.name : '';
      if (metaEl) metaEl.textContent = filled && state.file ? formatSize(state.file.size) : '';
      if (clearBtn) clearBtn.hidden = !filled;
    }

    function notify() {
      if (onChange) onChange(state ? state.file : null, state ? state.url : '');
    }

    function setFile(file, shouldNotify) {
      if (file && !acceptMatches(file, accept)) { if (onError) onError('type', file); return false; }
      if (file && maxSize && file.size > maxSize) { if (onError) onError('size', file); return false; }
      release();
      state = file ? { file: file, url: URL.createObjectURL(file), name: file.name, owned: true } : null;
      render();
      if (shouldNotify !== false) notify();
      return true;
    }

    function setURL(url, name, shouldNotify) {
      release();
      state = url ? { file: null, url: url, name: name || 'Image', owned: false } : null;
      render();
      if (shouldNotify) notify();
    }

    bindDropTarget(drop, input, function (files) { setFile(files[0]); });
    if (clearBtn) {
      clearBtn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        setFile(null);
      });
    }

    if (options.value) setURL(options.value, options.name, false);
    else render();

    return {
      element: field,
      input: input,
      getFile: function () { return state ? state.file : null; },
      getURL: function () { return state ? state.url : ''; },
      setFile: function (file, shouldNotify) { return setFile(file, shouldNotify === true); },
      setURL: setURL,
      clear: function (shouldNotify) { setFile(null, shouldNotify === true); },
    };
  };

  /* ---------------- MultiImageUpload ---------------- */
  window.initMultiImageUpload = function initMultiImageUpload(root, options) {
    options = options || {};
    var field = root.querySelector('.multi-image-upload') || root;
    var grid = root.querySelector('.multi-image-upload__grid');
    var addTile = root.querySelector('.multi-image-upload__add');
    var input = root.querySelector('input[type="file"]');
    var countEl = root.querySelector('[data-upload-count]');
    var clearBtn = root.querySelector('[data-upload-clear]');
    var labelEl = root.querySelector('.field-label');
    if (!grid || !addTile || !input) throw new Error('initMultiImageUpload: missing multi image upload elements');

    var accept = options.accept || input.getAttribute('accept') || 'image/*';
    input.setAttribute('accept', accept);
    input.multiple = true;
    var max = options.max || Infinity;
    var maxSize = options.maxSize;
    var onChange = options.onChange;
    var onError = options.onError;
    var escapeHtml = (window.ComponentUtils && window.ComponentUtils.escapeHtml) || function (v) { return String(v); };
    var items = []; // { file, url, name, owned }

    if (options.label && labelEl) labelEl.textContent = options.label;
    fillIcons(root);

    function render() {
      grid.querySelectorAll('.multi-image-upload__tile').forEach(function (tile) { tile.remove(); });
      items.forEach(function (item, index) {
        var tile = document.createElement('div');
        tile.className = 'multi-image-upload__tile';
        tile.setAttribute('role', 'listitem');
        tile.innerHTML =
          '<img class="multi-image-upload__img" alt="' + escapeHtml(item.name) + '" src="' + escapeHtml(item.url) + '">' +
          '<button type="button" class="upload-remove" data-upload-remove="' + index + '" aria-label="Remove ' + escapeHtml(item.name) + '">' +
          '<img src="' + icons.close + '" alt=""></button>';
        grid.insertBefore(tile, addTile);
      });
      addTile.hidden = items.length >= max;
      field.classList.toggle('is-filled', items.length > 0);
      if (countEl) {
        countEl.textContent = items.length
          ? items.length + (max !== Infinity ? ' / ' + max : '') + (items.length === 1 ? ' image' : ' images')
          : (max !== Infinity ? 'Up to ' + max + ' images' : 'No images');
      }
      if (clearBtn) clearBtn.hidden = !items.length;
    }

    function notify() {
      if (onChange) onChange(items.map(function (i) { return i.file; }).filter(Boolean), items.slice());
    }

    function add(list, shouldNotify) {
      var added = 0;
      (list || []).forEach(function (entry) {
        if (items.length >= max) { if (onError) onError('max', entry); return; }
        if (typeof File !== 'undefined' && entry instanceof File) {
          if (!acceptMatches(entry, accept)) { if (onError) onError('type', entry); return; }
          if (maxSize && entry.size > maxSize) { if (onError) onError('size', entry); return; }
          items.push({ file: entry, url: URL.createObjectURL(entry), name: entry.name, owned: true });
        } else if (entry && entry.url) {
          items.push({ file: null, url: entry.url, name: entry.name || 'Image', owned: false });
        } else {
          return;
        }
        added += 1;
      });
      render();
      if (added && shouldNotify !== false) notify();
      return added;
    }

    function remove(index, shouldNotify) {
      var item = items[index];
      if (!item) return;
      if (item.owned) URL.revokeObjectURL(item.url);
      items.splice(index, 1);
      render();
      if (shouldNotify !== false) notify();
      var next = grid.querySelector('[data-upload-remove="' + Math.min(index, items.length - 1) + '"]');
      (next || addTile).focus();
    }

    function clear(shouldNotify) {
      items.forEach(function (item) { if (item.owned) URL.revokeObjectURL(item.url); });
      items = [];
      render();
      if (shouldNotify !== false) notify();
    }

    bindDropTarget(grid, input, function (files) { add(files); }, '.multi-image-upload__add');
    grid.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-upload-remove]');
      if (!btn) return;
      event.stopPropagation();
      remove(Number(btn.dataset.uploadRemove));
    });
    if (clearBtn) {
      clearBtn.addEventListener('click', function (event) {
        event.preventDefault();
        clear();
      });
    }

    if (options.value) add(options.value, false);
    else render();

    return {
      element: field,
      input: input,
      getFiles: function () { return items.map(function (i) { return i.file; }).filter(Boolean); },
      getItems: function () { return items.map(function (i) { return { file: i.file, url: i.url, name: i.name }; }); },
      add: function (list, shouldNotify) { return add(list, shouldNotify === true); },
      remove: function (index, shouldNotify) { remove(index, shouldNotify === true); },
      clear: function (shouldNotify) { clear(shouldNotify === true); },
    };
  };

  if (window.ExperimentKit) {
    window.ExperimentKit.FileUpload = window.initFileUpload;
    window.ExperimentKit.ImageUpload = window.initImageUpload;
    window.ExperimentKit.MultiImageUpload = window.initMultiImageUpload;
  }
})();

/* ==== Intentional additions — ColorSelector, Tooltip (hand-written, NOT in the repository) ==== */

(function () {
  var clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };

  function hexToRgb(hex) {
    var h = String(hex || '').trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split('').map(function (c) { return c + c; }).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }

  function rgbToHex(r, g, b) {
    return [r, g, b].map(function (n) {
      var s = Math.round(clamp(n, 0, 255)).toString(16);
      return s.length === 1 ? '0' + s : s;
    }).join('').toUpperCase();
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h: h, s: max ? d / max : 0, v: max };
  }

  function hsvToRgb(h, s, v) {
    var c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
  }

  var EYEDROPPER_ICON = 'data:image/svg+xml;base64,' + btoa(
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.9 1.1C8.6 0.4 9.8 0.4 10.5 1.1L10.9 1.5C11.6 2.2 11.6 3.4 10.9 4.1L9.6 5.4L6.6 2.4L7.9 1.1Z" fill="#09090B"/><path d="M5.6 2.2L9.8 6.4" stroke="#09090B" stroke-width="1.2" stroke-linecap="round"/><path d="M7.6 4.3L2.9 9L2.2 9.9L1.5 10.5" stroke="#09090B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.2 4.9L3.5 9.6" stroke="#09090B" stroke-width="1.2" stroke-linecap="round"/></svg>'
  );
  var kitIcons = window.ComponentIcons || (window.ComponentIcons = {});
  kitIcons.eyedropper = EYEDROPPER_ICON;

  /*
   * One EyeDropper session per page, always ended explicitly.
   * On macOS, Chrome's picker runs as a separate helper process (ColorSampler). If the page
   * or iframe goes away while a pick is still open (reload, hot reload, tab closed, preview
   * torn down) the helper can be left running. So every pick gets an AbortController, and we
   * abort it on: pick finished, a second pick, popover closed, component destroyed, page
   * hidden / unloaded / frozen, and after a safety timeout.
   */
  var EYEDROPPER_TIMEOUT = 30000;
  var eyePick = null; // { controller, timer, owner }

  function endEyedropper() {
    var pick = eyePick;
    if (!pick) return;
    eyePick = null;
    clearTimeout(pick.timer);
    try { pick.controller.abort(); } catch (e) { /* already settled */ }
    if (pick.owner) pick.owner();
  }

  function startEyedropper(onPick, onEnd) {
    endEyedropper();
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    if (!controller) return Promise.reject(new Error('AbortController unavailable'));
    var pick = { controller: controller, timer: 0, owner: onEnd };
    pick.timer = setTimeout(endEyedropper, EYEDROPPER_TIMEOUT);
    eyePick = pick;
    return new window.EyeDropper().open({ signal: controller.signal }).then(function (result) {
      if (eyePick === pick && result && result.sRGBHex) onPick(result.sRGBHex);
    }).catch(function () { /* cancelled: Escape, abort or timeout */ }).then(function () {
      if (eyePick === pick) endEyedropper();
    });
  }

  if (!window.__kitEyedropperGuards) {
    window.__kitEyedropperGuards = true;
    window.addEventListener('pagehide', endEyedropper);
    window.addEventListener('beforeunload', endEyedropper);
    document.addEventListener('freeze', endEyedropper);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') endEyedropper();
    });
  }

  /* ---------------- ColorSelector ---------------- */
  window.initColorSelector = function initColorSelector(root, options) {
    options = options || {};
    var utils = window.ComponentUtils;
    var field = root.querySelector('.color-selector') || root;
    var wrap = root.querySelector('.color-selector__wrap');
    var trigger = root.querySelector('[data-color-trigger]');
    var swatch = root.querySelector('[data-color-swatch]');
    var hexInput = root.querySelector('[data-color-hex]');
    var opacityInput = root.querySelector('[data-color-opacity]');
    var popover = root.querySelector('.color-selector__popover');
    var sv = root.querySelector('[data-color-sv]');
    var svThumb = sv && sv.querySelector('.color-selector__thumb');
    var hue = root.querySelector('[data-color-hue]');
    var hueThumb = hue && hue.querySelector('.color-selector__thumb');
    var alpha = root.querySelector('[data-color-alpha]');
    var alphaThumb = alpha && alpha.querySelector('.color-selector__thumb');
    var alphaFill = root.querySelector('.color-selector__alpha-fill');
    var hInput = root.querySelector('[data-color-h]');
    var sInput = root.querySelector('[data-color-s]');
    var bInput = root.querySelector('[data-color-b]');
    var eyedropBtn = root.querySelector('[data-color-eyedropper]');
    var labelEl = root.querySelector('.field-label');
    if (!wrap || !trigger || !hexInput || !popover || !sv || !hue) {
      throw new Error('initColorSelector: missing color selector elements');
    }

    var onChange = options.onChange;
    if (options.label && labelEl) labelEl.textContent = options.label;

    var start = hexToRgb(options.value || hexInput.value) || { r: 0, g: 0, b: 0 };
    var hsv = rgbToHsv(start.r, start.g, start.b);
    var a = clamp(utils.parseOpacity(options.opacity != null ? options.opacity : (opacityInput ? opacityInput.value : 100), 1), 0, 1);

    function hex() { var c = hsvToRgb(hsv.h, hsv.s, hsv.v); return rgbToHex(c.r, c.g, c.b); }
    function getColor() { return utils.colorWithOpacity('#' + hex(), a); }

    function render(updateText) {
      var h = hex();
      var pure = hsvToRgb(hsv.h, 1, 1);
      var pureHex = '#' + rgbToHex(pure.r, pure.g, pure.b);
      if (swatch) swatch.style.background = getColor();
      sv.style.backgroundColor = pureHex;
      svThumb.style.left = (hsv.s * 100) + '%';
      svThumb.style.top = ((1 - hsv.v) * 100) + '%';
      svThumb.style.background = '#' + h;
      hueThumb.style.left = (hsv.h / 360 * 100) + '%';
      hueThumb.style.background = pureHex;
      if (alpha) {
        alphaFill.style.background = 'linear-gradient(90deg, rgba(0,0,0,0), #' + h + ')';
        alphaThumb.style.left = (a * 100) + '%';
        alphaThumb.style.background = getColor();
        alpha.setAttribute('aria-valuenow', String(Math.round(a * 100)));
      }
      sv.setAttribute('aria-valuetext', 'Saturation ' + Math.round(hsv.s * 100) + '%, brightness ' + Math.round(hsv.v * 100) + '%');
      hue.setAttribute('aria-valuenow', String(Math.round(hsv.h)));
      if (updateText !== false) {
        var focused = document.activeElement;
        if (focused !== hexInput) hexInput.value = h;
        if (opacityInput && focused !== opacityInput) opacityInput.value = String(Math.round(a * 100));
        if (hInput && focused !== hInput) hInput.value = String(Math.round(hsv.h));
        if (sInput && focused !== sInput) sInput.value = String(Math.round(hsv.s * 100));
        if (bInput && focused !== bInput) bInput.value = String(Math.round(hsv.v * 100));
      }
    }

    function commit(notify) {
      render();
      if (notify !== false && onChange) onChange(getColor(), { hex: '#' + hex(), opacity: Math.round(a * 100) });
    }

    function setHex(value, notify) {
      var rgb = hexToRgb(value);
      if (!rgb) return false;
      var next = rgbToHsv(rgb.r, rgb.g, rgb.b);
      // Keep the current hue for greys so the hue strip doesn't jump to red.
      if (!next.s || !next.v) next.h = hsv.h;
      hsv = next;
      commit(notify);
      return true;
    }

    /* H / S / B number fields: H 0–360, S and B 0–100 */
    function bindChannel(input, max, apply) {
      if (!input) return;
      utils.bindInputBehavior(input);
      var fromInput = function () {
        var n = parseFloat(String(input.value).trim());
        if (!Number.isFinite(n)) return;
        var c = clamp(n, 0, max);
        if (c !== n) input.value = String(Math.round(c));
        apply(c);
        commit();
      };
      input.addEventListener('input', fromInput);
      utils.bindNumericArrowKey(input, fromInput);
      input.addEventListener('blur', function () { render(); });
    }
    bindChannel(hInput, 360, function (v) { hsv.h = Math.min(v, 359.999); });
    bindChannel(sInput, 100, function (v) { hsv.s = v / 100; });
    bindChannel(bInput, 100, function (v) { hsv.v = v / 100; });

    /* drag areas */
    function drag(area, onPoint) {
      function at(event) {
        var r = area.getBoundingClientRect();
        onPoint(clamp((event.clientX - r.left) / (r.width || 1), 0, 1), clamp((event.clientY - r.top) / (r.height || 1), 0, 1));
      }
      function move(event) { at(event); }
      function up() {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        area.classList.remove('is-dragging');
      }
      area.addEventListener('pointerdown', function (event) {
        event.preventDefault();
        area.focus();
        area.classList.add('is-dragging');
        at(event);
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });
    }

    drag(sv, function (x, y) { hsv.s = x; hsv.v = 1 - y; commit(); });
    drag(hue, function (x) { hsv.h = Math.min(x * 360, 359.999); commit(); });
    if (alpha) drag(alpha, function (x) { a = Math.round(x * 100) / 100; commit(); });

    function keys(area, handler) {
      area.addEventListener('keydown', function (event) {
        var big = event.shiftKey ? 10 : 1;
        var dx = event.key === 'ArrowRight' ? big : event.key === 'ArrowLeft' ? -big : 0;
        var dy = event.key === 'ArrowUp' ? big : event.key === 'ArrowDown' ? -big : 0;
        if (!dx && !dy) return;
        event.preventDefault();
        handler(dx, dy);
        commit();
      });
    }
    keys(sv, function (dx, dy) { hsv.s = clamp(hsv.s + dx / 100, 0, 1); hsv.v = clamp(hsv.v + dy / 100, 0, 1); });
    keys(hue, function (dx, dy) { hsv.h = clamp(hsv.h + dx + dy, 0, 359.999); });
    if (alpha) keys(alpha, function (dx, dy) { a = clamp(Math.round(a * 100 + dx + dy) / 100, 0, 1); });

    /* text inputs */
    utils.bindInputBehavior(hexInput);
    hexInput.addEventListener('input', function () {
      var rgb = hexToRgb(hexInput.value);
      if (!rgb) return;
      var next = rgbToHsv(rgb.r, rgb.g, rgb.b);
      if (!next.s || !next.v) next.h = hsv.h;
      hsv = next;
      render(false);
      if (onChange) onChange(getColor(), { hex: '#' + hex(), opacity: Math.round(a * 100) });
    });
    hexInput.addEventListener('change', function () { render(); });
    hexInput.addEventListener('blur', function () { render(); });
    if (opacityInput) {
      utils.bindInputBehavior(opacityInput);
      var fromOpacity = function () {
        a = utils.parseOpacity(opacityInput.value, a);
        render(false);
        if (onChange) onChange(getColor(), { hex: '#' + hex(), opacity: Math.round(a * 100) });
      };
      opacityInput.addEventListener('input', fromOpacity);
      utils.bindNumericArrowKey(opacityInput, fromOpacity, { isOpacity: true });
      opacityInput.addEventListener('blur', function () { render(); });
    }

    /* eyedropper — uses the browser EyeDropper API (Chrome, Edge, Opera) */
    if (eyedropBtn) {
      var eyeImg = eyedropBtn.querySelector('img');
      if (eyeImg && !eyeImg.getAttribute('src')) eyeImg.src = EYEDROPPER_ICON;
      if (typeof window.EyeDropper !== 'function') {
        eyedropBtn.disabled = true;
        eyedropBtn.classList.add('is-disabled');
        eyedropBtn.setAttribute('data-tooltip', 'Eyedropper isn\u2019t supported in this browser');
      } else {
        var eyeOff = function () {
          eyedropBtn.classList.remove('is-active');
          eyedropBtn.setAttribute('aria-pressed', 'false');
        };
        eyedropBtn.addEventListener('click', function (event) {
          event.preventDefault();
          // A second click cancels the pick instead of starting another one.
          if (eyedropBtn.classList.contains('is-active')) { endEyedropper(); return; }
          eyedropBtn.classList.add('is-active');
          eyedropBtn.setAttribute('aria-pressed', 'true');
          startEyedropper(function (value) { setHex(value); }, eyeOff);
        });
      }
    }

    /* open / close */
    function isOpen() { return popover.classList.contains('is-open'); }
    function open() {
      if (isOpen()) return;
      document.dispatchEvent(new CustomEvent('dimension-menu:close-all'));
      document.dispatchEvent(new CustomEvent('option-selector:close-all'));
      document.dispatchEvent(new CustomEvent('color-selector:close-all', { detail: { except: wrap } }));
      popover.classList.add('is-open');
      wrap.classList.add('is-menu-open');
      trigger.setAttribute('aria-expanded', 'true');
      render();
    }
    function ownsPick() { return !!(eyePick && eyedropBtn && eyedropBtn.classList.contains('is-active')); }
    function close(returnFocus) {
      if (ownsPick()) endEyedropper();
      if (!isOpen()) return;
      popover.classList.remove('is-open');
      wrap.classList.remove('is-menu-open');
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) trigger.focus();
    }

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      if (isOpen()) close(); else open();
    });
    wrap.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) { event.preventDefault(); close(true); }
    });
    function onDocClick(event) {
      if (event.target.closest('.color-selector__wrap') === wrap) return;
      close();
    }
    function onCloseAll(event) {
      if (event.detail && event.detail.except === wrap) return;
      close();
    }
    function onOtherMenu() { close(); }
    document.addEventListener('click', onDocClick);
    document.addEventListener('color-selector:close-all', onCloseAll);
    document.addEventListener('dimension-menu:close-all', onOtherMenu);
    document.addEventListener('option-selector:close-all', onOtherMenu);

    render();

    return {
      element: field,
      hexInput: hexInput,
      opacityInput: opacityInput,
      getColor: getColor,
      getHex: function () { return '#' + hex(); },
      getOpacity: function () { return Math.round(a * 100); },
      setValue: function (value, opacity, notify) {
        if (opacity != null) a = clamp(utils.parseOpacity(opacity, a), 0, 1);
        if (!setHex(value, notify === true)) render();
      },
      open: open,
      close: function () { close(); },
      /** Ends any eyedropper pick and removes document listeners. Call before removing the element. */
      destroy: function () {
        if (ownsPick()) endEyedropper();
        close();
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('color-selector:close-all', onCloseAll);
        document.removeEventListener('dimension-menu:close-all', onOtherMenu);
        document.removeEventListener('option-selector:close-all', onOtherMenu);
      },
    };
  };

  /** Ends the page's eyedropper pick, if any (e.g. before a hot reload or route change). */
  window.cancelKitEyedropper = endEyedropper;

  /* ---------------- Tooltip ---------------- */
  var tip = null;
  var tipText = null;
  var current = null;
  var showTimer = 0;
  var uid = 0;

  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.className = 'kit-tooltip';
    tip.setAttribute('role', 'tooltip');
    tip.id = 'kit-tooltip';
    tipText = document.createElement('span');
    tipText.className = 'kit-tooltip__text';
    tip.appendChild(tipText);
    document.body.appendChild(tip);
    return tip;
  }

  function place(target, placement) {
    var gap = 6;
    var r = target.getBoundingClientRect();
    var t = tip.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = document.documentElement.clientHeight;
    var fits = {
      top: r.top - t.height - gap >= 4,
      bottom: r.bottom + t.height + gap <= vh - 4,
      left: r.left - t.width - gap >= 4,
      right: r.right + t.width + gap <= vw - 4,
    };
    var opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
    var p = fits[placement] ? placement : (fits[opposite[placement]] ? opposite[placement] : placement);
    var x, y;
    if (p === 'top' || p === 'bottom') {
      x = r.left + r.width / 2 - t.width / 2;
      y = p === 'top' ? r.top - t.height - gap : r.bottom + gap;
    } else {
      x = p === 'left' ? r.left - t.width - gap : r.right + gap;
      y = r.top + r.height / 2 - t.height / 2;
    }
    var cx = clamp(x, 4, vw - t.width - 4);
    var cy = clamp(y, 4, vh - t.height - 4);
    tip.style.left = Math.round(cx) + 'px';
    tip.style.top = Math.round(cy) + 'px';
    tip.dataset.placement = p;
    // keep the arrow pointing at the target when the bubble was clamped
    if (p === 'top' || p === 'bottom') tip.style.setProperty('--kit-tooltip-arrow', Math.round(r.left + r.width / 2 - cx) + 'px');
    else tip.style.setProperty('--kit-tooltip-arrow', Math.round(r.top + r.height / 2 - cy) + 'px');
  }

  function show(target) {
    var text = target.getAttribute('data-tooltip');
    if (!text) return;
    ensureTip();
    clearTimeout(showTimer);
    current = target;
    tipText.textContent = text;
    tip.classList.add('is-open');
    if (!target.id) target.id = 'kit-tooltip-target-' + (++uid);
    target.setAttribute('aria-describedby', tip.id);
    place(target, target.getAttribute('data-tooltip-placement') || 'top');
  }

  function hide() {
    clearTimeout(showTimer);
    if (!tip) return;
    tip.classList.remove('is-open');
    if (current) current.removeAttribute('aria-describedby');
    current = null;
  }

  window.initTooltip = function initTooltip(root, options) {
    options = options || {};
    root = root || document;
    var delay = options.delay != null ? options.delay : 400;
    var scope = root === document ? document.documentElement : root;
    if (scope.__kitTooltip) return scope.__kitTooltip;

    function targetOf(event) {
      var el = event.target.closest && event.target.closest('[data-tooltip]');
      return el && scope.contains(el) ? el : null;
    }

    scope.addEventListener('pointerover', function (event) {
      var el = targetOf(event);
      if (!el || el === current) return;
      clearTimeout(showTimer);
      // Moving between tooltip targets swaps instantly; the first one waits.
      if (current) show(el);
      else showTimer = setTimeout(function () { show(el); }, delay);
    });
    scope.addEventListener('pointerout', function (event) {
      var el = targetOf(event);
      if (!el) return;
      if (event.relatedTarget && el.contains(event.relatedTarget)) return;
      hide();
    });
    scope.addEventListener('focusin', function (event) {
      var el = targetOf(event);
      if (el && el.matches(':focus-visible')) show(el);
    });
    scope.addEventListener('focusout', function (event) { if (targetOf(event)) hide(); });
    scope.addEventListener('pointerdown', function () { hide(); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') hide(); });
    window.addEventListener('scroll', hide, true);

    var controller = {
      element: scope,
      attach: function (el, text, placement) {
        el.setAttribute('data-tooltip', text);
        if (placement) el.setAttribute('data-tooltip-placement', placement);
        return el;
      },
      show: function (el) { show(el); },
      hide: hide,
    };
    scope.__kitTooltip = controller;
    return controller;
  };

  if (window.ExperimentKit) {
    window.ExperimentKit.ColorSelector = window.initColorSelector;
    window.ExperimentKit.Tooltip = window.initTooltip;
    window.ExperimentKit.cancelEyedropper = endEyedropper;
  }
})();

/* ==== Intentional additions — SizeControl (also in the repo: Components/SizeControl/) ==== */
(function () {
  var icons = window.ComponentIcons || (window.ComponentIcons = {});
  if (!icons['link']) icons['link'] = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDkwOTBCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MSIvPjxwYXRoIGQ9Ik0xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MSIvPjwvc3ZnPgo=';
  if (!icons['link-broken']) icons['link-broken'] = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDkwOTBCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTguODQgMTIuMjUgMS43Mi0xLjcxaC0uMDJhNS4wMDQgNS4wMDQgMCAwIDAtLjEyLTcuMDcgNS4wMDYgNS4wMDYgMCAwIDAtNi45NSAwbC0xLjcyIDEuNzEiLz48cGF0aCBkPSJtNS4xNyAxMS43NS0xLjcxIDEuNzFhNS4wMDQgNS4wMDQgMCAwIDAgLjEyIDcuMDcgNS4wMDYgNS4wMDYgMCAwIDAgNi45NSAwbDEuNzEtMS43MSIvPjxsaW5lIHgxPSI4IiB4Mj0iOCIgeTE9IjIiIHkyPSI1Ii8+PGxpbmUgeDE9IjIiIHgyPSI1IiB5MT0iOCIgeTI9IjgiLz48bGluZSB4MT0iMTYiIHgyPSIxNiIgeTE9IjE5IiB5Mj0iMjIiLz48bGluZSB4MT0iMTkiIHgyPSIyMiIgeTE9IjE2IiB5Mj0iMTYiLz48L3N2Zz4K';
})();
window.initSizeControl = function initSizeControl(root, options = {}) {
  const utils = window.ComponentUtils;
  const icons = window.ComponentIcons || {};
  const field = root.querySelector('.size-control') || root;
  const widthInput = root.querySelector('[data-size-width]');
  const heightInput = root.querySelector('[data-size-height]');
  const lockBtn = root.querySelector('[data-size-lock]');
  const lockImg = lockBtn?.querySelector('img');
  const labelEl = root.querySelector('.field-label');

  if (!widthInput || !heightInput || !lockBtn) {
    throw new Error('initSizeControl: missing size control elements');
  }

  const min = options.min ?? 0;
  const max = options.max ?? Infinity;
  const precision = options.precision ?? 0;
  const onChange = options.onChange;

  if (options.label && labelEl) labelEl.textContent = options.label;

  const factor = 10 ** precision;
  const round = (n) => Math.round(n * factor) / factor;
  const clamp = (n) => Math.min(max, Math.max(min, n));
  const parse = (input, fallback) => {
    const n = parseFloat(String(input.value).trim());
    return Number.isFinite(n) ? n : fallback;
  };

  let width = clamp(round(options.width ?? parse(widthInput, 0)));
  let height = clamp(round(options.height ?? parse(heightInput, 0)));
  let locked = false;
  let ratio = null; // width / height, captured when the lock turns on

  function captureRatio() {
    ratio = width > 0 && height > 0 ? width / height : null;
  }

  function renderInputs(skip) {
    if (skip !== widthInput) widthInput.value = String(width);
    if (skip !== heightInput) heightInput.value = String(height);
  }

  function renderLock() {
    lockBtn.classList.toggle('is-active', locked);
    lockBtn.setAttribute('aria-pressed', locked ? 'true' : 'false');
    const label = locked ? 'Unlock aspect ratio' : 'Lock aspect ratio';
    lockBtn.setAttribute('aria-label', label);
    lockBtn.setAttribute('data-tooltip', label);
    if (lockImg) {
      const src = locked ? icons.link : icons['link-broken'];
      if (src) lockImg.src = src;
      lockImg.dataset.icon = locked ? 'link' : 'link-broken';
    }
  }

  function notify() {
    onChange?.({ width, height, locked });
  }

  // Typing in one side: that side follows the text, the other follows the ratio.
  function fromInput(input) {
    const isWidth = input === widthInput;
    const raw = parse(input, NaN);
    if (!Number.isFinite(raw)) return;

    const value = clamp(round(raw));
    if (isWidth) width = value; else height = value;

    if (locked) {
      if (!ratio) captureRatio();
      if (ratio) {
        if (isWidth) height = clamp(round(width / ratio));
        else width = clamp(round(height * ratio));
      }
    }

    // Keep what the user is typing; only rewrite it when it was clamped.
    renderInputs(value === raw ? input : null);
    notify();
  }

  [widthInput, heightInput].forEach((input) => {
    utils.bindInputBehavior(input);
    input.addEventListener('input', () => fromInput(input));
    utils.bindNumericArrowKey(input, () => fromInput(input), options.step ? { step: options.step } : {});
    input.addEventListener('blur', () => renderInputs());
  });

  function setLocked(next, shouldNotify = false) {
    locked = Boolean(next);
    if (locked) captureRatio();
    renderLock();
    if (shouldNotify) notify();
  }

  lockBtn.addEventListener('click', (event) => {
    event.preventDefault();
    setLocked(!locked, true);
  });

  renderInputs();
  setLocked(options.locked ?? lockBtn.getAttribute('aria-pressed') === 'true');

  return {
    element: field,
    widthInput,
    heightInput,
    lockButton: lockBtn,
    getValue: () => ({ width, height, locked }),
    getRatio: () => ratio,
    setValue(nextWidth, nextHeight, shouldNotify = false) {
      if (nextWidth != null) width = clamp(round(nextWidth));
      if (nextHeight != null) height = clamp(round(nextHeight));
      if (locked) captureRatio();
      renderInputs();
      if (shouldNotify) notify();
    },
    getLocked: () => locked,
    setLocked,
  };
};
if (window.ExperimentKit) window.ExperimentKit.SizeControl = window.initSizeControl;
