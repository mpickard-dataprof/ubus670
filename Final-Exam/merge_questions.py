#!/usr/bin/env python3
"""Merge question batches into a single questions.json and validate."""
import json
import re
from collections import Counter

BATCH_FILES = {
    "Day 1-2": "Materials/Final-Exam/day1-day2-questions.json",
    "Day 3-4": "/home/matt/.claude-personal/projects/-home-matt-Documents-NIU-Classes-2026-Spring-UBUS-670/e31c7765-c1bd-4326-b312-2998dd28b8c1/tool-results/toolu_01R5h5CWUvszHGdqTw2gxW6N.json",
    "Day 5-7": "/home/matt/.claude-personal/projects/-home-matt-Documents-NIU-Classes-2026-Spring-UBUS-670/e31c7765-c1bd-4326-b312-2998dd28b8c1/tool-results/toolu_01A4ATi7qZqv91Df2fCZ7LrW.json",
}

OUTPUT = "Materials/Final-Exam/questions.json"


def extract_json_array(text):
    """Extract the first JSON array from text that may contain commentary."""
    match = re.search(r'\[\s*\{', text)
    if not match:
        return None
    json_str = text[match.start():]
    bracket_count = 0
    for i, ch in enumerate(json_str):
        if ch == '[':
            bracket_count += 1
        elif ch == ']':
            bracket_count -= 1
        if bracket_count == 0:
            return json.loads(json_str[:i + 1])
    return None


def load_batch(name, path):
    with open(path, 'r') as f:
        raw = json.load(f)

    # Direct JSON array (Day 1-2 format)
    if isinstance(raw, list) and len(raw) > 0 and "id" in raw[0]:
        return raw

    # Agent output format: [{type: "text", text: "...JSON..."}]
    if isinstance(raw, list) and len(raw) > 0 and "text" in raw[0]:
        return extract_json_array(raw[0]["text"])

    raise ValueError(f"Unknown format for {name}")


def validate(questions):
    errors = []
    for q in questions:
        correct_count = sum(1 for o in q["options"] if o["correct"])
        if correct_count != 1:
            errors.append(f"{q['id']}: {correct_count} correct answers")
        if len(q["options"]) != 4:
            errors.append(f"{q['id']}: {len(q['options'])} options (expected 4)")
    return errors


def main():
    all_questions = []

    for name, path in BATCH_FILES.items():
        batch = load_batch(name, path)
        if batch:
            print(f"{name}: {len(batch)} questions (IDs: {batch[0]['id']}-{batch[-1]['id']})")
            all_questions.extend(batch)
        else:
            print(f"ERROR: Could not parse {name}")

    print(f"\nTotal: {len(all_questions)} questions")

    # Distribution analysis
    day_counts = Counter(q["day"] for q in all_questions)
    bloom_counts = Counter(q["blooms_level"] for q in all_questions)
    beacon_count = sum(1 for q in all_questions if q["beacon_scenario"])
    correct_dist = Counter()
    for q in all_questions:
        for o in q["options"]:
            if o["correct"]:
                correct_dist[o["key"]] += 1

    print(f"\nBy Day: {dict(sorted(day_counts.items()))}")
    print(f"By Bloom's: {dict(sorted(bloom_counts.items()))}")
    print(f"Beacon: {beacon_count}/{len(all_questions)} ({100 * beacon_count / len(all_questions):.1f}%)")
    print(f"Correct answer distribution: {dict(sorted(correct_dist.items()))}")

    # Duplicate IDs
    ids = [q["id"] for q in all_questions]
    dupes = [x for x, c in Counter(ids).items() if c > 1]
    print(f"Duplicate IDs: {dupes if dupes else 'None'}")

    # Validation
    errors = validate(all_questions)
    if errors:
        print(f"\nVALIDATION ERRORS:")
        for e in errors:
            print(f"  - {e}")
    else:
        print("All questions valid (4 options, 1 correct each)")

    # Save
    with open(OUTPUT, 'w') as f:
        json.dump({"questions": all_questions}, f, indent=2)
    print(f"\nSaved to {OUTPUT}")


if __name__ == "__main__":
    main()
