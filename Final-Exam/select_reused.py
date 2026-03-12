#!/usr/bin/env python3
"""Select 20 questions from the final exam pool for reuse in the practice exam.

Reads:  Materials/Final-Exam/questions.json
Writes: Materials/Final-Exam/practice-questions.json (initial 20 reused questions)

Selection criteria:
  - 3 per Bloom's level (Apply and Create get 4 each) = 20 total
  - 3 per day (Day 7 gets 2) = 20 total
  - Prioritizes questions WITHOUT images
  - Assigns new IDs (P001-P020) to avoid BB Ultra conflicts
"""

import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
QUESTIONS_JSON = SCRIPT_DIR / "questions.json"
OUTPUT_JSON = SCRIPT_DIR / "practice-questions.json"

# Hand-selected 20 questions matching day x bloom's distribution.
# All are no-image questions to prioritize text-based format practice.
REUSED_MAP = {
    # P-ID -> Q-ID
    "P001": "Q001",  # D1 Remember  - Tokens
    "P002": "Q015",  # D1 Apply     - Identify Hallucination
    "P003": "Q025",  # D1 Evaluate  - Hallucination Risk Assessment
    "P004": "Q039",  # D2 Understand - Why Constraints Matter
    "P005": "Q050",  # D2 Analyze   - Zero-Shot vs Few-Shot Comparison
    "P006": "Q063",  # D2 Create    - Prompt Template Design
    "P007": "Q067",  # D3 Remember  - Context Engineering
    "P008": "Q086",  # D3 Evaluate  - RAG vs Fine-Tuning Evaluation
    "P009": "Q093",  # D3 Create    - Semantic Search Design
    "P010": "Q099",  # D4 Understand - Multimodal Context Engineering
    "P011": "Q104",  # D4 Apply     - Hotel Marketing Images
    "P012": "Q117",  # D4 Create    - Cosmetics Brand Marketing
    "P013": "Q133",  # D5 Apply     - Marketing Taglines
    "P014": "Q138",  # D5 Analyze   - Hotel AI Concierge
    "P015": "Q142",  # D5 Evaluate  - E-commerce AI Config
    "P016": "Q151",  # D6 Remember  - Red Teaming Definition
    "P017": "Q160",  # D6 Apply     - Beacon Chatbot Deployment
    "P018": "Q165",  # D6 Analyze   - Real-World AI Failures
    "P019": "Q181",  # D7 Understand - Single-LLM to Multi-Agent
    "P020": "Q199",  # D7 Create    - Agent Governance Framework
}


def main() -> None:
    with open(QUESTIONS_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    q_lookup = {q["id"]: q for q in data["questions"]}

    practice_questions = []
    for p_id, q_id in REUSED_MAP.items():
        orig = q_lookup[q_id]
        reused = {
            "id": p_id,
            "original_id": q_id,
            "day": orig["day"],
            "topic": orig["topic"],
            "blooms_level": orig["blooms_level"],
            "difficulty": orig["difficulty"],
            "beacon_scenario": orig["beacon_scenario"],
            "image": orig["image"],
            "stem": orig["stem"],
            "options": orig["options"],
        }
        practice_questions.append(reused)

    output = {"questions": practice_questions}
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # Verify distribution
    from collections import Counter

    blooms = Counter(q["blooms_level"] for q in practice_questions)
    days = Counter(q["day"] for q in practice_questions)
    imgs = sum(1 for q in practice_questions if q.get("image"))

    print(f"Selected {len(practice_questions)} reused questions")
    print(f"By Bloom's: {dict(sorted(blooms.items()))}")
    print(f"By Day: {dict(sorted(days.items()))}")
    print(f"With images: {imgs}")
    print(f"Written to: {OUTPUT_JSON.name}")


if __name__ == "__main__":
    main()
