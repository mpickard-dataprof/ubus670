const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { cfHasKeywordMatch, cfEsc } = require('./test-harness');

describe('cfHasKeywordMatch', () => {
  it('finds exact substring match', () => {
    assert.equal(cfHasKeywordMatch('employment gap', ['gap']), true);
  });

  it('is case-insensitive', () => {
    assert.equal(cfHasKeywordMatch('EMPLOYMENT GAP', ['gap']), true);
    assert.equal(cfHasKeywordMatch('employment gap', ['GAP']), true);
  });

  it('matches first keyword of many', () => {
    assert.equal(cfHasKeywordMatch('14 month gap', ['gap', 'break', 'missing']), true);
  });

  it('matches last keyword of many', () => {
    assert.equal(cfHasKeywordMatch('this is a break', ['gap', 'missing', 'break']), true);
  });

  it('returns false when no keywords match', () => {
    assert.equal(cfHasKeywordMatch('looks suspicious', ['gap', 'break', 'missing']), false);
  });

  it('returns false for empty text', () => {
    assert.equal(cfHasKeywordMatch('', ['gap']), false);
  });

  it('returns false for empty keywords', () => {
    assert.equal(cfHasKeywordMatch('employment gap', []), false);
  });

  it('returns false when both are empty', () => {
    assert.equal(cfHasKeywordMatch('', []), false);
  });

  it('matches substring within a word (prefix matching)', () => {
    assert.equal(cfHasKeywordMatch('fabricated credentials', ['fabricat']), true);
  });

  it('matches multi-word keyword as substring', () => {
    assert.equal(cfHasKeywordMatch('head of department', ['head of']), true);
  });

  it('handles special regex characters in text safely', () => {
    assert.equal(cfHasKeywordMatch('gap (14 months)', ['gap']), true);
    assert.equal(cfHasKeywordMatch('cost is $100.00', ['$100']), true);
  });

  it('matches when keyword equals full text', () => {
    assert.equal(cfHasKeywordMatch('gap', ['gap']), true);
  });

  it('handles unicode characters', () => {
    assert.equal(cfHasKeywordMatch('resume has a gap year', ['gap']), true);
  });
});

describe('cfEsc (HTML escaping)', () => {
  it('escapes angle brackets', () => {
    assert.equal(cfEsc('<script>'), '&lt;script&gt;');
  });

  it('escapes ampersands', () => {
    assert.equal(cfEsc('AT&T'), 'AT&amp;T');
  });

  it('escapes double quotes', () => {
    assert.equal(cfEsc('"hello"'), '&quot;hello&quot;');
  });

  it('handles empty/null/undefined', () => {
    assert.equal(cfEsc(''), '');
    assert.equal(cfEsc(null), '');
    assert.equal(cfEsc(undefined), '');
  });

  it('leaves normal text unchanged', () => {
    assert.equal(cfEsc('Hello World'), 'Hello World');
  });

  it('escapes full XSS payload', () => {
    const xss = '<img src=x onerror="alert(1)">';
    const escaped = cfEsc(xss);
    assert.ok(!escaped.includes('<'));
    assert.ok(!escaped.includes('>'));
  });
});
