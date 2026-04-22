const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { cfValidateSubmission } = require('./test-harness');

// Helper: build a submission with configurable list sizes
function makeSubmission({ topCount = 10, botCount = 5, topStart = 1, botStart = 26 } = {}) {
  return {
    top_10_hire: Array.from({ length: topCount }, (_, i) => ({
      id: `C-${String(topStart + i).padStart(2, '0')}`, rank: i + 1, reason: 'Good candidate'
    })),
    bottom_5: Array.from({ length: botCount }, (_, i) => ({
      id: `C-${String(botStart + i).padStart(2, '0')}`, reason: 'Weak candidate'
    })),
    flags: [],
    bias_pairs: [],
    patterns: []
  };
}

describe('cfValidateSubmission — round-aware list sizes', () => {

  // 1. Round 1: accepts top_10_hire with 3 entries and bottom_5 with 1 entry
  it('round 1: accepts top_10_hire with 3 entries and bottom_5 with 1 entry', () => {
    const sub = makeSubmission({ topCount: 3, botCount: 1 });
    const result = cfValidateSubmission(JSON.stringify(sub), 1);
    assert.equal(result.valid, true);
    assert.ok(result.data);
  });

  // 2. Round 1: accepts top_10_hire with 10 entries (max allowed)
  it('round 1: accepts top_10_hire with 10 entries (max allowed)', () => {
    const sub = makeSubmission({ topCount: 10, botCount: 3 });
    const result = cfValidateSubmission(JSON.stringify(sub), 1);
    assert.equal(result.valid, true);
  });

  // 3. Round 1: accepts empty bottom_5 (0 entries, since min is 0 for rounds 1-2)
  it('round 1: accepts empty bottom_5 (0 entries)', () => {
    const sub = makeSubmission({ topCount: 5, botCount: 0 });
    const result = cfValidateSubmission(JSON.stringify(sub), 1);
    assert.equal(result.valid, true);
  });

  // 4. Round 1: rejects top_10_hire with 0 entries (min is 1)
  it('round 1: rejects top_10_hire with 0 entries', () => {
    const sub = makeSubmission({ topCount: 0, botCount: 0 });
    const result = cfValidateSubmission(JSON.stringify(sub), 1);
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('top_10_hire'));
  });

  // 5. Round 1: rejects top_10_hire with 11 entries
  it('round 1: rejects top_10_hire with 11 entries', () => {
    const sub = makeSubmission({ topCount: 11, botCount: 0 });
    const result = cfValidateSubmission(JSON.stringify(sub), 1);
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('top_10_hire'));
  });

  // 6. Round 2: same relaxed rules as round 1
  it('round 2: accepts 3 top entries and 0 bottom entries (same relaxed rules as round 1)', () => {
    const sub = makeSubmission({ topCount: 3, botCount: 0 });
    const result = cfValidateSubmission(JSON.stringify(sub), 2);
    assert.equal(result.valid, true);
  });

  // 7. Round 3: rejects top_10_hire with 9 entries (must be exactly 10)
  it('round 3: rejects top_10_hire with 9 entries', () => {
    const sub = makeSubmission({ topCount: 9, botCount: 5 });
    const result = cfValidateSubmission(JSON.stringify(sub), 3);
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('exactly 10'));
  });

  // 8. Round 3: rejects bottom_5 with 4 entries (must be exactly 5)
  it('round 3: rejects bottom_5 with 4 entries', () => {
    const sub = makeSubmission({ topCount: 10, botCount: 4 });
    const result = cfValidateSubmission(JSON.stringify(sub), 3);
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('exactly 5'));
  });

  // 9. Round 3: accepts exactly 10 top + 5 bottom (strict behavior)
  it('round 3: accepts exactly 10 top + 5 bottom', () => {
    const sub = makeSubmission({ topCount: 10, botCount: 5 });
    const result = cfValidateSubmission(JSON.stringify(sub), 3);
    assert.equal(result.valid, true);
    assert.ok(result.data);
  });

  // 10. Default (no round param): behaves like round 3 (strict)
  it('default (no round param): behaves like round 3 — rejects 9 top entries', () => {
    const sub = makeSubmission({ topCount: 9, botCount: 5 });
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('exactly 10'));
  });

  it('default (no round param): accepts exactly 10 top + 5 bottom', () => {
    const sub = makeSubmission({ topCount: 10, botCount: 5 });
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, true);
  });
});

describe('cfValidateSubmission — cross-list and duplicate checks in relaxed rounds', () => {

  // 11. Cross-list check still works in round 1
  it('round 1: rejects candidate appearing in both top_10_hire and bottom_5', () => {
    const sub = makeSubmission({ topCount: 3, botCount: 1 });
    sub.bottom_5[0].id = sub.top_10_hire[0].id; // same ID in both lists
    const result = cfValidateSubmission(JSON.stringify(sub), 1);
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('also appears in top_10_hire'));
  });

  // 12. Duplicate ID check still works in round 1
  it('round 1: rejects duplicate IDs in top_10_hire', () => {
    const sub = makeSubmission({ topCount: 3, botCount: 0 });
    sub.top_10_hire[1].id = sub.top_10_hire[0].id; // duplicate
    const result = cfValidateSubmission(JSON.stringify(sub), 1);
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('duplicate'));
  });
});
