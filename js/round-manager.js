/* ═══════════════════════════════════════════════════
   ROUND MANAGEMENT
═══════════════════════════════════════════════════ */
async function endRound() {
  rounds++;
  lifetimeRounds++;
  flashScreen();
  setModeUI('loading next round…', false, []);
  words = await pickWords();
  wordResult = new Array(words.length).fill('');
  curWord = 0;
  curChar = 0;
  hiddenInput.value = '';
  render();
  if (active) hiddenInput.focus();

  // Pre-fetch next weak keys in background
  const nextWeak = getWeakKeys();
  nextWeak.forEach(k => primeLetterCache(k));

  // persist round completion
  saveHistory();
}

function flashScreen() {
  flash.className = 'flash on';
  setTimeout(() => flash.className = 'flash', 110);
}

/* ═══════════════════════════════════════════════════
   FOCUS
═══════════════════════════════════════════════════ */
typingArea.addEventListener('click', activate);
document.addEventListener('keydown', e => {
  if (!active && e.key.length === 1) activate();
});

function activate() {
  hiddenInput.focus();
  active = true;
  prompt.style.opacity = '0';
}

hiddenInput.addEventListener('blur', () => {
  if (active) {
    prompt.textContent = 'click to resume';
    prompt.style.opacity = '1';
  }
});

