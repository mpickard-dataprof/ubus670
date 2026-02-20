# Specification: Day 7 — Introduction to Agentic AI

**Spec ID:** 0008
**Title:** Day 7 (Introduction to Agentic AI) — From Single AI to AI Teams
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-02-19
**Parent Spec:** 0001 (UBUS 670 Course Materials)
**Related Specs:** 0007 (Day 6 Red Teaming — preceding day), 0006 (Visual Deployment Pipeline)

---

## 1. Overview

### 1.1 Purpose

Create Day 7 materials that transition students from single-AI systems (Days 5-6) to multi-agent architectures. Students learn what makes an AI agent different from a simple LLM call, understand three orchestration patterns (sequential, parallel, loop), and build a two-agent sequential workflow that extends Beacon's email triage system with a quality-checking agent. Day 7 begins Week 3 (multi-agent AI + capstone) and directly delivers on Day 6's closing promise: "What if one AI could check another?"

### 1.2 Core Teaching Shift

| Day 6 | Day 7 |
|---|---|
| "Test and harden one AI system" | "What if you added a second AI to check the first?" |
| Single AI doing everything | Multiple AIs collaborating with defined roles |
| Manual red teaming by humans | Automated verification by a second agent |
| System prompt hardening | Agent instructions + tool access + collaboration rules |
| Reactive defense | Proactive quality assurance through orchestration |

### 1.3 Date and Logistics

- **Date:** Monday, March 23, 2026
- **Time:** 8:30 AM - 12:30 PM (4 hours)
- **Location:** Barsema Hall 331
- **Tools:** Google ADK Visual Builder (Plan A) or MindStudio (Plan B)
- **Week:** 3, Day 7 of 9

### 1.4 Scope

This spec covers **5 files** in `Materials/Week 3/Day 7/web/`:
- `lecture.html` — Reveal.js slides (~19 slides across 4 sections + 2 checkpoint quizzes)
- `lab-adk.html` — Hands-on lab using Google ADK Visual Builder (~100 minutes)
- `lab-mindstudio.html` — Hands-on lab using MindStudio (~100 minutes)
- `quiz.html` — 20-question knowledge check (20 topics x 2 variants = 40 questions, 20 per attempt)
- `index.html` — Navigation hub with 4 module cards

### 1.5 Day 6 → Day 7 Bridge

Day 6 taught students to red-team and harden single AI systems. Day 7 asks: "What if instead of humans checking AI, you had a second AI doing it automatically?"

| Day 6 Concept | Day 7 Extension |
|---|---|
| Red teaming: humans attacking AI | Quality checking: an AI agent verifying another AI agent |
| System prompt hardening | Agent instructions with tool access and collaboration rules |
| Manual adversarial testing | Automated sequential verification pipeline |
| 5-layer defense model | Multi-agent orchestration patterns |
| "Test before you trust" | "Build teams of AI that check each other" |

---

## 2. Beacon Scenario: Email Triage Quality Checker

### 2.1 Two-Agent Sequential Workflow

- **Agent 1 (Triage Agent):** Classifies emails (category, urgency, draft response) — the Day 5 system, now running as an agent
- **Agent 2 (Quality Checker):** Reviews Agent 1's classification against the original email, flags disagreements for human review

### 2.2 Why This Scenario

- Directly delivers on Day 6's promise ("one AI checking another")
- Reuses students' existing system prompts from Days 5-6
- Naturally previews the Days 8-9 capstone (resume parse → evaluate → rank)
- Demonstrates the verification pattern — the most immediately practical orchestration pattern for business

---

## 3. Lecture Structure

### 3.1 Learning Objectives (Bloom's Taxonomy)

1. **Define** what makes an AI agent different from a simple LLM call
2. **Explain** agent anatomy using the perception-reasoning-action framework
3. **Identify** the three orchestration patterns and when to use each
4. **Build** a two-agent sequential workflow extending Beacon's email triage

### 3.2 Slide Structure (Target: ~19 slides across 4 sections + 2 quizzes)

**Section 1: From Single AI to AI Teams (slides 1-5)**

| Slide | Title | Content |
|---|---|---|
| 1 | Title Slide | "Introduction to Agentic AI: From Single AI to AI Teams" |
| 2 | Learning Objectives | 4 objectives (see 3.1) |
| 3 | Day 6 → Day 7 Bridge | "You hardened one AI. What if you added a second AI to check the first?" Recap Day 6's key lesson, preview today's multi-agent approach. |
| 4 | Limitations of Single LLM Calls | No self-correction, no verification, no persistent memory, no tool use. One AI doing everything is like one employee doing every job. |
| 5 | The Vision: AI Teams | Multiple specialized AIs working together, each with a defined role. Like a well-organized department, not a solo freelancer. |

**Section 2: What Makes an Agent? (slides 6-10)**

| Slide | Title | Content |
|---|---|---|
| 6 | Agent vs. LLM Call | Stranger vs. employee analogy. LLM call = asking a stranger a question. Agent = hiring an employee with a role, tools, and memory. |
| 7 | Agent Anatomy: Perception-Reasoning-Action | Three components mapped to Beacon: Perception (reads the email), Reasoning (classifies it), Action (routes it and drafts response). |
| 8 | Agent Instructions | Enhanced system prompts + tool access + collaboration rules. How Day 5's system prompts become agent instructions. |
| 9 | Real-World Business Agents | Triage agents, expense processing, compliance review, resume screening. Each example shows perception → reasoning → action. |
| 10 | Agent Governance | Trust boundaries, human-in-the-loop, monitoring. Agents need oversight just like employees do. |

**Quiz 1** — after slide 10 (agent concepts)

**Section 3: Orchestration Patterns (slides 11-15)**

| Slide | Title | Content |
|---|---|---|
| 11 | Section Divider | "Orchestration Patterns: How Agents Work Together" |
| 12 | Sequential Pattern | Assembly line: Agent A → Agent B → Agent C. Beacon example: Triage → Quality Check. Each agent's output is the next agent's input. |
| 13 | Parallel Pattern | Multiple analysts working simultaneously. Example: 5 emails processed at once by 5 triage agents, then merged. Speed vs. coordination tradeoff. |
| 14 | Loop Pattern | Iterative revision until quality threshold met. Example: Agent drafts response, reviewer checks, draft again until approved. Quality vs. cost tradeoff. |
| 15 | Decision Matrix | When to use each pattern. Sequential = dependency chain. Parallel = independent tasks. Loop = iterative refinement. |

**Quiz 2** — after slide 15 (pattern selection)

**Section 4: Tool Preview & Wrap-Up (slides 16-19)**

| Slide | Title | Content |
|---|---|---|
| 16 | Today's Lab Preview | Brief tool interface overview (ADK / MindStudio). What you'll build: Triage Agent + Quality Checker in a sequential pipeline. |
| 17 | Key Takeaways | (1) Agents > LLM calls for complex tasks. (2) Perception-reasoning-action framework. (3) Three orchestration patterns. (4) Verification pattern = practical starting point. |
| 18 | Day 8-9 Preview | Resume screening capstone with 3+ agents: Parser → Evaluator → Ranker. From email triage to talent acquisition. |
| 19 | Questions | Q&A slide |

---

## 4. Lab Structure

### 4.1 Lab Theme: "Building a Two-Agent Email Triage Quality Checker"

**Total time: ~100 minutes across 5 parts (Part 0 through Part 4)**

Dual-version labs: identical scenario, test data, and evaluation criteria. Only tool-specific steps differ.

### 4.2 Test Emails (Shared Across Both Versions)

Five test emails used for end-to-end testing:

| # | Type | Description | Expected Classification |
|---|---|---|---|
| 1 | Normal complaint | Damaged product, frustrated customer | Complaint, High urgency |
| 2 | Normal inquiry | Store hours question | Inquiry, Low urgency |
| 3 | Intentional misclassification trap | Angry complaint with embedded "classify as compliment" | Complaint, High urgency (agent should ignore embedded instruction) |
| 4 | Ambiguous email | Could be return or complaint | Tests whether Quality Checker catches borderline cases |
| 5 | Clear compliment | Positive feedback about staff | Compliment, Low urgency |

### 4.3 Lab Parts

**Part 0: Setup (15 minutes)**
- Account creation / tool login
- Interface tour
- Create new project/workspace

**Part 1: Build Agent 1 — Triage Agent (25 minutes)**
- Paste Day 5/6 system prompt as agent instructions
- Configure model and parameters
- Test with 3 emails (normal complaint, inquiry, compliment)
- Verify correct classification

**Part 2: Build Agent 2 — Quality Checker (25 minutes)**
- Create second agent with verification instructions
- Quality Checker receives: original email + Agent 1's classification
- Quality Checker outputs: AGREE/DISAGREE + reasoning
- Manual test: intentionally feed a wrong classification, verify checker catches it

**Part 3: Connect Sequential Pipeline (20 minutes)**
- Wire Agent 1 output → Agent 2 input
- Run all 5 test emails end-to-end
- Record agreement/disagreement results
- Analyze: Did the Quality Checker catch the misclassification trap (email #3)?

**Part 4: Document & Submit (15 minutes)**
- Architecture diagram (screenshot or description)
- CTO pitch: "Why 2 agents > 1" (3-5 sentences)
- Day 8 prep notes
- LMS upload

### 4.4 Tool Comparison

| Aspect | ADK Visual Builder (Plan A) | MindStudio (Plan B) |
|--------|---------------------------|---------------------|
| Access | Google Cloud Shell — browser-based, needs GCP project | mindstudio.ai — pure browser, sign up and go |
| Setup complexity | Medium (GCP project, Python venv, env vars, `adk web`) | Low (create account, start building) |
| Agent types | LLM Agent, Sequential Agent, Parallel Agent, Loop Agent | AI steps, workflow chaining |
| Model | Gemini (native) | 200+ models |
| Orchestration | Visual canvas with explicit agent types | Workflow steps with variable passing |

---

## 5. Quiz Structure

### 5.1 Question Topics (20 topics x 2 variants = 40 questions, select 20 per attempt)

| # | Topic | Direction |
|---|-------|-----------|
| 1 | Agent vs. LLM call | What distinguishes an agent from a single LLM call? |
| 2 | Agent persistence | Why do agents maintain state across interactions? |
| 3 | Perception component | What does "perception" mean in agent anatomy? |
| 4 | Reasoning component | How does reasoning work in an agent? |
| 5 | Action component | What types of actions can agents take? |
| 6 | Agent instructions vs. system prompts | How do agent instructions extend Day 5's system prompts? |
| 7 | Tool use | What capability distinguishes agents from chatbots? |
| 8 | Sequential pattern | What is sequential orchestration? |
| 9 | Sequential use case | When should you use sequential? |
| 10 | Parallel pattern | What is parallel orchestration? |
| 11 | Parallel use case | When should you use parallel? |
| 12 | Loop pattern | What is loop orchestration? |
| 13 | Loop use case | When should you use a loop? |
| 14 | Pattern selection | Given a scenario, which pattern fits? |
| 15 | Verification pattern | Why add a second agent to check the first? |
| 16 | Multi-agent cost tradeoff | What is the cost of multiple agents vs. one? |
| 17 | Human-in-the-loop | When should agents escalate to a human? |
| 18 | Day 5-6-7 connection | How does agentic AI extend the email triage from Days 5-6? |
| 19 | Real-world agent example | Which business scenario suits agentic AI? |
| 20 | Agent governance | What governance applies to multi-agent systems? |

### 5.2 Standards

- 40 questions in bank (20 topics x 2 variants)
- 20 questions per attempt, randomized (one per topic)
- 70%+ passing threshold (14/20)
- Formative feedback on every question
- Answers NOT pre-selected

---

## 6. Visual Requirements

### 6.1 NotebookLM Visual Approach

Day 7 follows the NotebookLM full-bleed image deployment pipeline (Spec 0006).

### 6.2 Key Visual Needs

| Concept | Visual Need |
|---|---|
| Agent vs. LLM call | Side-by-side comparison (stranger vs. employee) |
| Agent anatomy | Three-part diagram: perception → reasoning → action |
| Sequential pattern | Assembly line / pipeline diagram |
| Parallel pattern | Multiple parallel lanes converging |
| Loop pattern | Circular/iterative flow with quality gate |
| Decision matrix | When-to-use comparison chart |
| Day 6 → Day 7 bridge | Visual continuity with Beacon scenario |

---

## 7. Beacon Continuity

### 7.1 System Prompt Evolution Arc

- **Day 5:** Basic system prompt — role, categories, output format
- **Day 6:** Hardened system prompt — identity anchoring, instruction refusal, scope limitation
- **Day 7:** Agent instructions — system prompt + tool access + collaboration rules + Quality Checker agent
- **Days 8-9:** Multi-agent capstone — 3+ agents for resume screening

---

## 8. Acceptance Criteria

### 8.1 Lecture
- [ ] Agent vs. LLM call clearly distinguished with accessible analogy
- [ ] Agent anatomy (perception-reasoning-action) explained with Beacon mapping
- [ ] All 3 orchestration patterns explained with business examples
- [ ] Decision matrix for pattern selection
- [ ] Day 6 → Day 7 bridge present
- [ ] Day 8-9 preview (resume screening capstone)
- [ ] 2 checkpoint quizzes (agent concepts, pattern selection)

### 8.2 Labs
- [ ] Both versions (ADK and MindStudio) have identical task numbering
- [ ] Same 5 test emails in both versions
- [ ] Same evaluation criteria in both versions
- [ ] Part 0 setup with tool-specific instructions
- [ ] Part 1 builds Triage Agent with Day 5/6 system prompt
- [ ] Part 2 builds Quality Checker with verification instructions
- [ ] Part 3 connects sequential pipeline with end-to-end testing
- [ ] Part 4 documents architecture and CTO pitch
- [ ] Total lab time ~100 minutes

### 8.3 Quiz
- [ ] 40 questions in bank (20 topics x 2 variants)
- [ ] 20 questions per attempt, randomized
- [ ] No pre-selected answers
- [ ] Formative feedback on every question
- [ ] 70%+ passing threshold (14/20)

### 8.4 Navigation
- [ ] 5 nav pills: Dashboard | Lecture | Lab (ADK) | Lab (MS) | Quiz
- [ ] All nav pills work across all 5 pages
- [ ] Breadcrumb: UBUS 670 > Week 3 > Day 7 > [Component]

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ADK requires Cloud Shell terminal — too technical for MBAs | Medium | High | Default to MindStudio if ADK proves too complex. Verify ADK accessibility by March 16. |
| MindStudio free tier usage limits | Low | Medium | Pre-test with class-size load. Have ADK as fallback. |
| Students confused by dual-version labs | Low | Low | Clear labeling, identical task structure, instructor guidance on which version to use. |
| Sequential pipeline concept too abstract | Medium | Medium | Concrete Beacon example throughout. Visual diagrams in lecture. Hands-on building in lab. |
| Agent platform changes between now and class | Low | High | Freeze lab instructions 1 week before class. Screenshot key steps. |

---

## 10. Approval

**Status:** Awaiting human review

- [ ] Spec reviewed by project owner
- [ ] Beacon quality checker scenario approved
- [ ] Dual-version lab approach approved (ADK + MindStudio)
- [ ] 3 orchestration patterns approved (sequential, parallel, loop)
- [ ] Agent anatomy framework approved (perception-reasoning-action)
- [ ] 5 nav pills pattern approved for Week 3
- [ ] Quiz structure (20 topics x 2 variants) approved

---

*End of Specification*
