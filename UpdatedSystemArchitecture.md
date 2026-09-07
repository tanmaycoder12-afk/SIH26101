

# GyanSetu — Updated Architecture

```text
                         ┌──────────────────────────────┐
                         │      CONTENT / RESEARCH      │
                         └──────────────┬───────────────┘
                                        │
                              Books / Learning Material
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │         PROMPT 1             │
                         │   Chapter & Topic Analysis   │
                         │                              │
                         │ • Chapter                    │
                         │ • Major Topics               │
                         │ • Important Subtopics        │
                         │ • Importance                 │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │         PROMPT 2             │
                         │      Question Generation     │
                         │                              │
                         │ Per Chapter:                 │
                         │ • 1 × Level 1                │
                         │ • 1 × Level 2                │
                         │ • 1 × Level 3                │
                         │ • 1 × Level 4                │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │         PROMPT 3             │
                         │ Competency Classification    │
                         │                              │
                         │ Question → Core Competency  │
                         └──────────────┬───────────────┘
                                        │
                              Human Verification
                                        │
                                        ▼
                    ┌────────────────────────────────────────┐
                    │        PRODUCTION QUESTION BANK        │
                    │                                        │
                    │ • Question                              │
                    │ • Options                               │
                    │ • Correct Answer                        │
                    │ • Level (1–4)                           │
                    │ • Competency                            │
                    └──────────────────┬─────────────────────┘
                                       │
                                       │
═══════════════════════════════════════╪══════════════════════════════════════
                                       │
                                       ▼
                         ┌──────────────────────────────┐
                         │        EMPLOYEE SIDE         │
                         └──────────────┬───────────────┘
                                        │
                              Registration / Login
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │          EMPLOYEE             │
                         │           PROFILE            │
                         │                              │
                         │ Organization: MoSPI          │
                         │ Current Role                 │
                         │ Employee ID                  │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │      ROLE REQUIREMENTS       │
                         │                              │
                         │ Required Competencies        │
                         │ Required Level (1–4)         │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │      BASELINE ASSESSMENT     │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                  ┌──────────────────────────────────────────┐
                  │ BACKEND SELECTS CANDIDATE QUESTION BLOCKS│
                  │                                          │
                  │ Filter by:                               │
                  │ • Required competency                    │
                  │ • Level                                  │
                  │ • Available questions                     │
                  │                                          │
                  │ Backend does NOT select the final quiz.   │
                  └─────────────────────┬────────────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │             AI               │
                         │      QUIZ ASSEMBLY           │
                         │                              │
                         │ Receives ONLY supplied       │
                         │ candidate question blocks    │
                         │                              │
                         │ • Selects balanced questions │
                         │ • Avoids duplicates          │
                         │ • Avoids near-duplicates     │
                         │ • Maintains competency       │
                         │   & level coverage           │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │      BACKEND VALIDATION      │
                         │                              │
                         │ ✓ Correct question count     │
                         │ ✓ Valid question IDs         │
                         │ ✓ Required competencies      │
                         │ ✓ Required levels            │
                         │ ✓ No duplicates              │
                         │ ✓ All questions from pool    │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │        STANDARDIZED           │
                         │         ASSESSMENT            │
                         │                              │
                         │ Employee answers questions   │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │       BACKEND SCORING        │
                         │                              │
                         │ Deterministic scoring        │
                         │ No AI involvement            │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │      COMPETENCY PROFILE      │
                         │                              │
                         │ Competency → Current Level  │
                         │                              │
                         │ L1 Foundation                │
                         │ L2 Working                   │
                         │ L3 Proficient               │
                         │ L4 Advanced                 │
                         │                              │
                         │ Unassessed = NULL            │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │        GAP ANALYSIS          │
                         │                              │
                         │ Required Level               │
                         │          −                   │
                         │ Current Level                │
                         │          =                   │
                         │ Competency Gap               │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │       AI RECOMMENDATION      │
                         │                              │
                         │ Uses factual DB data:        │
                         │ • Competency gaps            │
                         │ • Current level              │
                         │ • Role requirements          │
                         │ • Existing resources         │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                    ┌────────────────────────────────────────┐
                    │          LEARNING RESOURCES             │
                    │                                        │
                    │ Existing verified resources            │
                    │                                        │
                    │ MVP: NPTEL                             │
                    │ Fixed pool of 21 courses               │
                    └───────────────────┬────────────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │       EXTERNAL LEARNING      │
                         │                              │
                         │ Employee learns on external  │
                         │ platform                    │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │       LEARNING PROGRESS      │
                         │                              │
                         │ Not Started                  │
                         │ Started                      │
                         │ Completed                   │
                         │                              │
                         │ MVP: self-reported           │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │       REASSESSMENT           │
                         └──────────────┬───────────────┘
                                        │
                                        └──────────────►
                                             Updated
                                       Competency Profile
```

## Separate Self-Learning Mode

This remains **separate from the official competency assessment**:

```text
              Employee-provided Material
                         │
                         ▼
                ┌─────────────────┐
                │       AI        │
                │                 │
                │ Analyze Material│
                │ Generate Practice│
                │ Adapt Difficulty│
                └────────┬────────┘
                         │
                         ▼
                Adaptive Practice
                         │
                         ▼
                  Learning Support
                         │
                         X
                         │
              DOES NOT MODIFY OFFICIAL
               COMPETENCY PROFILE
```

This separation is important: **Self-Learning Mode can be adaptive and experimental, while the official assessment remains controlled and evidence-based.**

---

# Database Architecture

```text
organizations
      │
      ▼
    roles
      │
      ├──────────────► role_competencies ◄────────────── competencies
      │
      ▼
employee_profiles
      │
      ▼
assessments
      │
      ▼
assessment_results ───────────────► competencies


competencies
      │
      ▼
resource_competencies ◄──────── learning_resources
                                      │
                                      ▼
                               learning_progress


competencies ◄──────────── ai_recommendations
```

### Current core tables

1. `organizations`
2. `roles`
3. `competencies`
4. `role_competencies`
5. `employee_profiles`
6. `assessments`
7. `assessment_results`
8. `learning_resources`
9. `resource_competencies`
10. `learning_progress`
11. `ai_recommendations`

### New architecture consideration

The merged question-bank architecture now requires a **`questions` table** containing:

- Question
- Options
- Correct answer
- Level
- Competency

We should decide the exact structure of that table **before creating its migration**.

There is also one architectural question to settle afterward: whether we need an assessment-question/answer join table to preserve exactly which questions the AI assembled for each assessment.

---

# AI vs Backend Responsibility

This is the key boundary:

| Responsibility | Backend / DB | AI |
|---|---:|---:|
| Store competency framework | ✅ | ❌ |
| Store role requirements | ✅ | ❌ |
| Store question bank | ✅ | ❌ |
| Generate questions during research | — | ✅ |
| Classify questions | — | ✅ |
| Select candidate question blocks | ✅ | ❌ |
| Assemble final quiz | — | ✅ |
| Avoid duplicate questions | Validation | ✅ |
| Validate final quiz | ✅ | ❌ |
| Score assessment | ✅ | ❌ |
| Calculate competency level | ✅ | ❌ |
| Calculate competency gap | ✅ | ❌ |
| Rank existing learning resources | Data + rules | ✅ |
| Invent competency framework | ❌ | ❌ |
| Invent learning resources | ❌ | ❌ |
| Invent live assessment questions | ❌ | ❌ |
| Adaptive self-learning | — | ✅ |

**In short:**

> **Database = factual foundation**  
> **Backend = control, validation, security, scoring**  
> **AI = content intelligence, quiz assembly, personalization**  
> **Frontend = employee experience**
