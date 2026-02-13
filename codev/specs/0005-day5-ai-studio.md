# Specification: Day 5 — Google AI Studio

**Spec ID:** 0005
**Title:** Day 5 (Google AI Studio) — Model Parameters, System Prompts, and Token Economics
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-02-13
**Parent Spec:** 0001 (UBUS 670 Course Materials)
**Related Specs:** 0004 (Day 4 Multimodal — preceding day), 0003 (Image Generation Tooling)

---

## 1. Overview

### 1.1 Purpose

Create Day 5 materials that transition students from AI *users* (Days 1-4) to AI *configurers*. Using Google AI Studio, students learn to tune model behavior through parameters, write system prompts that define AI personality and rules, estimate token costs for business deployments, and build reusable configurations. The lab centers on building Beacon Retail Group's customer email triage and response system.

### 1.2 Core Teaching Shift

| Days 1-4 | Day 5 |
|---|---|
| "Talk to AI and see what happens" | "Configure AI to behave the way your business needs" |
| Single-turn or conversational | System prompts define persistent behavior |
| Default settings | Tunable parameters change output character |
| Free tools, no cost awareness | Token economics and deployment budgeting |

This is the day students start thinking like **AI system designers**, not just AI users.

### 1.3 Date and Logistics

- **Date:** Wednesday, March 18, 2026
- **Time:** 8:30 AM - 12:30 PM (4 hours)
- **Location:** Barsema Hall 331
- **Tool:** Google AI Studio (free tier, requires Google account)
- **Week:** 2, Day 5 of 9

### 1.4 Scope

This spec covers **4 files** in `Materials/Materials/Week 2/Day 5/web/`:
- `lecture.html` — Reveal.js slides (~28-32 slides)
- `lab.html` — Hands-on email triage lab (~90-120 minutes)
- `quiz.html` — 20-question knowledge check (20+ topics × 2 variants)
- `index.html` — Navigation hub

### 1.5 Day 4 → Day 5 Bridge

Day 4 teaches students to use multimodal AI for analysis and creation (marketing campaign). Day 5 asks: "Now that you've seen what AI can do, how do you configure it to do it *consistently* and *at scale*?"

| Day 4 Concept | Day 5 Extension |
|---|---|
| Used Gemini chat for multimodal analysis | AI Studio gives you the control panel *behind* the chat |
| Prompts were ad-hoc, one at a time | System prompts make behavior persistent and reusable |
| Default model settings | Parameters (temperature, top-p, top-k) let you tune creativity vs. consistency |
| No cost discussion | Token economics — what would this cost at Beacon's scale? |
| Image generation via chat | AI Studio can prototype any modality with full parameter control |

**Quick Recap slide content (Slide 3):** "Days 1-4 you learned to *use* AI — prompt it, give it context, feed it images and audio. Today: you step behind the curtain. AI Studio is the control panel where you configure *how* AI behaves, *what* it costs, and *how* to make it repeatable."

---

## 2. Research Findings

### 2.1 Google AI Studio Capabilities (2026)

Google AI Studio is Google's web-based IDE for prototyping with Gemini models. Free tier includes:

| Feature | Description | Lab Feasibility |
|---|---|---|
| **Prompt playground** | Test prompts with real-time response | HIGH — core experience |
| **System instructions** | Persistent instructions that shape all responses | HIGH — central to lab |
| **Temperature control** | 0.0 (deterministic) to 2.0 (creative) | HIGH — visible, tangible effect |
| **Top-p / Top-k** | Nucleus sampling and top-k token selection | HIGH — explain conceptually, demo in playground |
| **Token counter** | Real-time input/output token counting | HIGH — essential for cost estimation |
| **Model selection** | Switch between Gemini models (Flash, Pro) | HIGH — compare speed vs. quality |
| **Structured prompts** | Input/output example pairs for few-shot | MEDIUM — nice extension of Day 2 |
| **Chat mode** | Multi-turn conversation with system prompt | HIGH — for email response testing |
| **Export to code** | Generate Python/JS/cURL for API integration | LOW — awareness only for MBA audience |
| **Safety settings** | Adjustable content filtering thresholds | MEDIUM — mention for governance awareness |

### 2.2 Parameter Effects (Teaching Framework)

Students need an intuitive mental model for parameters. Use the "Radio Dial" analogy:

| Parameter | Analogy | Low Setting | High Setting | Business Use |
|---|---|---|---|---|
| **Temperature** | "Creativity dial" | Predictable, focused, repetitive | Creative, diverse, sometimes wild | Low for classification, high for brainstorming |
| **Top-p** | "Vocabulary range" | Sticks to common words/phrases | May use unusual phrasing | Low for formal communications, higher for creative |
| **Top-k** | "Options considered" | Picks from top few choices | Considers many alternatives | Low for consistent outputs, high for variety |
| **Max tokens** | "Word limit" | Brief responses | Lengthy responses | Set based on use case (email reply vs. report) |

### 2.3 Token Economics (2026 Pricing Basis)

Use illustrative pricing for the cost estimation exercise. Include disclaimer that prices change frequently.

**Illustrative rates (for classroom use — actual rates may vary):**
- Gemini Flash: ~$0.075 / 1M input tokens, ~$0.30 / 1M output tokens
- Gemini Pro: ~$1.25 / 1M input tokens, ~$5.00 / 1M output tokens

**Beacon scenario math:**
- Beacon receives ~200 customer emails/day
- Average email: ~150 words (~200 tokens input)
- System prompt: ~500 tokens (sent with every request)
- Average classification + response: ~300 tokens output
- Per-email total: ~700 input tokens + ~300 output tokens

**Monthly cost estimate exercise:**
- 200 emails/day × 30 days = 6,000 emails/month
- Input: 6,000 × 700 = 4.2M tokens/month
- Output: 6,000 × 300 = 1.8M tokens/month
- Flash cost: ~$0.32 + ~$0.54 = **~$0.86/month**
- Pro cost: ~$5.25 + ~$9.00 = **~$14.25/month**

Key teaching point: AI is remarkably cheap at scale for text processing. The cost of *not* using AI (manual triage at $20/hr) dwarfs the API cost.

### 2.4 System Prompt Best Practices

Teach system prompts as "the job description for your AI employee":

1. **Role definition** — Who is this AI? (Beacon Customer Service Agent)
2. **Behavioral rules** — What should it always/never do?
3. **Output format** — How should responses be structured?
4. **Escalation criteria** — When should it defer to a human?
5. **Tone and style** — Professional, empathetic, brand-aligned
6. **Knowledge boundaries** — What should it refuse to answer?

This extends Day 2's RCTFC framework into a persistent configuration.

---

## 3. Lecture Structure

### 3.1 Learning Objectives

1. **Configure** model parameters (temperature, top-p, top-k) and explain their effect on AI output
2. **Write** effective system prompts that define consistent AI behavior for a business use case
3. **Estimate** token costs for a real business deployment scenario
4. **Build** a reusable AI configuration in Google AI Studio for Beacon's email triage

### 3.2 Slide Structure (Target: ~28-32 slides)

**Section 1: Behind the Curtain — What is AI Studio? (~7 slides)**

| Slide | Title | Content | Visual |
|---|---|---|---|
| 1 | Title Slide | "Google AI Studio: The AI Control Panel" | [NANO BANANA: Warm illustration of a business professional at a control panel with dials and screens showing AI responses] |
| 2 | Learning Objectives | 4 objectives (see 3.1) | Objectives list |
| 3 | Quick Recap: Days 1-4 → Day 5 | Bridge from using to configuring. "You've been talking to AI. Now you learn to configure it." | SVG: Progression timeline: Day 1 (What is AI?) → Day 2 (Prompt) → Day 3 (Context) → Day 4 (Multimodal) → Day 5 (Configure) |
| 4 | Section Divider | "Behind the Curtain" | Navy background |
| 5 | What is Google AI Studio? | AI Studio vs Gemini Chat: same models, more control. "Gemini Chat is the showroom. AI Studio is the workshop." | Two-column comparison: Chat (simple, conversational) vs Studio (parameters, system prompts, token counts, export) |
| 6 | The AI Studio Interface Tour | Annotated screenshot/diagram of the interface: model selector, system instructions pane, chat area, parameter sliders, token counter. | SVG: Simplified AI Studio layout diagram with labeled zones |
| 7 | Why Configurers > Users | "Anyone can use AI. Businesses need people who can configure it." Three levels: User (types prompts) → Configurer (sets system prompts + parameters) → Builder (writes code + deploys). Day 5 moves you to Configurer. | SVG: Three-tier pyramid with role descriptions |

**Section 2: The Dials — Model Parameters (~7 slides)**

| Slide | Title | Content | Visual |
|---|---|---|---|
| 8 | Section Divider | "The Dials" | Red background |
| 9 | Temperature: The Creativity Dial | Definition: controls randomness in token selection. Low (0.0-0.3) = focused, predictable. High (1.0-2.0) = creative, surprising. Live demo: same prompt at temp 0.1 vs 1.5. | SVG: Temperature dial visualization with example outputs at different settings. NIU brand colors. |
| 10 | When to Use Which Temperature | Decision matrix: Classification/triage → low. Creative writing → high. Customer responses → medium. Data extraction → very low. Connect to Day 4: "Image generation prompts benefit from moderate temperature." | Info card grid: use case → recommended temperature range |
| 11 | Top-p and Top-k: Fine-Tuning the Dial | Top-p (nucleus sampling): probability threshold. Top-k: number of candidates. "Temperature is the big knob. Top-p and top-k are fine adjustments." For MBA: awareness level, not mastery. | SVG: Token probability distribution showing how top-p and top-k filter tokens. Simplified, annotated. |
| 12 | Max Output Tokens | Controls response length. Business consideration: longer ≠ better. Set based on use case. Short: email classification (50 tokens). Medium: email response (200 tokens). Long: report generation (2000 tokens). | SVG: Length comparison with use cases |
| 13 | Parameter Interaction Demo | "Let's see these in action." Interactive discussion: What happens when you set temperature to 0 and ask for a creative story? What about temperature 2.0 for a legal document? | Discussion prompt with thought experiment examples |
| 14 | The Business Takeaway | Parameters aren't just technical settings — they're business decisions. "A customer complaint routed with high temperature might get classified differently each time. That's a business risk." | Callout box with key insight + real-world consequence examples |

**Section 3: System Prompts — The AI Job Description (~8 slides)**

| Slide | Title | Content | Visual |
|---|---|---|---|
| 15 | Section Divider | "The AI Job Description" | Blue background |
| 16 | What is a System Prompt? | Definition: persistent instructions that shape every response. Difference from user prompts: system = always present, user = per-message. Extends Day 2 RCTFC into persistent configuration. "Day 2 you crafted individual prompts. A system prompt is an RCTFC that persists across every interaction." | SVG: System prompt (persistent layer) + User prompt (per-message) → Response. Show system prompt wrapping around the conversation. |
| 17 | Anatomy of a Great System Prompt | 6 components from Section 2.4: Role, Rules, Format, Escalation, Tone, Boundaries. Each with a Beacon email triage example. | SVG: System prompt anatomy diagram — 6 connected blocks, each with a Beacon example snippet |
| 18 | System Prompt: Beacon Email Triage | Full example system prompt for email triage. Walk through each section. Show how it shapes behavior. | Code-style callout with the full system prompt, color-coded by component |
| 19 | Good vs. Bad System Prompts | Side-by-side comparison. Bad: "You are a helpful assistant." Good: the full Beacon system prompt. Show the dramatically different output quality. | Two-column: vague prompt → inconsistent output vs. detailed prompt → structured, reliable output |
| 20 | System Prompts as Governance | System prompts are your first line of AI governance. They define: what the AI can/cannot discuss, when to escalate to humans, how to handle sensitive information, what disclaimers to include. Connects to Day 6 (testing & guardrails). | Info cards: governance capabilities encoded in system prompts |
| 21 | Iterating System Prompts | System prompts need testing and iteration, just like code. Version your system prompts. Test with edge cases. "What happens when someone sends a complaint in Spanish? When an email contains profanity? When someone asks for a refund on a product Beacon doesn't sell?" | Iteration cycle SVG (callback to Day 2 pattern) |
| 22 | Discussion: Your Industry's System Prompt | "If your industry deployed an AI email responder, what rules would the system prompt need?" Healthcare: HIPAA compliance. Finance: no investment advice. Retail: return policy limits. | Discussion prompt box |

**Section 4: Token Economics & Wrap-Up (~8 slides)**

| Slide | Title | Content | Visual |
|---|---|---|---|
| 23 | Section Divider | "What Does It Cost?" | Green background |
| 24 | What Are Tokens? (Refresher) | Quick callback to Day 1: tokens ≈ word fragments. "Hello world" = 2 tokens. System prompt = sent with EVERY message (cost multiplier). Show AI Studio's token counter. | SVG: Token breakdown visualization with counter display |
| 25 | Token Pricing: Model Tiers | Gemini Flash vs Pro comparison: speed, quality, cost. "Flash is the Toyota, Pro is the Mercedes. Both get you there — the question is what your use case needs." Include disclaimer: "Illustrative prices, actual rates change frequently." | Comparison table: model tier, speed, quality rating, price per million tokens |
| 26 | The Beacon Email Math | Walk through the cost calculation from Section 2.3. Students follow along in AI Studio counting tokens. "200 emails/day × 30 days. Here's what it costs." Key insight: AI is remarkably cheap for text processing. | Cost calculation walkthrough with running totals |
| 27 | Cost vs. Value | The real question isn't "how much does AI cost" but "how much does NOT using AI cost." Beacon scenario: 1 hour/day manual triage at $20/hr = $600/month vs ~$1/month AI. ROI is not about AI cost — it's about human cost displaced. Include the cautionary note: ROI figures are illustrative. | SVG: Cost comparison — human labor vs AI processing with dramatic visual difference |
| 28 | Building Reusable Configurations | AI Studio lets you save configurations: system prompt + parameters + model selection = reusable template. "Configure once, deploy everywhere." Export options: save in Studio, export to code, share with team. | SVG: Configuration components flowing into saved template |
| 29 | Key Takeaways | 4-5 bullets mapped to learning objectives. (1) Parameters control AI behavior — temperature is the key dial. (2) System prompts are persistent RCTFC — the AI job description. (3) Token costs are low but scale matters — always estimate before deploying. (4) AI Studio is where users become configurers. | Takeaway list with checkmarks |
| 30 | What's Next: Day 6 | "You've built AI systems in Days 4-5. Day 6: we break them. Red-teaming, testing, and guardrails — making sure your AI does what it should and nothing it shouldn't." | Forward-looking preview |
| 31 | Questions | Q&A slide | Standard |

---

## 4. Lab Structure

### 4.1 Lab Theme: "Beacon's Customer Email Triage System"

**Total time: ~90-120 minutes across 4 parts**

Beacon's customer service team receives 200+ emails daily. They need an AI system that:
1. Classifies emails by category (complaint, return, inquiry, compliment, escalation)
2. Assesses urgency (high, medium, low)
3. Drafts appropriate responses matching Beacon's brand voice
4. Estimates what this would cost at scale

### 4.2 Lab Structure

**Part 0: Tool Setup (10 minutes)**

| Task | Description |
|---|---|
| Task 0: Access AI Studio | Navigate to Google AI Studio (aistudio.google.com). Verify access with Google account. Interface orientation: identify system instructions pane, chat area, parameter sliders, token counter, model selector. |

**[Tip Box]** "If AI Studio is unavailable, Gemini Chat (gemini.google.com) can be used for Parts 1-2. You'll miss the parameter controls but can still practice system prompts."

**Part 1: System Prompt Engineering (25 minutes)**

| Task | Description |
|---|---|
| Task 1: Write the Classification System Prompt | Write a system prompt for email classification. Must include: role (Beacon Customer Service AI), output format (JSON with category, urgency, reasoning), categories (complaint, return, inquiry, compliment, escalation), urgency criteria. Template provided with blanks to fill. |
| Task 2: Test with Sample Emails | Test the system prompt with 5 provided sample emails (one per category). Record the classification output. Are all categories correctly assigned? Is urgency reasonable? |
| Task 3: Iterate the System Prompt | Identify a weakness (e.g., misclassified email). Modify the system prompt to fix it. Document: what went wrong, what you changed, did it fix it without breaking other classifications? |

**[Compare with Classmates]** Share your system prompts. Did different wording produce different classification accuracy? Which system prompt components made the biggest difference?

**Part 2: Parameter Tuning (20 minutes)**

| Task | Description |
|---|---|
| Task 4: Temperature Experiment | Using the same system prompt and the same 3 test emails, run each email at temperature 0.1, 0.7, and 1.5. Record how classification consistency changes. At what temperature does classification become unreliable? |
| Task 5: Response Drafting Parameters | Switch to response drafting mode: change the system prompt to draft customer responses (not just classify). Test temperature 0.3 vs 0.8 for response quality. Which produces more natural-sounding responses? Which is more consistent? |
| Task 6: Find Your Optimal Settings | Based on experiments, define Beacon's optimal configuration: classification temperature, response drafting temperature, max tokens for each task. Document your reasoning. |

**[Compare with Classmates]** Did everyone arrive at the same optimal settings? Why might different settings be "optimal" for different team members?

**Part 3: Token Economics (20 minutes)**

| Task | Description |
|---|---|
| Task 7: Count Real Tokens | Using AI Studio's token counter, measure: (a) your system prompt token count, (b) average customer email token count (from 3 samples), (c) average classification output token count, (d) average response output token count. Record exact numbers. |
| Task 8: Monthly Cost Projection | Using the token counts from Task 7 and the pricing table provided, calculate Beacon's monthly cost for: (a) classification only (200 emails/day), (b) classification + response drafting (200 emails/day), (c) Flash model vs Pro model. Fill in the cost worksheet. |
| Task 9: Build the Business Case | Complete the ROI comparison: current cost (manual triage, 1 hour/day at $20/hr) vs. AI cost. Calculate: monthly savings, annual savings, break-even point (hint: it's day one). Draft a 3-sentence pitch to Beacon's CFO. |

**[Compare with Classmates]** Compare your cost projections. Did different system prompts produce different token counts? What's the cost impact of a verbose vs. concise system prompt?

**Part 4: Build & Submit (25 minutes)**

| Task | Description |
|---|---|
| Task 10: Build the Complete Configuration | In AI Studio, create the final Beacon email triage configuration: optimal system prompt (from Part 1), optimal parameters (from Part 2), selected model tier (from Part 3 analysis). Test with 3 new emails you haven't seen before. |
| Task 11: Edge Case Testing | Test your configuration with edge cases: (a) an email in broken English, (b) an email that's both a complaint AND a return request, (c) an email asking about a product Beacon doesn't sell, (d) an email with angry profanity. How does your system handle each? Document weaknesses. |
| Task 12: Reflection & Submission | Reflect on: (1) What surprised you about parameter effects? (2) How did your system prompt evolve? (3) What edge cases would you want to test before deploying this for real? (connects to Day 6). Generate PDF and submit to LMS. |

**[Compare with Classmates]** Share your edge case findings. What broke everyone's system? What would you add to the system prompt to handle these cases?

### 4.3 Lab Assets Needed

| Asset | Description | How to Create |
|---|---|---|
| 15+ sample customer emails | Variety: complaints, returns, inquiries, compliments, escalations, edge cases | Generate with realistic Beacon scenarios. Include sender names, subject lines, email bodies. |
| System prompt template | Partially filled template with blanks for students to complete | HTML callout box in lab.html |
| Cost worksheet | Table for recording token counts and calculating monthly costs | HTML table with input fields |
| Pricing reference card | Current illustrative pricing for Gemini Flash and Pro | Styled card with disclaimer |
| Beacon brand voice guide | Tone, vocabulary, sign-off conventions for customer responses | Brief card (professional, empathetic, solution-oriented, sign off as "The Beacon Team") |

### 4.4 Email Dataset Design

Create 15+ emails across these categories:

| Category | Count | Characteristics |
|---|---|---|
| Complaint | 3 | Product quality, service failure, billing error |
| Return/Exchange | 3 | Within policy, outside policy, damaged item |
| Inquiry | 3 | Store hours, product availability, gift card balance |
| Compliment | 2 | Employee praise, product satisfaction |
| Escalation | 2 | Threatening legal action, VIP customer |
| Edge cases | 3+ | Multi-category, non-English fragments, profanity, phishing attempt |

Each email should feel realistic: include sender name, subject line, and 3-8 sentence body.

---

## 5. Quiz Structure

### 5.1 Question Topics (22 topics × 2 variants = 44 questions, select 20 per attempt)

| # | Topic | Sample Question Direction |
|---|---|---|
| 1 | Google AI Studio purpose | What distinguishes AI Studio from Gemini Chat? |
| 2 | Temperature definition | What does the temperature parameter control? |
| 3 | Temperature business use | Which temperature setting is best for email classification? |
| 4 | Top-p concept | What does top-p (nucleus sampling) do? |
| 5 | Top-k concept | How does top-k differ from temperature? |
| 6 | Max tokens | What happens if max output tokens is too low for a task? |
| 7 | Parameter interaction | What's the likely result of temperature 0 + top-p 1.0? |
| 8 | System prompt definition | What is a system prompt and how does it differ from a user prompt? |
| 9 | System prompt components | Which is NOT a typical component of a business system prompt? |
| 10 | System prompt iteration | Why do system prompts need iterative testing? |
| 11 | System prompt governance | How do system prompts serve as AI governance tools? |
| 12 | Token definition (refresher) | Approximately how many tokens is a 200-word email? |
| 13 | Token cost factors | Which factor most increases the cost of an AI deployment? |
| 14 | Model tier selection | When should a business choose Gemini Pro over Flash? |
| 15 | Cost estimation | Given a scenario, estimate which deployment is cheaper |
| 16 | ROI calculation | What's the primary driver of AI ROI for email processing? |
| 17 | Reusable configurations | What components make up a reusable AI Studio configuration? |
| 18 | Email classification | What makes email classification a good use case for low temperature? |
| 19 | Edge case handling | How should a well-designed system prompt handle unknown categories? |
| 20 | Day 5 → Day 6 connection | Why is testing important after configuring an AI system? |
| 21 | User vs configurer | What distinguishes an AI "configurer" from an AI "user"? |
| 22 | System prompt vs fine-tuning | How does a system prompt differ from fine-tuning? (callback to Day 3) |

### 5.2 Standards

- 44 questions in bank (22 topics × 2 variants)
- 20 questions per attempt, randomized (one per topic)
- 70%+ passing threshold (14/20)
- Formative feedback on every question
- Answers NOT pre-selected

---

## 6. Visual Assets

### 6.1 SVG Diagrams Required

| Slide | Diagram | Complexity |
|---|---|---|
| 3 | Course progression timeline (Days 1-5) | Medium — 5-node horizontal flow |
| 6 | AI Studio interface layout | Medium — labeled zones diagram |
| 7 | User → Configurer → Builder pyramid | Simple — three tiers |
| 9 | Temperature dial visualization | Medium — dial with output examples |
| 11 | Token probability distribution | Medium — bar chart with cutoff lines |
| 12 | Output length comparison | Simple — three bars with use cases |
| 16 | System prompt + user prompt layers | Medium — layered diagram |
| 17 | System prompt anatomy (6 components) | Complex — 6 connected blocks |
| 24 | Token breakdown visualization | Simple — word → tokens mapping |
| 27 | Cost comparison (human vs AI) | Medium — side-by-side with dramatic difference |
| 28 | Configuration components diagram | Medium — components → saved template |

All SVGs must meet quality bar: 12-14px labels, 9-10px subtitles (never below 9px), rounded rect nodes (rx="10", 120x52px min), drop shadows, curved arrows with markers, NIU brand colors, generous viewBox (360x340+).

### 6.2 Nano Banana Image Prompts

| Slide | Prompt |
|---|---|
| 1 (Title) | "Warm professional illustration of a business person at a modern control panel with colorful dials, sliders, and screens showing text analytics. The screens display email messages being sorted into categories. Clean minimal style, soft warm lighting. Educational illustration, not photorealistic. No text, no labels, no words." |
| 5 (Chat vs Studio) | "Two-panel illustration: LEFT shows a person casually chatting with an AI on a phone (simple, conversational). RIGHT shows the same person at a detailed workbench with tools, dials, and configuration screens (workshop feel). Warm illustration style, business context. No text, no labels, no words." |

---

## 7. Index Page

### 7.1 Content

- **Title:** "Google AI Studio"
- **Subtitle:** "Day 5: Configuring AI for Business — Parameters, System Prompts, and Costs"
- **Date:** Wednesday, March 18, 2026
- **Duration:** 4 hours
- **Tools:** Google AI Studio (free tier)
- **Case study banner:** "Beacon's customer service team is drowning in 200+ emails daily. Today you'll build an AI-powered triage system that classifies urgency, drafts responses, and costs pennies. Welcome to the business side of AI."
- **Breadcrumb:** UBUS 670 › Week 2 › Day 5

### 7.2 Learning Objectives (for index page)

- **Configure** model parameters and explain their business impact
- **Write** system prompts that define consistent AI behavior
- **Estimate** token costs for real business deployments
- **Build** a reusable AI configuration for email triage

---

## 8. Acceptance Criteria

### 8.1 Lecture

- [ ] AI Studio introduced with clear comparison to Gemini Chat
- [ ] All 4 key parameters explained (temperature, top-p, top-k, max tokens) with business context
- [ ] System prompts taught as "AI job description" with 6-component anatomy
- [ ] Full Beacon email triage system prompt example walked through
- [ ] Token economics with concrete Beacon cost calculation
- [ ] Day 4 → Day 5 bridge present (Quick Recap)
- [ ] Day 5 → Day 6 preview (testing what you built)
- [ ] All SVGs meet quality bar
- [ ] Technical terms defined at first use (token, temperature, top-p, nucleus sampling, system prompt)

### 8.2 Lab

- [ ] AI Studio tool setup verified in Part 0
- [ ] Students write their own system prompt (not just copy one)
- [ ] Parameter experiments with measurable results (temperature at 3 settings)
- [ ] Real token counting using AI Studio's counter
- [ ] Monthly cost projection completed with worksheet
- [ ] Edge case testing included (broken English, multi-category, profanity)
- [ ] "Compare with Classmates" boxes in every part
- [ ] 15+ realistic sample emails provided
- [ ] PDF download + LMS submission
- [ ] Fallback path if AI Studio is unavailable (Gemini Chat)

### 8.3 Quiz

- [ ] 44 questions in bank (22 topics × 2 variants)
- [ ] 20 questions per attempt, randomized
- [ ] No pre-selected answers
- [ ] Formative feedback on every question
- [ ] 70%+ passing threshold (14/20)

### 8.4 Quality Standards

- [ ] All SVG diagrams meet quality bar
- [ ] Technical terms defined at first use with callout/tip boxes
- [ ] Beacon Retail Group case study integrated throughout
- [ ] Breadcrumb: UBUS 670 › Week 2 › Day 5 › [Component]
- [ ] No Google Workspace references
- [ ] Illustrative pricing includes disclaimer
- [ ] Nano Banana prompts included as HTML comments for Spec 0003

---

## 9. Out of Scope

- Actual API key generation or code deployment (awareness only)
- Fine-tuning in AI Studio (de-emphasized per Day 3 lessons — awareness mention only)
- Multimodal features in AI Studio (covered in Day 4)
- Building the actual Beacon email pipeline (this is a prototype/proof of concept)
- Automated testing (Day 6 covers manual red-teaming)

---

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI Studio interface changes before class | Medium | Medium | Verify UI close to class date; provide Gemini Chat fallback for core exercises |
| AI Studio free tier limits hit during class | Low | Medium | Stagger student access; have Gemini Chat backup |
| Token pricing changes significantly | Medium | Low | Use "illustrative" framing with disclaimer; focus on methodology, not exact numbers |
| Students confused by multiple parameters | Medium | Medium | Focus on temperature as primary; treat top-p/top-k as awareness only |
| System prompt exercises produce inconsistent results across students | Low | Low | This IS the lesson — different prompts produce different behavior. Lean into it. |

---

## 11. Approval

**Status:** Awaiting human review

- [ ] Spec reviewed by project owner
- [ ] AI Studio as the Day 5 tool approved
- [ ] Email triage lab scenario approved
- [ ] Parameter teaching approach (radio dial analogy) approved
- [ ] Token economics section with illustrative pricing approved
- [ ] System prompt as "AI job description" framing approved
- [ ] Quiz structure (22 topics × 2 variants, 20 per attempt) approved

---

*End of Specification*
