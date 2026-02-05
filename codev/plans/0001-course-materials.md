# Implementation Plan: UBUS 670 Course Materials

**Plan ID:** 0001
**Spec Reference:** [codev/specs/0001-course-materials.md](../specs/0001-course-materials.md)
**Status:** Approved
**Author:** Claude (Architect)
**Created:** 2026-02-04

---

## 1. Overview

This plan describes HOW to build the course materials specified in Spec 0001. Development proceeds day-by-day with human approval gates between each day.

### 1.1 Key Principles

1. **One day at a time** — Complete and approve Day N before starting Day N+1
2. **Lessons compound** — Capture learnings after each day to improve subsequent days
3. **Generator-Critic loop** — Draft → Review → Iterate → Approve
4. **Human gates** — No advancement without explicit approval

---

## 2. Development Phases

### Phase 0: Foundation Setup
Prepare shared assets and datasets before Day 1 development.

### Phases 1-9: Day Development
Each day follows the same workflow (see Section 4).

### Phase 10: Integration & Polish
Final review of all materials for consistency.

---

## 3. Phase 0: Foundation Setup

Before developing Day 1, establish these foundations:

### 3.1 Shared Assets

| Asset | Description | Location |
|-------|-------------|----------|
| CSS stylesheet | Consistent styling across all days | `Materials/Materials/_shared/styles.css` |
| Reveal.js config | Shared presentation settings | `Materials/Materials/_shared/reveal-config.js` |
| Quiz template | Reusable quiz component | `Materials/Materials/_shared/quiz-template.html` |
| Beacon logo | Case study branding | `Materials/Materials/_shared/assets/beacon-logo.svg` |

### 3.2 Beacon Retail Group Bible

Create comprehensive case study documentation:

| Document | Purpose | Priority |
|----------|---------|----------|
| Company Overview | History, mission, size, locations | Required for Day 1 |
| Org Chart | Leadership and department structure | Required for Day 1 |
| Financial Summary | Revenue, margins, seasonal patterns | Required for Day 3 |
| Strategic Plan | AI adoption goals, challenges | Required for Day 3 |
| CEO Memo | Sets up the "AI Task Force" narrative | Required for Day 1 |

### 3.3 Dataset Creation Schedule

| Dataset | Needed By | Create During |
|---------|-----------|---------------|
| Beacon briefing docs | Day 3 | Phase 0 or Day 2 |
| Expense receipts (images) | Day 4 | Day 3 |
| Customer emails | Day 5 | Day 4 |
| Resumes with patterns | Day 7 | Day 6 |

---

## 4. Day Development Workflow

Each day (Phases 1-9) follows this workflow:

```
┌─────────────────────────────────────────────────────────────┐
│                    DAY N DEVELOPMENT                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: GENERATE                                           │
│  ├── Draft lecture.html (Reveal.js slides)                  │
│  ├── Draft lab.html (hands-on instructions)                 │
│  ├── Draft quiz.html (knowledge check)                      │
│  └── Create index.html (navigation hub)                     │
│                                                             │
│  Step 2: CRITIQUE                                           │
│  ├── Content Expert review (pedagogy, scaffolding)          │
│  └── AI Expert review (accuracy, depth, business value)     │
│                                                             │
│  Step 3: ITERATE (2-3 rounds)                               │
│  ├── Address critique feedback                              │
│  ├── Refine visuals and examples                            │
│  └── Test interactive elements                              │
│                                                             │
│  Step 4: HUMAN REVIEW                                       │
│  └── Present to project owner for approval                  │
│                                                             │
│  Step 5: APPROVE or REVISE                                  │
│  ├── If approved → Capture lessons, advance to Day N+1      │
│  └── If revisions needed → Return to Step 3                 │
│                                                             │
│  Step 6: CAPTURE LESSONS                                    │
│  └── Document in codev/lessons/0001-course-materials.md     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Day-by-Day Development Details

### 5.1 Day 1: What is Generative AI?

**Dependencies:** Phase 0 complete, Beacon overview ready

**Lecture Topics:**
- LLM architecture (tokens → embeddings → attention → output)
- Context windows explained with business analogy
- Hallucination: what, why, mitigation
- Demo: Gemini Chat interface tour

**Lab Structure:**
1. Account setup verification
2. First prompt: "Summarize this business memo"
3. Explore different prompt styles
4. Document a hallucination example

**Visual Assets Needed:**
- Token visualization diagram
- Context window "briefcase" analogy
- LLM pipeline flowchart

**Quiz Focus:**
- Token definition
- Context window purpose
- Hallucination identification

---

### 5.2 Day 2: Prompt Engineering

**Dependencies:** Day 1 approved

**Lecture Topics:**
- RCTFC framework (Role/Context/Task/Format/Constraints)
- Zero-shot vs. few-shot vs. chain-of-thought
- Iteration strategies
- Prompt injection awareness

**Lab Structure:**
1. Apply RCTFC to job description generation
2. Compare zero-shot vs. few-shot results
3. Chain-of-thought for interview questions
4. Prompt iteration exercise

**Visual Assets Needed:**
- RCTFC framework diagram
- Prompting techniques comparison chart
- Iteration cycle graphic

**Quiz Focus:**
- RCTFC components
- When to use each prompting technique
- Prompt injection risks

---

### 5.3 Day 3: Context Engineering

**Dependencies:** Day 2 approved, Beacon briefing docs ready

**Lecture Topics:**
- Beyond prompts: context engineering
- Preparing documents for AI consumption
- RAG conceptual introduction
- Google Opal introduction

**Lab Structure:**
1. Opal account setup
2. Upload Beacon documents
3. Build company knowledge assistant
4. Test with realistic questions

**Visual Assets Needed:**
- Context engineering evolution diagram
- RAG architecture (simplified)
- Opal interface walkthrough screenshots

**Quiz Focus:**
- Context vs. prompt engineering
- Document preparation principles
- RAG purpose (conceptual)

**Dataset Delivery:** Beacon briefing documents

---

### 5.4 Day 4: Multimodal AI

**Dependencies:** Day 3 approved, expense receipts ready

**Lecture Topics:**
- Multimodal capabilities overview
- Document/image understanding
- Structured data extraction
- Edge case handling

**Lab Structure:**
1. Upload receipt images to Opal/AI Studio
2. Extract: vendor, amount, date, category
3. Handle edge cases (handwriting, damage)
4. Build expense categorization workflow

**Visual Assets Needed:**
- Multimodal input types diagram
- Extraction workflow flowchart
- Before/after structured data example

**Quiz Focus:**
- Multimodal capability types
- Extraction challenges
- Business use cases

**Dataset Delivery:** 25-30 expense receipt images

---

### 5.5 Day 5: Google AI Studio

**Dependencies:** Day 4 approved, customer emails ready

**Lecture Topics:**
- AI Studio interface tour
- Model parameters (temperature, top-p, top-k)
- System prompts
- Token cost estimation

**Lab Structure:**
1. AI Studio setup
2. Configure customer email classifier
3. Build response generator with system prompt
4. Estimate costs for Beacon's volume

**Visual Assets Needed:**
- Parameter effects visualization
- System prompt template
- Cost calculation worksheet

**Quiz Focus:**
- Parameter effects on output
- System prompt purpose
- Cost factors

**Dataset Delivery:** 40-50 customer emails

---

### 5.6 Day 6: Testing & Guardrails

**Dependencies:** Day 5 approved

**Lecture Topics:**
- Evaluation criteria design
- Red-teaming methodology
- Building rubrics
- Deployment readiness checklist

**Lab Structure:**
1. Define evaluation criteria for Day 4-5 systems
2. Red-team the expense processor
3. Red-team the email system
4. Document vulnerabilities and mitigations

**Visual Assets Needed:**
- Evaluation rubric template
- Red-team attack categories
- Deployment readiness checklist

**Quiz Focus:**
- Evaluation criteria types
- Red-teaming purpose
- Deployment considerations

---

### 5.7 Day 7: Introduction to Agentic AI

**Dependencies:** Day 6 approved

**Lecture Topics:**
- Agents vs. LLM calls
- Agent anatomy (perception, reasoning, action)
- Orchestration patterns (sequential, parallel, loop)
- Tool introduction (ADK Visual Builder or MindStudio)

**Lab Structure (Plan A - ADK Visual Builder):**
1. Tool setup and interface tour
2. Build single agent (research agent)
3. Add second agent (summarizer)
4. Connect agents in sequence

**Lab Structure (Plan B - MindStudio):**
1. Account setup and interface tour
2. Build single agent workflow
3. Add second agent
4. Connect via handoff

**Visual Assets Needed:**
- Agent anatomy diagram
- Orchestration pattern comparisons
- Tool interface screenshots (both versions)

**Quiz Focus:**
- Agent definition
- Agent components
- Pattern selection criteria

---

### 5.8 Day 8: Capstone Part 1 — Build

**Dependencies:** Day 7 approved, resume dataset ready

**Lecture Topics:**
- Multi-agent architecture design
- Agent role definition
- Handoff design
- Testing strategies

**Lab Structure:**
1. Design resume screening architecture
2. Build Agent 1: Resume Parser
3. Build Agent 2: Qualifications Evaluator
4. Build Agent 3: Ranking/Recommendation
5. Connect and test basic flow

**Visual Assets Needed:**
- Resume screening architecture diagram
- Agent role cards
- Testing checklist

**Dataset Delivery:** 40-50 resumes with hidden patterns

---

### 5.9 Day 9: Capstone Part 2 — Evaluate & Present

**Dependencies:** Day 8 approved

**Lecture Topics:**
- Agent evaluation methods
- Bias detection
- Optimization strategies
- Presenting AI solutions to stakeholders

**Lab Structure:**
1. Run full resume dataset through system
2. Evaluate results against rubric
3. Identify patterns and anomalies
4. Optimize and re-test
5. Prepare presentation

**Presentation Session:**
- Each team/individual presents (5-7 min)
- Graded using capstone rubric
- Discussion of discovered patterns

**Visual Assets Needed:**
- Evaluation scorecard template
- Presentation outline template

---

## 6. Dual-Version Strategy (Days 7-9)

### 6.1 Shared Content
- Lectures (concepts apply to both tools)
- Quizzes (test concepts, not tool specifics)
- index.html (links to appropriate lab version)

### 6.2 Tool-Specific Content
- Lab instructions (separate files)
- Screenshots (tool-specific)
- Troubleshooting guides

### 6.3 File Structure
```
Week 3/Day 1/web/
├── index.html           # Links to both lab versions
├── lecture.html         # Shared
├── quiz.html           # Shared
├── lab-adk.html        # Plan A: ADK Visual Builder
└── lab-mindstudio.html # Plan B: MindStudio
```

---

## 7. Quality Checkpoints

### 7.1 Per-Day Checklist

Before requesting human approval:

**Content Quality:**
- [ ] Learning objectives clearly stated
- [ ] Bloom's taxonomy alignment verified
- [ ] Scaffolding from simple → complex
- [ ] Active learning elements present
- [ ] Assessment provides formative feedback

**Technical Quality:**
- [ ] HTML validates
- [ ] Reveal.js slides render correctly
- [ ] Quiz interactions work
- [ ] All links functional
- [ ] Images load properly

**AI Content Quality:**
- [ ] Terminology accurate and current
- [ ] Depth appropriate (not surface-level)
- [ ] Business value clear
- [ ] Examples realistic
- [ ] Beacon case study integrated

**Visual Educator Rule:**
- [ ] No text-heavy slides
- [ ] Diagrams support explanations
- [ ] Business metaphors used
- [ ] High-quality visuals

### 7.2 Cross-Day Consistency Check (Phase 10)

After all days approved:
- [ ] Consistent terminology
- [ ] Progressive complexity verified
- [ ] No contradictions between days
- [ ] Beacon narrative flows
- [ ] Visual style consistent

---

## 8. Risk Mitigation

| Risk | Trigger | Response |
|------|---------|----------|
| ADK Visual Builder unusable | Significant bugs in Day 7 lab | Switch to MindStudio (Plan B) for remainder |
| Google Opal changes | Interface differs from screenshots | Update screenshots, adjust instructions |
| Dataset quality issues | Hidden patterns too obvious/obscure | Adjust resume dataset before Day 8 |
| Content too technical | Human feedback indicates difficulty | Simplify, add more analogies |

---

## 9. Approval

**Approved:** 2026-02-04

- [x] Plan reviewed by project owner
- [x] Development workflow understood
- [x] Day-by-day sequence approved
- [x] Dual-version strategy confirmed

---

*End of Implementation Plan*
