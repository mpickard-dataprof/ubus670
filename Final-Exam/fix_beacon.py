#!/usr/bin/env python3
"""
fix_beacon.py — Convert 13 non-Beacon questions to Beacon Retail Group scenarios.

Target: raise beacon_scenario ratio from 67/200 (33.5%) to 80/200 (40%).

Selection criteria:
- Spread roughly proportionally across days (2 per day, 1 for Day 4 = 13)
- Apply, Analyze, Evaluate, or Create Bloom's levels (not pure Remember)
- Questions where a retail business scenario feels natural

Beacon Retail Group facts:
- 25-store Midwest retailer
- 1,200 employees
- $312M annual revenue
- HR: 4,200 job applications per year
- Marketing: 850 customer emails per week
- Finance: 1,200 expense reports per month
"""

import json
import copy
from pathlib import Path

QUESTIONS_FILE = Path(__file__).parent / "questions.json"

# ── Rewrites ──────────────────────────────────────────────────────────────────
# Each entry: (question_id, new_stem)
# Options and correct answers are preserved exactly.

REWRITES = {
    # ── Day 1 (2 questions) ───────────────────────────────────────────────────

    "Q018": (
        "Beacon Retail Group's finance team needs to analyze 15 vendor contract "
        "proposals (each about 5,000 words) using an AI tool with a 128,000-token "
        "context window. Which approach makes the best use of the context window?"
    ),

    "Q020": (
        "Beacon Retail Group's finance team asks an AI to calculate total quarterly "
        "supply costs based on a spreadsheet uploaded to the chat. The spreadsheet "
        "has 200 rows covering all 25 stores, but the AI's calculations only "
        "reference the first 120 rows, producing a total that is 40% lower than "
        "the actual figure. What is the most likely cause of this failure?"
    ),

    # ── Day 2 (2 questions) ───────────────────────────────────────────────────

    "Q044": (
        "Beacon Retail Group's marketing team receives 850 customer emails per "
        "week and needs AI to classify them as \"Positive,\" \"Negative,\" or "
        "\"Mixed.\" Their initial zero-shot prompt produces inconsistent results. "
        "Which few-shot approach would best improve accuracy?"
    ),

    "Q053": (
        "A Beacon Retail Group analyst iterates on a prompt five times to improve "
        "an AI-generated weekly sales summary. Each iteration changes a different "
        "RCTFC component: (1) adds a Role, (2) expands Context, (3) refines the "
        "Task, (4) specifies Format, (5) adds Constraints. Output quality improves "
        "significantly after iteration 2 and iteration 5 but not after iterations "
        "1, 3, or 4. What does this pattern suggest?"
    ),

    # ── Day 3 (2 questions) ───────────────────────────────────────────────────

    "Q076": (
        "Beacon Retail Group's HR department needs AI to answer employee questions "
        "about their 500-page employee handbook. The handbook has clear chapters "
        "(Benefits, PTO Policy, Code of Conduct, Safety Procedures, etc.). "
        "Which chunking strategy is most appropriate?"
    ),

    "Q081": (
        "Beacon Retail Group's legal team asks AI to summarize a vendor contract "
        "and provides it in three formats: an unformatted text block, a Markdown "
        "version with headings and sections, and a JSON version with labeled "
        "fields (parties, terms, obligations). Which analysis of format "
        "suitability is most accurate?"
    ),

    # ── Day 4 (1 question) ────────────────────────────────────────────────────

    "Q106": (
        "Beacon Retail Group's accounts payable team receives 500 paper invoices "
        "daily from various vendors across its 25 stores, in different formats "
        "(some typed, some handwritten, some with tables, some without). They want "
        "to extract vendor name, date, line items, and total amount into a "
        "structured spreadsheet. Which multimodal approach should they apply?"
    ),

    # ── Day 5 (2 questions) ───────────────────────────────────────────────────

    "Q131": (
        "Beacon Retail Group's HR department receives 4,200 job applications per "
        "year and needs an AI system to classify each application into department "
        "categories (Sales, Warehouse, Corporate, Management). Consistency is "
        "critical because misclassification delays hiring timelines. What "
        "temperature setting is most appropriate?"
    ),

    "Q136": (
        "Beacon Retail Group's finance team sets temperature to 0.1 and top-p to "
        "0.95 for an AI that generates monthly expense report summaries across all "
        "25 stores. An analyst argues that since temperature is already very low, "
        "the high top-p setting is wasteful. Which analysis of the parameter "
        "interaction is most accurate?"
    ),

    # ── Day 6 (2 questions) ───────────────────────────────────────────────────

    "Q160": (
        "Beacon Retail Group deploys an AI chatbot for customer service across its "
        "25 stores. The system prompt says: 'You are a Beacon Retail customer "
        "service assistant. Answer questions about products, store hours, and "
        "return policies.' A security consultant recommends adding identity "
        "anchoring and instruction refusal. Which addition best implements both "
        "hardening techniques?"
    ),

    "Q164": (
        "Beacon Retail Group implements two defense strategies for its AI customer "
        "service bot that handles 850 customer interactions per week. Strategy A "
        "uses only a hardened system prompt with all five hardening techniques. "
        "Strategy B uses a basic system prompt but adds an external input filter "
        "that screens for known attack patterns before messages reach the AI. "
        "Which comparison of these strategies is most accurate?"
    ),

    # ── Day 7 (2 questions) ───────────────────────────────────────────────────

    "Q185": (
        "Beacon Retail Group needs to process a batch of 50 vendor contracts for "
        "its 25 stores. For each contract, an AI must: (1) extract key terms, "
        "(2) check extracted terms against a compliance checklist, and "
        "(3) generate a summary report. Each step depends on the previous step's "
        "output. Which orchestration pattern is most appropriate?"
    ),

    "Q189": (
        "Beacon Retail Group's customer service team processes tickets from all 25 "
        "stores and must choose between sequential and parallel orchestration "
        "patterns. Sequential ensures each ticket is fully resolved before moving "
        "to the next. Parallel processes multiple tickets simultaneously. Which "
        "analysis of the trade-offs is most accurate?"
    ),
}


def main():
    # Load
    with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = data["questions"]

    # Build lookup
    q_by_id = {q["id"]: q for q in questions}

    # Validate all target IDs exist and are currently non-Beacon
    for qid in REWRITES:
        if qid not in q_by_id:
            raise SystemExit(f"ERROR: Question {qid} not found in questions.json")
        if q_by_id[qid]["beacon_scenario"]:
            raise SystemExit(f"ERROR: Question {qid} is already a Beacon scenario")

    # Apply rewrites
    changes = []
    for qid, new_stem in REWRITES.items():
        q = q_by_id[qid]
        old_stem = q["stem"]
        q["beacon_scenario"] = True
        q["stem"] = new_stem
        changes.append({
            "id": qid,
            "day": q["day"],
            "blooms": q["blooms_level"],
            "topic": q["topic"],
            "old_stem_preview": old_stem[:80] + "...",
            "new_stem_preview": new_stem[:80] + "...",
        })

    # Save
    with open(QUESTIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # ── Summary ───────────────────────────────────────────────────────────────
    print("=" * 72)
    print("BEACON SCENARIO CONVERSION SUMMARY")
    print("=" * 72)

    # Before / after counts
    beacon_count = sum(1 for q in questions if q["beacon_scenario"])
    non_beacon_count = len(questions) - beacon_count
    print(f"\nTotal questions:     {len(questions)}")
    print(f"Beacon scenarios:    {beacon_count} ({beacon_count/len(questions)*100:.1f}%)")
    print(f"Non-Beacon:          {non_beacon_count} ({non_beacon_count/len(questions)*100:.1f}%)")
    print(f"Questions converted: {len(changes)}")
    print()

    # Per-day breakdown
    from collections import Counter
    day_beacon = Counter()
    day_total = Counter()
    for q in questions:
        day_total[q["day"]] += 1
        if q["beacon_scenario"]:
            day_beacon[q["day"]] += 1

    print("Per-day Beacon counts:")
    print(f"  {'Day':<6} {'Beacon':>7} {'Total':>7} {'Ratio':>7}")
    print(f"  {'-'*6} {'-'*7} {'-'*7} {'-'*7}")
    for day in sorted(day_total.keys()):
        ratio = day_beacon[day] / day_total[day] * 100
        print(f"  Day {day:<2} {day_beacon[day]:>5}   {day_total[day]:>5}   {ratio:>5.1f}%")
    print()

    # Detail of each change
    print("Converted questions:")
    print("-" * 72)
    for c in changes:
        print(f"  {c['id']} [Day {c['day']}] [{c['blooms']}] {c['topic']}")
        print(f"    OLD: {c['old_stem_preview']}")
        print(f"    NEW: {c['new_stem_preview']}")
        print()

    print("=" * 72)
    print("Done. questions.json has been updated.")


if __name__ == "__main__":
    main()
