# Track Specification: Configure and Deploy to GitHub Pages

## Overview
Deploy the UBUS 670 course materials to GitHub Pages to provide stable, direct URLs for integration with Blackboard Ultra.

## Objectives
- Ensure all existing and future HTML modules are compatible with GitHub Pages hosting.
- Automate the deployment process using GitHub Actions.
- Provide a consistent URL structure for the LMS: `https://<user>.github.io/<repo>/Materials/Week%20X/Day%20Y/web/index.html`.

## Requirements
- **Relative Paths:** All internal links, images, CSS, and JS must use relative paths.
- **Automated Validation:** A script must verify that no absolute local paths (e.g., `C:\Users\...`) exist in the HTML files.
- **GitHub Actions:** Deployment should trigger on pushes to the `main` branch.
- **LMS Compatibility:** The served pages must be linkable and render correctly in an iframe if needed by Blackboard.

## Acceptance Criteria
- [ ] Repository is configured for GitHub Pages.
- [ ] GitHub Action successfully builds and deploys the `Materials/` directory.
- [ ] At least one Day module is verified as accessible via the public URL.
- [ ] Validation script passes with 0 errors.
