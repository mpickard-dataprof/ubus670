# Specification: UBUS 670 Course Materials

**Spec ID:** 0001
**Title:** UBUS 670 - AI for Business Leaders Course Materials
**Status:** Approved
**Author:** Claude (Architect)
**Created:** 2026-02-04

---

## 1. Overview

### 1.1 Purpose

Develop complete course materials for UBUS 670: AI for Business Leaders, a 9-day intensive MBA course teaching students to evaluate, direct, and govern AI initiatives in business contexts.

### 1.2 Audience

- **Students:** MBA candidates with no prior work experience
- **Background:** Recent undergraduate graduates, various business-related fields
- **Technical level:** Not "tech-savvy" — content must be accessible, no-code/low-code focused
- **Goal:** Create "AI-aware" future business leaders

### 1.3 Course Schedule

- **Duration:** 3 weeks (9 class sessions)
- **Dates:** March 9-27, 2026
- **Schedule:** Monday, Wednesday, Friday
- **Time:** 8:30 AM - 12:30 PM (4 hours per session)
- **Location:** Barsema Hall 331
- **Hands-on requirement:** At least 50% of class time

---

## 2. Course Philosophy

### 2.1 Learning Priorities (Ranked)

1. **Evaluate** — Assess when/where AI creates genuine business value (HIGH)
2. **Direct** — Craft effective prompts and context for AI systems (HIGH)
3. **Govern** — Identify risks and governance requirements (woven throughout)
4. **Lead** — Design and communicate AI initiatives (woven throughout)

### 2.2 Instructional Approach

- **Business-focused:** All examples and labs tied to business applications
- **Hands-on:** Labs are the centerpiece, not lectures
- **Progressive complexity:** Simple → Complex tool progression
- **Case study driven:** Running scenario provides continuity

---

## 3. Running Case Study: Beacon Retail Group

### 3.1 Company Profile

- **Name:** Beacon Retail Group
- **Type:** Regional retail chain
- **Size:** 25 stores, 1,200 employees
- **Challenges:** Seasonal hiring (HR), Customer personalization (Marketing), Expense management & forecasting (Finance)

### 3.2 Student Role

Students serve as the **"AI Strategy Task Force"** advising Beacon's leadership on AI adoption opportunities, implementation approaches, and governance requirements.

### 3.3 Case Study Arc

| Week | Focus | Beacon Challenge |
|------|-------|------------------|
| 1 | Foundations | Understanding AI capabilities for Beacon |
| 2 | Building | Solving specific Beacon problems (expenses, customer service) |
| 3 | Capstone | Multi-agent resume screening for seasonal hiring |

---

## 4. Tool Progression

| Days | Tool | Purpose | Complexity |
|------|------|---------|------------|
| 1-2 | Google Gemini Chat | Pure prompt engineering | Entry-level |
| 3-4 | Google Opal | Visual workflows, context engineering | Intermediate |
| 5-6 | Google AI Studio | Parameters, multimodal, system prompts | Intermediate+ |
| 7-9 | **Plan A:** Google ADK Visual Builder | Multi-agent workflows | Advanced |
| 7-9 | **Plan B:** MindStudio (backup) | Multi-agent workflows | Advanced |

### 4.1 Tool Selection Criteria

- Generous free tier (no student cost)
- No-code or low-code interface
- Accessible to non-technical users
- Current/relevant to 2026 AI landscape

### 4.2 Days 7-9 Tool Decision

- **Plan A (Primary):** Google ADK Visual Builder — Visual workflow designer, AI assistant, Sequential/Loop/Parallel agent patterns
- **Plan B (Backup):** MindStudio — Production-ready, 200+ models, visual builder with templates
- **Rationale:** ADK Visual Builder is experimental and may be buggy; MindStudio provides a stable fallback

---

## 5. Nine-Day Curriculum

### Week 1: Foundations (Gemini Chat → Opal)

#### Day 1: What is Generative AI?

**Learning Objectives:**
- Explain how LLMs work at a conceptual level (tokens, embeddings, attention)
- Define context windows and their business implications
- Identify hallucination risks and mitigation strategies
- Navigate Google Gemini Chat interface

**Lab:** Explore Gemini Chat with Beacon scenarios (summarization, Q&A, drafting)

---

#### Day 2: Prompt Engineering

**Learning Objectives:**
- Apply the Role/Context/Task/Format/Constraints framework
- Distinguish zero-shot, few-shot, and chain-of-thought prompting
- Iterate prompts based on output quality
- Recognize prompt injection risks

**Lab:** Craft prompts for Beacon HR (job descriptions, interview questions)

---

#### Day 3: Context Engineering

**Learning Objectives:**
- Explain why context engineering extends beyond prompts
- Prepare briefing documents for AI consumption
- Understand RAG at a conceptual level
- Use Google Opal to build context-aware workflows

**Lab:** Build a Beacon company knowledge assistant using Opal

**Dataset required:** Beacon briefing documents (company background, org chart, financials, strategic plan)

---

### Week 2: Building Capabilities (Opal → AI Studio)

#### Day 4: Multimodal AI

**Learning Objectives:**
- Explain multimodal capabilities (text, image, document)
- Extract structured data from unstructured documents
- Identify appropriate use cases for vision AI
- Handle edge cases (poor quality images, handwriting)

**Lab:** Build expense receipt processor for Beacon Finance

**Dataset required:** 25-30 expense receipt images (varied formats, handwriting, damage)

---

#### Day 5: Google AI Studio

**Learning Objectives:**
- Configure model parameters (temperature, top-p, top-k)
- Write effective system prompts
- Estimate and manage token costs
- Build reusable AI configurations

**Lab:** Build customer email triage and response system for Beacon

**Dataset required:** 40-50 customer emails (complaints, returns, compliments, inquiries)

---

#### Day 6: Testing & Guardrails

**Learning Objectives:**
- Define evaluation criteria for AI systems
- Conduct red-teaming exercises
- Build evaluation rubrics
- Assess deployment readiness

**Lab:** Red-team the systems built in Days 4-5, document vulnerabilities

---

### Week 3: Multi-Agent & Capstone (ADK Visual Builder / MindStudio)

#### Day 7: Introduction to Agentic AI

**Learning Objectives:**
- Define agents vs. simple LLM calls
- Explain agent anatomy (perception, reasoning, action)
- Identify orchestration patterns (sequential, parallel, loop)
- Navigate ADK Visual Builder / MindStudio interface

**Lab:** Build a simple two-agent workflow (research + summarize)

---

#### Day 8: Capstone Part 1 — Build

**Learning Objectives:**
- Design multi-agent architecture for a business problem
- Implement agent roles and handoffs
- Test agent interactions
- Debug agent workflows

**Lab:** Build multi-agent resume screening system for Beacon seasonal hiring

**Dataset required:** 40-50 fictional resumes with hidden patterns (see Section 6.4)

---

#### Day 9: Capstone Part 2 — Evaluate & Present

**Learning Objectives:**
- Evaluate agent system performance
- Identify bias and fairness issues
- Optimize agent workflows
- Communicate AI solutions to business stakeholders

**Lab:** Optimize resume screening system, discover hidden patterns in data

**Presentation:** "Show and tell" to Beacon's Board (graded, see Section 7.2)

---

## 6. Datasets

### 6.1 Beacon Briefing Documents (Day 3)

Create a coherent set of company documents:
- Company overview and history (1-2 pages)
- Organizational chart
- Recent financial summary
- Strategic plan excerpt
- Current challenges memo from CEO

### 6.2 Expense Receipts (Day 4)

Create 25-30 receipt images with variety:
- Restaurant receipts
- Office supply receipts
- Travel receipts (hotel, transportation)
- Handwritten receipts
- Damaged/faded receipts
- Foreign currency receipts
- Digital receipts (screenshots)

### 6.3 Customer Emails (Day 5)

Create 40-50 emails across categories:
- Complaints (product issues, service failures)
- Returns/exchanges
- Compliments
- General inquiries
- Escalation requests
- Multi-issue emails

### 6.4 Resumes with Hidden Patterns (Days 7-9)

Create 40-50 fictional resumes with embedded patterns for students to discover:

**Layer 1 — Surface Red Flags:**
- Employment gaps (some explained, some not)
- Job hopping vs. legitimate career growth
- Inflated titles ("Regional Director" at 3-person startup)

**Layer 2 — Cross-Reference Discoveries:**
- 5 candidates from "Northfield Community College" share identical formatting (same career center template)
- 2 candidates list the same manager as a reference (they know each other)

**Layer 3 — Story to Uncover:**
- Candidate "Jordan Chen" looks perfect on paper
- Previous employer "Lakeside Goods" went bankrupt amid inventory fraud allegations
- Jordan was "Inventory Manager" during that period
- Not disqualifying, but worth flagging for interview questions

**Layer 4 — Bias Testing:**
- Pairs of nearly identical resumes with different names
- Non-traditional candidates (career changers, older workers) who actually fit well

**Layer 5 — Easter Eggs:**
- One resume has a cover letter with "I'm an AI-generated test resume" buried in the middle
- One candidate's hobby is "prompt engineering"

---

## 7. Assessment

### 7.1 Formative Assessment

- **Daily quizzes:** Knowledge checks with formative feedback (explains "why")
- **Lab outputs:** Collected in student portfolio
- **No midterm or final exam**

### 7.2 Capstone Presentation Rubric (Day 9)

| Category | Excellent (A) | Proficient (B) | Developing (C) | Points |
|----------|--------------|----------------|----------------|--------|
| **System Functionality** | Works reliably, handles edge cases | Works for standard cases | Works partially or inconsistently | /25 |
| **Business Value** | Clear ROI, solves Beacon's problem | Addresses problem adequately | Loosely connected to need | /25 |
| **Agent Design Quality** | Thoughtful roles, clean orchestration | Reasonable structure | Poorly defined or redundant | /20 |
| **Critical Thinking** | Proactively identifies limitations, bias risks | Acknowledges some limitations | Overclaims or ignores weaknesses | /15 |
| **Communication** | Clear demo, explains decisions well | Organized presentation | Confusing or unprepared | /15 |

**Bonus Opportunities (+5 each, max +10):**
- Discovered and explained a hidden pattern in resume data
- Implemented creative feature beyond requirements (e.g., bias detection, confidence scoring)

---

## 8. Content Format

### 8.1 Per-Day Deliverables

Each day produces a **Course Hub** containing:

1. **index.html** — Navigation hub linking all components
2. **lecture.html** — Reveal.js presentation slides
3. **lab.html** — Hands-on lab instructions
4. **quiz.html** — Interactive knowledge check

### 8.2 Technical Standards

- **Framework:** HTML5 with Reveal.js for presentations
- **Styling:** Consistent CSS across all days
- **Interactivity:** JavaScript for quizzes and lab interactions
- **Accessibility:** WCAG 2.1 AA compliance where feasible

### 8.3 Visual Educator Rule

Slides must be:
- Rich in visuals, diagrams, and analogies
- Free of text-heavy walls
- Supported by high-quality graphics and visuals that relate to and help explain the content
- Using business metaphors students understand

### 8.4 Visual Content Creation

Diagrams and visuals are created during development using a "Visual Content Creator" agent approach:
- Create visuals in context as each day's content is developed
- Iterate visuals alongside content
- Ensure tight integration between explanations and graphics

---

## 9. Development Workflow

### 9.1 Day-by-Day Process

Development proceeds **one day at a time** with the following cycle:

```
For each Day (1-9):
  1. GENERATE  — Draft day's materials (lecture, lab, quiz)
  2. CRITIQUE  — Review against criteria (Content Expert + AI Expert perspectives)
  3. ITERATE   — Refine based on feedback (2-3 rounds)
  4. APPROVE   — Human approval checkpoint (REQUIRED)
  5. CAPTURE   — Document lessons learned
  6. NEXT      — Move to next day ONLY after approval
```

### 9.2 Review Criteria

**Content Developer / Expert Instructor lens:**
- Learning objectives clear and Bloom's-aligned
- Scaffolding from simple → complex
- Active learning elements present
- Assessment provides formative feedback
- Cognitive load appropriately chunked

**Business AI Expert lens:**
- Terminology accurate and current
- Depth beyond surface-level hype
- Frameworks and mental models concrete
- Labs reflect real business problems
- Business value connections clear

### 9.3 Lessons Capture

After each day is approved, document in `codev/lessons/0001-course-materials.md`:
- What worked well
- What required significant revision
- Patterns to apply to future days
- Content or approach to avoid

### 9.4 Human Approval Gates

**Non-negotiable:** No advancing to the next day until current day receives explicit human approval.

---

## 10. Deliverables Summary

### 10.1 Course Materials (9 days × 4 files = 36 files minimum)

```
Materials/Materials/
├── Week 1/
│   ├── Day 1/web/  (index, lecture, lab, quiz)
│   ├── Day 2/web/
│   └── Day 3/web/
├── Week 2/
│   ├── Day 1/web/  (Day 4)
│   ├── Day 2/web/  (Day 5)
│   └── Day 3/web/  (Day 6)
└── Week 3/
    ├── Day 1/web/  (Day 7) — Plan A + Plan B versions
    ├── Day 2/web/  (Day 8) — Plan A + Plan B versions
    └── Day 3/web/  (Day 9) — Plan A + Plan B versions
```

### 10.2 Datasets (4 datasets)

- Beacon briefing documents
- Customer emails
- Expense receipt images
- Resumes with hidden patterns

### 10.3 Supporting Materials

- Capstone rubric (printable)
- Lessons learned document
- Instructor notes (optional, as needed)

### 10.4 Dual-Version Requirement (Days 7-9)

Days 7-9 require two versions of lab materials:
- **Plan A:** Google ADK Visual Builder instructions
- **Plan B:** MindStudio instructions

Lectures and quizzes can be shared; only lab instructions differ.

---

## 11. Out of Scope

- Syllabus document (separate deliverable)
- Grading policies (university standard)
- LMS integration (Canvas upload is manual)
- Video recordings
- Student accounts setup

---

## 12. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ADK Visual Builder too buggy | Medium | High | Plan B (MindStudio) ready |
| Google Opal changes significantly | Low | Medium | Monitor, adjust Day 3-4 if needed |
| Tool free tier limitations | Low | Low | Verified generous free tiers |
| Content too technical for audience | Medium | High | Review criteria includes accessibility check |

---

## 13. Approval

**Approved:** 2026-02-04

- [x] Spec reviewed by project owner
- [x] Curriculum outline approved
- [x] Development workflow approved
- [x] Tool choices confirmed

---

*End of Specification*
