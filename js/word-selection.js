/* ═══════════════════════════════════════════════════
   WORD SELECTION
═══════════════════════════════════════════════════ */
async function pickWords() {
  // ── COMMON mode: always use frequency-sorted common pool ──
  if (userMode === 'common') {
    mode = 'common';
    setModeUI('common words', false, []);
    return shuffle(commonPool).slice(0, WORDS_PER_ROUND);
  }

  const weak = getWeakKeys();

  // ── TARGET mode: always target weak keys (or common if none yet) ──
  if (userMode === 'target') {
    if (weak.length === 0) {
      mode = 'common';
      setModeUI('no weak keys yet — keep typing', false, []);
      return shuffle(commonPool).slice(0, WORDS_PER_ROUND);
    }
    mode = 'targeting';
    await Promise.all(weak.map(k => primeLetterCache(k)));
    let pool = [];
    weak.forEach(k => pool.push(...(wordCache[k] || [])));
    pool = [...new Set(pool)];
    if (pool.length < WORDS_PER_ROUND) pool.push(...shuffle(commonPool));
    setModeUI('targeting', true, weak);
    return shuffle([...new Set(pool)]).slice(0, WORDS_PER_ROUND);
  }

  // ── AUTO mode: warmup first, then smart switching ──
  if (rounds < WARMUP_ROUNDS || weak.length === 0) {
    mode = 'warmup';
    setModeUI('warming up', false, []);
    return shuffle(commonPool).slice(0, WORDS_PER_ROUND);
  }

  mode = 'targeting';
  await Promise.all(weak.map(k => primeLetterCache(k)));
  let pool = [];
  weak.forEach(k => pool.push(...(wordCache[k] || [])));
  pool = [...new Set(pool)];
  if (pool.length < WORDS_PER_ROUND) pool.push(...shuffle(commonPool));
  setModeUI('targeting', true, weak);
  return shuffle([...new Set(pool)]).slice(0, WORDS_PER_ROUND);
}

/* ═══════════════════════════════════════════════════
   MODE UI
═══════════════════════════════════════════════════ */
function setModeUI(label, targeting, weakKeys) {
  modeText.textContent = label;
  modeText.className   = 'mode-text' + (targeting ? ' targeting' : '');
  modeDot.className    = 'mode-dot'  + (targeting ? ' targeting' : '');
  weakPills.innerHTML  = weakKeys.map(k =>
    `<div class="weak-pill">${k}</div>`
  ).join('');
}

