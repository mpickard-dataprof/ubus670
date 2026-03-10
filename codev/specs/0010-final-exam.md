# Specification: Final Exam — Days 1-7 Question Pool

**Spec ID:** 0010
**Title:** Final Exam Question Pool (Days 1-7) — 200 MC Questions for Blackboard Ultra
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-03-09
**Parent Spec:** 0001 (UBUS 670 Course Materials)
**Related Specs:** 0002-0008 (Days 1-7 content)

---

## 1. Overview

### 1.1 Purpose

Create a comprehensive final exam question pool of 200 multiple-choice questions covering all Day 1-7 course material. The pool will be imported into Blackboard Ultra as a question bank, from which 50 questions are randomly drawn per student. The exam is take-home, open-book, with a 120-minute time limit.

### 1.2 Exam Design Philosophy

| Design Choice | Rationale |
|---|---|
| 200-question pool, 50 drawn randomly | Reduces cheating; each student gets a unique exam |
| Open-book, timed (120 min) | Tests understanding and application, not memorization |
| Equal Bloom's taxonomy distribution | Assesses all cognitive levels, from recall to creation |
| 40% Beacon / 60% new scenarios | Tests both applied knowledge and transfer of learning |
| QTI 2.1 import | Automated bulk upload to BB Ultra with embedded images |

### 1.3 Scope

This spec covers **8 deliverables** in `Materials/Final-Exam/`:

| File | Purpose |
|---|---|
| `questions.json` | 200 questions as structured data (source of truth) |
| `images/*.webp` | ~20-30 educational diagrams/charts for visual questions |
| `build_qti.py` | Python script to assemble QTI 2.1 ZIP package |
| `final-exam-pool.zip` | Ready-to-import BB Ultra QTI 2.1 package |
| `IMPORT_GUIDE.md` | Step-by-step BB Ultra import instructions |
| `question-matrix.md` | Human-readable inventory (Day x Bloom's) |

Plus codev documents:

| File | Purpose |
|---|---|
| `codev/specs/0010-final-exam.md` | This specification |
| `codev/plans/0010-final-exam.md` | Implementation plan |

### 1.4 Content Coverage (Days 1-7 Only)

Days 8-9 (Capstone Project) are excluded. The exam covers:

- **Day 1:** What is Generative AI — tokens, embeddings, context windows, temperature, hallucinations, AI limitations
- **Day 2:** Prompt Engineering — RCTFC framework, zero/few-shot, chain-of-thought, prompt injection, iteration
- **Day 3:** Context Engineering — structured formats (Markdown/JSON/XML), RAG vs fine-tuning, Gemini Gems, semantic search
- **Day 4:** Multimodal AI — image/audio/video understanding, image generation, real-world business cases, multimodal context engineering
- **Day 5:** Google AI Studio — model parameters (temperature, top-p, top-k, max tokens), system prompts, token economics
- **Day 6:** Red Teaming & AI Safety — attack categories, real-world case studies, 5-layer defense model, system prompt hardening
- **Day 7:** Agentic AI — perception-reasoning-action, orchestration patterns (sequential/parallel/loop), agent governance

---

## 2. Exam Structure

### 2.1 Format

- **Question type:** Multiple choice, 4 options (A-D)
- **Pool size:** 200 questions
- **Per-student draw:** 50 questions (random)
- **Time limit:** 120 minutes
- **Administration:** Take-home via Blackboard Ultra
- **Open-book:** Students may reference notes, lectures, and labs
- **Point value:** 1 point per question (50 points total per student)

### 2.2 Bloom's Taxonomy Distribution

Each of the 6 Bloom's levels gets approximately equal representation:

| Bloom's Level | Count | Cognitive Demand | Question Style |
|---|---|---|---|
| **Remember** | 33 | Recall facts, definitions, terminology | "What is...?", "Which of the following defines...?" |
| **Understand** | 33 | Explain concepts, interpret meaning | "Why does...?", "What best explains...?" |
| **Apply** | 34 | Use knowledge in new situations | "Given this scenario, which approach...?" |
| **Analyze** | 33 | Break down, compare, distinguish | "What is the key difference between...?" |
| **Evaluate** | 33 | Judge, critique, assess quality | "Which solution best addresses...?" |
| **Create** | 34 | Design, propose, construct solutions | "Which design would you recommend...?" |

### 2.3 Day Distribution

Questions are distributed across days based on content depth, with natural fit to Bloom's levels:

| Day | Remember | Understand | Apply | Analyze | Evaluate | Create | Total |
|-----|----------|------------|-------|---------|----------|--------|-------|
| 1: What is Gen AI | 7 | 6 | 5 | 5 | 5 | 4 | **32** |
| 2: Prompt Engineering | 5 | 5 | 6 | 5 | 5 | 6 | **32** |
| 3: Context Engineering | 5 | 5 | 5 | 5 | 5 | 5 | **30** |
| 4: Multimodal AI | 4 | 4 | 5 | 4 | 4 | 5 | **26** |
| 5: Google AI Studio | 5 | 5 | 5 | 5 | 5 | 5 | **30** |
| 6: Red Teaming | 4 | 4 | 4 | 5 | 5 | 5 | **27** |
| 7: Agentic AI | 3 | 4 | 4 | 4 | 4 | 4 | **23** |
| **Total** | **33** | **33** | **34** | **33** | **33** | **34** | **200** |

### 2.4 Scenario Distribution

- **40% Beacon Retail Group** (~80 questions): Tests applied knowledge using the familiar case study from lectures and labs
- **60% New business scenarios** (~120 questions): Tests transfer of learning to unfamiliar contexts (healthcare, finance, manufacturing, logistics, education, hospitality)

### 2.5 Difficulty Calibration for Open-Book

Since the exam is open-book with a time constraint:

- **Remember questions** test quick fluency — students who understood lectures can answer instantly; looking up definitions costs precious time
- **Understand questions** require explaining "why" — can't be copy-pasted from notes
- **Apply/Analyze questions** present novel scenarios — notes help but judgment is required
- **Evaluate/Create questions** require synthesis across multiple concepts — highest cognitive demand, hardest to answer from notes alone

---

## 3. Question Design Standards

### 3.1 Question Stem Rules

1. Clear, unambiguous phrasing appropriate for MBA students with no tech background
2. All technical terms defined in the stem if not universally covered in lectures
3. Scenario-based questions include enough context to answer without referencing other questions
4. No trick questions or "gotcha" phrasing
5. No "all of the above" or "none of the above" options
6. Negative stems ("Which is NOT...") used sparingly and always bolded

### 3.2 Distractor Rules

1. All 3 distractors must be plausible (no joke answers)
2. Distractors should reflect common misconceptions taught in lectures
3. Distractors must be clearly wrong to someone who understands the concept
4. Options should be similar in length (no "longest answer is correct" pattern)
5. Options should be mutually exclusive

### 3.3 Image Standards

- Generated with Nano Banana (`gemini-2.5-flash-image`) or as SVG diagrams
- **No text baked into AI-generated images** — all labels in HTML question text
- WebP format at quality 85 (60-100KB target)
- Used only where visuals add pedagogical value:
  - Process flow diagrams (RAG pipeline, agent orchestration)
  - Comparison charts (token costs, parameter effects)
  - Concept illustrations (vector space, context window)
  - Scenario visuals (dashboard mockups, system architecture)
- Estimated: 20-30 images across the 200-question pool

---

## 4. Technical Delivery: QTI 2.1

### 4.1 Why QTI 2.1

- BB Ultra's supported import format for question pools
- Supports multiple choice with embedded images
- Industry standard (IMS/1EdTech)
- Programmatically generatable from structured JSON

### 4.2 Package Structure

```
final-exam-pool.zip
  imsmanifest.xml          # Package manifest
  items/
    q001.xml               # QTI 2.1 assessmentItem
    q002.xml
    ...
    q200.xml
  images/
    rag-pipeline.webp
    vector-space.webp
    ...
```

### 4.3 QTI Limitations Acknowledged

| Limitation | Mitigation |
|---|---|
| Only 5 question types importable (MC, MA, TF, FIB, Essay) | All 200 questions are MC — fully supported |
| Metadata/tags not preserved on import | `question-matrix.md` serves as external reference |
| Partial credit flattened | All questions are single-correct MC — no partial credit needed |
| Silent drop of unsupported features | Test small batch import first before full upload |

### 4.4 BB Ultra Import Workflow

1. Instructor downloads `final-exam-pool.zip`
2. In BB Ultra: Course Content > Question Banks > Import
3. Upload ZIP file
4. BB Ultra creates question bank with 200 questions
5. Create new Test > Add Question Pool > Select bank > Set draw count to 50
6. Configure: 120-minute time limit, randomize question order, randomize option order
7. Deploy to students

---

## 5. Visual Requirements

### 5.1 Image Categories

| Category | Example Questions | Est. Count |
|---|---|---|
| Process flows | RAG pipeline, agent orchestration, 5-layer defense | 6-8 |
| Comparison charts | Token costs, RAG vs fine-tuning, parameter effects | 4-6 |
| Concept diagrams | Vector space, context window, multimodal pipeline | 4-6 |
| Scenario visuals | System architecture, dashboard mockup, workflow | 4-6 |
| Data/output examples | JSON structure, classification output, cost table | 2-4 |

### 5.2 Generation Approach

- **Nano Banana** for illustrations and concept art (text-free)
- **SVG** for precise diagrams with labels (hand-coded, NIU brand colors)
- **HTML/CSS charts** rendered to image for data visualizations

---

## 6. Acceptance Criteria

### Spec Completeness
- [ ] 200 questions written and stored in `questions.json`
- [ ] All questions rooted in concepts from Day 1-7 lectures and labs
- [ ] Equal Bloom's taxonomy distribution (~33 per level)
- [ ] 40%/60% Beacon/new scenario split
- [ ] 4 options per question, single correct answer
- [ ] No "all of the above" / "none of the above"
- [ ] All distractors plausible

### Technical Delivery
- [ ] `build_qti.py` generates valid QTI 2.1 XML
- [ ] `final-exam-pool.zip` contains manifest + 200 items + images
- [ ] ZIP imports successfully into BB Ultra (manual verification)
- [ ] Images render correctly in BB Ultra question preview

### Documentation
- [ ] `question-matrix.md` maps all 200 questions by Day x Bloom's
- [ ] `IMPORT_GUIDE.md` provides clear BB Ultra upload steps
- [ ] Each question tagged with day, topic, Bloom's level, difficulty

---

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| QTI import silently drops questions | Medium | High | Test 10-question batch first; validate XML schema |
| Images don't render in BB Ultra | Medium | Medium | Use standard `<img>` tags; test with one image question first |
| Bloom's level misclassification | Low | Medium | Cross-reference with Bloom's verb lists; human review |
| Questions too easy for open-book | Medium | High | Emphasize Apply+ levels; scenario-based over definitional |
| Question stems ambiguous | Low | High | Peer review; ensure single defensible correct answer |
| 120 minutes too generous/tight | Medium | Medium | Target ~2 min/question average; instructor can adjust |

---

## 8. Approval

- [ ] **Human review:** Spec structure and exam design approved
- [ ] **Human review:** Question distribution across days and Bloom's levels
- [ ] **Human review:** Sample questions reviewed for quality
- [ ] **Human review:** BB Ultra import tested successfully

**Status:** Awaiting human review

---

*End of Specification*
