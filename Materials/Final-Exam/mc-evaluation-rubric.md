# Multiple-Choice Question Evaluation Rubric

## Purpose

This rubric is used by an expert MC evaluator agent to systematically assess every multiple-choice question in the UBUS 670 (Generative AI for Business) final exam pool. Each question must be evaluated across all applicable dimensions. The audience is MBA students with no prior technical experience.

## Question Schema Reference

Each question has the following fields: `id`, `day`, `topic`, `blooms_level`, `difficulty`, `beacon_scenario`, `image`, `stem`, and `options` (array of `{key, text, correct}`). Exactly one option must have `correct: true`.

---

## Evaluation Dimensions

### 1. Stem Clarity

**What it checks:** The stem (question text) is unambiguous, presents a single focused question, and contains enough context for a competent student to understand what is being asked before reading the options.

**Scoring: PASS / FAIL**

**Red flags:**
- Stem asks two questions at once ("What is X and why does Y?")
- Stem uses vague pronouns without clear referents ("this process," "that approach")
- Stem contains unnecessary filler that obscures the actual question
- Stem uses double negatives ("Which of the following is NOT incorrect?")
- Stem could be answered differently depending on interpretation
- Stem lacks a clear question mark or interrogative structure
- Stem introduces terminology not defined in course materials

**GOOD example:**
> "Beacon Retail Group asks Gemini, 'Who is Beacon's CEO?' The AI confidently responds with a fabricated name. Why does this happen?"

Why: Clear scenario, single focused question, student knows exactly what to answer.

**BAD example:**
> "Considering the various approaches to AI and how they might impact businesses and thinking about what we covered in class, what would you say about tokens?"

Why: No focused question. Rambling preamble. Student cannot determine what is being asked until reading the options.

---

### 2. Answer Key Defensibility

**What it checks:** There is ONE and ONLY ONE defensibly correct answer. No reasonable subject-matter expert could argue that a distractor is also correct, partially correct, or "more correct" depending on context.

**Scoring: PASS / FAIL** (any doubt = FAIL)

**Red flags:**
- Two options are both technically correct but one is "more complete"
- The correct answer depends on an assumption not stated in the stem
- A distractor is correct in some real-world contexts even if not in the course framing
- The correct answer uses qualifiers ("usually," "often") that weaken its definitiveness
- The question asks for a "best" answer when multiple options are defensible
- The correct answer is only correct if you ignore a common alternative definition

**GOOD example:**
> Stem: "What do the five letters in RCTFC stand for?"
> Correct: "Role, Context, Task, Format, Constraints"

Why: Only one factually correct answer. No ambiguity.

**BAD example:**
> Stem: "What is the best way to reduce hallucinations?"
> A: "Provide relevant context" (correct)
> B: "Lower the temperature setting"
> C: "Use a more recent model"

Why: All three are legitimate strategies. "Best" is subjective without a constraining scenario.

---

### 3. Distractor Plausibility

**What it checks:** Every incorrect option is plausible enough that a student with partial knowledge could be genuinely tempted by it. Distractors should represent common misconceptions, adjacent concepts, or partially-correct reasoning.

**Scoring: 1 (weak) / 2 (adequate) / 3 (strong)**

- **3 (strong):** Every distractor targets a specific misconception or near-miss understanding. A student who studied but has gaps would hesitate.
- **2 (adequate):** Most distractors are plausible; one may be slightly weak but not absurd.
- **1 (weak):** One or more distractors are obviously wrong to anyone who attended class, reducing the question to 2-3 effective choices.

**Red flags:**
- A distractor is clearly absurd or humorous ("Tokens are tiny metal coins")
- A distractor references a concept from a completely different domain
- A distractor is a near-duplicate of another distractor
- A distractor can be eliminated purely through common sense with zero course knowledge
- All distractors are so similar to each other that they cluster, leaving the correct answer as the obvious outlier

**GOOD example:**
> Stem: "What do embeddings convert words into?"
> A: "Alphabetically sorted dictionaries" -- plausible (dictionaries relate to words)
> B: "Database entries linked to a word's definition" -- plausible (databases store information)
> C: "Binary code that stores the word's spelling" -- plausible (computers use binary)
> D: "Vectors of numbers that capture semantic meaning" (correct)

Why: Each distractor sounds technically legitimate and targets a different misconception about how computers might represent words.

**BAD example:**
> Stem: "What is a token in the context of LLMs?"
> A: "About 4 characters or 0.75 words" (correct)
> B: "A cryptocurrency used to pay for AI"
> C: "A physical USB security device"
> D: "An employee badge for building access"

Why: B, C, D are all obviously wrong -- they refer to entirely different meanings of "token" that no student would confuse with NLP tokens after any course exposure.

---

### 4. Answer Length Balance

**What it checks:** All four options are within approximately 20% of each other in word count. Research consistently shows that test-savvy students default to the longest option when guessing, because question writers tend to add qualifiers and precision to correct answers.

**Scoring: PASS / FAIL**

**Measurement method:** Count the words in each option. Compute the mean word count. If any single option deviates from the mean by more than 20%, FAIL. For very short options (under 6 words), allow up to +/- 2 words absolute deviation instead of the percentage test.

**Red flags:**
- The correct answer is noticeably longer than all distractors
- The correct answer contains extra clauses, qualifiers, or explanations that distractors lack
- One distractor is a single word while others are full sentences
- The correct answer uses a parenthetical clarification that no distractor includes

**GOOD example:**
> A: "About 4 characters or 0.75 words" (6 words)
> B: "About 10 characters or 2 words" (6 words)
> C: "One complete word regardless of length" (6 words)
> D: "One complete sentence of text" (5 words)

Why: All options are 5-6 words. No length-based guessing advantage.

**BAD example:**
> A: "Vectors" (1 word)
> B: "Database rows" (2 words)
> C: "Multi-dimensional vectors of floating-point numbers that capture the semantic relationships between words in a high-dimensional space" (16 words)
> D: "Binary strings" (2 words)

Why: C is massively longer than all others, screaming "I'm the correct answer" to any test-savvy student.

---

### 5. Answer Conciseness

**What it checks:** Each option is as concise as possible without losing the meaning needed for discrimination. If a strategy/concept name alone is sufficient to distinguish options, remove elaborative clauses (especially after em-dashes or parenthetical asides).

**Scoring: PASS / NEEDS TRIM**

**Red flags:**
- Options include "-- which means..." or "-- this involves..." explanations that are not needed to differentiate them
- Options repeat information already stated in the stem
- Options contain redundant phrasing ("the process of using X to do Y, where X is used for Y")
- Multiple options share the same prefix or boilerplate language that could be moved into the stem

**GOOD example:**
> A: "Role, Context, Task, Format, Constraints"
> B: "Research, Clarify, Test, Finalize, Confirm"

Why: The answer content alone differentiates the options. No unnecessary elaboration.

**BAD example:**
> A: "RAG (Retrieval-Augmented Generation) -- a technique where external documents are retrieved and fed into the model's context window at inference time to ground its responses in factual, up-to-date information"
> B: "Fine-tuning -- modifying the model weights"
> C: "Prompt engineering -- writing better prompts"

Why: Option A has a 30-word explanation while B and C have 5-word explanations. The concept names alone (RAG, Fine-tuning, Prompt engineering) are sufficient to discriminate. Additionally, the length imbalance created by A's explanation violates Dimension 4.

---

### 6. Image-Question Alignment

**What it checks (only for questions where `image` is not null):** The image adds pedagogical value by requiring visual reasoning, but does not give away the answer to a student who simply reads the image without understanding the concept.

**Scoring: PASS / FAIL / N/A** (N/A when `image` is null)

**Red flags:**
- The image contains text that directly states the correct answer (e.g., a labeled diagram where the label IS the answer)
- The image is purely decorative and does not support reasoning about the question
- The image contradicts the correct answer
- The question could be answered identically with or without the image (image adds nothing)
- The image is referenced in the stem but does not actually exist or match the described content
- The image shows information that makes one distractor obviously wrong, trivializing the question

**GOOD example:**
> Stem: "Beacon's customer service team processes 200 chats/day. Based on the cost table shown, which pricing tier minimizes cost?"
> Image: A cost comparison table with multiple tiers requiring calculation.

Why: The image provides data needed for reasoning but does not circle or highlight the answer. Students must interpret the data.

**BAD example:**
> Stem: "What are the five components of the RCTFC framework?"
> Image: A diagram with five boxes clearly labeled "Role," "Context," "Task," "Format," "Constraints"

Why: The image literally spells out the correct answer. A student with zero knowledge can read the labels and answer correctly.

---

### 7. Bloom's Level Accuracy

**What it checks:** The `blooms_level` field matches the actual cognitive process the question demands. This matters because the exam targets a specific distribution across Bloom's taxonomy.

**Scoring: PASS / MISLABELED (state actual level)**

**Level definitions for this course:**

| Level | Verb | What the student does | Typical stem patterns |
|-------|------|----------------------|----------------------|
| **Remember** | Recall | Retrieves a fact, definition, or term from memory | "What is...?", "Which term describes...?", "What does X stand for?" |
| **Understand** | Explain | Demonstrates comprehension by explaining WHY or paraphrasing | "Why does...?", "Which statement best explains...?", "What is the primary reason...?" |
| **Apply** | Use | Takes a known concept and uses it in a new, specific situation | "Given this scenario, calculate...", "Beacon needs to... which approach should they use?" |
| **Analyze** | Compare/Contrast | Breaks a situation into parts, identifies relationships or trade-offs | "Which factor is most critical when comparing X and Y?", "What distinguishes X from Y in this scenario?" |
| **Evaluate** | Judge/Justify | Makes a judgment call with reasoning, assesses trade-offs | "Which concern should take priority?", "What is the strongest argument for/against...?" |
| **Create** | Design/Produce | Combines elements to form a new plan, strategy, or artifact | "Which combination of strategies best addresses...?", "How should Beacon design...?" |

**Red flags:**
- Labeled "apply" but just asks for a definition (actually "remember")
- Labeled "analyze" but only requires recall of a fact with a scenario wrapper (actually "remember" with decoration)
- Labeled "evaluate" but has an objectively correct answer with no judgment involved (actually "remember" or "understand")
- Labeled "create" but asks which pre-existing strategy to select (actually "apply" or "evaluate")
- A scenario is present but is purely cosmetic -- removing it would not change the cognitive task

**GOOD example:**
> Label: "apply"
> Stem: "Beacon's finance team processes 1,200 expense reports per month. Each report averages 300 words, and the AI's analysis response averages 200 words. If the AI vendor charges $0.50 per 1 million tokens, what is Beacon's approximate monthly cost?"

Why: Requires taking a known formula (words to tokens conversion) and applying it to a new numerical scenario with multi-step calculation.

**BAD example:**
> Label: "apply"
> Stem: "Beacon is interested in AI. What is a token?"

Why: The Beacon reference is cosmetic. The question is pure recall ("remember"). Stripping "Beacon is interested in AI" changes nothing about the cognitive task.

---

### 8. No Absolute Language

**What it checks:** Distractors do not use absolute language ("always," "never," "all," "none," "every," "only," "must," "impossible," "guaranteed") that signals incorrectness to test-savvy students. Correct answers should also avoid absolutes unless the statement is genuinely absolute.

**Scoring: PASS / FAIL**

**Red flags:**
- A distractor says "always" or "never" when the correct answer uses measured language
- A distractor uses "all" or "none" making it trivially falsifiable
- The word "only" appears in a distractor in a way that makes it easy to think of a counterexample
- Multiple distractors use absolutes while the correct answer does not, creating a pattern

**Exception:** If the correct answer IS an absolute fact (e.g., "Temperature ranges from 0.0 to 1.0"), absolute language is appropriate there. The concern is distractors using absolutes as a tell.

**GOOD example:**
> A: "Tokens only count the words you type, not the AI's response" -- uses "only" but this is a plausible misconception, and other options don't create a pattern of absolutes-are-wrong.

**BAD example:**
> A: "AI always produces accurate information" (distractor -- obvious)
> B: "AI never makes mistakes when given good prompts" (distractor -- obvious)
> C: "AI sometimes generates plausible but incorrect information" (correct -- clearly the measured one)
> D: "AI is guaranteed to be factual if you pay more" (distractor -- obvious)

Why: Three distractors use absolutes (always, never, guaranteed); the correct answer is the only measured statement. Any test-aware student picks C without domain knowledge.

---

### 9. Grammatical Consistency

**What it checks:** All four options are grammatically parallel and syntactically consistent. They should all be the same part of speech, start the same way, and complete the stem in a grammatically correct manner.

**Scoring: PASS / FAIL**

**Red flags:**
- Three options are noun phrases but one is a full sentence
- Options mix "To + verb" with "Verb + -ing" with noun phrases
- The stem says "is which of the following?" and one option doesn't grammatically complete it
- Articles ("a," "an," "the") differ in a way that provides a grammatical clue (stem ends with "an" and only one option starts with a vowel)
- One option starts with a capital letter suggesting it's a proper noun while others don't, or vice versa

**GOOD example:**
> Stem: "What do embeddings convert words into?"
> A: "Alphabetically sorted dictionaries"
> B: "Database entries linked to a word's definition"
> C: "Binary code that stores the word's spelling"
> D: "Vectors of numbers that capture semantic meaning"

Why: All options are noun phrases that grammatically answer "into [what]."

**BAD example:**
> Stem: "The context window is..."
> A: "how much text fits"
> B: "The total amount of text the model can consider in a single conversation"
> C: "Translating languages"
> D: "When the model stops"

Why: A is informal/incomplete, B is a formal noun phrase, C is a gerund phrase about a different topic, D starts with "When" making it a temporal clause. They are not parallel.

---

### 10. Independence

**What it checks:** Answering one question does not reveal or constrain the answer to another question in the pool. This includes both direct information leakage (Q1's stem contains Q2's answer) and logical constraint (if Q1's answer is X, then Q2 must be Y).

**Scoring: PASS / FAIL**

**Red flags:**
- A stem for one question restates a fact that is the correct answer to a different question
- Two questions ask about the same concept at different Bloom's levels where the lower-level question gives away the higher-level one
- A question's distractor explanations (in feedback text) contain the answer to another question
- Two questions share the same scenario continuation where answering the first constrains the second

**GOOD example:**
> Q001: "A token is approximately equal to which of the following?" (Answer: ~4 chars / 0.75 words)
> Q014: "Given 1,200 reports at 300 words each... calculate the cost." (Requires knowing the token ratio but doesn't state it)

Why: Q014 requires knowledge of the token ratio (tested in Q001) but does not reveal it in the stem. A student who missed Q001 can still miss Q014.

**BAD example:**
> Q001: "A token is approximately 4 characters. What is the cost of processing 1,000 words?"
> Q002: "How many characters is a token approximately equal to?"

Why: Q001's stem directly states the answer to Q002.

---

### 11. Scenario Relevance

**What it checks (for questions where `blooms_level` is "apply" or higher):** The business scenario is realistic, meaningful to MBA students, and integral to answering the question -- not just decorative framing.

**Scoring: PASS / COSMETIC / N/A**

- **PASS:** Removing the scenario would change the cognitive task or make the question unanswerable.
- **COSMETIC:** The scenario is window dressing. Removing "Beacon Retail Group" and the business context leaves an identical question. The scenario does not influence which option is correct.
- **N/A:** Question is at Remember/Understand level and does not claim to have a scenario.

**Red flags:**
- The stem says "Beacon is considering AI" but then asks a pure definition question
- The scenario mentions a department, role, or business problem but the options are all abstract/theoretical
- The scenario could be replaced with any other company name without changing anything
- For Apply+ questions: the scenario does not provide data, constraints, or context that affect which answer is correct

**GOOD example:**
> "Beacon's finance team processes 1,200 expense reports per month. Each report averages 300 words..."

Why: The specific numbers (1,200 reports, 300 words) are necessary to calculate the answer. Removing them makes the question unanswerable.

**BAD example:**
> "Beacon Retail Group is exploring AI. What does the temperature parameter control?"

Why: "Beacon Retail Group is exploring AI" is irrelevant. The question is pure recall regardless of what company is mentioned. `beacon_scenario` should be `false` for this question.

---

### 12. Correct Answer Distribution

**What it checks:** Across the entire question pool, correct answers are distributed roughly equally across A, B, C, and D. This is a pool-level check, not a per-question check.

**Scoring: PASS / IMBALANCED**

**Measurement:** For a pool of N questions, the expected count per key is N/4. If any key deviates by more than 15% from expected (e.g., in a 200-question pool, expected = 50, so any key below 42 or above 58 is flagged), the distribution is IMBALANCED.

**Red flags:**
- One letter is correct significantly more often than others
- One letter is correct significantly less often than others
- Correct answers cluster by day or topic (e.g., all Day 1 questions have answer A)
- A pattern emerges where the correct answer cycles predictably (A, B, C, D, A, B, C, D...)

**What to report:** The actual distribution counts and percentages. If imbalanced, identify which keys are over/under-represented and which specific questions could be rekeyed (by reordering their options) to balance the distribution.

---

### 13. Stem Completeness (No Window Dressing)

**What it checks:** The stem contains all information necessary to answer the question. A student should be able to formulate a tentative answer BEFORE reading the options (the "cover test"). The stem should not be an incomplete sentence fragment that only makes sense once you read the options.

**Scoring: PASS / FAIL**

**Red flags:**
- The stem is just a topic label: "Tokens:" followed by options
- The stem is an incomplete sentence that options finish: "A hallucination is..." with options completing the definition
- The stem requires reading options to understand what is actually being asked
- The stem asks "Which of the following is true?" with no constraining context -- this forces students to evaluate four independent statements rather than answer one question

**GOOD example:**
> "When an AI model generates information that sounds plausible but is factually incorrect or entirely fabricated, this is known as which of the following?"

Why: A prepared student could think "hallucination" before looking at options. The stem is a complete, focused question.

**BAD example:**
> "Which of the following statements about AI is true?"

Why: This is four true/false questions disguised as one MC question. The student must evaluate each option independently. There is no single concept being tested.

---

### 14. Distractor Feedback Quality

**What it checks:** If the question JSON includes feedback/explanation fields for distractors, the feedback helps the student understand WHY the distractor is wrong and guides them toward the correct understanding. This is relevant for formative use (practice exams).

**Scoring: PASS / WEAK / N/A**

- **PASS:** Feedback explains the specific misconception and redirects to the correct concept.
- **WEAK:** Feedback just says "Incorrect" or restates the correct answer without addressing why the student chose the wrong one.
- **N/A:** No feedback fields present.

**Red flags:**
- Feedback says only "This is incorrect" with no explanation
- Feedback explains the correct answer but doesn't address why the chosen option is wrong
- Feedback is identical across all distractors
- Feedback introduces new information not covered in course materials

---

### 15. Option Ordering Logic

**What it checks:** When options have a natural order (numerical, chronological, size-based), they should be arranged in that order. Random ordering of naturally ordered items adds unnecessary cognitive load and can inadvertently create patterns.

**Scoring: PASS / REORDER**

**Red flags:**
- Numerical options are scrambled (e.g., $4.00, $0.04, $40.00, $0.40 instead of ascending/descending)
- Chronological sequences are out of order when order is not the thing being tested
- Options that are subsets/supersets of each other are not arranged to make the relationships clear

**Exception:** When the question IS about ordering (e.g., "Which sequence is correct?"), scrambled order in the options is expected and correct.

**GOOD example:**
> Stem: "What is Beacon's approximate monthly cost?"
> A: "$0.04"  B: "$0.40"  C: "$4.00"  D: "$40.00"

Why: Ascending order lets the student focus on the calculation rather than scanning for magnitude.

**BAD example:**
> A: "$40.00"  B: "$0.04"  C: "$4.00"  D: "$0.40"

Why: Scrambled order adds unnecessary friction and can cause careless errors unrelated to knowledge.

---

## Evaluation Procedure

For each question in the pool, the evaluator agent should:

1. **Read** the question completely (stem, all options, metadata fields).
2. **Score** each applicable dimension using the criteria above.
3. **Record** a structured evaluation with:
   - Question ID
   - Per-dimension score (PASS/FAIL/rating)
   - Specific issue description for any non-PASS score
   - Recommended fix (concrete, actionable)
4. **Flag** critical failures: Any question that FAILs on dimensions 1, 2, or 6 should be flagged as **MUST FIX** before the exam can be administered.
5. After all questions are evaluated, run the **pool-level checks** (dimension 12) and report.

## Severity Classification

| Severity | Dimensions | Action Required |
|----------|-----------|-----------------|
| **CRITICAL** | 1 (Stem Clarity), 2 (Answer Key Defensibility), 6 (Image Gives Away Answer) | Must fix before exam administration. Question is unusable as-is. |
| **HIGH** | 3 (Distractor Plausibility = 1), 7 (Bloom's Mislabeled), 10 (Independence violation) | Should fix. Question functions but has a significant flaw. |
| **MEDIUM** | 4 (Length Balance), 5 (Conciseness), 8 (Absolute Language), 9 (Grammatical Consistency), 11 (Cosmetic Scenario) | Fix if time permits. Question is usable but suboptimal. |
| **LOW** | 12 (Distribution), 13 (Stem Completeness), 14 (Feedback Quality), 15 (Option Ordering) | Polish item. Address during routine maintenance. |

## Output Format

The evaluator should produce a JSON array where each entry follows this structure:

```json
{
  "question_id": "Q001",
  "overall_verdict": "PASS | NEEDS_REVISION | CRITICAL_FIX",
  "dimensions": {
    "stem_clarity": {"score": "PASS", "note": null},
    "answer_key_defensibility": {"score": "PASS", "note": null},
    "distractor_plausibility": {"score": 3, "note": null},
    "answer_length_balance": {"score": "PASS", "note": null, "word_counts": {"A": 6, "B": 6, "C": 6, "D": 5}},
    "answer_conciseness": {"score": "PASS", "note": null},
    "image_question_alignment": {"score": "N/A", "note": "No image"},
    "blooms_level_accuracy": {"score": "PASS", "note": null},
    "no_absolute_language": {"score": "PASS", "note": null},
    "grammatical_consistency": {"score": "PASS", "note": null},
    "independence": {"score": "PASS", "note": null},
    "scenario_relevance": {"score": "N/A", "note": null},
    "stem_completeness": {"score": "PASS", "note": null},
    "distractor_feedback_quality": {"score": "N/A", "note": null},
    "option_ordering_logic": {"score": "PASS", "note": null}
  },
  "issues": [],
  "recommended_fixes": []
}
```

For the pool-level distribution check, append a summary object:

```json
{
  "pool_summary": {
    "total_questions": 200,
    "correct_answer_distribution": {"A": 55, "B": 43, "C": 49, "D": 53},
    "distribution_verdict": "IMBALANCED",
    "distribution_note": "B is under-represented (43/200 = 21.5% vs expected 25%). Consider rekeying 7 questions where B could be the correct answer by reordering options.",
    "critical_issues": 0,
    "high_issues": 3,
    "medium_issues": 12,
    "low_issues": 5
  }
}
```
