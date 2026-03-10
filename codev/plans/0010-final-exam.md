# Implementation Plan: Final Exam Question Pool

**Plan ID:** 0010
**Spec Reference:** [codev/specs/0010-final-exam.md](../specs/0010-final-exam.md)
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-03-09

---

## 1. Overview

### 1.1 Key Principles

1. **Questions as data first** — All 200 questions authored in `questions.json` as the single source of truth. QTI XML is a generated build artifact.
2. **Rooted in actual content** — Every question must trace to a specific concept taught in the Day 1-7 lectures and labs. No questions on topics not covered.
3. **Open-book calibration** — Favor scenario-based questions that require judgment over pure recall. A student with notes but no understanding should struggle.
4. **Test before bulk** — Validate QTI import with a 10-question sample before generating the full 200-question package.

### 1.2 Estimated Scope

| Deliverable | Effort | Notes |
|---|---|---|
| `questions.json` (200 questions) | High | Core deliverable; ~3-4 questions per concept |
| `images/` (~20-30 visuals) | Medium | Nano Banana + SVG diagrams |
| `build_qti.py` | Medium | QTI 2.1 XML generation + ZIP packaging |
| `final-exam-pool.zip` | Low | Automated output of build script |
| `question-matrix.md` | Low | Generated from questions.json |
| `IMPORT_GUIDE.md` | Low | BB Ultra upload steps |

### 1.3 Dependencies

- Day 1-7 lecture HTML files (read-only reference)
- Day 1-7 lab HTML files (read-only reference)
- Day 1-7 quiz HTML files (read-only reference for existing question style)
- Nano Banana tool (`Materials/_tools/generate_image.py`)
- Python 3.x with standard library (json, xml, zipfile)

---

## 2. Pre-Implementation Checklist

- [ ] Confirm branch `feature/0010-final-exam` is active
- [ ] Read codev/specs/0010-final-exam.md (this plan's spec)
- [ ] Read codev/lessons/0001-course-materials.md for question writing patterns
- [ ] Verify `Materials/Final-Exam/` directory exists
- [ ] Verify Nano Banana tool is accessible

---

## 3. Phase 1: Question Bank Schema

### Step 3.1: Define JSON Schema

Create `questions.json` with this structure per question:

```json
{
  "questions": [
    {
      "id": "Q001",
      "day": 1,
      "topic": "Tokens",
      "blooms_level": "remember",
      "difficulty": "easy",
      "beacon_scenario": false,
      "image": null,
      "stem": "What is a token in the context of large language models?",
      "options": [
        {"key": "A", "text": "A chunk of text approximately 4 characters or 0.75 words", "correct": true},
        {"key": "B", "text": "A complete sentence processed as a single unit", "correct": false},
        {"key": "C", "text": "A security credential used to access the model", "correct": false},
        {"key": "D", "text": "A payment unit for purchasing AI subscriptions", "correct": false}
      ]
    }
  ]
}
```

Fields:
- `id`: Q001-Q200 (sequential)
- `day`: 1-7
- `topic`: Specific concept from that day's lecture/lab
- `blooms_level`: remember | understand | apply | analyze | evaluate | create
- `difficulty`: easy | medium | hard (within each Bloom's level)
- `beacon_scenario`: true (40%) | false (60%)
- `image`: filename in `images/` or null
- `stem`: Question text (HTML-safe, may include `<img>` reference)
- `options`: Array of 4 options with exactly one `correct: true`

---

## 4. Phase 2: Question Authoring

### Step 4.1: Day 1 — What is Generative AI (32 questions)

**Topics to cover:**
- Tokens: definition, calculation (~4 chars / ~0.75 words), cost implications
- Embeddings: words as vectors, semantic meaning, word relationships
- Context window: definition, size comparisons, "working memory" analogy, no persistence
- Temperature: low (0.1) = factual, high (0.9) = creative
- Hallucinations: definition, anatomy, Air Canada case, NYC lawyer case
- Hallucination mitigation: grounding, temperature lowering, citation requests, human verification
- Three eras of software: traditional → ML → Generative AI
- AI limitations: no true reasoning, no real-time knowledge, no secret keeping, no accountability
- Next-token prediction: autocomplete mechanism, probability distribution
- Attention mechanism: resolving word ambiguity through context

**Bloom's targets:** Remember (7), Understand (6), Apply (5), Analyze (5), Evaluate (5), Create (4)

### Step 4.2: Day 2 — Prompt Engineering (32 questions)

**Topics to cover:**
- RCTFC framework: Role, Context, Task, Format, Constraints (each component)
- Zero-shot prompting: asking without examples
- Few-shot prompting: providing example input-output pairs
- Chain-of-thought: "think step by step" for complex reasoning
- Prompt injection: user input overriding system instructions
- Prompt iteration: identify problem → adjust ONE component → test → repeat
- Constraints section: explicit rules for what AI should/shouldn't do
- Role assignment: improves output quality and consistency
- Prompt templates: scaling one good prompt to a team
- Beacon HR/Marketing/Finance prompt scenarios

**Bloom's targets:** Remember (5), Understand (5), Apply (6), Analyze (5), Evaluate (5), Create (6)

### Step 4.3: Day 3 — Context Engineering (30 questions)

**Topics to cover:**
- Context engineering vs single prompts: building information environments
- Structured formats: Markdown, JSON, XML (when to use each)
- Chunking strategies: breaking documents into manageable pieces
- Priority ordering: most important information first
- RAG: definition, architecture, "open-book exam" analogy
- RAG vs fine-tuning: add knowledge vs change behavior
- Gemini Gems: persistent knowledge uploads + custom instructions
- Embeddings extended: dense vs sparse, vector databases (awareness)
- Semantic search: query → vector → nearest neighbors → results
- Citation and source attribution

**Bloom's targets:** Remember (5), Understand (5), Apply (5), Analyze (5), Evaluate (5), Create (5)

### Step 4.4: Day 4 — Multimodal AI (26 questions)

**Topics to cover:**
- Multimodal definition: AI processing multiple input/output types
- Image understanding: object recognition, OCR, layout analysis
- Audio understanding: transcription, speaker ID, sentiment
- Video understanding: temporal events, scene descriptions
- Image generation: best practices, detailed prompts, limitations
- Real-world cases: Gather AI (warehouse), ABBYY (invoices), Observe.AI (call centers), RetailNext (retail video), Landing AI (manufacturing QC)
- Multimodal context engineering: structured output from unstructured input
- Human-in-the-loop for multimodal: brand consistency, legal, cultural
- Beacon spring marketing campaign scenario

**Bloom's targets:** Remember (4), Understand (4), Apply (5), Analyze (4), Evaluate (4), Create (5)

### Step 4.5: Day 5 — Google AI Studio (30 questions)

**Topics to cover:**
- AI Studio vs Gemini Chat: "showroom vs workshop" analogy
- Temperature parameter: 0.0-2.0 range, effects on output
- Top-p (nucleus sampling): vocabulary range control
- Top-k: number of tokens considered
- Max tokens: response length constraint
- System prompts as job descriptions: role, behavioral rules, output format, escalation, tone, knowledge boundaries
- System prompts as persistent RCTFC
- Token economics: Flash vs Pro pricing, input vs output costs
- Beacon email triage cost estimation
- Reusable configurations and parameter presets

**Bloom's targets:** Remember (5), Understand (5), Apply (5), Analyze (5), Evaluate (5), Create (5)

### Step 4.6: Day 6 — Red Teaming & AI Safety (27 questions)

**Topics to cover:**
- Red teaming definition and origins (military → cybersecurity → AI)
- Four attack categories: role confusion, boundary violations, output manipulation, social engineering
- Case studies: Microsoft Tay (2016), Air Canada (2024), Samsung (2023), Chevrolet dealer (2023)
- 5-layer defense model: perimeter, identity, behavior, escalation, recovery
- System prompt hardening: identity anchoring, instruction refusal, scope limitation, output validation, decision consistency
- AI governance lifecycle: Build → Test → Deploy → Monitor → Respond
- Defense-in-depth principle: no single layer sufficient
- Business risk framing for each attack type

**Bloom's targets:** Remember (4), Understand (4), Apply (4), Analyze (5), Evaluate (5), Create (5)

### Step 4.7: Day 7 — Agentic AI (23 questions)

**Topics to cover:**
- Agent vs LLM call: autonomy, tool access, persistence, collaboration
- Perception-Reasoning-Action framework
- Agent instructions: enhanced system prompts + tools + collaboration rules
- Sequential orchestration: assembly line, dependency chain
- Parallel orchestration: simultaneous, independent tasks
- Loop orchestration: iterative refinement until quality met
- Trade-offs between patterns: speed vs quality vs cost
- Beacon email triage quality checker (2-agent sequential)
- Agent governance: trust boundaries, human-in-the-loop, monitoring
- Day 6 → Day 7 bridge: automating red teaming with a second agent

**Bloom's targets:** Remember (3), Understand (4), Apply (4), Analyze (4), Evaluate (4), Create (4)

### Step 4.8: Variant Strategy

To reach 200 questions, many topics get 2-4 variants:
- **Variant A vs B:** Same concept, different scenario (Beacon vs new business)
- **Variant A vs B:** Same concept, different Bloom's level (Remember vs Apply)
- **Variant A vs B:** Same concept, different angle (definition vs example vs counterexample)

This ensures the pool has redundancy — if a student gets 50 random questions, they'll see each major concept at least once even if they miss some variants.

---

## 5. Phase 3: Image Generation

### Step 5.1: Identify Visual Questions

Review completed `questions.json` and flag questions where a diagram, chart, or illustration would:
- Make the question more realistic (e.g., "look at this system architecture")
- Test visual literacy (e.g., "which orchestration pattern does this diagram show?")
- Present data for analysis (e.g., "given this cost comparison chart")

### Step 5.2: Generate Images

Target ~20-30 images:

| Image | Type | Questions |
|---|---|---|
| `rag-pipeline.webp` | Process flow | Day 3 RAG questions |
| `vector-space.webp` | Concept diagram | Day 1/3 embedding questions |
| `token-costs-chart.webp` | Data chart | Day 5 token economics questions |
| `5-layer-defense.webp` | Architecture diagram | Day 6 defense model questions |
| `sequential-pattern.webp` | Process flow | Day 7 orchestration questions |
| `parallel-pattern.webp` | Process flow | Day 7 orchestration questions |
| `loop-pattern.webp` | Process flow | Day 7 orchestration questions |
| `temperature-effects.webp` | Comparison chart | Day 1/5 temperature questions |
| `multimodal-pipeline.webp` | Architecture diagram | Day 4 multimodal questions |
| `system-prompt-layers.webp` | Architecture diagram | Day 5/6 system prompt questions |
| `rctfc-framework.webp` | Framework diagram | Day 2 RCTFC questions |
| `context-window.webp` | Concept illustration | Day 1/3 context questions |
| `attack-categories.webp` | Classification diagram | Day 6 attack questions |
| `agent-anatomy.webp` | Framework diagram | Day 7 perception-reasoning-action |
| `beacon-email-triage.webp` | Workflow diagram | Day 5/6/7 Beacon questions |

### Step 5.3: Generation Tools

- **Nano Banana** (`Materials/_tools/generate_image.py`): Concept illustrations, scenario visuals
- **SVG (hand-coded)**: Precise diagrams with labels, NIU brand colors
- All images: WebP at q85, 60-100KB, no baked-in text

---

## 6. Phase 4: QTI 2.1 Package Builder

### Step 6.1: Build Script (`build_qti.py`)

Python script that:
1. Reads `questions.json`
2. For each question, generates a QTI 2.1 `assessmentItem` XML file
3. Generates `imsmanifest.xml` referencing all items and images
4. Packages everything into `final-exam-pool.zip`

### Step 6.2: QTI 2.1 XML Template

Each question becomes an XML file like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1"
                identifier="Q001"
                title="Q001 - Tokens Definition"
                adaptive="false"
                timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>A</value>
    </correctResponse>
  </responseDeclaration>
  <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
    <defaultValue><value>0</value></defaultValue>
  </outcomeDeclaration>
  <itemBody>
    <p>What is a token in the context of large language models?</p>
    <choiceInteraction responseIdentifier="RESPONSE" shuffle="true" maxChoices="1">
      <simpleChoice identifier="A">A chunk of text approximately 4 characters or 0.75 words</simpleChoice>
      <simpleChoice identifier="B">A complete sentence processed as a single unit</simpleChoice>
      <simpleChoice identifier="C">A security credential used to access the model</simpleChoice>
      <simpleChoice identifier="D">A payment unit for purchasing AI subscriptions</simpleChoice>
    </choiceInteraction>
  </itemBody>
  <responseProcessing
    template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
</assessmentItem>
```

For questions with images:
```xml
<itemBody>
  <p>Review the diagram below showing three orchestration patterns:</p>
  <p><img src="images/orchestration-patterns.webp" alt="Three orchestration patterns: sequential, parallel, and loop" /></p>
  <p>Which pattern is best suited for a workflow where each step depends on the previous step's output?</p>
  <choiceInteraction responseIdentifier="RESPONSE" shuffle="true" maxChoices="1">
    ...
  </choiceInteraction>
</itemBody>
```

### Step 6.3: Manifest Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2"
          xmlns:imsqti="http://www.imsglobal.org/xsd/imsqti_v2p1"
          identifier="UBUS670-Final-Exam-Pool">
  <metadata>
    <schema>QTIv2.1 Package</schema>
    <schemaversion>1.0.0</schemaversion>
  </metadata>
  <organizations/>
  <resources>
    <!-- One resource per question -->
    <resource identifier="Q001" type="imsqti_item_xmlv2p1" href="items/q001.xml">
      <file href="items/q001.xml"/>
    </resource>
    <!-- ... Q002-Q200 ... -->
    <!-- Shared image resources -->
    <resource identifier="IMG_rag_pipeline" type="webcontent" href="images/rag-pipeline.webp">
      <file href="images/rag-pipeline.webp"/>
    </resource>
  </resources>
</manifest>
```

### Step 6.4: Validation

- Validate each XML file against QTI 2.1 schema
- Verify all image references resolve to actual files
- Verify ZIP structure matches expected layout
- Test 10-question sample import into BB Ultra before full upload

---

## 7. Phase 5: Documentation

### Step 7.1: Question Matrix (`question-matrix.md`)

Auto-generated from `questions.json`. Shows:
- Summary table: Day x Bloom's level counts
- Per-day breakdown with question IDs, topics, and Bloom's levels
- Beacon vs new scenario counts
- Image question inventory

### Step 7.2: Import Guide (`IMPORT_GUIDE.md`)

Step-by-step instructions:
1. Prerequisites (BB Ultra instructor access)
2. Upload QTI package to Question Banks
3. Create test from pool
4. Configure randomization, time limit, availability
5. Troubleshooting common import issues

---

## 8. Phase 6: Review

### Step 8.1: Self-Review

- [ ] Every question traces to a specific Day 1-7 lecture/lab concept
- [ ] Bloom's level distribution matches spec (33/33/34/33/33/34)
- [ ] Beacon/new scenario split matches spec (~40%/60%)
- [ ] No "all of the above" / "none of the above" options
- [ ] All distractors plausible; no joke answers
- [ ] Options similar in length per question
- [ ] No ambiguous stems with multiple defensible answers
- [ ] Images render correctly and add pedagogical value
- [ ] QTI XML validates against schema
- [ ] ZIP imports cleanly into BB Ultra

### Step 8.2: Human Checkpoint

Present to instructor:
- `question-matrix.md` for high-level review
- Sample of 10-20 questions spanning all days and Bloom's levels
- Test import results from BB Ultra
- Flag any questions where Bloom's classification is debatable

---

## 9. Implementation Order Summary

```
PRE-WORK
├── Verify branch and directory structure
├── Read spec and lessons learned
└── Read Day 1-7 lecture/lab HTML for content verification

PHASE 1: QUESTION SCHEMA
└── Define JSON structure in questions.json

PHASE 2: QUESTION AUTHORING (core deliverable)
├── Day 1: 32 questions (7R + 6U + 5Ap + 5An + 5E + 4C)
├── Day 2: 32 questions (5R + 5U + 6Ap + 5An + 5E + 6C)
├── Day 3: 30 questions (5R + 5U + 5Ap + 5An + 5E + 5C)
├── Day 4: 26 questions (4R + 4U + 5Ap + 4An + 4E + 5C)
├── Day 5: 30 questions (5R + 5U + 5Ap + 5An + 5E + 5C)
├── Day 6: 27 questions (4R + 4U + 4Ap + 5An + 5E + 5C)
└── Day 7: 23 questions (3R + 4U + 4Ap + 4An + 4E + 4C)

PHASE 3: IMAGE GENERATION
├── Identify ~20-30 visual questions
├── Generate Nano Banana illustrations
├── Create SVG diagrams
└── Optimize all to WebP at q85

PHASE 4: QTI PACKAGE
├── Build build_qti.py
├── Generate 200 XML files + manifest
├── Package into ZIP
└── Validate with 10-question test import

PHASE 5: DOCUMENTATION
├── Generate question-matrix.md
└── Write IMPORT_GUIDE.md

PHASE 6: REVIEW
├── Self-review checklist
└── Human checkpoint
```

---

## 10. Traps to Avoid

1. **Don't write questions from memory** — Always cross-reference the actual lecture HTML to ensure concepts were actually taught
2. **Don't make "Create" questions too vague** — "Which design would you recommend?" must have a single defensible best answer, not a subjective preference
3. **Don't assume open-book means easy** — Students with notes but no understanding should still struggle with Apply+ questions
4. **Don't bake text into Nano Banana images** — AI-generated text is unreliable; use HTML overlays
5. **Don't use QTI features beyond MC** — BB Ultra silently drops unsupported interaction types; stick to `choiceInteraction`
6. **Don't skip the test import** — Validate a 10-question batch in BB Ultra before generating the full 200
7. **Don't write all variants at the same Bloom's level** — If Q001 is Remember, make Q002 (same topic) Apply or Analyze
8. **Don't let option length signal the answer** — Keep all 4 options similar in length and detail

---

## 11. Approval

- [ ] **Human review:** Plan structure and phases approved
- [ ] **Human review:** Question schema and JSON structure approved
- [ ] **Human review:** QTI approach validated with test import

**Status:** Awaiting human review

---

*End of Implementation Plan*
