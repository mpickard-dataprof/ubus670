# Project Status: UBUS 670 Materials

**Last Updated:** Tuesday, January 27, 2026
**Current Focus:** Week 1 / Day 1

## 🚀 Current State
- **Architecture:** We have pivoted from static slides to an **HTML-based Course Hub**.
- **System:** We established an **Agentic Workflow** (Generator-Critic) in `Materials/_generator_system/`.
    - Includes: Templates (Dashboard, Lecture, Lab, Quiz) and Critic Personas (UX, Edu, Topic).
- **Progress:** `Week 1/Day 1` web module is live (v2) with improved UI and pedagogy.

## ⏸ Next Action Items (Upon Resume)
1.  **Refine Week 1 / Day 1 Lab:**
    - **Goal:** Shift focus specifically to **Gemini Chat (gemini.google.com)**.
    - **Task:** Make the lab more experimental/interactive. Students should be "architecting" prompts in Gemini.
    - **Mechanism:** Use the `PROJECT_STATUS.md` as the prompt to restart the "Review Board" workflow for this specific refinement.
    
2.  **Future Days:**
    - Use the "Run the Course Generator" command to build Week 1 / Day 2, etc.

## 🧠 Key Decisions & Preferences
- **Format:** Web Modules (HTML/JS) > PPTX/PDF.
- **Workflow:** Always use the **Generator-Critic** loop.
- **Checkpoint:** **ALWAYS** stop for Human Feedback before final file generation.
- **Tools:** Use `pandoc` only if strictly necessary for PPTX; otherwise, HTML is king.
