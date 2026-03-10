# Implementation Plan: Days 8-9 — Capstone Project

**Plan ID:** 0009
**Spec Reference:** [codev/specs/0009-capstone-days8-9.md](../specs/0009-capstone-days8-9.md)
**Status:** Complete
**Author:** Claude (Architect)
**Created:** 2026-03-09

---

## 1. Overview

This plan describes HOW to build the Days 8-9 capstone materials specified in Spec 0009. The work targets `Materials/week-3/day-8/web/` and produces 5 HTML files + 1 shared JS file.

### 1.1 Key Principles

1. **Reuse proven patterns** — Copy CSS/JS structure from Day 7 (most recent)
2. **Spec is source of truth** — Follow the slide structure, lab structure, and competition mechanics exactly
3. **Lessons learned applied** — All patterns from Days 1-7 (SVG quality bar, term definitions, Compare with Classmates, breadcrumbs, etc.)
4. **Resume dataset first** — Spec 0010 must be created before the lab and competition page can be built
5. **Quiz-firebase.js as pattern** — Reuse Firebase Auth, Firestore transactions, and attempt tracking patterns

### 1.2 Estimated Scope

| File | Effort | Notes |
|------|--------|-------|
| `lecture.html` | Medium | ~9 Day 8 slides + ~5 Day 9 slides, NotebookLM full-bleed, launch pad format |
| `lab.html` | Heavy | 6 parts, scaffold prompts, practice resumes (20+), tracking tables |
| `competition.html` | Heavy | JSON paste submission, validate/preview, leaderboard, auto-scoring, instructor admin panel |
| `capstone-firebase.js` | Heavy | ~550-650 lines, Firebase Auth + team management + scoring + leaderboard |
| `rubric.html` | Light | Printable grading rubric, simple layout |
| `index.html` | Light | Standard hub page, 4 nav pills |

### 1.3 Dependencies

- **Spec 0010 (Resume Dataset)** — Must exist before lab and competition pages can embed resumes
- Day 7 materials — Template source for CSS/JS patterns
- `quiz-firebase.js` — Pattern reference for Firebase integration
- NotebookLM — For lecture slide imagery

---

## 2. Pre-Implementation Checklist

Before writing any code:

- [ ] Re-read the spec (`codev/specs/0009-capstone-days8-9.md`)
- [ ] Re-read lessons learned (`codev/lessons/0001-course-materials.md`)
- [ ] Read Day 7 lecture.html for NotebookLM Reveal.js patterns
- [ ] Read Day 7 lab-adk.html for lab CSS/JS patterns
- [ ] Read Day 7 index.html for nav hub patterns
- [ ] Read `quiz-firebase.js` for Firebase Auth + Firestore transaction patterns
- [ ] Create Spec 0010 (Resume Dataset) if not already done
- [ ] Verify ADK Visual Builder interface matches Day 7 lab instructions

---

## 3. Phase 1: Resume Dataset (Spec 0010 — Prerequisite)

Before any HTML can be written, the resume dataset must be designed.

### Step 1.1: Create Spec 0010

Write `codev/specs/0010-resume-dataset.md` covering:
- 20+ practice resumes with known attributes
- 30+ competition resumes with ground truth scoring
- Hidden patterns, bias pairs, red flags
- Point-based ground truth with acceptability windows
- Detailed scoring rubric per resume

### Step 1.2: Generate Practice Resumes

Create 20+ text-based resumes for the practice set:
- Varied experience levels (entry-level to experienced)
- Mix of strong, moderate, and weak candidates
- Known classifications for self-checking during Day 8 lab
- Include some with obvious red flags for practice

### Step 1.3: Generate Competition Resumes

Create 30+ text-based resumes for the competition set:
- Point-based scoring (each resume has a definitive ground truth score)
- Top 3 and bottom 3 unambiguous (wide score gaps)
- ~12-15 red flags embedded across the set
- 3-4 bias pairs (identical qualifications, different names/backgrounds)
- 2-3 hidden patterns (same career center, identical formatting, etc.)
- Middle positions allow ±1-2 position swaps for partial credit

### Step 1.4: Create Ground Truth Answer Key

- Definitive ranking of all 30 competition resumes
- Every red flag catalogued with severity classification
- All bias pairs documented
- All hidden patterns documented
- Scoring rubric: how each dimension maps to points

---

## 4. Phase 2: Directory + Templates

### Step 2.1: Create Directory Structure

```
Materials/week-3/day-8/web/
├── index.html
├── lecture.html
├── lab.html
├── competition.html
└── rubric.html

Materials/_shared/
└── capstone-firebase.js  (new)
```

### Step 2.2: Copy Templates

- Copy Day 7 `index.html` → Day 8 `index.html` (nav hub template)
- Copy Day 7 `lecture.html` → Day 8 `lecture.html` (Reveal.js + NotebookLM template)
- Copy Day 7 `lab-adk.html` → Day 8 `lab.html` (lab CSS/JS template)
- Copy Day 7 `quiz.html` → Day 8 `competition.html` (Firebase integration starting point)

---

## 5. Phase 3: Lecture (lecture.html)

### Step 3.1: Set Up File Structure

1. Start from Day 7 lecture.html template
2. Keep all Reveal.js + NotebookLM full-bleed CSS
3. Update: title, meta, breadcrumb, slide content
4. Two slide decks in one file: Day 8 (~9 slides) + Day 9 (~5 slides), separated by a section divider

### Step 3.2: Build Day 8 Slides (Launch Pad)

Follow spec Section 4.1 exactly:

| Slide | Key Implementation Notes |
|---|---|
| 1 (Title) | "Capstone: AI Resume Screening Pipeline" |
| 2 (Business Problem) | Beacon seasonal hiring stats, visual of resume stack |
| 3 (Bridge Exercise) | Think-pair-share prompt: "What would a 3-agent pipeline look like?" Timer: 2 min |
| 4 (Architecture Blueprint) | Pipeline diagram SVG: Parser → Evaluator → Ranker. Shows structure, NOT prompts. |
| 5 (Data Contract) | JSON schema showing Parser output format and Evaluator expected input. Critical slide — prevents the #1 failure mode. |
| 6 (Two-Phase Workflow) | AI Studio → ADK flow diagram. Familiar tools, new challenge. |
| 7 (Common Pitfalls) | Bullet list: JSON consistency, temperature for consistency, data contract mismatches, testing with edge cases |
| 8 (Competition Rules) | 6 dimensions, 100 points, 3 attempts. Link to rubric page. |
| 9 (Team Formation) | "Go build." Link to lab page. |

### Step 3.3: Build Day 9 Slides

| Slide | Key Implementation Notes |
|---|---|
| 10 (Day 9 Agenda) | Competition rules, timeline |
| 11 (Competition Mechanics) | JSON paste submission, validate/preview, 3 attempts, interval reveals |
| 12 (Competition Set Reveal) | "30 resumes you've never seen" |
| 13 (Optimization Tips) | Prompt refinement, parameter tuning, stretch agents |
| 14 (Video Presentation) | Requirements, structure, deadline |

### Step 3.4: SVG Quality Pass

- Pipeline architecture diagram: Parser → Evaluator → Ranker
- Data contract schema visualization
- Two-phase workflow diagram
- All SVGs meet quality bar: 12-14px labels, NIU brand colors, drop shadows, rounded rects

### Step 3.5: NotebookLM Visual Pipeline

- Create PROJECT_BRIEF for NotebookLM
- Generate full-bleed slide backgrounds
- Extract and deploy following Spec 0006 pipeline

---

## 6. Phase 4: Lab (lab.html)

### Step 6.1: Set Up File Structure

1. Start from Day 7 lab-adk.html template
2. Keep: navbar, lab-header, lab-section, task, checkbox-step, prompt-box, tip-box, warning-box, compare-box, reflection-area, progress-tracker, PDF generation
3. Replace: all task content

### Step 6.2: Write Lab Header + Part 0 (Team Formation)

- Title: "Building a Multi-Agent Resume Screening Pipeline"
- Subtitle: "From Individual Agents to a Complete Hiring System"
- Time: ~150 minutes
- Objectives: Match spec Section 4.1
- Part 0: Team formation + architecture planning (15 min)
  - Team name registration
  - Review Beacon job posting (embedded with copy button)
  - Architecture planning worksheet: sketch pipeline on paper

### Step 6.3: Embed Beacon Job Posting

Include the full seasonal worker job posting with:
- Job title, location, pay range, schedule requirements
- Required qualifications, preferred skills
- Copy-to-clipboard button
- This becomes the reference document for the Evaluator agent

### Step 6.4: Embed Practice Resumes (20+)

From Spec 0010:
- Each resume as a collapsible card
- Copy-to-clipboard button on each
- Color-coded difficulty indicator (easy/medium/hard)
- Organized by set: "First 5" (for initial testing), "Full Set" (for pipeline testing)

### Step 6.5: Write Part 1 — Parser Agent (30 min)

- Full scaffold prompt provided (students can use as-is or modify)
- Step-by-step: open AI Studio, paste prompt, test with 3 resumes
- Verify JSON output structure is consistent
- Tracking table: Resume | Parser Output Valid? | Issues?

### Step 6.6: Write Part 2 — Evaluator Agent (30 min)

- **Partial scaffold**: output format template only (JSON structure for score, category, concerns)
- Students define their own scoring rubric (what matters for Beacon?)
- Step-by-step: create new AI Studio session, test with Parser output
- Calibration exercise: are scores reasonable? Compare 2 resumes that should score differently
- Compare with Classmates box: "How does your scoring rubric differ?"

### Step 6.7: Write Part 3 — Ranker Agent (25 min)

- **No scaffold** — by now students should write their own prompt
- Hint box: "Your Ranker should receive ALL evaluations and produce a ranked list"
- Test with 5+ evaluations
- Compare with Classmates box: "Does your Ranker agree with your teammates' manual ranking?"

### Step 6.8: 75-Min Checkpoint Section

- Instructor walkthrough instructions
- **Rescue package**: pre-built Parser + Evaluator prompts (hidden behind a "Need Help?" toggle)
- Checkpoint goals: Parser working + Evaluator working = ready for pipeline
- Warning: "If you're behind, use the rescue prompts. You can still compete and still differentiate through your Ranker and competition strategy."

### Step 6.9: Write Part 4 — Wire Pipeline in ADK (30 min)

- Open ADK Visual Builder (Cloud Shell)
- Create 3 LLM Agents with finalized prompts
- Wire: Parser → Evaluator → Ranker
- Run 5+ practice resumes end-to-end
- Troubleshooting guide: common data contract issues
- Tracking table: Resume | Parser OK? | Evaluator OK? | Ranker OK? | End-to-End?

### Step 6.10: Write Part 5 — Document + Day 9 Prep (20 min)

- Save all system prompts (text file or Blackboard draft)
- Test the submission form on the competition page (practice mode)
- Strategy notes: what would you improve with more time?
- No graded submission — work carries to Day 9

### Step 6.11: Progress Tracker

Configure JavaScript progress tracker for all parts (Part 0 through Part 5).

---

## 7. Phase 5: Competition Page (competition.html)

### Step 7.1: Page Layout

Four main sections, controlled by tabs or scroll:
1. **Resume Display** — Practice set (always visible) + Competition set (instructor-toggled)
2. **Submission** — JSON paste textarea + validate + preview + submit
3. **Leaderboard** — Team rankings with score breakdowns
4. **Admin Panel** — Instructor-only controls (hidden for students)

### Step 7.2: Resume Display Section

- Practice resumes: always visible, copy-to-clipboard
- Competition resumes: hidden by default, revealed by instructor toggle
- Each resume as a collapsible card with copy button
- "Competition Set Not Yet Available" message when hidden

### Step 7.3: JSON Paste Submission

Teams paste their Ranker agent's JSON output directly. The pipeline output quality is part of what's tested.

**Layout:**
- Large monospace textarea (40+ rows) with placeholder showing the expected JSON structure
- **"Validate" button** — runs `JSON.parse()`, checks required fields, shows friendly errors:
  - JSON syntax errors: "Invalid JSON — check for a missing comma near line 12"
  - Missing fields: "Missing required field: `top_10_hire`"
  - Wrong types: "`top_10_hire` should be an array, got string"
  - Wrong counts: "Expected 10 candidates in `top_10_hire`, found 8"
  - Severity values: "Flag severity must be `minor` or `disqualifying`, got `medium`"
- **Preview panel** — on successful validation, renders parsed JSON as formatted tables:
  - Top 10 Hire: ranked table with name + reason
  - Bottom 5: table with name + reason
  - Red Flags: table with candidate + flag + severity (color-coded)
  - Bias Pairs: table with candidate pair + observation
  - Patterns: numbered list
- **"Submit" button** (disabled until validation passes) with attempt counter: "Submit (X/3 attempts used)"
- After submission: score breakdown display + "Submitted successfully" confirmation

### Step 7.4: Leaderboard Display

- Table: Rank | Team Name | Total Score | Top 10 | Bottom 5 | Flags | Severity | Bias | Patterns | Attempts | Last Submitted
- Sorted by best score (descending)
- Highlighted row for current team
- "Leaderboard will refresh at the next reveal" message between intervals
- Instructor can trigger reveals

### Step 7.5: Instructor Admin Panel

Visible only to instructor email(s):
- Toggle: Show/Hide Competition Set
- Button: Reveal Leaderboard Scores
- Button: Freeze Competition (no more submissions)
- Table: All submissions from all teams (expandable)
- Competition timer: set start and end time

### Step 7.6: JSON Validation

Two-stage validation on "Validate" click:

**Stage 1 — JSON syntax:**
- `JSON.parse()` with try/catch
- On failure: highlight approximate error location in textarea, show human-readable error

**Stage 2 — Schema validation:**
- `top_10_hire`: array of 10 objects, each with `rank` (number), `id` (string matching C-XX), `reason` (string)
- `bottom_5`: array of 5 objects, each with `id` (string matching C-XX), `reason` (string)
- `flags`: array of 1+ objects, each with `candidate_id` (C-XX), `flag` (string), `severity` ("minor" or "disqualifying")
- `bias_pairs`: array of 0+ objects, each with `candidate_ids` (array of 2 C-XX strings), `observation` (string)
- `patterns`: array of 0+ strings
- All IDs must be valid (C-01 through C-30)
- No duplicate IDs across top 10 and bottom 5
- Team must be authenticated
- Attempts remaining > 0

---

## 8. Phase 6: capstone-firebase.js (~550-650 lines)

### Step 8.1: Architecture

Single file, modular structure:

```javascript
// === CONFIGURATION ===
// Firebase config, instructor emails, max attempts, etc.

// === FIREBASE AUTH ===
// Google Sign-In, NIU domain restriction, auth state listener
// Pattern: copy from quiz-firebase.js, adapt for team context

// === TEAM MANAGEMENT ===
// lookupTeam(email) — find which team this student belongs to
// displayTeamInfo() — show team name, members, attempts used

// === GROUND TRUTH (OBFUSCATED) ===
// Encoded ground truth data (base64 + key rotation)
// decodeGroundTruth() — decode at scoring time

// === SCORING ENGINE ===
// scoreSubmission(submission) — score against ground truth
// scoreTop10(submitted, truth) — 30 points (set membership + position bonus)
// scoreBottom5(submitted, truth) — 10 points (strict + partial for near-misses)
// scoreFlagsAndSeverity(submitted, truth) — 30 points (single pass, flag+severity together)
// scoreBiasPairs(submitted, truth) — 15 points (5 pairs × 3 pts, partial for one member)
// scorePatterns(submitted, truth) — 15 points (3 patterns × 5 pts)
// All matching: case-insensitive, resume IDs (C-01), keyword substring matching

// === SUBMISSION ===
// validateJSON(text) — parse + schema check, return {valid, errors, parsed}
// renderPreview(parsed) — render parsed JSON as formatted tables
// submitAttempt(teamId, submission) — Firestore transaction
//   - Check attempts < 3
//   - Score submission
//   - Append to attempts array
//   - Update bestScore if improved

// === LEADERBOARD ===
// initLeaderboard() — Firestore onSnapshot listener
// renderLeaderboard(teams) — sort by bestScore, render table
// revealScores() — instructor-triggered, updates visibility flag

// === ADMIN ===
// isInstructor(email) — check against instructor email list
// toggleCompetitionSet(visible) — show/hide competition resumes
// freezeCompetition() — disable submissions
// viewAllSubmissions() — admin table
```

### Step 8.2: Firebase Auth (Reuse Pattern)

Copy from quiz-firebase.js:
- Google Sign-In with NIU domain restriction
- Auth state listener
- Sign-in / sign-out buttons
- Adapt: after auth, look up team membership instead of quiz state

### Step 8.3: Team Management

- Teams pre-created in Firestore Console (avoids registration race conditions)
- On sign-in: query `capstone_teams` where `members` array contains user email
- Display: team name, member list, attempts used, best score
- Edge case: user not on any team → show "Contact instructor" message

### Step 8.4: Scoring Engine

Client-side scoring with obfuscated ground truth:

```javascript
// Ground truth encoded as base64 JSON, split across multiple variables
const _gt_a = "eyJ0b3AxMCI6...";  // chunk 1
const _gt_b = "W3sibmFtZSI6...";  // chunk 2
// Reassemble and decode at scoring time
function decodeGroundTruth() {
  return JSON.parse(atob(_gt_a + _gt_b));
}
```

Scoring functions (all use resume IDs, case-insensitive keyword matching):
- `scoreTop10`: 2.5 pts per correct ID in top 10 + position bonus for top 3 (+5/+2/+1 discrete steps)
- `scoreBottom5`: 2 pts per correct ID in bottom 5, 1 pt for near-misses (positions 23-27)
- `scoreFlagsAndSeverity`: single pass — ~2.14 pts (30/14) for flag+severity correct, 1.0 pt for flag only. Keyword substring match against `flag_keywords` array per flag.
- `scoreBiasPairs`: 3 pts per pair (both IDs + observation keyword), 1 pt partial (one ID + keyword). Observation keywords: "similar," "same," "identical," "matched," "comparable," "equal," "equivalent," "bias"
- `scorePatterns`: 5 pts per pattern (2+ IDs + pattern keyword). Free-text matching against `keywords` array.

### Step 8.5: Submission Flow (Firestore Transaction)

```javascript
async function submitAttempt(teamId, submission) {
  const ref = db.collection('capstone_teams').doc(teamId);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data();
    if (data.attemptsUsed >= 3) throw new Error('max_attempts');

    const scores = scoreSubmission(submission);
    const attempt = {
      attempt: data.attemptsUsed + 1,
      submission,
      scores,
      submittedAt: new Date().toISOString(),
      submittedBy: currentUser.email
    };

    const newBest = scores.total > (data.bestScore || 0);
    tx.update(ref, {
      attemptsUsed: data.attemptsUsed + 1,
      bestScore: newBest ? scores.total : data.bestScore,
      bestAttempt: newBest ? attempt.attempt : data.bestAttempt,
      attempts: [...data.attempts, attempt],
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    });

    return { scores, attemptNumber: attempt.attempt };
  });
}
```

### Step 8.6: Leaderboard

- `onSnapshot` listener on `capstone_teams` collection
- Sort by `bestScore` descending
- Render table with score breakdown columns
- Instructor controls visibility of scores (interval reveals)
- Between reveals: show "Scores will be revealed at the next interval"

### Step 8.7: Admin Panel

- Check `isInstructor(email)` against hardcoded instructor email list
- Toggle competition set: update a `capstone_config` document in Firestore
- Reveal scores: update a `leaderboardVisible` flag
- Freeze competition: update a `competitionOpen` flag
- View all submissions: render expandable table of all team attempts

---

## 9. Phase 7: Index + Rubric

### Step 9.1: index.html

Copy Day 7 index.html, update:
- Breadcrumb: UBUS 670 > Week 3 > Day 8 - Capstone
- Hero title: "Capstone Project"
- Hero subtitle: "Multi-Agent Resume Screening Competition"
- Dates: March 25-27, 2026
- 4 nav pills: Dashboard | Lecture | Lab | Competition
- Module cards: Lecture (launch pad), Lab (build pipeline), Competition (leaderboard), Rubric (grading criteria)

### Step 9.2: rubric.html

Printable grading rubric:
- Competition scoring (6 dimensions, 100 points) — from spec Section 5.3
- Video presentation criteria (separate grading, TBD)
- Submission package checklist
- Clean print CSS (no nav, no backgrounds)

---

## 10. Phase 8: Testing

### Step 10.1: Unit Testing

- [ ] Firebase Auth sign-in/sign-out works
- [ ] Team lookup returns correct team for authenticated user
- [ ] Scoring engine produces correct scores against known test data
- [ ] JSON validation catches syntax errors with friendly messages
- [ ] JSON validation catches missing/malformed fields
- [ ] Attempt limit (3) enforced via Firestore transaction
- [ ] Obfuscated ground truth decodes correctly

### Step 10.2: Integration Testing

- [ ] Full submission flow: paste JSON → validate → preview → submit → score → Firestore → leaderboard
- [ ] Multiple teams submitting concurrently
- [ ] Leaderboard updates after instructor reveal
- [ ] Competition set toggle (hidden → visible)
- [ ] Admin panel accessible only to instructor emails

### Step 10.3: End-to-End Dress Rehearsal

- [ ] Instructor creates teams in Firestore Console
- [ ] Students sign in and see their team
- [ ] Practice set visible, competition set hidden
- [ ] Instructor reveals competition set
- [ ] Teams paste JSON, validate, preview, submit, see scores
- [ ] Instructor triggers leaderboard reveal
- [ ] 3-attempt limit works across page reloads
- [ ] Run on campus WiFi (latency, intermittent connections)

### Step 10.4: Stress Testing

- [ ] Open 3 browser tabs as 3 different teams
- [ ] Submit concurrently
- [ ] Verify no data corruption
- [ ] Verify leaderboard sorts correctly

---

## 11. Implementation Order Summary

```
PRE-WORK
├── Re-read spec 0009, lessons, Day 7 materials
├── Read quiz-firebase.js for patterns
└── Create Spec 0010 (Resume Dataset) if not done

PHASE 1: RESUME DATASET (Spec 0010)
├── Design 20+ practice resumes
├── Design 30+ competition resumes with ground truth
├── Embed hidden patterns, bias pairs, red flags
└── Create ground truth answer key

PHASE 2: DIRECTORY + TEMPLATES
├── Create Materials/week-3/day-8/web/
└── Copy Day 7 templates as starting points

PHASE 3: LECTURE (lecture.html)
├── Day 8 slides (~9): launch pad format
├── Day 9 slides (~5): competition briefing
├── SVG quality pass
└── NotebookLM visual pipeline

PHASE 4: LAB (lab.html) — HEAVY
├── Beacon job posting + practice resumes (20+)
├── Part 0: Team formation + planning
├── Part 1: Parser Agent (scaffold prompt)
├── Part 2: Evaluator Agent (partial scaffold)
├── Part 3: Ranker Agent (no scaffold)
├── 75-min checkpoint + rescue package
├── Part 4: Wire pipeline in ADK
├── Part 5: Document + Day 9 prep
└── Progress tracker configuration

PHASE 5: COMPETITION PAGE (competition.html) — HEAVY
├── Resume display (practice + competition toggle)
├── JSON paste textarea + validate + preview
├── Leaderboard with interval reveals
├── Instructor admin panel
└── JSON schema validation (syntax + required fields)

PHASE 6: CAPSTONE-FIREBASE.JS (~550-650 lines)
├── Firebase Auth (reuse quiz-firebase.js pattern)
├── Team management (pre-created teams)
├── Scoring engine (obfuscated ground truth)
├── Submission flow (Firestore transaction)
├── Leaderboard rendering
└── Admin functions

PHASE 7: INDEX + RUBRIC
├── index.html with 4 nav pills
└── rubric.html — printable grading rubric

PHASE 8: TESTING
├── Unit tests (scoring, validation, auth)
├── Integration tests (full submission flow)
├── End-to-end dress rehearsal
└── Stress test (concurrent submissions)
```

---

## 12. Traps to Avoid

1. **Don't build without the resume dataset** — Lab and competition pages need real resumes to be meaningful. Create Spec 0010 and the dataset first.
2. **Don't over-scaffold** — The capstone is supposed to be open-ended. Full scaffold for Parser, partial for Evaluator, none for Ranker. This is intentional progression.
3. **Don't skip the data contract slide** — The #1 failure mode in multi-agent systems is agents producing output the next agent can't parse. The lecture must show the JSON schema explicitly.
4. **Don't use Cloud Functions** — Client-side scoring with obfuscated ground truth is simpler, faster, and avoids billing/deployment complexity. The security tradeoff is acceptable for MBA students.
5. **Don't make scoring too strict** — Acceptability windows for middle positions. Exact position matching for all 30 candidates is unrealistic and would make the competition feel unfair.
6. **Don't forget the rescue package** — Teams that fall behind on Day 8 need pre-built prompts to catch up. Without this, they can't compete on Day 9.
7. **Don't skip the JSON validation UX** — Students paste raw JSON from their pipeline. The Validate button must give friendly, actionable error messages (not just "Invalid JSON"). Show line numbers, highlight errors, explain what's missing. The preview panel is essential — students need to see their submission rendered as tables before committing.
8. **Don't real-time the leaderboard** — Interval reveals (instructor-triggered) maintain suspense and prevent teams from gaming based on score changes.
9. **Don't deploy without a dress rehearsal** — Test on campus WiFi with mock teams before Day 8. Firestore is robust but network conditions matter.
10. **Don't build team registration from scratch** — Pre-create teams in Firestore Console. Simpler, more reliable, no race conditions.

---

## 13. Approval

**Status:** Complete

### Implementation Notes
- capstone-firebase.js: ~900 lines (larger than estimated 550-650 due to comprehensive scoring engine and admin panel)
- 173 automated unit tests covering scoring engine, validation, ground truth integrity, keyword matching, and resume data
- 50 total resumes: 20 practice + 30 competition
- Ground truth: base64-obfuscated, 4 chunks, client-side scoring verified to produce exactly 100.0 for perfect submission
- Scoring math: 30/14 per flag (not 2.1) to ensure 14 perfect flags = exactly 30.0 points
- cfValidateSubmission guards against JSON.parse returning null/number/array primitives
- All phases completed: resume dataset, lecture, lab, competition page, rubric, index, testing

---

*End of Implementation Plan*
