# Course Content Generator: Agentic Workflow

This document defines the standard operating procedure for generating new course days for UBUS 670.

## Architecture: "The Review Board"
We use a **Generator-Critic** model where the "Generator" (Gemini) creates content, and three specific "Critics" (simulated personas) review it before finalization.

### The Critics
1.  **UI/UX Designer:** Ensures usability, accessibility, and brand alignment.
2.  **Educational Expert:** Ensures pedagogical rigor, active learning, and formative assessment.
3.  **Topic Expert:** Ensures technical accuracy and depth.

---

## The Workflow Protocol

### Step 1: Input Analysis
- **User Input:** Target Week/Day (e.g., Week 1 / Day 2).
- **Source:** Read `DayX_Slides.md` (if exists) or ask user for topic outline.

### Step 2: Prototype Generation
- Generate `index.html`, `lecture.html`, `lab.html`, `quiz.html` using the **Templates** in `_generator_system/templates/`.
- Fill placeholders with initial draft content.

### Step 3: The "Review Board" Simulation
- **Load Personas:** Read prompts from `_generator_system/prompts/`.
- **Run Critique:**
    - Act as *UX Critic*: Review the prototype.
    - Act as *Edu Critic*: Review the prototype.
    - Act as *Topic Critic*: Review the prototype.
- **Synthesize:** Create a "Critique Report" summarizing key changes needed.

### Step 4: Human-in-the-Loop Checkpoint (CRITICAL)
- **Pause/Stop:** Present the "Critique Report" to the user.
- **Ask:** "Here is the improvement plan. Do you have any custom feedback or changes?"
- **Wait:** Receive user approval or modifications.

### Step 5: Final Execution
- **Apply Changes:** Rewrite the HTML files incorporating all feedback.
- **Verify:** Ensure all files are in `Week X/Day Y/web/`.

---

## Directory Structure
- `_generator_system/`: System core.
    - `prompts/`: Persona definitions.
    - `templates/`: HTML skeletons.
- `Week X/Day Y/web/`: Output directory for each module.
