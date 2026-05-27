/**
 * ============================================================
 * InformaticaUmanistica — Laboratorio Interattivo
 * ============================================================
 * Strumenti di analisi testuale lato client per esplorare
 * la letteratura con metodi computazionali.
 *
 * Funzionalità:
 * 1. Analisi statistica del testo
 * 2. Word Cloud (nuvola di parole)
 * 3. Indice di leggibilità Gulpease
 * 4. Confronto tra due testi
 * 5. Analisi del sentiment (basica, lessicale)
 * ============================================================
 */

// === ITALIAN STOPWORDS ===
const STOPWORDS_IT = new Set([
  'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una',
  'di', 'del', 'dello', 'della', 'dei', 'degli', 'delle',
  'a', 'al', 'allo', 'alla', 'ai', 'agli', 'alle',
  'da', 'dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle',
  'in', 'nel', 'nello', 'nella', 'nei', 'negli', 'nelle',
  'su', 'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle',
  'con', 'per', 'tra', 'fra',
  'e', 'ed', 'o', 'od', 'ma', 'però', 'che', 'ché', 'se',
  'non', 'né', 'più', 'anche', 'come', 'così', 'dove', 'quando',
  'chi', 'cosa', 'quale', 'quanto', 'questo', 'quello',
  'suo', 'sua', 'suoi', 'sue', 'mio', 'mia', 'miei', 'mie',
  'tuo', 'tua', 'tuoi', 'tue', 'nostro', 'nostra', 'nostri', 'nostre',
  'vostro', 'vostra', 'vostri', 'vostre', 'loro',
  'si', 'ci', 'vi', 'ne', 'mi', 'ti', 'lo', 'li', 'me', 'te',
  'è', 'sono', 'era', 'erano', 'essere', 'stato', 'stata', 'stati', 'state',
  'ha', 'ho', 'hai', 'hanno', 'aveva', 'avere', 'avuto',
  'fa', 'fatto', 'fare', 'può', 'deve',
  'molto', 'poco', 'troppo', 'tanto', 'tutto', 'tutti', 'tutta', 'tutte',
  'altro', 'altra', 'altri', 'altre',
  'proprio', 'stesso', 'stessa', 'stessi', 'stesse',
  'già', 'ancora', 'sempre', 'mai', 'poi', 'prima', 'dopo',
  'qui', 'qua', 'là', 'lì', 'ora', 'allora',
  'io', 'tu', 'lui', 'lei', 'noi', 'voi', 'essi', 'esse',
  'quel', 'quella', 'quei', 'quelle', 'quelli',
  'ogni', 'qualche', 'alcuno', 'alcuni',
  'sé', 'essa', 'perché', 'affinché', 'benché', 'sebbene',
  'parte', 'attraverso', 'senza', 'contro', 'verso', 'dentro', 'fuori',
  'sopra', 'sotto', 'oltre', 'fino',
  'ahi', 'oh', 'ah',
]);

// === SENTIMENT LEXICON (Italian) ===
const SENTIMENT_POSITIVE = new Set([
  'amore', 'bello', 'bella', 'bellezza', 'gioia', 'felice', 'felicità',
  'luce', 'sole', 'speranza', 'dolce', 'dolcezza', 'pace', 'sereno',
  'libero', 'libertà', 'cuore', 'vita', 'vivere', 'splendore', 'splendido',
  'magnifico', 'gloria', 'glorioso', 'nobile', 'gentile', 'grazia',
  'paradiso', 'cielo', 'stella', 'stelle', 'fiore', 'fiori', 'primavera',
  'riso', 'ridere', 'sorridere', 'sorriso', 'cantare', 'canto',
  'forte', 'forza', 'coraggio', 'ardore', 'virtù', 'virtuoso',
  'puro', 'purezza', 'innocente', 'innocenza', 'bene', 'buono', 'buona',
  'meraviglia', 'meraviglioso', 'incanto', 'incantevole', 'sublime',
  'trionfo', 'vittoria', 'onore', 'lealtà', 'fedele', 'fedeltà',
  'armonia', 'melodia', 'soave', 'celeste', 'divino', 'divina',
  'prezioso', 'gemma', 'oro', 'tesoro', 'ricchezza',
  'amicizia', 'amica', 'amico', 'compagno', 'fratello', 'sorella',
  'abbracciare', 'abbraccio', 'carezza', 'tenerezza', 'tenero',
  'fiorito', 'rigoglioso', 'verde', 'aurora', 'alba',
]);

const SENTIMENT_NEGATIVE = new Set([
  'morte', 'morire', 'dolore', 'soffrire', 'sofferenza', 'pianto',
  'piangere', 'lacrime', 'buio', 'oscuro', 'oscurità', 'tenebre',
  'paura', 'terrore', 'orrore', 'orrendo', 'tremendo', 'crudele',
  'crudeltà', 'male', 'malvagio', 'cattivo', 'peccato', 'colpa',
  'inferno', 'dannato', 'dannazione', 'pena', 'tormento', 'tormentare',
  'guerra', 'sangue', 'ferita', 'ferire', 'spada', 'vendetta',
  'odio', 'odiare', 'ira', 'rabbia', 'furore', 'furia',
  'triste', 'tristezza', 'sconforto', 'disperazione', 'disperato',
  'smarrito', 'perduto', 'perdere', 'smarrire', 'solitudine', 'solo', 'sola',
  'vuoto', 'nulla', 'niente', 'ombra', 'ombre', 'fantasma',
  'prigione', 'catena', 'catene', 'schiavo', 'schiavitù',
  'tradimento', 'tradire', 'traditore', 'inganno', 'ingannare',
  'veleno', 'velenoso', 'serpente', 'demone', 'diavolo',
  'miseria', 'misero', 'rovina', 'rovinare', 'distruzione', 'distruggere',
  'abbandono', 'abbandonare', 'abbandonato',
  'gelo', 'freddo', 'ghiaccio', 'inverno', 'notte', 'tempesta',
  'grido', 'gridare', 'urlo', 'urlare', 'lamento', 'gemito',
  'selva', 'selvaggio', 'aspro', 'duro', 'dura', 'amaro', 'amara',
]);

// === UTILITY FUNCTIONS ===

/**
 * Tokenize text into words, removing punctuation
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\wàáâãäåèéêëìíîïòóôõöùúûüýÿñç\s'-]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1);
}

/**
 * Remove stopwords from tokens
 */
function removeStopwords(tokens) {
  return tokens.filter(w => !STOPWORDS_IT.has(w));
}

/**
 * Count word frequencies
 */
function wordFrequency(tokens) {
  const freq = {};
  for (const word of tokens) {
    freq[word] = (freq[word] || 0) + 1;
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]);
}

/**
 * Count sentences in text
 */
function countSentences(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return Math.max(sentences.length, 1);
}

/**
 * Count syllables in an Italian word (approximation)
 */
function countSyllables(word) {
  word = word.toLowerCase();
  const vowels = 'aeiouàáâãäåèéêëìíîïòóôõöùúûüýÿ';
  let count = 0;
  let prevVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevVowel) {
      count++;
    }
    prevVowel = isVowel;
  }

  return Math.max(count, 1);
}

/**
 * Calculate average word length
 */
function avgWordLength(tokens) {
  if (tokens.length === 0) return 0;
  const total = tokens.reduce((sum, w) => sum + w.length, 0);
  return (total / tokens.length).toFixed(1);
}

/**
 * Calculate type-token ratio (vocabulary richness)
 */
function typeTokenRatio(tokens) {
  if (tokens.length === 0) return 0;
  const unique = new Set(tokens);
  return (unique.size / tokens.length).toFixed(3);
}

/**
 * Find hapax legomena (words appearing only once)
 */
function hapaxLegomena(tokens) {
  const freq = {};
  for (const w of tokens) {
    freq[w] = (freq[w] || 0) + 1;
  }
  return Object.entries(freq).filter(([, count]) => count === 1).map(([word]) => word);
}

// === ANALYSIS FUNCTIONS ===

/**
 * 1. ANALISI TESTO COMPLETA
 */
function analyzeText() {
  const input = document.getElementById('analyzer-input').value.trim();
  const results = document.getElementById('analyzer-results');

  if (!input) {
    results.innerHTML = '<p style="color: var(--color-pink);">⚠️ Inserisci un testo da analizzare.</p>';
    return;
  }

  const tokens = tokenize(input);
  const contentWords = removeStopwords(tokens);
  const frequencies = wordFrequency(contentWords);
  const sentences = countSentences(input);
  const uniqueWords = new Set(tokens);
  const hapax = hapaxLegomena(tokens);
  const avgLen = avgWordLength(tokens);
  const ttr = typeTokenRatio(tokens);
  const avgSentenceLen = (tokens.length / sentences).toFixed(1);

  // Top 10 words
  const top10 = frequencies.slice(0, 10);

  results.innerHTML = `
    <p class="lab-results-title">📊 Risultati dell'Analisi</p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-xl);">
      <div style="text-align: center; padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--color-primary-light);">${input.length}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); margin-top: 4px;">Caratteri</div>
      </div>
      <div style="text-align: center; padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--color-accent);">${tokens.length}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); margin-top: 4px;">Parole</div>
      </div>
      <div style="text-align: center; padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--color-cyan);">${uniqueWords.size}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); margin-top: 4px;">Parole uniche</div>
      </div>
      <div style="text-align: center; padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--color-pink);">${sentences}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); margin-top: 4px;">Frasi</div>
      </div>
      <div style="text-align: center; padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--color-amber);">${avgLen}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); margin-top: 4px;">Lung. media parola</div>
      </div>
      <div style="text-align: center; padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--color-primary-light);">${ttr}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-tertiary); margin-top: 4px;">TTR (ricchezza)</div>
      </div>
    </div>

    <div style="margin-bottom: var(--space-xl);">
      <h4 style="font-family: var(--font-heading); margin-bottom: var(--space-md);">🏆 Top 10 Parole (escluse stopwords)</h4>
      ${top10.map(([word, count], i) => `
        <div class="stat-bar-group">
          <div class="stat-bar-label">
            <span>${i + 1}. <strong>${word}</strong></span>
            <span>${count}x</span>
          </div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill" style="width: ${(count / top10[0][1] * 100)}%; transition-delay: ${i * 0.1}s;"></div>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="margin-bottom: var(--space-md);">
      <h4 style="font-family: var(--font-heading); margin-bottom: var(--space-sm);">📖 Metriche avanzate</h4>
      <p style="font-size: var(--text-sm); color: var(--color-text-secondary);">
        <strong>Frase media:</strong> ${avgSentenceLen} parole &nbsp;|&nbsp;
        <strong>Hapax legomena:</strong> ${hapax.length} parole (appaiono 1 sola volta) &nbsp;|&nbsp;
        <strong>Densità lessicale:</strong> ${((contentWords.length / tokens.length) * 100).toFixed(1)}%
      </p>
    </div>
  `;

  // Animate stat bars
  requestAnimationFrame(() => {
    results.querySelectorAll('.stat-bar-fill').forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0';
      requestAnimationFrame(() => {
        bar.style.width = width;
      });
    });
  });
}

/**
 * 2. WORD CLOUD
 */
function generateWordCloud() {
  const input = document.getElementById('wordcloud-input').value.trim();
  const container = document.getElementById('word-cloud-container');

  if (!input) {
    container.innerHTML = '<p style="color: var(--color-pink);">⚠️ Inserisci un testo per generare la word cloud.</p>';
    return;
  }

  const tokens = tokenize(input);
  const contentWords = removeStopwords(tokens);
  const frequencies = wordFrequency(contentWords);
  const top40 = frequencies.slice(0, 40);

  if (top40.length === 0) {
    container.innerHTML = '<p style="color: var(--color-text-tertiary);">Nessuna parola significativa trovata.</p>';
    return;
  }

  const maxFreq = top40[0][1];

  const colors = [
    'var(--color-primary-light)',
    'var(--color-accent)',
    'var(--color-cyan)',
    'var(--color-pink)',
    'var(--color-amber)',
    '#818cf8', '#fb923c', '#a78bfa', '#34d399', '#f472b6',
  ];

  container.innerHTML = top40.map(([word, count], i) => {
    const scale = Math.max(0.7, (count / maxFreq) * 2.5);
    const fontSize = Math.max(12, Math.min(48, scale * 18));
    const color = colors[i % colors.length];
    const opacity = Math.max(0.6, count / maxFreq);
    const rotation = Math.random() > 0.8 ? `transform: rotate(${Math.random() > 0.5 ? 12 : -12}deg);` : '';

    return `<span class="word-cloud-item" style="
      font-size: ${fontSize}px;
      color: ${color};
      opacity: ${opacity};
      ${rotation}
      animation-delay: ${i * 0.05}s;
    " title="${word}: ${count} occorrenze">${word}</span>`;
  }).join('');
}

/**
 * 3. INDICE DI LEGGIBILITÀ GULPEASE
 */
function analyzeReadability() {
  const input = document.getElementById('readability-input').value.trim();
  const results = document.getElementById('readability-results');

  if (!input) {
    results.innerHTML = '<p style="color: var(--color-pink);">⚠️ Inserisci un testo per calcolarne la leggibilità.</p>';
    return;
  }

  const tokens = tokenize(input);
  const sentences = countSentences(input);
  const totalLetters = tokens.join('').length;

  // Gulpease Index: 89 + (300 * sentences - 10 * letters) / words
  const gulpease = Math.round(89 + ((300 * sentences) - (10 * totalLetters)) / tokens.length);
  const clampedGulpease = Math.max(0, Math.min(100, gulpease));

  // Interpretation
  let level, levelColor, levelDesc;
  if (clampedGulpease >= 80) {
    level = 'Molto facile';
    levelColor = 'var(--color-accent)';
    levelDesc = 'Comprensibile da chi ha la licenza elementare.';
  } else if (clampedGulpease >= 60) {
    level = 'Facile';
    levelColor = 'var(--color-cyan)';
    levelDesc = 'Comprensibile da chi ha la licenza media.';
  } else if (clampedGulpease >= 40) {
    level = 'Medio';
    levelColor = 'var(--color-amber)';
    levelDesc = 'Comprensibile da chi ha il diploma superiore.';
  } else {
    level = 'Difficile';
    levelColor = 'var(--color-pink)';
    levelDesc = 'Testo complesso, richiede istruzione universitaria.';
  }

  // Flesch-Kincaid adapted for Italian (approximation)
  const totalSyllables = tokens.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSyllPerWord = (totalSyllables / tokens.length).toFixed(2);
  const avgWordsPerSent = (tokens.length / sentences).toFixed(1);

  results.innerHTML = `
    <p class="lab-results-title">📐 Indice di Leggibilità Gulpease</p>

    <div style="text-align: center; margin: var(--space-2xl) 0;">
      <div style="position: relative; width: 160px; height: 160px; margin: 0 auto;">
        <svg viewBox="0 0 120 120" style="transform: rotate(-90deg);">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" stroke-width="8" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="${levelColor}" stroke-width="8"
            stroke-dasharray="${clampedGulpease * 3.267} 326.7"
            stroke-linecap="round"
            style="transition: stroke-dasharray 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);" />
        </svg>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
          <div style="font-size: var(--text-3xl); font-weight: 900; color: ${levelColor};">${clampedGulpease}</div>
          <div style="font-size: var(--text-xs); color: var(--color-text-tertiary);">/100</div>
        </div>
      </div>
      <div style="margin-top: var(--space-md);">
        <span style="font-size: var(--text-lg); font-weight: 700; color: ${levelColor};">${level}</span>
        <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-top: var(--space-xs);">${levelDesc}</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md);">
      <div style="text-align: center; padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="font-weight: 700;">${avgWordsPerSent}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-tertiary);">Parole/frase</div>
      </div>
      <div style="text-align: center; padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="font-weight: 700;">${avgSyllPerWord}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-tertiary);">Sillabe/parola</div>
      </div>
      <div style="text-align: center; padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="font-weight: 700;">${totalLetters}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-tertiary);">Lettere totali</div>
      </div>
    </div>

    <div style="margin-top: var(--space-xl); padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
      <p style="font-size: var(--text-sm); color: var(--color-text-secondary);">
        <strong>ℹ️ L'indice Gulpease</strong> è un indice di leggibilità specifico per la lingua italiana,
        sviluppato dal GULP (Gruppo Universitario Linguistico Pedagogico) presso l'Università di Roma La Sapienza.
        Valori più alti indicano testi più facili da leggere.
      </p>
    </div>
  `;
}

/**
 * 4. CONFRONTO TRA PIÙ TESTI
 */
function updateComparisonInputs() {
  const count = parseInt(document.getElementById('comparison-count').value, 10);
  const container = document.getElementById('comparison-inputs-container');
  let html = '';

  for (let i = 1; i <= count; i++) {
    const letter = String.fromCharCode(64 + i); // A, B, C...
    html += \`
      <div class="comparison-col" style="display: flex; flex-direction: column;">
        <p class="comparison-col-title">📜 Testo \${letter}</p>
        <textarea class="lab-textarea" id="comparison-input-\${i}" placeholder="Testo \${letter} da confrontare..." style="min-height: 120px; flex-grow: 1;"></textarea>
      </div>
    \`;
  }
  container.innerHTML = html;
}

// Inizializza i campi al caricamento
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('comparison-inputs-container');
  if (container) updateComparisonInputs();
});

function compareTexts() {
  const count = parseInt(document.getElementById('comparison-count').value, 10);
  const results = document.getElementById('comparison-results');

  const texts = [];
  for (let i = 1; i <= count; i++) {
    const val = document.getElementById(\`comparison-input-\${i}\`).value.trim();
    if (!val) {
      results.innerHTML = '<p style="color: var(--color-pink);">⚠️ Inserisci tutti i testi da confrontare (oppure riduci il numero dal menu a tendina).</p>';
      return;
    }
    texts.push({
      label: String.fromCharCode(64 + i),
      raw: val,
      tokens: tokenize(val)
    });
  }

  // Pre-calcola statistiche per ogni testo
  texts.forEach(t => {
    t.content = removeStopwords(t.tokens);
    t.unique = new Set(t.tokens);
    t.ttr = typeTokenRatio(t.tokens);
    t.avgLen = avgWordLength(t.tokens);

    // Genera Cloud (Cirrus) HTML
    const freq = wordFrequency(t.content).slice(0, 35);
    const maxFreq = freq.length > 0 ? freq[0][1] : 1;
    const colors = ['var(--color-primary-light)', 'var(--color-accent)', 'var(--color-cyan)', 'var(--color-pink)', 'var(--color-amber)'];
    
    t.cloudHtml = freq.map(([w, c], i) => {
      const scale = Math.max(0.7, (c / maxFreq) * 2.5);
      const fontSize = Math.max(10, Math.min(32, scale * 12));
      const color = colors[i % colors.length];
      const opacity = Math.max(0.6, c / maxFreq);
      return \`<span style="font-size: \${fontSize}px; color: \${color}; opacity: \${opacity}; margin: 2px 4px; display: inline-block;">\${w}</span>\`;
    }).join('');
  });

  // Jaccard similarity (Media di tutte le coppie se > 2)
  let sumJaccard = 0;
  let pairs = 0;
  for(let i=0; i<texts.length; i++) {
    for(let j=i+1; j<texts.length; j++) {
      const intersection = new Set([...texts[i].unique].filter(x => texts[j].unique.has(x)));
      const union = new Set([...texts[i].unique, ...texts[j].unique]);
      sumJaccard += (intersection.size / union.size);
      pairs++;
    }
  }
  const avgJaccard = (sumJaccard / pairs).toFixed(3);

  // Vocabolario condiviso tra TUTTI i testi
  let sharedWordsSet = new Set([...texts[0].unique]);
  for(let i=1; i<texts.length; i++) {
    sharedWordsSet = new Set([...sharedWordsSet].filter(x => texts[i].unique.has(x)));
  }
  const sharedWords = [...sharedWordsSet].filter(w => !STOPWORDS_IT.has(w)).slice(0, 20);

  // HTML Reports
  let reportsHtml = \`<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-xl); margin-bottom: var(--space-xl);">\`;
  
  texts.forEach(t => {
    reportsHtml += \`
    <div style="background: var(--color-bg-glass); padding: var(--space-lg); border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h4 style="font-family: var(--font-heading); margin-bottom: var(--space-sm); color: var(--color-primary-light); font-size: var(--text-lg);">📜 Testo \${t.label}</h4>
      <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
        Parole: <strong>\${t.tokens.length}</strong> | Uniche: <strong>\${t.unique.size}</strong><br>
        TTR: <strong>\${t.ttr}</strong> | Lung. media: <strong>\${t.avgLen}</strong>
      </p>
      <div style="border-top: 1px solid var(--color-border); padding-top: var(--space-md); margin-top: var(--space-md);">
        <h5 style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-tertiary); margin-bottom: var(--space-sm);">☁️ Cirrus Word Cloud</h5>
        <div style="text-align: center; line-height: 1.3; background: rgba(0,0,0,0.2); padding: var(--space-md); border-radius: var(--radius-md); min-height: 150px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center;">
          \${t.cloudHtml || '<span style="color: var(--color-text-tertiary); font-size: var(--text-sm);">Testo insufficiente</span>'}
        </div>
      </div>
    </div>
    \`;
  });
  reportsHtml += \`</div>\`;

  results.innerHTML = \`
    <p class="lab-results-title">⚖️ Risultati del Confronto (\${count} testi)</p>

    <div style="text-align: center; margin: var(--space-xl) 0;">
      <div style="font-size: var(--text-4xl); font-weight: 900; background: var(--gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        \${(avgJaccard * 100).toFixed(1)}%
      </div>
      <div style="font-size: var(--text-sm); color: var(--color-text-tertiary);">Similarità di Jaccard (Media)</div>
      
      <div style="margin-top: var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); max-width: 650px; margin-left: auto; margin-right: auto; padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: rgba(139, 92, 246, 0.05); text-align: left; line-height: 1.5;">
        <strong>ℹ️ Cos'è questo valore?</strong><br>
        L'indice di Jaccard, noto anche come coefficiente di similarità di Jaccard (originariamente denominato <em>coefficient de communauté</em> da Paul Jaccard), è un indice statistico utilizzato per confrontare la similarità e la diversità di insiemi campionari. 
        \${count > 2 ? 'In questo caso, viene mostrata la similarità media tra tutte le possibili coppie di testi analizzati.' : ''}
      </div>
    </div>

    \${reportsHtml}

    \${sharedWords.length > 0 ? \`
    <div style="margin-bottom: var(--space-xl); background: var(--color-bg-glass); padding: var(--space-lg); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
      <h4 style="font-family: var(--font-heading); margin-bottom: var(--space-md);">🤝 Vocabolario condiviso (presente in tutti i testi)</h4>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
        \${sharedWords.map(w => \`<span class="resource-tag tool">\${w}</span>\`).join('')}
      </div>
    </div>\` : ''}
  \`;
}

/**
 * 5. ANALISI DEL SENTIMENT (basica, lessicale)
 */
function analyzeSentiment() {
  const input = document.getElementById('sentiment-input').value.trim();
  const results = document.getElementById('sentiment-results');

  if (!input) {
    results.innerHTML = '<p style="color: var(--color-pink);">⚠️ Inserisci un testo per analizzare il sentiment.</p>';
    return;
  }

  const tokens = tokenize(input);

  let positiveCount = 0;
  let negativeCount = 0;
  const positiveWords = [];
  const negativeWords = [];

  for (const token of tokens) {
    if (SENTIMENT_POSITIVE.has(token)) {
      positiveCount++;
      if (!positiveWords.includes(token)) positiveWords.push(token);
    }
    if (SENTIMENT_NEGATIVE.has(token)) {
      negativeCount++;
      if (!negativeWords.includes(token)) negativeWords.push(token);
    }
  }

  const total = positiveCount + negativeCount;
  const neutralCount = tokens.length - total;

  let sentiment, sentimentEmoji, sentimentColor;
  if (total === 0) {
    sentiment = 'Neutro';
    sentimentEmoji = '😐';
    sentimentColor = 'var(--color-text-secondary)';
  } else if (positiveCount > negativeCount * 1.5) {
    sentiment = 'Positivo';
    sentimentEmoji = '😊';
    sentimentColor = 'var(--color-accent)';
  } else if (negativeCount > positiveCount * 1.5) {
    sentiment = 'Negativo';
    sentimentEmoji = '😔';
    sentimentColor = 'var(--color-pink)';
  } else if (positiveCount > negativeCount) {
    sentiment = 'Leggermente positivo';
    sentimentEmoji = '🙂';
    sentimentColor = 'var(--color-accent)';
  } else if (negativeCount > positiveCount) {
    sentiment = 'Leggermente negativo';
    sentimentEmoji = '🙁';
    sentimentColor = 'var(--color-amber)';
  } else {
    sentiment = 'Misto / Ambivalente';
    sentimentEmoji = '🤔';
    sentimentColor = 'var(--color-cyan)';
  }

  const posPerc = total > 0 ? ((positiveCount / total) * 100).toFixed(0) : 50;
  const negPerc = total > 0 ? ((negativeCount / total) * 100).toFixed(0) : 50;

  results.innerHTML = `
    <p class="lab-results-title">💬 Analisi del Sentiment</p>

    <div style="text-align: center; margin: var(--space-xl) 0;">
      <div style="font-size: 4rem; margin-bottom: var(--space-sm);">${sentimentEmoji}</div>
      <div style="font-size: var(--text-2xl); font-weight: 800; color: ${sentimentColor};">${sentiment}</div>
    </div>

    <div style="margin-bottom: var(--space-xl);">
      <div style="display: flex; justify-content: space-between; font-size: var(--text-sm); margin-bottom: var(--space-xs);">
        <span style="color: var(--color-accent);">😊 Positivo: ${positiveCount}</span>
        <span style="color: var(--color-pink);">😔 Negativo: ${negativeCount}</span>
      </div>
      <div style="height: 12px; border-radius: var(--radius-full); overflow: hidden; display: flex; background: var(--color-bg-glass);">
        <div style="width: ${posPerc}%; background: var(--color-accent); transition: width 1s ease;"></div>
        <div style="width: ${negPerc}%; background: var(--color-pink); transition: width 1s ease;"></div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl);">
      <div>
        <h4 style="font-family: var(--font-heading); margin-bottom: var(--space-sm); color: var(--color-accent);">😊 Parole positive</h4>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
          ${positiveWords.slice(0, 15).map(w => `<span class="resource-tag free">${w}</span>`).join('') || '<span style="color: var(--color-text-tertiary); font-size: var(--text-sm);">Nessuna trovata</span>'}
        </div>
      </div>
      <div>
        <h4 style="font-family: var(--font-heading); margin-bottom: var(--space-sm); color: var(--color-pink);">😔 Parole negative</h4>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
          ${negativeWords.slice(0, 15).map(w => `<span style="display: inline-block; padding: 2px var(--space-sm); border-radius: var(--radius-sm); font-size: var(--text-xs); font-weight: 600; background: rgba(236, 72, 153, 0.15); color: var(--color-pink);">${w}</span>`).join('') || '<span style="color: var(--color-text-tertiary); font-size: var(--text-sm);">Nessuna trovata</span>'}
        </div>
      </div>
    </div>

    <div style="margin-top: var(--space-xl); padding: var(--space-md); background: var(--color-bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
      <p style="font-size: var(--text-sm); color: var(--color-text-secondary);">
        <strong>ℹ️ Nota:</strong> L'analisi del sentiment è basata su un lessico di parole italiane.
        Un'analisi più precisa richiederebbe modelli NLP avanzati (es. BERT per l'italiano).
        Questo strumento è pensato a scopo <strong>didattico</strong> per introdurre il concetto di sentiment analysis.
      </p>
    </div>
  `;
}
