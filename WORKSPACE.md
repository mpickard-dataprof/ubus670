# UBUS 670 Workspace Configuration

**Last Updated:** February 4, 2026
**Current Focus:** Day 1 Material Development

---

## 📋 Workspace Reminders

- **Folder Structure:** Strictly adhere to the `Materials/Materials/Week X/Day Y` hierarchy. Never create new top-level folders.
- **File Management:** Keep all final, intermediate, and source files inside the specific Day folder.
- **Content Format:** HTML-based Course Hub (index, lecture, lab, quiz) using Reveal.js for presentations.
- **Instructional Style:** Adhere to the "Visual Educator Rule" (Rich content, analogies, high-quality visuals, no text-heavy slides).
- **Progression:** NEVER ask to proceed to the next day. Wait for explicit user confirmation.
- **Iteration:** Aim for 2-3 iterations per day to perfect the materials.

---

## 🧠 Key Decisions & Preferences

- **Format:** Web Modules (HTML/JS) > PPTX/PDF
- **Workflow:** Always use the **Generator-Critic** loop with Human-in-the-Loop checkpoint
- **Checkpoint:** **ALWAYS** stop for Human Feedback before final file generation
- **Tools:** HTML is king; avoid pandoc unless strictly necessary

---

## 🎯 Course Context

### Audience
- **Who:** MBA students with no work experience (recent undergrad graduates)
- **Background:** Various fields (mostly business-related), very little technical experience
- **Not "tech savvy":** Content must be accessible, no-code/low-code focused

### Content Focus
- All content geared towards **business applications**
- Goal: Create **"AI-aware" future leaders**
- Emphasis: **Hands-on and highly interactive**
- Integrate **latest concepts in generative AI**

### Preferred Tools
- **Primary:** Google Opal AI, Google AI Studio (Gemini models)
- **Requirements:**
  - Generous free tier
  - No-code or low-code
  - Easy to use for non-technical users

---

## 🤖 Agent Reviewers (The Review Board)

### 1. Content Developer Expert / Expert Instructor
**Focus Areas:**
- Learning Objectives: Clear, Bloom's Taxonomy aligned
- Scaffolding: Simple → Complex progression
- Active Learning: Interactive elements vs passive reading
- Assessment: Formative feedback (explaining *why*)
- Cognitive Load: Content chunked appropriately

### 2. Business-Related AI Expert
**Focus Areas:**
- Accuracy: Current terminology (Agentic, Multimodal, LLM)
- Depth: Beyond surface-level hype
- Frameworks: Concrete decision matrices and mental models
- Realism: Labs reflect real business problems
- Analogies: Abstract concepts grounded in relatable metaphors
- Business Value: Clear connection to ROI, efficiency, competitive advantage

---

## 📅 Course Schedule

**Duration:** 3 weeks (Mar 9-27, 2026)
**Schedule:** MoWeFr 8:30AM - 12:30PM
**Location:** Barsema Hall 331
**Total Days:** 9 class sessions

### Structure Per Day
1. **Presentation** (Reveal.js lecture slides)
2. **Quiz** (Knowledge check with formative feedback)
3. **Hands-on Lab** (Interactive, business-focused exercises)

---

## 📁 Directory Structure

```
UBUS 670/
├── CLAUDE.md              # Codev instructions
├── WORKSPACE.md           # This file
├── CONVERSATION_STATUS.md # Session state for resuming
├── codev/                 # Codev protocols and specs
│   ├── specs/0001-course-materials.md    # Approved spec
│   ├── plans/0001-course-materials.md    # Approved plan
│   └── lessons/0001-course-materials.md  # Lessons learned (per day)
├── Materials/
│   └── Materials/
│       ├── _shared/             # NIU styles, Reveal.js theme
│       ├── _case-study/         # Beacon Retail Group documents
│       ├── _generator_system/   # Templates and critic prompts
│       ├── Week 1/
│       │   ├── Day 1/web/
│       │   ├── Day 2/
│       │   └── Day 3/
│       ├── Week 2/
│       │   ├── Day 1/
│       │   ├── Day 2/
│       │   └── Day 3/
│       └── Week 3/
│           ├── Day 1/
│           ├── Day 2/
│           └── Day 3/
└── UBUS 670 - AI for Business Leaders - Original.docx
```
