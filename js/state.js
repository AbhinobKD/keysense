/* ═══════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════ */
let keyStats   = {};        // k -> { attempts, errors }
let wordCache  = {};        // letter -> [word, …]
let commonPool = [];        // generic word pool
let words      = [];        // current round words
let wordResult = [];        // per-word typed string
let curWord    = 0;
let curChar    = 0;
let active     = false;
let sessionStart = null;
let totalChars = 0;
let totalErrors= 0;
let wordsDone  = 0;
let streak     = 0;
let rounds     = 0;
let mode       = 'warmup';
let userMode   = 'auto';   // 'auto' | 'common' | 'target'

// ── persisted history (localStorage) ──
let bestStreak   = 0;          // all-time best streak, restored from storage
let wpmHistory   = [];         // [{ t: timestamp, wpm, acc }, …] sampled per word
let lifetimeWords  = 0;        // cumulative words typed across all sessions
let lifetimeChars  = 0;        // cumulative chars typed across all sessions
let lifetimeErrors = 0;        // cumulative errors across all sessions
let lifetimeRounds = 0;        // cumulative rounds across all sessions
let savingEnabled  = false;    // user-controlled opt-in for saving progress

ALL_KEYS.forEach(k => keyStats[k] = { attempts: 0, errors: 0 });

/* ═══════════════════════════════════════════════════
   DOM REFERENCES
═══════════════════════════════════════════════════ */
const wordsWrap  = document.getElementById('words-wrap');
const hiddenInput= document.getElementById('hidden-input');
const typingArea = document.getElementById('typing-area');
const prompt     = document.getElementById('prompt');
const modeDot    = document.getElementById('mode-dot');
const modeText   = document.getElementById('mode-text');
const weakPills  = document.getElementById('weak-pills');
const flash      = document.getElementById('flash');
const mWpm       = document.getElementById('m-wpm');
const mAcc       = document.getElementById('m-acc');
const mWords     = document.getElementById('m-words');
const mStreak    = document.getElementById('m-streak');

