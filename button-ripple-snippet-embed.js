window.RippleButtonSnippet = {
  css: `.ripple-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 56px;
  padding: 0 28px;
  border: none;
  border-radius: 28px;
  background: #000;
  color: #fff;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.ripple-button:focus-visible {
  outline: 2px solid rgba(0, 0, 0, 0.35);
  outline-offset: 3px;
}

/* Dot grid sits inside the button (clipped to its shape), under the label. Invisible at rest. */
.ripple-button__dots {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}

.ripple-button__dots svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ripple-button__label {
  position: relative;
  z-index: 1;
}
`,
  js: `window.initRippleButton = function initRippleButton(root, options = {}) {
  const btn = root.querySelector('.ripple-button') || root;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const uid = \`ripple-glow-\${Math.random().toString(36).slice(2, 8)}\`;

  let dotColor = options.dotColor ?? '#FFFFFF';
  // Fixed LED matrix: equal square tiles separated by a gap; the wave only changes brightness.
  let tileSize = options.tileSize ?? 6;
  let tileGap = options.tileGap ?? 1;
  let waves = options.waves ?? 3;
  let wavelength = options.wavelength ?? 14;
  let glow = options.glow ?? 2;
  let intensity = options.intensity ?? 45;
  let duration = options.duration ?? 1200;
  let count = options.count ?? 2;
  let gap = options.gap ?? 220;
  let fade = options.fade ?? 60;
  let origin = options.origin ?? 'click';
  let easingRaw = options.easingRaw ?? '0.25, 0.1, 0.25, 1';

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ripples = [];
  let dots = [];
  let frame = 0;

  function svg(tag, attrs = {}) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  // The label is wrapped once; the layer is added once so re-init on the same button is safe.
  let label = btn.querySelector('.ripple-button__label');
  if (!label) {
    label = document.createElement('span');
    label.className = 'ripple-button__label';
    label.textContent = btn.textContent.trim();
    btn.textContent = '';
    btn.appendChild(label);
  }

  let layer = btn.querySelector('.ripple-button__dots');
  if (layer) layer.remove();
  layer = document.createElement('span');
  layer.className = 'ripple-button__dots';
  layer.setAttribute('aria-hidden', 'true');

  // Tiles are drawn once crisp, then again through a blur for a faint halo (the "glow").
  const canvas = svg('svg', { focusable: 'false' });
  const defs = svg('defs');
  const filter = svg('filter', { id: \`\${uid}-blur\`, x: '-50%', y: '-50%', width: '200%', height: '200%' });
  const blur = svg('feGaussianBlur', { stdDeviation: glow });
  filter.appendChild(blur);
  defs.appendChild(filter);
  const grid = svg('g', { id: \`\${uid}-grid\` });
  const halo = svg('use', { href: \`#\${uid}-grid\`, filter: \`url(#\${uid}-blur)\`, opacity: 0.9 });
  canvas.append(defs, halo, grid);
  layer.appendChild(canvas);
  btn.insertBefore(layer, label);

  // Minimal cubic-bezier(x1, y1, x2, y2) solver for the wave's travel curve.
  function makeEasing() {
    const parts = String(easingRaw).replace(/cubic-bezier\\(|\\)/g, '').split(',').map((n) => parseFloat(n));
    if (parts.length !== 4 || !parts.every(Number.isFinite)) return (t) => t;
    const [x1, y1, x2, y2] = parts;
    const bez = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
    return (x) => {
      let lo = 0;
      let hi = 1;
      for (let i = 0; i < 20; i += 1) {
        const mid = (lo + hi) / 2;
        if (bez(mid, x1, x2) < x) lo = mid;
        else hi = mid;
      }
      return bez((lo + hi) / 2, y1, y2);
    };
  }
  let ease = makeEasing();

  function buildGrid() {
    const width = btn.offsetWidth;
    const height = btn.offsetHeight;
    const size = Math.max(1, tileSize);
    const step = size + Math.max(0, tileGap);
    // Fill edge to edge (the button's radius clips the corners), centered on the button.
    const cols = Math.ceil(width / step) + 1;
    const rows = Math.ceil(height / step) + 1;
    const offsetX = (width - (cols * step - tileGap)) / 2;
    const offsetY = (height - (rows * step - tileGap)) / 2;

    canvas.setAttribute('viewBox', \`0 0 \${width} \${height}\`);
    grid.textContent = '';
    grid.setAttribute('fill', dotColor);
    dots = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const left = offsetX + col * step;
        const top = offsetY + row * step;
        const node = svg('rect', { x: left, y: top, width: size, height: size, opacity: 0 });
        grid.appendChild(node);
        dots.push({ node, x: left + size / 2, y: top + size / 2 });
      }
    }
  }

  function render(now) {
    const reduced = motionQuery.matches;
    const train = Math.max(1, waves) * Math.max(2, wavelength);

    for (let i = ripples.length - 1; i >= 0; i -= 1) {
      if (now - ripples[i].start >= ripples[i].time) ripples.splice(i, 1);
    }

    dots.forEach((dot) => {
      let env = 0;
      let wave = 0;

      ripples.forEach((ripple) => {
        const t = (now - ripple.start) / ripple.time;
        if (t < 0) return;
        if (reduced) {
          env = Math.max(env, Math.sin(Math.PI * t));
          return;
        }
        // Wave front travels until the whole train has left the farthest dot.
        const progress = ease(t);
        const front = progress * (ripple.reach + train);
        const behind = front - Math.hypot(dot.x - ripple.x, dot.y - ripple.y);
        if (behind <= 0 || behind >= train) return;
        // Flat-topped envelope: quick ramp at the front, softer tail, full strength in between.
        const smooth = (v) => { const c = Math.min(1, Math.max(0, v)); return c * c * (3 - 2 * c); };
        const shape = smooth(behind / (train * 0.2)) * smooth((train - behind) / (train * 0.4));
        // Dims as it travels; \`fade\` 0 = no dimming, 100 = fades linearly to nothing.
        const decay = 1 - (fade / 100) * t;
        const e = shape * decay * Math.min(1, (1 - t) * 6);
        env = Math.max(env, e);
        wave += e * Math.cos((2 * Math.PI * behind) / wavelength);
      });

      // Crest → tile lit, trough → tile dark, so the ripple reads as rings of lit tiles.
      const crest = env > 0 ? 0.5 + 0.5 * Math.max(-1, Math.min(1, wave / env)) : 0;
      // Perceptual lift: linear opacity on black reads too dim in the mid tones.
      const level = Math.pow(env * crest, 0.6);
      dot.node.setAttribute('opacity', (level * intensity / 100).toFixed(3));
    });

    frame = ripples.length ? requestAnimationFrame(render) : 0;
  }

  function play(x, y) {
    const width = btn.offsetWidth;
    const height = btn.offsetHeight;
    const px = origin === 'center' || x == null ? width / 2 : x;
    const py = origin === 'center' || y == null ? height / 2 : y;
    const reach = Math.max(
      Math.hypot(px, py),
      Math.hypot(width - px, py),
      Math.hypot(px, height - py),
      Math.hypot(width - px, height - py)
    );

    // One click sends \`count\` ripples from the same point, \`gap\` ms apart.
    const now = performance.now();
    const total = motionQuery.matches ? 1 : Math.min(5, Math.max(1, Math.round(count)));
    for (let i = 0; i < total; i += 1) {
      ripples.push({
        x: px,
        y: py,
        reach,
        start: now + i * Math.max(0, gap),
        time: motionQuery.matches ? 400 : Math.max(100, duration),
      });
    }
    while (ripples.length > 10) ripples.shift();
    if (!frame) frame = requestAnimationFrame(render);
  }

  btn.addEventListener('click', (event) => {
    // Keyboard activation reports detail 0 and no real pointer position — ripple from the center.
    if (event.detail === 0) {
      play();
      return;
    }
    // Rescale to layout px so the origin stays right when a parent is zoomed (the mobile preview is).
    const rect = btn.getBoundingClientRect();
    const scaleX = rect.width ? btn.offsetWidth / rect.width : 1;
    const scaleY = rect.height ? btn.offsetHeight / rect.height : 1;
    play((event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY);
  });

  if (window.ResizeObserver) new ResizeObserver(buildGrid).observe(btn);
  buildGrid();

  return {
    element: btn,
    play,
    setLabel(text) {
      label.textContent = text;
      btn.setAttribute('aria-label', text);
    },
    set(next = {}) {
      if (next.dotColor != null) dotColor = next.dotColor;
      if (next.tileSize != null) tileSize = next.tileSize;
      if (next.tileGap != null) tileGap = next.tileGap;
      if (next.waves != null) waves = next.waves;
      if (next.wavelength != null) wavelength = next.wavelength;
      if (next.glow != null) glow = next.glow;
      if (next.intensity != null) intensity = next.intensity;
      if (next.duration != null) duration = next.duration;
      if (next.count != null) count = next.count;
      if (next.gap != null) gap = next.gap;
      if (next.fade != null) fade = next.fade;
      if (next.origin != null) origin = next.origin;
      if (next.easingRaw != null) easingRaw = next.easingRaw;
      ease = makeEasing();
      blur.setAttribute('stdDeviation', glow);
      halo.style.display = glow > 0 ? '' : 'none';
      buildGrid();
    },
    applyStyles(styles = {}) {
      Object.assign(btn.style, styles);
      buildGrid();
    },
  };
};
`,
};
