/**
 * Test harness — extracts pure functions from capstone-firebase.js for Node testing.
 *
 * Stubs the minimal DOM/Firebase globals so the IIFE boots without crashing,
 * then re-exports the testable functions.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ── Minimal DOM stubs ──────────────────────────────────────────────────────
global.document = {
  readyState: 'complete',
  createElement(tag) {
    let _text = '';
    return {
      set textContent(v) { _text = String(v ?? ''); },
      get innerHTML() {
        return _text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      style: {},
      id: '',
      src: '',
      onload: null,
      onerror: null,
      addEventListener() {},
      appendChild() {}
    };
  },
  addEventListener() {},
  getElementById() { return null; },
  querySelector() { return null; },
  head: { appendChild() {} }
};

global.window = { firebase: undefined };
global.navigator = { clipboard: { writeText() { return Promise.resolve(); } } };
global.alert = () => {};
global.setInterval = () => 0;
global.clearInterval = () => {};
global.Date = Date;

// Stub firebase so the IIFE can call firebase.apps etc. without throwing
global.firebase = {
  apps: [],
  initializeApp() {},
  auth() {
    return { onAuthStateChanged() {} };
  },
  firestore() {
    return { collection() { return { onSnapshot() {} }; } };
  }
};

// ── Load capstone-firebase.js ──────────────────────────────────────────────
const src = fs.readFileSync(
  path.resolve(__dirname, '..', '..', '..', '_shared', 'capstone-firebase.js'),
  'utf-8'
);

// Run in this context so function declarations attach to globalThis
vm.runInThisContext(src, { filename: 'capstone-firebase.js' });

// ── Re-export pure functions ───────────────────────────────────────────────
module.exports = {
  cfScoreTop10:             globalThis.cfScoreTop10,
  cfScoreBottom5:           globalThis.cfScoreBottom5,
  cfScoreFlagsAndSeverity:  globalThis.cfScoreFlagsAndSeverity,
  cfScoreBiasPairs:         globalThis.cfScoreBiasPairs,
  cfScorePatterns:          globalThis.cfScorePatterns,
  cfScoreSubmission:        globalThis.cfScoreSubmission,
  cfValidateSubmission:     globalThis.cfValidateSubmission,
  cfDecodeGT:               globalThis.cfDecodeGT,
  cfHasKeywordMatch:        globalThis.cfHasKeywordMatch,
  cfEsc:                    globalThis.cfEsc,
};

// ── Helper: load resume data files ─────────────────────────────────────────
function loadResumeData(filename) {
  const code = fs.readFileSync(
    path.resolve(__dirname, '..', 'web', filename),
    'utf-8'
  );
  const fn = new Function(code + '; return typeof COMP_RESUMES !== "undefined" ? { COMP_RESUMES } : { PRACTICE_RESUMES, PRACTICE_ANSWER_KEY };');
  return fn();
}

module.exports.loadCompetitionResumes = () => loadResumeData('competition-resumes.js');
module.exports.loadPracticeResumes    = () => loadResumeData('practice-resumes.js');

// ── Helper: load ground-truth.json ─────────────────────────────────────────
module.exports.loadGroundTruth = () => JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '..', 'dataset', 'ground-truth.json'),
    'utf-8'
  )
);

// ── Helper: build a perfect submission from decoded GT ─────────────────────
module.exports.buildPerfectSubmission = (gt) => ({
  top_10_hire: gt.t10.map((id, i) => ({
    id, rank: i + 1, reason: 'Perfect candidate'
  })),
  bottom_5: gt.b5.map(id => ({ id, reason: 'Do not hire' })),
  flags: gt.fl.map(f => ({
    candidate_id: f.id,
    flag: `This candidate has a ${f.kw[0]} issue`,
    severity: f.sv
  })),
  bias_pairs: gt.bp.map(p => ({
    candidate_ids: p.ids,
    observation: `These candidates have similar qualifications`
  })),
  patterns: gt.pt.map(p =>
    `${p.ids.join(', ')} share the same ${p.kw[0]} connection`
  )
});
