# Implementation Plan: Day 5 — Google AI Studio

**Plan ID:** 0005
**Spec Reference:** [codev/specs/0005-day5-ai-studio.md](../specs/0005-day5-ai-studio.md)
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-02-13

---

## 1. Overview

This plan describes HOW to build the Day 5 materials specified in Spec 0005. The work targets `Materials/Materials/Week 2/Day 5/web/` and produces 4 files: lecture.html, lab.html, quiz.html, index.html.

### 1.1 Key Principles

1. **Reuse proven patterns** — Copy CSS/JS structure from Day 3 or Day 4 (whichever is most recent and polished)
2. **Spec is source of truth** — Follow the slide structure and lab structure exactly
3. **Lessons learned applied** — All patterns from Days 1-4 lessons (SVG quality bar, term definitions, Compare with Classmates, breadcrumbs, etc.)
4. **Dataset first** — Create the email dataset before writing lab tasks that reference specific emails
5. **Screenshot verify** — All slides must fit within 1920x1080

### 1.2 Estimated Scope

| File | Effort | Notes |
|------|--------|-------|
| lecture.html | Heavy | ~30 slides, 11 SVGs, parameter visualizations |
| lab.html | Heavy | 4 parts, 12 tasks, email dataset, cost worksheet |
| quiz.html | Medium | 44 questions (22 topics × 2 variants), reuse quiz engine |
| index.html | Light | Standard hub page, copy structure from Day 3/4 |

### 1.3 Dependencies

- Day 4 materials should be finalized (for Quick Recap bridge content)
- Day 3 lecture.html is the CSS/layout gold standard
- SVG quality reference: Day 2 iteration cycle diagram

---

## 2. Pre-Implementation Checklist

Before writing any code:

- [ ] Re-read the spec (`codev/specs/0005-day5-ai-studio.md`)
- [ ] Re-read lessons learned (`codev/lessons/0001-course-materials.md`) — especially Day 2-3 patterns
- [ ] Read Day 4 lecture.html `What's Next` slide (for bridge alignment)
- [ ] Read Day 3 lecture.html for CSS/JS patterns to reuse
- [ ] Read Day 4 lab.html for latest lab CSS patterns (progress tracker, compare boxes)
- [ ] Verify Google AI Studio free tier is still available and interface matches spec
- [ ] Identify reusable CSS/JS from Day 3/4 files

---

## 3. Phase 1: Email Dataset Creation

Create the dataset BEFORE writing the lab, so lab tasks can reference specific emails by name.

### Step 1.1: Write 15+ Sample Emails

Create emails as JSON or JavaScript array embedded in lab.html (or as a separate data file). Each email needs:

```javascript
{
  sender: "Maria Chen",
  subject: "Broken blender received - ORDER #BRG-4521",
  body: "I received my order yesterday and the blender was cracked...",
  expected_category: "complaint",
  expected_urgency: "high",
  notes: "Product quality issue, clear urgency signals"
}
```

Follow the category distribution from spec Section 4.4:
- 3 complaints (product quality, service failure, billing error)
- 3 returns (within policy, outside policy, damaged)
- 3 inquiries (store hours, product availability, gift card)
- 2 compliments (employee praise, product satisfaction)
- 2 escalations (legal threat, VIP customer)
- 3+ edge cases (multi-category, non-English fragments, profanity)

### Step 1.2: Design Email Presentation

Display emails in the lab as styled cards with:
- Sender name and email (fictional)
- Subject line
- Body text
- "Copy to clipboard" button for pasting into AI Studio

### Step 1.3: Create the 5 "Test Set" Emails

Separate 5 emails (one per main category) for Part 1 Task 2. These are the first emails students test with. They should be clear-cut examples.

### Step 1.4: Create 3 "New" Emails for Part 4

Three emails students haven't seen, for the final configuration test (Task 10). These can be more ambiguous.

---

## 4. Phase 2: Lecture (lecture.html)

### Step 2.1: Set Up File Structure

1. Copy Day 3's lecture.html as the starting template (proven CSS/JS)
2. Keep all shared CSS (nav, left-content, visual-box, callout, info-card, metric, etc.)
3. Update: title, meta, breadcrumb, slide content
4. Add any new CSS needed:
   - `.parameter-dial` — for temperature/top-p visualizations
   - `.comparison-table` — for Chat vs Studio comparison
   - `.cost-worksheet` — for the token economics walkthrough

### Step 2.2: Build Section 1 — "Behind the Curtain" (Slides 1-7)

Follow spec Section 3.2, Section 1 exactly.

Key implementation notes:
- **Slide 3 (Quick Recap):** Must reference Day 4's actual final content. Include progression SVG showing all 5 days.
- **Slide 5 (Chat vs Studio):** Two-column layout. Left: simple chat interface. Right: workshop with dials. Use the "showroom vs workshop" analogy.
- **Slide 6 (Interface Tour):** SVG diagram of AI Studio layout — NOT a screenshot (screenshots become outdated). Label: Model Selector, System Instructions, Chat Area, Parameter Sliders, Token Counter.
- **Slide 7 (User → Configurer → Builder):** Three-tier pyramid SVG. Today moves students to middle tier.

### Step 2.3: Build Section 2 — "The Dials" (Slides 8-14)

Key implementation notes:
- **Slide 9 (Temperature):** This is the most important parameter slide. Use a dial/slider SVG with three zones: blue (0-0.3, focused), yellow (0.4-0.8, balanced), red (0.9-2.0, creative). Show example outputs at each zone for the SAME prompt.
- **Slide 10 (When to Use Which):** Info card grid, not a wall of text. Each card: use case icon + recommended range + one-sentence rationale.
- **Slide 11 (Top-p / Top-k):** Keep it conceptual. SVG showing probability bars with a cutoff line. "Most of you won't touch these. But knowing they exist makes you dangerous in meetings."
- **Slide 14 (Business Takeaway):** This is the "so what?" slide. Not just "parameters exist" but "wrong parameters = business risk." Concrete example: complaint classified differently each time → missed SLA.

### Step 2.4: Build Section 3 — "The AI Job Description" (Slides 15-22)

Key implementation notes:
- **Slide 16 (What is a System Prompt?):** SVG showing system prompt as a persistent wrapper around the conversation. Callback to Day 2 RCTFC.
- **Slide 17 (Anatomy):** Six blocks: Role, Rules, Format, Escalation, Tone, Boundaries. Each block gets a Beacon email example snippet.
- **Slide 18 (Full Example):** Style as a code block with color-coded sections matching Slide 17's blocks. This should feel like reading a real configuration file.
- **Slide 19 (Good vs Bad):** Two-column. Show the SAME email processed with each system prompt. Dramatic difference in output quality.
- **Slide 21 (Iteration):** Reuse the iteration cycle SVG pattern from Day 2. Same structure, new context.

### Step 2.5: Build Section 4 — "Token Economics & Wrap-Up" (Slides 23-31)

Key implementation notes:
- **Slide 24 (Tokens Refresher):** Quick callback to Day 1. Don't re-teach — just activate prior knowledge.
- **Slide 25 (Pricing Tiers):** Include "illustrative — actual rates may vary" disclaimer. Style as comparison table.
- **Slide 26 (Beacon Math):** Step-by-step calculation walkthrough. Running totals. Make it feel like a financial worksheet, not a math problem.
- **Slide 27 (Cost vs Value):** SVG with dramatic visual: tall bar ($600/mo human) next to tiny bar ($1/mo AI). Include cautionary note about illustrative figures.
- **Slide 30 (What's Next):** Preview Day 6 testing & guardrails. "You've built it. Now we break it."

### Step 2.6: SVG Quality Pass

After all slides written:
- Verify ALL 11 SVGs meet the quality bar: 12-14px labels, 9-10px subtitles (never below 9px), rounded rect nodes (rx="10", 120x52px min), drop shadows via `<filter><feDropShadow>`, curved arrows with `<marker>` arrowheads, NIU brand colors (#C8102E, #E35205, #1D428A, #43B02A), generous viewBox (360x340+)
- Reference Day 2 iteration cycle SVG as gold standard

### Step 2.7: Global Checks

- [ ] All Nano Banana prompts present as HTML comments
- [ ] All technical terms defined at first use (temperature, top-p, top-k, nucleus sampling, system prompt, token)
- [ ] Breadcrumb: UBUS 670 › Week 2 › Day 5 › Lecture
- [ ] No Google Workspace references
- [ ] Illustrative pricing includes disclaimer on EVERY pricing slide
- [ ] Day 4 bridge references Day 4's actual content (not placeholder)

---

## 5. Phase 3: Lab (lab.html)

### Step 3.1: Set Up File Structure

1. Copy Day 3 or Day 4 lab.html as template (proven CSS/JS)
2. Keep: navbar, lab-header, lab-section, task, checkbox-step, prompt-box, tip-box, warning-box, compare-box, reflection-area, progress-tracker JavaScript, PDF generation
3. Replace: all task content

### Step 3.2: Write Lab Header & Part 0 (Tool Setup)

- Title: "Beacon's Customer Email Triage System"
- Subtitle: "Configuring AI with Parameters, System Prompts, and Cost Analysis"
- Time: ~90-120 minutes
- Objectives: Match spec Section 3.1
- Tool setup: Navigate to AI Studio, verify access, identify interface elements
- **Fallback tip box:** "If AI Studio is unavailable, Gemini Chat works for Parts 1-2"

### Step 3.3: Embed Email Dataset

Insert all 15+ sample emails as styled cards with:
- Visual distinction by category (color-coded borders or icons)
- "Copy to Clipboard" button on each
- Emails organized into: Test Set (5 for Part 1), Experiment Set (7 for Parts 2-3), New Set (3 for Part 4)
- Consider collapsible sections to avoid overwhelming length

### Step 3.4: Write Part 1 — System Prompt Engineering (25 min)

- Task 1: System prompt template with blanks. Provide the skeleton:
  ```
  You are [ROLE]. Your job is to [PRIMARY TASK].

  ## Classification Categories
  [Students fill in categories and definitions]

  ## Output Format
  [Students define JSON structure]

  ## Rules
  [Students define behavioral rules]
  ```
- Task 2: Test with 5 clear-cut emails. Record results in a provided table.
- Task 3: Iterate. Document the change cycle: problem → hypothesis → change → result.
- Compare with Classmates box

### Step 3.5: Write Part 2 — Parameter Tuning (20 min)

- Task 4: Temperature experiment. Provide a results table:
  | Email | Temp 0.1 Result | Temp 0.7 Result | Temp 1.5 Result | Consistent? |
- Task 5: Switch mode to response drafting. New system prompt addition. Compare outputs.
- Task 6: Define optimal settings. Provide a configuration card to fill in.
- Compare with Classmates box

### Step 3.6: Write Part 3 — Token Economics (20 min)

- Task 7: Token counting exercise. Provide fields for recording counts.
- Task 8: Cost worksheet:
  | Item | Tokens | ×/month | Flash Cost | Pro Cost |
  | System prompt | ___ | 6,000 | $ | $ |
  | Avg email input | ___ | 6,000 | $ | $ |
  | Classification output | ___ | 6,000 | $ | $ |
  | **Total** | | | **$** | **$** |
- Task 9: ROI comparison table. Pre-fill the human cost side ($600/mo). Students fill AI cost from their calculations.
- Include: "Draft a 3-sentence pitch to Beacon's CFO" prompt box.
- Compare with Classmates box

### Step 3.7: Write Part 4 — Build & Submit (25 min)

- Task 10: Final configuration with 3 new unseen emails
- Task 11: Edge case testing (4 specific edge cases from spec)
- Task 12: Reflection (3 prompts) + PDF download + LMS submit
- Compare with Classmates box

### Step 3.8: Progress Tracker

Configure the JavaScript progress tracker for 12 tasks across 4 parts (plus setup).

---

## 6. Phase 4: Quiz (quiz.html)

### Step 4.1: Copy Quiz Engine

Copy the quiz JavaScript from Day 3 or Day 4 quiz.html. Keep:
- Randomization engine (select N from bank)
- Scoring with feedback
- Progress dots
- Passing threshold display
- Tiered result messages

### Step 4.2: Write Question Bank

44 questions (22 topics × 2 variants) per spec Section 5.1.

Organization: Group by topic. Each topic gets exactly 2 questions with different wording/angles.

Format per question:
```javascript
{
  topic: "temperature_definition",
  question: "What does the temperature parameter control in an AI model?",
  options: ["The speed of response generation", "The randomness/creativity of output", "The maximum response length", "The number of models used"],
  correct: 1,
  feedback: "Temperature controls the randomness of token selection. Low temperature (0-0.3) produces focused, predictable output. High temperature (1.0+) produces more creative but less predictable results."
}
```

### Step 4.3: Configure Quiz

- Select 20 per attempt (not 15 — spec says 20 for Day 5, with 22 topics)
- One question per topic (randomize which variant)
- 70%+ passing (14/20)
- Update header text and instructions

---

## 7. Phase 5: Index Page (index.html)

### Step 7.1: Copy and Modify

Copy Day 3 index.html as template. Update:
- Breadcrumb: UBUS 670 › Week 2 › Day 5
- Hero title: "Google AI Studio"
- Hero subtitle: "Day 5: Configuring AI for Business — Parameters, System Prompts, and Costs"
- Date: Wednesday, March 18, 2026
- Duration: 4 hours
- Tools: Google AI Studio (free tier)
- Learning objectives (spec Section 3.1)
- Case study banner (spec Section 7.1)
- Module cards: update descriptions for lecture, lab, quiz

---

## 8. Phase 6: Review

### Step 8.1: Self-Review

Before presenting to human:
- [ ] Run through spec acceptance criteria (Section 8)
- [ ] All SVGs meet quality bar
- [ ] All emails are realistic and varied
- [ ] Token math is correct
- [ ] Cost calculations work out to reasonable numbers
- [ ] All Compare with Classmates boxes present
- [ ] PDF download works
- [ ] Screenshots of key slides verify 1920x1080 fit

### Step 8.2: Review Board (4 Critics)

Run all 4 critics:
- **UX Critic**: SVG quality, layout, navigation, visual variety, mobile responsiveness
- **Education Critic**: Bloom's verbs, scaffolding, formative assessment, quiz standards
- **Topic Critic**: 2026 AI Studio accuracy, parameter descriptions, token pricing realism
- **Accuracy Critic**: Tool interface accuracy, free tier verification, audience level

### Step 8.3: Human Checkpoint

Present critique report and materials for instructor review.

---

## 9. Implementation Order Summary

```
PRE-WORK
├── Re-read spec, lessons, Day 4 bridge content
├── Verify AI Studio interface (current state)
└── Identify reusable CSS/JS from Day 3/4

PHASE 1: EMAIL DATASET
├── Step 1.1: Write 15+ sample emails (varied categories)
├── Step 1.2: Design email card presentation
├── Step 1.3: Designate 5 test set, 7 experiment, 3 new
└── Step 1.4: Create edge case emails

PHASE 2: LECTURE (lecture.html) — Heaviest lift
├── Step 2.1: Set up file from Day 3/4 template
├── Step 2.2: Section 1 — Behind the Curtain (7 slides)
├── Step 2.3: Section 2 — The Dials (7 slides)
├── Step 2.4: Section 3 — AI Job Description (8 slides)
├── Step 2.5: Section 4 — Token Economics & Wrap-Up (8 slides)
├── Step 2.6: SVG quality pass
└── Step 2.7: Global checks

PHASE 3: LAB (lab.html)
├── Step 3.1: Set up file from Day 3/4 template
├── Step 3.2: Header & Tool Setup (Part 0)
├── Step 3.3: Embed email dataset
├── Step 3.4: Part 1 — System Prompt Engineering
├── Step 3.5: Part 2 — Parameter Tuning
├── Step 3.6: Part 3 — Token Economics
├── Step 3.7: Part 4 — Build & Submit
└── Step 3.8: Progress tracker configuration

PHASE 4: QUIZ (quiz.html)
├── Step 4.1: Copy quiz engine from Day 3/4
├── Step 4.2: Write 44 questions (22 topics × 2)
└── Step 4.3: Configure (20 per attempt, 70%+ pass)

PHASE 5: INDEX (index.html)
└── Copy Day 3, update all content

PHASE 6: REVIEW
├── Step 8.1: Self-review against acceptance criteria
├── Step 8.2: Run Review Board (4 critics)
└── Step 8.3: Human checkpoint
```

---

## 10. Traps to Avoid

1. **Don't over-teach top-p and top-k** — MBA students need awareness, not mastery. Temperature is the star. Top-p/top-k are supporting cast. Spend 1 slide on them, not 3.
2. **Don't use real pricing that will be outdated by March** — Always say "illustrative" and include disclaimers. Focus on the methodology of cost estimation, not exact numbers.
3. **Don't make the email dataset too simple** — If every email is obviously one category, students won't need AI to classify them. Include ambiguous cases that make the system prompt matter.
4. **Don't skip the "so what?" moment on parameters** — "Temperature controls randomness" is not enough. "Wrong temperature = inconsistent email classification = missed SLAs = angry customers" is the business connection.
5. **Don't forget the Day 4 bridge** — Day 4's actual content may differ from the original spec. Read the FINAL Day 4 lecture before writing Slide 3.
6. **Don't treat cost estimation as a math exercise** — It's a business case. The CFO pitch (Task 9) is the point, not the arithmetic.
7. **Don't present system prompts as static** — They need iteration, just like Day 2 prompts. The iteration cycle is a recurring theme across the course.
8. **Don't use screenshots of AI Studio** — Use SVG diagrams instead. Screenshots become outdated when the UI changes. Diagrams show the concept.

---

## 11. Approval

**Status:** Awaiting human review

- [ ] Plan reviewed by project owner
- [ ] Implementation order approved
- [ ] Email dataset approach approved (15+ emails, embedded in lab)
- [ ] Lecture structure (4 sections, ~31 slides) approved
- [ ] Lab structure (4 parts + setup, 12 tasks) approved
- [ ] Quiz approach (22 topics × 2 variants, 20 per attempt) approved
- [ ] SVG-not-screenshot approach for AI Studio interface approved

---

*End of Implementation Plan*
