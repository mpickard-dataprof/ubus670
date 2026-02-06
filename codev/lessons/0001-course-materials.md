# Lessons Learned: UBUS 670 Course Materials

**Project ID:** 0001
**Purpose:** Capture learnings after each day's materials are approved to improve subsequent days.

---

## Format

After each day is approved, append an entry below:

```
### Day X: [Title]
**Approved:** [Date]

**What worked well:**
- ...

**What required significant revision:**
- ...

**Patterns to apply to future days:**
- ...

**Content or approach to avoid:**
- ...
```

---

## Lessons by Day

### Day 1: What is Generative AI?
**Approved:** 2026-02-06

**What worked well:**
- HTML-based course hub with Reveal.js slides works better than static PPTX
- Generator-Critic workflow with 4 personas (UX, Edu, Topic, Accuracy) catches issues early
- 20-question quiz bank with randomization and variants provides retake value
- Lab submission mechanism (Generate Summary → Copy/Download) solves response collection
- Beacon Retail Group case study provides consistent business context throughout

**What required significant revision:**
- Initial graphics were "logo-like" and decorative—replaced with meaningful diagrams (transformer flow, encoder/decoder architecture)
- Slide headers needed larger/bolder typography for readability
- List spacing and alignment needed CSS fixes
- Hallucination exercise needed 3 fallback approaches (modern AI is better at saying "I don't know")
- Removed Google Workspace references (NIU students don't have it)

**Patterns to apply to future days:**
- Always include custom SVG/CSS diagrams for technical concepts (not just emoji)
- Use `.left-content h2` with `font-size: 1.8em; font-weight: 700` for headers
- Add spacing before lists: `p + ul, p + ol { margin-top: 1.2em; }`
- Test AI exercises with current models before publishing
- Include model selector guidance in tool setup instructions

**Content or approach to avoid:**
- Generic stock imagery or decorative-only graphics
- Assuming any specific AI behavior (hallucinations, refusals)—always provide fallbacks
- Referencing Google Workspace for NIU students
- Pre-selected quiz answers (must be interactive)
- Overly technical jargon without explanation for MBA audience

---
