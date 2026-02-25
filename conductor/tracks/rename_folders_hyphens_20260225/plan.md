# Implementation Plan: Rename Folders for Cleaner URLs

## Phase 1: Execution & Link Update [checkpoint: a45e57d]

Goal: Rename directories and update any broken internal links.

- [x] Task: Rename all `Week X` and `Day Y` folders.
    - [x] `Materials/Week 1` -> `Materials/week-1`
    - [x] `Materials/Week 2` -> `Materials/week-2`
    - [x] `Materials/Week 3` -> `Materials/week-3`
    - [x] Rename all `Day X` folders within them.
- [x] Task: Audit and update internal HTML links.
    - [x] **Write Tests:** Use `validate_links.py` to check for broken links or old path references.
    - [x] **Implement Feature:** Use a search-and-replace to update `Week 1` to `week-1`, etc., in HTML files. (No hardcoded paths found).
- [x] Task: Conductor - User Manual Verification 'Execution & Link Update' (Protocol in workflow.md)

## Phase 2: Deployment & Finalization

Goal: Verify the new structure on GitHub Pages.

- [ ] Task: Push changes to GitHub.
- [ ] Task: Verify new URL structure on GitHub Pages.
- [ ] Task: Conductor - User Manual Verification 'Deployment & Finalization' (Protocol in workflow.md)
