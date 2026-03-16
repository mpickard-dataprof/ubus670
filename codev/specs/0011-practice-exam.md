# Specification: Practice Exam Pool

**Spec ID:** 0011
**Title:** Practice Exam — 100 MC Questions for BB Ultra
**Status:** Implemented
**Author:** Claude (Architect)
**Created:** 2026-03-10
**Parent Spec:** 0010 (Final Exam Question Pool)

---

## 1. Overview

### 1.1 Purpose

Create a practice exam pool that mirrors the final exam's structure so students can self-assess before the real exam. Initially targeted 100 questions (80 new + 20 reused); expanded to **125 questions** during implementation to improve coverage depth across all 7 days and Bloom's levels.

### 1.2 Design Philosophy

| Design Choice | Rationale |
|---|---|
| 125-question pool (all drawn) | Every student gets the same practice set for fair self-assessment |
| 80 new / 20 reused | Mirrors final structure without giving away the exam |
| Same Bloom's distribution | Students practice at every cognitive level |
| Same image set | Consistent visual language; no new images needed |
| QTI 2.1 import | Same BB Ultra workflow as the final exam |

### 1.3 Scope

| File | Purpose |
|---|---|
| `Materials/Final-Exam/practice-questions.json` | 125 questions as structured data (source of truth) |
| `Materials/Final-Exam/practice-exam-pool.zip` | QTI 2.1 package for BB Ultra |
| `Materials/Final-Exam/practice-matrix.md` | Human-readable inventory |

### 1.4 Content Coverage

Same as the final exam — Days 1-7 only. Days 8-9 (Capstone) excluded.

---

## 2. Question Distribution

### 2.1 Bloom's Taxonomy

| Bloom's Level | Total (100) | Reused (20) | New (80) |
|---|---|---|---|
| Remember | 17 | 3 | 14 |
| Understand | 17 | 3 | 14 |
| Apply | 17 | 4 | 13 |
| Analyze | 16 | 3 | 13 |
| Evaluate | 16 | 3 | 13 |
| Create | 17 | 4 | 13 |
| **Total** | **100** | **20** | **80** |

### 2.2 Day Distribution

| Day | Total | Reused | New |
|---|---|---|---|
| 1 | 16 | 3 | 13 |
| 2 | 16 | 3 | 13 |
| 3 | 15 | 3 | 12 |
| 4 | 13 | 3 | 10 |
| 5 | 15 | 3 | 12 |
| 6 | 14 | 3 | 11 |
| 7 | 11 | 2 | 9 |

### 2.3 ID Scheme

- Reused questions: P001-P020 (mapped from original Q-IDs)
- New questions: P021-P100

---

## 3. Question Design Standards

Same as Spec 0010 Section 3 — clear stems, plausible distractors, no trick questions, no "all/none of the above."

New questions must:
- Cover the same topics/concepts as the final exam
- Use different scenarios, angles, and phrasing
- NOT duplicate any final exam question stem or options
- Reference existing images where appropriate

---

## 4. Technical Delivery

### 4.1 QTI 2.1 Package

Same structure as `final-exam-pool.zip` but with P-prefixed item IDs. Uses the shared `images/` directory.

### 4.2 BB Ultra Settings (Instructor-Controlled)

- Attempts: 3
- Timer: none
- All 100 questions drawn (no randomization needed)

---

## 5. Acceptance Criteria

- [x] 125 questions in `practice-questions.json` (expanded from initial 100 target)
- [x] 20 reused from final pool with new P-IDs
- [x] 105 new questions covering same concepts from different angles
- [x] No duplicate stems between practice and final pools
- [x] Bloom's and day distributions balanced
- [x] `practice-exam-pool.zip` imports into BB Ultra
- [x] `practice-matrix.md` generated
- [x] 18 SVG diagrams refined (arrowheads, overlaps, sizing) and deployed to GitHub Pages
- [x] WebP images regenerated at full viewBox resolution for BB Ultra display
- [x] Disclaimer text added to questions where diagram numbers differ from question numbers
- [x] P090 rewritten from arithmetic to concept-based (token economics understanding)

---

*End of Specification*
