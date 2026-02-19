# UBUS 670 Course Development - Conversation Status

**Last Updated:** 2026-02-18
**Purpose:** Context recovery file for new Claude Code sessions

---

## How to Resume

When starting a new session, say:

> "Read CONVERSATION_STATUS.md and codev/projectlist.md to restore context. We're building UBUS 670 course materials."

The `/deploy-notebooklm {day}` skill automates the most common operation. For deeper context:
- `codev/lessons/0001-course-materials.md` — design patterns and lessons learned (Days 1-5)
- `codev/specs/0006-notebooklm-integration.md` — the established visual workflow

---

## Current State (2026-02-18)

### Completed (Days 1-5)
- **Days 1-3**: Materials complete, committed, retrofitted with NotebookLM full-bleed image slides
- **Day 4 (Spec 0004)**: Reworked to marketing campaign scenario, multimodal uploads, ElevenLabs audio, NotebookLM slides. Committed.
- **Day 5 (Spec 0005)**: Google AI Studio — parameters, system prompts, token economics. 15 NotebookLM slides + 2 quizzes. Committed.
- **NotebookLM workflow (Spec 0006)**: Proven across all 5 days. Tools, templates, and `/deploy-notebooklm` skill established.

### Not Started (Days 6-9)
- **Day 6**: Red Teaming & AI Safety (tests system prompt from Day 5)
- **Day 7**: Agent Builder (Plan A: ADK Visual Builder + Plan B: MindStudio backup)
- **Day 8**: AI Strategy & Governance
- **Day 9**: Capstone / Final Presentations
- Datasets needed: customer emails (Day 5 lab), resumes with hidden patterns (Days 7-9)

### Reusable Assets
- **Lecture template**: `Materials/_shared/lecture-template.html`
- **Context package templates**: `Materials/_shared/notebooklm-*-template.md`
- **Skills**: `/deploy-notebooklm`, `/generate-audio`
- **Tools**: `html2md.py`, `extract_slides.py`, `generate_image.py`, `generate_audio.py`

---

## Key Decisions (Reference)

- **Audience:** MBA students, no work experience, not tech-savvy
- **Format:** HTML/Reveal.js web modules (index, lecture, lab, quiz per day)
- **Visual workflow:** NotebookLM full-bleed image slides (Spec 0006) — primary. Nano Banana (Spec 0003) — backup for custom lab images only.
- **Case Study:** Beacon Retail Group throughout all 9 days
- **AI Ecosystem:** Gemini-focused (no ChatGPT references)
- **Session Rule:** One day of content per session to avoid context overflow
- **Git:** Never use `git add -A` or `git add .`

---

## Course Schedule

9 days across 3 weeks: Mon 3/9, Wed 3/11, Fri 3/13, Mon 3/16, Wed 3/18, Fri 3/20, Mon 3/23, Wed 3/25, Fri 3/27
Location: Barsema Hall 331, 8:30AM-12:30PM (4 hours/day, 50%+ hands-on)

---
