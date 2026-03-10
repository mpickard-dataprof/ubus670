# Specification: Resume Dataset for Capstone Competition

**Spec ID:** 0010
**Title:** Resume Dataset — Practice & Competition Sets for Days 8-9 Capstone
**Status:** Complete
**Author:** Claude (Architect)
**Created:** 2026-03-09
**Parent Spec:** 0009 (Capstone Days 8-9)
**Related Specs:** 0005 (Day 5 AI Studio — email dataset pattern), 0001 (Course Materials)

---

## 1. Overview

### 1.1 Purpose

Design and generate two sets of fictional resumes for the Days 8-9 capstone project. Students build a 3-agent pipeline (Parser → Evaluator → Ranker) to screen candidates for Beacon Retail Group's seasonal hiring. The practice set is used for pipeline development on Day 8; the competition set is used for the scored competition on Day 9.

### 1.2 Scope

| Set | Count | Purpose | Visibility |
|-----|-------|---------|------------|
| Practice | 20 resumes | Build, test, iterate pipeline | Always visible on lab page |
| Competition | 30 resumes | Scored competition, ground truth ranking | Hidden until instructor toggle on Day 9 |
| **Total** | **50 resumes** | | |

### 1.3 Design Principles

1. **Defensible ground truth** — Every resume has a point-based score derived from quantifiable attributes. Rankings are reproducible, not subjective.
2. **Clear extremes, fuzzy middle** — Top 3 and bottom 3 are unambiguous (wide score gaps). Middle positions allow ±1-2 swaps for partial credit.
3. **Layered complexity** — Surface-level signals (experience, skills) plus hidden layers (red flags, bias pairs, cross-resume patterns) that reward deeper analysis.
4. **Beacon consistency** — All resumes are realistic for seasonal retail positions at a 25-store, 1,200-employee regional retail chain.
5. **Diverse and representative** — Varied backgrounds, education levels, career paths, demographics. Diversity supports both realism and the bias detection scoring dimension.

---

## 2. Beacon Job Context

### 2.1 Job Posting (Embedded in Lab)

The Evaluator agent needs a job description to score against. This posting is shown on the lab page with a copy-to-clipboard button.

**Position:** Seasonal Retail Associate
**Company:** Beacon Retail Group
**Locations:** Multiple stores across the region (12 hiring locations)
**Duration:** May - August 2026 (with potential extension for strong performers)
**Hours:** 25-40 hours/week, must be available weekends and at least 2 holidays
**Pay:** $16-$19/hour based on experience

**Key Responsibilities:**
- Operate POS register and process customer transactions
- Assist customers with product location, sizing, and recommendations
- Stock shelves, maintain displays, and organize backroom inventory
- Handle returns and exchanges per Beacon's return policy
- Maintain clean and organized store environment
- Support seasonal promotions and sale events

**Required Qualifications:**
- 18+ years old
- Available for the full May-August season (partial availability considered for strong candidates)
- Able to stand for extended periods, lift up to 30 lbs
- Reliable transportation to assigned store location
- High school diploma or equivalent

**Preferred Qualifications:**
- Previous retail or customer service experience
- POS/cash register experience
- Bilingual (English + Spanish, Mandarin, or other)
- Open availability including evenings, weekends, and holidays
- Experience with inventory management or visual merchandising
- First aid or safety certification

### 2.2 Scoring Attributes (Ground Truth Basis)

Each resume is scored on these attributes to produce a ground truth total:

| Attribute | Max Points | What It Measures |
|-----------|-----------|------------------|
| Retail Experience | 25 | Years and relevance of retail/customer-facing work |
| Availability | 20 | Full season, weekends, holidays, flexibility |
| Customer Service Evidence | 15 | Demonstrated customer interaction skills |
| Reliability Signals | 15 | Job tenure, punctuality mentions, references, consistency |
| Skills Match | 15 | POS experience, inventory, bilingual, certifications |
| Red Flag Deductions | -5 to -30 | Deductions for verified issues (see Section 5) |
| Bonus Factors | 0-10 | Leadership, certifications, notable achievements |
| **Base Maximum** | **90** | Without bonus or deductions |
| **Absolute Maximum** | **100** | Base + all bonuses, no deductions |
| **Floor** | **0** | Scores cannot go below zero |

**Important:** Each resume receives an exact point value per attribute (not a range). The rubric bands in Section 7 guide the designer; the ground truth answer key records the specific score assigned. All 50 resumes are scored in a spreadsheet before encoding the ground truth, to verify score gaps and distribution.

---

## 3. Resume Format

### 3.1 Text Format

All resumes are plain text (not PDF/images). Students copy-paste them into their pipeline. Each resume follows a realistic but varied format — some well-organized, some messy (this is intentional; the Parser must handle varied formatting).

### 3.2 Standard Resume Sections

Most resumes include some subset of:
- Name and contact info (email, phone, city/state — no full addresses)
- Objective or summary statement (some omit this)
- Work experience (job title, company, dates, bullet points)
- Education (school, degree/diploma, graduation date)
- Skills (listed or embedded in experience)
- Availability statement (some include, some don't)
- References (some say "available upon request," some list names)

### 3.3 Intentional Format Variation

To test Parser robustness:
- Some resumes use clean headers and bullet points
- Some use paragraph style with no clear sections
- Some mix date formats (Jan 2024 vs 01/2024 vs 2024)
- Some have typos or informal language
- Some are overly polished (potentially AI-generated — an easter egg)
- A few are very short (1-2 jobs) or very long (5+ jobs)

---

## 4. Practice Set Design (20 Resumes)

### 4.1 Purpose

Students use these on Day 8 to build and test their pipeline. They need a range of quality levels to verify their agents work correctly.

### 4.2 Distribution

| Category | Count | Score Range | Purpose |
|----------|-------|-------------|---------|
| Strong candidates | 4 | 75-95 | Pipeline should rank these high |
| Moderate candidates | 8 | 45-74 | Tests Evaluator discrimination |
| Weak candidates | 4 | 15-44 | Pipeline should rank these low |
| Red flag candidates | 2 | Varies (deductions) | Tests flag detection |
| Edge cases | 2 | Varies | Incomplete resume, unusual format |

### 4.3 Practice Set Does NOT Include

- Bias pairs (reserved for competition)
- Cross-resume hidden patterns (reserved for competition)
- The most subtle red flags (reserved for competition)

Practice resumes have straightforward signals so students can verify their pipeline produces sensible results before Day 9.

### 4.4 Self-Check Key

The lab page includes a collapsible "Answer Key" section for the practice set:
- Expected category (Strong/Moderate/Weak) for each resume
- Key attributes the Parser should extract
- Major red flags the Evaluator should catch
- Approximate score range (not exact scores — students' rubrics will differ)

This lets teams calibrate: "Is my pipeline roughly right?"

---

## 5. Competition Set Design (30 Resumes)

### 5.1 Purpose

Fresh, unseen resumes for the Day 9 scored competition. Hidden until instructor toggles visibility. Every resume has a definitive ground truth score.

### 5.2 Distribution

| Category | Count | Score Range | Notes |
|----------|-------|-------------|-------|
| Strong (top 10) | 10 | 70-95 | Clear hires, top 3 are unambiguous |
| Moderate (middle) | 10 | 40-69 | Hardest to rank; ±1-2 position swaps acceptable |
| Weak (bottom 5+) | 10 | 0-39 | Clear do-not-hires, bottom 3 are unambiguous |

Note: Red flag resumes (those carrying flag deductions) overlap with the above categories — they are not a separate group. A resume can be "strong but with one minor flag" or "weak AND flagged." See Section 5.5 for the master candidate roster.

### 5.3 Layered Complexity

The competition set embeds five layers of hidden complexity. Each layer corresponds to a scoring dimension.

**Layer 1: Surface Signals (supports Top 10 / Bottom 5 scoring)**
- Standard resume attributes: experience, skills, education, availability
- Well-designed resumes where the "right" ranking is defensible
- Top 3 have significantly more retail experience + full availability + strong references
- Bottom 3 have minimal experience + limited availability + concerning signals

**Layer 2: Red Flags (exactly 14 flags across the set)**

| Flag Type | Count | Severity | Example |
|-----------|-------|----------|---------|
| Fake institution | 2 | Disqualifying | "BS in Business, Pacific Northwest Business Institute" (doesn't exist) |
| Contradictory dates | 2 | Disqualifying | Overlapping employment at two full-time jobs |
| Inflated title | 2 | Minor | "Senior Regional Director" at a small coffee shop |
| Unexplained gap >1 year | 3 | Minor | No work listed for 14 months, no explanation |
| Fabricated employer | 2 | Disqualifying | Company claiming to be a major retailer that does not exist (not merely a small/closed business — those are legitimate) |
| Copy-paste work experience | 2 | Minor | Two candidates with word-for-word identical work experience bullets (distinct from the Layer 4 copy-paste skills *pattern*, which involves identical *skills sections* from a shared template) |
| Self-contradictory claims | 1 | Disqualifying | Claims 5 years experience but graduated 2 years ago |

**Important distinction:** "Copy-paste work experience" (Layer 2 red flag) = identical job description bullets suggesting fabrication. "Copy-paste skills section" (Layer 4 pattern) = identical skills paragraph suggesting a shared career center template. These are different observations and scored in different dimensions.

**Layer 3: Bias Pairs (5 pairs = 10 resumes)**

Each pair has nearly identical qualifications but different names suggesting different demographics. A well-designed pipeline should score them within 5 points of each other.

| Pair | Tests | Shared Profile | Names |
|------|-------|---------------|-------|
| 1 | Race/ethnicity | 2yr retail, part-time availability, some college | Marcus Henderson / Marcus Johnson |
| 2 | Race/ethnicity | 3yr customer service, full availability, bilingual | Sofia Rodriguez / Sophie Roberts |
| 3 | Race/ethnicity | No experience, full availability, strong references | Terrence Williams / Trevor Williams |
| 4 | Race/ethnicity | 1yr retail, weekends only, high school diploma | Aisha Patel / Ashley Patterson |
| 5 | Gender | 2yr retail + inventory, full season, associate degree | Alex Chen / Alexandra Chen |

Note: Bias pairs are embedded naturally in the full set — they aren't labeled or grouped together. Students must discover them. Names are designed to be signal-carrying but not cliched (avoid the most well-known bias-study names). Pair 5 tests gender bias through name context and gendered descriptions in work history (e.g., "he managed" vs. "she managed").

**Layer 4: Cross-Resume Patterns (3 patterns)**

| Pattern | Resumes Involved | What to Notice |
|---------|-----------------|----------------|
| Same career center | Candidates #8, #19, #27 | Identical resume formatting, same "Career Services, Northfield Community College" footer |
| Shared previous employer (bankrupt) | Candidates #5, #14, #31 | All worked at "Lakeside Goods" which closed in 2024 — explains employment gaps |
| Copy-paste skills section | Candidates #11, #22 | Word-for-word identical skills paragraph despite different backgrounds |

**Layer 5: Easter Eggs (2-3 subtle discoveries)**

- One resume that is clearly AI-generated (overly polished, generic buzzwords, suspiciously perfect formatting) — lists "prompt engineering" under hobbies
- One resume where the candidate's listed phone area code doesn't match their claimed city
- One resume where the "reference" listed is actually the candidate themselves with a slightly different name

### 5.4 Score Gap Design

To ensure top 3 and bottom 3 are unambiguous:

```
Position 1:  ~93 pts  ─┐
Position 2:  ~89 pts   ├─ Top 3: 8+ point gap to position 4
Position 3:  ~85 pts  ─┘
Position 4:  ~76 pts  ─┐
  ...                   ├─ Middle: close scores, ±1-2 swaps OK
Position 25: ~35 pts  ─┘
Position 28: ~20 pts  ─┐
Position 29: ~14 pts   ├─ Bottom 3: 10+ point gap from position 27
Position 30: ~8 pts   ─┘
```

All scores are verified in a spreadsheet against the rubric before encoding the ground truth. The gap design is confirmed only after all 30 resumes are scored.

### 5.5 Master Candidate Roster

Before generating resumes, create a roster assigning each of the 30 candidates an ID and marking their role(s):

| Column | Values |
|--------|--------|
| ID | C-01 through C-30 |
| Name | Candidate name |
| Category | Strong / Moderate / Weak |
| Ground Truth Score | Exact points |
| Ground Truth Rank | 1-30 |
| Bias Pair | None / Pair 1A / Pair 1B / etc. |
| Pattern Cluster | None / Pattern 1 / Pattern 2 / etc. |
| Red Flags | None / list of flags |
| Easter Egg | None / description |

**Rule:** No candidate should carry more than two special roles (e.g., bias pair + one red flag is OK; bias pair + pattern cluster + red flag is too many). This prevents individual resumes from being overloaded with hidden signals.

---

## 6. Ground Truth Answer Key

### 6.1 Structure

The ground truth is a JSON document used by the auto-scoring engine. **Candidates are identified by resume ID (C-01 through C-30), not by name.** This avoids name-matching failures from parser extraction differences (e.g., "Sofia M. Rodriguez" vs "Sofia Rodriguez").

The submission JSON also uses resume IDs. The lab and competition pages instruct students to include the resume ID in their pipeline output, and the copy-to-clipboard text includes the ID on the first line.

```json
{
  "candidate_map": {
    "C-01": "Maria Chen",
    "C-02": "James Park"
  },
  "top_10": [
    {"rank": 1, "id": "C-01", "score": 93, "key_reasons": ["...", "..."]},
    {"rank": 2, "id": "C-02", "score": 89, "key_reasons": ["...", "..."]}
  ],
  "bottom_5": [
    {"id": "C-30", "score": 8, "key_reasons": ["...", "..."]}
  ],
  "flags": [
    {
      "candidate_id": "C-07",
      "flag_keywords": ["fake", "institution", "pacific northwest"],
      "severity": "disqualifying",
      "detail": "Claims BS from Pacific Northwest Business Institute — does not exist"
    },
    {
      "candidate_id": "C-15",
      "flag_keywords": ["gap", "employment", "14 months"],
      "severity": "minor",
      "detail": "No work listed from Jan 2023 to Mar 2024"
    }
  ],
  "bias_pairs": [
    {
      "ids": ["C-04", "C-18"],
      "names": ["Marcus Henderson", "Marcus Johnson"],
      "shared_profile": "2yr retail, part-time",
      "observation_keywords": ["similar", "same", "identical", "matched", "comparable", "equal", "equivalent", "bias"]
    }
  ],
  "patterns": [
    {
      "keywords": ["northfield", "career center", "formatting", "footer"],
      "candidate_ids": ["C-08", "C-19", "C-27"],
      "description": "Same career center formatting from Northfield Community College"
    },
    {
      "keywords": ["lakeside", "closed", "bankrupt", "2024"],
      "candidate_ids": ["C-05", "C-14", "C-26"],
      "description": "Shared previous employer Lakeside Goods (closed 2024)"
    }
  ],
  "acceptability_windows": {
    "top_3_exact_positions": [1, 2, 3],
    "top_10_any_order": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "bottom_5_strict": ["C-26", "C-27", "C-28", "C-29", "C-30"],
    "bottom_8_partial": ["C-23", "C-24", "C-25", "C-26", "C-27", "C-28", "C-29", "C-30"]
  }
}
```

### 6.2 Scoring Rules (Mapped to Competition Dimensions)

All matching is **case-insensitive**. Candidate matching uses **resume IDs** (C-01 through C-30), not names.

**Top 10 Ranking (30 points):**
- 2.5 pts per correct candidate ID in the top 10 (set membership, regardless of position) = up to 25 pts
- Position accuracy bonus for top 3: +5 if all 3 exact, +2 if 2 exact, +1 if 1 exact

**Bottom 5 — Do Not Hire (10 points):**
- 2 pts per candidate ID in the ground truth bottom 5 (strict match)
- 1 pt per candidate ID in positions 23-27 (partial credit for "close but not bottom 5")
- Maximum 10 pts (cap at 5 strict matches)

**Red Flags + Severity (30 points total — scored in a single pass):**

Flags and severity are scored together because severity depends on correct flag detection. For each of the 14 ground truth flags:
- **Flag detected + correct severity:** ~2.14 pts (30/14, full credit)
- **Flag detected + wrong severity:** 1.0 pt (partial — flag correct, severity wrong)
- **Flag detected + vague description:** 1.0 pt (partial — right candidate, description missing key terms)
- **Flag not detected:** 0 pts
- 14 flags × 30/14 pts = **30 pts maximum** (exact)

Flag matching rule: the student's `flag` string must contain **at least one keyword** from the ground truth `flag_keywords` array for that flag, AND the `candidate_id` must match. All comparisons are lowercase. Keywords are substrings (e.g., "gap" matches "employment gap" and "14-month gap").

**Bias Pair Detection (15 points):**
- 3 pts per correctly identified pair (5 pairs × 3 pts = 15 pts)
- Both candidate IDs must appear together in a single `bias_pairs` entry
- The `observation` field must contain at least one keyword from the ground truth `observation_keywords` array (e.g., "similar," "same," "identical," "matched," "comparable," "equal," "equivalent," "bias")
- **Partial credit:** 1 pt if only one candidate ID is named with a correct bias observation (team noticed something but couldn't find the pair)

**Pattern Discovery (15 points):**
- 5 pts per correctly identified pattern (3 patterns × 5 pts = 15 pts)
- The pattern text must contain at least one keyword from the ground truth `keywords` array
- Must reference at least 2 of the involved candidate IDs
- 1 candidate ID referenced = 0 pts (must show the cross-resume connection)

**Score total:** 30 + 10 + 30 + 15 + 15 = **100 points**

### 6.3 Acceptability Windows

| Dimension | Full Credit | Partial Credit | Zero |
|-----------|------------|----------------|------|
| Top 3 positions | Exact position match (+5 for all 3) | +2 for 2 exact, +1 for 1 exact | None in correct position |
| Top 10 membership | Candidate ID in ground truth top 10 (2.5 pts) | N/A — set membership check | ID not in top 10 |
| Bottom 5 | ID in ground truth bottom 5 (2 pts) | ID in positions 23-27 (1 pt) | ID not in bottom 8 |
| Red flags | Correct ID + keyword match + correct severity (~2.14 pts) | Correct ID + keyword match + wrong/missing severity (1 pt) | Wrong ID or no keyword match |
| Bias pairs | Both IDs + observation keyword (3 pts) | One ID + observation keyword (1 pt) | No ID match |
| Patterns | 2+ IDs + keyword (5 pts) | N/A | <2 IDs or no keyword |

---

## 7. Resume Attribute Scoring Rubric

### 7.1 Retail Experience (0-25 points)

| Experience Level | Points | Description |
|-----------------|--------|-------------|
| 3+ years retail, supervisory | 22-25 | Extensive, directly relevant, leadership |
| 2-3 years retail | 16-21 | Solid retail background |
| 1-2 years retail or customer-facing | 10-15 | Some relevant experience |
| <1 year or only tangentially related | 4-9 | Minimal relevance |
| No work experience | 0-3 | Student, first job, career changer |

### 7.2 Availability (0-20 points)

| Availability | Points | Description |
|-------------|--------|-------------|
| Full season + weekends + holidays + flexible | 18-20 | Ideal seasonal hire |
| Full season + weekends | 13-17 | Strong availability |
| Partial season or weekdays only | 7-12 | Limited but workable |
| Very restricted (e.g., Tuesdays only) | 1-6 | Scheduling challenge |
| Not stated | 2 | Absence of availability info is a concern for seasonal hiring |

### 7.3 Customer Service Evidence (0-15 points)

| Level | Points | Description |
|-------|--------|-------------|
| Multiple roles with explicit customer interaction | 12-15 | Strong evidence |
| One customer-facing role or transferable skills | 7-11 | Moderate evidence |
| No direct evidence but plausible | 3-6 | Weak evidence |
| No evidence, non-customer roles only | 0-2 | Concern |

### 7.4 Reliability Signals (0-15 points)

| Signal | Points | Description |
|--------|--------|-------------|
| Long tenure (2+ yr at one employer), references listed | 12-15 | Strong reliability |
| Steady employment, no gaps | 8-11 | Good reliability |
| Some job hopping but explainable | 4-7 | Moderate |
| Frequent job changes, no references | 0-3 | Concern |

### 7.5 Skills Match (0-15 points)

| Skill Level | Points | Description |
|-------------|--------|-------------|
| POS + inventory + bilingual or certification + one other | 12-15 | Exceptional match |
| POS or inventory + one other | 8-11 | Strong match |
| General retail skills mentioned | 4-7 | Moderate |
| No relevant skills listed | 0-3 | Weak |

### 7.6 Red Flag Deductions (-5 to -30 points)

| Flag | Deduction | Severity |
|------|-----------|----------|
| Fake institution | -15 | Disqualifying |
| Contradictory dates | -10 | Disqualifying |
| Fabricated employer | -10 | Disqualifying |
| Self-contradictory claims | -15 | Disqualifying |
| Inflated title | -5 | Minor |
| Unexplained gap >1 year | -5 | Minor |
| Copy-paste work experience | -5 | Minor |

### 7.7 Bonus Factors (0-10 points)

| Factor | Points | Notes |
|--------|--------|-------|
| Supervisory/leadership experience | +4 | Must show actual leadership role, not just title |
| Relevant certification (first aid, food safety, etc.) | +3 | Documented certification relevant to retail |
| Notable achievement (employee of the month, etc.) | +3 | Specific, verifiable achievement |

Note: Bilingual ability is scored only in Skills Match (Section 7.5), not here. This avoids double-counting.

---

## 8. Implementation Notes

### 8.1 Resume Generation Approach

Generate resumes in batches by category:
1. First: create the master candidate roster (Section 5.5) — assign IDs, categories, roles
2. Second: design the 5 bias pairs (10 resumes) — these must be carefully matched
3. Third: design the 3 pattern clusters (7-9 resumes) — these share hidden connections
4. Fourth: design the red flag resumes (~10 resumes with embedded flags)
5. Fifth: fill remaining slots with "normal" resumes to hit distribution targets
6. Last: score all 30 resumes in a spreadsheet using the rubric, verify score gaps and distribution

### 8.2 Name Design

- Use diverse first/last name combinations representing varied backgrounds
- Avoid stereotypical name-to-background associations (except in bias pairs, where this is the point)
- No real people's names — all fictional
- Bias pair names are designed to be discoverable but not obvious (they aren't adjacent in the list)

### 8.3 Resume Numbering and ID-Based Submission

- Practice set: P-01 through P-20
- Competition set: C-01 through C-30
- Displayed in random order on the page (not sorted by score)
- **Copy-to-clipboard includes the resume ID on the first line** (e.g., `[C-01] Maria Chen`)
- Students are instructed to design their Parser to carry the resume ID through the pipeline
- The submission JSON uses resume IDs (not names) for all candidate references — this eliminates name-matching failures
- The lab documents this requirement explicitly in the "Submission Format" section

### 8.4 Pipeline Processing Time

Target: a team's pipeline should process all 30 competition resumes in 60-90 minutes (leaving time for analysis, pattern discovery, and submission). At ~2-3 minutes per resume in AI Studio sequential processing, 30 resumes takes 60-90 minutes. Teams with faster ADK pipelines will have more time for iteration.

The competition schedule (120-150 min) accounts for: pipeline processing (60-90 min) + analysis/pattern discovery (20-30 min) + submission attempts (10-20 min) + buffer.

### 8.5 Embedding in HTML

Resumes are embedded as collapsible cards in the lab (practice) and competition pages:

```html
<div class="resume-card" data-id="C-01" data-name="Maria Chen">
  <button class="resume-toggle">
    <span class="resume-id">C-01</span>
    <span class="resume-name">Maria Chen</span>
    <button class="copy-btn" data-target="resume-C-01">Copy</button>
  </button>
  <div class="resume-content" id="resume-C-01" style="display:none">
    <pre>Maria Chen
    Chicago, IL | maria.chen@email.com | (312) 555-0147
    ...</pre>
  </div>
</div>
```

### 8.6 Ground Truth Storage

The ground truth JSON is obfuscated (base64 + split across variables) and embedded in `capstone-firebase.js`. It is NOT stored in the HTML or visible to students.

---

## 9. Acceptance Criteria

### 9.1 Practice Set
- [ ] 20 resumes with varied quality levels
- [ ] Distribution: 4 strong, 8 moderate, 4 weak, 2 red flag, 2 edge case
- [ ] Each resume has realistic formatting, varied styles
- [ ] Self-check answer key available (collapsible)
- [ ] All resumes have copy-to-clipboard buttons (including resume ID on first line)
- [ ] No bias pairs or hidden patterns (reserved for competition)

### 9.2 Competition Set
- [ ] 30 resumes with definitive ground truth scores (exact points, not ranges)
- [ ] Master candidate roster created with role assignments (Section 5.5)
- [ ] Score gaps: top 3 at least 8 pts above position 4; bottom 3 at least 10 pts below position 27
- [ ] All scores verified in spreadsheet before encoding ground truth
- [ ] Score floor: no resume below 0 points
- [ ] 14 red flags embedded (mix of minor and disqualifying)
- [ ] 5 bias pairs (10 resumes with matched qualifications, including 1 gender pair)
- [ ] 3 cross-resume patterns (7-9 resumes involved)
- [ ] 2-3 easter eggs (unscored)
- [ ] No candidate carries more than 2 special roles
- [ ] Hidden until instructor toggle

### 9.3 Ground Truth
- [ ] All candidates identified by resume ID (C-01 through C-30), not names
- [ ] Exact point values per resume (not rubric ranges)
- [ ] Answer key JSON matches the scoring engine schema (Section 6.1)
- [ ] Keyword synonym lists defined for all 14 flags
- [ ] Observation keyword list defined for bias pair matching
- [ ] Pattern keyword lists defined for all 3 patterns
- [ ] Flags + severity scored in single pass (not independent)
- [ ] Competition dimensions sum to exactly 100 points
- [ ] Acceptability windows defined for all dimensions with partial credit rules

### 9.4 Beacon Consistency
- [ ] All resumes are realistic for seasonal retail positions
- [ ] Job posting matches Beacon's established profile (25 stores, regional chain)
- [ ] Experience levels appropriate for $16-19/hr seasonal roles
- [ ] No references to industries or roles that don't fit Beacon's context

---

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Resumes feel formulaic or repetitive | Medium | Medium | Vary format, length, tone, and detail level. Some polished, some rough. |
| Ground truth scoring is disputed | Low | Medium | Point-based rubric is transparent and reproducible. Publish rubric after competition. |
| Bias pairs are too obvious | Medium | Medium | Scatter pairs in the list (not adjacent). Use subtle name differences, not stereotypes. |
| Red flags are too easy to spot | Low | Low | Mix obvious flags with subtle ones. The disqualifying flags are clear; minor ones require careful reading. |
| 50 resumes is too many to manage | Low | Medium | Batch generation. Spreadsheet tracking for scores. Master roster (Section 5.5). |
| Pipeline too slow for 30 competition resumes | Medium | High | Target 2-3 min/resume. 30 resumes = 60-90 min, within competition window. |
| Student pipelines can't handle format variation | Medium | Medium | Practice set includes format variety so students can fix their Parser on Day 8. |

---

## 11. Approval

**Status:** Complete

### Implementation Notes
- 20 practice resumes (P-01 to P-20) generated with answer key: 5 Strong, 10 Moderate, 5 Weak
- 30 competition resumes (C-01 to C-30) generated with full ground truth scoring
- 14 red flags embedded: fake institutions (C-13, C-30), fabricated employers (C-29), inflated titles (C-02, C-10), unexplained gaps, contradictory dates, copy-paste bullets, self-contradictory claims
- 5 bias pairs embedded across competition set including gender pair (C-09/C-16)
- 3 cross-resume patterns: Northfield career center (C-08/C-19/C-27), Lakeside Goods employer (C-05/C-14/C-07), copy-paste work experience (C-15/C-25)
- Ground truth stored in dataset/ground-truth.json and obfuscated in capstone-firebase.js
- 59 automated tests verify resume data integrity, hidden patterns, and red flag presence
- Scoring math uses 30/14 per flag (~2.14 pts) ensuring 14 perfect flags = exactly 30.0 points

---

*End of Specification*
