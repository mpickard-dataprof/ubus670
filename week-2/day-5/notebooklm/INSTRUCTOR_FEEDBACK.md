# Instructor Feedback — Day 5: Google AI Studio

## Overall
- Content structure and pedagogical flow are strong — the 4-section arc (What is AI Studio → Parameters → System Prompts → Token Economics) is well-scaffolded
- The Beacon email triage case study provides excellent continuity and grounds every concept in a real business scenario
- The "pennies vs. dollars" ROI narrative is the emotional highlight — preserve and strengthen it visually
- All pricing, model names, and calculations have been updated to Gemini 3 (early 2026 rates) — preserve these exact figures
- The lecture is currently text-heavy with inline SVGs — needs visual design upgrade for projection readability

## Specific Slide Feedback

### Slide 1 — Title Slide
- Needs a strong visual element (currently just a small CSS-drawn control panel that reads as blurry at projection distance)
- The "AI Control Panel" concept is good — illustrate it with a compelling visual metaphor (dashboard, mixing board, cockpit)

### Slides 3-4 — Recap and Section 1 Divider
- Recap slide (Days 1-4 → Day 5) is effective as a text summary
- Section dividers throughout (slides 4, 8, 15, 23) are text-only with zero visual elements — each needs at least an icon or simple illustration to break visual monotony

### Slides 5-7 — What is AI Studio?
- The **Gemini Chat vs. AI Studio comparison table** (showroom vs. workshop) is strong — give it visual prominence
- The **AI Studio interface diagram** must clearly show the correct 2026 layout:
  - System Instructions at the **top** of the central workspace (not a left panel)
  - Chat Area in the **center** below system instructions
  - Run Settings in the **right panel** (temperature, top-p, top-k, max output tokens, token counter)
  - Model selector at the top of the page
- The **User → Configurer → Builder pyramid** is an effective conceptual anchor — make it visually memorable

### Slides 9-14 — Model Parameters
- **Temperature spectrum** must show exactly 3 zones:
  - Low (0.0-0.3): Classification, triage, data extraction, sentiment analysis
  - Medium (0.4-0.7): Customer responses, summaries, recommendations, professional writing
  - High (0.8-1.0): Brainstorming, marketing copy, product naming, taglines
- **Top-p explanation** should include the term "nucleus sampling" with a brief definition: the model considers the smallest set of tokens whose combined probability exceeds p
- **Top-p and top-k** are positioned as fine adjustments ("Temperature is the big knob") — preserve this framing, don't overemphasize
- **Max output tokens** — emphasize that longer is not always better, and that this controls both response quality and cost
- **Business takeaway** — the Beacon wrong-temperature story (temperature 1.2 for complaint classification → chaos) is effective — visualize the contrast
- **Engagement gap:** This section has 4-6 consecutive information slides with no interactive break. A visual checkpoint or discussion prompt between slides would help

### Slides 16-22 — System Prompts
- **RCTFC mapping** must be explicit — show how Day 2's framework maps to system prompt components:
  - Role → Role
  - Context → Rules & Boundaries
  - Task → Defined once, applied to every email
  - Format → Format (JSON, categories, etc.)
  - Constraints → Escalation, Tone & Boundaries
- **System prompt anatomy** (6 components: Role, Rules, Format, Escalation, Tone, Boundaries) — the radial/hub diagram concept is good, needs strong visual execution
- **Beacon system prompt example** — this is the most important concrete artifact. Must be readable at projection distance. Uses 7 categories: Complaint, Product Question, Order Status, Return/Exchange, Billing, Partnership Inquiry, Feedback/Praise
- **Good vs. Bad comparison** — the "job description that says 'do stuff'" metaphor is excellent — make the visual contrast dramatic
- **System prompts as governance** — important concept (scope control, escalation paths, data protection). Ties forward to Day 6 (red-teaming)
- **Iteration process** — Write → Test → Edge Cases → Refine → Version. The edge case examples are strong (Spanish email, profanity, products Beacon doesn't sell)

### Slides 24-28 — Token Economics
- **Token refresher** — ~1.3 tokens per English word. Token breakdown per email: System Prompt (~400 tokens) + Email Input (~300 tokens) + Output (~300 tokens) = ~1,000 tokens
- **Pricing table** — must show exactly:
  - Gemini 3 Flash ("The Toyota"): $0.50 input / $3.00 output per 1M tokens
  - Gemini 3 Pro ("The Mercedes"): $2.00 input / $12.00 output per 1M tokens
  - Pro costs ~4x more per token than Flash
- **Beacon email math** — must show exactly:
  - 200 emails/day × 30 days = 6,000/month
  - Input per email: ~700 tokens (400 system prompt + 300 email)
  - Output per email: ~300 tokens
  - Monthly input: 4.2M tokens, Monthly output: 1.8M tokens
  - Flash: $2.10 input + $5.40 output = **~$7.50/month**
  - Pro: $8.40 input + $21.60 output = **~$30.00/month**
- **Cost vs. Value bar chart** — the dramatic visual difference is key:
  - Human Triage: $600/month (1 hr/day @ $20/hr)
  - AI (Flash): ~$7.50/month
  - AI (Pro): ~$30/month
  - Flash delivers roughly **80x savings**
- Add disclaimer: "Illustrative, based on early 2026 rates. Real deployments have additional costs."

### Slides 29-31 — Takeaways and Close
- **4 Key Takeaways** (preserve exactly):
  1. Parameters Control Behavior — Temperature is the key dial
  2. System Prompts = Persistent RCTFC — 6 components
  3. Pennies vs. Dollars — ~$7.50/month Flash vs. $600/month manual, 80x savings
  4. AI Studio: User → Configurer — System prompts + parameters + model choice = configuration toolkit
- **Day 6 preview** — "You've built AI systems. Day 6: we break them." (Red-teaming, testing, guardrails)
- Final slide should include a call-to-action directing students to the lab

## Visual Design Notes (from UX Review)
- All SVG text throughout the lecture uses font sizes too small for projection (9-10px) — increase to 12-14px minimum
- Section dividers need visual elements (icons, illustrations) to break monotony
- The system prompt code block (slide 18) uses 0.72em font — too small for the most important example in the lecture
- The cost bar chart Y-axis should use a linear scale for accurate visual representation
- Maintain consistent color coding: Red (#C8102E) for emphasis/action, Navy (#1D428A) for structure/headers, Blue (#00A9E0) for information/secondary
