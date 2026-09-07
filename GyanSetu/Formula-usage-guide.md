GyanSetu Formula Module Documentation

Module: "gyansetu_formulas.py"
Purpose: Centralized mathematical calculation module for the GyanSetu application.

---

1. Module Overview

The "gyansetu_formulas.py" module contains the core mathematical formulas used throughout the GyanSetu competency assessment and recommendation pipeline.

The module is intentionally designed as a pure calculation layer.

It should:

- Accept validated numerical inputs.
- Perform mathematical calculations.
- Return calculated results.
- Raise clear exceptions when invalid input is provided.
- Remain independent of the database, API, LLM, frontend, authentication, and course repository.

Core GyanSetu Flow

Role / Job Requirement
        |
        v
Required Competencies
        |
        v
Sub-Competencies
        |
        v
Diagnostic Question Generation
        |
        v
User Answers
        |
        v
Sub-Competency Scores
        |
        v
Competency Scores
        |
        v
Current Proficiency Level
        |
        v
Proficiency Gap
        |
        v
Learning Priority
        |
        v
Course Recommendation
        |
        v
Learning
        |
        v
Reassessment
        |
        v
Learning Improvement

---

2. File Structure

The recommended GyanSetu backend structure is:

GyanSetu/
│
├── backend/
│   │
│   ├── assessment/
│   │   ├── question_generator.py
│   │   └── scoring_engine.py
│   │
│   ├── competency/
│   │   ├── competency_engine.py
│   │   └── gap_analyzer.py
│   │
│   ├── recommendation/
│   │   └── recommendation_engine.py
│   │
│   ├── utils/
│   │   └── gyansetu_formulas.py
│   │
│   └── ...
│
└── ...

---

3. Responsibility of "gyansetu_formulas.py"

The formula module is responsible only for mathematical operations.

It SHOULD handle:

- Question count calculation
- Sub-competency scoring
- Competency scoring
- Overall assessment scoring
- Proficiency gap calculation
- Learning improvement calculation
- Relative learning improvement
- Initial course recommendation priority

It SHOULD NOT handle:

- Database operations
- User authentication
- API requests
- LLM calls
- Question generation
- Course searching
- Course ranking using external data
- Frontend operations
- User sessions
- File handling

These responsibilities belong to other GyanSetu modules.

---

4. Function Reference

Function| Primary Use
"calculate_diagnostic_question_count()"| Determine assessment question count
"calculate_subcompetency_score()"| Calculate individual sub-competency score
"calculate_competency_score()"| Aggregate sub-competency scores
"calculate_overall_assessment_score()"| Calculate overall assessment score
"calculate_proficiency_gap()"| Determine required vs current proficiency gap
"calculate_learning_improvement()"| Calculate absolute improvement
"calculate_relative_learning_improvement()"| Calculate relative improvement
"calculate_course_recommendation_priority()"| Calculate initial learning priority

---

5. "calculate_diagnostic_question_count()"

Purpose

Determines the number of diagnostic questions that should be generated based on the number of sub-competencies.

The number of questions is always rounded up to a multiple of 10.

Formula

Questions = ceil(Sub-competencies / 10) × 10

Function

calculate_diagnostic_question_count(
    gyansetu_subcompetency_count: int
) -> int

Input

"gyansetu_subcompetency_count"

Type:

int

Meaning:

Number of sub-competencies included in the diagnostic assessment.

Valid examples:

7
10
17
25
31

Output

Type:

int

Examples

7  → 10 questions
10 → 10 questions
17 → 20 questions
25 → 30 questions
31 → 40 questions

Exceptions

"ValueError"

Raised when:

gyansetu_subcompetency_count < 0

Example:

calculate_diagnostic_question_count(-5)

Result:

ValueError

Zero Input

If:

gyansetu_subcompetency_count = 0

the function returns:

0

---

6. "calculate_subcompetency_score()"

Purpose

Calculates the demonstrated score for an individual sub-competency.

Formula

Sub-competency Score =
(Correct Answers / Total Questions) × 100

Function

calculate_subcompetency_score(
    gyansetu_correct_answers: int,
    gyansetu_total_questions: int
) -> float

Inputs

"gyansetu_correct_answers"

Type:

int

Number of correctly answered questions.

"gyansetu_total_questions"

Type:

int

Total number of questions associated with the sub-competency.

Output

Type:

float

The returned value represents a percentage.

Example:

3 / 4 × 100 = 75.0

Exceptions

"ValueError"

Raised when total questions are zero or negative.

calculate_subcompetency_score(3, 0)

"ValueError"

Raised when correct answers are negative.

calculate_subcompetency_score(-1, 4)

"ValueError"

Raised when correct answers exceed total questions.

calculate_subcompetency_score(5, 4)

Unexpected Input Considerations

The function expects integer answer counts.

Inputs such as:

"3"
None
3.5

should be rejected by the application validation layer before calling the function.

---

7. "calculate_competency_score()"

Purpose

Calculates a competency-level score from multiple sub-competency scores.

Formula

Competency Score =
Sum of Sub-competency Scores
/
Number of Sub-competencies

Function

calculate_competency_score(
    gyansetu_subcompetency_scores: list[float]
) -> float

Input

"gyansetu_subcompetency_scores"

Type:

list[float]

A list containing the scores of all sub-competencies belonging to one competency.

Example:

[80.0, 60.0, 70.0]

Output

Type:

float

Example:

[80, 60, 70]

→ 70.0

Exceptions

"ValueError"

Raised when the list is empty.

calculate_competency_score([])

"ValueError"

Raised when any score is outside the valid range:

0–100

Example:

calculate_competency_score([80, 60, 120])

Unexpected Input Considerations

The function expects numerical scores.

Invalid examples include:

["80", "60", "70"]

[80, None, 70]

[80, "invalid", 70]

The validation/service layer should ensure correct data types before calculation.

---

8. "calculate_overall_assessment_score()"

Purpose

Calculates a single overall score from all competency-level scores.

This is a high-level assessment metric.

It should NOT replace individual competency and sub-competency scores for gap analysis.

Formula

Overall Score =
Sum of Competency Scores
/
Number of Competencies

Function

calculate_overall_assessment_score(
    gyansetu_competency_scores: list[float]
) -> float

Input

Type:

list[float]

Example:

[70.0, 80.0, 60.0]

Output

Type:

float

Example:

70.0

Exceptions

"ValueError"

Raised when no competency scores are supplied.

calculate_overall_assessment_score([])

"ValueError"

Raised when a score is outside:

0–100

Example:

calculate_overall_assessment_score([70, 80, 110])

---

9. "calculate_proficiency_gap()"

Purpose

Calculates the difference between the proficiency required by a target role and the user's current proficiency.

Formula

Gap = Required Level - Current Level

Proficiency Levels

Level| Meaning
1| Basic
2| Developing
3| Proficient
4| Advanced

Function

calculate_proficiency_gap(
    gyansetu_required_proficiency_level: int,
    gyansetu_current_proficiency_level: int
) -> int

Inputs

Both inputs must be:

int

and must fall between:

1–4

Required Level

Represents the proficiency required by the target role.

Current Level

Represents the user's current demonstrated proficiency.

Output

Type:

int

Example

Required = 3
Current  = 2

Gap = 3 - 2

Gap = 1

Interpretation

Gap > 0

The user has a learning gap.

Gap = 0

The user meets the required proficiency.

Gap < 0

The user exceeds the required proficiency.

The application can optionally normalize this to:

Gap <= 0 → No Learning Gap

Exceptions

"ValueError"

Raised if required proficiency is outside:

1–4

"ValueError"

Raised if current proficiency is outside:

1–4

---

10. "calculate_learning_improvement()"

Purpose

Calculates the absolute improvement between the initial diagnostic assessment and reassessment.

Formula

Improvement =
New Score - Old Score

Function

calculate_learning_improvement(
    gyansetu_old_score: float,
    gyansetu_new_score: float
) -> float

Inputs

Both values must be:

float

or compatible numerical values.

Valid score range:

0–100

"gyansetu_old_score"

Score before learning.

"gyansetu_new_score"

Score after learning/reassessment.

Output

Type:

float

The result is measured in percentage points.

Example

Old Score = 65
New Score = 82

Improvement = 82 - 65

Improvement = 17 percentage points

Exceptions

"ValueError"

Raised when the old score is outside:

0–100

"ValueError"

Raised when the new score is outside:

0–100

Important

The result may be negative.

Example:

Old = 80
New = 70

Improvement = -10

This indicates a decrease in demonstrated performance.

The function should not automatically convert negative improvement to zero because the decrease itself is meaningful assessment data.

---

11. "calculate_relative_learning_improvement()"

Purpose

Calculates improvement relative to the user's original score.

Formula

Relative Improvement =
((New Score - Old Score) / Old Score) × 100

Function

calculate_relative_learning_improvement(
    gyansetu_old_score: float,
    gyansetu_new_score: float
) -> float

Inputs

"gyansetu_old_score"

Type:

float

Score before learning.

"gyansetu_new_score"

Type:

float

Score after learning.

Valid score range:

0–100

Output

Type:

float

Example

Old Score = 65
New Score = 82

Relative Improvement =
((82 - 65) / 65) × 100

= 26.15%

Exceptions

"ValueError"

Raised when either score is outside:

0–100

"ValueError"

Raised when the old score is:

0

because division by zero is undefined.

Example:

calculate_relative_learning_improvement(0, 50)

---

12. "calculate_course_recommendation_priority()"

Purpose

Calculates the initial learning priority of a competency or sub-competency.

Formula

Priority =
Proficiency Gap × Competency Importance

Function

calculate_course_recommendation_priority(
    gyansetu_proficiency_gap: int,
    gyansetu_competency_importance: float
) -> float

Inputs

"gyansetu_proficiency_gap"

Type:

int

The proficiency gap calculated by:

calculate_proficiency_gap()

"gyansetu_competency_importance"

Type:

float

Importance of the competency/sub-competency for the target role.

Example:

1 = Low importance
2 = Moderate importance
3 = High importance

The exact importance scale should be defined by the GyanSetu recommendation design.

Output

Type:

float

Example

Gap = 2
Importance = 3

Priority = 2 × 3

Priority = 6

Higher priority indicates a stronger candidate for learning intervention.

Exceptions

"ValueError"

Raised when competency importance is negative.

Negative Gap Handling

If the user exceeds the required proficiency:

Gap < 0

the function normalizes the gap to:

0

This prevents an already-satisfied competency from receiving a negative learning priority.

---

13. Function Dependency Map

The formulas have a logical dependency structure.

calculate_diagnostic_question_count()
                    |
                    v
          Diagnostic Assessment
                    |
                    v
calculate_subcompetency_score()
                    |
                    v
calculate_competency_score()
                    |
                    +--------------------+
                    |                    |
                    v                    v
      Overall Assessment Score    Current Proficiency
                                         |
                                         v
                         calculate_proficiency_gap()
                                         |
                                         v
                  calculate_course_recommendation_priority()
                                         |
                                         v
                              Course Recommendation
                                         |
                                         v
                                      Learning
                                         |
                                         v
                                   Reassessment
                                         |
                                         v
                         calculate_learning_improvement()
                                         |
                                         v
                   calculate_relative_learning_improvement()

---

14. Input and Output Summary

Function| Main Input| Output
"calculate_diagnostic_question_count"| "int"| "int"
"calculate_subcompetency_score"| "int", "int"| "float"
"calculate_competency_score"| "list[float]"| "float"
"calculate_overall_assessment_score"| "list[float]"| "float"
"calculate_proficiency_gap"| "int", "int"| "int"
"calculate_learning_improvement"| "float", "float"| "float"
"calculate_relative_learning_improvement"| "float", "float"| "float"
"calculate_course_recommendation_priority"| "int", "float"| "float"

---

15. General Validation Rules

The formula module currently assumes the following valid ranges.

Assessment Scores

0 ≤ Score ≤ 100

Proficiency Levels

1 ≤ Level ≤ 4

Correct Answers

0 ≤ Correct Answers ≤ Total Questions

Total Questions

Total Questions > 0

Competency Importance

Importance ≥ 0

---

16. Common Unexpected Errors

Although the functions perform their own basic validation, the surrounding GyanSetu application should validate data before calling them.

Potential unexpected inputs include:

Wrong data type

"80"

instead of:

80.0

Missing value

None

Empty collection

[]

Negative score

-20

Score greater than 100

120

Invalid proficiency level

5

Correct answers greater than questions

Correct = 8
Questions = 5

Division by zero

Possible in:

Total Questions = 0

or:

Old Score = 0

for relative improvement.

---

17. Recommended Error Handling

The formula module should raise errors rather than silently producing incorrect results.

Example:

try:
    gyansetu_score = calculate_subcompetency_score(
        gyansetu_correct_answers=3,
        gyansetu_total_questions=4
    )

except ValueError as gyansetu_error:
    print(f"Invalid assessment data: {gyansetu_error}")

The higher-level GyanSetu service layer should decide how these errors are presented to the user or logged by the application.

---

18. Important Architectural Rule

The formula module should remain stateless.

It should not store:

User data
Assessment data
Course data
Database records
LLM responses
Session information

Instead:

Input Data
    ↓
Formula Function
    ↓
Calculated Result

This makes the module:

- Easy to test
- Easy to reuse
- Easy to import
- Easy to debug
- Independent of the database
- Independent of the LLM
- Suitable for unit testing
- Suitable for future API integration

---

19. Future Formula Extension

The current recommendation priority formula:

Priority = Gap × Importance

is intentionally simple.

The final GyanSetu recommendation engine may eventually incorporate additional factors:

Priority =
Gap
×
Role Importance
×
Course Relevance
×
Prerequisite Importance
×
Learning Efficiency

However, these factors should be introduced only after the recommendation methodology is finalized.

Similarly, the conversion:

Percentage Score → Proficiency Level 1–4

is not defined by this module yet.

A future function could be introduced separately, for example:

convert_score_to_proficiency_level()

after validated proficiency thresholds are established.

---

20. Current Core Formula Set

The current GyanSetu mathematical foundation consists of:

1. Question Count

Q = ceil(Sub-competencies / 10) × 10


2. Sub-Competency Score

Sₛ = (Correct / Total) × 100


3. Competency Score

S꜀ = Σ Sub-Scores / Number of Sub-Competencies


4. Overall Assessment Score

Soverall = Σ Competency Scores / Number of Competencies


5. Proficiency Gap

Gap = Required Level - Current Level


6. Learning Improvement

Improvement = New Score - Old Score


7. Relative Improvement

Relative Improvement =
((New Score - Old Score) / Old Score) × 100


8. Course Recommendation Priority

Priority = Gap × Importance

---

21. Module Import Reference

Individual function import:

from gyansetu_formulas import calculate_subcompetency_score

Multiple function import:

from gyansetu_formulas import (
    calculate_diagnostic_question_count,
    calculate_subcompetency_score,
    calculate_competency_score,
    calculate_overall_assessment_score,
    calculate_proficiency_gap,
    calculate_learning_improvement,
    calculate_relative_learning_improvement,
    calculate_course_recommendation_priority
)

---

22. Final Design Principle

"gyansetu_formulas.py" should be treated as the mathematical foundation of the GyanSetu competency engine, not as the competency engine itself.

The responsibility separation should remain:

Question Generator
        ↓
Scoring Engine
        ↓
gyansetu_formulas.py
        ↓
Competency / Gap Engine
        ↓
Recommendation Engine
        ↓
Reassessment
        ↓
gyansetu_formulas.py

This separation ensures that changes to the mathematical formulas do not require rewriting the entire GyanSetu backend.
