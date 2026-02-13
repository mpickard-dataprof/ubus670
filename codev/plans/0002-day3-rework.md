# Implementation Plan: Day 3 Context Engineering — Major Rework

**Plan ID:** 0002
**Spec Reference:** [codev/specs/0002-day3-rework.md](../specs/0002-day3-rework.md)
**Status:** Approved
**Author:** Claude (Architect)
**Created:** 2026-02-11

---

## 1. Overview

This plan describes HOW to implement the Day 3 rework specified in Spec 0002. The work is organized into phases that can be executed in a single session, targeting `Materials/Materials/Week 1/Day 3/web/`.

### 1.1 Key Principles

1. **Read-before-write** — Re-read each file before modifying it
2. **Spec is source of truth** — Don't trust existing code over the spec
3. **One file at a time** — Complete lecture → lab → quiz → index sequentially
4. **Visual review last** — Run UX critic only after all content changes are done

### 1.2 Estimated Scope

| File | Effort | Changes |
|------|--------|---------|
| lecture.html | Heavy | ~60% rework: restructure slides 13-21, expand embeddings, rework fine-tuning, fix RAG diagram, add image prompts |
| lab.html | Medium | ~40% rework: add Gem creation, three-way comparison, citation testing, remove sections |
| quiz.html | Medium | Replace ~15 questions, add ~10 new questions |
| index.html | Light | Update description text if needed |

---

## 2. Pre-Implementation Checklist

Before starting any code changes:

- [ ] Re-read the spec (`codev/specs/0002-day3-rework.md`)
- [ ] Re-read instructor feedback (`feedback/slide_feedback.md`, `feedback/lab_feedback.md`)
- [ ] Read current `lecture.html` fully (note slide numbers for reference)
- [ ] Read current `lab.html` fully (note task numbers)
- [ ] Read current `quiz.html` fully (note question topics)
- [ ] Verify Gemini 3 is current latest version (quick web search)
- [ ] Verify Gemini Gems current UI path and features (quick web search)

---

## 3. Phase 1: Lecture Rework

Execute these steps in order. Each step modifies `lecture.html`.

### Step 1.1: Audit Current Slide Structure

Map all current slides by number and title. Create a reference list:
```
Slide 1: Title slide
Slide 2: ...
...
Slide N: Summary
```
This map will guide which slides to modify, remove, or insert.

### Step 1.2: Remove / Replace Slides 13-17, 21 ("AI-Ready Documents")

**Remove:**
- Slide 13 "What Struggles" content
- Slides 14-17 (excessive document readiness focus)
- Slide 21 "AI-Readiness Checklist"

**Replace with 4 new slides:**

**New Slide ~13: "Structure Helps AI Think Better"**
```
Content:
- Reframe: AI CAN read anything (scanned PDFs, handwriting, messy formats)
- But structure = better, more consistent results
- Analogy: organized desk vs. messy desk
- [AI-GENERATED IMAGE placeholder: organized vs messy desk with AI robot]
Visual: SVG split comparison or image placeholder
```

**New Slide ~14: "Meet the Formats: Markdown"**
```
Content:
- What is Markdown? (heading, bold, lists, links)
- Before/after: plain text Beacon memo → Markdown version
- Side-by-side comparison showing same info
- Key point: "You already use some of these — # for headers, * for bullets"
Visual: Two-column code comparison
```

**New Slide ~15: "Meet the Formats: JSON & XML"**
```
Content:
- JSON: key-value pairs, used by APIs and AI tools
- XML: tagged structure, used in enterprise systems
- Same Beacon employee data shown in both formats
- "You don't need to write these — just recognize them"
Visual: Two small code examples with callout annotations
```

**New Slide ~16: "When Structure Matters Most"**
```
Content:
- Table with 4-5 scenarios:
  | Scenario | Structure Needed? | Why |
  |----------|-------------------|-----|
  | Quick question | No | AI handles conversational queries well |
  | Long report analysis | Helpful | Structure helps AI navigate sections |
  | Multi-step instructions | Yes | Numbered steps prevent skipping |
  | Data with relationships | Yes | Tables/JSON preserve connections |
  | Image + text analysis | No | Multimodal models handle mixed content |
```

### Step 1.3: Update Chunking Slides (18-19)

**Changes to existing slides:**
1. Find-and-replace "Gemini 1.5" → "Gemini 3" throughout
2. Update context window numbers (Gemini 3: 1M tokens even on free tier)
3. Add visual chunking example:
   - SVG diagram showing a Beacon document being split into 4 chunks
   - Labels: "Chapter 1: Company History", "Chapter 2: Financials", etc.
   - Arrow showing "AI processes each chunk independently, then synthesizes"
4. Add no-code chunking example:
   - Reference NotebookLM as a no-code RAG tool
   - "When you upload a document to NotebookLM, it automatically chunks it"
   - Business connection: "This is what happens behind the scenes when you upload documents to any AI tool"

### Step 1.4: Adapt Slide 22 Exercise

**Current:** Exercise tied to "AI-ready documents" framing.
**New:** "Structure Challenge" exercise:
- Students take a block of unstructured Beacon text
- Add Markdown formatting (headers, bullet points, bold for key terms)
- Paste both versions into Gemini
- Compare: Did structure change the AI's response quality?
- Discussion: When did it matter most?

### Step 1.5: Expand Embeddings Section (Slide 24+)

**Modify existing slide 24:**
- Reuse token → vector → semantic meaning explanation from Day 1
- Elevate: "Day 1 we learned tokens. Now let's see what AI does WITH those tokens."

**Add 2-3 new slides after 24:**

**New: "Types of Embeddings"**
```
Content:
- Dense embeddings: capture semantic meaning (like a detailed description)
- Sparse embeddings: keyword-focused (like an index in a textbook)
- Comparison table:
  | | Dense | Sparse |
  |---|-------|--------|
  | Good for | "Find me something similar" | "Find exact matches" |
  | Example | "customer complaints about shipping" | "shipping delay refund" |
  | Used by | Modern AI search, RAG | Traditional search engines |
Visual: SVG with two parallel paths showing how each processes a query
```

**New: "Vector Databases: The AI Filing Cabinet"**
```
Content:
- What: Special databases that store and search embeddings
- Products to know: Pinecone, Weaviate, Chroma
- Business analogy: "Imagine a filing cabinet that understands MEANING, not just labels"
- "These power the retrieval in RAG systems"
- Awareness level: "You don't need to build one — but your tech team will"
Visual: SVG diagram showing documents → embeddings → vector database → semantic search
```

**New: "Semantic Search in Action"**
```
Content:
- Walk through a Beacon example:
  1. User asks: "What's our return policy for online orders?"
  2. Query is converted to an embedding (vector)
  3. Vector DB finds nearest neighbors (similar content chunks)
  4. Returns: "Section 4.2 of Policy Manual" + "FAQ Entry #17"
  5. AI generates answer using those specific sources
Visual: Animated-style flow diagram (static SVG with numbered steps)
```

### Step 1.6: Enhance Slide 25 Analogy

- Add `[AI-GENERATED IMAGE]` placeholder
- Write image generation prompt as HTML comment:
```html
<!-- IMAGE PROMPT: Create a teaching infographic for MBA students learning about
context engineering and RAG. Show three panels: (1) A business person asking a
question to an AI assistant, (2) The AI searching through organized company documents,
(3) The AI providing a sourced answer with document references. Use warm professional
colors, clean illustration style, and include brief text labels. Similar style to
educational technology illustrations. -->
```
- Keep existing analogy text

### Step 1.7: Fix RAG Diagram (Slide 26)

Based on slide26.png feedback:
1. Expand SVG `viewBox` width to prevent "Answer" box cutoff
2. Ensure all text is fully visible within containers
3. Improve arrow styling:
   - Use curved paths (`<path d="M... C...">`) instead of straight lines
   - Add proper `<marker>` arrowheads
   - Use consistent stroke widths
4. Apply SVG standards (drop shadows, NIU colors, 12-14px labels)
5. Test rendering at multiple viewport sizes

### Step 1.8: Rework Fine-Tuning Section (Slide 28+)

**Remove:** Existing fine-tuning slides that present it as a primary technique.

**Add 4 new slides:**

**Slide 28a: "RAG vs. Fine-Tuning: A Quick Comparison"**
```
Content:
- Table:
  | | RAG | Fine-Tuning |
  |---|-----|------------|
  | Purpose | Add knowledge | Change behavior |
  | Analogy | Giving someone a reference book | Training someone over months |
  | Cost | Low (just add documents) | High (compute + data + expertise) |
  | Update | Swap documents anytime | Retrain from scratch |
  | 2026 trend | Growing (most use cases) | Shrinking (general models are smart enough) |
- Key message: "For most business applications, RAG is the right choice"
Visual: SVG comparison diagram with two paths
```

**Slide 28b: "The Accidental Fine-Tuner" (Part 1)**
```
Content:
- Story: Dr. Sarah Chen, an accounting professor, wanted to train auditors to listen
- She created a Custom ChatGPT for auditor training
- She repeatedly "chastised" it when it jumped to solve problems
- "Just listen. Empathize. Don't fix it yet."
- Over time, the AI became a remarkably good listener
Visual: [AI-GENERATED IMAGE] Comic strip panel 1-2:
  Panel 1: Sarah at computer, frustrated, saying "Stop solving! Just LISTEN!"
  Panel 2: AI responding empathetically, Sarah smiling, thinking "It's learning!"
```

**Slide 28c: "The Accidental Fine-Tuner" (Part 2)**
```
Content:
- Sarah's AI listener was so good, she wanted to replicate it
- She hired a software developer to "extract the weights and embeddings"
- The developer examined the Custom GPT
- "Can we extract the fine-tuned model and deploy it?"
Visual: [AI-GENERATED IMAGE] Comic strip panel 3-4:
  Panel 3: Developer examining Custom GPT, magnifying glass on "neural network brain"
  Panel 4: Developer's surprised face: "Wait... this isn't what you think it is"
```

**Slide 28d: "What Really Happened" (Teaching Moment)**
```
Content:
- Reveal: Custom GPTs DON'T modify model weights
- What Sarah actually built: Instructions + Memory + Conversation Patterns
- The "extraction" was exporting the system prompt and behavioral configuration
- Visual: Neural network diagram with two layers highlighted:
  - OUTER LAYER (green): "Instructions, Memory, RAG" — this is what Sarah configured
  - INNER LAYER (locked, gray): "Model Weights" — untouched, same as everyone else's GPT-4
- Key takeaway: "Behavioral configuration ≠ fine-tuning. And that's actually GOOD NEWS — it means YOU can do this too, no developer needed!"
Visual: SVG neural network with labeled layers + [AI-GENERATED IMAGE] for the "aha moment" visual
```

**Image generation prompts for 28b-d:**
```
<!-- IMAGE PROMPT (28b-c): Create a 4-panel comic strip in clean, professional
illustration style. Panel 1: A professional woman (accounting professor) at her
computer, looking frustrated at a chat interface, speech bubble: "Stop trying to
solve everything! Just listen and empathize!" Panel 2: The AI chat shows empathetic
responses, woman looks pleased. Panel 3: A male software developer examining a
glowing brain/neural network with a magnifying glass. Panel 4: Developer looks
surprised, speech bubble: "This isn't fine-tuning at all!" Style: Clean lines,
warm colors, educational/professional tone, similar to business textbook illustrations. -->

<!-- IMAGE PROMPT (28d): Create a visual showing a neural network cross-section.
The outer shell (green, accessible) is labeled "Instructions + Memory + RAG" with
icons of documents and chat bubbles. The inner core (gray, locked with a padlock)
is labeled "Model Weights — Same for Everyone." A business person points to the
outer shell with a speech bubble: "This is what you can customize!" Style: Clean
infographic, NIU brand colors (red #C8102E, navy #1D428A, green #43B02A). -->
```

### Step 1.9: Fix Slide 31 Alignment

- Add CSS rule for this slide: `text-align: justify;`
- Verify rendering

### Step 1.10: Global Updates

After all slide changes:
1. Find-and-replace "Gemini 1.5" → "Gemini 3" throughout entire file
2. Verify all SVGs meet quality bar (12-14px labels, drop shadows, etc.)
3. Update slide count in any meta references
4. Ensure proper `<section>` wrapping for all new slides

---

## 4. Phase 2: Lab Rework

Execute these steps in order. Each step modifies `lab.html`.

### Step 2.1: Remove Sections

1. **Remove ChatGPT backup plan** — Delete all ChatGPT references, fallback instructions, and "if Gemini is unavailable" sections
2. **Remove Data Privacy Assessment** — Delete the entire task (was Task 3.5 in current version)
3. **Reduce "AI document readiness" framing** — Rewrite any task descriptions that over-emphasize document preparation

### Step 2.2: Add Gemini Gem Creation (New Core Exercise)

Insert as an early task (Task 2 or 3, after Tool Setup):

**Task: "Create Your Beacon Knowledge Gem"**
```
Instructions:
1. Open Google Gemini (gemini.google.com)
2. Click on "Gems" in the left sidebar (or navigate to the Gems section)
3. Click "Create a new Gem"
4. Name it: "Beacon Retail Knowledge Assistant"
5. In the Instructions field, write a system prompt:
   "You are Beacon Retail Group's internal knowledge assistant. Answer questions
   about the company using only the uploaded documents. Always cite which document
   your answer comes from. If you don't know, say so."
6. Under "Knowledge", upload all 5 Beacon documents:
   - Company Overview
   - Org Chart
   - Financial Summary
   - Strategic Plan
   - CEO Memo
7. Click "Save"
8. Test with: "How many stores does Beacon operate?"

[Tip Box] You can share your Gem with classmates! Click the share icon to get a
link. Try sharing with your neighbor and see if they get the same answers you do.

[Compare with Classmates] Did your Gem's instructions differ from your neighbor's?
How did that change the AI's behavior? Share your Gem link and compare.
```

### Step 2.3: Add Three-Way Context Comparison

Insert after the Gem creation task:

**Task: "Context Engineering Showdown"**
```
You'll now test the SAME questions using three different context approaches.
Use this table to record your results:

| Question | No Context (Fresh Chat) | Normal Upload | Gemini Gem |
|----------|------------------------|---------------|------------|
| "How many stores does Beacon have?" | | | |
| "What are Beacon's biggest challenges?" | | | |
| "What did the CEO say about AI adoption?" | | | |
| "What's Beacon's revenue trend?" | | | |

Approach 1: No Context
- Open a NEW Gemini chat (don't use your Gem)
- Ask each question
- Record the responses

Approach 2: Normal Upload
- Open a NEW Gemini chat
- Upload all 5 Beacon documents to the chat
- Ask each question
- Record the responses

Approach 3: Gemini Gem
- Open your Beacon Knowledge Gem
- Ask each question
- Record the responses

Analysis Questions:
1. Which approach gave the most accurate answers? Why?
2. Which approach cited specific documents?
3. What happens if you start a NEW chat with Approach 2 — are the documents still available?
4. What's the key difference between Approach 2 and 3?
```

### Step 2.4: Add Citation Testing Section

Insert after the comparison task:

**Task: "Can Your AI Cite Its Sources?"**
```
A critical skill for business AI: Can the AI tell you WHERE it found the answer?

Test 1: Single-Source Question
- Ask your Gem: "What is Beacon's organizational structure?"
- Expected: Answer should reference the Org Chart document
- Did it cite the source? □ Yes □ No □ Partially

Test 2: Multi-Source Question
- Ask your Gem: "How does Beacon's financial performance relate to its strategic goals?"
- Expected: Answer should reference BOTH Financial Summary AND Strategic Plan
- Did it cite both sources? □ Yes □ No □ Partially

Test 3: Unanswerable Question
- Ask your Gem: "What is Beacon's social media strategy?"
- Expected: Should acknowledge this isn't in the uploaded documents
- Did it admit the gap? □ Yes □ No □ Made something up

[Compare with Classmates] Share your citation results. Did different Gem
instructions (system prompts) affect whether the AI cited sources?
```

### Step 2.5: Update Context Comparison Experiment

Modify the existing "Context Comparison Experiment" section to reference the three-way comparison already completed. Avoid duplication. If the existing section overlaps significantly with the new three-way comparison, merge them.

### Step 2.6: Enhance "Compare with Classmates" Boxes

Update all existing "Compare with Classmates" boxes to mention Gem sharing:
- Add: "Share your Gem link with your neighbor"
- Add: "Did the shared Gem give your classmate the same answers?"

### Step 2.7: Update Tool Setup Section

- Remove ChatGPT references
- Focus on Gemini setup only
- Add Gems prerequisite: "You'll need a personal Google account (free)"
- Update model guidance to reference Gemini 3

---

## 5. Phase 3: Quiz Rework

Execute these steps on `quiz.html`.

### Step 3.1: Remove Outdated Questions

Remove or replace questions about:
- "AI-ready documents" checklist specifics
- Fine-tuning as a primary/recommended technique
- Gemini 1.5 specific features
- Data privacy assessment (removed from lab)

### Step 3.2: Add New Questions (2 variants each)

**Topic: Structured Formats**
- Q: "Which format uses key-value pairs and is commonly used by APIs?" → JSON
- Q: "When is adding structure to a document MOST helpful for AI?" → Long documents with relationships

**Topic: Gemini Gems**
- Q: "What is the key advantage of a Gemini Gem over uploading documents to a chat?" → Persistent knowledge across conversations
- Q: "What happens to uploaded documents when you close a normal Gemini chat?" → They're no longer available

**Topic: Context Approaches**
- Q: "In a three-way context comparison (no context, upload, Gem), which approach provides persistent knowledge?" → Gem
- Q: "Why might a fresh chat with no context give inaccurate answers about your company?" → AI has no access to company-specific information

**Topic: Citation and Sources**
- Q: "Why is source citation important when using AI for business decisions?" → Verifiability and accountability
- Q: "What should an AI do when asked about information not in its uploaded documents?" → Acknowledge the gap

**Topic: Vector Databases**
- Q: "What is a vector database used for in AI systems?" → Storing and searching embeddings for semantic retrieval
- Q: "Which of these is a vector database product?" → Pinecone (vs Redis, PostgreSQL, MongoDB)

**Topic: Embeddings Types**
- Q: "Dense embeddings are best suited for which type of search?" → Semantic/meaning-based search
- Q: "What's the key difference between dense and sparse embeddings?" → Dense captures meaning, sparse matches keywords

**Topic: RAG vs Fine-Tuning (Updated)**
- Q: "For a company that frequently updates its knowledge base, which approach is better?" → RAG
- Q: "Do Custom GPTs modify the underlying model weights?" → No, they use instructions and memory

**Topic: Behavioral Configuration**
- Q: "In the 'Accidental Fine-Tuner' story, what did the professor actually configure?" → Instructions and behavioral patterns, not model weights
- Q: "What's the key business advantage of behavioral configuration over true fine-tuning?" → Anyone can do it without technical expertise

### Step 3.3: Update Question Count

- Target: 40+ questions (20 topics × 2 variants)
- Maintain 20 questions per quiz attempt
- Verify randomization works with new question set
- Update any topic tags/categories for filtering

---

## 6. Phase 4: Post-Implementation Review

### Step 4.1: Run UX/Visual Critic

After all content changes are complete, run the UX critic on all 4 files:
- Check SVG quality standards
- Verify responsive layout
- Check accessibility
- Flag any visual inconsistencies

### Step 4.2: Run Education Critic

- Verify learning objectives alignment
- Check scaffolding progression
- Validate formative assessment coverage

### Step 4.3: Run Topic Accuracy Critic

- Verify all technical claims are current for 2026
- Check Gemini 3 references
- Validate RAG vs fine-tuning framing

### Step 4.4: Synthesize & Present

Compile critic findings, address P0/P1 items, present final materials for human review.

---

## 7. Implementation Order Summary

```
PRE-WORK
├── Re-read spec and feedback
├── Verify Gemini 3 and Gems current state
└── Map current slide structure

PHASE 1: LECTURE (lecture.html)
├── Step 1.1: Audit slides
├── Step 1.2: Replace slides 13-17, 21 → structured formats
├── Step 1.3: Update chunking (18-19)
├── Step 1.4: Adapt exercise (22)
├── Step 1.5: Expand embeddings (24+)
├── Step 1.6: Enhance analogy (25)
├── Step 1.7: Fix RAG diagram (26)
├── Step 1.8: Rework fine-tuning (28+)
├── Step 1.9: Fix alignment (31)
└── Step 1.10: Global updates

PHASE 2: LAB (lab.html)
├── Step 2.1: Remove sections
├── Step 2.2: Add Gem creation
├── Step 2.3: Add three-way comparison
├── Step 2.4: Add citation testing
├── Step 2.5: Update comparison experiment
├── Step 2.6: Enhance Compare boxes
└── Step 2.7: Update tool setup

PHASE 3: QUIZ (quiz.html)
├── Step 3.1: Remove outdated questions
├── Step 3.2: Add new questions
└── Step 3.3: Update counts

PHASE 4: REVIEW
├── Step 4.1: UX/Visual critic
├── Step 4.2: Education critic
├── Step 4.3: Topic accuracy critic
└── Step 4.4: Synthesize & present
```

---

## 8. Traps to Avoid

1. **Don't build on existing broken structure** — The current slides 13-17 are being REPLACED, not modified. Don't try to incrementally fix them.
2. **Don't keep ChatGPT references** — Even as "helpful context." Remove ALL ChatGPT backup plan references.
3. **Don't over-explain structured formats** — This is awareness-level ("recognize them"), not "learn to write JSON."
4. **Don't present fine-tuning positively** — The 2026 consensus is RAG-first. Fine-tuning is niche, not recommended for most business cases.
5. **Don't forget the colleague story nuance** — Custom GPTs DON'T modify weights. The story's power is in the REVEAL, not in validating fine-tuning.
6. **Don't skip the visual review** — Phase 4 is not optional. Every SVG must be checked.
7. **Don't duplicate exercises** — The three-way comparison and the existing "Context Comparison" may overlap. Merge, don't duplicate.

---

## 9. Approval

**Status:** Awaiting human review

- [ ] Plan reviewed by project owner
- [ ] Implementation order approved
- [ ] Lecture restructuring approach approved
- [ ] Lab exercise design approved
- [ ] Quiz question strategy approved

---

*End of Implementation Plan*
