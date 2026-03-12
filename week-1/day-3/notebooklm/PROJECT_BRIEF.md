# NotebookLM Project Brief — Day 3: Context Engineering

## Course Context
- **Course:** UBUS 670 — AI for Business Leaders (MBA, Spring 2026)
- **Institution:** Northern Illinois University (NIU)
- **Day:** 3 of 9 (Week 1, Day 3 — Friday)
- **Topic:** Context Engineering — Feeding AI the Right Information
- **Audience:** MBA students with no technical background; business-focused framing required
- **Prerequisite knowledge:** Day 1 (What is GenAI, tokens, context windows, hallucinations) and Day 2 (Prompt Engineering, RCTF framework, techniques)

## This Slide Deck
Day 3 covers how to provide AI with the right context to get useful, grounded outputs:

1. **Why context matters** — garbage in, garbage out; grounding reduces hallucinations
2. **Structured formats** — Markdown, JSON, XML awareness (what works well for AI)
3. **Chunking** — breaking large documents into processable pieces
4. **Embeddings & vector search** — building on Day 1's embeddings, introducing vector databases
5. **RAG (Retrieval-Augmented Generation)** — the library analogy, flowchart, business applications
6. **Fine-tuning vs RAG** — brief comparison, "Accidental Fine-Tuner" story
7. **Gemini Gems** — custom AI agents with uploaded knowledge (lab preview)

**Current state:** 43 slides, 1,876 lines of HTML. Text-heavy with some inline SVG diagrams and AI-generated illustrations. Has been through one major rework (Spec 0002) but still needs visual improvement and content updates per instructor feedback.

## Brand Identity
- **Primary colors:** NIU Red (#C8102E), Black (#000000)
- **Secondary colors:** Navy (#1D428A), Blue (#00A9E0), Green (#43B02A)
- **Background:** White (#FFFFFF) — clean, professional
- **Heading font:** Montserrat (bold, clean)
- **Body font:** Georgia (readable serif)
- **Style:** Professional, clean, minimal — not playful or cartoonish

## Known Issues (See INSTRUCTOR_FEEDBACK.md for details)
1. Too much content on "AI-ready documents" — needs to be condensed and refocused on structured formats
2. "What Struggles" content (Slide 13) may be outdated — needs fresh research
3. Chunking section needs visual examples and business-relevant framing
4. Embeddings should build on Day 1 and go deeper (types, vector databases)
5. RAG library analogy is strong but needs better visuals
6. Fine-tuning should be briefly compared to RAG, not a main topic
7. Several slides need visual design polish (alignment, flowchart arrows)

## What We Want From NotebookLM
1. **Visual design** — consistent illustrations, professional layouts, whitespace
2. **Content condensation** — reduce 43 slides to ~20-25 with tighter messaging
3. **Better visual metaphors** — especially for chunking, embeddings, RAG pipeline
4. **Educational flow** — clearer scaffolding from simple concepts to complex ones
5. **Business framing** — every technical concept tied to Beacon Retail Group scenarios

## Critical Output Requirement
The slides will be used **as full-bleed background images** in Reveal.js. They must be:
- Visually self-contained (all text and graphics baked into each slide image)
- High quality at 16:9 aspect ratio
- Readable at presentation scale (large fonts, clear hierarchy)
- Consistent visual style across all slides

## What to Preserve
- **Beacon Retail Group** case study continuity (AI Strategy Task Force, CEO Pat Holloway)
- The **library analogy** for RAG (instructor loves it)
- The **RAG flowchart** concept (needs visual polish but the structure is good)
- The **"Accidental Fine-Tuner"** story (accountant training a custom ChatGPT to listen)
- Three-way context comparison: no context vs. uploaded documents vs. Gemini Gem
- Connection to Day 1 embeddings and Day 2 prompt engineering
- Learning objectives and key takeaways
