# Lessons Learned: UBUS 670 Course Materials

**Project ID:** 0001
**Purpose:** Capture learnings after each day's materials are approved to improve subsequent days.

---

## Format

After each day is approved, append an entry below:

```
### Day X: [Title]
**Approved:** [Date]

**What worked well:**
- ...

**What required significant revision:**
- ...

**Patterns to apply to future days:**
- ...

**Content or approach to avoid:**
- ...
```

---

## Lessons by Day

### Day 1: What is Generative AI?
**Approved:** 2026-02-06

**What worked well:**
- HTML-based course hub with Reveal.js slides works better than static PPTX
- Generator-Critic workflow with 4 personas (UX, Edu, Topic, Accuracy) catches issues early
- 20-question quiz bank with randomization and variants provides retake value
- Lab submission mechanism (Generate Summary → Copy/Download) solves response collection
- Beacon Retail Group case study provides consistent business context throughout

**What required significant revision:**
- Initial graphics were "logo-like" and decorative—replaced with meaningful diagrams (transformer flow, encoder/decoder architecture)
- Slide headers needed larger/bolder typography for readability
- List spacing and alignment needed CSS fixes
- Hallucination exercise needed 3 fallback approaches (modern AI is better at saying "I don't know")
- Removed Google Workspace references (NIU students don't have it)

**Patterns to apply to future days:**
- Always include custom SVG/CSS diagrams for technical concepts (not just emoji)
- SVG quality bar: large text (12-14px labels, 9-10px subtitles), rounded rect nodes (120x52px min), drop shadows, curved arrows with markers, generous viewBox (360x340+). See Day 2 iteration cycle as gold standard.
- Use `.left-content h2` with `font-size: 1.8em; font-weight: 700` for headers
- Add spacing before lists: `p + ul, p + ol { margin-top: 1.2em; }`
- Test AI exercises with current models before publishing
- Include model selector guidance in tool setup instructions
- Lab submission: PDF download + LMS upload (not copy/paste)
- Include "Compare with Classmates" boxes in labs to highlight AI non-determinism

**Content or approach to avoid:**
- Generic stock imagery or decorative-only graphics
- Tiny SVG text (never below 9px) or small circle nodes — use large rounded rects
- Assuming any specific AI behavior (hallucinations, refusals)—always provide fallbacks
- Referencing Google Workspace for NIU students
- Pre-selected quiz answers (must be interactive)
- Overly technical jargon without explanation for MBA audience

---

### Day 2: Prompt Engineering
**Approved:** 2026-02-10

**What worked well:**
- RCTFC framework with visual flow diagram (SVG) resonated as a teaching structure
- Prompting techniques comparison (zero-shot vs. few-shot vs. chain-of-thought) with side-by-side examples
- 20-question quiz bank with 2 variants per topic and 70%+ passing threshold works well
- Iteration cycle SVG diagram became the "gold standard" for future SVG quality
- Dedicated tool setup section in lab (with ChatGPT fallback) removes friction
- "Compare with Classmates" boxes in labs highlight AI non-determinism effectively

**What required significant revision:**
- Breadcrumb navigation needed full path (UBUS 670 › Week 1 › Day 2 › Lecture)
- All 7 SVG diagrams across Day 1 and Day 2 needed upgrade to new quality standard (large text, drop shadows, rounded rects, curved arrows)
- Technical terms ("system prompt", "meta-prompt", "non-deterministic") needed inline definitions at first use
- Accuracy metrics needed disclaimers ("illustrative, actual accuracy varies")
- RCTFC framework needed industry context note (CO-STAR, RTF alternatives exist)
- Lab needed dedicated tool setup section before tasks begin

**Patterns to apply to future days:**
- SVG quality bar (established in Day 2, codified): 12-14px labels, 9-10px subtitles (never below 9px), rounded rect nodes (rx="10", 120x52px min), drop shadows via `<filter><feDropShadow>`, curved arrows with `<marker>` arrowheads, NIU brand colors, generous viewBox (360x340+)
- Define all technical terms inline at first use with callout/tip boxes
- Include dedicated "Tool Setup" section in every lab before tasks begin
- Provide alternative tool fallback (e.g., ChatGPT if Gemini unavailable)
- Add disclaimers to illustrative metrics and examples
- Note industry alternatives when teaching a specific framework
- Full breadcrumb path in all navigation: UBUS 670 › Week X › Day Y › [Component]
- Quiz passing threshold (70%+) with tiered result messages

**Content or approach to avoid:**
- Assuming students know technical jargon (always define at first use)
- Presenting teaching frameworks as "the only way" without noting alternatives
- Undisclaimed accuracy/performance metrics (students may treat as gospel)
- Starting labs without tool setup verification
- CSS-only diagrams for technical concepts (always use SVG for quality control)

---

### Day 3: Context Engineering (Rework)
**Rework completed:** 2026-02-11
**Spec:** 0002

**What worked well:**
- Structured formats (Markdown, JSON, XML) framing is more current than "AI-ready documents"
- Gemini Gems provide a concrete, hands-on way to teach persistent context
- Three-way comparison (no context / upload / Gem) clearly demonstrates why context engineering matters — experiential learning > lecturing about it
- "Accidental Fine-Tuner" colleague story makes behavioral config vs fine-tuning memorable — story-driven teaching creates emotional hooks and "aha moments"
- Citation testing section teaches source verification as a business skill
- 22-topic quiz bank with random 20-question selection per attempt adds variety
- Before/after examples (plain text vacation policy → Markdown) are more powerful than abstract explanations
- Reframing "structure as optimization, not necessity" shifts from fear/workaround to empowerment
- Gem sharing between classmates adds social dimension + reinforces non-determinism teaching
- Addressing the fine-tuning misconception explicitly (Custom GPTs ≠ fine-tuning) corrects a widespread false belief — always surface and correct misconceptions, don't just teach the "right" thing

**What required significant revision from original prototype:**
- "AI-ready documents" concept was outdated for 2026 (modern models handle messy docs)
- Gemini version wrong (used Gemini 3 in spec, corrected to Gemini 2.5 in implementation)
- RAG diagram was cut off at the edge (viewBox too narrow)
- Fine-tuning was over-emphasized as a primary technique (2026 consensus is RAG-first)
- ChatGPT backup plan removed per instructor directive (focus on Gemini ecosystem)
- Data Privacy Assessment removed to make room for Gem creation and citation testing
- Original prototype had too much theory, not enough experiential learning — rework shifted to doing > hearing

**Patterns to apply to future days:**
- Always research current AI model versions before writing content (don't assume from spec)
- Verify Gemini Gems UI path is current before class (UI may change)
- Include `[AI-GENERATED IMAGE]` placeholders with detailed prompts for instructor to generate
- When a concept is "outdated," reframe rather than remove entirely (structure still helps, just isn't required)
- Quiz: having more topics than questions per attempt (22 > 20) ensures variety across retakes
- **Story-driven teaching** breaks up dense content and creates memorable moments — use narrative format for misconception correction (Accidental Fine-Tuner pattern)
- **Three-way comparisons** as reusable experiment format — students experience the problem firsthand rather than being told about it
- **Scenario-based > theory-based** — Beacon HR/policy challenges make abstract concepts concrete for MBA students with no work experience
- **Gem sharing as social learning** — peer comparison reinforces non-determinism and collaborative learning
- Position tools as "democratized" (no-code RAG, behavioral configuration) — empowers non-technical audience

**Content or approach to avoid:**
- Presenting any AI capability as "can't do X" — models improve rapidly
- ChatGPT references as primary tool (instructor prefers Gemini ecosystem)
- "AI-readiness" scores/rubrics — too much focus on a diminishing concern
- Fine-tuning as a recommended business approach (RAG-first for most cases)
- Providing alternative tool fallback for labs (focus on one ecosystem per instructor preference)
- Teaching the "right" thing without surfacing the misconception first — students learn more when they discover their assumption was wrong

---

### AI Image Generation (Spec 0003)
**First iteration:** 2026-02-12

**What worked well:**
- Nano Banana (`gemini-2.5-flash-image`) via `google-genai` SDK generates warm illustration-style images reliably
- WebP conversion (q85) produces 60-100KB files from 1.2-1.5MB PNGs — massive savings, no visible quality loss
- Headless Chrome screenshots (`google-chrome --headless --screenshot`) enable visual review without manual browser checks
- Style prefix in prompts produces consistent warm illustration style across generations
- "No text, no labels, no words" instruction in prompts effectively prevents baked-in text

**What required significant revision:**
- First attempt was a pretty illustration with no "teaching power" — looked nice but didn't teach. Instructor feedback: images must serve as teaching aids, not just decoration
- Second attempt tried full-image text (headers, bullets, speech bubbles baked into the image). AI-generated text had consistent misspellings ("proparety", "halluications") — a fundamental limitation of current image generators
- HTML layout needed 4 iterations to get vertical compaction right — content overflowed the slide viewport initially

**Key discovery: Two integration modes:**
1. **Mode A (Text-Free):** Pure illustration, no text in image. Best for emotional/metaphor slides where HTML context is sufficient
2. **Mode B (Hybrid):** AI character illustrations + HTML text overlays. Best for teaching infographics where text must be precise and readable

**Patterns to apply to future images:**
- Always ask: "Does this image teach, or just decorate?" If it doesn't teach, it needs more (Mode B) or shouldn't be an image at all
- Generate character illustrations text-free at 3:4 aspect ratio for hybrid panel layouts
- Speech bubbles as CSS overlays (`position: absolute; top: -2px; right: 8px;`) create the illusion of coming from the character's head — no image regeneration needed
- Use colored panel borders to encode meaning (red = bad/before, green = good/after)
- Bold bullets (`font-size: 0.92em; font-weight: 600`) for classroom readability
- Always take a screenshot to verify the slide fits within 1920x1080 before presenting
- Text-free images (Mode A) are still valuable — not every image needs to be an infographic. Hero banners, metaphor illustrations, and mood-setting images work great without text

**Content or approach to avoid:**
- Never rely on AI-generated text within images — it will have misspellings
- Don't generate full-slide infographics as single images; use hybrid approach instead
- Don't assume initial layout will fit — always screenshot-verify on 1920x1080
- Avoid "pretty but purposeless" images — every image must have educational intent

---
