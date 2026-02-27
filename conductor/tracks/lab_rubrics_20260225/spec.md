# Track Specification: Implement Markdown Grading Rubrics (Days 1-7)

## Overview
Create standardized, AI-readable grading rubrics for all existing course labs (Day 1 through Day 7). These rubrics will be used by AI agents to provide consistent, constructive feedback to students and to assist the instructor in grading.

## Objectives
- Standardize the evaluation criteria for all current lab exercises.
- Ensure rubrics are formatted in Markdown for easy consumption by LLMs.
- Align grading criteria with the "Beacon Retail Group" case study context.

## Requirements
- **Standard Format:** Each rubric must include:
    - **Learning Objectives:** What the lab was designed to teach.
    - **Criteria:** Specific categories (e.g., Accuracy, Completeness, Strategy).
    - **Levels of Achievement:** Clear descriptions for "Exceeds Expectations," "Meets Expectations," and "Needs Improvement."
- **File Location:** Rubrics should be placed within each day's `web/` folder as `grading_rubric.md` (e.g., `Materials/week-1/day-1/web/grading_rubric.md`).
- **Context:** Rubrics must explicitly reference the specific Beacon Retail scenarios assigned in that day's lab.

## Acceptance Criteria
- [ ] Seven `grading_rubric.md` files exist in their respective day folders.
- [ ] Each rubric follows the standardized structure.
- [ ] Rubrics are validated against the actual lab instructions to ensure alignment.
