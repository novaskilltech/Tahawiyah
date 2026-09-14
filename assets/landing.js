(() => {
  const count = document.querySelector('[data-visit-count]');
  const label = document.querySelector('[data-visit-label]');
  if (!count || !label) return;

  const localKey = 'novaskill-aqidah-landing-visits';
  const sessionKey = 'novaskill-aqidah-landing-recorded';
  const localLabel = 'زيارة مسجلة في المعاينة';

  function render(value, text) {
    count.textContent = new Intl.NumberFormat('ar').format(value);
    label.textContent = text;
  }

  async function registerVisit() {
    try {
      const response = await fetch('/api/visits', { method:'POST', headers:{ Accept:'application/json' } });
      if (!response.ok) throw new Error('Counter backend unavailable');
      const payload = await response.json();
      if (!Number.isFinite(payload.count)) throw new Error('Invalid counter payload');
      render(payload.count, 'زيارة للموقع');
      return;
    } catch (_) {
      try {
        let value = Number.parseInt(localStorage.getItem(localKey) || '0', 10);
        if (!Number.isFinite(value)) value = 0;
        if (!sessionStorage.getItem(sessionKey)) {
          value += 1;
          localStorage.setItem(localKey, String(value));
          sessionStorage.setItem(sessionKey, 'true');
        }
        render(value || 1, localLabel);
      } catch (_) {
        render(1, localLabel);
      }
    }
  }

  registerVisit();
})();
