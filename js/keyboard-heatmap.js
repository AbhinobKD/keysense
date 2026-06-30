/* ═══════════════════════════════════════════════════
   KEYBOARD HEATMAP
═══════════════════════════════════════════════════ */
function buildKeyboard() {
  const kb = document.getElementById('keyboard');
  kb.innerHTML = '';
  const offsets = [0, 14, 28];
  ROWS.forEach((row, ri) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    rowEl.style.marginLeft = offsets[ri] + 'px';
    row.forEach(k => {
      const el = document.createElement('div');
      el.className = 'kb-key h0';
      el.id = 'kb-' + k;
      el.innerHTML = `${k}<span class="acc-dot"></span>`;
      rowEl.appendChild(el);
    });
    kb.appendChild(rowEl);
  });
}

function updateKeyboard() {
  ALL_KEYS.forEach(k => {
    const el = document.getElementById('kb-' + k);
    if (!el) return;
    const s = keyStats[k];
    if (s.attempts < 2) { el.className = 'kb-key h0'; return; }
    const acc = 1 - s.errors / s.attempts;
    if      (acc >= 0.96) el.className = 'kb-key h-great';
    else if (acc >= 0.90) el.className = 'kb-key h-good';
    else if (acc >= 0.82) el.className = 'kb-key h-ok';
    else                  el.className = 'kb-key h-bad';
  });
}

/* ═══════════════════════════════════════════════════
   WEAK KEY ANALYSIS
═══════════════════════════════════════════════════ */
function getWeakKeys() {
  return ALL_KEYS
    .filter(k => keyStats[k].attempts >= MIN_ATTEMPTS)
    .map(k => ({ k, acc: 1 - keyStats[k].errors / keyStats[k].attempts }))
    .sort((a, b) => a.acc - b.acc)
    .filter(x => x.acc < WEAK_THRESHOLD)
    .slice(0, 3)
    .map(x => x.k);
}

