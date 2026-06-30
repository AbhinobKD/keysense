/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
async function init() {
  loadSavePreference();
  loadHistory();
  setSaveToggleUI();
  renderLifetimePanel();
  buildKeyboard();
  updateKeyboard();
  setModeUI('loading words…', false, []);

  // Show loading in words area
  wordsWrap.innerHTML = '<div class="loading-msg">loading google 10k word list…</div>';

  await primeCommonPool();

  words = shuffle(commonPool).slice(0, WORDS_PER_ROUND);
  wordResult = new Array(words.length).fill('');

  setModeUI('warming up', false, []);
  render();
  prompt.textContent = 'click to begin — or just start typing';

  // pre-cache all letters silently in background
  const primeQueue = [...ALL_KEYS];
  const primeNext = async () => {
    if (primeQueue.length === 0) return;
    const k = primeQueue.shift();
    await primeLetterCache(k);
    setTimeout(primeNext, 150); // stagger to avoid rate limits
  };
  setTimeout(primeNext, 2000);
}

init();
