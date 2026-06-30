/* ═══════════════════════════════════════════════════
   MODE SWITCHING
═══════════════════════════════════════════════════ */
async function switchMode(m) {
  if (userMode === m) return;
  userMode = m;

  // update button styles
  ['auto','common','target'].forEach(id => {
    const btn = document.getElementById('ms-' + id);
    btn.className = 'ms-btn' + (id === m ? ' active' : '');
  });

  // immediately load new round in the chosen mode
  setModeUI('loading…', false, []);
  words = await pickWords();
  wordResult = new Array(words.length).fill('');
  curWord = 0; curChar = 0;
  hiddenInput.value = '';
  render();
  if (active) hiddenInput.focus();

  // persist mode preference
  saveHistory();
}

