/* ═══════════════════════════════════════════════════
   RENDER
═══════════════════════════════════════════════════ */
function render() {
  wordsWrap.innerHTML = '';
  words.forEach((word, wi) => {
    const wordEl = document.createElement('div');
    wordEl.className = 'word-el';
    wordEl.id = 'w-' + wi;

    const typed = wordResult[wi] || '';

    // if this is current word and we've typed past all chars (cursor at end)
    const isCurrentWord = wi === curWord;
    const pastEnd = isCurrentWord && curChar >= word.length;

    word.split('').forEach((ch, ci) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.id = `c-${wi}-${ci}`;
      span.textContent = ch;

      if (typed[ci] !== undefined) {
        span.classList.add(typed[ci] === ch ? 'correct' : 'wrong');
      } else if (isCurrentWord && ci === curChar) {
        span.classList.add('cursor');
      }
      wordEl.appendChild(span);
    });

    if (pastEnd) wordEl.classList.add('cursor-end');
    wordsWrap.appendChild(wordEl);
  });
}

function patchChar(wi, ci, correct) {
  const el = document.getElementById(`c-${wi}-${ci}`);
  if (!el) return;
  el.className = 'ch ' + (correct ? 'correct' : 'wrong');
}

function moveCursor() {
  // clear old cursor
  document.querySelectorAll('.ch.cursor').forEach(e => e.classList.remove('cursor'));
  document.querySelectorAll('.word-el.cursor-end').forEach(e => e.classList.remove('cursor-end'));

  if (curChar < (words[curWord] || '').length) {
    const el = document.getElementById(`c-${curWord}-${curChar}`);
    if (el) el.classList.add('cursor');
  } else {
    const wordEl = document.getElementById('w-' + curWord);
    if (wordEl) wordEl.classList.add('cursor-end');
  }
}

