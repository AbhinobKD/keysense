/* ═══════════════════════════════════════════════════
   METRICS
═══════════════════════════════════════════════════ */
function updateMetrics() {
  const mins = sessionStart ? (Date.now() - sessionStart) / 60000 : 0;
  const wpm  = mins > 0 ? Math.round((totalChars / 5) / mins) : 0;
  const acc  = totalChars > 0
    ? Math.round(((totalChars - totalErrors) / totalChars) * 100)
    : 100;

  mWpm.textContent    = wpm  || '—';
  mAcc.textContent    = acc  + '%';
  mWords.textContent  = wordsDone;
  mStreak.textContent = streak;

  mWpm.className   = 'metric-val' + (wpm > 40 ? ' hi' : '');
  mAcc.className   = 'metric-val' + (acc > 95 ? ' hi' : '');
  mStreak.className= 'metric-val' + (streak > 5 ? ' hi' : '');

  // ── persist progress (key accuracy, WPM/acc history, streaks) ──
  recordWpmSample(wpm, acc);
  saveHistory();
}

