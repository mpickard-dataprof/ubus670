# Grading Rubric: Day 5 Lab — Beacon's Customer Email Triage System

## 🎯 Learning Objectives
*   Configure model parameters (Temperature, Max Tokens) and explain their impact on business consistency.
*   Engineer a sophisticated system prompt that enforces specific behavioral rules and structured JSON output.
*   Perform accurate token counting and calculate projected API costs for a large-scale deployment.
*   Evaluate AI reliability against edge cases (multi-category, non-English, emotion, spam).
*   Construct a compelling business case (ROI) for AI automation.

## 📋 Submission Requirements
*   [ ] A completed Lab Report (PDF) containing all data tables, configurations, and reflection textareas.
*   [ ] The Final System Prompt (Task 10) documented in the report.
*   [ ] Confirmation of progress: Minimum 80% of steps checked in the interactive guide.

## ⚠️ Grading Note: Category Name Accommodation (Early Submissions)

The lab was updated mid-semester to align email badges and Task 2 expected values with the system prompt template categories. Students who submitted **before the fix** may have seen the old labels:

| Old Label (pre-fix) | Current Label (system prompt) |
| :--- | :--- |
| `return` | `return_exchange` |
| `inquiry` | `product_question` or `billing` (depends on email) |
| `compliment` | `feedback_praise` |
| `escalation` | `complaint` (with high urgency) |

**Grading guidance:** Accept either naming convention as correct for early submissions. Do NOT mark students down for using the old label names. Students who noticed the original mismatch and discussed it in their iteration notes (Task 3) should be credited for strong analytical thinking.

## ⚖️ Grading Criteria

| Criterion | Exceeds Expectations (100%) | Meets Expectations (85%) | Needs Improvement (70%) |
| :--- | :--- | :--- | :--- |
| **System Prompting** | Final prompt is highly detailed, uses strong rules, and consistently produces valid JSON. | Prompt is effective and uses most components but may have minor logic gaps. | Prompt is vague, missing categories, or results in inconsistent output. |
| **Parameter Tuning** | Analysis of Temperature (Task 4/5) shows deep understanding of the trade-off between consistency and creativity. | Correctly identifies that low temp is better for classification. | Shows little understanding of how parameters affect the AI's behavior. |
| **Economics & ROI** | Token counts and monthly cost projections (Task 8) are accurate and the CFO pitch is highly persuasive. | Math is mostly correct and the ROI case is logical. | Significant errors in math or fails to provide a coherent business case. |
| **Reliability Testing** | Edge case evaluation (Task 11) is honest and identifies specific, actionable weaknesses in the system. | Documents edge case results but analysis of weaknesses is surface-level. | Fails to test edge cases or ignores system failures. |

## 🤖 AI Feedback Protocol
*   **Persona:** Act as the Chief Financial Officer (CFO) of Beacon Retail Group reviewing an automation proposal.
*   **Tone:** Rigorous, ROI-obsessed, yet open to innovative efficiency gains.
*   **Instructions:**
    1.  Validate the **Total Annual Savings** calculation—is the math sound?
    2.  Check the **Edge Case results**—did the system catch the Email #16 phishing attempt? (Crucial for security!)
    3.  Critique the **CFO Pitch** (Task 9)—is it professional and results-oriented?
    4.  Ask one "probing question" about how they would handle the non-English email (Email #14) more reliably in Year 2.
