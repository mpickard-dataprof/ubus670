# Specification: Day 3 Context Engineering — Major Rework

**Spec ID:** 0002
**Title:** Day 3 (Context Engineering) — Rework Based on Instructor Feedback
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-02-11
**Parent Spec:** 0001 (UBUS 670 Course Materials)

---

## 1. Overview

### 1.1 Purpose

Significantly rework the Day 3 (Context Engineering) lecture, lab, and quiz based on detailed instructor feedback received 2026-02-11. The current prototype over-emphasizes "AI-ready documents" (a concept now outdated for 2026 AI capabilities), lacks depth on structured formats, uses outdated Gemini references, and needs fundamental restructuring of both the lecture flow and lab exercises.

### 1.2 Scope

This spec covers changes to **4 files** in `Materials/Materials/Week 1/Day 3/web/`:
- `lecture.html` — ~60% rework (restructure slides 13-21, update embeddings/RAG, add fine-tuning story, image generation)
- `lab.html` — ~40% rework (Gemini Gem creation, remove ChatGPT backup, remove data privacy, add citation testing)
- `quiz.html` — Update to match restructured lecture content
- `index.html` — Minor updates if description text changes

### 1.3 Feedback Sources

- `Materials/Materials/Week 1/Day 3/feedback/slide_feedback.md` (instructor slide-by-slide feedback)
- `Materials/Materials/Week 1/Day 3/feedback/lab_feedback.md` (instructor lab feedback)
- `Materials/Materials/Week 1/Day 3/feedback/slide26.png` (RAG diagram cutoff screenshot)
- `Materials/Materials/Week 1/Day 3/feedback/Gemini_Generated_Image_38l8s438l8s438l8.png` (example of desired AI-generated image quality)
- Research findings on modern AI capabilities (2026)

---

## 2. Research Findings (Informing Changes)

### 2.1 "AI-Ready Documents" Is Outdated

Modern multimodal models (Gemini 3, Claude Opus 4, GPT-5) handle:
- Scanned PDFs with OCR errors → 95%+ accuracy natively
- Complex tables and multi-column layouts → parsed correctly
- Handwritten text → reliably transcribed
- Mixed-format documents → understood in context

**Implication:** The "What Struggles" framing (slides 13-17) is largely obsolete. Instead, teach structured formats (Markdown, JSON, XML) as a way to **optimize** AI interactions, not as a necessity to avoid failures.

### 2.2 Gemini Version Update

- Gemini 1.5 references throughout → update to **Gemini 3** (released Feb 2026)
- Free tier now offers 1M token context window
- Gemini Gems allow persistent context via Knowledge uploads

### 2.3 Fine-Tuning vs. RAG (2026 Consensus)

- General models are now smart enough that traditional fine-tuning is diminishing
- RAG-first approach is the consensus for most business use cases
- Custom GPTs use instructions + memory + RAG — they do **NOT** modify model weights
- The colleague's "informal fine-tuning" story (chastising ChatGPT to listen) is actually about behavioral configuration, not weight extraction — important pedagogical distinction

### 2.4 Image Generation

- Claude does NOT have image generation capabilities
- Instructor suggests using Google Veo / Gemini image generation for richer visuals
- Example image provided shows teaching-quality AI-generated infographic
- **Decision:** Write detailed image generation prompts; instructor will generate images using their preferred tool. Provide SVG placeholders with clear `[AI-GENERATED IMAGE: description]` markers.

---

## 3. Lecture Changes (slide-by-slide)

### 3.1 Slides 13-17: Replace "AI-Ready Documents" with Structured Formats

**Current state:** 5 slides heavily focused on document readiness, "what struggles" with AI, and preparation checklist.

**New content:**

| New Slide | Title | Content |
|-----------|-------|---------|
| ~13 | "Structure Helps AI Think Better" | Reframe: AI can read anything, but structure = better results. Analogy: organized desk vs messy desk. |
| ~14 | "Meet the Formats: Markdown" | Introduce Markdown with a before/after example. Show plain text → Markdown version of a Beacon memo. |
| ~15 | "Meet the Formats: JSON & XML" | Brief intro to JSON and XML. Show the same Beacon data in both formats. "You don't need to write these — just recognize them." |
| ~16 | "When Structure Matters Most" | Practical scenarios: long documents, multi-step instructions, data with relationships. Quick comparison table. |

**Removed:** Slides 14-17 "What Struggles" content, Slide 21 "AI-Readiness Checklist" (too much focus on outdated concept).

### 3.2 Slides 18-19: Update Chunking Content

**Changes:**
- Replace all "Gemini 1.5" references with "Gemini 3"
- Add a **visual chunking example**: show a Beacon document being split into chunks with a diagram
- Connect chunking to business students: use a concrete no-code example (e.g., "How NotebookLM automatically chunks your uploaded documents")
- Consult expert agents for the best chunking analogy for MBA audience

### 3.3 Slide 22: Adapt Exercise

**Current:** Interactive exercise tied to "AI-ready documents" framing.
**New:** Adapt to structured formats framing — exercise asks students to take unstructured text and add Markdown formatting, then compare AI responses with/without structure.

### 3.4 Slide 24: Deepen Embeddings Content

**Changes:**
- Reuse and extend embedding explanations from Day 1 (tokens → vectors → semantic meaning)
- Add **new slides** covering:
  - Types of embeddings: dense vs. sparse (pros/cons table for MBA audience)
  - Vector databases: Pinecone, Weaviate, Chroma — "products you should know exist" awareness level
  - How embeddings enable semantic search (visual: query → vector → nearest neighbors → results)

### 3.5 Slide 25: Enhance Analogy with AI-Generated Image

**Current:** Text-based analogy for context engineering.
**Change:** Write a detailed image generation prompt for an infographic-style teaching image (similar to the example PNG provided by instructor). Include `[AI-GENERATED IMAGE]` placeholder in the slide with the prompt specification.

### 3.6 Slide 26: Fix RAG Diagram

**Issue:** Diagram is cut off on the right side (confirmed via slide26.png). The "Answer" box text is truncated.
**Fix:**
- Expand SVG viewBox to accommodate full diagram
- Improve arrow styling (use curved paths with proper markers per SVG standards)
- Send through UX/visual review after implementation

### 3.7 Slide 28: Rework Fine-Tuning Section

**Current:** Multiple slides on fine-tuning as a primary technique.

**New content (3-4 slides):**

| Slide | Title | Content |
|-------|-------|---------|
| 28a | "RAG vs. Fine-Tuning: When to Use What" | Comparison table. RAG = add knowledge. Fine-tuning = change behavior. General models getting smart enough that fine-tuning scenarios are shrinking. |
| 28b | "The Accidental Fine-Tuner" (Story pt 1) | Colleague story: Accountant creates Custom ChatGPT for auditor training. Repeatedly "chastises" it to just listen and empathize. Visual storyboard panel 1-2. |
| 28c | "The Accidental Fine-Tuner" (Story pt 2) | Hires developer to extract "weights" — but what actually happened? The model wasn't fine-tuned in the traditional sense. Visual storyboard panel 3-4. |
| 28d | "What Really Happened" (Teaching Moment) | Reveal: Custom GPTs use instructions + memory + RAG, not weight modification. The "extraction" was exporting the conversation patterns and system prompt. Neural network visual showing the distinction. **Key takeaway:** Behavioral configuration ≠ fine-tuning. |

**Visual requirements:**
- Comic strip / storyboard style panels (2-4 panels)
- Neural network visual showing "weights" with a heart/brain metaphor
- Clear distinction between "what she thought happened" vs. "what actually happened"
- Write image generation prompts for each visual

### 3.8 Slide 31: Fix Alignment

**Issue:** Poor text alignment (should be full justification).
**Fix:** Add CSS for proper alignment on this slide.

### 3.9 Post-Implementation: Full Visual Review

After all lecture changes are implemented, run UX/visual reviewer critic for the entire lecture.

---

## 4. Lab Changes

### 4.1 Remove / Reduce

| Remove | Reason |
|--------|--------|
| ChatGPT backup plan | Instructor directive: focus on Gemini ecosystem |
| Data Privacy Assessment task | Instructor directive: focus on context engineering experimentation instead |
| Excessive "AI document readiness" framing | Outdated concept per research |

### 4.2 Add: Gemini Gem Creation

**New core lab exercise:** Students create a **Gemini Gem** for Beacon Retail Group.

Steps:
1. Navigate to Gemini → Gems (or equivalent current UI path)
2. Create a new Gem named "Beacon Knowledge Assistant"
3. Upload Beacon documents to the Gem's "Knowledge" section
4. Configure the Gem's instructions (system prompt)
5. Test the Gem with Beacon-specific questions

### 4.3 Add: Three-Way Context Comparison

**Central experiment:** Compare three context engineering approaches:

| Approach | Setup | What Students Learn |
|----------|-------|---------------------|
| **No context** | Ask Beacon questions in a fresh Gemini chat | AI has no knowledge, hallucinates or gives generic answers |
| **Gemini Gem** | Use the Gem created in 4.2 with persistent Knowledge | Persistent context via Knowledge upload |
| **Normal chat upload** | Upload documents directly to a standard Gemini conversation | Temporary context, lost when chat ends |

Students document: response quality, accuracy, specificity, and whether the AI cites specific documents.

### 4.4 Add: Citation Testing Section

**New exercise:** Test the Gem's ability to cite sources.
- Ask specific questions where the answer comes from one identifiable document
- Check if the AI references the source document
- Ask multi-document questions to see if AI synthesizes across sources
- Document which approaches (Gem vs. upload) handle citations better

### 4.5 Keep (Confirmed by Instructor)

- **Stress-Testing Your Assistant** — Keep as-is
- **Adding Context Mid-Conversation** — Keep as-is
- **Context Comparison Experiment** — Keep but restructure around three-way comparison (4.3)
- **Compare with Classmates** boxes — Keep and emphasize. Add note that Gems can be shared via links.

### 4.6 Gem Sharing

Incorporate throughout the lab:
- Gems can be shared via links
- Have students share their Gem with a classmate
- Compare: Does the shared Gem work the same for the other student?
- "Compare with Classmates" boxes should reference Gem sharing

---

## 5. Quiz Changes

### 5.1 Remove Questions About

- Fine-tuning as a primary technique (reduce to 1-2 questions on RAG vs. fine-tuning comparison)
- "AI-ready documents" checklist items
- Outdated Gemini 1.5 references

### 5.2 Add Questions About

- Structured formats (Markdown, JSON, XML) — recognition and purpose
- Gemini Gems — what they are, how Knowledge works
- Three context approaches comparison (no context vs. Gem vs. upload)
- Citation and source attribution
- Vector databases and embeddings (awareness level)
- Dense vs. sparse embeddings (conceptual)
- RAG vs. fine-tuning comparison (updated framing)

### 5.3 Maintain Standards

- 20+ questions minimum (40 question bank with 2 variants per topic)
- 20 questions per quiz attempt, randomized
- 70%+ passing threshold
- Formative feedback on each question

---

## 6. Image Generation Strategy

### 6.1 Approach

For each slide requiring an AI-generated image:
1. Write a detailed image generation prompt in the spec/plan
2. Include `[AI-GENERATED IMAGE]` placeholder in the HTML
3. Provide the prompt as an HTML comment or data attribute
4. Instructor generates images using their preferred tool (Google Imagen/Veo)
5. Images are placed in `Materials/Materials/Week 1/Day 3/web/images/`

### 6.2 Image Prompts Needed

| Slide | Description | Prompt Theme |
|-------|-------------|-------------|
| ~13 | "Organized vs. messy desk" analogy for structure | Split image: chaotic desk vs. organized desk with AI robot reading from each |
| ~25 | Context engineering analogy enhancement | Teaching infographic showing context engineering concepts for MBA students (similar to provided example PNG) |
| 28b-c | "Accidental Fine-Tuner" storyboard | Comic strip: accountant training ChatGPT, developer examining "brain", reveal of what actually happened |
| 28d | Neural network weights visual | Stylized neural network with glowing nodes, showing instructions/memory layer vs. weight layer distinction |

### 6.3 Retroactive Application

This image generation approach will be applied retroactively to Days 1-2 in a future spec. This spec focuses only on Day 3.

---

## 7. Acceptance Criteria

### 7.1 Lecture

- [ ] "AI-ready documents" framing reduced to 1-2 slides max (reframed as "structure helps")
- [ ] Structured formats (Markdown, JSON, XML) introduced with examples
- [ ] All Gemini references updated to Gemini 3
- [ ] Visual chunking example added
- [ ] Embeddings section expanded (types, vector databases)
- [ ] RAG diagram cutoff fixed (verified via browser rendering)
- [ ] Fine-tuning reworked to 3-4 slides with colleague story
- [ ] Image generation prompts provided for all visual slides
- [ ] Slide 31 alignment fixed
- [ ] Full visual review passed after implementation

### 7.2 Lab

- [ ] Gemini Gem creation exercise added as core activity
- [ ] Three-way context comparison experiment (no context / Gem / upload)
- [ ] Citation testing section added
- [ ] ChatGPT backup plan removed
- [ ] Data Privacy Assessment removed
- [ ] Gem sharing incorporated
- [ ] "Compare with Classmates" boxes retained and enhanced
- [ ] Stress-testing and mid-conversation sections retained

### 7.3 Quiz

- [ ] Questions updated to match restructured lecture
- [ ] 20+ question bank maintained (40 total with variants)
- [ ] Outdated questions removed (AI-ready docs, fine-tuning emphasis, Gemini 1.5)
- [ ] New questions added (structured formats, Gems, citations, vector DBs)

### 7.4 Quality Standards

- [ ] All SVG diagrams meet quality bar (12-14px labels, drop shadows, NIU colors, etc.)
- [ ] Technical terms defined at first use
- [ ] Beacon Retail Group case study integrated throughout
- [ ] "Compare with Classmates" boxes present in lab
- [ ] Breadcrumb navigation correct on all pages

---

## 8. Out of Scope

- Days 1-2 retroactive image improvements (separate future spec)
- Tool/agent for automated image generation (separate future spec)
- Google Opal workflow changes (Opal is introduced in lab but not restructured)
- Quiz UI/framework changes (only question content changes)

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gemini Gem UI changes before class | Medium | Medium | Verify current UI, provide screenshots, include "if UI differs" notes |
| Colleague story misrepresents Custom GPTs | Low | High | Research verified: Custom GPTs don't modify weights. Clearly distinguish in slides. |
| Image generation prompts don't produce quality results | Medium | Low | Provide SVG fallbacks; images are enhancement, not critical path |
| Too many new slides bloat lecture | Medium | Medium | Target same total slide count by removing 5 slides, adding 7-8. Net +2-3 slides. |

---

## 10. Approval

**Status:** Awaiting human review

- [ ] Spec reviewed by project owner
- [ ] Lecture restructuring approach approved
- [ ] Lab Gemini Gem approach approved
- [ ] Fine-tuning story framing approved
- [ ] Image generation strategy approved

---

*End of Specification*
