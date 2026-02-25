# Track Specification: Rename Folders for Cleaner URLs

## Overview
Rename all directories within `Materials/` that contain spaces to use hyphens (e.g., `Week 1` -> `week-1`, `Day 1` -> `day-1`). This ensures better compatibility with GitHub Pages and results in cleaner, more professional URLs.

## Objectives
- Eliminate spaces in directory names within the `Materials/` folder.
- Maintain the case-insensitive readability of URLs (using lowercase).
- Ensure all internal links within the course materials remain functional.

## Requirements
- **Directory Renaming:**
    - `Week X` -> `week-x`
    - `Day Y` -> `day-y`
- **Internal Link Preservation:** Update any HTML `href` or `src` attributes that explicitly reference the old folder names.
- **Git Preservation:** Perform renames using `git mv` where possible to preserve history.

## Acceptance Criteria
- [ ] No folders in `Materials/` contain spaces.
- [ ] All course pages (lecture, lab, quiz, index) render correctly via local testing.
- [ ] The site is successfully deployed to GitHub Pages and accessible via the new hyphenated URL.
