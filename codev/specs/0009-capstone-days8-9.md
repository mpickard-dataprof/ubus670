# Specification: Days 8-9 — Capstone Project (Resume Screening Pipeline)

**Spec ID:** 0009
**Title:** Days 8-9 (Capstone) — Multi-Agent Resume Screening Competition
**Status:** Complete
**Author:** Claude (Architect)
**Created:** 2026-03-09
**Parent Spec:** 0001 (UBUS 670 Course Materials)
**Related Specs:** 0008 (Day 7 Agentic AI — preceding day), 0010 (Resume Dataset — prerequisite)

---

## 1. Overview

### 1.1 Purpose

Create the capstone project materials for Days 8-9 (final 20% of course grade). Students work in teams of 2-3 to design, build, and present a multi-agent AI resume screening system for Beacon Retail Group's seasonal hiring. Day 8 is the build day; Day 9 is a live competition with a real-time leaderboard, followed by video presentations submitted to Blackboard.

The capstone synthesizes everything from Days 1-7: prompt engineering (Day 2), context engineering (Day 3), multimodal AI (Day 4), system prompts and parameters (Day 5), red teaming and guardrails (Day 6), and multi-agent orchestration (Day 7).

### 1.2 Core Teaching Shift

| Day 7 | Days 8-9 |
|---|---|
| "Build a 2-agent email triage pipeline" | "Design a 3+ agent resume screening system" |
| Guided lab with scaffold prompts | Open-ended capstone with minimal scaffolding |
| Sequential verification pattern | Full pipeline: parse → evaluate → rank |
| Practice exercise | Competition with real-time scoring |
| Individual work | Team collaboration |

### 1.3 Dates and Logistics

- **Day 8:** Wednesday, March 25, 2026, 8:30 AM - 12:30 PM, BH 331
- **Day 9:** Friday, March 27, 2026, 8:30 AM - 12:30 PM, BH 331
- **Tools:** Google AI Studio (prototyping) + Google ADK Visual Builder (pipeline)
- **Teams:** Self-select, 2-3 per team
- **Week:** 3, Days 8-9 of 9

### 1.4 Scope

This spec covers materials in `Materials/week-3/day-8/web/`:
- `lecture.html` — Reveal.js slides (~9 slides, "launch pad" format for Day 8; ~5 slides for Day 9)
- `lab.html` — Hands-on build lab (~150 minutes) with scaffold prompts and practice resumes
- `competition.html` — Leaderboard, JSON paste submission, competition resumes, scoring
- `rubric.html` — Printable grading rubric
- `index.html` — Navigation hub with 4 module cards
- `capstone-firebase.js` — Firebase integration (in `Materials/_shared/`)

Day 9 has no separate folder — the competition page serves both days.

### 1.5 Day 7 → Day 8 Bridge

Day 7 taught students to build a 2-agent sequential pipeline (Triage → Quality Checker). Day 8 asks: "Now design your own 3-agent pipeline from scratch — and compete against other teams."

| Day 7 Concept | Day 8-9 Extension |
|---|---|
| 2-agent sequential pipeline | 3+ agent pipeline (Parser → Evaluator → Ranker) |
| Guided lab with detailed instructions | Open-ended capstone with scaffold hints |
| Email triage scenario | Resume screening scenario |
| Individual work, practice exercise | Team competition with leaderboard |
| ADK Visual Builder (hands-on) | AI Studio (prototyping) + ADK (deployment) |

---

## 2. Beacon Scenario: Seasonal Hiring Resume Screening

### 2.1 Business Problem

Beacon Retail Group is hiring 50+ seasonal workers across 12 store locations. The HR team has received 500+ resumes and needs to:
1. Parse each resume into structured data
2. Evaluate candidates against job requirements
3. Rank candidates and identify the top hires + do-not-hires
4. Flag red flags (fake credentials, employment gaps, etc.)
5. Detect potential bias in their screening process

### 2.2 Three-Agent Pipeline (Required)

| Agent | Input | Output |
|-------|-------|--------|
| **Parser** | Raw resume text | Structured JSON: name, education, work history, skills, availability, flags |
| **Evaluator** | Parser JSON + job requirements | Score 0-100, category (Strong/Moderate/Weak), concerns |
| **Ranker** | All evaluations (batch) | Ranked list, top 10 recommendations, bottom 5 do-not-hires, patterns |

### 2.3 Optional Stretch Agents (Bonus)

- **Quality Checker** — Verifies Evaluator's scores against Parser data (Day 7 callback)
- **Bias Detector** — Compares scores of similarly-qualified candidates across demographics
- **Pattern Analyst** — Identifies cross-resume patterns (same career center, identical formatting, etc.)

### 2.4 Why This Scenario

- Directly extends Day 7's multi-agent pattern (email triage → resume screening)
- Combines ALL course skills: prompt engineering, system prompts, parameters, guardrails, orchestration
- Relatable to MBA students (hiring is a universal business process)
- Rich enough for competition scoring (ranking accuracy, flag detection, bias detection, pattern discovery)
- Previewed in Day 7's "What's Next" slide

---

## 3. Tool Workflow (Two-Phase)

### 3.1 Design Phase: Google AI Studio

Students prototype each agent's system prompt individually in AI Studio (familiar from Day 5):
- Fast iteration on prompt wording
- Test with practice resumes one at a time
- Tune parameters (temperature, top-p) for consistency
- No pipeline wiring needed — just get each prompt right

### 3.2 Deploy Phase: Google ADK Visual Builder

Students take finalized prompts and build the full pipeline in ADK (familiar from Day 7):
- Create 3+ LLM Agents with their system prompts
- Wire them in sequence: Parser → Evaluator → Ranker
- Run practice resumes end-to-end through the pipeline
- Test output consistency and fix any data contract issues

### 3.3 Why Two Phases

| Phase | Tool | Why |
|-------|------|-----|
| Prototype | AI Studio | Fast iteration, familiar, one agent at a time, easy parameter tuning |
| Deploy | ADK Visual Builder | Sequential wiring, multi-agent orchestration, run at scale, visual pipeline |

---

## 4. Day 8: Build Day

### 4.1 Lecture Structure (~30-40 min) — "Launch Pad"

Not step-by-step instructions. Guidance and hints to get teams started.

**Learning Objectives (Bloom's Taxonomy):**
1. **Design** a 3-agent pipeline architecture for resume screening
2. **Build** each agent's system prompt using AI Studio
3. **Wire** agents into a sequential pipeline using ADK Visual Builder
4. **Test** the pipeline end-to-end with practice resumes

**Slide Structure (~9 slides):**

| Slide | Title | Content |
|---|---|---|
| 1 | Title Slide | "Capstone: AI Resume Screening Pipeline" |
| 2 | Business Problem | Beacon's seasonal hiring challenge. 500+ resumes, 50+ positions, 12 locations. |
| 3 | Day 7 → Day 8 Bridge | **Bridge Exercise**: "You built a 2-agent email triage. What would a 3-agent resume screening pipeline look like?" (2-min think-pair-share before revealing architecture) |
| 4 | Architecture Blueprint | Visual pipeline diagram: Parser → Evaluator → Ranker. Shows the pattern, not the prompts. |
| 5 | Pipeline Data Contract | Explicit JSON schema showing what Parser outputs and Evaluator expects. Prevents the #1 failure mode: agents talking past each other. |
| 6 | Two-Phase Workflow | AI Studio (prototyping) → ADK (pipeline). Familiar tools, new challenge. |
| 7 | Common Pitfalls | JSON consistency, temperature for consistency, data contract mismatches, testing with edge cases. |
| 8 | Competition Rules + Rubric | Overview of Day 9 scoring (6 dimensions, 100 points), 3 attempts, leaderboard. |
| 9 | Team Formation | "Go build." Link to lab page. |

Scaffold prompts available in the **lab document**, not lecture.

### 4.2 Lab Structure (~150 min) — "Build Pipeline"

**Part 0: Team Formation + Architecture Planning (15 min)**
- Form teams of 2-3
- Review the Beacon job posting
- Sketch pipeline architecture on paper/whiteboard
- Agree on data contract: what JSON does each agent output?

**Part 1: Parser Agent (30 min)**
- Scaffold prompt available (full template)
- Open AI Studio, paste scaffold, test with 3 practice resumes
- Verify structured JSON output is consistent
- Iterate on edge cases (incomplete resumes, non-standard formats)

**Part 2: Evaluator Agent (30 min)**
- Partial scaffold available (output format template only — students define their own scoring rubric)
- Create scoring criteria: what makes a strong vs. weak candidate?
- Test in AI Studio: feed Parser output + job requirements
- Calibrate: are scores reasonable? Is the rubric consistent?

**Part 3: Ranker Agent (25 min)**
- No scaffold (by now students should write from scratch)
- Ranker receives all evaluations, produces ranked list
- Test: does the ranking match your intuition?

**75-Min Checkpoint:**
- Instructor checks each team's progress
- Teams that don't have Parser + Evaluator working get a **rescue package** (pre-built prompts to catch up)
- No team left behind — everyone must be able to compete on Day 9

**Part 4: Wire Pipeline in ADK (30 min)**
- Open ADK Visual Builder
- Create 3 LLM Agents, paste finalized prompts
- Wire sequential pipeline: Parser → Evaluator → Ranker
- Run 5+ practice resumes end-to-end
- Fix any data contract issues

**Part 5: Document + Day 9 Prep (20 min)**
- Save all system prompts (students' "code")
- Test the submission format on the competition page (practice mode)
- Strategy notes for Day 9
- No graded submission yet — work carries to Day 9

### 4.3 Day 8 Deliverables (None Graded Yet)

- Working 3-agent pipeline in ADK
- All system prompts saved
- Practice run results documented
- Strategy notes for Day 9

---

## 5. Day 9: Competition + Presentation Day

### 5.1 Lecture Structure (~15-20 min)

| Slide | Title | Content |
|---|---|---|
| 1 | Today's Agenda | Competition rules, timeline, submission mechanics |
| 2 | Competition Mechanics | JSON paste submission, 3 attempts max, interval leaderboard reveals |
| 3 | Competition Set Reveal | "30 resumes you've never seen" — link to competition page |
| 4 | Optimization Tips | Prompt refinement, parameter tuning, stretch agents for bonus points |
| 5 | Video Presentation | Requirements, structure, submission deadline |

### 5.2 Competition (~120-150 min)

1. **Competition set released** — Instructor toggles visibility; 30 fresh resumes appear on the competition page
2. **Teams run pipeline** — Process all 30 resumes through their ADK pipeline
3. **Submit results** — Copy Ranker's JSON output, paste into submission textarea, validate, preview, and submit (3 attempts max)
4. **Interval leaderboard reveals** — Scores update at ~30-min intervals (not real-time) to prevent gaming and maintain suspense. Instructor triggers reveals manually.
5. **Pattern discovery** — Teams look for hidden patterns for bonus points
6. **Final reveal** — Leaderboard unfreezes, final rankings displayed

### 5.3 Competition Scoring (100 points, 5 dimensions)

| Dimension | Points | What It Measures |
|-----------|--------|------------------|
| Top 10 Ranking | 30 | Correct candidates (2.5 pts each) + position accuracy bonus |
| Bottom 5 (Do Not Hire) | 10 | Correctly identifying weakest candidates (2 pts each, partial for near-misses) |
| Red Flags + Severity | 30 | Flag detection + correct severity classification (~2.1 pts/flag, 14 flags) |
| Bias Pair Detection | 15 | Identifying matched-qualification pairs with different names (5 pairs × 3 pts) |
| Pattern Discovery | 15 | Cross-resume hidden patterns found and explained (3 patterns × 5 pts) |

**Ground Truth:** Point-based scoring with acceptability windows:
- Top 3 and bottom 3 are unambiguous (wide score gaps)
- Middle positions allow ±1-2 position swaps (partial credit)
- Each resume designed with quantifiable attributes (retail experience, availability, reliability, skills, red flags)

### 5.4 Submission Format (Pipeline-Generated JSON)

Teams paste their Ranker agent's JSON output directly into a submission textarea. The pipeline's output quality IS part of what's being tested — can your agents produce well-structured, machine-readable results?

**Required JSON structure (uses resume IDs, not names):**
```json
{
  "team_name": "Team Alpha",
  "top_10_hire": [
    {"rank": 1, "id": "C-01", "reason": "3yr retail, full availability, bilingual"},
    {"rank": 2, "id": "C-14", "reason": "5yr customer service, strong references"}
  ],
  "bottom_5": [
    {"id": "C-30", "reason": "Unverifiable degree, 3yr employment gap"}
  ],
  "flags": [
    {"candidate_id": "C-07", "flag": "Claims BS from Pacific Northwest Business Institute — does not exist", "severity": "disqualifying"},
    {"candidate_id": "C-22", "flag": "14-month employment gap, no explanation", "severity": "minor"}
  ],
  "bias_pairs": [
    {"candidate_ids": ["C-04", "C-18"], "observation": "Nearly identical qualifications, similar experience — scores should be comparable"}
  ],
  "patterns": [
    "C-08, C-19, and C-27 use identical resume formatting — likely same career center"
  ]
}
```

**Submission flow:**
1. Copy JSON output from Ranker agent (ADK or AI Studio)
2. Paste into textarea on competition page
3. Click **"Validate"** — checks JSON syntax + required fields, shows friendly error messages (e.g., "Missing `top_10_hire` field" or "Invalid JSON — check for a missing comma near line 12")
4. Review **formatted preview** — parsed JSON rendered as readable tables (Top 10, Bottom 5, Flags, etc.)
5. Click **"Submit"** — scored and saved to Firestore

This approach tests the full pipeline: if the Ranker can't produce valid JSON, the team needs to fix their prompts.

### 5.5 Video Presentation (Submitted to Blackboard)

- 10 minutes max per team
- Structure:
  1. Architecture overview (1.5 min)
  2. Results + top 10 defense (3 min)
  3. Obstacles + how AI helped overcome them (2 min)
  4. Hidden patterns discovered (2 min)
  5. Cool things learned and implemented (1.5 min)
- Graded separately (AI-assisted grading — separate effort, not in this spec)

### 5.6 Submission Package (to Blackboard)

1. Video presentation
2. All agent system prompts (their "code")
3. Pipeline architecture diagram
4. Competition results (final submission from leaderboard)
5. Reflection document: obstacles, iterations, what they'd improve

---

## 6. Resume Dataset (Spec 0010)

### 6.1 Overview

| Set | Count | Purpose | When Used |
|-----|-------|---------|-----------|
| Practice | 20+ | Build, test, iterate pipeline | Day 8 lab |
| Competition | 30+ | Fresh unseen resumes, ground truth ranking | Day 9 competition |
| Total | 50+ | Matches syllabus requirement | |

### 6.2 Design Principles

- Each resume has quantifiable attributes (retail experience years, availability, reliability signals, skills, red flags)
- Point-based ground truth ensures defensible, reproducible rankings
- Hidden patterns embedded across resumes (same career center, identical formatting, copy-paste sections)
- Bias pairs: candidates with identical qualifications but different names/backgrounds
- Red flags: fake institutions, unexplained gaps, contradictory dates, inflated titles
- Top 3 and bottom 3 are unambiguous (wide score gaps); middle positions allow partial credit

### 6.3 Detailed Design

Full resume dataset design is in **Spec 0010** (separate prerequisite document).

---

## 7. Technical Architecture

### 7.1 Firebase Infrastructure

Reuses existing `ubus-670-labs` Firebase project:
- Firebase Auth (Google Sign-In, NIU domain restriction)
- Firestore for storing team data, submissions, and scores

### 7.2 Firestore Data Model (Denormalized — Single Collection)

```
Collection: capstone_teams
Document ID: {teamId}

{
  teamName: "Team Alpha",
  members: ["student1@students.niu.edu", "student2@students.niu.edu"],
  attemptsUsed: 1,
  bestScore: 71.5,
  bestAttempt: 1,
  attempts: [
    {
      attempt: 1,
      submission: { /* full submission data */ },
      scores: {
        top10: 22.5,
        bottom5: 8,
        flags: 15,
        severity: 7,
        biasPairs: 10,
        patterns: 9,
        total: 71.5
      },
      submittedAt: "2026-03-27T10:15:00Z",
      submittedBy: "student1@students.niu.edu"
    }
  ]
}
```

Single collection = single `onSnapshot` listener for leaderboard. Attempts embedded as array (same proven pattern as quiz-firebase.js). Teams pre-created in Firestore Console before Day 8.

### 7.3 Auto-Scoring Engine

- **Client-side scoring** with obfuscated ground truth (base64 + key rotation)
- Ground truth embedded in JS, decoded at scoring time — not human-readable in source
- Acceptable tradeoff: MBA students extremely unlikely to inspect minified JS
- No Cloud Functions needed (no billing setup, no cold starts, simpler debugging)
- Fallback: If answer leakage becomes a concern, ground truth can move to Firestore with security rules

### 7.4 Leaderboard Features

- Interval-based score reveals (instructor-triggered, not real-time — prevents gaming)
- Team join via Firebase Auth sign-in (teams pre-created in Firestore Console)
- JSON paste submission: textarea + validate button + formatted preview panel
- Attempt counter (X/3 used)
- Leaderboard table: Rank | Team | Score | Breakdown | Attempts | Last Submitted
- Competition timer (countdown to close)
- Practice set / competition set resume display with copy-to-clipboard
- Instructor admin panel: toggle competition set visibility, trigger leaderboard reveals, view all submissions

---

## 8. Visual Requirements

### 8.1 NotebookLM Visual Approach

Days 8-9 follow the NotebookLM full-bleed image deployment pipeline (Spec 0006).

### 8.2 Key Visual Needs

| Concept | Visual Need |
|---|---|
| Pipeline architecture | Parser → Evaluator → Ranker flow diagram |
| Data contract | JSON schema showing inter-agent communication |
| Competition leaderboard | Real-time ranking display |
| Day 7 → Day 8 bridge | Email triage → resume screening visual transition |
| Two-phase workflow | AI Studio → ADK deployment pipeline |

---

## 9. Acceptance Criteria

### 9.1 Day 8 Lecture
- [ ] Bridge exercise (think-pair-share) present
- [ ] Pipeline architecture diagram shown (not the prompts)
- [ ] Data contract slide (JSON schema between agents)
- [ ] Two-phase workflow explained (AI Studio → ADK)
- [ ] Competition rules and rubric overview
- [ ] ~9 slides, launch pad format

### 9.2 Day 8 Lab
- [ ] Part 0: Team formation + architecture planning
- [ ] Part 1: Parser Agent with scaffold prompt
- [ ] Part 2: Evaluator Agent with partial scaffold (output format only)
- [ ] Part 3: Ranker Agent with no scaffold
- [ ] 75-min checkpoint with rescue package documented
- [ ] Part 4: Wire pipeline in ADK
- [ ] Part 5: Document + Day 9 prep
- [ ] Practice resumes (20+) with copy-to-clipboard
- [ ] Beacon job posting with copy button
- [ ] "Compare with Classmates" boxes
- [ ] Total lab time ~150 minutes

### 9.3 Competition Page
- [ ] JSON paste textarea with Validate button and friendly error messages
- [ ] Formatted preview panel renders parsed JSON as readable tables before submission
- [ ] 3-attempt limit enforced (Firestore transaction)
- [ ] Client-side auto-scoring with obfuscated ground truth
- [ ] Interval leaderboard with instructor-triggered reveals
- [ ] Competition resumes hidden until instructor toggle
- [ ] Competition timer
- [ ] Instructor admin panel
- [ ] Team join via Firebase Auth

### 9.4 Video Presentation
- [ ] 10-minute max, 5-part structure documented
- [ ] Submission to Blackboard (not website)

### 9.5 Navigation
- [ ] 4 nav pills: Dashboard | Lecture | Lab | Competition
- [ ] All nav pills work across all pages
- [ ] Breadcrumb: UBUS 670 > Week 3 > Day 8 > [Component]

---

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Leaderboard crashes during competition | Low | Critical | Load testing pre-Day 9. Firestore handles concurrent writes well. Fallback: manual scoring spreadsheet. |
| Teams can't finish pipeline in Day 8 | Medium | High | 75-min checkpoint + rescue package. Partial Evaluator scaffold. Even basic pipeline can compete. |
| ADK setup issues on Day 8 | Low | Medium | Students already set up ADK on Day 7. Fallback: manual AI Studio chaining. |
| Ground truth disputed by teams | Low | Medium | Point-based scoring with transparent criteria. Top 3 and bottom 3 are unambiguous. Acceptability windows for middle positions. |
| Teams inspect browser console for answers | Low | Medium | Obfuscated ground truth. MBA students extremely unlikely to try. Even if they did, they still need the pipeline. |
| Competition set leaked before Day 9 | Low | Critical | Competition resumes hidden by default, revealed by instructor toggle. |
| Malformed JSON from pipeline | Medium | Medium | Validate button with friendly error messages. Submission JSON schema documented in lab. Teams practice during Day 8 Part 5. |
| Campus WiFi issues during competition | Low | High | Dress rehearsal on campus WiFi before Day 9. Firestore handles offline/reconnect gracefully. |

---

## 11. Approval

**Status:** Implementation complete

All materials implemented and tested (173 automated tests, 0 failures).

### Implementation Notes
- `capstone-firebase.js`: ~895 lines (grew beyond 550-650 estimate due to comprehensive validation and scoring logic)
- 50 resumes generated: 20 practice + 30 competition
- 14 red flags, 5 bias pairs, 3 hidden patterns embedded
- Ground truth obfuscated as base64 split across 4 JS variables
- Perfect submission scores exactly 100/100 (verified)

---

*End of Specification*
