# Blackboard Ultra Import Guide — UBUS 670 Final Exam Question Pool

## Prerequisites

- Blackboard Ultra instructor access for UBUS 670
- File: `final-exam-pool.zip` (QTI 2.1 content package, ~177 KB)

---

## Step 1: Import the Question Bank

1. In BB Ultra, navigate to your UBUS 670 course
2. Go to **Course Content** area
3. In the left sidebar, click **Question Banks** (under "Details & Actions")
4. Click the **+** (plus) button or **Import** option
5. Select **Import QTI 2.1 Package**
6. Upload `final-exam-pool.zip`
7. Wait for processing (may take 1-2 minutes for 200 questions)
8. Verify the bank appears with 200 questions

### Troubleshooting Import

| Issue | Solution |
|---|---|
| "Invalid package format" | Ensure you're uploading the ZIP file, not an extracted folder |
| Questions missing after import | Check BB Ultra's import log; some questions may have been silently dropped if XML is malformed |
| Images not displaying | Images must be in the `images/` folder within the ZIP; check that image filenames match references |
| Fewer than 200 questions | Re-run `build_qti.py` to regenerate; check for XML validation errors |

---

## Step 2: Create the Final Exam Test

1. Navigate to **Course Content**
2. Click **+** > **Create** > **Test**
3. Name it: **"Final Exam — Generative AI for Business Leaders"**
4. Click **Add Question Pool**
5. Select the imported question bank ("UBUS670-Final-Exam-Pool" or similar)
6. Set **Number of questions to display**: **50**
7. Set **Points per question**: **1**

---

## Step 3: Configure Test Settings

### Timing
- **Time limit**: 120 minutes
- **Timer behavior**: Auto-submit when time expires

### Availability
- Set appropriate date/time window for take-home exam
- Recommended: 24-48 hour availability window (students need 120 min within that window)

### Randomization
- **Randomize question order**: ON (should be automatic with pools)
- **Randomize answer choices**: ON (BB Ultra shuffles `simpleChoice` elements when `shuffle="true"` is set in the QTI — this is already configured)

### Attempts
- **Number of attempts**: 1
- **Score attempts**: Only attempt

### Display
- **One question at a time**: Recommended for timed exams (prevents scrolling through all 50)
- **Prohibit backtracking**: Optional (your preference)

### Results
- **Show correct answers**: After due date (prevents sharing during availability window)
- **Show score**: Immediately after submission

---

## Step 4: Verify Before Deployment

1. **Preview the test** as a student (use Student Preview mode)
2. Confirm 50 random questions appear from the pool
3. Verify images render correctly (if any)
4. Check that the timer works as expected
5. Verify randomization — preview a second time and confirm different question order
6. Check point values (50 questions × 1 point = 50 points total)

---

## Question Bank Reference

- **Source file**: `questions.json` (200 questions, structured data)
- **Matrix**: `question-matrix.md` (human-readable inventory by Day × Bloom's level)
- **Distribution**:
  - Days 1-7 content (no capstone)
  - Equal Bloom's taxonomy levels (~33 per level)
  - 40% Beacon Retail scenarios, 60% new business scenarios
  - Balanced correct answer positions (A/B/C/D roughly equal)

---

## Rebuilding the Package

If you edit `questions.json` (add, remove, or modify questions), regenerate the QTI package:

```bash
cd "Materials/Final-Exam"
python3 build_qti.py
```

This regenerates `final-exam-pool.zip` from the current `questions.json`. Re-import into BB Ultra after regenerating.

---

*Generated for UBUS 670, Spring 2026*
