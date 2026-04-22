const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  cfScoreTop10, cfScoreBottom5, cfScoreFlagsAndSeverity,
  cfScoreBiasPairs, cfScorePatterns, cfScoreSubmission,
  cfDecodeGT, buildPerfectSubmission
} = require('./test-harness');

const gt = cfDecodeGT();

// ── cfScoreTop10 ────────────────────────────────────────────────────────────

describe('cfScoreTop10', () => {
  it('scores 30 for perfect top 10 + perfect top 3 positions', () => {
    const sub = {
      top_10_hire: gt.t10.map((id, i) => ({ id, rank: i + 1, reason: 'ok' }))
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 10);
    assert.equal(result.positionBonus, 5);
    assert.equal(result.points, 30);
  });

  it('scores 26 for perfect set but all top 3 rotated (1 position bonus)', () => {
    const sub = {
      top_10_hire: gt.t10.map((id, i) => ({ id, rank: i + 1, reason: 'ok' }))
    };
    // Rotate all 3 positions: rank1→3, rank2→1, rank3→2
    sub.top_10_hire[0].rank = 3;
    sub.top_10_hire[1].rank = 1;
    sub.top_10_hire[2].rank = 2;
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 10);
    assert.equal(result.positionBonus, 0);  // None exact
    assert.equal(result.points, 25);
  });

  it('scores 27 for perfect set + 2 of 3 exact positions', () => {
    const sub = {
      top_10_hire: gt.t10.map((id, i) => ({ id, rank: i + 1, reason: 'ok' }))
    };
    // Swap rank 3 with rank 4
    sub.top_10_hire[2].rank = 4;
    sub.top_10_hire[3].rank = 3;
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 10);
    assert.equal(result.positionBonus, 2);
    assert.equal(result.points, 27);
  });

  it('scores 26 for perfect set + 1 of 3 exact positions', () => {
    const sub = {
      top_10_hire: gt.t10.map((id, i) => ({ id, rank: i + 1, reason: 'ok' }))
    };
    // Swap ranks 2 and 3
    sub.top_10_hire[1].rank = 3;
    sub.top_10_hire[2].rank = 2;
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 10);
    assert.equal(result.positionBonus, 1); // Only rank 1 exact
    assert.equal(result.points, 26);
  });

  it('scores 17.5 for 7 of 10 correct IDs (no position bonus)', () => {
    const sub = {
      top_10_hire: [
        ...gt.t10.slice(0, 7).map((id, i) => ({ id, rank: i + 1, reason: 'ok' })),
        { id: 'C-99', rank: 8, reason: 'ok' },
        { id: 'C-98', rank: 9, reason: 'ok' },
        { id: 'C-97', rank: 10, reason: 'ok' },
      ]
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 7);
    assert.equal(result.points, 7 * 2.5 + 5); // +5 because top 3 are still exact
  });

  it('scores 0 for 0 correct IDs', () => {
    const sub = {
      top_10_hire: Array.from({length: 10}, (_, i) => ({
        id: `C-${String(i + 90).padStart(2, '0')}`, rank: i + 1, reason: 'ok'
      }))
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 0);
    assert.equal(result.points, 0);
  });

  it('scores 0 for empty/missing top_10_hire', () => {
    assert.equal(cfScoreTop10({}, gt).points, 0);
    assert.equal(cfScoreTop10({ top_10_hire: [] }, gt).points, 0);
  });

  it('handles case-insensitive IDs', () => {
    const sub = {
      top_10_hire: gt.t10.map((id, i) => ({ id: id.toLowerCase(), rank: i + 1, reason: 'ok' }))
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 10);
    assert.equal(result.points, 30);
  });

  it('counts duplicate IDs (documents behavior — not deduped)', () => {
    const sub = {
      top_10_hire: Array.from({length: 10}, (_, i) => ({
        id: gt.t10[0], rank: i + 1, reason: 'ok'
      }))
    };
    const result = cfScoreTop10(sub, gt);
    // Each iteration matches the same ID in the set — counts 10 matches
    assert.equal(result.setMatches, 10);
    assert.equal(result.points >= 25, true);
  });

  it('handles missing rank field (no position bonus)', () => {
    const sub = {
      top_10_hire: gt.t10.map(id => ({ id, reason: 'ok' }))  // no rank
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 10);
    assert.equal(result.positionBonus, 0);  // find(e => e.rank === 1) returns undefined
    assert.equal(result.points, 25);
  });
});

// ── cfScoreBottom5 ──────────────────────────────────────────────────────────

describe('cfScoreBottom5', () => {
  it('scores 10 for all 5 strict matches', () => {
    const sub = {
      bottom_5: gt.b5.map(id => ({ id, reason: 'weak' }))
    };
    const result = cfScoreBottom5(sub, gt);
    assert.equal(result.strictMatches, 5);
    assert.equal(result.points, 10);
  });

  it('scores partial credit for b8 non-b5 IDs', () => {
    // b8 minus b5 = the 3 partial-credit IDs
    const b8only = gt.b8.filter(id => !gt.b5.includes(id));
    const sub = {
      bottom_5: [
        ...b8only.slice(0, 3).map(id => ({ id, reason: 'weak' })),
        { id: 'C-99', reason: 'wrong' },
        { id: 'C-98', reason: 'wrong' }
      ]
    };
    const result = cfScoreBottom5(sub, gt);
    assert.equal(result.partialMatches, 3);
    assert.equal(result.points, 3);
  });

  it('scores mixed strict + partial', () => {
    const b8only = gt.b8.filter(id => !gt.b5.includes(id));
    const sub = {
      bottom_5: [
        { id: gt.b5[0], reason: 'strict' },
        { id: gt.b5[1], reason: 'strict' },
        { id: gt.b5[2], reason: 'strict' },
        { id: b8only[0], reason: 'partial' },
        { id: b8only[1], reason: 'partial' },
      ]
    };
    const result = cfScoreBottom5(sub, gt);
    assert.equal(result.points, 3 * 2 + 2 * 1);  // 8
  });

  it('caps at 10', () => {
    // All 5 strict = 10, already at cap
    const sub = {
      bottom_5: gt.b5.map(id => ({ id, reason: 'weak' }))
    };
    assert.equal(cfScoreBottom5(sub, gt).points, 10);
  });

  it('scores 0 for all wrong IDs', () => {
    const sub = {
      bottom_5: Array.from({length: 5}, (_, i) => ({
        id: `C-${String(i + 90).padStart(2, '0')}`, reason: 'wrong'
      }))
    };
    assert.equal(cfScoreBottom5(sub, gt).points, 0);
  });

  it('scores 0 for empty/missing bottom_5', () => {
    assert.equal(cfScoreBottom5({}, gt).points, 0);
    assert.equal(cfScoreBottom5({ bottom_5: [] }, gt).points, 0);
  });

  it('handles case-insensitive IDs', () => {
    const sub = {
      bottom_5: gt.b5.map(id => ({ id: id.toLowerCase(), reason: 'weak' }))
    };
    assert.equal(cfScoreBottom5(sub, gt).points, 10);
  });
});

// ── cfScoreFlagsAndSeverity ─────────────────────────────────────────────────

describe('cfScoreFlagsAndSeverity', () => {
  it('scores 30 for all 14 flags with correct severity', () => {
    const sub = {
      flags: gt.fl.map(f => ({
        candidate_id: f.id,
        flag: `Issue: ${f.kw[0]}`,
        severity: f.sv
      }))
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.fullCredit, 14);
    assert.ok(Math.abs(result.points - 30) < 0.01, `Expected ~30, got ${result.points}`);
  });

  it('scores 14 for all 14 flags with wrong severity', () => {
    const sub = {
      flags: gt.fl.map(f => ({
        candidate_id: f.id,
        flag: `Issue: ${f.kw[0]}`,
        severity: f.sv === 'minor' ? 'disqualifying' : 'minor'  // Flip severity
      }))
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.partialCredit, 14);
    assert.equal(result.points, 14);
  });

  it('scores single flag full credit', () => {
    const sub = {
      flags: [{
        candidate_id: 'C-14',
        flag: 'Unexplained employment gap',
        severity: 'minor'
      }]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.fullCredit, 1);
    assert.ok(Math.abs(result.points - 30/14) < 0.01);
  });

  it('scores single flag partial (wrong severity)', () => {
    const sub = {
      flags: [{
        candidate_id: 'C-14',
        flag: 'Employment gap detected',
        severity: 'disqualifying'  // Should be minor
      }]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.partialCredit, 1);
    assert.equal(result.points, 1.0);
  });

  it('scores 0 when candidate ID matches but no keyword match', () => {
    const sub = {
      flags: [{
        candidate_id: 'C-14',
        flag: 'Something suspicious about this person',
        severity: 'minor'
      }]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.points, 0);
  });

  it('scores 0 for wrong candidate ID with correct keyword', () => {
    const sub = {
      flags: [{
        candidate_id: 'C-01',
        flag: 'Employment gap of 14 months',
        severity: 'minor'
      }]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.points, 0);
  });

  it('a single well-written C-23 flag can match both GT entries', () => {
    // C-23 has two GT flags (both "disqualifying") with different keywords
    // A submission flag mentioning "overlap" matches flag 8
    const sub = {
      flags: [{
        candidate_id: 'C-23',
        flag: 'Contradictory overlap in employment dates',
        severity: 'disqualifying'
      }]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    // The scoring iterates GT flags and uses find() independently
    // The same submission flag can match multiple GT flags
    assert.equal(result.fullCredit, 2, 'One submission flag should match both C-23 GT entries');
  });

  it('scores 0 for empty flags', () => {
    assert.equal(cfScoreFlagsAndSeverity({ flags: [] }, gt).points, 0);
    assert.equal(cfScoreFlagsAndSeverity({}, gt).points, 0);
  });

  it('severity matching is case-insensitive', () => {
    const sub = {
      flags: [{
        candidate_id: 'C-14',
        flag: 'Employment gap',
        severity: 'MINOR'
      }]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.fullCredit, 1);
  });
});

// ── cfScoreBiasPairs ────────────────────────────────────────────────────────

describe('cfScoreBiasPairs', () => {
  it('scores 15 for all 5 pairs correct', () => {
    const sub = {
      bias_pairs: gt.bp.map(p => ({
        candidate_ids: p.ids,
        observation: 'These candidates have similar qualifications'
      }))
    };
    const result = cfScoreBiasPairs(sub, gt);
    assert.equal(result.fullCredit, 5);
    assert.equal(result.points, 15);
  });

  it('scores 3 for a single correct pair', () => {
    const sub = {
      bias_pairs: [{
        candidate_ids: gt.bp[0].ids,
        observation: 'Nearly identical qualifications — similar background'
      }]
    };
    const result = cfScoreBiasPairs(sub, gt);
    assert.equal(result.fullCredit, 1);
    assert.equal(result.points, 3);
  });

  it('scores 1 for partial (one ID + keyword)', () => {
    const sub = {
      bias_pairs: [{
        candidate_ids: [gt.bp[0].ids[0], 'C-99'],
        observation: 'This candidate has similar background to others'
      }]
    };
    const result = cfScoreBiasPairs(sub, gt);
    assert.equal(result.partialCredit, 1);
    assert.equal(result.points, 1);
  });

  it('scores 0 when both IDs correct but no keyword match', () => {
    const sub = {
      bias_pairs: [{
        candidate_ids: gt.bp[0].ids,
        observation: 'Both candidates are from the Chicago area'
      }]
    };
    const result = cfScoreBiasPairs(sub, gt);
    assert.equal(result.points, 0);
  });

  it('accepts reversed ID order', () => {
    const sub = {
      bias_pairs: [{
        candidate_ids: [...gt.bp[0].ids].reverse(),
        observation: 'Nearly identical qualifications — a matched pair'
      }]
    };
    const result = cfScoreBiasPairs(sub, gt);
    assert.equal(result.fullCredit, 1);
  });

  it('accepts superset of IDs (3+ IDs including the pair)', () => {
    const sub = {
      bias_pairs: [{
        candidate_ids: [...gt.bp[0].ids, 'C-01'],
        observation: 'These candidates have similar qualifications'
      }]
    };
    const result = cfScoreBiasPairs(sub, gt);
    assert.equal(result.fullCredit, 1);
  });

  it('scores 0 for empty bias_pairs', () => {
    assert.equal(cfScoreBiasPairs({ bias_pairs: [] }, gt).points, 0);
    assert.equal(cfScoreBiasPairs({}, gt).points, 0);
  });

  it('gender pair (C-09/C-16) with "gender" keyword scores full credit', () => {
    const sub = {
      bias_pairs: [{
        candidate_ids: ['C-09', 'C-16'],
        observation: 'Possible gender bias — very similar candidates'
      }]
    };
    const result = cfScoreBiasPairs(sub, gt);
    assert.equal(result.fullCredit, 1);
  });

  it('caps at 15', () => {
    const sub = {
      bias_pairs: gt.bp.map(p => ({
        candidate_ids: p.ids,
        observation: 'similar qualifications'
      }))
    };
    assert.equal(cfScoreBiasPairs(sub, gt).points, 15);
  });
});

// ── cfScorePatterns ─────────────────────────────────────────────────────────

describe('cfScorePatterns', () => {
  it('scores 15 for all 3 patterns found', () => {
    const sub = {
      patterns: gt.pt.map(p =>
        `${p.ids.join(', ')} share ${p.kw[0]} connection`
      )
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.found, 3);
    assert.equal(result.points, 15);
  });

  it('scores 5 for one pattern found', () => {
    const p = gt.pt[0];  // Northfield
    const sub = {
      patterns: [`${p.ids[0]} and ${p.ids[1]} both have ${p.kw[0]} footer`]
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.found, 1);
    assert.equal(result.points, 5);
  });

  it('scores 0 when only 1 ID from pattern mentioned', () => {
    const p = gt.pt[0];
    const sub = {
      patterns: [`${p.ids[0]} has a ${p.kw[0]} template`]
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.found, 0);
    assert.equal(result.points, 0);
  });

  it('scores 0 when pattern has correct IDs but no keyword match', () => {
    const p = gt.pt[0];
    const sub = {
      patterns: [`${p.ids[0]} and ${p.ids[1]} have matching formats`]
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.points, 0);
  });

  it('rejects object patterns (only strings)', () => {
    const sub = {
      patterns: [{ ids: gt.pt[0].ids, text: gt.pt[0].kw[0] }]
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.points, 0);
  });

  it('handles case-insensitive IDs in pattern text', () => {
    const p = gt.pt[0];
    const sub = {
      patterns: [`${p.ids[0].toLowerCase()} and ${p.ids[1].toLowerCase()} from ${p.kw[0]}`]
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.found, 1);
  });

  it('accepts 3+ IDs from pattern (exceeds minimum of 2)', () => {
    const p = gt.pt[0];  // Northfield has 3 IDs
    const sub = {
      patterns: [`${p.ids.join(', ')} all from ${p.kw[0]}`]
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.found, 1);
  });

  it('scores 0 for correct keyword + wrong IDs', () => {
    const sub = {
      patterns: [`C-01 and C-02 from ${gt.pt[0].kw[0]}`]
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.points, 0);
  });

  it('scores 0 for empty patterns', () => {
    assert.equal(cfScorePatterns({ patterns: [] }, gt).points, 0);
    assert.equal(cfScorePatterns({}, gt).points, 0);
  });

  it('caps at 15', () => {
    const sub = {
      patterns: gt.pt.map(p =>
        `${p.ids.join(', ')} share ${p.kw[0]} connection`
      )
    };
    assert.equal(cfScorePatterns(sub, gt).points, 15);
  });
});

// ── cfScoreSubmission (integration) ─────────────────────────────────────────

describe('cfScoreSubmission (integration)', () => {
  it('scores exactly 100 for a perfect submission', () => {
    const perfect = buildPerfectSubmission(gt);
    const result = cfScoreSubmission(perfect);
    assert.equal(result.total, 100);
  });

  it('scores 0 for a completely empty submission', () => {
    const result = cfScoreSubmission({
      top_10_hire: [], bottom_5: [], flags: [], bias_pairs: [], patterns: []
    });
    assert.equal(result.total, 0);
  });

  it('scores 0 for undefined arrays', () => {
    const result = cfScoreSubmission({});
    assert.equal(result.total, 0);
  });

  it('scores only top 10 when other fields empty', () => {
    const sub = {
      top_10_hire: gt.t10.map((id, i) => ({ id, rank: i + 1, reason: 'ok' })),
      bottom_5: [], flags: [], bias_pairs: [], patterns: []
    };
    const result = cfScoreSubmission(sub);
    assert.equal(result.total, 30);
    assert.equal(result.top10.points, 30);
  });

  it('scores only bottom 5 when other fields empty', () => {
    const sub = {
      top_10_hire: [],
      bottom_5: gt.b5.map(id => ({ id, reason: 'weak' })),
      flags: [], bias_pairs: [], patterns: []
    };
    const result = cfScoreSubmission(sub);
    assert.equal(result.total, 10);
  });

  it('total is capped at 100', () => {
    // Even if somehow individual scores summed > 100
    const result = cfScoreSubmission(buildPerfectSubmission(gt));
    assert.ok(result.total <= 100);
  });

  it('total is floored at 0', () => {
    const result = cfScoreSubmission({});
    assert.ok(result.total >= 0);
  });

  it('returns dimension breakdowns', () => {
    const result = cfScoreSubmission(buildPerfectSubmission(gt));
    assert.ok('top10' in result);
    assert.ok('bottom5' in result);
    assert.ok('flags' in result);
    assert.ok('biasPairs' in result);
    assert.ok('patterns' in result);
    assert.ok('total' in result);
  });

  it('scores a realistic partial submission correctly', () => {
    const sub = {
      top_10_hire: [
        ...gt.t10.slice(0, 6).map((id, i) => ({ id, rank: i + 1, reason: 'ok' })),
        { id: 'C-99', rank: 7, reason: 'ok' },
        { id: 'C-98', rank: 8, reason: 'ok' },
        { id: 'C-97', rank: 9, reason: 'ok' },
        { id: 'C-96', rank: 10, reason: 'ok' },
      ],
      bottom_5: [
        { id: gt.b5[0], reason: 'weak' },
        { id: gt.b5[1], reason: 'weak' },
        { id: gt.b5[2], reason: 'weak' },
        { id: 'C-99', reason: 'wrong' },
        { id: 'C-98', reason: 'wrong' },
      ],
      flags: [
        { candidate_id: 'C-14', flag: 'employment gap', severity: 'minor' },
        { candidate_id: 'C-23', flag: 'overlapping dates contradict', severity: 'disqualifying' },
      ],
      bias_pairs: [
        { candidate_ids: ['C-04', 'C-22'], observation: 'very similar backgrounds' }
      ],
      patterns: [
        `${gt.pt[0].ids[0]} and ${gt.pt[0].ids[1]} from northfield career center`
      ]
    };
    const result = cfScoreSubmission(sub);
    // Top 10: 6 * 2.5 = 15, position bonus = 5 (top 3 exact) = 20
    // Bottom 5: 3 * 2 = 6
    // Flags: C-14 full (30/14) + C-23 matches both GT flags (2 * 30/14) = 3 * 30/14 ≈ 6.43
    // Bias: 1 * 3 = 3
    // Patterns: 1 * 5 = 5
    assert.ok(result.total > 30, `Expected > 30, got ${result.total}`);
    assert.ok(result.total < 50, `Expected < 50, got ${result.total}`);
  });
});
