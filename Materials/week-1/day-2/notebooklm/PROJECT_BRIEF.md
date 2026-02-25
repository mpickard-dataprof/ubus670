# UBUS 670: NotebookLM Context Brief — Day 2

## Your Task

You are helping improve the visual and educational quality of a university slide deck. We need you to generate an improved Slide Deck that addresses the issues described below. The current slides are provided as a PDF — please review them carefully.

---

## Course Overview

- **Course:** UBUS 670 — AI for Business Leaders
- **Institution:** Northern Illinois University (NIU), College of Business
- **Format:** 9 days across 3 weeks, 4 hours/day (8:30AM-12:30PM), 50%+ hands-on
- **Dates:** March 9-27, 2026 (MoWeFr)

## Audience

- **MBA students** with NO prior work experience and NO technical background
- They are NOT tech-savvy — assume zero familiarity with AI, coding, or data science
- Many have used ChatGPT casually but don't understand how it works
- They respond best to: stories, analogies, real-world business examples, hands-on activities
- They do NOT respond well to: dense text, jargon without definitions, theory-heavy slides

## This Slide Deck

- **Day 2: Prompt Engineering — The Art and Science of Talking to AI**
- **Topics:** The RCTFC framework (Role, Context, Task, Format, Constraints), prompting techniques (zero-shot, few-shot, chain-of-thought), when to use which technique, iteration strategies, building a prompt library, prompt injection and safety
- **Running case study:** Beacon Retail Group — a fictional regional retailer (25 stores, 1,200 employees, $312M revenue, founded 1987 in Rockford, IL). Students are the "AI Strategy Task Force" advising CEO Pat Holloway. This case study continues from Day 1.
- **Tool for today:** Google Gemini (gemini.google.com)
- **Current state:** 34 slides, ~1,787 lines of HTML — text-heavy, needs significant visual improvement

## Brand Identity

- **Primary color (NIU Red):** #C8102E
- **Navy:** #1D428A
- **Blue accent:** #00A9E0
- **Orange accent:** #E35205
- **Green accent:** #43B02A
- **Heading font:** Montserrat (bold, modern)
- **Body font:** Georgia (readable, professional)
- **Code font:** Fira Code

## Known Issues with Current Slides (Instructor Feedback)

The instructor has reviewed the current slides and identified these problems:

1. **Slide 17 — Ambiguous Chain-of-Thought example** — The CoT example doesn't clearly distinguish the input prompt from the AI output. Need clear labels like "Prompt:" and "AI Output:" so students can tell what THEY type vs. what the AI returns.
2. **Slide 19 — Flowchart alignment issues** — The "When to Use What" decision flowchart has misaligned arrows and blocks, making it hard to follow. Redesign for clarity.
3. **Slide 20 — Layout overflow** — The checkpoint quiz content falls off the bottom of the screen. Needs to be condensed or split across two slides.
4. **Slide 22 — Weak iteration diagram** — The Generate/Evaluate/Specify/Regenerate cycle diagram needs to be redesigned for visual impact. Currently too plain.
5. **Slide 22 — Missing AI-assisted prompting tip** — Add guidance that AI tools themselves (Gemini, ChatGPT) can help write and improve prompts. Students should know they can ask AI to critique and refine their prompts.
6. **Slide 23 — Prompt library needs practical guidance** — The "Keep a prompt library" strategy needs specific, actionable guidance on HOW to build and maintain one (what tool to use, how to organize, what to include per entry).

## What We Want From NotebookLM

Generate a Slide Deck that improves on the current version by:

1. **Better visual design** — more engaging layouts, better use of space, more visual variety. The current deck is text-heavy and needs visual relief.
2. **Better images/illustrations** — generate relevant, high-quality visuals for each concept. Use consistent illustration style throughout. Avoid generic clip art.
3. **Improved whitespace and typography** — proper spacing around bullets, readable font sizes, balanced layouts
4. **Stronger educational flow** — clearer transitions between RCTFC components, better concept scaffolding for non-technical students
5. **More engaging presentation** — less text-heavy, more visual metaphors and analogies that make prompt engineering concepts tangible for business students
6. **Maintain the content** — don't remove topics, but feel free to reorganize or expand them

## Critical Output Requirement

These slides will be used as **full-bleed background images** in a Reveal.js presentation. Each slide image will be used AS-IS as the complete slide — there is no additional text layer on top. This means:

- Every slide must be **visually self-contained** — all text, graphics, labels, and illustrations must be baked into the image
- Slides must be **presentation-ready at full screen** — text must be large enough to read from the back of a classroom
- Use the full canvas — no wasted margins or dead space
- Maintain consistent visual language across all slides (colors, fonts, illustration style)

## What to Preserve

- The Beacon Retail Group case study and scenario (continuing from Day 1)
- The 5-part structure (RCTFC Framework, Prompting Techniques, Iteration & Refinement, Prompt Injection & Safety, Putting It All Together)
- The learning objectives
- NIU Red (#C8102E) as the primary accent color
- Professional, MBA-appropriate tone (not childish, not overly corporate)
- The RCTFC framework as the core teaching model for prompt anatomy
