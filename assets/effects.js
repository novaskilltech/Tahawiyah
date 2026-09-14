(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverCapable = window.matchMedia('(hover: hover)');

  function bindTilt(element) {
    if (element.dataset.tiltBound || reducedMotion.matches || !hoverCapable.matches) return;
    element.dataset.tiltBound = 'true';
    element.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      element.style.setProperty('--tilt-x', `${((.5 - y) * 3.4).toFixed(2)}deg`);
      element.style.setProperty('--tilt-y', `${((x - .5) * 3.4).toFixed(2)}deg`);
      element.dataset.tiltActive = 'true';
    });
    element.addEventListener('pointerleave', () => {
      delete element.dataset.tiltActive;
      element.style.removeProperty('--tilt-x');
      element.style.removeProperty('--tilt-y');
    });
  }

  function init() { document.querySelectorAll('[data-tilt]').forEach(bindTilt); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true }); else init();
})();
