# Tech Stack

## Content & Presentation
*   **Presentation Engine:** Reveal.js (HTML/JS based slides)
*   **Web Framework:** Vanilla HTML5, CSS3, and JavaScript
*   **Module Structure:** Each course day consists of an `index.html`, `lecture.html`, `lab.html`, and `quiz.html`.
*   **LMS Support:** Blackboard Ultra (via PDF exports for quizzes).

## Development & Automation Tooling
*   **Primary Language:** Python 3.11+
*   **Core Scripts:**
    *   `generate_image.py`: Gemini-powered image generation for "Visual Educator" slides.
    *   `generate_audio.py`: ElevenLabs or Gemini-powered audio generation.
    *   `html2md.py` & `extract_slides.py`: Content conversion and extraction tools.
    *   `validate_links.py`: Audits HTML files for absolute/relative path consistency (GitHub Pages safety).
*   **Package Management:** `requirements.txt` / `.env` for credential management.

## AI & Data Services
*   **Primary LLM:** Google Gemini (2.5/3.0 Flash) via `google-genai` SDK.
*   **Tooling Platform:** Google AI Studio.
*   **Specialized Workflow:** NotebookLM for visual and educational quality auditing.

## Infrastructure & Workflow
*   **Version Control:** Git
*   **Hosting & Deployment:** GitHub Pages (for student-facing content delivery).
*   **Workspace Management:** Gemini CLI / Claude Code
*   **Architecture:** Structured educational content repository with automated asset generation pipelines.
