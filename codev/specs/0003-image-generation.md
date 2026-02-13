# Specification: AI Image Generation for Course Materials

**Spec ID:** 0003
**Title:** AI Image Generation Workflow & Style Guide
**Status:** Draft
**Author:** Claude (Architect)
**Created:** 2026-02-11

---

## 1. Overview

### 1.1 Purpose

Establish a repeatable workflow for generating AI images using the Nano Banana API (`gemini-2.5-flash-image`) to replace placeholder graphics and text-only slides with warm, illustration-style images across all course days. This spec covers the tooling, style guide, quality policies, and the initial image targets.

### 1.2 Problem Statement

Several slides currently use text-only boxes or `<!-- IMAGE PROMPT -->` placeholders where a visual illustration would significantly improve teaching effectiveness. The "Open-Book vs. Closed-Book Exam" analogy slide (Day 3, Slide 19) is a prime example — it's a visual concept explained entirely in text.

MBA students are not technical. Rich, warm illustrations make abstract AI concepts more approachable and memorable than text boxes or technical SVG diagrams alone.

### 1.3 Scope

1. **Tooling**: Python script wrapping the `google-genai` SDK for image generation
2. **Style Guide**: Consistent visual language for all generated images
3. **Quality Policies**: Review process, file conventions, accessibility
4. **Immediate Targets**: Day 3 images (4 placeholders + 1 open-book slide)
5. **Future Application**: Framework for Days 1-2 retroactive improvements and Days 4-9

### 1.4 Out of Scope

- Video generation (Veo)
- SVG diagram replacement — SVGs remain the standard for technical flow diagrams
- Automated pipeline (this is a manual, human-in-the-loop workflow)

---

## 2. Technical Setup

### 2.1 API Choice

**Model:** `gemini-2.5-flash-image` (Nano Banana)
**SDK:** `google-genai` (v1.63.0+, the new package — NOT the deprecated `google-generativeai`)
**Auth:** API key (provided by instructor, stored securely)
**Cost:** ~$0.03/image, free tier supports 2 images/minute

### 2.2 Generation Script

A minimal Python script at `Materials/Materials/_tools/generate_image.py`:

```python
#!/usr/bin/env python3
"""Generate teaching images using Nano Banana (Gemini 2.5 Flash Image)."""

import argparse
import os
from google import genai
from google.genai import types

def generate(prompt: str, output_path: str, aspect_ratio: str = "16:9",
             style_prefix: str = ""):
    """Generate a single image and save it."""
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    full_prompt = f"{style_prefix}\n\n{prompt}" if style_prefix else prompt

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=full_prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            image_config=types.ImageConfig(
                aspect_ratio=aspect_ratio,
            ),
        ),
    )

    for part in response.parts:
        if part.inline_data:
            image = part.as_image()
            image.save(output_path)
            print(f"Saved: {output_path}")
            return output_path

    print("No image generated. Check prompt for content policy violations.")
    return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt", help="Image generation prompt")
    parser.add_argument("-o", "--output", required=True, help="Output file path")
    parser.add_argument("-a", "--aspect-ratio", default="16:9",
                       choices=["1:1", "3:4", "4:3", "9:16", "16:9"])
    parser.add_argument("-s", "--style", default="", help="Style prefix to prepend")
    args = parser.parse_args()
    generate(args.prompt, args.output, args.aspect_ratio, args.style)
```

### 2.3 Usage

```bash
export GEMINI_API_KEY="your-key-here"

python3 Materials/Materials/_tools/generate_image.py \
  "A warm illustration of an open book exam..." \
  -o "Materials/Materials/Week 1/Day 3/web/images/open-book-exam.png" \
  -a 16:9 \
  -s "Warm hand-drawn illustration style, educational, for MBA students"
```

### 2.4 Environment

- API key stored in environment variable `GEMINI_API_KEY` (never committed to git)
- Add `_tools/__pycache__/` and any `.env` files to `.gitignore`
- Generated images ARE committed to git (they're course content)

---

## 3. Style Guide

### 3.1 Visual Language: "Warm Illustration"

All generated images must follow this consistent style:

| Attribute | Standard |
|-----------|----------|
| **Style** | Warm, hand-drawn illustration. Approachable, not corporate. Think educational textbook illustrations from a modern design studio. |
| **Lines** | Visible sketch lines, slightly imperfect. NOT photorealistic. NOT flat vector. |
| **Colors** | Warm palette anchored by NIU brand colors: Red #C8102E, Navy #1D428A, Green #43B02A, Orange #E35205. Plus warm neutrals (cream, soft gray, warm white). |
| **People** | Diverse, generic (not recognizable individuals). Simple features, expressive poses. Professional attire. |
| **Text** | Minimal text IN the image. Labels should be in the HTML, not baked into the illustration. Exception: speech bubbles in comic-style panels. |
| **Background** | Clean, light (cream or warm white). No busy patterns. |
| **Mood** | Friendly, educational, slightly playful. Like explaining to a smart friend over coffee. |

### 3.2 Style Prefix (Prepend to All Prompts)

```
Warm hand-drawn illustration style for an MBA classroom.
Slightly sketchy lines, soft warm colors (cream background, accents of red #C8102E
and navy #1D428A). Friendly and approachable, like a modern educational textbook.
No photorealism. No text labels unless specifically requested.
Diverse professional characters with simple features.
```

### 3.3 What Generated Images Are For vs. SVGs

| Use Generated Images | Use SVG Diagrams |
|---------------------|-----------------|
| Analogies and metaphors (open book, desk, filing cabinet) | Technical architecture (RAG pipeline, flow diagrams) |
| Storytelling (comic panels, storyboards) | Comparison tables and matrices |
| Emotional/conceptual slides (the "aha" moment) | Data visualization (charts, hierarchies) |
| Hero/banner images for sections | Step-by-step processes with precise labels |

**Rule of thumb:** If the image needs exact text labels or precise data, use SVG. If it needs to evoke a feeling or illustrate a metaphor, use a generated image.

---

## 4. Quality Policies

### 4.1 Review Process

Every generated image goes through:

1. **Generate** — Run the script with a detailed prompt
2. **Architect Review** — View the image (Read tool), check against style guide
3. **Iterate** — If quality is insufficient, adjust prompt and regenerate (max 3 attempts)
4. **Human Review** — Present final image to instructor for approval before integration
5. **Integrate** — Add `<img>` tag to HTML, remove placeholder comment

### 4.2 File Conventions

```
Materials/Materials/Week X/Day Y/web/images/
├── slide-10-organized-desk.png
├── slide-19-open-book-exam.png
├── slide-22b-accidental-finetuner-1.png
├── slide-22c-accidental-finetuner-2.png
└── slide-22d-neural-network-reveal.png
```

**Naming:** `slide-{number}-{short-description}.{ext}`
**Format:** PNG (default) or WebP (for size optimization)
**Resolution:** 1024x1024 minimum; 16:9 aspect ratio for slides, 1:1 for spot illustrations
**Max file size:** 500KB per image (optimize with quality settings if needed)

### 4.3 HTML Integration

```html
<!-- Before (placeholder) -->
<!-- IMAGE PROMPT: Description... -->
<div class="visual-box" style="text-align: center; padding: 30px;">
    <p style="color: #888;">[AI-Generated Image: Description]</p>
</div>

<!-- After (integrated) -->
<div style="text-align: center; margin: 20px 0;">
    <img src="images/slide-19-open-book-exam.png"
         alt="Illustration: Student taking an open-book exam with reference materials,
              compared to a student taking a closed-book exam from memory only"
         style="max-width: 80%; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
</div>
```

**Requirements:**
- Always include descriptive `alt` text (accessibility)
- Use `max-width: 80%` with `border-radius: 12px` for consistent presentation
- Add subtle `box-shadow` to lift image off the white slide background
- Keep the `<!-- IMAGE PROMPT -->` comment above the `<img>` for prompt reproducibility

### 4.4 Content Policy Guardrails

The Gemini API has safety filters. To avoid blocks:
- **No real people** — use generic illustrated characters
- **No logos or trademarks** — Beacon Retail is fictional, but avoid depicting real company logos
- **No minors** — all characters should be clearly adults
- **Keep it professional** — educational context, no controversial imagery
- **Test before class** — generate images well in advance; don't depend on API availability day-of

---

## 5. Immediate Image Targets (Day 3)

### 5.1 Priority 1: Open-Book vs. Closed-Book Exam (Slide 19)

**Current state:** Text-only boxes comparing closed-book (traditional AI) to open-book (RAG).
**Target:** Warm illustration showing the analogy visually.

**Prompt:**
```
A split-scene illustration. Left side: a stressed student at a desk during a
closed-book exam, head in hands, trying to remember answers, surrounded by
empty space (representing limited pre-trained knowledge). The desk has only
a pencil and blank paper.

Right side: a confident student at a desk during an open-book exam, calmly
looking through a stack of colorful reference books and notes, finding exactly
the right answer. The desk has organized books, sticky notes, and highlighted pages.

Both students are diverse professionals in business casual. The left side has a
slightly red/warm tint. The right side has a green/fresh tint. A subtle dividing
line separates the two halves. No text labels.
```
**Aspect ratio:** 16:9
**Placement:** Above or replacing the two text boxes on Slide 19

### 5.2 Priority 2: Organized vs. Messy Desk (Slide 10)

**Current state:** `<!-- IMAGE PROMPT -->` placeholder at line 776.
**Target:** Illustration supporting "Structure Helps AI Think Better"

**Prompt:**
```
A split-scene illustration. Left side: a chaotic messy desk covered in scattered
papers, crumpled notes, coffee stains, and tangled cables. A friendly robot sits
at the desk, looking confused but still working, reading papers at odd angles.

Right side: the same robot at a perfectly organized desk with neatly labeled
folders, color-coded tabs, and a clean monitor. The robot looks happy and efficient,
quickly finding what it needs.

Both sides should feel warm and friendly, not clinical. The messy side is
endearing (the robot is trying!), not disgusting.
```
**Aspect ratio:** 16:9

### 5.3 Priority 3: Accidental Fine-Tuner Comic (Slides 22b-22c)

**Current state:** `<!-- IMAGE PROMPT -->` placeholders at lines 1410 and 1426.
**Target:** 2-panel and 2-panel comic strip illustrations.

**Panel 1-2 Prompt (Slide 22b):**
```
A two-panel comic strip. Panel 1: A professional woman (accounting professor)
sitting at her computer, looking frustrated at a chat interface on screen.
A speech bubble says "Stop trying to solve everything! Just LISTEN!"
The chat screen shows a robot icon.

Panel 2: The same woman, now smiling, looking pleased at the screen. The chat
shows a warm, empathetic response. She thinks "It's finally learning!"

Comic style with visible panel borders, warm colors, expressive characters.
```

**Panel 3-4 Prompt (Slide 22c):**
```
A two-panel comic strip continuation. Panel 3: A male software developer
examining a glowing brain/circuit board with a magnifying glass. He looks
focused and scientific. The brain represents a Custom GPT.

Panel 4: The developer's face shows surprise and realization. A speech bubble:
"Wait... there are no custom weights here!" The brain now shows clearly labeled
layers: "Instructions" and "Memory" are visible, but "Weights" has a padlock icon.

Comic style with visible panel borders, warm colors, expressive characters.
```
**Aspect ratio:** 16:9 for each

### 5.4 Priority 4: Neural Network Reveal (Slide 22d)

**Current state:** SVG diagram showing configurable vs locked layers. Could be enhanced with an illustration alongside.
**Decision:** Keep the SVG (it's precise and labeled). Optionally add an illustration IF the comic panels turn out well and the instructor wants more visual storytelling. **Skip for now.**

---

## 6. Future Application (Not in This Spec)

After the Day 3 images are approved:
- **Days 1-2**: Identify 2-3 slides per day that would benefit from illustrations
- **Days 4-9**: Include image generation prompts during initial material creation
- **Retroactive emoji cleanup**: Replace emoji icons (lightbulbs, checkmarks) with small SVG icons or illustration spot-art

These are separate specs once the workflow is validated with Day 3.

---

## 7. Acceptance Criteria

### 7.1 Tooling
- [ ] `generate_image.py` script exists and works with provided API key
- [ ] `google-genai` package installed and functional
- [ ] `images/` directory created for Day 3

### 7.2 Day 3 Images
- [ ] Open-Book vs. Closed-Book Exam image generated and integrated into Slide 19
- [ ] Organized vs. Messy Desk image generated and integrated into Slide 10
- [ ] Accidental Fine-Tuner Panel 1-2 generated and integrated into Slide 22b
- [ ] Accidental Fine-Tuner Panel 3-4 generated and integrated into Slide 22c
- [ ] All images pass Architect visual review
- [ ] All images approved by instructor (human review)

### 7.3 Quality
- [ ] All images follow the warm illustration style guide (Section 3)
- [ ] All images have descriptive alt text
- [ ] All images are under 500KB
- [ ] No content policy violations
- [ ] IMAGE PROMPT comments preserved for reproducibility

---

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Nano Banana produces inconsistent style | Medium | Medium | Use consistent style prefix; iterate up to 3x; fall back to current SVG/text if quality insufficient |
| Content policy blocks educational prompts | Low | Medium | Avoid real people references; use "illustrated characters" language; test prompts early |
| API key cost unexpectedly high | Low | Low | At $0.03/image, even 100 iterations = $3. Monitor usage. |
| Generated images look "AI-generated" in a distracting way | Medium | High | The warm illustration style mitigates this. If results are obviously AI-generated, use as inspiration and describe what to adjust. Human has final say. |
| Style inconsistency across days | Medium | Medium | Style prefix enforces consistency. Generate Day 3 first as the benchmark. |

---

## 9. Approval

**Status:** Awaiting human review

- [ ] Spec reviewed by project owner
- [ ] Style guide (warm illustration) approved
- [ ] Image generation approach approved (Nano Banana via API)
- [ ] Day 3 target images approved
- [ ] Quality policies approved

---

*End of Specification*
