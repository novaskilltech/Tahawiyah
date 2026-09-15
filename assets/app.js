(function () {
  const data = window.AQIDAH_CONTENT || [];
  const list = document.querySelector('[data-lessons]');
  const toc = document.querySelector('[data-toc]');
  const progress = document.querySelector('[data-progress]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('.study-drawer');
  const menuBackdrop = document.querySelector('[data-menu-backdrop]');
  const copyLabel = document.documentElement.lang === 'fr' ? 'Copier' : 'نسخ النص';
  const copiedLabel = document.documentElement.lang === 'fr' ? 'Copié' : 'تم النسخ';
  const commentaryUrl = 'https://www.islamweb.net/ar/library/index.php?ID=1&bk_no=106&idfrom=1&idto=338&page=bookcontents';
  const commentaryCitation = french => french
    ? 'Commentaire consulté : Ibn Abî al-ʿIzz, Sharḥ al-ʿAqîda al-Ṭaḥâwiyya, passage correspondant. La présente explication est une rédaction pédagogique indépendante.'
    : 'مرجع الشرح: ابن أبي العز، شرح العقيدة الطحاوية، الموضع الموافق لعبارة المتن. والشرح هنا تحرير تعليمي مستقل.';
  const vocalizedCardTitles = {
    opening:'بَيَانُ الْمَنْهَجِ وَالتَّوْحِيدِ', tanzih:'التَّنْزِيهُ عَنِ الْمِثْلِ وَالْعَجْزِ', eternity:'الْأَزَلُ وَالْبَقَاءُ وَكَمَالُ الرُّبُوبِيَّةِ', attributes:'الْأَوْهَامُ وَالصِّفَاتُ وَالْخَلْقُ',
    qadar:'الْعِلْمُ وَالْقَدَرُ وَالْأَجَلُ', prophethood:'الرِّسَالَةُ وَخَتْمُ النُّبُوَّةِ', quran:'الْقُرْآنُ كَلَامُ اللهِ', unseen:'الإِيمَانُ بِالْغَيْبِ وَأَخْبَارُ الْآخِرَةِ',
    faith:'الإِيمَانُ وَأَهْلُ الْقِبْلَةِ', afterlife:'الْبَعْثُ وَالْحِسَابُ وَالْجَنَّةُ وَالنَّارُ', companions:'الصَّحَابَةُ وَالْعُلَمَاءُ وَالْجَمَاعَةُ', balance:'دِينُ الإِسْلَامِ بَيْنَ طَرَفَيْنِ',
    'names-before-creation':'الْأَسْمَاءُ قَبْلَ الْمَخْلُوقَاتِ', 'knowledge-limits':'الْعِلْمُ الْمَوْجُودُ وَالْعِلْمُ الْمَحْجُوبُ', 'tablet-pen':'اللَّوْحُ وَالْقَلَمُ وَسَبْقُ الْعِلْمِ', 'throne-angels':'الْعَرْشُ وَالْكُرْسِيُّ وَالْمَلَائِكَةُ',
    'prayer-community':'الصَّلَاةُ وَالْجَمَاعَةُ وَوُلَاةُ الْأَمْرِ', grave:'الْقَبْرُ وَالسُّؤَالُ', 'ability-actions':'الِاسْتِطَاعَةُ وَالْكَسْبُ', 'dead-signs':'الدُّعَاءُ لِلْأَمْوَاتِ وَأَشْرَاطُ السَّاعَةِ'
  };
  const vocalizedMatn = {
    opening:'هٰذَا ذِكْرُ بَيَانِ عَقِيدَةِ أَهْلِ السُّنَّةِ وَالْجَمَاعَةِ… نَقُولُ فِي تَوْحِيدِ اللهِ مُعْتَقِدِينَ بِتَوْفِيقِ اللهِ: إِنَّ اللهَ وَاحِدٌ لَا شَرِيكَ لَهُ.',
    tanzih:'وَلَا شَيْءَ مِثْلُهُ، وَلَا شَيْءَ يُعْجِزُهُ، وَلَا إِلٰهَ غَيْرُهُ.',
    eternity:'قَدِيمٌ بِلَا ابْتِدَاءٍ، دَائِمٌ بِلَا انْتِهَاءٍ، لَا يَفْنَى وَلَا يَبِيدُ، وَلَا يَكُونُ إِلَّا مَا يُرِيدُ.',
    attributes:'لَا تَبْلُغُهُ الْأَوْهَامُ، وَلَا تُدْرِكُهُ الْأَفْهَامُ، وَلَا يُشْبِهُ الْأَنَامَ… خَالِقٌ بِلَا حَاجَةٍ، رَازِقٌ بِلَا مَؤُونَةٍ.',
    qadar:'خَلَقَ الْخَلْقَ بِعِلْمِهِ، وَقَدَّرَ لَهُمْ أَقْدَارًا، وَضَرَبَ لَهُمْ آجَالًا… وَأَمَرَهُمْ بِطَاعَتِهِ، وَنَهَاهُمْ عَنْ مَعْصِيَتِهِ.',
    prophethood:'وَأَنَّ مُحَمَّدًا عَبْدُهُ الْمُصْطَفَى، وَنَبِيُّهُ الْمُجْتَبَى، وَرَسُولُهُ الْمُرْتَضَى… وَكُلُّ دَعْوَى النُّبُوَّةِ بَعْدَهُ فَغَيٌّ وَهَوًى.',
    quran:'وَأَنَّ الْقُرْآنَ كَلَامُ اللهِ، مِنْهُ بَدَا بِلَا كَيْفِيَّةٍ قَوْلًا، وَأَنْزَلَهُ عَلَى رَسُولِهِ وَحْيًا… لَيْسَ بِمَخْلُوقٍ كَكَلَامِ الْبَرِيَّةِ.',
    unseen:'وَالرُّؤْيَةُ حَقٌّ لِأَهْلِ الْجَنَّةِ، بِغَيْرِ إِحَاطَةٍ وَلَا كَيْفِيَّةٍ… وَالْمِعْرَاجُ حَقٌّ… وَالْحَوْضُ… وَالشَّفَاعَةُ… وَالْمِيثَاقُ حَقٌّ.',
    faith:'وَنُسَمِّي أَهْلَ قِبْلَتِنَا مُسْلِمِينَ مُؤْمِنِينَ مَا دَامُوا بِمَا جَاءَ بِهِ النَّبِيُّ ﷺ مُعْتَرِفِينَ… وَلَا نُكَفِّرُ أَحَدًا مِنْ أَهْلِ الْقِبْلَةِ بِذَنْبٍ مَا لَمْ يَسْتَحِلَّهُ.',
    afterlife:'وَنُؤْمِنُ بِالْبَعْثِ وَجَزَاءِ الْأَعْمَالِ يَوْمَ الْقِيَامَةِ، وَالْعَرْضِ وَالْحِسَابِ، وَقِرَاءَةِ الْكِتَابِ، وَالثَّوَابِ وَالْعِقَابِ، وَالصِّرَاطِ وَالْمِيزَانِ.',
    companions:'وَنُحِبُّ أَصْحَابَ رَسُولِ اللهِ ﷺ، وَلَا نُفْرِطُ فِي حُبِّ أَحَدٍ مِنْهُمْ، وَلَا نَتَبَرَّأُ مِنْ أَحَدٍ مِنْهُمْ… وَعُلَمَاءُ السَّلَفِ… لَا يُذْكَرُونَ إِلَّا بِالْجَمِيلِ.',
    balance:'وَدِينُ اللهِ فِي الْأَرْضِ وَالسَّمَاءِ وَاحِدٌ، وَهُوَ دِينُ الْإِسْلَامِ… وَهُوَ بَيْنَ الْغُلُوِّ وَالتَّقْصِيرِ، وَبَيْنَ التَّشْبِيهِ وَالتَّعْطِيلِ، وَبَيْنَ الْجَبْرِ وَالْقَدَرِ، وَبَيْنَ الْأَمْنِ وَالْإِيَاسِ.',
    'names-before-creation':'مَا زَالَ بِصِفَاتِهِ قَدِيمًا قَبْلَ خَلْقِهِ… لَيْسَ بَعْدَ خَلْقِ الْخَلْقِ اسْتَفَادَ اسْمَ الْخَالِقِ، وَلَا بِإِحْدَاثِ الْبَرِيَّةِ اسْتَفَادَ اسْمَ الْبَارِئِ.',
    'knowledge-limits':'الْعِلْمُ عِلْمَانِ: عِلْمٌ فِي الْخَلْقِ مَوْجُودٌ، وَعِلْمٌ فِي الْخَلْقِ مَفْقُودٌ… وَلَا يَثْبُتُ الْإِيمَانُ إِلَّا بِقَبُولِ الْعِلْمِ الْمَوْجُودِ، وَتَرْكِ طَلَبِ الْعِلْمِ الْمَفْقُودِ.',
    'tablet-pen':'وَنُؤْمِنُ بِاللَّوْحِ وَالْقَلَمِ وَبِجَمِيعِ مَا فِيهِ قَدْ رُقِمَ… مَا أَخْطَأَ الْعَبْدَ لَمْ يَكُنْ لِيُصِيبَهُ، وَمَا أَصَابَهُ لَمْ يَكُنْ لِيُخْطِئَهُ.',
    'throne-angels':'وَالْعَرْشُ وَالْكُرْسِيُّ حَقٌّ، وَهُوَ مُسْتَغْنٍ عَنِ الْعَرْشِ وَمَا دُونَهُ… وَنُؤْمِنُ بِالْمَلَائِكَةِ وَالنَّبِيِّينَ وَالْكُتُبِ الْمُنَزَّلَةِ عَلَى الْمُرْسَلِينَ.',
    'prayer-community':'وَنَرَى الصَّلَاةَ خَلْفَ كُلِّ بَرٍّ وَفَاجِرٍ مِنْ أَهْلِ الْقِبْلَةِ… وَلَا نَرَى الْخُرُوجَ عَلَى أَئِمَّتِنَا وَوُلَاةِ أُمُورِنَا وَإِنْ جَارُوا… مَا لَمْ يَأْمُرُوا بِمَعْصِيَةٍ.',
    grave:'وَنُؤْمِنُ بِمَلَكِ الْمَوْتِ… وَبِعَذَابِ الْقَبْرِ لِمَنْ كَانَ لَهُ أَهْلًا، وَسُؤَالِ مُنْكَرٍ وَنَكِيرٍ فِي قَبْرِهِ عَنْ رَبِّهِ وَدِينِهِ وَنَبِيِّهِ.',
    'ability-actions':'وَأَفْعَالُ الْعِبَادِ خَلْقُ اللهِ، وَكَسْبٌ مِنَ الْعِبَادِ… وَلَمْ يُكَلِّفْهُمُ اللهُ تَعَالَى إِلَّا مَا يُطِيقُونَ… لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ.',
    'dead-signs':'وَفِي دُعَاءِ الْأَحْيَاءِ وَصَدَقَاتِهِمْ مَنْفَعَةٌ لِلْأَمْوَاتِ… وَنُؤْمِنُ بِأَشْرَاطِ السَّاعَةِ: مِنْ خُرُوجِ الدَّجَّالِ، وَنُزُولِ عِيسَى ابْنِ مَرْيَمَ، وَطُلُوعِ الشَّمْسِ مِنْ مَغْرِبِهَا، وَخُرُوجِ دَابَّةِ الْأَرْضِ.'
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }
  function paragraph(value) { return `<p>${escapeHtml(value)}</p>`; }
  function terms(values) { return values.map(item => `<span class="term">${escapeHtml(item)}</span>`).join(''); }
  function cardTitle(item, french) { return french ? item.title : (vocalizedCardTitles[item.id] || item.title); }
  function displayedMatn(item, french) { return french ? item.matn : (vocalizedMatn[item.id] || item.matn); }
  function render(items) {
    const french = document.documentElement.lang === 'fr';
    if (list) list.innerHTML = items.map((item, i) => `
      <article class="lesson" data-tilt id="${escapeHtml(item.id)}" data-search="${escapeHtml([item.title,item.matn,item.summary,item.simple,item.detailed,item.vocab.join(' ')].join(' '))}">
        <p class="lesson-number">${String(i + 1).padStart(2, '0')} · ${escapeHtml(item.track)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <div class="matn">${escapeHtml(displayedMatn(item, french))}</div>
        <button class="copy" type="button" data-copy="${escapeHtml(displayedMatn(item, french))}">${copyLabel}</button>
        <div class="lesson-details">
          <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'En une phrase' : 'الْخُلَاصَةُ فِي سَطْرٍ'}</h3>${paragraph(item.summary)}</section>
          <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'Explication accessible' : 'شَرْحٌ مُيَسَّرٌ'}</h3>${paragraph(item.simple)}</section>
          <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'Explication développée' : 'شَرْحٌ مُفَصَّلٌ'}</h3>${paragraph(item.detailed)}</section>
          <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'Repères et vocabulaire' : 'مُصْطَلَحَاتٌ وَتَنْبِيهَاتٌ'}</h3><div class="vocabulary">${terms(item.vocab)}</div><p>${escapeHtml(item.caution)}</p></section>
        </div>
        <div class="source-block"><p class="references"><strong>${french ? 'Texte et preuves :' : 'نص المتن والأدلة:'}</strong> ${escapeHtml(item.references)}</p><p class="commentary-reference"><strong>${french ? 'Source de l’explication :' : 'مصدر الشرح:'}</strong> <a href="${commentaryUrl}" target="_blank" rel="noreferrer">${escapeHtml(item.commentaryRef || commentaryCitation(french))}</a></p></div>
        <section class="panel"><h3>${document.documentElement.lang === 'fr' ? 'Question de révision' : 'سُؤَالٌ لِلْمُرَاجَعَةِ'}</h3>${paragraph(item.exercise)}</section>
      </article>`).join('');
    const lessonPath = document.body.dataset.page === 'course' ? '' : 'index.html';
    if (toc) toc.innerHTML = items.map((item, i) => `<a href="${lessonPath}#${escapeHtml(item.id)}" data-drawer-link>${String(i + 1).padStart(2, '0')}. ${escapeHtml(item.title)}</a>`).join('');
    if (progress) progress.textContent = document.documentElement.lang === 'fr' ? `${items.length} unités de lecture` : `${items.length} وحدات للقراءة`;
  }
  async function downloadCard(item, format) {
    const french = document.documentElement.lang === 'fr';
    const title = cardTitle(item, french);
    const cardText = displayedMatn(item, french);
    const vocabulary = item.vocab.slice(0, 3);
    const textFont = french ? '"Source Serif 4", Georgia, serif' : '"Noto Naskh Arabic", serif';
    const titleFont = french ? '"Playfair Display", Georgia, serif' : '"Noto Naskh Arabic", serif';
    const direction = french ? 'ltr' : 'rtl';
    const align = french ? 'left' : 'right';
    const edge = french ? 132 : 1068;
    await Promise.all([
      document.fonts.load(`400 42px ${textFont}`),
      document.fonts.load(`700 64px ${titleFont}`)
    ]);
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 1500;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    context.direction = direction;
    context.textAlign = align;
    context.textBaseline = 'alphabetic';
    const font = (weight, size, family) => `${weight} ${size}px ${family}`;
    const roundedRect = (x, y, width, height, radius, fill, stroke) => {
      context.beginPath(); context.roundRect(x, y, width, height, radius);
      context.fillStyle = fill; context.fill();
      if (stroke) { context.strokeStyle = stroke; context.lineWidth = 2; context.stroke(); }
    };
    const wrap = (value, width) => {
      const words = String(value).trim().split(/\s+/);
      const lines = [];
      let line = '';
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && context.measureText(candidate).width > width) { lines.push(line); line = word; }
        else line = candidate;
      }
      if (line) lines.push(line);
      return lines;
    };
    const fit = (value, width, height, family, weight, maximum, minimum, leading) => {
      for (let size = maximum; size >= minimum; size -= 1) {
        context.font = font(weight, size, family);
        const lines = wrap(value, width);
        const lineHeight = size * leading;
        if (lines.length * lineHeight <= height && lines.every(line => context.measureText(line).width <= width)) {
          return { lines, size, lineHeight, family, weight };
        }
      }
      throw new Error(`Card text does not fit: ${item.id}`);
    };
    const drawLines = (layout, x, firstBaseline, color) => {
      context.font = font(layout.weight, layout.size, layout.family);
      context.fillStyle = color;
      layout.lines.forEach((line, index) => context.fillText(line, x, firstBaseline + index * layout.lineHeight));
    };

    // All heights are reserved before painting; every passage and term remains complete.
    const titleLayout = fit(title, 930, 156, titleFont, 700, french ? 68 : 72, 39, french ? 1.25 : 1.5);
    const passageLayout = fit(cardText, 922, 450, textFont, french ? 400 : 600, french ? 46 : 52, 27, french ? 1.42 : 1.67);
    const termsLayout = vocabulary.map(term => fit(term, 865, 79, textFont, french ? 500 : 600, french ? 30 : 34, 23, french ? 1.28 : 1.55));
    const termTotal = termsLayout.reduce((total, layout) => total + layout.lines.length * layout.lineHeight + 18, 0);
    if (termTotal > 270) throw new Error(`Card vocabulary does not fit: ${item.id}`);

    context.fillStyle = '#f6f3ee'; context.fillRect(0, 0, 1200, 1500);
    context.fillStyle = '#141417'; context.fillRect(0, 0, 1200, 390);
    context.fillStyle = '#f26b17'; context.fillRect(0, 0, 1200, 12);
    context.fillStyle = 'rgba(242,107,23,.11)';
    context.beginPath(); context.arc(french ? 1080 : 120, 0, 255, 0, Math.PI * 2); context.fill();
    context.strokeStyle = 'rgba(255,255,255,.14)'; context.lineWidth = 2;
    context.beginPath(); context.moveTo(72, 108); context.lineTo(1128, 108); context.stroke();
    context.font = font(700, 30, textFont); context.fillStyle = '#ff9a49';
    context.fillText(french ? 'AL-ʿAQÎDA AL-ṬAḤÂWIYYA' : 'الْعَقِيدَةُ الطَّحَاوِيَّةُ', edge, 80);
    context.textAlign = french ? 'right' : 'left';
    context.fillText(String(data.indexOf(item) + 1).padStart(2, '0'), french ? 1068 : 132, 80);
    context.textAlign = align;
    drawLines(titleLayout, edge, 190, '#fffaf5');

    roundedRect(72, 352, 1056, 615, 30, '#fff', '#e5dfd8');
    context.fillStyle = '#f26b17';
    context.fillRect(french ? 72 : 1120, 390, 8, 62);
    context.font = font(700, 26, textFont); context.fillStyle = '#ad4d0b';
    context.fillText(french ? 'PASSAGE DU TEXTE' : 'مِنَ الْمَتْنِ', edge, 438);
    const passageStart = french ? 517 : 531;
    drawLines(passageLayout, edge, passageStart, '#1d1b1b');

    context.font = font(700, 30, titleFont); context.fillStyle = '#151517';
    context.fillText(french ? 'REPÈRES DE LECTURE' : 'مَفَاتِيحُ الْفَهْمِ', edge, 1045);
    context.fillStyle = '#f26b17'; context.fillRect(72, 1065, 1056, 3);
    let termTop = 1122;
    termsLayout.forEach((layout, index) => {
      const textEdge = french ? 165 : 1035;
      context.fillStyle = '#f26b17';
      context.beginPath(); context.arc(french ? 130 : 1070, termTop - 10, 6, 0, Math.PI * 2); context.fill();
      drawLines(layout, textEdge, termTop, '#302c29');
      termTop += layout.lines.length * layout.lineHeight + 18;
    });
    context.strokeStyle = '#dbd4cc'; context.lineWidth = 2;
    context.beginPath(); context.moveTo(72, 1390); context.lineTo(1128, 1390); context.stroke();
    context.font = font(600, 24, textFont); context.fillStyle = '#5f5751';
    context.fillText('NovaSkill Tech · 2026', edge, 1442);
    context.textAlign = french ? 'right' : 'left';
    context.fillText(french ? 'CARTE DE RÉVISION' : 'بِطَاقَةُ مُرَاجَعَةٍ', french ? 1068 : 132, 1442);

    const type = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const extension = format === 'jpeg' ? 'jpg' : 'png';
    const result = await new Promise(resolve => canvas.toBlob(resolve, type, .94));
    if (!result) throw new Error('Card export failed');
    const download = document.createElement('a');
    download.href = URL.createObjectURL(result);
    download.download = `aqidah-${item.id}.${extension}`;
    download.click();
    setTimeout(() => URL.revokeObjectURL(download.href), 2000);
  }
  function renderChapterQuiz(items) {
    let quizList = document.querySelector('[data-quiz-list]');
    if (!quizList) {
      const quizHost = document.querySelector('.quiz');
      if (!quizHost) return;
      const heading = document.createElement('h2');
      heading.textContent = document.documentElement.lang === 'fr' ? 'Questions par unité' : 'أَسْئِلَةٌ لِكُلِّ وَحْدَةٍ';
      quizList = document.createElement('div');
      quizList.className = 'quiz-list';
      quizList.dataset.quizList = '';
      quizHost.append(heading, quizList);
    }
    const french = document.documentElement.lang === 'fr';
    quizList.innerHTML = items.map((item, index) => {
      const options = [
        { text: item.summary, correct: true },
        { text: items[(index + 5) % items.length].summary, correct: false },
        { text: items[(index + 11) % items.length].summary, correct: false }
      ];
      const ordered = options.map((_, optionIndex) => options[(optionIndex + index) % options.length]);
      const question = french
        ? `Quelle proposition résume le mieux l’unité « ${item.title} » ?`
        : `أَيُّ عِبَارَةٍ تُلَخِّصُ وَحْدَةَ «${item.title}» أَدَقَّ تَلْخِيصٍ؟`;
      const correct = french ? 'Bonne réponse : cette proposition correspond à l’idée centrale de l’unité.' : 'إِجَابَةٌ صَحِيحَةٌ: هٰذِهِ الْعِبَارَةُ تُوَافِقُ الْفِكْرَةَ الْمَرْكَزِيَّةَ لِلْوَحْدَةِ.';
      const wrong = french ? 'À revoir : relisez le texte et l’explication de cette unité.' : 'لِلْمُرَاجَعَةِ: أَعِدْ قِرَاءَةَ النَّصِّ وَشَرْحِ هٰذِهِ الْوَحْدَةِ.';
      return `<article class="quiz-question" data-tilt><p class="lesson-number">${String(index + 1).padStart(2, '0')} · ${escapeHtml(item.track)}</p><h3>${escapeHtml(question)}</h3><div class="quiz-options">${ordered.map(option => `<button class="quiz-option" data-answer="${option.correct}" data-correct="${escapeHtml(correct)}" data-wrong="${escapeHtml(wrong)}">${escapeHtml(option.text)}</button>`).join('')}</div><p class="quiz-feedback" aria-live="polite"></p></article>`;
    }).join('');
  }
  function renderStudyTools(items) {
    const cardContainer = document.querySelector('[data-cards]');
    const glossaryContainer = document.querySelector('[data-glossary]');
    const french = document.documentElement.lang === 'fr';
    if (cardContainer) cardContainer.innerHTML = items.map((item, index) => `<article class="recall-card" data-tilt><div class="card-head"><span>${String(index + 1).padStart(2, '0')}</span><p>${escapeHtml(item.track)}</p></div><h3>${escapeHtml(cardTitle(item, french))}</h3><div class="card-rule">${escapeHtml(displayedMatn(item, french))}</div><div class="card-terms">${terms(item.vocab.slice(0,3))}</div><div class="card-actions"><button type="button" data-download="png" data-id="${escapeHtml(item.id)}">${french ? 'Télécharger PNG' : 'تنزيل PNG'}</button><button type="button" data-download="jpeg" data-id="${escapeHtml(item.id)}">${french ? 'Télécharger JPEG' : 'تنزيل JPEG'}</button></div></article>`).join('');
    if (glossaryContainer) {
      const entries = [...new Set(items.flatMap(item => item.vocab))].sort((a,b) => a.localeCompare(b, french ? 'fr' : 'ar'));
      glossaryContainer.innerHTML = entries.map(entry => { const [term, ...definition] = entry.split(':'); return `<article data-tilt><h3>${escapeHtml(term)}</h3><p>${escapeHtml(definition.join(':').trim())}</p></article>`; }).join('');
    }
  }
  render(data);
  renderStudyTools(data);
  renderChapterQuiz(data);
  if (menuToggle && menu) {
    const setMenu = (open, restoreFocus = false) => {
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      menuBackdrop?.setAttribute('aria-hidden', String(!open));
      if (open) {
        menu.querySelector('[data-menu-close]')?.focus();
      } else if (restoreFocus) {
        menuToggle.focus();
      }
    };
    menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
    document.querySelectorAll('[data-menu-close], [data-menu-backdrop]').forEach(element => element.addEventListener('click', () => setMenu(false, true)));
    menu.querySelectorAll('[data-drawer-link]').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') setMenu(false, true); });
  }
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    try { await navigator.clipboard.writeText(button.dataset.copy); button.textContent = copiedLabel; setTimeout(() => { button.textContent = copyLabel; }, 1300); } catch (_) { button.textContent = button.dataset.copy; }
  });
  document.querySelector('[data-search]')?.addEventListener('input', event => {
    if (!list) return;
    const query = event.target.value.trim().toLocaleLowerCase();
    let visible = 0;
    list.querySelectorAll('.lesson').forEach(lesson => { const matched = !query || lesson.dataset.search.toLocaleLowerCase().includes(query); lesson.hidden = !matched; if (matched) visible += 1; });
    progress.textContent = document.documentElement.lang === 'fr' ? `${visible} unité(s) affichée(s)` : `${visible} وحدة ظاهرة`;
  });
  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
    const container = button.closest('.quiz-question') || button.closest('.quiz');
    container.querySelectorAll('[data-answer]').forEach(option => { option.dataset.state = option === button ? (option.dataset.answer === 'true' ? 'correct' : 'wrong') : ''; });
    container.querySelector('.quiz-feedback').textContent = button.dataset.answer === 'true' ? button.dataset.correct : button.dataset.wrong;
  }));
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-download]');
    if (!button) return;
    const item = data.find(entry => entry.id === button.dataset.id);
    if (item) downloadCard(item, button.dataset.download).catch(error => {
      console.error('Card export failed', error);
      button.textContent = document.documentElement.lang === 'fr' ? 'Export indisponible' : 'تَعَذَّرَ التَّنْزِيلُ';
    });
  });
}());
