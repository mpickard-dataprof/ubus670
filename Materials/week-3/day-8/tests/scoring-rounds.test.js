/**
 * scoring-rounds.test.js — Round-based submission simulations.
 *
 * Verifies that the scoring engine handles partial, cumulative, and
 * full submissions across the three competition rounds.
 */
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  cfScoreTop10, cfScoreBottom5, cfScoreFlagsAndSeverity,
  cfScoreBiasPairs, cfScorePatterns, cfScoreSubmission,
  cfDecodeGT
} = require('./test-harness');

const gt = cfDecodeGT();

// ── Round 1: partial top-10 + partial bottom-5 ──────────────────────────────

describe('Round 1 — partial submission (batch 1 only)', () => {
  const batch1Top10 = ['C-03', 'C-05', 'C-12', 'C-18'];

  it('scores 4 correct IDs in top_10_hire (4 × 2.5 = 10 pts, no position bonus)', () => {
    // Batch 1 order: C-03 rank 1, C-05 rank 2, C-12 rank 3, C-18 rank 4
    // GT top-3: rank1=C-12, rank2=C-21, rank3=C-06 — none match
    const sub = {
      top_10_hire: batch1Top10.map((id, i) => ({ id, rank: i + 1, reason: 'batch 1' }))
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 4);
    assert.equal(result.positionBonus, 0);
    assert.equal(result.points, 4 * 2.5);  // 10
  });

  it('scores 1 correct bottom_5 entry (C-07 = strict match, 2 pts)', () => {
    const sub = {
      bottom_5: [{ id: 'C-07', reason: 'employment gap' }]
    };
    const result = cfScoreBottom5(sub, gt);
    assert.equal(result.strictMatches, 1);
    assert.equal(result.points, 2);
  });

  it('integration: partial submission scores top10 + bottom5 only', () => {
    const sub = {
      top_10_hire: batch1Top10.map((id, i) => ({ id, rank: i + 1, reason: 'batch 1' })),
      bottom_5: [{ id: 'C-07', reason: 'gap' }],
      flags: [],
      bias_pairs: [],
      patterns: []
    };
    const result = cfScoreSubmission(sub);
    assert.equal(result.top10.setMatches, 4);
    assert.equal(result.bottom5.strictMatches, 1);
    assert.equal(result.total, 4 * 2.5 + 2);  // 12
  });
});

// ── Round 1: flags ──────────────────────────────────────────────────────────

describe('Round 1 — flags for C-14, C-10, C-07', () => {
  it('scores C-14 gap flag as full credit (correct severity = minor)', () => {
    const sub = {
      flags: [
        { candidate_id: 'C-14', flag: 'Unexplained employment gap of 14 months', severity: 'minor' }
      ]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.fullCredit, 1);
    assert.ok(Math.abs(result.points - 30 / 14) < 0.01);
  });

  it('scores C-10 inflated title flag as full credit', () => {
    const sub = {
      flags: [
        { candidate_id: 'C-10', flag: 'Inflated title — regional operations director at a small shop', severity: 'minor' }
      ]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.fullCredit, 1);
    assert.ok(Math.abs(result.points - 30 / 14) < 0.01);
  });

  it('scores C-07 gap flag as full credit', () => {
    const sub = {
      flags: [
        { candidate_id: 'C-07', flag: '16-month gap between jobs', severity: 'minor' }
      ]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.fullCredit, 1);
    assert.ok(Math.abs(result.points - 30 / 14) < 0.01);
  });

  it('scores all 3 flags together for 3 × (30/14) pts', () => {
    const sub = {
      flags: [
        { candidate_id: 'C-14', flag: 'Employment gap of 14 months', severity: 'minor' },
        { candidate_id: 'C-10', flag: 'Inflated title at frozen yogurt shop', severity: 'minor' },
        { candidate_id: 'C-07', flag: '16-month gap in employment history', severity: 'minor' }
      ]
    };
    const result = cfScoreFlagsAndSeverity(sub, gt);
    assert.equal(result.fullCredit, 3);
    assert.ok(Math.abs(result.points - 3 * (30 / 14)) < 0.01);
  });
});

// ── Round 1: bias pair ──────────────────────────────────────────────────────

describe('Round 1 — bias pair C-01 + C-17', () => {
  it('scores full credit for C-01/C-17 pair with matching keyword', () => {
    const sub = {
      bias_pairs: [{
        candidate_ids: ['C-01', 'C-17'],
        observation: 'Nearly identical qualifications — similar backgrounds and experience'
      }]
    };
    const result = cfScoreBiasPairs(sub, gt);
    assert.equal(result.fullCredit, 1);
    assert.equal(result.points, 3);
  });

  it('scores partial credit when only C-01 is listed (with keyword)', () => {
    const sub = {
      bias_pairs: [{
        candidate_ids: ['C-01', 'C-99'],
        observation: 'Very similar qualifications to another candidate'
      }]
    };
    const result = cfScoreBiasPairs(sub, gt);
    assert.equal(result.partialCredit, 1);
    assert.equal(result.points, 1);
  });
});

// ── Round 1: Lakeside pattern ───────────────────────────────────────────────

describe('Round 1 — Lakeside Goods pattern (C-05, C-14, C-07)', () => {
  it('scores 5 pts when 2+ IDs and "lakeside" keyword are present', () => {
    const sub = {
      patterns: [
        'C-05, C-14, and C-07 all previously worked at Lakeside Goods which closed'
      ]
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.found, 1);
    assert.equal(result.points, 5);
  });

  it('scores 5 pts with only 2 of 3 IDs and "lakeside" keyword', () => {
    const sub = {
      patterns: [
        'C-05 and C-14 both worked at Lakeside Goods before it went bankrupt'
      ]
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.found, 1);
    assert.equal(result.points, 5);
  });

  it('scores 0 when keyword is present but only 1 ID mentioned', () => {
    const sub = {
      patterns: ['C-05 worked at Lakeside Goods which closed down']
    };
    const result = cfScorePatterns(sub, gt);
    assert.equal(result.found, 0);
    assert.equal(result.points, 0);
  });
});

// ── Round 2: cumulative top-10 (batch 1 + batch 2) ─────────────────────────

describe('Round 2 — cumulative top-10 (7 correct IDs)', () => {
  const batch1 = ['C-03', 'C-05', 'C-12', 'C-18'];
  const batch2 = ['C-08', 'C-09', 'C-16'];
  const round2Top10 = [...batch1, ...batch2];

  it('scores 7 set matches (7 × 2.5 = 17.5 pts, no position bonus)', () => {
    // Batch order puts C-03 at rank 1, C-05 at rank 2, C-12 at rank 3
    // GT top-3: rank1=C-12, rank2=C-21, rank3=C-06 — none match
    const sub = {
      top_10_hire: round2Top10.map((id, i) => ({ id, rank: i + 1, reason: 'round 2' }))
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 7);
    assert.equal(result.positionBonus, 0);
    assert.equal(result.points, 7 * 2.5);  // 17.5
  });

  it('scores 17.5 with no position bonus when ranks are unset', () => {
    const sub = {
      top_10_hire: round2Top10.map(id => ({ id, reason: 'round 2' }))
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 7);
    assert.equal(result.positionBonus, 0);
    assert.equal(result.points, 17.5);
  });
});

// ── Round 3: full submission ────────────────────────────────────────────────

describe('Round 3 — full top-10 and bottom-5', () => {
  it('scores 30 pts for perfect top-10 with correct positions', () => {
    const sub = {
      top_10_hire: gt.t10.map((id, i) => ({ id, rank: i + 1, reason: 'final' }))
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 10);
    assert.equal(result.positionBonus, 5);
    assert.equal(result.points, 30);
  });

  it('scores 10 pts for perfect bottom-5', () => {
    const sub = {
      bottom_5: gt.b5.map(id => ({ id, reason: 'do not hire' }))
    };
    const result = cfScoreBottom5(sub, gt);
    assert.equal(result.strictMatches, 5);
    assert.equal(result.points, 10);
  });

  it('full submission with all sections scores 100', () => {
    const sub = {
      top_10_hire: gt.t10.map((id, i) => ({ id, rank: i + 1, reason: 'final' })),
      bottom_5: gt.b5.map(id => ({ id, reason: 'do not hire' })),
      flags: gt.fl.map(f => ({
        candidate_id: f.id,
        flag: `Issue: ${f.kw[0]}`,
        severity: f.sv
      })),
      bias_pairs: gt.bp.map(p => ({
        candidate_ids: p.ids,
        observation: 'These candidates have similar qualifications'
      })),
      patterns: gt.pt.map(p =>
        `${p.ids.join(', ')} share the same ${p.kw[0]} connection`
      )
    };
    const result = cfScoreSubmission(sub);
    assert.equal(result.total, 100);
  });
});

// ── Edge case: fewer than required entries ──────────────────────────────────

describe('cfScoreTop10 handles arrays of any length without errors', () => {
  it('handles 0 entries', () => {
    const result = cfScoreTop10({ top_10_hire: [] }, gt);
    assert.equal(result.setMatches, 0);
    assert.equal(result.points, 0);
  });

  it('handles 1 correct entry', () => {
    const sub = {
      top_10_hire: [{ id: gt.t10[0], rank: 1, reason: 'solo' }]
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 1);
    assert.equal(result.points, 2.5 + 1);  // 1 match + rank 1 exact = 1 pos bonus
  });

  it('handles 3 entries (all top-3 candidates)', () => {
    const sub = {
      top_10_hire: gt.t10.slice(0, 3).map((id, i) => ({ id, rank: i + 1, reason: 'top 3 only' }))
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 3);
    assert.equal(result.positionBonus, 5);  // all 3 exact
    assert.equal(result.points, 3 * 2.5 + 5);  // 12.5
  });

  it('handles 5 entries', () => {
    const sub = {
      top_10_hire: gt.t10.slice(0, 5).map((id, i) => ({ id, rank: i + 1, reason: 'half' }))
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 5);
    assert.equal(result.positionBonus, 5);
    assert.equal(result.points, 5 * 2.5 + 5);  // 17.5
  });

  it('handles undefined top_10_hire', () => {
    const result = cfScoreTop10({}, gt);
    assert.equal(result.setMatches, 0);
    assert.equal(result.points, 0);
  });

  it('handles 15 entries without crashing', () => {
    const sub = {
      top_10_hire: [
        ...gt.t10.map((id, i) => ({ id, rank: i + 1, reason: 'ok' })),
        { id: 'C-99', rank: 11, reason: 'extra' },
        { id: 'C-98', rank: 12, reason: 'extra' },
        { id: 'C-97', rank: 13, reason: 'extra' },
        { id: 'C-96', rank: 14, reason: 'extra' },
        { id: 'C-95', rank: 15, reason: 'extra' },
      ]
    };
    const result = cfScoreTop10(sub, gt);
    assert.equal(result.setMatches, 10);
    assert.equal(result.points, 30);
  });
});
