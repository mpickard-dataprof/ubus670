# Implementation Plan: Day 4 Multimodal AI — Major Rework

**Plan ID:** 0004
**Spec Reference:** [codev/specs/0004-day4-rework.md](../specs/0004-day4-rework.md)
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-02-12

---

## 1. Overview

This plan describes HOW to implement the Day 4 rework specified in Spec 0004. The work is organized into phases executed in a single session, targeting `Materials/Materials/Week 2/Day 4/web/`.

### 1.1 Key Principles

1. **Read-before-write** — Re-read each file before modifying
2. **Spec is source of truth** — Don't trust existing prototype over the spec
3. **One file at a time** — Complete lecture → lab → quiz → index sequentially
4. **Day 3 alignment** — Quick Recap references finalized Day 3 content
5. **Nano Banana prompts** — Include as HTML comments for Spec 0003 tool
6. **Visual review last** — Run UX critic only after all content changes

### 1.2 Estimated Scope

| File | Effort | Changes |
|------|--------|---------|
| lecture.html | Heavy | ~80% rework: new scenario, new slide structure, image generation content, all new SVGs |
| lab.html | Heavy | ~90% rework: completely new exercise flow (marketing campaign) |
| quiz.html | Heavy | ~70% rework: new question topics, remove receipt questions |
| index.html | Medium | Update description, objectives, case study, fix breadcrumb |

---

## 2. Pre-Implementation Checklist

- [ ] Re-read the spec (`codev/specs/0004-day4-rework.md`)
- [ ] Re-read instructor feedback (`feeback/slide_feedback.md`, `feeback/lab_feedback.md`)
- [ ] Read current Day 4 `lecture.html` fully (understand existing CSS/JS to reuse)
- [ ] Read current Day 4 `lab.html` fully (reuse progress tracker, copy buttons, checkbox JS)
- [ ] Read current Day 4 `quiz.html` fully (reuse randomization engine)
- [ ] Read Day 3 `lecture.html` Quick Recap and What's Next slides (for bridge alignment)
- [ ] Read Day 2 `lecture.html` for SVG quality reference (iteration cycle diagram)

---

## 3. Phase 1: Lecture Rework (lecture.html)

### Step 1.1: Preserve Reusable CSS/JS, Replace Slide Content

The current lecture.html has good CSS (nav, left-content, two-col, visual-box, callout, info-card, metric, flow-diagram styles). **Keep all CSS.** Replace only the `<section>` slide content within `<div class="slides">`.

Remove Day 4-specific CSS that won't be needed:
- `.doc-comparison`, `.doc-card` (document-specific)

Add new CSS if needed:
- `.modality-card` — for the 4-modality display
- `.use-case-grid` — for real-world examples grid

### Step 1.2: Build Section 1 — "Beyond Text" (Slides 1-8)

**Slide 1: Title**
- "Multimodal AI: When AI Has Eyes and Ears"
- Subtitle: "Day 4: Analyzing and Creating with Images, Audio, and Video"
- Meta: Monday, March 16, 2026 | 4 hours | Google Gemini
- [NANO BANANA prompt as HTML comment]

**Slide 2: Learning Objectives**
- 4 objectives from spec Section 3.2
- Visual box with "Today's Skill: Multimodal AI" and "From text → images, audio, video"

**Slide 3: Quick Recap — Day 3 → Day 4**
- Two-column layout
- Left: "Day 3: Context Engineering" summary (5 key points from Day 3 takeaways)
- Right: SVG showing progression: Day 1 (What is AI?) → Day 2 (Prompt Engineering) → Day 3 (Context Engineering) → Day 4 (Multimodal AI)
- Bridge text: "Day 3 taught you to feed AI the right text context. Today: the context isn't just text anymore."

**Slide 4: Section Divider** — "Beyond Text" (navy background)

**Slide 5: What is Multimodal AI?**
- Definition + 4 modalities with icons
- SVG: Four modalities (text, image, audio, video) converging into AI brain
- [NANO BANANA prompt]

**Slide 6: The Business Opportunity**
- "80% of business data is unstructured — and much of it is visual or audio"
- SVG: Pie chart or bar showing data types with modality icons
- Key insight callout

**Slide 7: Real-World Multimodal AI in Action**
- Card grid with 5-6 real examples from spec (Gather AI drones, Observe.AI, ABBYY, RetailNext, Landing AI, marketing)
- Each card: icon + company + stat
- [NANO BANANA prompt for collage illustration]

**Slide 8: Discussion**
- "What images, audio, or video does YOUR industry generate?"
- Reference the drone inventory video (YouTube link)
- Discussion prompt box

### Step 1.3: Build Section 2 — "What Can It Actually Do?" (Slides 9-16)

**Slide 9: Section Divider** — red background

**Slide 10: Image Understanding**
- What AI sees: objects, text (OCR), layout, context
- Two-column: example image analysis on left, visual box on right
- [NANO BANANA prompt for retail display image]

**Slide 11: Audio Understanding**
- What AI hears: transcription, speaker ID, sentiment, background context
- SVG: Audio waveform → AI → structured insights

**Slide 12: Video Understanding**
- Temporal reasoning: actions, scenes, combined audio+visual
- SVG: Video frames timeline with AI annotations

**Slide 13: From Unstructured to Structured**
- Core value proposition: multimodal input → clean structured output
- SVG: Three parallel paths (image/audio/video) → AI → structured output
- Connect to Day 3: "This is context engineering applied to multimodal data"

**Slide 14: Image Generation — AI as Creator**
- Not just analysis — AI creates too
- Marketing visuals, product mockups, concept art
- Introduce Nano Banana / Imagen
- [NANO BANANA prompt for side-by-side prompt→result]

**Slide 15: The Prompt Matters (Even More)**
- Vague vs detailed prompt comparison
- Two-column: bad prompt → mediocre result vs good prompt → polished result
- Connect to Day 2 prompt engineering
- [NANO BANANA: Generate both versions for comparison]

**Slide 16: Current Limitations**
- Honest assessment cards: green (can do) vs orange (can't reliably)
- Cannot: identify specific people, guarantee readable text in images, factual accuracy in generated images
- "Trust but verify" callout

### Step 1.4: Build Section 3 — "Beacon's Campaign" (Slides 17-24)

**Slide 17: Section Divider** — blue background

**Slide 18: The Scenario**
- Beacon spring marketing campaign brief
- 4-step workflow preview
- [NANO BANANA prompt for team brainstorming illustration]

**Slide 19: Step 1 — Competitive Visual Analysis**
- Upload competitor images → structured competitive intelligence
- Two-column: image on right, analysis table on left

**Slide 20: Step 2 — Customer Voice Analysis**
- Upload audio → marketing insights
- SVG: audio → AI → insight categories

**Slide 21: Step 3 — Generate Marketing Visuals**
- Write prompts, iterate, refine
- [NANO BANANA prompt for example Beacon marketing image]

**Slide 22: Step 4 — Structured Campaign Brief**
- Combine all insights into Markdown brief
- SVG: Three inputs → structured output
- "This is multimodal context engineering"

**Slide 23: Human-in-the-Loop**
- AI generates, humans curate
- SVG: AI output → human review → final asset
- [NANO BANANA prompt for reviewer illustration]

**Slide 24: ROI**
- Metrics: time savings, cost savings, scale
- Metric displays with key numbers
- Cautionary callout about vendor ROI claims

### Step 1.5: Build Section 4 — Wrap-Up (Slides 25-30)

**Slide 25: Section Divider** — green background

**Slide 26: Beyond Marketing**
- Quick reference back to Slide 7 use cases
- "Marketing was our deep dive — same principles work everywhere"

**Slide 27: Decision Framework**
- SVG: Decision tree for when to use which modality
- "Have images? → Image understanding. Need visuals? → Image generation."

**Slide 28: Key Takeaways**
- 4-5 bullets connecting back to objectives

**Slide 29: What's Next** — Preview Day 5

**Slide 30: Questions**

### Step 1.6: SVG Quality Pass

After all slides are written:
- Verify all SVGs: 12-14px labels, 9-10px subtitles, rounded rects (rx="10", 120x52px min), drop shadows, curved arrows with markers, NIU colors, generous viewBox
- Reference Day 2 iteration cycle SVG as gold standard

### Step 1.7: Global Checks

- All Nano Banana prompts present as HTML comments
- No receipt/document extraction references remain
- All technical terms defined at first use
- Breadcrumb: UBUS 670 › Week 2 › Day 4 › Lecture

---

## 4. Phase 2: Lab Rework (lab.html)

### Step 2.1: Preserve Reusable Components

Keep from current lab:
- All CSS (navbar, lab-header, lab-section, task, checkbox-step, prompt-box, tip-box, warning-box, compare-box, reflection-area, progress-tracker)
- JavaScript: checkbox completion, copy buttons, progress tracker
- HTML structure: navbar, header, container, sections, footer

Replace: All task content.

### Step 2.2: Write Lab Header & Setup

- Title: "Beacon's Spring Marketing Campaign"
- Subtitle: "Using Multimodal AI to Analyze, Create, and Strategize"
- Time: ~90-120 minutes
- Objectives: Match spec Section 4.2
- Tool setup: Verify Gemini access, test image upload with a photo of their desk

### Step 2.3: Write Part 1 — Competitive Visual Analysis (25 min)

- Task 1: Tool Setup (upload test image)
- Task 2: Analyze Competitor Ad (2-3 sample images provided, detailed extraction prompt)
- Task 3: Compare Analyses (vague vs detailed prompt on same image)
- Compare with Classmates box

### Step 2.4: Write Part 2 — Customer Voice Insights (20 min)

- Task 4: Analyze Audio (provide audio clip link or embedded player, upload to Gemini)
- Task 5: Structured Marketing Insights (reformat into table using Day 3 skills)
- Compare with Classmates box

**Audio asset strategy:** If we can't embed an audio file directly, provide a text-based simulated transcript with instructions for students who have audio access. Include a fallback path.

### Step 2.5: Write Part 3 — Generate Marketing Visuals (30 min)

- Task 6: First image prompt (guidance on style, composition, brand colors)
- Task 7: Iterate and refine (3 iterations documented)
- Task 8: Campaign suite (3 images: email hero, social post, in-store display)
- Compare with Classmates box
- Include "Beacon Brand Quick Reference" card (colors, tone, audience)

### Step 2.6: Write Part 4 — Campaign Brief & Reflection (25 min)

- Task 9: Build campaign brief (Markdown template provided)
- Task 10: ROI calculation (numbers from spec)
- Task 11: Reflection & submission (PDF download + LMS upload)
- Compare with Classmates box

### Step 2.7: Lab Asset Integration

- Embed or link sample competitor ad images
- Provide audio clip or fallback transcript
- Include Beacon brand guidelines card
- Include image prompt guide callout

---

## 5. Phase 3: Quiz Rework (quiz.html)

### Step 3.1: Preserve Quiz Engine

Keep the JavaScript quiz engine (randomization, scoring, feedback, progress dots). Replace only the `questionBank` array content.

### Step 3.2: Write New Question Bank

30 questions (15 topics × 2 variants per spec Section 5.2):
1. Multimodal AI definition (2)
2. Modality types (2)
3. Image understanding (2)
4. Audio understanding (2)
5. Video understanding (2)
6. Unstructured → structured (2)
7. Image generation capabilities (2)
8. Image generation limitations (2)
9. Image prompt engineering (2)
10. Multimodal context engineering (2)
11. Real-world use cases (2)
12. Human-in-the-loop (2)
13. ROI of multimodal AI (2)
14. Ethical considerations (2)
15. Marketing workflow (2)

### Step 3.3: Update Quiz Configuration

- Select 15 per attempt (one from each topic)
- 70%+ passing (11/15)
- Update header text and instructions

---

## 6. Phase 4: Index Page Update (index.html)

- Fix breadcrumb: "Day 1" → "Day 4"
- Update subtitle
- Update case study banner (marketing campaign)
- Update learning objectives
- Update module card descriptions
- Update lab card title

---

## 7. Phase 5: Post-Implementation Review

### Step 7.1: Run Review Board

After all files are complete, run all 4 critics:
- **UX Critic**: SVG quality, layout, navigation, visual variety
- **Education Critic**: Bloom's verbs, quiz standards, scaffolding, formative assessment
- **Topic Critic**: 2026 accuracy, terminology, real-world examples
- **Accuracy Critic**: Tool interfaces, free tier verification, audience appropriateness

### Step 7.2: Human Checkpoint

Present critique report for instructor review before finalizing.

---

## 8. Implementation Order Summary

```
PRE-WORK
├── Re-read spec, feedback, and current files
├── Read Day 3 lecture for bridge content
└── Identify reusable CSS/JS from current prototype

PHASE 1: LECTURE (lecture.html) — Heaviest lift
├── Step 1.1: Preserve CSS/JS, prep for new slides
├── Step 1.2: Section 1 — Beyond Text (8 slides)
├── Step 1.3: Section 2 — Capabilities (8 slides)
├── Step 1.4: Section 3 — Beacon Campaign (8 slides)
├── Step 1.5: Section 4 — Wrap-Up (6 slides)
├── Step 1.6: SVG quality pass
└── Step 1.7: Global checks

PHASE 2: LAB (lab.html)
├── Step 2.1: Preserve reusable components
├── Step 2.2: Header & setup
├── Step 2.3: Part 1 — Competitive Visual Analysis
├── Step 2.4: Part 2 — Customer Voice Insights
├── Step 2.5: Part 3 — Generate Marketing Visuals
├── Step 2.6: Part 4 — Campaign Brief & Reflection
└── Step 2.7: Lab asset integration

PHASE 3: QUIZ (quiz.html)
├── Step 3.1: Preserve quiz engine
├── Step 3.2: Write 30 new questions
└── Step 3.3: Update configuration

PHASE 4: INDEX (index.html)
└── Update all content and fix breadcrumb

PHASE 5: REVIEW
├── Step 7.1: Run Review Board (4 critics)
└── Step 7.2: Human checkpoint
```

---

## 9. Traps to Avoid

1. **Don't keep any receipt/document extraction content** — The entire framing has changed. Remove ALL receipt references.
2. **Don't make the lab text-only** — The whole point is multimodal. Students must upload real images and interact with audio.
3. **Don't skip Nano Banana prompts** — Every visual slide needs an HTML comment with the generation prompt for Spec 0003.
4. **Don't forget the Day 3 bridge** — Quick Recap must reference actual Day 3 content (context engineering, structured formats, Gems, RAG).
5. **Don't over-complicate the audio exercise** — Keep it feasible. Short clips, clear fallback if upload doesn't work.
6. **Don't present image generation as perfect** — The limitations ARE the lesson. Iteration is the skill.
7. **Don't duplicate Day 3 content** — Reference and extend, don't re-teach structured formats or Gems.

---

## 10. Approval

**Status:** Awaiting human review

- [ ] Plan reviewed by project owner
- [ ] Implementation order approved
- [ ] Lecture structure (4 sections, ~30 slides) approved
- [ ] Lab structure (4 parts, 11 tasks) approved
- [ ] Quiz approach (15 topics × 2 variants) approved
- [ ] Audio asset strategy approved (provide clip or fallback transcript)

---

*End of Implementation Plan*
