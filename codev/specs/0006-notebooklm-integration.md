# Specification: NotebookLM Integration for Visual & Educational Quality

**Spec ID:** 0006
**Title:** NotebookLM Integration — Visual & Educational Slide Quality Agent
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-02-17
**Parent Spec:** 0001 (UBUS 670 Course Materials)
**Replaces:** 0003 (Nano Banana image generation — partially superseded)

---

## 1. Overview

### 1.1 Purpose

Integrate Google NotebookLM as the primary "agent" for improving the visual and educational quality of UBUS 670 course slides. NotebookLM's Studio features (Slide Deck, Quiz, Flashcards, Infographic, Mind Map) can analyze our existing lecture content and produce higher-quality visual presentations, which we then use to improve the Reveal.js HTML source files.

### 1.2 Problem Statement

Current slides are content-rich but visually basic — text-heavy layouts, minimal imagery, and inconsistent visual design across days. The previous approach (Spec 0003, Nano Banana) focused narrowly on generating individual AI illustrations. NotebookLM offers a higher-level approach: feed it the entire lecture, and it produces a **complete slide deck** with improved visual structure, layout, and educational flow.

### 1.3 Core Workflow

```
Reveal.js HTML → Convert to Markdown → Upload to NotebookLM
                                              ↓
                                    NotebookLM Studio
                                    ├── Slide Deck (primary)
                                    ├── Quiz (compare with ours)
                                    ├── Mind Map (structure review)
                                    └── Infographic (visual ideas)
                                              ↓
                            Review NotebookLM output
                                              ↓
                     Extract improvements → Apply to Reveal.js HTML
```

### 1.4 Scope

This spec covers:

1. **Conversion tool**: `html2md.py` — Reveal.js HTML → Markdown for NotebookLM ingestion
2. **NotebookLM workflow**: What to upload, what to generate, how to evaluate output
3. **Round-trip process**: How improvements flow from NotebookLM back into Reveal.js HTML
4. **Test run**: Day 1 lecture as proof-of-concept

### 1.5 What This Replaces

- **Spec 0003 (Nano Banana)** is partially superseded. The `generate_image.py` tool may still be useful for individual illustrations, but NotebookLM becomes the primary agent for overall slide quality. NotebookLM's slide deck output may include its own visuals.

### 1.6 What NotebookLM Studio Can Produce

| Output Type | Use for UBUS 670 |
|-------------|-------------------|
| **Slide Deck** | Primary — generate improved visual presentation of each day's lecture |
| **Quiz** | Compare against our quiz; identify gaps or better question framings |
| **Flashcards** | Potential student study aid (bonus deliverable) |
| **Mind Map** | Validate our lecture structure and topic flow |
| **Infographic** | Visual ideas for key concepts |
| **Audio Overview** | Potential supplement — podcast-style lecture summary |
| **Video Overview** | Potential supplement |
| **Reports** | Detailed analysis of lecture content |
| **Data Table** | Structured extraction of key facts |

---

## 2. Conversion Pipeline

### 2.1 Why Conversion Is Needed

NotebookLM does not accept HTML files. Our lectures are Reveal.js HTML with embedded CSS, SVGs, and JavaScript. We need to extract the **educational content** into a format NotebookLM can ingest.

**Target format:** Markdown (.md) — preserves structure (headers, lists, tables) while being clean text that NotebookLM handles well.

### 2.2 Conversion Tool: `html2md.py`

**Location:** `Materials/_tools/html2md.py`

**What it extracts:**
- Slide content from `<section>` tags (each section = one slide)
- Headers (`<h1>` through `<h4>`)
- Paragraphs, lists (ordered and unordered)
- Table content
- Alt text from images (describes what visuals are present)
- Speaker notes from `<aside class="notes">`
- SVG diagram descriptions (where available)

**What it strips:**
- All CSS styling
- JavaScript
- Reveal.js framework markup
- Navigation/breadcrumb chrome
- HTML comments (except `<!-- IMAGE PROMPT -->` which are preserved as context)

**What it annotates:**
- Slide boundaries as `---` (horizontal rules) with slide numbers
- Section divider slides marked as `## [Section Title]`
- Visual descriptions noted as `> [Visual: description]`
- Interactive elements noted as `> [Interactive: description]`

### 2.3 Output Format

```markdown
# Day 1: What is Generative AI?

UBUS 670 — AI for Business Leaders | Week 1, Day 1

---

## Slide 1: Title

**What is Generative AI?**
When Machines Learn to Create

> [Visual: Title slide with NIU branding]

---

## Slide 2: Learning Objectives

By the end of today, you will be able to:
1. Define generative AI and distinguish it from traditional software
2. Explain how large language models process and generate text
3. ...

---
```

### 2.4 Additional Context Sources for NotebookLM

For best results, upload these alongside the converted lecture:

| Source | Purpose |
|--------|---------|
| Converted lecture markdown | Primary content to improve |
| `Materials/_shared/IMAGE_GENERATION_GUIDE.md` | Visual style preferences |
| Course syllabus / schedule | Broader context for the day's place in the course |
| Beacon Retail Group case study description | Case study context |
| Instructor feedback files (if available) | Known issues to address |

---

## 3. NotebookLM Workflow

### 3.1 Per-Day Process

For each day of content (one day per session, per existing rule):

**Step 1: Convert**
```bash
python3 Materials/_tools/html2md.py \
  "Materials/Week 1/Day 1/web/lecture.html" \
  -o "Materials/Week 1/Day 1/notebooklm/lecture.md"
```

**Step 2: Upload to NotebookLM**
- Create a notebook for the day (or reuse the course notebook)
- Upload the converted markdown as a source
- Upload any additional context sources (style guide, syllabus, feedback)

**Step 3: Generate Studio Outputs**
- Generate **Slide Deck** (primary deliverable)
- Generate **Mind Map** (structure validation)
- Generate **Quiz** (compare with ours)
- Optionally generate **Infographic** for key concepts

**Step 4: Review & Extract Improvements**
- Compare NotebookLM's slide deck against our current slides
- Identify: better layouts, visual ideas, content reordering, missing topics, clearer explanations
- Document improvements in a structured format

**Step 5: Apply Improvements**
- Feed the improvement list to Claude Code
- Claude Code edits the Reveal.js HTML to incorporate improvements
- Maintain our existing CSS framework and NIU branding

**Step 6: Verify**
- Screenshot updated slides
- Compare before/after
- Human approval

### 3.2 What to Look For in NotebookLM Output

| Dimension | What NotebookLM Might Improve |
|-----------|------------------------------|
| **Visual layout** | Better use of whitespace, image placement, two-column layouts |
| **Content density** | Slides that are too text-heavy → split or simplified |
| **Educational flow** | Better sequencing, clearer transitions between concepts |
| **Visual metaphors** | Stronger analogies or visual representations of concepts |
| **Engagement** | Better discussion prompts, more interactive elements |
| **Completeness** | Topics we missed or underexplained |
| **Clarity** | Jargon that needs simpler explanation for MBA audience |

### 3.3 What NotebookLM Won't Handle

- NIU brand colors and CSS framework (we maintain this)
- Reveal.js-specific features (fragments, transitions, speaker notes)
- Beacon Retail Group case study integration (we maintain narrative continuity)
- Quiz question bank format (our 30+ question / 2-variant format is specific)
- Lab exercises (NotebookLM doesn't know about hands-on tool exercises)

---

## 4. Relationship to Nano Banana (Spec 0003)

### 4.1 What Changes

| Before (Spec 0003) | After (Spec 0006) |
|--------------------|-------------------|
| Nano Banana is the primary visual agent | NotebookLM is the primary visual/quality agent |
| Individual image generation per slide | Whole-deck visual improvement |
| Manual prompt engineering per image | NotebookLM auto-generates visual layout |
| `generate_image.py` as the main tool | `html2md.py` as the main tool |

### 4.2 What Stays

- `generate_image.py` remains available for cases where we need a specific custom illustration
- The style guide principles (warm, professional, NIU colors) still apply
- Human-in-the-loop review is still required
- One day per session rule still applies

---

## 5. Test Run: Day 1

### 5.1 Plan

1. Convert Day 1 `lecture.html` → markdown using `html2md.py`
2. User uploads to NotebookLM and generates a Slide Deck
3. User shares NotebookLM output (screenshots, export, or description)
4. We compare and identify improvements
5. Apply improvements to `lecture.html`

### 5.2 Success Criteria for Test Run

- [ ] Conversion tool produces clean, readable markdown from Day 1 lecture
- [ ] NotebookLM accepts the markdown and generates a slide deck
- [ ] At least 3 actionable improvements identified from NotebookLM output
- [ ] Improvements successfully applied to Reveal.js HTML
- [ ] Instructor approves the improved slides

### 5.3 Decision Point

After the Day 1 test run, decide:
- Is this workflow worth continuing for Days 2-9?
- What adjustments are needed to the conversion or review process?
- Should we use NotebookLM's Quiz output to supplement our quizzes?

---

## 6. Acceptance Criteria

### 6.1 Conversion Tool
- [ ] `html2md.py` converts Reveal.js HTML to clean markdown
- [ ] Slide boundaries are clearly marked
- [ ] Educational content is preserved (headers, lists, tables, descriptions)
- [ ] CSS, JS, and framework markup are stripped
- [ ] Image alt text and visual descriptions are preserved
- [ ] Tool handles all 9 days of lectures (not just Day 1)

### 6.2 Workflow
- [ ] Day 1 test run completed end-to-end
- [ ] NotebookLM slide deck output reviewed and compared
- [ ] At least 3 improvements extracted and applied
- [ ] Process documented for repeating on Days 2-9

### 6.3 Quality
- [ ] Converted markdown is readable and well-structured
- [ ] NotebookLM improvements don't break existing Reveal.js features
- [ ] NIU branding maintained after improvements
- [ ] Beacon case study narrative maintained

---

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| NotebookLM slide deck output is too generic | Medium | Medium | Use additional context sources (style guide, case study) to steer output quality |
| Conversion loses important structural nuance | Low | Medium | Annotate visual descriptions; iterate on converter based on test run |
| Round-trip is too manual/slow | Medium | Low | Streamline after Day 1 test; consider scripting the comparison step |
| NotebookLM output format doesn't export easily | Medium | Medium | User can screenshot, export to Google Slides, or describe improvements verbally |
| NotebookLM capabilities change or require paid tier | Low | High | Verify access before committing to the workflow for all 9 days |

---

## 8. Approval

**Status:** Draft — awaiting human review

- [ ] Spec reviewed by project owner
- [ ] NotebookLM as primary visual agent approved
- [ ] Conversion approach (HTML → Markdown) approved
- [ ] Test run on Day 1 approved
- [ ] Nano Banana transition plan approved (keep as backup, NotebookLM primary)

---

*End of Specification*
