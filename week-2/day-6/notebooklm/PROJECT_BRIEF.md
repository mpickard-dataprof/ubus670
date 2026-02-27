# NotebookLM Project Brief — Day 6: Red Teaming & AI Safety

## Course Context
- **Course:** UBUS 670 — AI for Business Leaders (MBA, Spring 2026)
- **Institution:** Northern Illinois University (NIU)
- **Day:** 6 of 9 (Week 2, Day 6 — Friday)
- **Topic:** Red Teaming & AI Safety — Testing, Breaking, and Hardening AI Systems
- **Audience:** MBA students with no technical background; business-focused framing required
- **Prerequisite knowledge:** Day 1 (What is GenAI, tokens, context windows), Day 2 (Prompt Engineering, RCTFC framework), Day 3 (Context Engineering, structured formats, JSON), Day 4 (Multimodal AI), Day 5 (Google AI Studio, parameters, system prompts, token economics)

## This Slide Deck
Day 6 flips the script. On Day 5, students built an AI email triage system for Beacon Retail Group with system prompts, parameter tuning, and cost analysis. Day 6 asks: "Now let's break it." Students learn red-teaming methodologies, execute structured attacks, diagnose failure modes, and harden their prompts with guardrails. The lecture covers:

1. **Why Break What You Built?** — Red teaming as quality assurance for AI (not hacking). Military origin → cybersecurity → AI safety. The "Build → Break → Rebuild" cycle. Students play both red team (attackers) and blue team (defenders).
2. **The Attacker's Playbook — 4 Attack Categories** — Role Confusion (asking AI to ignore instructions, change roles, reveal system prompt), Boundary Violations (requesting confidential info, out-of-scope advice), Output Manipulation (adversarial inputs designed to trick classification), Social Engineering (embedded instructions inside customer emails, emotional manipulation). Each category mapped to a business risk.
3. **The Defender's Toolkit — Guardrails** — 5-layer defense model using building security analogy (Perimeter → Identity → Behavior → Escalation → Recovery). System prompt hardening techniques: identity anchoring, instruction refusal, scope limitation, output validation, decision consistency. AI Studio safety settings as platform-level guardrails. When AI should say "I don't know."
4. **The Business Case — Governance & Real-World Failures** — Microsoft Tay (learned toxic behavior), Air Canada chatbot (inaccurate policy info, legally binding), Samsung code leak (confidential data exposed), Chevrolet dealer bot (sold car for $1 after social engineering). AI governance framework: Build → Test → Deploy → Monitor → Respond.

**Current state:** 21 Reveal.js slides with text-based layouts. Content is complete and accuracy-checked but all visuals are programmatic (no raster images, no custom illustrations). Needs visual design upgrade for projection readability.

## Brand Identity
- **Primary colors:** NIU Red (#C8102E), Black (#000000)
- **Secondary colors:** Navy (#1D428A), Blue (#00A9E0), Green (#43B02A)
- **Background:** White (#FFFFFF) — clean, professional
- **Heading font:** Montserrat (bold, clean)
- **Body font:** Georgia (readable serif)
- **Style:** Professional, clean, minimal — not playful or cartoonish. The tone should be serious but empowering (not scary or alarmist).

## Known Issues (See INSTRUCTOR_FEEDBACK.md for details)
1. Red teaming must be framed as business practice (QA for AI), not hacker culture — tone must be professional
2. The 4 attack categories need clear visual differentiation and memorable labels
3. The 5-layer defense model needs a strong visual metaphor (building security or concentric rings)
4. Real-world case studies need to feel current and business-relevant (not academic)
5. The Day 5 → Day 6 bridge must be prominent — students need to see this as a continuation, not a new topic
6. The "Build → Break → Rebuild" cycle should be the visual throughline of the entire deck

## What We Want From NotebookLM
1. **Visual design** — consistent illustrations, professional layouts, strong whitespace
2. **Content preservation** — all content has been accuracy-checked; preserve the facts and figures exactly
3. **Better visual metaphors** — especially for: the 4 attack categories (threat matrix or quadrant), the 5-layer defense model (concentric rings or building layers), the Build → Break → Rebuild cycle, red team vs. blue team roles, before/after system prompt comparison
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
- **Beacon Retail Group** case study continuity — the email triage system from Day 5 is the target
- The **4 attack categories**: Role Confusion, Boundary Violations, Output Manipulation, Social Engineering
- The **5-layer defense model**: Perimeter, Identity, Behavior, Escalation, Recovery
- The **"Build → Break → Rebuild" cycle** as the core pedagogical pattern
- The **real-world case studies**: Tay (2016), Air Canada (2024), Samsung (2023), Chevrolet (2023)
- The **building security analogy** for the defense model (fence, badge, camera, panic button, fire drill)
- The **system prompt hardening techniques**: identity anchoring, instruction refusal, scope limitation, output validation, decision consistency
- Connection to **Day 5**: students built the system they're now testing
- Connection to **Day 7 preview**: multi-agent/agentic AI (one AI checking another)
- The **4 key takeaways**: Test before you trust, Think like an attacker, Defend in layers, AI governance is a business skill
- **Business framing throughout**: "Quality assurance for AI" not "hacking"
