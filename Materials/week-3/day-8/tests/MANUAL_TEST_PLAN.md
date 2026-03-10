# Capstone Competition — Manual Test Plan

**Date:** Pre-Day 8 (before March 25, 2026)
**Tester:** Instructor (mpickard@niu.edu or matthew.david.pickard@gmail.com)
**Environment:** Chrome (latest), campus WiFi
**Estimated time:** 60-90 minutes

---

## PART 0: Firebase Console Setup (One-Time)

All configuration is done in the [Firebase Console](https://console.firebase.google.com/) for project **ubus-670-labs**.

### 0.1 Deploy Firestore Security Rules

Go to **Firestore Database > Rules** and replace the existing rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Settings: anyone authenticated can read; only instructors can write
    match /settings/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email in
        ['mpickard@niu.edu', 'matthew.david.pickard@gmail.com'];
    }

    // Capstone teams: members can read/write their own team
    match /capstone_teams/{teamId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.auth.token.email in resource.data.members;
    }

    // Quiz collection (existing — do not remove)
    match /quizzes/{doc} {
      allow read, write: if request.auth != null;
    }

    // Lab collection (existing — do not remove)
    match /labs/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **Publish**. Wait for confirmation.

> **Note:** The `capstone_teams` write rule requires the user's email to be in the document's `members` array. This means teams must be pre-created with member emails before students can write to them.

### 0.2 Create the Settings Document

Go to **Firestore Database > Data**.

1. Click **Start collection** (or use existing)
2. Collection ID: `settings`
3. Document ID: `capstone_settings`
4. Add fields:
   - `competitionVisible` (boolean): `false`
   - `competitionFrozen` (boolean): `false`

### 0.3 Create Test Teams

In collection `capstone_teams`, create 3 test team documents:

**Document ID:** `test-team-alpha`
```
teamName: "Test Team Alpha"
members: ["mpickard@niu.edu"]
attemptsUsed: 0
bestScore: null
bestAttempt: null
attempts: []
```

**Document ID:** `test-team-beta`
```
teamName: "Test Team Beta"
members: ["matthew.david.pickard@gmail.com"]
attemptsUsed: 0
bestScore: null
bestAttempt: null
attempts: []
```

**Document ID:** `test-team-gamma`
```
teamName: "Test Team Gamma"
members: []
attemptsUsed: 0
bestScore: null
bestAttempt: null
attempts: []
```

> Team Gamma is intentionally empty — used to test the "team full / no members" edge case and the join flow.

### 0.4 Verify Google Auth Provider

Go to **Authentication > Sign-in method**. Confirm:
- [x] Google provider is enabled
- [x] Authorized domains include the hosting domain (e.g., `mpickard-dataprof.github.io`)

### 0.5 Hosting

Ensure the site is deployed to HTTPS (GitHub Pages, Firebase Hosting, etc.). The clipboard API and Google Auth both require a secure context.

---

## PART 1: Firebase Auth Flow

**Page:** `competition.html`
**Prerequisite:** Part 0 complete

### Test 1.1 — Sign-in with instructor account

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open `competition.html` in Chrome | Page loads. Sign-in gate visible. No console errors. |
| 2 | Click **Sign In** button in nav bar | Google account picker appears |
| 3 | Select `mpickard@niu.edu` (or `matthew.david.pickard@gmail.com`) | Sign-in succeeds. Sign-in gate disappears. User email shown in nav. Sign Out button appears. |
| 4 | Open DevTools Console | No errors. Should see `[capstone]` log messages. |

- [ ] PASS / FAIL: _______________

### Test 1.2 — Sign-in with non-NIU account blocked

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign out if signed in | Sign-in gate reappears |
| 2 | Click **Sign In** | Google picker appears |
| 3 | Select a non-NIU, non-allowed account (e.g., personal Gmail not in CF_ALLOWED_EMAILS) | Error message: domain not allowed. User is NOT signed in. |

- [ ] PASS / FAIL: _______________

### Test 1.3 — Sign-out and re-sign-in

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in with instructor account | Signed in, team info visible |
| 2 | Click **Sign Out** | Sign-in gate reappears. Team info hidden. Competition content hidden. |
| 3 | Click **Sign In** again, select same account | Signs in. Team info restored. Competition content visible. No duplicate auth UI elements. |

- [ ] PASS / FAIL: _______________

---

## PART 2: Team Management

**Page:** `competition.html`
**Prerequisite:** Test teams created in Part 0.3

### Test 2.1 — Instructor auto-joins pre-assigned team

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in with `mpickard@niu.edu` | Team picker does NOT appear (already a member of test-team-alpha). Team info bar shows "Test Team Alpha" with "Attempts: 0/3". |

- [ ] PASS / FAIL: _______________

### Test 2.2 — Team picker appears for unassigned user

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | In Firestore Console, remove your email from test-team-alpha's `members` array | (Prep step) |
| 2 | Refresh `competition.html`, sign in | Team picker appears showing available teams |
| 3 | Verify all 3 test teams are listed | Team names, member counts, and Join buttons visible |
| 4 | Click **Join** on Test Team Gamma | Team picker disappears. Team info bar shows "Test Team Gamma". Competition content appears. |
| 5 | Check Firestore Console | `test-team-gamma` document `members` array now includes your email |

**Cleanup:** Restore your email to test-team-alpha's members. Remove from test-team-gamma.

- [ ] PASS / FAIL: _______________

### Test 2.3 — Full team shows "Full" badge

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | In Firestore Console, set test-team-alpha `members` to 3 dummy emails | (Prep step) |
| 2 | Sign in as a user not on any team | Team picker appears. Test Team Alpha shows "Full" badge. Join button disabled or absent. |

**Cleanup:** Restore test-team-alpha members.

- [ ] PASS / FAIL: _______________

---

## PART 3: Submission End-to-End

**Page:** `competition.html`
**Prerequisite:** Signed in, on a team, attempts at 0/3

### Test 3.1 — Valid JSON: validate, preview, submit

Use this sample submission (scores ~40-50 points):

```json
{
  "top_10_hire": [
    {"rank": 1, "id": "C-12", "reason": "Strong retail experience"},
    {"rank": 2, "id": "C-21", "reason": "Excellent availability"},
    {"rank": 3, "id": "C-06", "reason": "Bilingual candidate"},
    {"rank": 4, "id": "C-18", "reason": "Customer service background"},
    {"rank": 5, "id": "C-03", "reason": "POS experience"},
    {"rank": 6, "id": "C-24", "reason": "Strong references"},
    {"rank": 7, "id": "C-08", "reason": "Full availability"},
    {"rank": 8, "id": "C-09", "reason": "Inventory experience"},
    {"rank": 9, "id": "C-16", "reason": "Team player"},
    {"rank": 10, "id": "C-05", "reason": "Reliable candidate"}
  ],
  "bottom_5": [
    {"id": "C-23", "reason": "Contradictory dates"},
    {"id": "C-07", "reason": "Employment gap"},
    {"id": "C-29", "reason": "Fabricated employer"},
    {"id": "C-13", "reason": "Fake institution"},
    {"id": "C-30", "reason": "Unverifiable degree"}
  ],
  "flags": [
    {"candidate_id": "C-13", "flag": "Pacific Northwest Business Institute is a fake institution", "severity": "disqualifying"},
    {"candidate_id": "C-30", "flag": "Great Lakes Polytechnic does not exist", "severity": "disqualifying"},
    {"candidate_id": "C-29", "flag": "Grandview National Retail Corp is fabricated", "severity": "disqualifying"},
    {"candidate_id": "C-10", "flag": "Inflated title - Regional Operations Director at a small shop", "severity": "minor"}
  ],
  "bias_pairs": [
    {"candidate_ids": ["C-09", "C-16"], "observation": "Similar qualifications but different gender presentation"}
  ],
  "patterns": [
    "C-08, C-19, and C-27 all have Northfield Community College career center footer"
  ]
}
```

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Paste JSON into textarea | JSON appears in the text area |
| 2 | Click **Validate** | Preview panel appears showing: Top 10 ranked list, Bottom 5 list, Flags (4), Bias Pairs (1), Patterns (1). Submit button becomes enabled. |
| 3 | Click **Submit** | Button text changes to "Submitting...". After 1-3 seconds, score breakdown appears with dimension scores. Team info updates to "Attempts: 1/3". |
| 4 | Verify score breakdown | Total should be > 0. Each dimension (Top 10, Bottom 5, Flags, Bias Pairs, Patterns) shows a numeric score. |
| 5 | Check leaderboard | Your team appears with the score. |

**Record the score:** _______________

- [ ] PASS / FAIL: _______________

### Test 3.2 — Invalid JSON: clear error messages

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Clear textarea, type `{broken json` | |
| 2 | Click **Validate** | Red error: "Invalid JSON: ..." with parse error details. Submit button stays disabled. |
| 3 | Clear textarea, paste: `{"top_10_hire": []}` | |
| 4 | Click **Validate** | Error: "top_10_hire must be an array of exactly 10 entries". Submit disabled. |
| 5 | Paste valid JSON but change one ID to `C-1` (missing zero) | |
| 6 | Click **Validate** | Error: "invalid id (expected C-XX format)". Submit disabled. |
| 7 | Paste valid JSON but duplicate an ID in top_10_hire | |
| 8 | Click **Validate** | Error: "duplicate id C-XX". Submit disabled. |

- [ ] PASS / FAIL: _______________

### Test 3.3 — Three-attempt limit

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Submit attempt 1 (from Test 3.1) | Score appears. "Attempts: 1/3" |
| 2 | Modify JSON slightly, validate, submit again | "Attempts: 2/3". New score may differ. |
| 3 | Modify again, validate, submit third time | "Attempts: 3/3". Score appears. |
| 4 | Try to validate and submit a 4th time | Alert: "Maximum attempts reached (3/3)". Submit is blocked. |

**Cleanup:** In Firestore Console, reset the team: set `attemptsUsed` to `0`, `bestScore` to `null`, `attempts` to `[]`.

- [ ] PASS / FAIL: _______________

### Test 3.4 — String ranks in JSON (AI-generated edge case)

Paste this JSON where ranks are strings:

```json
{
  "top_10_hire": [
    {"rank": "1", "id": "C-12", "reason": "test"},
    {"rank": "2", "id": "C-21", "reason": "test"},
    {"rank": "3", "id": "C-06", "reason": "test"},
    {"rank": "4", "id": "C-18", "reason": "test"},
    {"rank": "5", "id": "C-03", "reason": "test"},
    {"rank": "6", "id": "C-24", "reason": "test"},
    {"rank": "7", "id": "C-08", "reason": "test"},
    {"rank": "8", "id": "C-09", "reason": "test"},
    {"rank": "9", "id": "C-16", "reason": "test"},
    {"rank": "10", "id": "C-05", "reason": "test"}
  ],
  "bottom_5": [
    {"id": "C-23", "reason": "weak"},
    {"id": "C-07", "reason": "weak"},
    {"id": "C-29", "reason": "weak"},
    {"id": "C-13", "reason": "weak"},
    {"id": "C-30", "reason": "weak"}
  ],
  "flags": [],
  "bias_pairs": [],
  "patterns": []
}
```

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Paste, validate, submit | Validation passes. Score includes position bonus for top 3 (string "1"/"2"/"3" should match via Number() coercion). Top 10 score should be 30.0 if ranks match. |

**Cleanup:** Reset team attempts in Firestore.

- [ ] PASS / FAIL: _______________

---

## PART 4: Admin Panel

**Page:** `competition.html`
**Prerequisite:** Signed in as instructor

### Test 4.1 — Admin panel visibility

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in as `mpickard@niu.edu` | Admin panel appears above leaderboard with 3 buttons: Toggle Competition Set, View All Submissions, Freeze Competition |
| 2 | Open incognito, sign in as non-instructor | Admin panel does NOT appear |

- [ ] PASS / FAIL: _______________

### Test 4.2 — Toggle competition resumes

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Verify competition resumes section is hidden | "Competition Set Not Yet Available" or section not visible |
| 2 | Click **Show Competition Set** | 30 resume cards appear. Button text changes to "Hide Competition Set". |
| 3 | Open a second browser/incognito as a student | Student also sees 30 resume cards (after refresh) |
| 4 | Click **Hide Competition Set** | Resume cards disappear. Student sees them disappear on refresh. |

- [ ] PASS / FAIL: _______________

### Test 4.3 — Freeze competition

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click **Freeze Competition** | Button turns green, text changes to "Unfreeze Competition" |
| 2 | In student browser, paste valid JSON, validate, click Submit | Alert: "Competition is closed. No more submissions are accepted." |
| 3 | Click **Unfreeze Competition** in admin | Button turns red again |
| 4 | In student browser, try submitting again | Submission succeeds |

**Cleanup:** Ensure competition is unfrozen. Reset student team attempts.

- [ ] PASS / FAIL: _______________

### Test 4.4 — View all submissions

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click **View All Submissions** | Table appears showing all teams with: Team name, Attempts used, Best score, Member emails |

- [ ] PASS / FAIL: _______________

---

## PART 5: Resume Expand/Collapse and Copy

**Pages:** `competition.html` and `lab.html`

### Test 5.1 — Competition resume toggle

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable competition resumes (admin toggle) | 30 resume cards visible |
| 2 | Click a resume header (e.g., C-12) | Resume text expands below the header |
| 3 | Click the same header again | Resume text collapses |
| 4 | Verify text starts with `[C-12]` | ID tag present at start of text |

- [ ] PASS / FAIL: _______________

### Test 5.2 — Competition resume copy

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click **Copy** on a resume card | Button text briefly changes to "Copied!" |
| 2 | Paste into a text editor | Resume text appears, starting with `[C-XX]` followed by candidate name |

- [ ] PASS / FAIL: _______________

### Test 5.3 — Lab practice resume toggle

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open `lab.html` | Practice resumes section visible |
| 2 | Click a practice resume header | Resume text expands |
| 3 | Click again | Collapses |

- [ ] PASS / FAIL: _______________

### Test 5.4 — Lab collapsible sections

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Find "Scaffold Prompt (click to expand)" | Prompt section is collapsed |
| 2 | Click the header | Scaffold prompt text appears |
| 3 | Click the **Copy** button | Prompt text copied to clipboard |

- [ ] PASS / FAIL: _______________

---

## PART 6: Competition Resume Visibility

**Page:** `competition.html`

### Test 6.1 — Default hidden state

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | In Firestore Console, set `settings/capstone_settings` > `competitionVisible` to `false` | (Prep step) |
| 2 | Open `competition.html`, sign in as student | Competition resumes section is NOT visible. Only the submission form and leaderboard are visible. |

- [ ] PASS / FAIL: _______________

### Test 6.2 — Instructor reveals, student sees

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in as instructor, click **Show Competition Set** | Resumes appear for instructor |
| 2 | In student browser, refresh the page | Student now sees all 30 competition resumes |
| 3 | Student can expand and copy individual resumes | Each resume expands with copy button |

- [ ] PASS / FAIL: _______________

---

## PART 7: Script and CSS Loading

**Pages:** All 5 HTML files

### Test 7.1 — No 404 errors on any page

For each page, open DevTools > Network tab, then load the page:

| Page | Check | Expected |
|------|-------|----------|
| `index.html` | Network tab | `../../../_shared/styles.css` loads (200). No 404s. |
| `lecture.html` | Network tab | `../../../_shared/reveal-theme-niu.css` loads. Reveal.js CDN loads. No 404s. |
| `lab.html` | Network tab | `../../../_shared/styles.css` loads. `practice-resumes.js` loads. No 404s. |
| `competition.html` | Network tab | `../../../_shared/styles.css` loads. `competition-resumes.js` loads. `../../../_shared/capstone-firebase.js` loads. 3 Firebase SDK scripts load. No 404s. |
| `rubric.html` | Network tab | `../../../_shared/styles.css` loads. No 404s. |

- [ ] PASS / FAIL (index): _______________
- [ ] PASS / FAIL (lecture): _______________
- [ ] PASS / FAIL (lab): _______________
- [ ] PASS / FAIL (competition): _______________
- [ ] PASS / FAIL (rubric): _______________

### Test 7.2 — No console errors on page load

For each page, open DevTools > Console, reload:

| Page | Expected |
|------|----------|
| `index.html` | No errors |
| `lecture.html` | No errors (Reveal.js init messages OK) |
| `lab.html` | No errors |
| `competition.html` | No errors before sign-in. Firebase init messages OK. |
| `rubric.html` | No errors |

- [ ] PASS / FAIL: _______________

---

## PART 8: Campus WiFi Stress Test

**Page:** `competition.html`
**Prerequisite:** 3 test teams with 0 attempts. On campus WiFi.

### Test 8.1 — Concurrent submissions

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open 3 browser windows (Chrome, Chrome Incognito, Firefox/Edge) | Each window is a different "team" |
| 2 | Sign into each as a different user (or same user on different teams) | Each shows different team info |
| 3 | Paste the sample JSON (from Test 3.1) in all 3 windows | All 3 show previews |
| 4 | Click **Submit** on all 3 within 5 seconds | All 3 succeed. No errors. |
| 5 | Verify leaderboard shows all 3 teams | Scores listed, sorted by score. No duplicates. |
| 6 | Check Firestore Console | Each team document has `attemptsUsed: 1` and one attempt in the array |

- [ ] PASS / FAIL: _______________

### Test 8.2 — Network interruption recovery

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Paste valid JSON, validate | Preview appears |
| 2 | Toggle WiFi off on your laptop | |
| 3 | Click **Submit** | After a delay, shows error (network timeout or similar). Button re-enables with "Submit (uses 1 attempt)" text. |
| 4 | Toggle WiFi back on | |
| 5 | Click **Submit** again | Submission succeeds. Attempt count is correct (not double-counted). |

- [ ] PASS / FAIL: _______________

---

## PART 9: Firestore Security Rules

**Prerequisite:** Rules from Part 0.1 deployed

### Test 9.1 — Student can read settings (competition visibility)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in as student (non-instructor) | No permission errors in console |
| 2 | Competition visibility check succeeds | If `competitionVisible` is true, resumes appear. If false, hidden. No "permission denied" errors. |

- [ ] PASS / FAIL: _______________

### Test 9.2 — Student cannot write to settings

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open DevTools Console as a signed-in student | |
| 2 | Run: `firebase.firestore().collection('settings').doc('capstone_settings').set({competitionVisible: true})` | Should fail with "permission denied" |

- [ ] PASS / FAIL: _______________

### Test 9.3 — Student can write to their own team

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Student submits valid JSON through the UI | Submission succeeds. Data written to their team document. |

- [ ] PASS / FAIL: _______________

### Test 9.4 — Student cannot write to another team

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open DevTools Console as a signed-in student on Team Alpha | |
| 2 | Run: `firebase.firestore().collection('capstone_teams').doc('test-team-beta').update({bestScore: 100})` | Should fail with "permission denied" |

- [ ] PASS / FAIL: _______________

---

## PART 10: Lecture Page (Reveal.js)

**Page:** `lecture.html`

### Test 10.1 — Slides render and navigate

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open `lecture.html` | First slide visible. Reveal.js UI loaded (arrows, progress bar). |
| 2 | Press right arrow or click arrow | Advances to slide 2 |
| 3 | Navigate through all slides | No broken slides. All text renders. SVG diagrams display. |
| 4 | Press Escape | Slide overview appears |
| 5 | Press Escape again | Returns to current slide |

- [ ] PASS / FAIL: _______________

### Test 10.2 — Navigation bar works

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Lab" in the nav bar | Navigates to `lab.html` |
| 2 | Click browser back | Returns to lecture |
| 3 | Click "Dashboard" | Navigates to `index.html` |

- [ ] PASS / FAIL: _______________

---

## PART 11: Lab Page End-to-End

**Page:** `lab.html`

### Test 11.1 — Practice resumes load

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open `lab.html` | 20 practice resume cards visible (P-01 through P-20) |
| 2 | Expand P-01 | Resume text appears |
| 3 | Click **Copy** on P-01 | Text copied. Button shows "Copied!" briefly. |
| 4 | Paste into text editor | Text starts with `[P-01]` and candidate name |

- [ ] PASS / FAIL: _______________

### Test 11.2 — Scaffold prompts

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Find "Scaffold Prompt (click to expand)" under Parser section | Collapsed by default |
| 2 | Click to expand | Full parser prompt appears with JSON template |
| 3 | Click **Copy** | Prompt copied to clipboard |
| 4 | Find Evaluator scaffold | Partial scaffold (output format only) |

- [ ] PASS / FAIL: _______________

### Test 11.3 — Answer key

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to Answer Key section | Collapsed by default |
| 2 | Click to expand | Table with all 20 practice resumes: ID, Name, Category (Strong/Moderate/Weak), Signals |
| 3 | Verify P-17 row | Shows "Weak" or flagged for fake institution |
| 4 | Verify P-20 row | Shows "Strong" |

- [ ] PASS / FAIL: _______________

### Test 11.4 — Navigation links

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Lecture" in nav bar | Goes to `lecture.html` |
| 2 | Click browser back | Returns to lab |
| 3 | Click "Competition" in nav bar | Goes to `competition.html` |

- [ ] PASS / FAIL: _______________

---

## PART 12: Rubric Print

**Page:** `rubric.html`

### Test 12.1 — Page renders

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open `rubric.html` | Grading rubric visible with all 5 scoring dimensions. Point values shown. |
| 2 | Verify total is 100 points | Top 10 (30) + Bottom 5 (10) + Flags (30) + Bias Pairs (15) + Patterns (15) = 100 |

- [ ] PASS / FAIL: _______________

### Test 12.2 — Print output

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click **Print Rubric** button (or Ctrl+P) | Print dialog appears |
| 2 | Select "Save as PDF" | Preview shows clean layout: no navigation bar, no colored background, tables readable. |
| 3 | Save and open PDF | All text legible. Tables not cut off. Fits on 1-2 pages. |

- [ ] PASS / FAIL: _______________

---

## Cleanup After Testing

After completing all tests, reset the test environment:

1. **Firestore Console > `capstone_teams`:**
   - Delete `test-team-alpha`, `test-team-beta`, `test-team-gamma`
   - (Or reset their `attemptsUsed` to 0, `attempts` to [], `bestScore` to null)

2. **Firestore Console > `settings/capstone_settings`:**
   - Set `competitionVisible` to `false`
   - Set `competitionFrozen` to `false`

3. **Before Day 8:** Create real team documents with actual student emails.

---

## Pre-Day 8 Checklist

After all tests pass:

- [ ] All 12 test parts pass
- [ ] Firestore security rules deployed
- [ ] Test team documents deleted
- [ ] Real team documents created (with student emails from team formation)
- [ ] `competitionVisible` set to `false`
- [ ] `competitionFrozen` set to `false`
- [ ] Site deployed to HTTPS hosting
- [ ] Tested on campus WiFi

---

## Sample "Perfect Score" JSON (for instructor verification)

This submission should score exactly **100.0**. Use it to verify the scoring engine works correctly in the live environment:

```json
{"top_10_hire":[{"rank":1,"id":"C-12","reason":"test"},{"rank":2,"id":"C-21","reason":"test"},{"rank":3,"id":"C-06","reason":"test"},{"rank":4,"id":"C-18","reason":"test"},{"rank":5,"id":"C-03","reason":"test"},{"rank":6,"id":"C-24","reason":"test"},{"rank":7,"id":"C-08","reason":"test"},{"rank":8,"id":"C-09","reason":"test"},{"rank":9,"id":"C-16","reason":"test"},{"rank":10,"id":"C-05","reason":"test"}],"bottom_5":[{"id":"C-23","reason":"test"},{"id":"C-07","reason":"test"},{"id":"C-29","reason":"test"},{"id":"C-13","reason":"test"},{"id":"C-30","reason":"test"}],"flags":[{"candidate_id":"C-14","flag":"gap unexplained break","severity":"minor"},{"candidate_id":"C-10","flag":"inflated title regional operations director","severity":"minor"},{"candidate_id":"C-15","flag":"copy identical duplicate fabricat","severity":"minor"},{"candidate_id":"C-25","flag":"copy identical duplicate fabricat","severity":"minor"},{"candidate_id":"C-02","flag":"inflated title head of customer relations","severity":"minor"},{"candidate_id":"C-27","flag":"gap unexplained break","severity":"minor"},{"candidate_id":"C-07","flag":"gap unexplained break","severity":"minor"},{"candidate_id":"C-23","flag":"contradict overlap same time both full impossible simultaneous","severity":"disqualifying"},{"candidate_id":"C-23","flag":"contradict overlap dates before start overlapping","severity":"disqualifying"},{"candidate_id":"C-29","flag":"fabricat fake grandview does not exist","severity":"disqualifying"},{"candidate_id":"C-29","flag":"fabricat fake allied consumer does not exist","severity":"disqualifying"},{"candidate_id":"C-13","flag":"fake pacific northwest business institute does not exist","severity":"disqualifying"},{"candidate_id":"C-30","flag":"fake great lakes polytechnic does not exist","severity":"disqualifying"},{"candidate_id":"C-30","flag":"contradict 5 year impossible graduated inconsistent","severity":"disqualifying"}],"bias_pairs":[{"candidate_ids":["C-04","C-22"],"observation":"similar same bias pair"},{"candidate_ids":["C-18","C-03"],"observation":"similar same bias pair"},{"candidate_ids":["C-02","C-26"],"observation":"similar same bias pair"},{"candidate_ids":["C-01","C-17"],"observation":"similar same bias pair"},{"candidate_ids":["C-09","C-16"],"observation":"similar same gender bias pair"}],"patterns":["C-08, C-19, and C-27 share northfield career center footer template","C-05, C-14, and C-07 worked at lakeside closed bankrupt same employer","C-25 and C-15 have identical copy same skills section duplicate word for word"]}
```

> **Expected score: 100.0** (Top 10: 30, Bottom 5: 10, Flags: 30, Bias Pairs: 15, Patterns: 15)
> Use this to verify the scoring engine after deployment. If the score is not exactly 100.0, there is a bug.
