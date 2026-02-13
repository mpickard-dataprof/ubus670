# Project List

Centralized tracking of all projects with status, priority, and dependencies.

> **Quick Reference**: See `codev/resources/workflow-reference.md` for stage diagrams and common commands.

## Project Lifecycle

Every project goes through stages. Not all projects reach completion:

**Active Lifecycle:**
1. **conceived** - Initial idea captured. Spec file may exist but is not yet approved. **AI agents must stop here after writing a spec.**
2. **specified** - Specification approved by human. **ONLY the human can mark a project as specified.**
3. **planned** - Implementation plan created (codev/plans/NNNN-name.md exists)
4. **implementing** - Actively being worked on (one or more phases in progress)
5. **implemented** - Code complete, tests passing, PR created and awaiting review
6. **committed** - PR merged to main branch
7. **integrated** - Merged to main, deployed to production, validated, reviewed (codev/reviews/NNNN-name.md exists), and **explicitly approved by project owner**. **ONLY the human can mark a project as integrated** - AI agents must never transition to this status on their own.

**Terminal States:**
- **abandoned** - Project canceled/rejected, will not be implemented (explain reason in notes)
- **on-hold** - Temporarily paused, may resume later (explain reason in notes)

## Format

```yaml
projects:
  - id: "NNNN"              # Four-digit project number
    title: "Brief title"
    summary: "One-sentence description of what this project does"
    status: conceived|specified|planned|implementing|implemented|committed|integrated|abandoned|on-hold
    priority: high|medium|low
    files:
      spec: codev/specs/NNNN-name.md       # Required after "specified"
      plan: codev/plans/NNNN-name.md       # Required after "planned"
      review: codev/reviews/NNNN-name.md   # Required after "integrated"
    dependencies: []         # List of project IDs this depends on
    tags: []                # Categories (e.g., auth, billing, ui)
    notes: ""               # Optional notes about status or decisions
```

## Numbering Rules

1. **Sequential**: Use next available number (0001-9999)
2. **Reservation**: Add entry to this file FIRST before creating spec
3. **Renumbering**: If collision detected, newer project gets renumbered
4. **Gaps OK**: Deleted projects leave gaps (don't reuse numbers)

## Archiving Completed Projects

Once projects are `integrated` or `abandoned` for 3+ days, move them to `projectlist-archive.md`:

```
codev/
  projectlist.md          # Active projects (conceived → committed)
  projectlist-archive.md  # Completed projects (integrated, abandoned)
```

**Why archive?**
- Keeps daily work file small and fast
- Full history still versioned in git
- Can grep across both files when needed

**Archive format**: Same YAML format, sorted by ID (historical record).

## Usage Guidelines

### When to Add a Project

Add a project entry when:
- You have a concrete idea worth tracking
- The work is non-trivial (not just a bug fix or typo)
- You want to reserve a number before writing a spec

### Status Transitions

```
conceived → [HUMAN] → specified → planned → implementing → implemented → committed → [HUMAN] → integrated
     ↑                                                                                   ↑
Human approves                                                                    Human approves
   the spec                                                                      production deploy

Any status can transition to: abandoned, on-hold
```

**Human approval gates:**
- `conceived` → `specified`: Human must approve the specification
- `committed` → `integrated`: Human must validate production deployment

### Priority Guidelines

- **high**: Critical path, blocking other work, or significant business value
- **medium**: Important but not urgent, can wait for high-priority work
- **low**: Nice to have, polish, or speculative features

### Tags

Use consistent tags across projects for filtering:
- `auth`, `security` - Authentication and security features
- `ui`, `ux` - User interface and experience
- `api`, `architecture` - Backend and system design
- `testing`, `infrastructure` - Development and deployment
- `billing`, `credits` - Payment and monetization
- `features` - New user-facing functionality

---

## Projects

```yaml
projects:
  - id: "0001"
    title: "UBUS 670 Course Materials"
    summary: "Complete course materials for 9-day MBA AI for Business Leaders course"
    status: implementing
    priority: high
    files:
      spec: codev/specs/0001-course-materials.md
      plan: codev/plans/0001-course-materials.md
      lessons: codev/lessons/0001-course-materials.md
      review: null
    dependencies: []
    tags: [course, mba, ai]
    notes: "Day 1 complete (2026-02-06). Day 2 complete (2026-02-10). Day 3 prototype generated, undergoing rework (see Spec 0002). Days 7-9 need dual versions: Plan A (ADK Visual Builder) + Plan B (MindStudio backup)"

  - id: "0002"
    title: "Day 3 Context Engineering — Major Rework"
    summary: "Rework Day 3 lecture, lab, and quiz based on instructor feedback: restructure slides, add Gemini Gems lab, fix RAG diagram, rework fine-tuning section"
    status: implementing
    priority: high
    files:
      spec: codev/specs/0002-day3-rework.md
      plan: codev/plans/0002-day3-rework.md
      review: null
    dependencies: ["0001"]
    tags: [course, day3, rework]
    notes: "Instructor feedback received 2026-02-11. Major changes: remove AI-ready docs focus, add structured formats, Gemini Gems, three-way context comparison, colleague fine-tuning story. Implementation committed 2026-02-11."

  - id: "0003"
    title: "AI Image Generation for Course Materials"
    summary: "Establish image generation workflow using Nano Banana (Gemini 2.5 Flash Image) API to replace placeholder graphics with warm illustration-style images across all days"
    status: implementing
    priority: medium
    files:
      spec: codev/specs/0003-image-generation.md
      plan: null
      review: null
    dependencies: []
    tags: [course, images, tooling]
    notes: "Day 3 images complete (4/4). Tool established (_tools/generate_image.py). Two integration modes discovered: Mode A (text-free) and Mode B (hybrid HTML+AI). Remaining days need images as content is created."
```

  - id: "0004"
    title: "Day 4 Multimodal AI — Major Rework"
    summary: "Rework Day 4 from narrow receipt extraction to broad multimodal AI with marketing campaign scenario, image generation exercises, and real multimodal uploads"
    status: conceived
    priority: high
    files:
      spec: codev/specs/0004-day4-rework.md
      plan: null
      review: null
    dependencies: ["0001", "0002"]
    tags: [course, day4, rework, multimodal]
    notes: "Instructor feedback received 2026-02-12. Major changes: replace receipt focus with marketing campaign scenario, add image generation (Nano Banana), real image/audio/video uploads, broaden to 5+ real-world use cases. Depends on Day 3 finalization for Quick Recap slide."

  - id: "0005"
    title: "Day 5 — Google AI Studio"
    summary: "Day 5 materials: model parameters (temperature, top-p, top-k), system prompts, token economics, and email triage lab for Beacon"
    status: conceived
    priority: high
    files:
      spec: codev/specs/0005-day5-ai-studio.md
      plan: codev/plans/0005-day5-ai-studio.md
      review: null
    dependencies: ["0001", "0004"]
    tags: [course, day5, ai-studio, parameters]
    notes: "New content (no prior prototype). Bridges from Day 4 multimodal AI to Day 5 configuration. Email triage lab produces system that Day 6 will red-team. Date: Wed March 18, 2026."
```

## Next Available Number

**0006** - Reserve this number for your next project

---

## Quick Reference

### View by Status
To see all projects at a specific status, search for `status: <status>` in this file.

### View by Priority
To see high-priority work, search for `priority: high`.

### Check Dependencies
Before starting a project, verify its dependencies are at least `implemented`.

### Protocol Selection
- **SPIDER**: Most projects (formal spec → plan → implement → review)
- **TICK**: Small, well-defined tasks (< 300 lines) or amendments to existing specs
- **EXPERIMENT**: Research/prototyping before committing to a project
