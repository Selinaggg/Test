(function (global) {
  'use strict';

  function parseHSL(hslStr) {
    const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
    if (!match) return { h: 40, s: 80, l: 80 };
    return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
  }

  function buildGlowVars(glowColor, intensity) {
    const { h, s, l } = parseHSL(glowColor);
    const base = `${h}deg ${s}% ${l}%`;
    const opacities = [100, 60, 50, 40, 30, 20, 10];
    const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
    const vars = {};
    for (let i = 0; i < opacities.length; i += 1) {
      vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
    }
    return vars;
  }

  const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
  const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
  const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

  function buildGradientVars(colors) {
    const vars = {};
    for (let i = 0; i < 7; i += 1) {
      const color = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
      vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${color} 0px, transparent 50%)`;
    }
    vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
    return vars;
  }

  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
  function easeInCubic(x) { return x * x * x; }

  function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
    const t0 = performance.now() + delay;
    function tick() {
      const elapsed = performance.now() - t0;
      const t = Math.min(Math.max(elapsed / duration, 0), 1);
      onUpdate(start + (end - start) * ease(t));
      if (t < 1) requestAnimationFrame(tick);
      else if (onEnd) onEnd();
    }
    setTimeout(() => requestAnimationFrame(tick), delay);
  }

  function attach(element, options = {}) {
    if (!element) return null;
    const config = {
      edgeSensitivity: 30,
      glowColor: '40 80 80',
      backgroundColor: '#120F17',
      borderRadius: 28,
      glowRadius: 40,
      glowIntensity: 1,
      coneSpread: 25,
      animated: false,
      autoLoop: false,
      loopDuration: 7200,
      colors: ['#c084fc', '#f472b6', '#38bdf8'],
      fillOpacity: 0.5,
      ...options
    };

    const vars = {
      '--card-bg': config.backgroundColor,
      '--edge-sensitivity': config.edgeSensitivity,
      '--border-radius': `${config.borderRadius}px`,
      '--glow-padding': `${config.glowRadius}px`,
      '--cone-spread': config.coneSpread,
      '--fill-opacity': config.fillOpacity,
      ...buildGlowVars(config.glowColor, config.glowIntensity),
      ...buildGradientVars(config.colors)
    };
    Object.entries(vars).forEach(([key, value]) => element.style.setProperty(key, value));

    const getCenter = () => {
      const { width, height } = element.getBoundingClientRect();
      return [width / 2, height / 2];
    };
    const handlePointerMove = event => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const [cx, cy] = getCenter();
      const dx = x - cx;
      const dy = y - cy;
      const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
      const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
      const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      let angle = dx === 0 && dy === 0 ? 0 : Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      element.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
      element.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    };

    let loopFrame = 0;
    const reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (config.autoLoop) {
      element.classList.add('sweep-active');
      element.style.setProperty('--edge-proximity', reduceMotion ? '72' : '88');

      if (reduceMotion) {
        element.style.setProperty('--cursor-angle', '90deg');
      } else {
        const startedAt = performance.now();
        const tickLoop = now => {
          const progress = ((now - startedAt) % config.loopDuration) / config.loopDuration;
          element.style.setProperty('--cursor-angle', `${progress * 360}deg`);
          loopFrame = requestAnimationFrame(tickLoop);
        };
        loopFrame = requestAnimationFrame(tickLoop);
      }
    } else {
      element.addEventListener('pointermove', handlePointerMove);
    }

    if (config.animated) {
      const angleStart = 110;
      const angleEnd = 465;
      element.classList.add('sweep-active');
      element.style.setProperty('--cursor-angle', `${angleStart}deg`);
      animateValue({ duration: 500, onUpdate: value => element.style.setProperty('--edge-proximity', value) });
      animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: value => {
        element.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
      }});
      animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: value => {
        element.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
      }});
      animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
        onUpdate: value => element.style.setProperty('--edge-proximity', value),
        onEnd: () => element.classList.remove('sweep-active')
      });
    }

    return {
      destroy() {
        element.removeEventListener('pointermove', handlePointerMove);
        if (loopFrame) cancelAnimationFrame(loopFrame);
        element.classList.remove('sweep-active');
      }
    };
  }

  global.BorderGlow = { attach };
})(window);
