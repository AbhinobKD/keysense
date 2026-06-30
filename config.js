/* ═══════════════════════════════════════════════════
   CONFIGURATION
═══════════════════════════════════════════════════ */
const DATAMUSE = 'https://api.datamuse.com/words';
const WORDS_PER_ROUND  = 14;
const CACHE_PER_LETTER = 60;   // words cached per letter
const WARMUP_ROUNDS    = 1;    // rounds before targeting begins
const WEAK_THRESHOLD   = 0.88; // accuracy below this = weak
const MIN_ATTEMPTS     = 3;    // min keystrokes before declaring weak
const STORAGE_KEY      = 'keysense-history-v1';
const SAVE_PREF_KEY    = 'keysense-save-enabled';
const WPM_HISTORY_MAX  = 200;  // cap stored WPM samples to avoid unbounded growth

/* ═══════════════════════════════════════════════════
   KEYBOARD LAYOUT
═══════════════════════════════════════════════════ */
const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];
const ALL_KEYS = ROWS.flat();

