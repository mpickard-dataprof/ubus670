# Plan: Practice Exam Pool (Spec 0011)

**Spec:** 0011
**Created:** 2026-03-10
**Status:** Complete

---

## Phase 1: Spec + Plan
- [x] Write `codev/specs/0011-practice-exam.md`
- [x] Write `codev/plans/0011-practice-exam.md`

## Phase 2: Select 20 Reused Questions
- [x] Write `select_reused.py` to pick 20 questions from `questions.json`
- [x] Prioritize no-image questions; assign P001-P020 IDs
- [x] Output initial `practice-questions.json`

## Phase 3: Write 80 New Questions
- [x] Day 1-2: 26 new questions (P021-P046)
- [x] Day 3-4: 22 new questions (P047-P068)
- [x] Day 5-7: 32 new questions (P069-P100)

## Phase 4: Merge, Validate, Build
- [x] Merge reused + new into `practice-questions.json`
- [x] Validate distributions (Bloom's, day, Beacon, correct answer balance)
- [x] Parameterize `build_qti.py` for practice exam
- [x] Build `practice-exam-pool.zip`
- [x] Generate `practice-matrix.md`

## Phase 5: Review
- [x] Cross-check: no duplicate stems with final exam
- [ ] Pedagogical review (human)

## Phase 6: Pool Expansion (P101-P125)
- [x] Added 25 additional questions to improve coverage
- [x] Final count: 125 questions (20 reused + 105 new)

## Phase 7: SVG & Image Refinement
- [x] Fix 5 user-reported SVGs (rag-pipeline, ai-governance-lifecycle, token-cost-calculation, context-window-visualization, single-llm-vs-multi-agent)
- [x] Size all 18 SVGs to ~50% of viewBox (width/height attributes)
- [x] Rewrite P090 from arithmetic to concept-based
- [x] Add disclaimers to 11 questions with diagram/question number mismatches (6 final, 5 practice)
- [x] Regenerate all 18 WebP images at full viewBox resolution
- [x] Deploy images to GitHub Pages (`gh-pages` branch, `/exam-images/`)
- [x] Rebuild both QTI packages (`practice-exam-pool.zip`, `final-exam-pool.zip`)
- [x] User verified images in BB Ultra after re-import

## Phase 8: Commit

---

## Reused Question Selection (20)

| P-ID | Q-ID | Day | Bloom's | Topic |
|------|------|-----|---------|-------|
| P001 | Q001 | 1 | Remember | Tokens |
| P002 | Q015 | 1 | Apply | Identify Hallucination |
| P003 | Q025 | 1 | Evaluate | Hallucination Risk Assessment |
| P004 | Q039 | 2 | Understand | Why Constraints Matter |
| P005 | Q050 | 2 | Analyze | Zero-Shot vs Few-Shot Comparison |
| P006 | Q063 | 2 | Create | Prompt Template Design |
| P007 | Q067 | 3 | Remember | Context Engineering |
| P008 | Q086 | 3 | Evaluate | RAG vs Fine-Tuning Evaluation |
| P009 | Q093 | 3 | Create | Semantic Search Design |
| P010 | Q099 | 4 | Understand | Multimodal Context Engineering |
| P011 | Q104 | 4 | Apply | Hotel Marketing Images |
| P012 | Q117 | 4 | Create | Cosmetics Brand Marketing |
| P013 | Q133 | 5 | Apply | Marketing Taglines |
| P014 | Q138 | 5 | Analyze | Hotel AI Concierge |
| P015 | Q142 | 5 | Evaluate | E-commerce AI Config |
| P016 | Q151 | 6 | Remember | Red Teaming Definition |
| P017 | Q160 | 6 | Apply | Beacon Chatbot Deployment |
| P018 | Q165 | 6 | Analyze | Real-World AI Failures |
| P019 | Q181 | 7 | Understand | Single-LLM to Multi-Agent |
| P020 | Q199 | 7 | Create | Agent Governance Framework |

## New Question Distribution (80)

| Day | Rem | Und | App | Ana | Eva | Cre | Total |
|-----|-----|-----|-----|-----|-----|-----|-------|
| 1 | 3 | 3 | 1 | 2 | 2 | 2 | 13 |
| 2 | 2 | 2 | 2 | 2 | 2 | 3 | 13 |
| 3 | 2 | 2 | 2 | 2 | 2 | 2 | 12 |
| 4 | 2 | 1 | 2 | 2 | 2 | 1 | 10 |
| 5 | 2 | 2 | 2 | 2 | 2 | 2 | 12 |
| 6 | 1 | 2 | 2 | 2 | 2 | 2 | 11 |
| 7 | 2 | 2 | 2 | 1 | 1 | 1 | 9 |
| **Tot** | **14** | **14** | **13** | **13** | **13** | **13** | **80** |

---

*End of Plan*
