(function () {
  const data = window.AQIDAH_CONTENT || [];
  const list = document.querySelector('[data-lessons]');
  const toc = document.querySelector('[data-toc]');
  const progress = document.querySelector('[data-progress]');
  const copyLabel = document.documentElement.lang === 'fr' ? 'Copier' : 'نسخ النص';
  const copiedLabel = document.documentElement.lang === 'fr' ? 'Copié' : 'تم النسخ';
  const commentaryUrl = 'https://www.islamweb.net/ar/library/index.php?ID=1&bk_no=106&idfrom=1&idto=338&page=bookcontents';
  const commentaryCitation = french => french
    ? 'Commentaire consulté : Ibn Abî al-ʿIzz, Sharḥ al-ʿAqîda al-Ṭaḥâwiyya, passage correspondant. La présente explication est une rédaction pédagogique indépendante.'
    : 'مرجع الشرح: ابن أبي العز، شرح العقيدة الطحاوية، الموضع الموافق لعبارة المتن. والشرح هنا تحرير تعليمي مستقل.';

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }
  function paragraph(value) { return `<p>${escapeHtml(value)}</p>`; }
  function terms(values) { return values.map(item => `<span class="term">${escapeHtml(item)}</span>`).join(''); }
  function render(items) {
    const french = document.documentElement.lang === 'fr';
    list.innerHTML = items.map((item, i) => `
      <article class="lesson" data-tilt id="${escapeHtml(item.id)}" data-search="${escapeHtml([item.title,item.matn,item.summary,item.simple,item.detailed,item.vocab.join(' ')].join(' '))}">
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
        <div class="source-block"><p class="references"><strong>${french ? 'Texte et preuves :' : 'نص المتن والأدلة:'}</strong> ${escapeHtml(item.references)}</p><p class="commentary-reference"><strong>${french ? 'Source de l’explication :' : 'مصدر الشرح:'}</strong> <a href="${commentaryUrl}" target="_blank" rel="noreferrer">${escapeHtml(item.commentaryRef || commentaryCitation(french))}</a></p></div>
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
    const lines = wrap(item.summary).slice(0, 4).map((line, index) => `<text x="450" y="${380 + index * 54}" text-anchor="middle" class="copy" direction="${direction}">${line}</text>`).join('');
    const terms = item.vocab.slice(0, 3).map((term, index) => `<text x="450" y="${660 + index * 45}" text-anchor="middle" class="term" direction="${direction}">• ${safe(term)}</text>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#101013"/><stop offset="1" stop-color="#2e1710"/></linearGradient></defs><style>.title{font:700 48px serif;fill:#fff}.meta{font:600 22px sans-serif;fill:#ff8a00;letter-spacing:1px}.copy{font:400 32px sans-serif;fill:#111}.term{font:400 24px sans-serif;fill:#fff}</style><rect width="900" height="900" fill="url(#g)"/><rect width="900" height="18" fill="#f25c05"/><circle cx="815" cy="95" r="155" fill="#f25c05" opacity=".26"/><rect x="60" y="245" width="780" height="285" rx="24" fill="#fff"/><rect x="60" y="590" width="780" height="195" rx="24" fill="#17171a" stroke="#ff8a00" stroke-width="2"/><text x="450" y="70" text-anchor="middle" class="meta" direction="${direction}">${label}</text><text x="450" y="185" text-anchor="middle" class="title" direction="${direction}">${safe(item.title)}</text>${lines}${terms}<text x="450" y="850" text-anchor="middle" class="meta">NovaSkill Tech · 2026</text></svg>`;
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
    if (cardContainer) cardContainer.innerHTML = items.map((item, index) => `<article class="recall-card" data-tilt><div class="card-head"><span>${String(index + 1).padStart(2, '0')}</span><p>${escapeHtml(item.track)}</p></div><h3>${escapeHtml(item.title)}</h3><div class="card-rule">${escapeHtml(item.summary)}</div><div class="card-terms">${terms(item.vocab.slice(0,3))}</div><div class="card-actions"><button type="button" data-download="png" data-id="${escapeHtml(item.id)}">${french ? 'Télécharger PNG' : 'تنزيل PNG'}</button><button type="button" data-download="jpeg" data-id="${escapeHtml(item.id)}">${french ? 'Télécharger JPEG' : 'تنزيل JPEG'}</button></div></article>`).join('');
    if (glossaryContainer) {
      const entries = [...new Set(items.flatMap(item => item.vocab))].sort((a,b) => a.localeCompare(b, french ? 'fr' : 'ar'));
      glossaryContainer.innerHTML = entries.map(entry => { const [term, ...definition] = entry.split(':'); return `<article data-tilt><h3>${escapeHtml(term)}</h3><p>${escapeHtml(definition.join(':').trim())}</p></article>`; }).join('');
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
