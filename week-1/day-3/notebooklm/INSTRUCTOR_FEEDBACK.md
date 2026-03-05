# Instructor Feedback — Day 3: Context Engineering

## Overall
- Too much redundancy and fluff — condense but keep the same information
- Improve the flow and scaffolding between topics
- "AI-ready documents" topic gets too much attention — reduce and refocus
- Remove fine-tuning as a main topic (general models are making it obsolete), but briefly compare it to RAG

## Specific Slide Feedback

### Slide 13 — "What Works Well / What Struggles"
- The "What Struggles" items may be outdated (e.g., OCR errors — modern models handle images well). Needs fresh research.
- Keep the "What Works Well" angle — it centers on structured formats
- Add 1-2 slides introducing structured formats (Markdown, JSON, XML) with examples — awareness level, not deep
- Rethink the "Rule of Thumb" after updating

### Slides 14-17 — AI-Ready Document Details
- Too many slides on a questionable "struggle" topic — feels redundant
- Replace with a gentle technical introduction to structured formats (Markdown, JSON, XML)

### Slides 18-19 — Chunking
- Update Gemini version (1.5 is outdated — use current version)
- Add a visual example of chunking
- Connect chunking to business students with a concrete no-code example

### Slide 21 — AI-Ready Documents Summary
- Remove — too much focus on this topic given the feedback above

### Slide 22 — Exercise
- Adapt the exercise given the restructured content from slides 14-17

### Slide 24 — Embeddings
- Reuse Day 1 embedding explanations and visuals but take them to the next level
- Add slides covering types of embeddings (pros/cons) and vector databases (awareness-level: "these products exist")

### Slide 25 — Library Analogy for RAG
- Instructor loves the analogy — enhance it with a strong visual/illustration
- Current slides lack helpful graphics

### Slide 26 — RAG Flowchart
- Instructor loves the flowchart — but arrows need improvement
- Needs visual design polish

### Slide 28 — Fine-Tuning
- Remove fine-tuning as a main topic, but compare it briefly to RAG on this slide
- Include the "Accidental Fine-Tuner" story: an accountant repeatedly trained a custom ChatGPT to listen and empathize (not solve), then hired a developer to extract the weights to replicate it for auditor training
- Create strong visuals/storyboard for this example

### Slide 31 — Alignment
- Fix full justification alignment issues

## Lab Feedback (for reference — affects slide content priorities)
- Less focus on "AI document readiness" in the lab
- Have students create a Google Gem (upload documents to its Knowledge)
- Compare three context approaches: no context, Gemini Gem, upload documents to normal chat
- Remove the ChatGPT backup plan
- Remove Data Privacy Assessment — focus on experimenting with context engineering
- Keep: Stress-Testing Your Assistant, Adding Context Mid-Conversation, Context Comparison Experiment
- Add: test the agent's ability to cite sources from specific uploaded documents
- Keep "Compare with Classmates" — note that Gems can be shared via links
