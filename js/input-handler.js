/* ═══════════════════════════════════════════════════
   INPUT HANDLING
═══════════════════════════════════════════════════ */
hiddenInput.addEventListener('input', () => {
  if (!active) return;
  if (!sessionStart) sessionStart = Date.now();

  const val = hiddenInput.value;
  const word = words[curWord];

  // SPACE → advance word
  if (val.endsWith(' ') || val === ' ') {
    const typed = val.trim();
    if (typed.length === 0) { hiddenInput.value = ''; return; } // ignore accidental space at start

    wordResult[curWord] = typed;

    // Score every character position in the target word
    word.split('').forEach((ch, ci) => {
      keyStats[ch].attempts++;
      if (typed[ci] !== ch) keyStats[ch].errors++;
    });

    const correct = typed === word;
    if (correct) { streak++; } else { streak = 0; }
    wordsDone++;
    totalChars += typed.length + 1;
    if (!correct) totalErrors += Math.abs(typed.length - word.length) +
      word.split('').filter((c,i) => typed[i] !== c).length;

    // ── update lifetime/persisted history (additive, does not affect session stats) ──
    if (streak > bestStreak) bestStreak = streak;
    lifetimeWords++;
    lifetimeChars += typed.length + 1;
    if (!correct) lifetimeErrors += Math.abs(typed.length - word.length) +
      word.split('').filter((c,i) => typed[i] !== c).length;

    // render typed word result
    word.split('').forEach((ch, ci) => {
      patchChar(curWord, ci, typed[ci] === ch);
    });

    curWord++;
    curChar = 0;
    hiddenInput.value = '';

    updateMetrics();
    updateKeyboard();

    if (curWord >= words.length) {
      endRound();
      return;
    }
    moveCursor();
    return;
  }

  // Live typing within word
  wordResult[curWord] = val;
  curChar = val.length;

  word.split('').forEach((ch, ci) => {
    const typedCh = val[ci];
    const el = document.getElementById(`c-${curWord}-${ci}`);
    if (!el) return;
    if (typedCh === undefined) {
      el.className = 'ch';
    } else {
      el.className = 'ch ' + (typedCh === ch ? 'correct' : 'wrong');
    }
  });

  moveCursor();
});

hiddenInput.addEventListener('keydown', e => {
  // Prevent cursor keys from shifting focus
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) e.preventDefault();
});

