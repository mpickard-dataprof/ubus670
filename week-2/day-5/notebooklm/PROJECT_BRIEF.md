# NotebookLM Project Brief — Day 5: Google AI Studio — The AI Control Panel

## Course Context
- **Course:** UBUS 670 — AI for Business Leaders (MBA, Spring 2026)
- **Institution:** Northern Illinois University (NIU)
- **Day:** 5 of 9 (Week 2, Day 5 — Wednesday)
- **Topic:** Google AI Studio — Configuring AI for Business (Parameters, System Prompts, Token Economics)
- **Audience:** MBA students with no technical background; business-focused framing required
- **Prerequisite knowledge:** Day 1 (What is GenAI, tokens, context windows), Day 2 (Prompt Engineering, RCTFC framework), Day 3 (Context Engineering, structured formats, JSON), Day 4 (Multimodal AI)

## This Slide Deck
Day 5 moves students from "AI users" to "AI configurers" — the people who set the dials and write the rules that determine how AI behaves in an organization. The lecture covers:

1. **What is AI Studio?** — Browser-based tool that exposes the settings consumer chatbots hide. Gemini Chat (the showroom) vs. AI Studio (the workshop). Three key zones: System Instructions (top of central workspace), Chat Area (center), Run Settings (right panel).
2. **The Dials — Model Parameters** — Temperature (the creativity dial, 3 zones: Low 0.0-0.3, Medium 0.4-0.7, High 0.8-1.0), Top-p (nucleus sampling) and Top-k (fine adjustments), Max Output Tokens (response length ceiling). Parameters as business decisions, not just technical settings.
3. **The AI Job Description — System Prompts** — Persistent instructions (RCTFC from Day 2 made permanent). Six anatomy components: Role, Rules, Format, Escalation, Tone, Boundaries. Beacon Email Triage system prompt as the running example. Good vs. bad prompts. System prompts as governance. Iteration process.
4. **Token Economics** — Token refresher (~1.3 tokens per English word). Gemini 3 Flash ($0.50/$3.00 per 1M tokens) vs. Gemini 3 Pro ($2.00/$12.00). Beacon math: 6,000 emails/month at ~$7.50/month (Flash) vs. $600/month manual = 80x savings. Reusable configurations concept.

**Current state:** 31 Reveal.js slides with inline SVG diagrams and CSS-styled HTML. Well-structured content but all visuals are programmatic (no raster images, no custom illustrations). Has been through a 4-critic review board and all content/accuracy fixes have been applied.

## Brand Identity
- **Primary colors:** NIU Red (#C8102E), Black (#000000)
- **Secondary colors:** Navy (#1D428A), Blue (#00A9E0), Green (#43B02A)
- **Background:** White (#FFFFFF) — clean, professional
- **Heading font:** Montserrat (bold, clean)
- **Body font:** Georgia (readable serif)
- **Style:** Professional, clean, minimal — not playful or cartoonish

## Known Issues (See INSTRUCTOR_FEEDBACK.md for details)
1. AI Studio interface diagram needs to clearly show the 3-zone layout (system instructions at top of central workspace, not a left panel)
2. Temperature zones must be exactly 3: Low (0.0-0.3), Medium (0.4-0.7), High (0.8-1.0) — must match lab exercises
3. RCTFC framework from Day 2 should be explicitly mapped to the 6 system prompt components
4. The "pennies vs. dollars" ROI story is the emotional centerpiece — $7.50/month AI vs. $600/month human (80x savings)
5. Section dividers (4 total) are text-only with no visual elements — need icons or illustrations
6. SVG font sizes are too small for projection — need to be readable from back of room
7. Parameter section (4 consecutive slides) has no interactive checkpoint — needs a visual break

## What We Want From NotebookLM
1. **Visual design** — consistent illustrations, professional layouts, strong whitespace
2. **Content preservation** — all content has been accuracy-checked and updated; preserve the facts and figures exactly
3. **Better visual metaphors** — especially for: temperature spectrum, AI Studio interface layout, system prompt anatomy (the 6-component model), cost comparison (pennies vs. dollars)
4. **Educational flow** — clearer scaffolding with visual section breaks between the 4 major sections
5. **Business framing** — every technical concept tied to Beacon Retail Group's email triage scenario
6. **Readable at distance** — large fonts, clear hierarchy, designed for projection in a lecture hall

## Critical Output Requirement
The slides will be used **as full-bleed background images** in Reveal.js. They must be:
- Visually self-contained (all text and graphics baked into each slide image)
- High quality at 16:9 aspect ratio
- Readable at presentation scale (large fonts, clear hierarchy)
- Consistent visual style across all slides

## What to Preserve
- **Beacon Retail Group** case study continuity (email triage scenario running through entire lecture)
- The **"User → Configurer → Builder" skill pyramid** (Day 5 moves students to Configurer level)
- The **Gemini Chat vs. AI Studio comparison table** (showroom vs. workshop metaphor)
- The **temperature spectrum visualization** with 3 zones and business use cases per zone
- The **system prompt anatomy** with 6 components radiating from center
- The **Beacon system prompt example** (Role, Rules, Format, Escalation, Tone, Boundaries)
- The **"Good vs. Bad" system prompt comparison** — vague job description vs. detailed one
- The **token economics math** — $7.50/month Flash, $30/month Pro, $600/month human, 80x savings
- The **cost bar chart** showing dramatic visual difference between AI and human costs
- The **car analogy** — Flash = Toyota, Pro = Mercedes
- Connection to **Day 2 RCTFC framework** (system prompts = persistent RCTFC)
- Connection to **Day 6 preview** (red-teaming and testing the system prompts built today)
- **Learning objectives** and **key takeaways** (4 each, aligned across all materials)
