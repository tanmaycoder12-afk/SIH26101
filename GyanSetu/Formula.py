"""
GyanSetu Mathematical Formula Module
====================================

This module contains the core mathematical formulas used in GyanSetu's:

1. Diagnostic assessment question generation
2. Sub-competency scoring
3. Competency scoring
4. Overall assessment scoring
5. Proficiency gap analysis
6. Learning improvement measurement
7. Course recommendation priority

All functions are independent and can be imported individually.

Example:
    from gyansetu_formulas import calculate_subcompetency_score

    result = calculate_subcompetency_score(
        gyansetu_correct_answers=3,
        gyansetu_total_questions=4
    )
"""


# ============================================================
# 1. QUESTION COUNT FORMULA
# ============================================================

def calculate_diagnostic_question_count(gyansetu_subcompetency_count: int) -> int:
    """
    Calculate the number of diagnostic questions.

    Formula:
        Questions = ceil(Number of Sub-competencies / 10) * 10

    The result is always a multiple of 10.

    Args:
        gyansetu_subcompetency_count:
            Number of sub-competencies in the assessment.

    Returns:
        Total number of diagnostic questions.

    Examples:
        7  -> 10
        17 -> 20
        25 -> 30
        31 -> 40
    """

    if gyansetu_subcompetency_count < 0:
        raise ValueError("Sub-competency count cannot be negative.")

    if gyansetu_subcompetency_count == 0:
        return 0

    gyansetu_question_count = (
        (gyansetu_subcompetency_count + 9) // 10
    ) * 10

    return gyansetu_question_count


# ============================================================
# 2. SUB-COMPETENCY SCORE
# ============================================================

def calculate_subcompetency_score(
    gyansetu_correct_answers: int,
    gyansetu_total_questions: int
) -> float:
    """
    Calculate the demonstrated score for a sub-competency.

    Formula:
        Sub-competency Score =
        (Correct Answers / Total Questions) * 100

    Args:
        gyansetu_correct_answers:
            Number of correct answers for the sub-competency.

        gyansetu_total_questions:
            Total questions associated with the sub-competency.

    Returns:
        Sub-competency score as a percentage.

    Example:
        3 correct out of 4 questions -> 75.0
    """

    if gyansetu_total_questions <= 0:
        raise ValueError("Total questions must be greater than zero.")

    if gyansetu_correct_answers < 0:
        raise ValueError("Correct answers cannot be negative.")

    if gyansetu_correct_answers > gyansetu_total_questions:
        raise ValueError(
            "Correct answers cannot exceed total questions."
        )

    gyansetu_subcompetency_score = (
        gyansetu_correct_answers
        / gyansetu_total_questions
    ) * 100

    return round(gyansetu_subcompetency_score, 2)


# ============================================================
# 3. COMPETENCY SCORE
# ============================================================

def calculate_competency_score(
    gyansetu_subcompetency_scores: list[float]
) -> float:
    """
    Calculate the competency score from its sub-competency scores.

    Formula:
        Competency Score =
        Sum of Sub-competency Scores
        / Number of Sub-competencies

    Args:
        gyansetu_subcompetency_scores:
            List of scores belonging to the competency.

    Returns:
        Competency score as a percentage.

    Example:
        [80, 60, 70] -> 70.0
    """

    if not gyansetu_subcompetency_scores:
        raise ValueError(
            "At least one sub-competency score is required."
        )

    for gyansetu_subcompetency_score in gyansetu_subcompetency_scores:
        if not 0 <= gyansetu_subcompetency_score <= 100:
            raise ValueError(
                "Sub-competency scores must be between 0 and 100."
            )

    gyansetu_subcompetency_count = len(
        gyansetu_subcompetency_scores
    )

    gyansetu_competency_score = (
        sum(gyansetu_subcompetency_scores)
        / gyansetu_subcompetency_count
    )

    return round(gyansetu_competency_score, 2)


# ============================================================
# 4. OVERALL ASSESSMENT SCORE
# ============================================================

def calculate_overall_assessment_score(
    gyansetu_competency_scores: list[float]
) -> float:
    """
    Calculate the overall assessment score.

    Formula:
        Overall Score =
        Sum of Competency Scores
        / Number of Competencies

    Args:
        gyansetu_competency_scores:
            List of competency-level scores.

    Returns:
        Overall assessment score as a percentage.

    Example:
        [70, 80, 60] -> 70.0
    """

    if not gyansetu_competency_scores:
        raise ValueError(
            "At least one competency score is required."
        )

    for gyansetu_competency_score in gyansetu_competency_scores:
        if not 0 <= gyansetu_competency_score <= 100:
            raise ValueError(
                "Competency scores must be between 0 and 100."
            )

    gyansetu_competency_count = len(
        gyansetu_competency_scores
    )

    gyansetu_overall_assessment_score = (
        sum(gyansetu_competency_scores)
        / gyansetu_competency_count
    )

    return round(gyansetu_overall_assessment_score, 2)


# ============================================================
# 5. PROFICIENCY GAP
# ============================================================

def calculate_proficiency_gap(
    gyansetu_required_proficiency_level: int,
    gyansetu_current_proficiency_level: int
) -> int:
    """
    Calculate the proficiency gap.

    Formula:
        Gap = Required Level - Current Level

    Proficiency levels:
        1 = Basic
        2 = Developing
        3 = Proficient
        4 = Advanced

    Args:
        gyansetu_required_proficiency_level:
            Level required by the target role.

        gyansetu_current_proficiency_level:
            User's current demonstrated proficiency level.

    Returns:
        Proficiency gap.

        Positive value  -> User has a gap.
        Zero            -> User meets the requirement.
        Negative value  -> User exceeds the requirement.

    Example:
        Required = 3
        Current  = 2

        Gap = 3 - 2 = 1
    """

    if not 1 <= gyansetu_required_proficiency_level <= 4:
        raise ValueError(
            "Required proficiency level must be between 1 and 4."
        )

    if not 1 <= gyansetu_current_proficiency_level <= 4:
        raise ValueError(
            "Current proficiency level must be between 1 and 4."
        )

    gyansetu_proficiency_gap = (
        gyansetu_required_proficiency_level
        - gyansetu_current_proficiency_level
    )

    return gyansetu_proficiency_gap


# ============================================================
# 6. LEARNING IMPROVEMENT
# ============================================================

def calculate_learning_improvement(
    gyansetu_old_score: float,
    gyansetu_new_score: float
) -> float:
    """
    Calculate absolute improvement after learning.

    Formula:
        Improvement = New Score - Old Score

    The result is measured in percentage points.

    Args:
        gyansetu_old_score:
            Score before learning/recommended courses.

        gyansetu_new_score:
            Score after learning/reassessment.

    Returns:
        Improvement in percentage points.

    Example:
        Old Score = 65
        New Score = 82

        Improvement = 17 percentage points
    """

    if not 0 <= gyansetu_old_score <= 100:
        raise ValueError("Old score must be between 0 and 100.")

    if not 0 <= gyansetu_new_score <= 100:
        raise ValueError("New score must be between 0 and 100.")

    gyansetu_learning_improvement = (
        gyansetu_new_score - gyansetu_old_score
    )

    return round(gyansetu_learning_improvement, 2)


# ============================================================
# 7. RELATIVE LEARNING IMPROVEMENT
# ============================================================

def calculate_relative_learning_improvement(
    gyansetu_old_score: float,
    gyansetu_new_score: float
) -> float:
    """
    Calculate relative improvement after learning.

    Formula:
        Relative Improvement =
        ((New Score - Old Score) / Old Score) * 100

    Args:
        gyansetu_old_score:
            Score before learning.

        gyansetu_new_score:
            Score after learning/reassessment.

    Returns:
        Relative improvement as a percentage.

    Example:
        Old Score = 65
        New Score = 82

        Relative Improvement = 26.15%
    """

    if not 0 <= gyansetu_old_score <= 100:
        raise ValueError("Old score must be between 0 and 100.")

    if not 0 <= gyansetu_new_score <= 100:
        raise ValueError("New score must be between 0 and 100.")

    if gyansetu_old_score == 0:
        raise ValueError(
            "Relative improvement cannot be calculated "
            "when the old score is zero."
        )

    gyansetu_relative_improvement = (
        (
            gyansetu_new_score
            - gyansetu_old_score
        )
        / gyansetu_old_score
    ) * 100

    return round(gyansetu_relative_improvement, 2)


# ============================================================
# 8. COURSE RECOMMENDATION PRIORITY
# ============================================================

def calculate_course_recommendation_priority(
    gyansetu_proficiency_gap: int,
    gyansetu_competency_importance: float
) -> float:
    """
    Calculate initial learning priority.

    Formula:
        Priority = Gap * Importance

    This is the initial/simple recommendation formula.
    The final GyanSetu recommendation engine may later
    include additional factors.

    Args:
        gyansetu_proficiency_gap:
            Calculated proficiency gap.

        gyansetu_competency_importance:
            Importance of the competency/sub-competency
            for the user's target role.

    Returns:
        Learning priority score.

    Example:
        Gap = 2
        Importance = 3

        Priority = 6
    """

    if gyansetu_proficiency_gap < 0:
        gyansetu_proficiency_gap = 0

    if gyansetu_competency_importance < 0:
        raise ValueError(
            "Competency importance cannot be negative."
        )

    gyansetu_recommendation_priority = (
        gyansetu_proficiency_gap
        * gyansetu_competency_importance
    )

    return round(gyansetu_recommendation_priority, 2)
