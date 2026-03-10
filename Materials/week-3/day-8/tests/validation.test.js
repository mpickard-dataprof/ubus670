const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { cfValidateSubmission } = require('./test-harness');

// Helper: build a minimal valid submission JSON string
function validSubmission(overrides = {}) {
  const base = {
    top_10_hire: Array.from({length: 10}, (_, i) => ({
      id: `C-${String(i + 1).padStart(2, '0')}`, rank: i + 1, reason: 'Good candidate'
    })),
    bottom_5: Array.from({length: 5}, (_, i) => ({
      id: `C-${String(i + 26).padStart(2, '0')}`, reason: 'Weak candidate'
    })),
    flags: [{ candidate_id: 'C-14', flag: 'Employment gap', severity: 'minor' }],
    bias_pairs: [{ candidate_ids: ['C-04', 'C-22'], observation: 'Similar qualifications' }],
    patterns: ['C-08 and C-19 share northfield career center connection'],
    ...overrides
  };
  return JSON.stringify(base);
}

describe('cfValidateSubmission — valid inputs', () => {
  it('accepts a minimal valid submission', () => {
    const result = cfValidateSubmission(validSubmission());
    assert.equal(result.valid, true);
    assert.ok(result.data);
  });

  it('accepts extra fields (team_name, etc)', () => {
    const result = cfValidateSubmission(validSubmission({ team_name: 'Alpha' }));
    assert.equal(result.valid, true);
  });

  it('accepts empty flags array', () => {
    const result = cfValidateSubmission(validSubmission({ flags: [] }));
    assert.equal(result.valid, true);
  });

  it('accepts empty bias_pairs array', () => {
    const result = cfValidateSubmission(validSubmission({ bias_pairs: [] }));
    assert.equal(result.valid, true);
  });

  it('accepts empty patterns array', () => {
    const result = cfValidateSubmission(validSubmission({ patterns: [] }));
    assert.equal(result.valid, true);
  });

  it('accepts lowercase IDs (c-01)', () => {
    const sub = {
      top_10_hire: Array.from({length: 10}, (_, i) => ({
        id: `c-${String(i + 1).padStart(2, '0')}`, rank: i + 1, reason: 'ok'
      })),
      bottom_5: Array.from({length: 5}, (_, i) => ({
        id: `c-${String(i + 26).padStart(2, '0')}`, reason: 'weak'
      })),
      flags: [], bias_pairs: [], patterns: []
    };
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, true);
  });

  it('accepts severity with mixed case (Minor, DISQUALIFYING)', () => {
    const result = cfValidateSubmission(validSubmission({
      flags: [
        { candidate_id: 'C-14', flag: 'gap', severity: 'Minor' },
        { candidate_id: 'C-23', flag: 'overlap', severity: 'DISQUALIFYING' }
      ]
    }));
    assert.equal(result.valid, true);
  });

  it('accepts rank 0 as valid', () => {
    const sub = JSON.parse(validSubmission());
    sub.top_10_hire[0].rank = 0;
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, true);
  });
});

describe('cfValidateSubmission — JSON parse failures', () => {
  it('rejects empty string', () => {
    const result = cfValidateSubmission('');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('Invalid JSON'));
  });

  it('rejects non-JSON text', () => {
    const result = cfValidateSubmission('hello world');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('Invalid JSON'));
  });

  it('rejects JSON with trailing comma', () => {
    const result = cfValidateSubmission('{"top_10_hire": [],}');
    assert.equal(result.valid, false);
  });

  it('rejects incomplete JSON', () => {
    const result = cfValidateSubmission('{"top_10_hire": [');
    assert.equal(result.valid, false);
  });
});

describe('cfValidateSubmission — schema validation', () => {
  it('rejects missing top_10_hire', () => {
    const result = cfValidateSubmission(validSubmission({ top_10_hire: undefined }));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('top_10_hire'));
  });

  it('rejects top_10_hire with 9 entries', () => {
    const result = cfValidateSubmission(validSubmission({
      top_10_hire: Array.from({length: 9}, (_, i) => ({
        id: `C-${String(i+1).padStart(2,'0')}`, rank: i+1, reason: 'ok'
      }))
    }));
    assert.equal(result.valid, false);
  });

  it('rejects top_10_hire with 11 entries', () => {
    const result = cfValidateSubmission(validSubmission({
      top_10_hire: Array.from({length: 11}, (_, i) => ({
        id: `C-${String(i+1).padStart(2,'0')}`, rank: i+1, reason: 'ok'
      }))
    }));
    assert.equal(result.valid, false);
  });

  it('rejects invalid ID format (C-1 instead of C-01)', () => {
    const sub = JSON.parse(validSubmission());
    sub.top_10_hire[0].id = 'C-1';
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('invalid id'));
  });

  it('rejects 3-digit ID (C-100)', () => {
    const sub = JSON.parse(validSubmission());
    sub.top_10_hire[0].id = 'C-100';
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, false);
  });

  it('rejects entry missing rank', () => {
    const sub = JSON.parse(validSubmission());
    delete sub.top_10_hire[0].rank;
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('missing rank'));
  });

  it('rejects entry missing reason', () => {
    const sub = JSON.parse(validSubmission());
    delete sub.top_10_hire[0].reason;
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('missing reason'));
  });

  it('rejects bottom_5 with 4 entries', () => {
    const result = cfValidateSubmission(validSubmission({
      bottom_5: Array.from({length: 4}, (_, i) => ({
        id: `C-${String(i+26).padStart(2,'0')}`, reason: 'weak'
      }))
    }));
    assert.equal(result.valid, false);
  });

  it('rejects flags as non-array', () => {
    const result = cfValidateSubmission(validSubmission({ flags: 'hello' }));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('flags must be an array'));
  });

  it('rejects flag with invalid candidate_id', () => {
    const result = cfValidateSubmission(validSubmission({
      flags: [{ candidate_id: 'X-99', flag: 'bad', severity: 'minor' }]
    }));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('invalid candidate_id'));
  });

  it('rejects flag with missing severity', () => {
    const result = cfValidateSubmission(validSubmission({
      flags: [{ candidate_id: 'C-14', flag: 'gap' }]
    }));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('severity'));
  });

  it('rejects flag with invalid severity value', () => {
    const result = cfValidateSubmission(validSubmission({
      flags: [{ candidate_id: 'C-14', flag: 'gap', severity: 'major' }]
    }));
    assert.equal(result.valid, false);
  });

  it('rejects bias_pairs entry with < 2 candidate_ids', () => {
    const result = cfValidateSubmission(validSubmission({
      bias_pairs: [{ candidate_ids: ['C-01'], observation: 'ok' }]
    }));
    assert.equal(result.valid, false);
  });

  it('rejects bias_pairs entry missing observation', () => {
    const result = cfValidateSubmission(validSubmission({
      bias_pairs: [{ candidate_ids: ['C-04', 'C-22'] }]
    }));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('missing observation'));
  });

  it('rejects patterns as non-array', () => {
    const result = cfValidateSubmission(validSubmission({ patterns: 'string' }));
    assert.equal(result.valid, false);
  });

  it('rejects non-string pattern entries', () => {
    const result = cfValidateSubmission(validSubmission({
      patterns: [{ pattern: 'C-08 and C-19 share formatting', candidates: ['C-08', 'C-19'] }]
    }));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('patterns[0]'));
  });

  it('rejects duplicate IDs in top_10_hire', () => {
    const sub = JSON.parse(validSubmission());
    sub.top_10_hire[1].id = sub.top_10_hire[0].id;
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('duplicate'));
  });

  it('rejects duplicate IDs in bottom_5', () => {
    const sub = JSON.parse(validSubmission());
    sub.bottom_5[1].id = sub.bottom_5[0].id;
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('duplicate'));
  });

  it('rejects case-insensitive duplicate IDs (C-01 and c-01)', () => {
    const sub = JSON.parse(validSubmission());
    sub.top_10_hire[0].id = 'C-01';
    sub.top_10_hire[1].id = 'c-01';
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('duplicate'));
  });

  it('reports multiple errors at once', () => {
    const result = cfValidateSubmission(JSON.stringify({
      top_10_hire: 'bad',
      bottom_5: 'bad',
      flags: 'bad',
      bias_pairs: 'bad',
      patterns: 'bad'
    }));
    assert.equal(result.valid, false);
    // Should contain multiple error lines
    assert.ok(result.error.split('\n').length >= 3);
  });
});

describe('cfValidateSubmission — edge cases', () => {
  it('rejects JSON parsing to null', () => {
    const result = cfValidateSubmission('null');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('null'));
  });

  it('rejects JSON parsing to number', () => {
    const result = cfValidateSubmission('42');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('number'));
  });

  it('handles JSON parsing to array gracefully', () => {
    const result = cfValidateSubmission('[1,2,3]');
    assert.equal(result.valid, false);
  });

  it('handles unicode in reason strings', () => {
    const sub = JSON.parse(validSubmission());
    sub.top_10_hire[0].reason = 'Great candidate with bilingual skills';
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, true);
  });

  it('handles XSS payloads in text fields (passes validation, escaping is separate)', () => {
    const sub = JSON.parse(validSubmission());
    sub.top_10_hire[0].reason = '<script>alert(1)</script>';
    const result = cfValidateSubmission(JSON.stringify(sub));
    assert.equal(result.valid, true);  // Validation doesn't sanitize, cfEsc does
  });
});
