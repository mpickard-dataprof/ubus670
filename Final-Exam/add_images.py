#!/usr/bin/env python3
"""Add image references to questions.json based on the pedagogical review mapping."""
import json

IMAGE_MAP = {
    "three-eras-of-software.webp": ["Q007", "Q019"],
    "temperature-spectrum.webp": ["Q005", "Q012", "Q016", "Q032"],
    "token-cost-calculation.webp": ["Q009", "Q014"],
    "context-window-visualization.webp": ["Q004", "Q010", "Q018", "Q020", "Q022"],
    "embedding-vector-space.webp": ["Q003", "Q011", "Q074"],
    "rctfc-framework.webp": ["Q033", "Q043", "Q049", "Q054"],
    "rag-pipeline.webp": ["Q066", "Q071", "Q075", "Q080", "Q082", "Q091"],
    "chunking-strategies.webp": ["Q076", "Q078", "Q088"],
    "token-selection-pipeline.webp": ["Q123", "Q124", "Q128", "Q136"],
    "system-prompt-six-components.webp": ["Q125", "Q126", "Q132", "Q139", "Q141"],
    "model-cost-comparison.webp": ["Q137", "Q140"],
    "four-attack-categories.webp": ["Q152", "Q158", "Q162", "Q166"],
    "five-layer-defense-model.webp": ["Q153", "Q155", "Q159", "Q163", "Q164", "Q173"],
    "ai-governance-lifecycle.webp": ["Q154", "Q161", "Q176"],
    "perception-reasoning-action.webp": ["Q179", "Q186"],
    "orchestration-patterns.webp": ["Q180", "Q182", "Q183", "Q184", "Q185", "Q188", "Q189", "Q200"],
    "single-llm-vs-multi-agent.webp": ["Q190", "Q191"],
    "enterprise-token-budget.webp": ["Q148"],
}

with open("Materials/Final-Exam/questions.json", "r") as f:
    data = json.load(f)

# Build reverse map: question_id -> image_filename
q_to_image = {}
for filename, qids in IMAGE_MAP.items():
    for qid in qids:
        q_to_image[qid] = filename

# Update questions
updated = 0
for q in data["questions"]:
    if q["id"] in q_to_image:
        q["image"] = q_to_image[q["id"]]
        updated += 1

print(f"Updated {updated} questions with image references")
print(f"Unique images: {len(IMAGE_MAP)}")

# Verify
with_images = sum(1 for q in data["questions"] if q["image"])
print(f"Questions with images: {with_images}/200")

with open("Materials/Final-Exam/questions.json", "w") as f:
    json.dump(data, f, indent=2)

print("Saved updated questions.json")
