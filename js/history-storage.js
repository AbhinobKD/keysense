/* ═══════════════════════════════════════════════════
   HISTORY / LOCAL STORAGE PERSISTENCE
   Saves keyStats, WPM history, streaks, and lifetime
   totals to localStorage — but ONLY when the user has
   opted in via the "save progress" toggle. Loading/
   displaying previously saved data still works even
   if saving is currently switched off, so the user can
   review old progress before deciding to resume saving.
═══════════════════════════════════════════════════ */
function saveHistory() {
  if (!savingEnabled) return; // user has not opted in — do nothing
  try {
    const payload = {
      v: 1,
      keyStats,
      bestStreak,
      wpmHistory,
      lifetimeWords,
      lifetimeChars,
      lifetimeErrors,
      lifetimeRounds,
      userMode,
      savedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    renderLifetimePanel();
  } catch (err) {
    console.warn('keysense: failed to save history', err);
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return;

    // restore per-key accuracy stats (merge onto initialized keyStats)
    if (data.keyStats) {
      ALL_KEYS.forEach(k => {
        if (data.keyStats[k] &&
            typeof data.keyStats[k].attempts === 'number' &&
            typeof data.keyStats[k].errors   === 'number') {
          keyStats[k] = {
            attempts: data.keyStats[k].attempts,
            errors:   data.keyStats[k].errors
          };
        }
      });
    }

    bestStreak    = typeof data.bestStreak === 'number' ? data.bestStreak : 0;
    wpmHistory    = Array.isArray(data.wpmHistory) ? data.wpmHistory : [];
    lifetimeWords = typeof data.lifetimeWords  === 'number' ? data.lifetimeWords  : 0;
    lifetimeChars = typeof data.lifetimeChars  === 'number' ? data.lifetimeChars  : 0;
    lifetimeErrors= typeof data.lifetimeErrors === 'number' ? data.lifetimeErrors : 0;
    lifetimeRounds= typeof data.lifetimeRounds === 'number' ? data.lifetimeRounds : 0;
  } catch (err) {
    console.warn('keysense: failed to load history', err);
  }
}

function recordWpmSample(wpm, acc) {
  wpmHistory.push({ t: Date.now(), wpm, acc });
  if (wpmHistory.length > WPM_HISTORY_MAX) {
    wpmHistory = wpmHistory.slice(-WPM_HISTORY_MAX);
  }
}

/* ── save-progress opt-in toggle ── */
function loadSavePreference() {
  try {
    savingEnabled = localStorage.getItem(SAVE_PREF_KEY) === 'on';
  } catch (err) {
    savingEnabled = false;
  }
}

function setSaveToggleUI() {
  const btn = document.getElementById('save-toggle');
  const lbl = document.getElementById('save-toggle-lbl');
  if (!btn || !lbl) return;
  btn.className = 'save-toggle' + (savingEnabled ? ' on' : '');
  lbl.textContent = savingEnabled ? 'saving progress' : 'save progress';
}

function toggleSaveProgress() {
  savingEnabled = !savingEnabled;
  try {
    localStorage.setItem(SAVE_PREF_KEY, savingEnabled ? 'on' : 'off');
  } catch (err) {
    console.warn('keysense: failed to save preference', err);
  }
  setSaveToggleUI();

  if (savingEnabled) {
    saveHistory(); // immediately persist current session state on opt-in
  }
}

/* ── lifetime stats panel ── */
function renderLifetimePanel() {
  const grid = document.getElementById('lifetime-grid');
  const wrap = document.getElementById('lifetime-wrap');
  if (!grid || !wrap) return;

  const hasData = lifetimeWords > 0 || bestStreak > 0;
  if (!hasData) {
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = 'flex';

  const lifetimeAcc = lifetimeChars > 0
    ? Math.round(((lifetimeChars - lifetimeErrors) / lifetimeChars) * 100)
    : 100;

  const stats = [
    { val: lifetimeWords,         lbl: 'words' },
    { val: lifetimeAcc + '%',     lbl: 'avg acc' },
    { val: bestStreak,            lbl: 'best streak' },
    { val: lifetimeRounds,        lbl: 'rounds' }
  ];

  grid.innerHTML = stats.map(s =>
    `<div class="lifetime-stat">
       <div class="lifetime-val">${s.val}</div>
       <div class="lifetime-stat-lbl">${s.lbl}</div>
     </div>`
  ).join('');
}

function clearSavedHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('keysense: failed to clear history', err);
  }
  bestStreak = 0;
  wpmHistory = [];
  lifetimeWords = 0;
  lifetimeChars = 0;
  lifetimeErrors = 0;
  lifetimeRounds = 0;
  renderLifetimePanel();
}

