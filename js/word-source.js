/* ═══════════════════════════════════════════════════
   DATAMUSE FETCHER
   Fetches real English words, filtered to only a–z,
   no spaces, 3–9 chars, sorted by frequency.
═══════════════════════════════════════════════════ */
async function fetchWords(params) {
  const url = DATAMUSE + '?' + new URLSearchParams({ max: 250, md: 'f', ...params });
  try {
    const r = await fetch(url);
    if (!r.ok) return [];
    const data = await r.json();
    return data
      .filter(w => /^[a-z]{3,9}$/.test(w.word))
      .sort((a, b) => {
        // sort by frequency tag (f:N) descending
        const fa = parseFloat((a.tags || []).find(t => t.startsWith('f:'))?.slice(2) || 0);
        const fb = parseFloat((b.tags || []).find(t => t.startsWith('f:'))?.slice(2) || 0);
        return fb - fa;
      })
      .map(w => w.word);
  } catch { return []; }
}

async function primeCommonPool() {
  // Use Google 10,000 most common English words (MIT licensed, no-swears variant)
  // Source: github.com/first20hours/google-10000-english
  const URL = 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt';
  try {
    const r = await fetch(URL);
    if (!r.ok) throw new Error('fetch failed');
    const text = await r.text();
    const all = text.split('\n')
      .map(w => w.trim().toLowerCase())
      .filter(w => /^[a-z]{3,9}$/.test(w)); // only clean alpha words, 3–9 chars
    // The file is already sorted by frequency (most common first)
    // Take top 2000 for the common pool — plenty of variety, all real common words
    commonPool = all.slice(0, 2000);
    console.log(`Common pool loaded: ${commonPool.length} words`);
  } catch (err) {
    console.warn('Failed to load word list, using fallback:', err);
    // Fallback to Datamuse if GitHub is unreachable
    const topics = ['daily','common','life','work','time','home','world'];
    const batches = await Promise.all(topics.map(t => fetchWords({ topics: t })));
    commonPool = shuffle([...new Set(batches.flat())]).slice(0, 400);
    if (commonPool.length === 0) {
      commonPool = ['the','and','for','are','but','not','you','all','can','was','her','has','him','how','new','old','get','set','run','try','use','day','way','now','any','ask','big','far','got','hit','hot','job','key','law','low','map','may','mix','pay','put','say','sir','ten','win','yet','about','after','again','along','every','first','found','group','heart','human','large','learn','light','local','music','never','often','other','place','power','right','serve','since','small','smart','smile','start','state','still','story','study','style','table','teach','think','three','touch','trade','train','trust','truth','under','value','voice','watch','water','where','which','while','whole','world','young','youth'];
    }
  }
}

async function primeLetterCache(letter) {
  if (wordCache[letter] && wordCache[letter].length >= 10) return;
  // Fetch words that START with or CONTAIN many of this letter
  const [starts, contains] = await Promise.all([
    fetchWords({ sp: letter + '*' }),
    fetchWords({ sp: '*' + letter + '*' + letter + '*' }) // at least 2 occurrences
  ]);
  const combined = [...new Set([...starts, ...contains])];
  wordCache[letter] = combined.slice(0, CACHE_PER_LETTER);
}

