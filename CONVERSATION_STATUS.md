# UBUS 670 Course Development - Conversation Status

**Last Updated:** 2026-02-04 (Session paused)
**Session Goal:** Build course materials for UBUS 670 using SPIDER protocol

---

## Current Phase: Implementation — Phase 0 Complete

Spec, Plan, and Phase 0 (Foundation Setup) approved. Ready to begin **Day 1 development**.

---

## Key Decisions Made

### Audience & Context
- **Students:** MBA students, no work experience, not tech-savvy
- **Duration:** 3 weeks (9 days), MoWeFr 8:30AM-12:30PM, Mar 9-27, 2026
- **Class Structure:** 4 hours per day, at least 50% hands-on

### Course Philosophy (Priority Order)
1. **Evaluate** when/where AI creates business value (HIGH)
2. **Direct** AI tools effectively - prompt/context engineering (HIGH)
3. **Govern** AI use responsibly (lighter, woven throughout)
4. **Lead** AI initiatives (lighter, woven throughout)

### Business Domains
- HR, Marketing, Finance (not all 5 from original outline)

### Running Case Study
- **"Beacon Retail Group"** - Regional retail chain, 25 stores, 1,200 employees
- Students act as "AI Strategy Task Force" advising leadership
- Challenges span HR (seasonal hiring), Marketing (personalization), Finance (forecasting, expenses)

### Tool Progression
| Days | Tool | Purpose |
|------|------|---------|
| 1-2 | Google Gemini Chat | Pure prompt engineering |
| 3-4 | Google Opal | Visual workflows, context engineering |
| 5-6 | Google AI Studio | Parameters, multimodal, system prompts |
| 7-9 | **Plan A:** Google ADK Visual Builder | Multi-agent capstone |
| 7-9 | **Plan B:** MindStudio (backup) | Multi-agent capstone |

**Note:** Google Workspace Studio rejected (task automation like Zapier, not agent building). Vertex AI Agent Designer (VAIAD) evaluated but too limited. ADK Visual Builder is experimental but more capable. MindStudio as backup if ADK is too buggy.

### Assessment
- Daily quizzes (formative)
- Portfolio-based (compile lab outputs)
- No midterm/final exam

### Content Per Day
1. Presentation (Reveal.js slides)
2. Quiz (knowledge check)
3. Hands-on Lab (~2 hours)

### Governance Approach
- NOT a full day - spread throughout course
- Days 8-9 focus on hands-on capstone instead
- Red-teaming lab (originally Day 6) is well-received

### Multi-Agent Coverage
- 2 days (Days 8-9) for multi-agent capstone
- Students build a resume screening system for Beacon's seasonal hiring

---

## Proposed 9-Day Outline

### Week 1: Foundations (Gemini Chat → Opal)
- **Day 1:** What is Generative AI? (LLM mental model, tokens, context windows, hallucinations)
- **Day 2:** Prompt Engineering (Role/Context/Task/Format/Constraints, zero-shot, few-shot, chain-of-thought)
- **Day 3:** Context Engineering (context windows, briefing documents, RAG intro, Opal introduction)

### Week 2: Building Capabilities (Opal → AI Studio)
- **Day 4:** Multimodal AI (vision, document extraction, expense receipt processing lab)
- **Day 5:** Google AI Studio (parameters, system prompts, cost management, customer email system lab)
- **Day 6:** Testing & Guardrails (red-teaming, evaluation rubrics, deployment readiness)

### Week 3: Multi-Agent & Capstone (ADK Visual Builder / MindStudio)
- **Day 7:** Introduction to Agentic AI (agent anatomy, orchestrator patterns, tool intro)
- **Day 8:** Capstone Part 1 - Build multi-agent resume screening system
- **Day 9:** Capstone Part 2 - Evaluate, optimize, present to "Beacon's Board"

**Plan A (ADK Visual Builder):** Sequential/Loop/Parallel agents, AI assistant, exports to code
**Plan B (MindStudio backup):** Visual builder, 200+ models, templates, production-ready

---

## Topics to Cover (Confirmed)
- LLMs and how generative AI works (conceptual)
- Multimodal capabilities
- Context/input windows
- RAG (Retrieval Augmented Generation) - conceptual intro
- Prompt engineering → Context engineering evolution
- Cost management (token usage)
- Multi-agent workflows (2 days)
- Agent evaluation and guardrails

---

## Open Questions - RESOLVED

1. **Days 7-9 Tool** ✅
   - Plan A: Google ADK Visual Builder
   - Plan B: MindStudio (backup)
   - Rejected: Workspace Studio (wrong purpose), VAIAD (too limited)

2. **Resume data for capstone** ✅ Create fictional resumes with hidden patterns:
   - Layer 1: Surface red flags (gaps, job hopping, inflated titles)
   - Layer 2: Cross-reference discoveries (same references, same templates)
   - Layer 3: Story to uncover ("Jordan Chen" + Lakeside Goods fraud)
   - Layer 4: Bias testing (similar qualifications, different names)
   - Layer 5: Easter eggs (AI-generated test resume, prompt engineering hobby)

3. **Day 9 Presentations** ✅ Informal "show and tell" style, but graded
   - Rubric: Functionality (25), Business Value (25), Agent Design (20), Critical Thinking (15), Communication (15)
   - Bonus: +5 for discovering hidden patterns, +5 for creative features

4. **Visual aids** ✅ Use "Visual Content Creator" agent during development
   - Create visuals in context as we develop each day's materials
   - Better integration than listing requirements in spec

---

## Datasets to Create

| Dataset | For Day | Contents |
|---------|---------|----------|
| Beacon briefing docs | Day 3 | Company background, org chart, financials, strategic plan |
| Expense receipts | Day 4 | 25-30 images with varied formats, handwriting, damage |
| Customer emails | Day 5 | 40-50 emails (complaints, returns, compliments, inquiries) |
| Resumes | Days 7-9 | 40-50 resumes with hidden patterns (see above) |

---

## Files Created/Modified This Session

- `WORKSPACE.md` - Consolidated workspace configuration and reminders
- `CONVERSATION_STATUS.md` - This file
- Removed: `Materials/create-google-slides/` (per user request)
- Removed: Duplicate codev setup in `Materials/` folder

---

## Existing Materials (For Reference)

- `Materials/Materials/Week 1/Day 1/web/` - Existing HTML materials (index, lecture, lab, quiz)
- `Materials/Materials/_generator_system/` - Generator-Critic workflow templates
- `UBUS 670 - AI for Business Leaders - Original.docx` - Original 8-week outline (reference only)

---

## Research Completed

### Google Opal AI
- No-code AI mini-app builder with visual workflow editor
- Two modes: conversational and visual
- Step-by-step debugging
- Connects to Google ecosystem
- Free as of late 2025

### Google Workspace Studio
- GA December 2025
- No-code agent builder
- Uses Gemini 3
- Integrates with Workspace + enterprise apps

### Google ADK Visual Builder (Plan A for Days 7-9)
- Web-based IDE for building ADK agents
- Visual workflow designer with drag-and-drop
- AI assistant generates agent architecture from natural language
- Supports: LLM agents, Sequential, Loop, Parallel patterns
- Live testing in the same interface
- Generates YAML config + Python code
- Status: **Experimental** - some advanced features not supported
- Beginner-friendly but may be buggy

### MindStudio (Plan B backup for Days 7-9)
- Purpose-built for non-technical users
- Free tier: 1,000 runs/month (sufficient for class)
- 200+ models including GPT-4, Claude, Gemini
- Visual builder with templates
- Production-ready (not experimental)
- Educational bootcamps and certifications available
- Not Google ecosystem (tradeoff)

---

## Next Steps

1. ~~Answer the 4 open questions above~~ ✅ DONE
2. ~~Finalize the 9-day outline~~ ✅ DONE
3. ~~Write the formal spec~~ ✅ DONE (`codev/specs/0001-course-materials.md`)
4. ~~Get human approval on spec~~ ✅ APPROVED (2026-02-04)
5. ~~Write the plan~~ ✅ APPROVED (2026-02-04) (`codev/plans/0001-course-materials.md`)
6. ~~Phase 0: Foundation Setup~~ ✅ COMPLETE (2026-02-04)
7. **NEXT:** Begin Day 1 material development

**Note:** Days 7-9 materials need dual versions (ADK Visual Builder + MindStudio backup)

---

## Phase 0 Completed Assets

### Shared Styles (`Materials/Materials/_shared/`)
- `STYLE-GUIDE.md` — NIU brand guidelines reference
- `styles.css` — Base CSS with NIU colors, typography, components
- `reveal-theme-niu.css` — Reveal.js presentation theme

### Beacon Case Study (`Materials/Materials/_case-study/`)
- `beacon-overview.md` — Company profile (25 stores, $312M revenue)
- `beacon-ceo-memo.md` — AI Task Force mission and challenges
- `beacon-org-chart.md` — Leadership and departmental structure
- `beacon-financials.md` — Financial data, KPIs, cost of challenges
- `beacon-strategy.md` — Strategic plan 2025-2027

---

## How to Resume This Conversation

When starting a new Claude Code session on your other computer:

1. Open Claude Code in this project directory
2. Say: **"Please read CONVERSATION_STATUS.md and WORKSPACE.md to restore context. We were building the course outline for UBUS 670."**
3. I'll read the files and we can continue from where we left off

---
