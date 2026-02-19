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

### Day 4: Multimodal AI (Rework via NotebookLM)
**Rework completed:** 2026-02-18
**Spec:** 0004

**What worked well:**
- NotebookLM full-bleed image approach scales well to multimodal topics (20 slides with diverse visual metaphors for image, audio, video AI)
- ElevenLabs v3 audio tags (`[excited]`, `[frustrated]`, `[disappointed]`) produce realistic customer personas — students can hear emotional delivery differences
- Competitor ad images (Nano Banana) work well for lab assets while NotebookLM handles lecture slides — complementary tools, not competing
- Cohesion across modalities: images, audio, and video all referencing the same competitor brands (Luxe Home & Style, MarketSquare) creates immersive business scenario
- Marketing campaign scenario (replacing receipt extraction) gives students creative ownership and multimodal variety

**What required significant revision:**
- Original Day 4 (receipt extraction) was too narrow — only covered image input, not generation or audio/video
- Context package for NotebookLM needed INSTRUCTOR_FEEDBACK.md with slide-by-slide feedback to get high-quality output
- Audio generation required specific voice selection and stability settings to match character personas

**Patterns to apply to future days:**
- When a day covers multiple modalities, use different AI tools for each: NotebookLM for lecture visuals, Nano Banana for lab-specific images, ElevenLabs for audio
- INSTRUCTOR_FEEDBACK.md is the highest-impact context file — specific slide-by-slide feedback produces dramatically better NotebookLM output
- Lab exercises with real AI-generated assets (actual audio files, actual images) are more engaging than describing what they would look like
- Competitor brand consistency across all materials (lecture, lab, quiz) creates narrative immersion

**Content or approach to avoid:**
- Single-modality labs when the lecture covers multimodal AI — students should experience all modalities hands-on
- Generic audio clips — invest in character-driven personas with emotional variety
- Disconnected lab assets — all images, audio, and video should reference the same business scenario

---

### Day 5: Google AI Studio (via NotebookLM)
**Completed:** 2026-02-18
**Spec:** 0005

**What worked well:**
- 15 slides + 2 quizzes is the most efficient deck yet (down from 31 SVG slides in the original)
- INSTRUCTOR_FEEDBACK.md continues to be the highest-impact context file for NotebookLM
- The "pennies vs. dollars" emotional centerpiece ($7.50/month AI vs. $600/month human) translates well to NotebookLM visual treatment — strong bar chart contrast
- Lecture-lab alignment is strong when both follow the same 4-section arc (What is AI Studio → Parameters → System Prompts → Token Economics)
- Quiz checkpoints placed after parameters section and after system prompts section create natural learning breaks
- Temperature zone visualization (Low/Medium/High with business use cases) is NotebookLM's strongest visual contribution to this deck

**What required significant revision:**
- Temperature zones must match exactly across lecture, lab, and quiz (0.0-0.3, 0.4-0.7, 0.8-1.0) — any inconsistency confuses students
- System prompt anatomy (6 components) needed to explicitly map to Day 2's RCTFC framework for continuity
- Token economics math must be preserved exactly from the spec — NotebookLM sometimes rounds or simplifies pricing

**Patterns to apply to future days:**
- 15-20 image slides + 2 interactive quizzes is the sweet spot for a 4-hour session (leaves room for lab time)
- Place quiz checkpoints at natural section boundaries (after ~1/3 and ~2/3 of content)
- When a day's content builds on a previous day's framework, make the connection explicit in both the PROJECT_BRIEF and INSTRUCTOR_FEEDBACK
- Speaker notes should reference "you'll do this in the lab" to create forward connections
- The Day 5 → Day 6 handoff (build system prompt → red-team it) is a strong pedagogical pattern: create then stress-test

**Content or approach to avoid:**
- Letting NotebookLM round or simplify pricing — exact figures must match across all materials
- Assuming students remember frameworks from earlier days — always include a brief recap or explicit reference
- More than 6 consecutive image slides without an interactive break (quiz or discussion prompt)

---

### NotebookLM Workflow (Cross-Cutting Lessons)
**Established:** 2026-02-17 to 2026-02-18 (Days 1-5)

**Key metrics:**
- Full-bleed approach produces 300-340 line lecture.html vs 1,700-1,900 for the old SVG approach
- 1-2 NotebookLM generation attempts typical (after Day 1, which took 3 attempts to calibrate)
- Slide counts range 15-21 depending on topic depth
- Context package quality directly correlates with output quality

**What makes a great context package:**
- PROJECT_BRIEF.md: audience, brand identity, deck structure, what to preserve (freeze sections with the template)
- INSTRUCTOR_FEEDBACK.md: slide-by-slide specific feedback — this is the single highest-impact file
- lecture.md: full text content converted from HTML (via html2md.py)
- day{N}-slides-current.pdf: visual reference of current state

**The full-bleed decision:**
- Do NOT recreate NotebookLM text in HTML — it duplicates content and loses visual quality
- Use slide PNGs as `data-background-image` with `data-background-size="contain"`
- Add CSS breathing room (box-sizing + padding + background-origin) so images don't clip against nav bar
- Inject interactive HTML-only quiz slides between image slides
- Speaker notes provide accessibility and presenter support

**Process improvements captured:**
- `/deploy-notebooklm` skill automates the deployment phase (copy images, copy PDF, generate lecture.html from template)
- Lecture template (`Materials/_shared/lecture-template.html`) freezes CSS/JS — only slide sections and metadata change
- Context package templates freeze the common sections — only day-specific content needs writing
- Deployment checklist (`notebooklm-deployment.md`) catches the CSS pitfalls that cost hours on Day 1

---
