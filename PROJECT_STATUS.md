# Project Status: UBUS 670 Materials

**Last Updated:** Monday, February 17, 2026
**Current Focus:** Day 4 Rework (Spec 0004) - NOT YET IMPLEMENTED

---

## Progress Overview

| Day | Week | Topic | Tool | Status |
|-----|------|-------|------|--------|
| 1 | W1/D1 | What is Generative AI? | Gemini Chat | COMPLETE (committed 2026-02-06) |
| 2 | W1/D2 | Prompt Engineering | Gemini Chat | COMPLETE (committed 2026-02-10) |
| 3 | W1/D3 | Context Engineering | Gemini + Gems | COMPLETE - Reworked (Spec 0002, committed 2026-02-11) |
| 4 | W2/D4 | Multimodal AI | Gemini Multimodal + Nano Banana | SPEC+PLAN WRITTEN (Spec 0004), NOT IMPLEMENTED |
| 5 | W2/D5 | Google AI Studio | AI Studio | SPEC+PLAN DRAFTED (Spec 0005), awaiting human review |
| 6 | W2/D6 | Testing & Guardrails | AI Studio | NOT STARTED |
| 7 | W3/D7 | Agentic AI Intro | ADK Visual Builder / MindStudio | NOT STARTED |
| 8 | W3/D8 | Capstone Build | ADK / MindStudio | NOT STARTED |
| 9 | W3/D9 | Capstone Evaluate | ADK / MindStudio | NOT STARTED |

**Class Dates:** Mon 3/9, Wed 3/11, Fri 3/13, Mon 3/16, Wed 3/18, Fri 3/20, Mon 3/23, Wed 3/25, Fri 3/27

---

## Codev Project Tracking

| ID | Title | Status | Notes |
|----|-------|--------|-------|
| 0001 | UBUS 670 Course Materials (master) | implementing | Days 1-3 complete, Days 4-9 remaining |
| 0002 | Day 3 Context Engineering Rework | committed | Rework complete, committed 2026-02-11. Should be marked `integrated` by human. |
| 0003 | AI Image Generation (Nano Banana) | implementing | Day 3 images done (4/4). Tool at `_tools/generate_image.py`. Days 1-2 retroactive + Days 4-9 pending. |
| 0004 | Day 4 Multimodal AI Rework | planned | Spec + plan written. NOT YET IMPLEMENTED. Current Day 4 files still have old receipt-extraction prototype with partial uncommitted edits. |
| 0005 | Day 5 Google AI Studio | planned | Spec + plan drafted. Awaiting human review/approval. |

**Next available project number:** 0006

---

## Immediate Next Actions (Upon Resume)

### 1. Approve and Implement Day 4 Rework (Spec 0004) - HIGHEST PRIORITY
- **What changed:** Original Day 4 was narrowly focused on text-based receipt extraction (ironically not multimodal at all)
- **New scenario:** "Beacon's Spring Marketing Campaign" combining image understanding, audio understanding, image generation (Nano Banana), and structured output
- **Files to modify:** `Week 2/Day 4/web/` - lecture.html (~80% rework), lab.html (~90% rework), quiz.html (~70% rework), index.html
- **Spec:** `codev/specs/0004-day4-rework.md`
- **Plan:** `codev/plans/0004-day4-rework.md`
- **Instructor feedback:** `Week 2/Day 4/feedback/slide_feedback.md` and `lab_feedback.md`
- **STATUS:** Spec and plan are DRAFTED but NOT YET APPROVED by human. The spec needs human review before implementation begins.

### 2. Approve Day 5 Spec (Spec 0005)
- **Topic:** Google AI Studio - model parameters (temperature, top-p, top-k), system prompts, token economics
- **Lab:** Beacon email triage system (produces a system Day 6 will red-team)
- **Spec:** `codev/specs/0005-day5-ai-studio.md`
- **Plan:** `codev/plans/0005-day5-ai-studio.md`

### 3. Run Critic Reviews on Day 4 After Implementation
- The 4-critic review board (UX, Education, Topic, Accuracy) should review Day 4 materials after the rework is implemented
- Previous critic reviews of the old prototype are moot since the entire framing changed

### 4. Days 6-9 Need Specs
- Day 6: Testing & Guardrails (red-teaming the systems built in Days 4-5)
- Days 7-9: Agentic AI + Capstone - need dual versions for Plan A (ADK Visual Builder) + Plan B (MindStudio backup)

---

## Uncommitted Changes (as of 2026-02-17)

```
D  "Week 2/Day 4/feeback/lab_feedback.md"           # old typo dir being deleted
D  "Week 2/Day 4/feeback/lab_handwritten_damaged_receipt_feedback"
D  "Week 2/Day 4/feeback/slide31"
D  "Week 2/Day 4/feeback/slide_feedback.md"
M  "Week 2/Day 4/web/lab.html"                      # partial edits from prior session
M  "Week 2/Day 4/web/lecture.html"                   # partial edits from prior session
?? "Week 2/Day 4/feedback/"                          # corrected spelling
?? "Week 2/Day 4/web/generate_assets.sh"             # Nano Banana asset generation script
```

**Note:** The modified lab.html and lecture.html contain partial edits from a prior session that hit a rate limit. These are from the OLD receipt-extraction prototype and should be either committed as-is or reverted before starting the Spec 0004 rework.

---

## Architecture & Workflow

### Tech Stack
- **Slides:** Reveal.js HTML presentations
- **Diagrams:** Custom SVGs with NIU brand colors
- **Images:** Nano Banana API (`gemini-2.5-flash-image`) via `google-genai` SDK, WebP format
- **Image tool:** `Materials/_tools/generate_image.py`
- **AI ecosystem:** Gemini-focused (NOT ChatGPT), Gemini 2.5
- **Project management:** Codev workflow (specs, plans, reviews, lessons learned)

### Generator-Critic Workflow
1. **Input Analysis** - Read plan, lessons, templates, prior day files
2. **Prototype Generation** - Generate index, lecture, lab, quiz
3. **Review Board** - 4 critic personas in parallel:
   - **UX Designer** (`_generator_system/prompts/critic_ux.md`)
   - **Educational Expert** (`_generator_system/prompts/critic_edu.md`)
   - **Topic Expert** (`_generator_system/prompts/critic_topic.md`)
   - **Accuracy & Audience** (`_generator_system/prompts/critic_accuracy.md`)
4. **Human Checkpoint** - Present synthesized critique, get approval
5. **Apply Changes** - Implement approved feedback
6. **Lessons Learned** - Document in `codev/lessons/0001-course-materials.md`

### Session Management Rule
**One day of content per session.** Generate Day N -> review -> approve -> commit -> start a NEW session for Day N+1. This prevents context overflow (sessions have hit context limits 4+ times).

### Image Generation (Spec 0003 / Nano Banana)
- **Model:** `gemini-2.5-flash-image` via `google-genai` SDK
- **Cost:** ~$0.03/image, 2 images/minute free tier
- **Two modes:**
  - Mode A (Text-Free): Pure illustration, no text in image
  - Mode B (Hybrid): AI character illustrations + HTML text overlays
- **Rule:** NEVER rely on AI-generated text in images (consistent misspellings)
- **Format:** WebP at q85 (60-100KB vs 1.2-1.5MB PNGs)
- **Every image must teach, not just decorate**

---

## Key Decisions & Preferences

### Course Design
- **Audience:** MBA students, no work experience, not tech-savvy
- **Format:** Web Modules (HTML/JS) with Reveal.js, NOT PPTX/PDF
- **Case Study:** Beacon Retail Group (25 stores, 1,200 employees, $312M revenue)
- **No Google Workspace references** (NIU students don't have it)
- **Google Opal is OK** (free beta, personal Google accounts)
- **ChatGPT references removed** - focus on Gemini ecosystem
- **RAG-first** (fine-tuning de-emphasized per 2026 consensus)

### Pedagogical Patterns
- Story-driven teaching creates emotional hooks ("Accidental Fine-Tuner" pattern)
- Three-way comparisons as experiential learning format
- Scenario-based > theory-based for MBA audience
- Misconception-first pedagogy: surface the wrong belief, THEN correct it
- Define all technical terms at first use with callout/tip boxes
- "Compare with Classmates" boxes in labs highlight AI non-determinism

### Quality Standards
- SVG: 12-14px labels, 9-10px subtitles (never below 9px), rounded rects, drop shadows, curved arrows, NIU colors
- Quiz: 20+ questions, 2 variants per topic, randomized, 70%+ passing, formative feedback
- Lab: PDF download + LMS upload, dedicated Tool Setup section, "Compare with Classmates" boxes
- Breadcrumb: UBUS 670 > Week X > Day Y > [Component]
- Git: NEVER use `git add -A` or `git add .` -- always add files explicitly

### NIU Brand Colors
- Red: #C8102E
- Navy: #1D428A (also #003366 used)
- Blue: #00A9E0
- Orange: #E35205
- Green: #43B02A
- Fonts: Montserrat (headings), Georgia (body), Fira Code (code)

---

## Session History

| Date | Session | Key Work |
|------|---------|----------|
| Feb 4-6 | b22cbc91 | Initial course design, tool choices, Phase 0 foundation, Day 1 complete |
| Feb 10-11 | 7037c886 | Day 2 complete, Day 3+4 prototypes generated (critic reviews collected but lost to context overflow) |
| Feb 12-13 | c2b9cf08 | Day 3 rework (Spec 0002) complete, Nano Banana images (Spec 0003) done, Day 4+5 specs drafted, directory flattened |
| Feb 12-13 | 680fc8e1 | (Materials folder) Day 4 partial edits, hit rate limit |

---

## Key File Locations

- **Course materials:** `Materials/Week X/Day Y/web/`
- **Generator system:** `Materials/_generator_system/`
- **Image generation tool:** `Materials/_tools/generate_image.py`
- **Critic prompts:** `Materials/_generator_system/prompts/`
- **Specs:** `codev/specs/`
- **Plans:** `codev/plans/`
- **Lessons learned:** `codev/lessons/0001-course-materials.md`
- **Project list:** `codev/projectlist.md`
- **Feedback files:** `Materials/Week X/Day Y/feedback/`

---

## Datasets Still Needed

| Dataset | For Day | Status |
|---------|---------|--------|
| Competitor ad images (2-3) | Day 4 | Not created (Nano Banana will generate) |
| Audio clip (~1-2 min customer feedback) | Day 4 | Not created |
| Customer emails (15+) | Day 5 | Not created |
| Resumes (40-50 with hidden patterns) | Days 7-9 | Not created |

---
