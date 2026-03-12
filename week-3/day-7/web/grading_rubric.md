# Grading Rubric: Day 7 Lab — Two-Agent Email Triage Quality Checker

## 🎯 Learning Objectives
*   Design and build specialized AI agents with distinct roles and instructions.
*   Implement a sequential multi-agent pipeline using an orchestration framework (ADK or MindStudio).
*   Test and evaluate the effectiveness of a multi-agent "checker" pattern.
*   Document complex AI architectures for technical and non-technical stakeholders.
*   Communicate the business value of agentic AI to executive leadership.

## 📋 Submission Requirements
*   [ ] A completed Lab Report (PDF) with all testing tables and reflection textareas.
*   [ ] Screenshot(s) of the multi-agent pipeline architecture.
*   [ ] Confirmation of progress: Minimum 80% of steps checked in the interactive guide.

## ⚖️ Grading Criteria

| Criterion | Exceeds Expectations (100%) | Meets Expectations (85%) | Needs Improvement (70%) |
| :--- | :--- | :--- | :--- |
| **Agent Design** | Instructions for both Triage and Quality Checker agents are highly precise, role-anchored, and effective. | Instructions are clear and agents perform their roles correctly most of the time. | Instructions are vague or agents fail to maintain their roles during testing. |
| **Pipeline Logic** | Pipeline is correctly wired; output from Agent 1 flows seamlessly into Agent 2 for verification. | Pipeline is functional and executes the sequence correctly. | Pipeline is misconfigured or fails to execute both agents in order. |
| **System Testing** | Evaluation of Email #4 (the trap) and #5 (ambiguous) shows deep insight into AI collaboration and failure modes. | Testing is complete and results are accurately recorded. | Testing is incomplete or observations show little analytical depth. |
| **CTO Pitch** | Pitch is highly professional, persuasive, and uses specific evidence from testing to justify the architecture. | Pitch is logical and correctly identifies the benefits of a two-agent system. | Pitch is unprofessional, generic, or fails to mention specific benefits. |

## 🤖 AI Feedback Protocol
*   **Persona:** Act as an External AI Auditor conducting a review of Beacon's automation architecture.
*   **Tone:** Objective, technical, and focused on reliability and "fail-safes."
*   **Instructions:**
    1.  Verify the **Architecture Description** (Task 7)—does it accurately describe the data flow?
    2.  Check the **Trap Email results** (Task 6)—did the student catch the injection? If not, the "Checker" isn't hardened enough.
    3.  Focus on the **Day 8 Prep** reflection—is the student thinking about "Scale" and "Complexity"?
    4.  Ask one "technical" question about how they would add a third agent to this pipeline (e.g., a "Sentiment Analyst" or "Compliance Officer").
