(function () {
  const data = window.AQIDAH_CONTENT || [];
  const list = document.querySelector('[data-lessons]');
  const toc = document.querySelector('[data-toc]');
  const progress = document.querySelector('[data-progress]');
  const copyLabel = document.documentElement.lang === 'fr' ? 'Copier' : 'نسخ النص';
  const copiedLabel = document.documentElement.lang === 'fr' ? 'Copié' : 'تم النسخ';

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }
  function paragraph(value) { return `<p>${escapeHtml(value)}</p>`; }
  function terms(values) { return values.map(item => `<span class="term">${escapeHtml(item)}</span>`).join(''); }
  function render(items) {
    list.innerHTML = items.map((item, i) => `
      <article class="lesson" id="${escapeHtml(item.id)}" data-search="${escapeHtml([item.title,item.matn,item.summary,item.simple,item.detailed,item.vocab.join(' ')].join(' '))}">
        <p class="lesson-number">${String(i + 1).padStart(2, '0')} · ${escapeHtml(item.track)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <div class="matn">${escapeHtml(item.matn)}</div>
        <button class="copy" type="button" data-copy="${escapeHtml(item.matn)}">${copyLabel}</button>
        <div class="lesson-details">
          <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'En une phrase' : 'الخلاصة في سطر'}</h3>${paragraph(item.summary)}</section>
          <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'Explication accessible' : 'شرح ميسّر'}</h3>${paragraph(item.simple)}</section>
          <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'Explication développée' : 'شرح مفصّل'}</h3>${paragraph(item.detailed)}</section>
          <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'Repères et vocabulaire' : 'مصطلحات وتنبيهات'}</h3><div class="vocabulary">${terms(item.vocab)}</div><p>${escapeHtml(item.caution)}</p></section>
        </div>
        <p class="references"><strong>${document.documentElement.lang === 'fr' ? 'Références :' : 'المراجع:'}</strong> ${escapeHtml(item.references)}</p>
        <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'Question de révision' : 'سؤال للمراجعة'}</h3>${paragraph(item.exercise)}</section>
      </article>`).join('');
    toc.innerHTML = items.map((item, i) => `<a href="#${escapeHtml(item.id)}">${String(i + 1).padStart(2, '0')}. ${escapeHtml(item.title)}</a>`).join('');
    progress.textContent = document.documentElement.lang === 'fr' ? `${items.length} unités de lecture` : `${items.length} وحدات للقراءة`;
  }
  function downloadCard(item, format) {
    const french = document.documentElement.lang === 'fr';
    const direction = french ? 'ltr' : 'rtl';
    const label = french ? 'CARTE DE RÉVISION' : 'بطاقة مراجعة';
    const safe = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
    const wrap = (text, limit = 31) => safe(text).split(' ').reduce((lines, word) => {
      const line = lines.at(-1);
      if ((line + ' ' + word).trim().length > limit) lines.push(word); else lines[lines.length - 1] = `${line} ${word}`.trim();
      return lines;
    }, ['']);
    const lines = wrap(item.summary).slice(0, 4).map((line, index) => `<text x="760" y="${385 + index * 54}" text-anchor="end" class="copy">${line}</text>`).join('');
    const terms = item.vocab.slice(0, 3).map((term, index) => `<text x="760" y="${660 + index * 45}" text-anchor="end" class="term">• ${safe(term)}</text>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900"><style>.title{font:700 55px serif;fill:#fff7e8}.meta{font:600 24px sans-serif;fill:#e3bd75;letter-spacing:2px}.copy{font:400 34px sans-serif;fill:#15313b}.term{font:400 25px sans-serif;fill:#fff5e7}</style><rect width="900" height="900" fill="#153b45"/><path d="M0 0H900V142C714 90 186 90 0 142Z" fill="#b77b43"/><rect x="60" y="245" width="780" height="285" rx="28" fill="#fffaf0"/><rect x="60" y="590" width="780" height="195" rx="28" fill="#245b62"/><text x="760" y="70" text-anchor="end" class="meta" direction="${direction}">${label}</text><text x="760" y="185" text-anchor="end" class="title" direction="${direction}">${safe(item.title)}</text>${lines}${terms}<text x="760" y="850" text-anchor="end" class="meta" direction="${direction}">NovaSkill Tech · 2026</text></svg>`;
    const blob = new Blob([svg], { type:'image/svg+xml;charset=utf-8' });
    const image = new Image();
    const url = URL.createObjectURL(blob);
    image.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = 900; canvas.height = 900;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0); URL.revokeObjectURL(url);
      const type = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const extension = format === 'jpeg' ? 'jpg' : 'png';
      canvas.toBlob(result => { const download = document.createElement('a'); download.href = URL.createObjectURL(result); download.download = `aqidah-${item.id}.${extension}`; download.click(); setTimeout(() => URL.revokeObjectURL(download.href), 500); }, type, .94);
    };
    image.src = url;
  }
  function renderStudyTools(items) {
    const cardContainer = document.querySelector('[data-cards]');
    const glossaryContainer = document.querySelector('[data-glossary]');
    const french = document.documentElement.lang === 'fr';
    if (cardContainer) cardContainer.innerHTML = items.map(item => `<article class="recall-card"><p>${escapeHtml(item.track)}</p><h3>${escapeHtml(item.title)}</h3><div class="card-summary">${escapeHtml(item.summary)}</div><div class="card-terms">${terms(item.vocab.slice(0,3))}</div><div class="card-actions"><button type="button" data-download="png" data-id="${escapeHtml(item.id)}">${french ? 'PNG' : 'تنزيل PNG'}</button><button type="button" data-download="jpeg" data-id="${escapeHtml(item.id)}">${french ? 'JPEG' : 'تنزيل JPEG'}</button></div></article>`).join('');
    if (glossaryContainer) {
      const entries = [...new Set(items.flatMap(item => item.vocab))].sort((a,b) => a.localeCompare(b, french ? 'fr' : 'ar'));
      glossaryContainer.innerHTML = entries.map(entry => { const [term, ...definition] = entry.split(':'); return `<article><h3>${escapeHtml(term)}</h3><p>${escapeHtml(definition.join(':').trim())}</p></article>`; }).join('');
    }
  }
  render(data);
  renderStudyTools(data);
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    try { await navigator.clipboard.writeText(button.dataset.copy); button.textContent = copiedLabel; setTimeout(() => { button.textContent = copyLabel; }, 1300); } catch (_) { button.textContent = button.dataset.copy; }
  });
  document.querySelector('[data-search]')?.addEventListener('input', event => {
    const query = event.target.value.trim().toLocaleLowerCase();
    let visible = 0;
    list.querySelectorAll('.lesson').forEach(lesson => { const matched = !query || lesson.dataset.search.toLocaleLowerCase().includes(query); lesson.hidden = !matched; if (matched) visible += 1; });
    progress.textContent = document.documentElement.lang === 'fr' ? `${visible} unité(s) affichée(s)` : `${visible} وحدة ظاهرة`;
  });
  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
    const container = button.closest('.quiz');
    container.querySelectorAll('[data-answer]').forEach(option => { option.dataset.state = option === button ? (option.dataset.answer === 'true' ? 'correct' : 'wrong') : ''; });
    container.querySelector('.quiz-feedback').textContent = button.dataset.answer === 'true' ? button.dataset.correct : button.dataset.wrong;
  }));
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-download]');
    if (!button) return;
    const item = data.find(entry => entry.id === button.dataset.id);
    if (item) downloadCard(item, button.dataset.download);
  });
}());
