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
  render(data);
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
}());
