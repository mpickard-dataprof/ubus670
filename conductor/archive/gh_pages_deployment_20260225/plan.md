# Implementation Plan: Configure and Deploy to GitHub Pages

## Phase 1: Environment Readiness & Validation Tooling [checkpoint: a91d9c1]

Goal: Audit existing files and create a safety net to ensure GitHub Pages compatibility.

- [x] Task: Audit existing HTML files for absolute vs relative paths.
    - [x] Manually check a sample of files from Day 1-5.
    - [x] Document any found absolute paths. (None found)
- [x] Task: Create validation script `_tools/validate_links.py`.
    - [x] **Write Tests:** Create `tests/test_link_validator.py` with failing cases for absolute paths.
    - [x] **Implement Feature:** Build the validator to detect non-relative paths in HTML.
    - [x] **Verify Coverage:** Ensure validator logic is fully tested.
- [x] Task: Conductor - User Manual Verification 'Environment Readiness & Validation Tooling' (Protocol in workflow.md)

## Phase 2: Deployment Automation [checkpoint: 6eaf29c]

Goal: Set up the CI/CD pipeline.

- [x] Task: Create GitHub Actions workflow `.github/workflows/deploy.yml`.
    - [x] **Write Tests:** Verify YAML syntax using `PyYAML`.
    - [x] **Implement Feature:** Configure the action to deploy the `Materials/` folder to `gh-pages` branch.
- [x] Task: Configure GitHub Repository Settings.
    - [x] Enable Pages on the repository.
    - [x] Set source to `gh-pages` branch or GitHub Actions.
- [x] Task: Verify Public URL Accessibility.
    - [x] Deploy and check the live URL for Day 1 Index.
- [x] Task: Conductor - User Manual Verification 'Deployment Automation' (Protocol in workflow.md)
