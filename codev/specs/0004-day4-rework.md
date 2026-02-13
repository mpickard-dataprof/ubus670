# Specification: Day 4 Multimodal AI — Major Rework

**Spec ID:** 0004
**Title:** Day 4 (Multimodal AI) — Rework Based on Instructor Feedback
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-02-12
**Parent Spec:** 0001 (UBUS 670 Course Materials)
**Related Specs:** 0002 (Day 3 Rework — dependency), 0003 (Image Generation Tooling — Nano Banana prompts)

---

## 1. Overview

### 1.1 Purpose

Fundamentally rework Day 4 (Multimodal AI) materials based on instructor feedback received 2026-02-12. The current prototype is narrowly focused on text-based receipt extraction — which ironically fails to exercise multimodal capabilities at all. The rework broadens the scope to real-world multimodal business applications, replaces text receipts with actual image/audio/video exercises, and adds image generation as a core skill (building block for the capstone project).

### 1.2 Core Design Decision: Marketing Campaign Scenario

From the instructor's feedback, the lab should combine **multimodal analysis** (Idea 1) with **image generation** (Idea 4), focused on either product design or marketing materials.

**Selected scenario: Beacon's Spring Marketing Campaign**

This scenario naturally combines:
- **Image understanding**: Analyze competitor product photos, store displays, social media ads
- **Image generation**: Create marketing visuals for Beacon using Nano Banana (Google's image generator)
- **Audio understanding**: Analyze customer feedback recordings for marketing insights
- **Video understanding**: Analyze competitor marketing videos or store walkthrough footage
- **Structured output**: Turn multimodal analysis into structured marketing briefs (connects back to Day 3 context engineering)

This scenario was chosen over operations/finance/HR because it most naturally integrates both analysis AND generation, and because marketing deliverables are tangible — students produce actual visual assets.

### 1.3 Scope

This spec covers changes to **4 files** in `Materials/Materials/Week 2/Day 4/web/`:
- `lecture.html` — ~80% rework (new scenario, new slide structure, broader multimodal examples, image generation content)
- `lab.html` — ~90% rework (completely new exercise structure around marketing campaign)
- `quiz.html` — ~70% rework (new question topics aligned with restructured lecture)
- `index.html` — Update description, objectives, case study banner

### 1.4 Feedback Sources

- `Materials/Materials/Week 2/Day 4/feeback/slide_feedback.md` (instructor slide-by-slide feedback)
- `Materials/Materials/Week 2/Day 4/feeback/lab_feedback.md` (instructor lab feedback)
- Research findings on multimodal AI capabilities (2026)
- Confirmed Gemini free tier capabilities (image, audio, video upload; Gems; Imagen)

### 1.5 Day 3 → Day 4 Dependencies

Day 4 builds on these Day 3 concepts (final Day 3 content TBD — Quick Recap slide deferred until Day 3 is locked):

| Day 3 Concept | Day 4 Extension |
|---|---|
| Context engineering | Now the context is multimodal (images, audio, video — not just text) |
| Structured formats (Markdown, JSON) | Multimodal input → structured output (the core value proposition) |
| Gemini Gems | Can the Beacon Gem help interpret images when you also provide company context? |
| Citation/source testing | Can AI tell you which *image* or *recording* an insight came from? |

### Day 3 Finalized Content (for Quick Recap alignment)

Day 3 lecture has 4 sections, 32 slides:
1. **From Prompts to Context** — context engineering definition, context stack, evolution of AI interaction, Beacon HR challenge
2. **Structured Formats** — "Structure helps AI think better", Markdown, JSON & XML, chunking strategies, priority ordering
3. **RAG & Embeddings** — RAG definition, embeddings/vectors, vector databases, open-book exam analogy, RAG architecture, RAG vs fine-tuning, "Accidental Fine-Tuner" colleague story
4. **Context Tools Today** — Gemini Gems (persistent Knowledge + instructions), demo, tips, best practices

Day 3 Key Takeaways (verbatim from lecture):
1. Context engineering builds information environments for AI
2. Structure improves results (Markdown, JSON, clear formatting)
3. RAG + Embeddings power semantic search; vector databases store embeddings at scale
4. Gemini Gems give you no-code RAG (persistent Knowledge, custom instructions, shareable)
5. RAG beats fine-tuning for most business cases

Day 3 "What's Next" already previews Day 4: "Beyond text: AI that understands images, audio, video, and how to combine them."

**Quick Recap slide content (Slide 3):** "Day 3 taught you to feed AI the right *text* context — documents, structured formats, Gemini Gems. Today: the context isn't just text anymore. Images, audio, and video are all context. And AI can now *create* visual content too."

---

## 2. Research Findings (Informing Changes)

### 2.1 Gemini Free Tier Multimodal Capabilities (2026)

Confirmed available on personal Google accounts (free tier):

| Modality | Capability | Lab Feasibility |
|---|---|---|
| **Image upload** | Analyze, describe, OCR, extract data from photos | HIGH — fully available |
| **Audio upload** | Transcribe, summarize, sentiment analysis | HIGH — use short clips (1-3 min) |
| **Video upload** | Describe, temporal queries, extract key moments | MEDIUM — keep clips short, verify file size limits |
| **YouTube URLs** | Analyze video content (up to 8hrs/day free) | HIGH — great for competitor analysis |
| **Image generation** | Imagen integrated into Gemini chat | MEDIUM — limited monthly credits, text rendering improved but imperfect |
| **Gems** | Available on free tier with usage quotas | HIGH — extends Day 3 Gem work |

### 2.2 Nano Banana (Google Image Generator)

Per instructor, Nano Banana (`gemini-2.5-flash-image` via `google-genai` SDK) produces better text in generated images than Imagen alone. A dedicated image generation tool/agent is being developed (Spec 0003).

**Strategy for this spec:**
- Write detailed Nano Banana prompts for all lecture visuals and lab assets
- Include prompts as HTML comments in the code for the Spec 0003 tool to consume later
- Students will also write Nano Banana prompts as a lab exercise (learning to prompt image generators)

### 2.3 Real-World Multimodal Business Examples (2026)

These examples will be woven into the lecture for breadth before the lab narrows to marketing:

| Use Case | Company/Product | Key Stat |
|---|---|---|
| **Warehouse drone inventory** | Gather AI ($40M Series B, Feb 2026) | 25x faster counting, 99.9% accuracy |
| **Invoice/document processing** | ABBYY, Google Document AI, Amazon Textract | 68% automation rate, 2-3x faster |
| **Call center voice analytics** | Observe.AI, Gong.io | 100% call analysis vs 2-5% manual sampling |
| **Retail video analytics** | RetailNext, Trax Retail | 15-30% shrinkage reduction |
| **Manufacturing visual QC** | Landing AI (Andrew Ng) | 95-99% defect detection vs 80-90% human |
| **Marketing content analysis** | Various — this is our lab focus | ROI varies by application |

### 2.4 Image Generation for Business (Lab Focus)

What students will learn about image generation:
- **What works:** Marketing visuals, product mockups, social media content, presentation graphics
- **What doesn't:** Readable text in images (improving but unreliable), precise document generation, photorealistic people
- **Business value:** Speed (minutes vs days for concept art), cost (free/cheap vs designer fees), iteration (unlimited variations)
- **Limitations to teach:** Hallucinated details, brand inconsistency, ethical considerations (deepfakes, copyright), need for human review

---

## 3. Lecture Changes

### 3.1 New Slide Structure (Target: ~30-33 slides)

**Section 1: Beyond Text — What is Multimodal AI? (~8 slides)**

| Slide | Title | Content | Visual |
|---|---|---|---|
| 1 | Title Slide | "Multimodal AI: When AI Has Eyes and Ears" | [NANO BANANA: Warm illustration of AI assistant surrounded by floating images, audio waves, and video frames in a business office setting] |
| 2 | Learning Objectives | 4 objectives (see Section 3.2) | Objectives list |
| 3 | Quick Recap: Day 3 → Day 4 | Bridge from context engineering to multimodal context. "Day 3: you learned to feed AI the right text. Today: the context isn't just text anymore." | SVG: Day 3 (text documents) → Day 4 (images + audio + video + text) flow |
| 4 | Section Divider | "Beyond Text" | Navy background |
| 5 | What is Multimodal AI? | Definition + 4 input types. "An AI that can see, hear, read, and create." Not just text anymore — images, audio, video, and combinations. | SVG: Four input modalities converging into AI brain, with output arrow. [NANO BANANA: Warm infographic showing the 4 modalities with business icons] |
| 6 | The Business Opportunity | Why text-only AI leaves value on the table. 80% of business data is unstructured — and much of it is visual or audio. | SVG: Pie chart showing structured vs unstructured data, with icons for each modality |
| 7 | Real-World Multimodal AI in Action | 5-6 examples with compelling stats (warehouse drones, call center analytics, invoice processing, retail video, manufacturing QC, marketing content). Each gets a card with company name + stat. | Card grid with icons. [NANO BANANA: Collage illustration showing each use case — drone scanning warehouse, analyst listening to call, AI reading invoice, camera watching retail floor] |
| 8 | Discussion: Multimodal Data in YOUR Industry | Interactive discussion. "What images, audio, or video does your industry generate? How could AI help process it?" Build on Slide 7 examples, push students to think beyond. Reference: drone inventory video (YouTube link from instructor feedback). | Discussion prompt box |

**Section 2: Multimodal AI Capabilities — What Can It Actually Do? (~8 slides)**

| Slide | Title | Content | Visual |
|---|---|---|---|
| 9 | Section Divider | "What Can Multimodal AI Actually Do?" | Red background |
| 10 | Image Understanding | What AI sees when you upload a photo: objects, text (OCR), layout, context, relationships. Live example: Beacon product photo → AI describes it, extracts details, suggests improvements. | Two-column: photo on right, AI analysis on left. [NANO BANANA: Example product photo of a retail store display] |
| 11 | Audio Understanding | What AI hears: speech transcription, speaker identification, sentiment/tone, background context. Example: customer service call → AI extracts complaint, measures frustration, suggests response. | SVG: Audio waveform → AI processing → structured insights (speaker, sentiment, topics) |
| 12 | Video Understanding | What AI sees over time: actions, scene changes, temporal events, combined audio+visual. Example: store walkthrough → AI identifies layout issues, customer flow patterns. | SVG: Video frames timeline with AI annotations |
| 13 | From Unstructured to Structured | The core value: turning messy multimodal input into clean, actionable structured output. Image → JSON. Audio → transcript + sentiment table. Video → timeline + key moments. This is context engineering applied to multimodal data. | SVG: Three parallel paths (image/audio/video) each flowing through AI to structured output (table/JSON/timeline) |
| 14 | Image Generation: AI as Creator | Not just analysis — AI can CREATE images too. Marketing visuals, product mockups, concept art, presentation graphics. Introduce Nano Banana / Imagen. "Today you'll use AI to both analyze AND create." | [NANO BANANA: Side-by-side showing a text prompt and the resulting marketing image for a retail store] |
| 15 | The Prompt Matters (Even More) | Image generation prompts are harder than text prompts. Style, composition, detail level, brand consistency all matter. Show a "vague prompt" vs "detailed prompt" comparison with dramatically different results. | Two-column comparison: vague prompt → mediocre image vs. detailed prompt → polished image. [NANO BANANA: Generate both versions] |
| 16 | Current Limitations: Honest Assessment | What multimodal AI CANNOT do reliably: identify specific people, generate perfectly readable text in images, guarantee factual accuracy in generated images, understand deeply ambiguous content. "Trust but verify" mindset. | Info cards: green (can do) vs orange (can't reliably do) |

**Section 3: Multimodal AI for Marketing — Beacon's Campaign (~8 slides)**

| Slide | Title | Content | Visual |
|---|---|---|---|
| 17 | Section Divider | "Building Beacon's Spring Campaign" | Blue background |
| 18 | The Scenario | Beacon Retail Group is launching a spring marketing campaign. Your team needs to: (1) Analyze competitor marketing, (2) Generate new visual assets, (3) Create a structured campaign brief. All using multimodal AI. | [NANO BANANA: Warm illustration of marketing team brainstorming around a table with AI screens showing images, charts, and text] |
| 19 | Step 1: Competitive Visual Analysis | Upload competitor marketing images to Gemini. AI identifies: color palettes, messaging themes, target audience signals, product positioning. From an image → structured competitive intelligence. | Two-column: competitor ad image → structured analysis table |
| 20 | Step 2: Customer Voice Analysis | Upload customer feedback recordings. AI extracts: key themes, sentiment, specific product mentions, unmet needs. Audio → marketing insights. Connect to call center analytics use case from Slide 7. | SVG: Audio recording → AI → insight categories (positive/negative/neutral with specific quotes) |
| 21 | Step 3: Generate Marketing Visuals | Write prompts for Nano Banana to generate: product showcase images, social media ad concepts, in-store display mockups. Iterate on prompts to refine results. | [NANO BANANA: Example generated marketing image for Beacon spring campaign — product display with seasonal theme] |
| 22 | Step 4: Structured Campaign Brief | Combine multimodal insights into a structured marketing brief (Markdown or JSON). Competitive landscape + customer voice + visual concepts + recommended messaging. "This is multimodal context engineering." | SVG: Three inputs (competitive analysis, customer voice, generated visuals) flowing into a structured campaign brief document |
| 23 | Human-in-the-Loop: Why AI Needs You | AI generates, humans curate. Why marketing professionals still matter: brand voice consistency, cultural sensitivity, strategic alignment, legal/compliance review. Show the AI's draft vs. the human's refined version. | SVG: AI output → Human review (checkmarks and edits) → Final asset. [NANO BANANA: illustration of marketer reviewing AI-generated content with approval stamps] |
| 24 | ROI: The Business Case for AI-Powered Marketing | Time savings: concept art in minutes vs days. Cost savings: AI mockups vs photographer/designer fees. Scale: 100 variations for A/B testing. Include real stats where available. Include the "cautionary note" — vendor ROI figures are often optimistic. | Metric displays with key numbers + callout box with disclaimer |

**Section 4: Wrap-Up (~5 slides)**

| Slide | Title | Content | Visual |
|---|---|---|---|
| 25 | Section Divider | "Putting It All Together" | Green background |
| 26 | Beyond Marketing: Where Else? | Quick reference back to all the use cases from Slide 7. Marketing was our deep dive — but the same principles apply to operations, finance, HR, retail. "Multimodal context engineering works everywhere." | Card grid recap of Slide 7 examples, now with "you've experienced this" marker on marketing |
| 27 | The Multimodal Toolkit Decision Framework | When to use which modality: Decision matrix. "Have images? → Image understanding. Have recordings? → Audio analysis. Need visuals? → Image generation. Need all of it? → Multimodal pipeline." | SVG: Decision tree or matrix |
| 28 | Key Takeaways | 4-5 bullet summary of the day's learning. Connect back to learning objectives. | Takeaways list with checkmarks |
| 29 | What's Next | Preview Day 5 topic. | Forward-looking |
| 30 | Questions | Q&A slide | Standard |

### 3.2 Updated Learning Objectives

1. **Explain** how multimodal AI processes images, audio, and video — not just text
2. **Analyze** business content across multiple modalities (images, audio, video) using Gemini
3. **Generate** marketing visuals using AI image generation (Nano Banana) with effective prompts
4. **Design** a structured multimodal workflow that combines analysis and generation for a business deliverable

### 3.3 Slides Removed from Current Prototype

Remove entirely (current slide topics that are cut):
- "Documents vs. Images: Why Documents Are Special" — too narrow
- "Good vs. Challenging Documents" — repeats Day 3's mistake of focusing on document readiness
- "The Extraction Challenge: Same Information, Infinite Formats" — receipt-specific
- "Handling Multiple Items on One Receipt" — receipt-specific
- "Damaged/Faded Documents" — too narrow, edge-case focused
- "Multi-Language Receipts" — too narrow
- "Ambiguous Information" — too narrow
- "Security Considerations: Uploading Sensitive Financial Data" — can be a brief callout, not a full slide
- "Edge Case Decision Tree" — receipt-specific

### 3.4 Concepts Retained (Repositioned)

- **Structured data extraction** → Now "From Unstructured to Structured" (Slide 13), broadened to all modalities
- **Human-in-the-loop** → Now applied to marketing asset review (Slide 23)
- **ROI calculation** → Now for marketing AI, not just receipt processing (Slide 24)
- **Validation/quality** → Woven into human-in-the-loop discussion
- **Confidence levels** → Briefly mentioned in limitations slide (Slide 16)

---

## 4. Lab Changes

### 4.1 New Lab Theme: "Beacon's Spring Marketing Campaign"

**Total time: ~90-120 minutes across 4 parts**

The lab follows the same 4-step process introduced in the lecture (Slides 19-22).

### 4.2 Lab Structure

**Part 1: Competitive Visual Analysis (25 minutes)**

| Task | Description | Modality |
|---|---|---|
| Task 1: Tool Setup | Verify Gemini access. Upload a test image (photo of their desk or a nearby object) to confirm image upload works. | Image |
| Task 2: Analyze a Competitor Ad | Provide 2-3 sample marketing images (retail store ads, product displays). Students upload to Gemini and ask: "Analyze this marketing image. Identify: target audience, color palette, key messaging, product positioning, and emotional appeal." Record structured output. | Image understanding |
| Task 3: Compare Analyses | Upload the same image to Gemini with different prompts (vague vs. detailed). Compare output quality. Connect to Day 2 prompt engineering: "The prompt matters even more for multimodal." | Image understanding + prompt engineering callback |

**[Compare with Classmates]** Did your classmates get the same analysis? How did prompt wording change the output?

**Part 2: Customer Voice Insights (20 minutes)**

| Task | Description | Modality |
|---|---|---|
| Task 4: Analyze Customer Feedback Audio | Provide a short audio clip (~1-2 minutes) of simulated customer feedback about Beacon's products. Students upload to Gemini and ask for: transcript, sentiment analysis, key themes, specific product mentions, and recommended actions. | Audio understanding |
| Task 5: Structured Marketing Insights | Take the audio analysis and reformat it into a structured marketing insights table (using Day 3 structured format skills). | Audio → structured output |

**[Compare with Classmates]** Did Gemini catch the same sentiment cues? Share your structured insights tables.

**Part 3: Generate Marketing Visuals (30 minutes)**

| Task | Description | Modality |
|---|---|---|
| Task 6: Write Your First Image Prompt | Students write a prompt for Nano Banana to generate a spring marketing image for Beacon Retail Group. Provide guidance on what makes a good image prompt: style, subject, composition, mood, brand colors (#C8102E red, white, clean retail aesthetic). | Image generation |
| Task 7: Iterate and Refine | Take the first result, identify what to improve, write a refined prompt. Document the iteration: v1 prompt → v1 result → what to fix → v2 prompt → v2 result. Minimum 3 iterations. | Image generation + iteration |
| Task 8: Generate a Campaign Suite | Generate 3 images for Beacon's spring campaign: (1) hero image for email newsletter, (2) social media post graphic, (3) in-store display concept. Each needs a different prompt tailored to the format/channel. | Image generation |

**[Compare with Classmates]** Share your generated images. Which prompts produced the best results? What patterns do you notice in effective image prompts?

**Part 4: Campaign Brief & Reflection (25 minutes)**

| Task | Description | Modality |
|---|---|---|
| Task 9: Build the Campaign Brief | Combine all outputs into a structured Markdown campaign brief: competitive analysis summary, customer voice insights, generated visual concepts, recommended messaging, and next steps. This is multimodal context engineering in action. | Synthesis |
| Task 10: ROI Quick Calculation | Given: Beacon previously spent $5,000/campaign on a designer for 10 images over 2 weeks. Using AI, they could generate 50 concept variations in 2 hours, then have a designer polish the best 10 for $1,500. Calculate time savings, cost savings, and speed-to-market improvement. | Business analysis |
| Task 11: Reflection & Submission | Reflect on: (1) What surprised you about multimodal AI capabilities? (2) What limitations did you encounter? (3) How could your industry use multimodal AI? Generate PDF and submit to LMS. | Reflection |

**[Compare with Classmates]** Share your campaign briefs. Whose visual concepts are strongest? What made the difference?

### 4.3 Lab Assets Needed

| Asset | Description | How to Create |
|---|---|---|
| 2-3 sample competitor ad images | Retail/marketing images for competitive analysis | [NANO BANANA] Generate with prompt: "A professional retail store spring sale advertisement featuring seasonal products, bright colors, clean layout, professional marketing photography style" |
| 1-2 audio clips (1-2 min each) | Simulated customer feedback about Beacon products | Record using instructor's voice or text-to-speech tool. Script provided in plan. |
| Image prompt guide | One-page reference for writing effective Nano Banana prompts | Create as HTML callout box in lab.html |
| Beacon brand guidelines snippet | Brief brand guide (colors, tone, target audience) for students to reference when generating images | Create as a styled card in the lab |

### 4.4 Sections Removed from Current Lab

- All text-based receipt exercises (Tasks 1-5 in current lab)
- Receipt extraction prompts
- Receipt-specific edge cases (handwriting, damage, foreign language)
- Verification checklist (receipt-specific)
- Data privacy assessment

### 4.5 Sections Retained (Repositioned)

- **ROI calculation** → Now for marketing campaign (Task 10)
- **Compare with Classmates** → Retained throughout, now comparing visual outputs and analysis results
- **Reflection & submission** → Retained with updated prompts
- **Progress tracker** → Retained (JavaScript component)
- **Prompt iteration** → Enhanced and central to Part 3

---

## 5. Quiz Changes

### 5.1 Remove Questions About

- Receipt extraction (OCR, data fields, vendor formats)
- Document types (good vs challenging)
- Edge cases specific to receipts (handwriting, damage, foreign language)
- Confidence levels (specific to extraction)

### 5.2 New Question Topics (2 variants each, 20+ total)

| Topic | Sample Question Direction |
|---|---|
| Multimodal AI definition | What makes an AI system "multimodal"? |
| Modality types | Which is NOT a modality that modern AI can process? |
| Image understanding | What can AI extract from a business photo? |
| Audio understanding | What business insights can AI extract from a customer call recording? |
| Video understanding | How does AI video analysis differ from image analysis? |
| Unstructured → structured | What is the primary business value of multimodal AI? |
| Image generation capabilities | What can AI image generators reliably produce for business? |
| Image generation limitations | Which task would AI image generation struggle with? |
| Image prompt engineering | What makes an effective image generation prompt? |
| Multimodal context engineering | How does Day 3's context engineering extend to multimodal? |
| Real-world use cases | Match the use case to the modality (drone→image, call center→audio, etc.) |
| Human-in-the-loop | Why do AI-generated marketing materials need human review? |
| ROI of multimodal AI | What drives the ROI of AI-powered marketing? |
| Ethical considerations | What should a company consider before using AI-generated images in marketing? |
| Marketing workflow | What is the correct order for an AI-assisted marketing workflow? |

### 5.3 Maintain Standards

- 30+ questions in bank (15 topics × 2 variants)
- 15 questions per quiz attempt, randomized
- 70%+ passing threshold (11/15)
- Formative feedback on each question
- Answers NOT pre-selected

---

## 6. Nano Banana Image Prompts

These prompts are designed for the Spec 0003 image generation tool. Include as HTML comments in the source code for later processing.

### 6.1 Lecture Visual Prompts

| Slide | Prompt |
|---|---|
| 1 (Title) | "Warm, professional illustration of a friendly AI assistant in a modern office, surrounded by floating holographic images, audio waveforms, and video frames. The AI is helping a diverse group of business professionals. Clean, minimal style with soft warm lighting. NIU red (#C8102E) accent colors. Educational illustration style, not photorealistic." |
| 5 (Multimodal definition) | "Educational infographic showing four input modalities for AI: a camera icon for images, a microphone for audio, a film strip for video, and a document for text — all converging toward a central glowing AI brain. Clean flat design, warm colors, business context. Labels on each modality. White background." |
| 7 (Real-world examples) | "Split illustration showing 6 multimodal AI business applications in equal panels: (1) a drone scanning warehouse shelves, (2) a headset with audio waves representing call center analytics, (3) a camera scanning invoices, (4) a retail store with overhead cameras, (5) a manufacturing inspection camera, (6) a marketing team reviewing AI-generated images. Warm illustration style, consistent color palette with reds and blues." |
| 14 (Image generation intro) | "Side-by-side illustration: on the left, a person typing a creative text prompt on a laptop. On the right, a beautiful marketing image materializing from the screen — a vibrant spring retail display with seasonal products. Magical sparkle effect between prompt and result. Warm professional style." |
| 15 (Prompt comparison) | "Two-panel comparison: LEFT panel shows a vague prompt ('make a nice ad') producing a bland, generic image. RIGHT panel shows a detailed prompt (visible text) producing a polished, professional spring retail campaign image. Clear 'before/after' framing. Educational illustration style." |
| 18 (Marketing scenario) | "Warm illustration of the Beacon Retail Group marketing team at a brainstorming table. On a large screen behind them, AI is displaying generated marketing concepts, competitor analysis charts, and customer sentiment graphs. Diverse team of 4-5 professionals. Modern conference room. Collaborative energy." |
| 23 (Human-in-the-loop) | "Illustration showing a marketing professional reviewing AI-generated content on a tablet. Some items have green checkmarks, others have orange revision marks. The professional is adding notes and brand refinements. Warm, professional style suggesting collaboration between human and AI." |

### 6.2 Lab Asset Prompts

| Asset | Prompt |
|---|---|
| Competitor ad 1 | "Professional retail store spring sale advertisement: a bright, airy store interior with seasonal products displayed on modern shelving. 'SPRING COLLECTION' text visible. Clean marketing photography style. Warm natural lighting. Aspirational retail aesthetic." |
| Competitor ad 2 | "Social media advertisement for a competing retail chain: flat lay of spring lifestyle products (sunglasses, outdoor items, light clothing) on a pastel background. Bold promotional text overlay '30% OFF SPRING ESSENTIALS'. Instagram-ready square format." |
| Competitor ad 3 | "A professional in-store promotional display photo: end-cap merchandising display in a retail store with spring seasonal products, warm lighting, branded signage. Clean retail photography style suitable for marketing analysis." |

---

## 7. Index Page Changes

### 7.1 Updated Content

- **Title:** "Multimodal AI" (keep)
- **Subtitle:** Change from "Teaching AI to See — Documents, Images, and Beyond" → "When AI Has Eyes and Ears — Analyzing and Creating with Images, Audio, and Video"
- **Case study banner:** Change from finance/receipts → marketing campaign: "Beacon is launching a spring marketing campaign. Your team will use multimodal AI to analyze competitors, listen to customers, and generate visual concepts — all in one session."
- **Lecture card:** Update description to reflect new content
- **Lab card:** Change from "Building Beacon's Expense Processor" → "Beacon's Spring Marketing Campaign"
- **Learning objectives:** Update to match Section 3.2

### 7.2 Breadcrumb Fix

Current prototype shows "Day 1" in breadcrumb — should show "Day 4".

---

## 8. Acceptance Criteria

### 8.1 Lecture

- [ ] "Receipt extraction" framing completely removed
- [ ] Multimodal AI defined with all 4 modalities (text, image, audio, video)
- [ ] 5+ real-world business examples with specific companies and stats
- [ ] Image generation introduced as a business capability (not just analysis)
- [ ] "Vague vs detailed" image prompt comparison included
- [ ] Marketing campaign scenario introduced with 4-step workflow
- [ ] Human-in-the-loop applied to marketing context
- [ ] ROI slide updated for marketing (not receipts)
- [ ] Day 3 → Day 4 bridge slide present (Quick Recap)
- [ ] All Nano Banana prompts included as HTML comments
- [ ] All SVGs meet quality bar (12-14px labels, drop shadows, NIU colors)

### 8.2 Lab

- [ ] Students upload REAL images to Gemini (not text descriptions)
- [ ] Students upload/analyze audio content
- [ ] Students write image generation prompts and iterate (min 3 iterations)
- [ ] Students generate 3 marketing images for different channels
- [ ] Students build a structured campaign brief (Markdown)
- [ ] ROI calculation for AI marketing (not receipts)
- [ ] "Compare with Classmates" boxes present in every part
- [ ] Lab assets (sample images, audio clip) included or scripted
- [ ] Progress tracker functional
- [ ] PDF download + LMS submission mechanism

### 8.3 Quiz

- [ ] 30+ questions in bank (15 topics × 2 variants)
- [ ] 15 questions per attempt, randomized
- [ ] No receipt/document-specific questions remain
- [ ] Image generation questions included
- [ ] Multimodal context engineering questions included
- [ ] Real-world use case matching questions included
- [ ] 70%+ passing threshold
- [ ] Formative feedback on every question

### 8.4 Quality Standards

- [ ] All SVG diagrams meet quality bar
- [ ] Technical terms defined at first use
- [ ] Beacon Retail Group case study integrated throughout
- [ ] Breadcrumb navigation correct ("Day 4" not "Day 1")
- [ ] No Google Workspace references
- [ ] Nano Banana prompts included as HTML comments for Spec 0003 tool

---

## 9. Out of Scope

- Actual Nano Banana image generation (Spec 0003 handles the tool)
- Day 3 finalization (dependency — Quick Recap deferred)
- Days 1-2 retroactive updates
- Video recording/production of audio assets (instructor will provide or we script TTS)
- YouTube video curation (instructor provides links)
- Capstone project design (future spec — but Day 4 is stated as a building block)

---

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Gemini free tier limits change before class | Medium | Medium | Verify limits close to class date; provide "if limit reached" fallback instructions |
| Audio/video upload not available on all student devices | Low | Medium | Provide pre-uploaded examples that students can reference; audio exercises work on any device with Gemini web |
| Image generation produces poor results for student prompts | Medium | Low | This IS the lesson — iteration. Provide prompt templates and the "vague vs detailed" comparison upfront |
| Day 3 content changes significantly | Medium | Medium | Quick Recap slide is deferred; rest of Day 4 is independently designed |
| Nano Banana tool (Spec 0003) not ready when Day 4 is taught | Medium | Low | Lab uses Gemini's built-in Imagen; Nano Banana prompts are for course visuals, not student exercises |
| Marketing scenario feels too narrow for some students | Low | Low | Slide 26 explicitly connects back to other use cases; quiz covers breadth |

---

## 11. Approval

**Status:** Awaiting human review

- [ ] Spec reviewed by project owner
- [ ] Marketing campaign scenario approved
- [ ] Lecture slide structure approved
- [ ] Lab 4-part structure approved (competitive analysis → customer voice → image generation → campaign brief)
- [ ] Image generation as lab exercise approved
- [ ] Nano Banana prompt strategy approved
- [ ] Day 3 dependency handling approved (defer Quick Recap)

---

*End of Specification*
