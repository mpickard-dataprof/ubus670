const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { cfDecodeGT, loadCompetitionResumes, loadPracticeResumes } = require('./test-harness');

// ── Competition Resumes ─────────────────────────────────────────────────────

describe('Competition resumes data integrity', () => {
  const { COMP_RESUMES } = loadCompetitionResumes();

  it('has exactly 30 entries', () => {
    assert.equal(COMP_RESUMES.length, 30);
  });

  it('all IDs from C-01 to C-30 are present', () => {
    const ids = new Set(COMP_RESUMES.map(r => r.id));
    for (let i = 1; i <= 30; i++) {
      const id = `C-${String(i).padStart(2, '0')}`;
      assert.ok(ids.has(id), `Missing ID: ${id}`);
    }
  });

  it('no duplicate IDs', () => {
    const ids = COMP_RESUMES.map(r => r.id);
    assert.equal(ids.length, new Set(ids).size);
  });

  it('sorted by ID', () => {
    for (let i = 1; i < COMP_RESUMES.length; i++) {
      const prevNum = parseInt(COMP_RESUMES[i-1].id.split('-')[1]);
      const currNum = parseInt(COMP_RESUMES[i].id.split('-')[1]);
      assert.ok(currNum > prevNum, `Not sorted: ${COMP_RESUMES[i-1].id} before ${COMP_RESUMES[i].id}`);
    }
  });

  it('each entry has id, name, text fields (non-empty)', () => {
    COMP_RESUMES.forEach(r => {
      assert.ok(r.id, `Missing id on resume`);
      assert.ok(r.name && r.name.length > 0, `Missing name on ${r.id}`);
      assert.ok(r.text && r.text.length > 50, `Missing/short text on ${r.id}`);
    });
  });

  it('each ID matches C-XX format', () => {
    COMP_RESUMES.forEach(r => {
      assert.ok(/^C-\d{2}$/.test(r.id), `Invalid ID format: ${r.id}`);
    });
  });

  it('each resume text starts with [C-XX] ID tag', () => {
    COMP_RESUMES.forEach(r => {
      assert.ok(r.text.trim().startsWith(`[${r.id}]`),
        `${r.id}: text doesn't start with [${r.id}]`);
    });
  });

  it('each resume text contains the candidate name', () => {
    COMP_RESUMES.forEach(r => {
      assert.ok(r.text.includes(r.name),
        `${r.id}: text doesn't contain name "${r.name}"`);
    });
  });

  it('no resume exceeds 5000 chars', () => {
    COMP_RESUMES.forEach(r => {
      assert.ok(r.text.length < 5000,
        `${r.id}: text too long (${r.text.length} chars)`);
    });
  });

  it('all ground truth top 10 IDs exist in resumes', () => {
    const gt = cfDecodeGT();
    const ids = new Set(COMP_RESUMES.map(r => r.id));
    gt.t10.forEach(id => assert.ok(ids.has(id), `Top 10 ID missing: ${id}`));
  });

  it('all ground truth bottom 5 IDs exist in resumes', () => {
    const gt = cfDecodeGT();
    const ids = new Set(COMP_RESUMES.map(r => r.id));
    gt.b5.forEach(id => assert.ok(ids.has(id), `Bottom 5 ID missing: ${id}`));
  });

  it('all ground truth flag candidate IDs exist in resumes', () => {
    const gt = cfDecodeGT();
    const ids = new Set(COMP_RESUMES.map(r => r.id));
    gt.fl.forEach(f => assert.ok(ids.has(f.id), `Flag candidate missing: ${f.id}`));
  });

  it('all bias pair IDs exist in resumes', () => {
    const gt = cfDecodeGT();
    const ids = new Set(COMP_RESUMES.map(r => r.id));
    gt.bp.flatMap(p => p.ids).forEach(id =>
      assert.ok(ids.has(id), `Bias pair ID missing: ${id}`));
  });

  it('all pattern IDs exist in resumes', () => {
    const gt = cfDecodeGT();
    const ids = new Set(COMP_RESUMES.map(r => r.id));
    gt.pt.flatMap(p => p.ids).forEach(id =>
      assert.ok(ids.has(id), `Pattern ID missing: ${id}`));
  });
});

// ── Hidden patterns verifiable in resume text ───────────────────────────────

describe('Hidden patterns in competition resume text', () => {
  const { COMP_RESUMES } = loadCompetitionResumes();
  const byId = Object.fromEntries(COMP_RESUMES.map(r => [r.id, r]));

  it('Pattern 1: Northfield footer in C-08, C-19, C-27', () => {
    ['C-08', 'C-19', 'C-27'].forEach(id => {
      assert.ok(byId[id].text.toLowerCase().includes('northfield'),
        `${id} missing Northfield reference`);
    });
  });

  it('Pattern 2: Lakeside Goods in C-05, C-14, C-07', () => {
    ['C-05', 'C-14', 'C-07'].forEach(id => {
      assert.ok(byId[id].text.toLowerCase().includes('lakeside'),
        `${id} missing Lakeside Goods reference`);
    });
  });

  it('Pattern 3: Copy-paste work experience in C-15 and C-25', () => {
    const c15 = byId['C-15'].text;
    const c25 = byId['C-25'].text;
    // Both should contain the identical bullet
    const sharedBullet = 'Assisted customers on the sales floor and directed them to products';
    assert.ok(c15.includes(sharedBullet), 'C-15 missing shared bullet');
    assert.ok(c25.includes(sharedBullet), 'C-25 missing shared bullet');
  });

  it('Red flag: C-13 Pacific Northwest Business Institute', () => {
    assert.ok(byId['C-13'].text.includes('Pacific Northwest Business Institute'));
  });

  it('Red flag: C-30 Great Lakes Polytechnic University', () => {
    assert.ok(byId['C-30'].text.includes('Great Lakes Polytechnic'));
  });

  it('Red flag: C-29 Grandview National Retail Corp', () => {
    assert.ok(byId['C-29'].text.includes('Grandview National'));
  });

  it('Red flag: C-29 Allied Consumer Services Group', () => {
    assert.ok(byId['C-29'].text.includes('Allied Consumer'));
  });

  it('Red flag: C-10 inflated title (Regional Operations Director)', () => {
    assert.ok(byId['C-10'].text.includes('Regional Operations Director'));
  });

  it('Red flag: C-02 inflated title (Head of Customer Relations)', () => {
    assert.ok(byId['C-02'].text.includes('Head of Customer Relations'));
  });

  it('Bias pair: C-09 uses "He" and C-16 uses "She"', () => {
    const c09 = byId['C-09'].text;
    const c16 = byId['C-16'].text;
    assert.ok(/\bHe\b/.test(c09), 'C-09 missing "He" pronoun');
    assert.ok(/\bShe\b/.test(c16), 'C-16 missing "She" pronoun');
  });
});

// ── Practice Resumes ────────────────────────────────────────────────────────

describe('Practice resumes data integrity', () => {
  const { PRACTICE_RESUMES } = loadPracticeResumes();

  it('has exactly 20 entries', () => {
    assert.equal(PRACTICE_RESUMES.length, 20);
  });

  it('all IDs from P-01 to P-20 are present', () => {
    const ids = new Set(PRACTICE_RESUMES.map(r => r.id));
    for (let i = 1; i <= 20; i++) {
      const id = `P-${String(i).padStart(2, '0')}`;
      assert.ok(ids.has(id), `Missing ID: ${id}`);
    }
  });

  it('no duplicate IDs', () => {
    const ids = PRACTICE_RESUMES.map(r => r.id);
    assert.equal(ids.length, new Set(ids).size);
  });

  it('each entry has id, name, text fields (non-empty)', () => {
    PRACTICE_RESUMES.forEach(r => {
      assert.ok(r.id, `Missing id`);
      assert.ok(r.name && r.name.length > 0, `Missing name on ${r.id}`);
      assert.ok(r.text && r.text.length > 20, `Missing/short text on ${r.id}`);
    });
  });

  it('each ID matches P-XX format', () => {
    PRACTICE_RESUMES.forEach(r => {
      assert.ok(/^P-\d{2}$/.test(r.id), `Invalid ID format: ${r.id}`);
    });
  });
});

describe('Practice answer key integrity', () => {
  const { PRACTICE_RESUMES, PRACTICE_ANSWER_KEY } = loadPracticeResumes();

  it('has exactly 20 entries', () => {
    assert.equal(PRACTICE_ANSWER_KEY.length, 20);
  });

  it('answer key IDs match resume IDs', () => {
    const resumeIds = new Set(PRACTICE_RESUMES.map(r => r.id));
    const keyIds = new Set(PRACTICE_ANSWER_KEY.map(e => e.id));
    assert.deepEqual(resumeIds, keyIds);
  });

  it('each entry has id, name, category, signals', () => {
    PRACTICE_ANSWER_KEY.forEach(e => {
      assert.ok(e.id, `Missing id`);
      assert.ok(e.name, `Missing name on ${e.id}`);
      assert.ok(e.category, `Missing category on ${e.id}`);
      assert.ok(e.signals, `Missing signals on ${e.id}`);
    });
  });

  it('categories are valid values', () => {
    PRACTICE_ANSWER_KEY.forEach(e => {
      assert.ok(['Strong', 'Moderate', 'Weak'].includes(e.category),
        `${e.id}: invalid category "${e.category}"`);
    });
  });

  it('has at least one of each category', () => {
    const categories = new Set(PRACTICE_ANSWER_KEY.map(e => e.category));
    assert.ok(categories.has('Strong'), 'No Strong candidates');
    assert.ok(categories.has('Moderate'), 'No Moderate candidates');
    assert.ok(categories.has('Weak'), 'No Weak candidates');
  });

  it('P-17 is flagged for fake institution', () => {
    const p17 = PRACTICE_ANSWER_KEY.find(e => e.id === 'P-17');
    assert.ok(p17.signals.toLowerCase().includes('fake') ||
              p17.signals.toLowerCase().includes('midwest technical'),
      'P-17 missing fake institution flag in signals');
  });

  it('P-18 is flagged for overlapping dates', () => {
    const p18 = PRACTICE_ANSWER_KEY.find(e => e.id === 'P-18');
    assert.ok(p18.signals.toLowerCase().includes('overlap') ||
              p18.signals.toLowerCase().includes('contradict') ||
              p18.signals.toLowerCase().includes('full-time'),
      'P-18 missing overlapping dates flag in signals');
  });

  it('P-19 is categorized as Weak (bare minimum resume)', () => {
    const p19 = PRACTICE_ANSWER_KEY.find(e => e.id === 'P-19');
    assert.equal(p19.category, 'Weak');
  });

  it('P-20 is categorized as Strong (verbose but qualified)', () => {
    const p20 = PRACTICE_ANSWER_KEY.find(e => e.id === 'P-20');
    assert.equal(p20.category, 'Strong');
  });
});
