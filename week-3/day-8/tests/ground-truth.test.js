const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { cfDecodeGT, loadGroundTruth } = require('./test-harness');

describe('cfDecodeGT (base64 decode)', () => {
  const gt = cfDecodeGT();

  it('returns a non-null object', () => {
    assert.ok(gt !== null && typeof gt === 'object');
  });

  it('is idempotent (cached)', () => {
    assert.strictEqual(cfDecodeGT(), gt);
  });

  it('has all required keys', () => {
    for (const key of ['t10', 't3', 'b5', 'b8', 'fl', 'bp', 'pt']) {
      assert.ok(key in gt, `Missing key: ${key}`);
    }
  });

  it('t10 has exactly 10 entries', () => {
    assert.equal(gt.t10.length, 10);
  });

  it('t3 has keys 1, 2, 3', () => {
    assert.ok('1' in gt.t3);
    assert.ok('2' in gt.t3);
    assert.ok('3' in gt.t3);
  });

  it('t3 values are the first 3 of t10', () => {
    assert.equal(gt.t3['1'], gt.t10[0]);
    assert.equal(gt.t3['2'], gt.t10[1]);
    assert.equal(gt.t3['3'], gt.t10[2]);
  });

  it('b5 has exactly 5 entries', () => {
    assert.equal(gt.b5.length, 5);
  });

  it('b8 has exactly 8 entries', () => {
    assert.equal(gt.b8.length, 8);
  });

  it('b5 is a subset of b8', () => {
    const b8Set = new Set(gt.b8);
    gt.b5.forEach(id => assert.ok(b8Set.has(id), `b5 id ${id} not in b8`));
  });

  it('fl has exactly 14 entries', () => {
    assert.equal(gt.fl.length, 14);
  });

  it('bp has exactly 5 entries', () => {
    assert.equal(gt.bp.length, 5);
  });

  it('pt has exactly 3 entries', () => {
    assert.equal(gt.pt.length, 3);
  });

  it('t10 and b5 are disjoint', () => {
    const t10Set = new Set(gt.t10);
    gt.b5.forEach(id => assert.ok(!t10Set.has(id), `${id} is in both t10 and b5`));
  });

  it('all IDs are valid C-XX format', () => {
    const allIds = [
      ...gt.t10, ...gt.b5, ...gt.b8,
      ...gt.fl.map(f => f.id),
      ...gt.bp.flatMap(p => p.ids),
      ...gt.pt.flatMap(p => p.ids)
    ];
    const pattern = /^C-\d{2}$/;
    allIds.forEach(id => assert.ok(pattern.test(id), `Invalid ID: ${id}`));
  });

  it('all IDs are in range C-01 to C-30', () => {
    const allIds = [
      ...gt.t10, ...gt.b5, ...gt.b8,
      ...gt.fl.map(f => f.id),
      ...gt.bp.flatMap(p => p.ids),
      ...gt.pt.flatMap(p => p.ids)
    ];
    allIds.forEach(id => {
      const num = parseInt(id.split('-')[1]);
      assert.ok(num >= 1 && num <= 30, `ID out of range: ${id}`);
    });
  });

  it('all flag severities are valid', () => {
    gt.fl.forEach((f, i) => {
      assert.ok(['minor', 'disqualifying'].includes(f.sv),
        `Flag ${i}: invalid severity "${f.sv}"`);
    });
  });

  it('all flags have non-empty keyword arrays', () => {
    gt.fl.forEach((f, i) => {
      assert.ok(Array.isArray(f.kw) && f.kw.length > 0,
        `Flag ${i}: empty or missing keywords`);
    });
  });

  it('all bias pairs have exactly 2 IDs', () => {
    gt.bp.forEach((p, i) => {
      assert.equal(p.ids.length, 2, `Bias pair ${i}: expected 2 IDs, got ${p.ids.length}`);
    });
  });

  it('all patterns have 2+ IDs', () => {
    gt.pt.forEach((p, i) => {
      assert.ok(p.ids.length >= 2, `Pattern ${i}: expected 2+ IDs, got ${p.ids.length}`);
    });
  });
});

describe('Ground truth cross-reference with ground-truth.json', () => {
  const decoded = cfDecodeGT();
  const gtJson = loadGroundTruth();

  it('t10 IDs match JSON top_10_set', () => {
    assert.deepEqual(
      new Set(decoded.t10),
      new Set(gtJson.acceptability_windows.top_10_set)
    );
  });

  it('t10 order matches JSON top_10 rank order', () => {
    const jsonOrder = gtJson.top_10.sort((a, b) => a.rank - b.rank).map(e => e.id);
    assert.deepEqual(decoded.t10, jsonOrder);
  });

  it('b5 IDs match JSON bottom_5_strict', () => {
    assert.deepEqual(
      new Set(decoded.b5),
      new Set(gtJson.acceptability_windows.bottom_5_strict)
    );
  });

  it('b8 IDs match JSON bottom_8_partial', () => {
    assert.deepEqual(
      new Set(decoded.b8),
      new Set(gtJson.acceptability_windows.bottom_8_partial)
    );
  });

  it('flag count matches', () => {
    assert.equal(decoded.fl.length, gtJson.flags.length);
  });

  it('each flag candidate ID matches JSON', () => {
    decoded.fl.forEach((f, i) => {
      assert.equal(f.id, gtJson.flags[i].candidate_id,
        `Flag ${i}: ID mismatch (decoded: ${f.id}, JSON: ${gtJson.flags[i].candidate_id})`);
    });
  });

  it('each flag severity matches JSON', () => {
    decoded.fl.forEach((f, i) => {
      assert.equal(f.sv, gtJson.flags[i].severity,
        `Flag ${i}: severity mismatch`);
    });
  });

  it('each flag keywords overlap with JSON flag_keywords', () => {
    decoded.fl.forEach((f, i) => {
      const jsonKw = gtJson.flags[i].flag_keywords;
      const overlap = f.kw.filter(k => jsonKw.includes(k));
      assert.ok(overlap.length > 0,
        `Flag ${i} (${f.id}): no keyword overlap between decoded and JSON`);
    });
  });

  it('bias pair IDs match JSON', () => {
    decoded.bp.forEach((p, i) => {
      assert.deepEqual(
        new Set(p.ids),
        new Set(gtJson.bias_pairs[i].ids),
        `Bias pair ${i}: ID mismatch`
      );
    });
  });

  it('pattern IDs match JSON', () => {
    decoded.pt.forEach((p, i) => {
      assert.deepEqual(
        new Set(p.ids),
        new Set(gtJson.patterns[i].candidate_ids),
        `Pattern ${i}: ID mismatch`
      );
    });
  });
});
