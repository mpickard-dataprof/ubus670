# UBUS 670 Course Development - Conversation Status

**Last Updated:** 2026-02-17
**Purpose:** Context recovery file for new Claude Code sessions

---

## How to Resume

When starting a new session, say:

> "Read Materials/PROJECT_STATUS.md and codev/projectlist.md to restore context. We're building UBUS 670 course materials."

For deeper context, also read:
- `codev/lessons/0001-course-materials.md` (design patterns and lessons learned)
- `codev/specs/0004-day4-rework.md` (next spec to implement)
- `codev/specs/0005-day5-ai-studio.md` (next spec to review)
- `Materials/Week 2/Day 4/feedback/slide_feedback.md` (instructor feedback on Day 4)

---

## Current State (2026-02-17)

### Completed
- Days 1-3 materials are DONE and committed to git
- Day 3 was reworked (Spec 0002) with structured formats, Gemini Gems, Accidental Fine-Tuner story
- AI Image Generation tool (Spec 0003) established, Day 3 images complete (4/4)
- Directory structure flattened: `Materials/Materials/` -> `Materials/`

### In Progress
- **Day 4 Rework (Spec 0004):** Spec and plan WRITTEN but NOT APPROVED or IMPLEMENTED
  - Old prototype (receipt extraction) needs to be replaced with marketing campaign scenario
  - Current files have partial uncommitted edits from a session that hit rate limits
  - The "feeback" typo directory was renamed to "feedback" (uncommitted)
- **Day 5 (Spec 0005):** Spec and plan DRAFTED, awaiting human review

### Not Started
- Days 6-9 (no specs written)
- Datasets: customer emails (Day 5), resumes with hidden patterns (Days 7-9)
- Days 7-9 need dual tool versions: Plan A (ADK Visual Builder) + Plan B (MindStudio backup)

---

## Key Decisions (Reference)

See `Materials/PROJECT_STATUS.md` for full details. Summary:

- **Audience:** MBA students, no work experience, not tech-savvy
- **Format:** HTML/Reveal.js web modules (index, lecture, lab, quiz per day)
- **Case Study:** Beacon Retail Group throughout all 9 days
- **AI Ecosystem:** Gemini-focused (no ChatGPT references)
- **Workflow:** Generator-Critic with 4 critic personas + human checkpoint
- **Session Rule:** One day of content per session to avoid context overflow
- **Image Generation:** Nano Banana (`gemini-2.5-flash-image`), never bake text into AI images
- **Git:** Never use `git add -A` or `git add .`

---

## Course Schedule

9 days across 3 weeks: Mon 3/9, Wed 3/11, Fri 3/13, Mon 3/16, Wed 3/18, Fri 3/20, Mon 3/23, Wed 3/25, Fri 3/27
Location: Barsema Hall 331, 8:30AM-12:30PM (4 hours/day, 50%+ hands-on)

---
