# Specification: NotebookLM Integration for Visual & Educational Quality

**Spec ID:** 0006
**Title:** NotebookLM Integration — Visual & Educational Slide Quality Agent
**Status:** Approved (proven across Days 1-5)
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

## 3. NotebookLM Workflow (Refined After Day 1 Test Run)

### 3.1 Test Run Results (2026-02-17)

The Day 1 test run produced dramatically better slides — 15 slides with consistent isometric illustrations, full-screen layouts, and strong visual storytelling. Key findings:

- NotebookLM generates high-quality AI illustrations (isometric, blueprint-style)
- It condensed 38 slides → 15, with sharper business framing
- It hallucinated some facts ("Gemini 3 Pro") — content verification still needed
- Dark theme looks stunning but doesn't match NIU brand
- **Decision:** Stay with NIU light theme, but adopt NotebookLM's layout quality and extract its illustrations

### 3.2 Context Package (Upload to NotebookLM)

For best results, upload these files as sources:

| File | Purpose |
|------|---------|
| `notebooklm/PROJECT_BRIEF.md` | Audience, brand, goals, specific improvements needed |
| `notebooklm/day{N}-slides-current.pdf` | Current slides so NotebookLM sees the visuals |
| `notebooklm/INSTRUCTOR_FEEDBACK.md` | Known issues to address |
| `notebooklm/lecture.md` | Full text content for analysis |
| (Optional) Reference materials (PPTX, etc.) | Depth/quality examples from instructor |

### 3.3 Per-Day Process

**Step 1: Prepare context package**
```bash
# Convert lecture to markdown
python3 Materials/_tools/html2md.py \
  "Materials/Week X/Day Y/web/lecture.html" \
  -o "Materials/Week X/Day Y/notebooklm/lecture.md"

# Generate PDF of current slides
npx decktape reveal \
  "file://$(pwd)/Materials/Week X/Day Y/web/lecture.html" \
  "Materials/Week X/Day Y/notebooklm/dayY-slides-current.pdf" \
  --size 1920x1080 --chrome-arg=--no-sandbox
```

Also prepare `PROJECT_BRIEF.md` and `INSTRUCTOR_FEEDBACK.md` in the notebooklm/ directory.

**Step 2: Upload to NotebookLM & generate Slide Deck**
- Create a notebook, upload all context files
- Generate **Slide Deck** (primary)
- Optionally generate Mind Map, Quiz, Infographic

**Step 3: Export & extract illustrations**
- Download NotebookLM output as .pptx (preferred) or export PDF
- Extract slide images:
```bash
# From .pptx — extracts embedded illustrations:
python3 Materials/_tools/extract_slides.py output.pptx \
  -o "Materials/Week X/Day Y/notebooklm/extracted/"

# From .pdf — renders full slides as PNGs:
python3 Materials/_tools/extract_slides.py output.pdf \
  -o "Materials/Week X/Day Y/notebooklm/extracted/"
```

**Step 4: Deploy as full-bleed image slides in Reveal.js**

> **IMPORTANT (Lesson from Day 1):** Do NOT recreate NotebookLM content in HTML.
> This duplicates text and loses visual quality. Use the slide PNGs directly.

- Copy extracted PNGs to `web/images/slide-XX.png`
- Copy source PDF to `web/day{N}-lecture.pdf` for student download
- Each `<section>` uses `data-background-image` with `data-background-size="contain"`
- Add speaker notes on every image slide (accessibility + presenter support)
- Inject interactive HTML-only slides (quizzes) between image slides as needed
- Add PDF download link to nav bar
- Only RevealNotes plugin needed (remove Markdown, Highlight)

**Step 5: Verify & approve**
- Open in browser, check all images load and scale correctly
- Test interactive quizzes
- Verify nav links (Dashboard, Lab, Quiz, PDF)
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

## 4. Toolchain

### 4.1 Tools Summary

| Tool | Location | Purpose | Status |
|------|----------|---------|--------|
| `html2md.py` | `Materials/_tools/html2md.py` | Convert Reveal.js HTML → Markdown | Built, tested |
| `extract_slides.py` | `Materials/_tools/extract_slides.py` | Extract images from .pptx or render .pdf pages | Built, tested |
| `generate_image.py` | `Materials/_tools/generate_image.py` | Nano Banana backup image generation | Existing (Spec 0003) |
| Python venv | `Materials/_tools/.venv/` | python-pptx dependency for extraction | Configured |

### 4.2 Dependencies

- `pdftoppm` (poppler-utils) — renders PDF pages as PNG images
- `npx decktape` — generates PDF from Reveal.js HTML
- `python-pptx` — extracts embedded images from .pptx (installed in venv)
- `google-chrome` — headless browser for decktape

### 4.3 Relationship to Nano Banana (Spec 0003)

| Before (Spec 0003) | After (Spec 0006) |
|--------------------|-------------------|
| Nano Banana is the primary visual agent | NotebookLM is the primary visual/quality agent |
| Individual image generation per slide | Whole-deck visual improvement + illustration extraction |
| Manual prompt engineering per image | NotebookLM auto-generates visual design |
| `generate_image.py` as the main tool | `html2md.py` + `extract_slides.py` as the main tools |

`generate_image.py` remains available as backup for custom illustrations NotebookLM doesn't cover.

---

## 5. Test Run: Day 1 (Completed)

### 5.1 Results

| Step | Status | Notes |
|------|--------|-------|
| Convert lecture.html → markdown | Done | 38 slides, 16,563 chars |
| Generate PDF of current slides | Done | 2.6MB, 38 pages via decktape |
| Create context package | Done | PROJECT_BRIEF.md + INSTRUCTOR_FEEDBACK.md |
| Upload to NotebookLM | Done | Multiple rounds: v1, v2 (Foundations), v3 (Business Leaders) |
| NotebookLM generates Slide Decks | Done | v2: 21 slides, v3: 21 slides — both excellent quality |
| Extract slide images | Done | v2 and v3 PNGs extracted |
| Deploy as image slides in Reveal.js | **Done** | v3 chosen, full-bleed approach |

### 5.2 Key Findings

1. NotebookLM produces **dramatically better** visual design than our current process
2. It generates unique, consistent illustrations — our main quality gap
3. Multiple NotebookLM runs produce different quality/focus: v3 (Business Leaders) had better educational flow
4. It hallucinated some facts — content verification still needed
5. **Critical lesson: Do NOT rebuild NotebookLM content in HTML.** First attempt recreated all text in Reveal.js, duplicating the NotebookLM wording. The correct approach is full-bleed slide images.

### 5.3 Approach Pivot (2026-02-18)

The initial plan tried to use NotebookLM illustrations as decorative elements within HTML text layouts. This was rejected because:
- Text in the HTML slides duplicated the NotebookLM slide text
- The NotebookLM visual design (layout, typography, illustrations) could not be faithfully recreated in HTML
- The instructor liked the NotebookLM output as-is

**Final approach:** Use NotebookLM slide PNGs as full-bleed Reveal.js backgrounds. Inject interactive HTML slides (quizzes) between image slides. Provide PDF download for students.

### 5.4 Day 1 Final Output

- 23 total slides: 21 NotebookLM v3 image slides + 2 interactive checkpoint quizzes
- Source: v3 (Business Leaders) — all 21 slides used as-is
- PDF download: `web/day1-lecture.pdf` (16MB, linked in nav bar)
- lecture.html: 357 lines (down from 1,918 in original)

### 5.5 Remaining

- [x] Instructor review of deployed slides → **Approved, proceeding with all days**
- [x] Decision: proceed with Days 2-9 using this workflow? → **Yes, full-bleed image approach**
- [x] Apply same workflow to Day 2 and Day 3 → **Done (2026-02-18)**
- [x] Apply to Day 4 → **Done (2026-02-18), includes ElevenLabs audio + Nano Banana lab images**
- [x] Apply to Day 5 → **Done (2026-02-18), 15 slides + 2 quizzes**

### 5.6 Days 2-5 Results Summary

| Day | Slides | Quizzes | lecture.html Lines | Notes |
|-----|--------|---------|-------------------|-------|
| 1 | 21 | 2 | 357 | v3 (Business Leaders) chosen from 3 attempts |
| 2 | 18 | 2 | ~310 | Retrofitted from SVG approach |
| 3 | 19 | 2 | ~320 | Retrofitted from SVG approach |
| 4 | 20 | 2 | ~340 | Built with NotebookLM from start; ElevenLabs audio + Nano Banana lab images |
| 5 | 15 | 2 | ~310 | Most efficient; INSTRUCTOR_FEEDBACK.md was highest-impact context file |

Key observations:
- 1-2 NotebookLM generation attempts typical after Day 1 (context packages improved)
- INSTRUCTOR_FEEDBACK.md is the highest-impact context file — specific slide-by-slide feedback produces dramatically better output
- Full-bleed approach produces 300-340 line lecture.html vs 1,700-1,900 for SVG approach
- Context package quality directly correlates with output quality

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

**Status:** Approved — proven across Days 1-5

- [x] Spec reviewed by project owner
- [x] NotebookLM as primary visual agent approved
- [x] Conversion approach (HTML → Markdown) approved
- [x] Test run on Day 1 approved
- [x] Nano Banana transition plan approved (keep as backup, NotebookLM primary)

---

*End of Specification*
