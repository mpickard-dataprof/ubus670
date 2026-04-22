#!/usr/bin/env python3
"""Fix correct answer position distribution by shuffling option order."""
import json
import random
from collections import Counter

random.seed(42)  # Reproducible

with open("Materials/Final-Exam/questions.json", "r") as f:
    data = json.load(f)

questions = data["questions"]
KEYS = ["A", "B", "C", "D"]

for q in questions:
    # Shuffle options randomly
    options = q["options"]
    random.shuffle(options)
    # Reassign keys A-D in new order
    for i, opt in enumerate(options):
        opt["key"] = KEYS[i]

# Verify distribution
correct_dist = Counter()
for q in questions:
    for o in q["options"]:
        if o["correct"]:
            correct_dist[o["key"]] += 1

print(f"Correct answer distribution after shuffle: {dict(sorted(correct_dist.items()))}")

# Check all still have exactly 1 correct
bad = [q["id"] for q in questions if sum(1 for o in q["options"] if o["correct"]) != 1]
print(f"Questions with bad correct count: {bad if bad else 'None'}")

with open("Materials/Final-Exam/questions.json", "w") as f:
    json.dump(data, f, indent=2)

print("Saved fixed questions.json")
