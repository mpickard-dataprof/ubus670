# Project Status: UBUS 670 Materials

**Last Updated:** Thursday, March 12, 2026
**Current Focus:** Exam pools complete (Specs 0010+0011). Days 6-7 content next.

---

## Progress Overview

| Day | Week | Topic | Tool | Status |
|-----|------|-------|------|--------|
| 1 | W1/D1 | What is Generative AI? | Gemini Chat | COMPLETE (committed 2026-02-06) |
| 2 | W1/D2 | Prompt Engineering | Gemini Chat | COMPLETE (committed 2026-02-10) |
| 3 | W1/D3 | Context Engineering | Gemini + Gems | COMPLETE - Reworked (Spec 0002, committed 2026-02-11) |
| 4 | W2/D4 | Multimodal AI | Gemini Multimodal + Nano Banana | COMPLETE (Spec 0004, committed 2026-02-18) |
| 5 | W2/D5 | Google AI Studio | AI Studio | COMPLETE (Spec 0005, committed 2026-02-18) |
| 6 | W2/D6 | Red Teaming & AI Safety | AI Studio | SPEC DRAFTED (Spec 0007), NOT IMPLEMENTED |
| 7 | W3/D7 | Introduction to Agentic AI | TBD | SPEC DRAFTED (Spec 0008), NOT IMPLEMENTED |
| 8 | W3/D8 | Capstone Build | Firebase + AI Studio | CODE COMPLETE (Spec 0009, 177 tests) |
| 9 | W3/D9 | Capstone Evaluate | Firebase + AI Studio | CODE COMPLETE (Spec 0009, 177 tests) |

**Class Dates:** Mon 3/9, Wed 3/11, Fri 3/13, Mon 3/16, Wed 3/18, Fri 3/20, Mon 3/23, Wed 3/25, Fri 3/27

---

## Exam Pools

| Pool | Questions | Images | Status |
|------|-----------|--------|--------|
| Final Exam | 199 MC (Days 1-7) | 18 SVG/WebP diagrams | QTI built, imported to BB Ultra |
| Practice Exam | 125 MC (Days 1-7) | Same 18 diagrams | QTI built, imported to BB Ultra |

**Image pipeline:** SVG source → cairosvg → PNG → Pillow → WebP@q85 → GitHub Pages (`gh-pages` branch, `/exam-images/`)

**Key files:**
- `Materials/Final-Exam/questions.json` — 199 final exam questions (source of truth)
- `Materials/Final-Exam/practice-questions.json` — 125 practice questions (source of truth)
- `Materials/Final-Exam/final-exam-pool.zip` — QTI 2.1 for BB Ultra
- `Materials/Final-Exam/practice-exam-pool.zip` — QTI 2.1 for BB Ultra
- `Materials/Final-Exam/images/*.svg` — 18 SVG diagram sources
- `Materials/Final-Exam/images/*.webp` — 18 WebP renders for BB Ultra
- `Materials/Final-Exam/build_qti.py` — QTI package builder
- `Materials/Final-Exam/practice-matrix.md` — Practice pool inventory
- `Materials/Final-Exam/mc-evaluation-rubric.md` — 15-dimension MC quality rubric

---

## Codev Project Tracking

| ID | Title | Status | Notes |
|----|-------|--------|-------|
| 0001 | UBUS 670 Course Materials (master) | implementing | Days 1-5 complete, Days 6-7 remaining content. Days 8-9 + exams code complete. |
| 0002 | Day 3 Context Engineering Rework | committed | Rework complete, committed 2026-02-11 |
| 0003 | AI Image Generation (Nano Banana) | implementing | Tool at `_tools/generate_image.py`. Days 1-3 images done. |
| 0004 | Day 4 Multimodal AI Rework | committed | Implemented and committed 2026-02-18 |
| 0005 | Day 5 Google AI Studio | committed | Implemented and committed 2026-02-18 |
| 0006 | NotebookLM Integration | implementing | Proven across Days 1-5. Days 6-7 remaining. |
| 0007 | Day 6 Red Teaming & AI Safety | conceived | Spec drafted 2026-02-19. Not implemented. |
| 0008 | Day 7 Introduction to Agentic AI | conceived | Spec drafted 2026-02-19. Not implemented. |
| 0009 | Days 8-9 Capstone Competition | committed | Code complete, 177 tests. Firebase team setup pending BB sign-ups. |
| 0010 | Final Exam Question Pool | implemented | 199 questions, 18 images, QTI built and imported to BB Ultra. |
| 0011 | Practice Exam Pool | implemented | 125 questions (expanded from 100), QTI built and imported to BB Ultra. |

**Next available project number:** 0012

---

## Immediate Next Actions

### 1. Implement Day 6 (Spec 0007) — Red Teaming & AI Safety
- Red-team the email triage system built in Day 5
- Five-layer defense model, four attack categories
- Spec at `codev/specs/0007-day6-red-teaming.md`

### 2. Implement Day 7 (Spec 0008) — Agentic AI
- From single AI to AI teams
- Orchestration patterns, perception-reasoning-action loop
- Spec at `codev/specs/0008-day7-agentic-ai.md`

### 3. Capstone Team Setup (before Day 8 — March 25)
- Create Firestore `settings/capstone_settings` document
- Create `capstone_teams` documents with real student emails from BB sign-ups
- See: `Materials/week-3/day-8/tests/MANUAL_TEST_PLAN.md` Parts 0.2 and 0.3

---

## Architecture & Workflow

### Tech Stack
- **Slides:** Reveal.js HTML presentations with NotebookLM full-bleed images
- **Diagrams:** Custom SVGs with NIU brand colors
- **Images:** Nano Banana API (`gemini-2.5-flash-image`) for lab assets; NotebookLM for lecture slides
- **AI ecosystem:** Gemini-focused (NOT ChatGPT), Gemini 2.5
- **Exam images:** GitHub Pages absolute URLs (`mpickard-dataprof.github.io/ubus670/exam-images/`)
- **Project management:** Codev workflow (specs, plans, reviews, lessons learned)

### Quality Standards
- SVG: 12-14px labels, rounded rects, drop shadows, NIU colors
- Quiz: 20+ questions, 2 variants per topic, 70%+ passing, formative feedback
- Lab: PDF download + LMS upload, Tool Setup section, "Compare with Classmates" boxes
- Exam: MC evaluation rubric (15 dimensions), Bloom's-honest, answer length balanced
- Git: NEVER use `git add -A` or `git add .`

### NIU Brand Colors
- Red: #C8102E
- Navy: #1D428A
- Teal: #00968F
- Orange: #E35205
- Green: #43B02A
- Fonts: Montserrat (headings), Georgia (body), Fira Code (code)

---

## Key File Locations

- **Course materials:** `Materials/week-X/day-Y/web/`
- **Exam materials:** `Materials/Final-Exam/`
- **Generator system:** `Materials/_generator_system/`
- **Image generation tool:** `Materials/_tools/generate_image.py`
- **Specs:** `codev/specs/`
- **Plans:** `codev/plans/`
- **Lessons learned:** `codev/lessons/0001-course-materials.md`
- **Project list:** `codev/projectlist.md`

---
