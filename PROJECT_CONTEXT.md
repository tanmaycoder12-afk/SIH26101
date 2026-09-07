# GyanSetu - Project Context & Architecture
## Smart India Hackathon 2026 | Problem Statement SIH26101

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Important Project Philosophy](#2-important-project-philosophy)
3. [Technology Stack](#3-technology-stack)
4. [User Registration](#4-user-registration)
5. [Login](#5-login)
6. [Role System](#6-role-system)
7. [Competency Framework](#7-competency-framework)
8. [Proficiency Levels](#8-proficiency-levels)
9. [Database Philosophy](#10-database-philosophy)
10. [Database Tables](#11-expected-database-tables)
11. [Diagnostic Assessment Flow](#12-diagnostic-assessment-flow)
12. [Gemini's Role](#13-geminis-role)
13. [AI Question Structure](#14-ai-question-structure)
14. [AI Constraints](#15-ai-must-follow-the-framework)
15. [Question Count Logic](#16-question-count-logic)
16. [Question Distribution](#17-question-distribution)
17. [Scoring Rules](#18-scoring-rules)
18. [Gap Analysis](#21-gap-analysis)
19. [Recommendation Engine](#22-recommendation-engine)
20. [iGOT Integration](#23-igot-integration)
21. [Architecture Overview](#24-overall-architecture)
22. [Backend Structure](#25-backend-internal-architecture)
23. [API Design](#26-expected-api-structure)
24. [AI Payload](#27-ai-payload)
25. [Data Flow](#31-current-data-flow)
26. [Development Order](#33-development-order)
27. [Finalized Decisions](#34-important-things-that-are-already-decided)
28. [Not Yet Finalized](#35-things-that-are-not-yet-finalized)
29. [Working Guidelines](#36-how-i-want-you-to-work-with-this-project)
30. [System Overview](#final-understanding)

---

## 1. Project Overview

### Project Name
**GyanSetu**

### SIH Problem Statement
**SIH26101**

### Core Idea

GyanSetu is an **AI-powered competency-driven learning platform** designed to:

1. Identify the user's role
2. Determine required competencies for that role
3. Break competencies into sub-competencies
4. Determine required proficiency level for each
5. Assess user's current competency using diagnostic assessment
6. Generate diagnostic quiz using AI
7. Measure competency and sub-competency scores
8. Identify competency gaps
9. Recommend relevant learning/training courses
10. Reassess user after learning
11. Eventually integrate with iGOT Karmayogi / government learning systems

### User Journey Flow

```
USER
  ↓
ROLE
  ↓
REQUIRED COMPETENCIES
  ↓
SUB-COMPETENCIES
  ↓
REQUIRED PROFICIENCY
  ↓
DIAGNOSTIC ASSESSMENT
  ↓
CURRENT COMPETENCY
  ↓
GAP ANALYSIS
  ↓
PERSONALIZED COURSE RECOMMENDATION
  ↓
LEARNING
  ↓
REASSESSMENT
  ↓
UPDATED COMPETENCY PROFILE
```

---

## 2. Important Project Philosophy

### Core Concept

GyanSetu is **NOT simply an AI quiz generator**.

The core functionality is:
- **COMPETENCY GAP IDENTIFICATION**
- **PERSONALIZED LEARNING**

The diagnostic quiz is only the mechanism used to measure the user's current competency.

### Key Relationship

```
Role → Required Competency → Current Competency → Gap → Learning Recommendation
```

The AI should **support** this process rather than **control** it.

---

## 3. Technology Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI

### Database
- PostgreSQL

### AI
- Gemini

### Authentication
- Email + Password

### Current User Types
- **Employee** (primary focus for prototype)
- **Admin** (secondary, for future)

### Architecture Philosophy
The architecture must remain **modular** so the AI provider can be replaced later if required.

---

## 4. User Registration

### Overview
Registration is divided into **TWO STEPS**.

### Step 1: Organisation & Email Verification

**Form Fields:**

| Field | HTML ID |
|-------|---------|
| Organisation | `#organisation-select` |
| Designation | `#designation-select` |
| Government Employee Email | `#register-email` |
| OTP | `#email-otp` |

**Requirements:**
- Government employee email must be verified using OTP

### Step 2: Profile & Security

**Form Fields:**

| Field | HTML ID |
|-------|---------|
| Full Name | `#full-name` |
| Employee / Personnel ID | `#employee-id` |
| Mobile Number | `#mobile-number` |
| Password | `#register-password` |
| Confirm Password | `#confirm-password` |

**Password Requirements:**
- Minimum length: **10 characters**

### Backend Responsibilities

The backend must:

- ✓ Validate all fields
- ✓ Verify OTP
- ✓ Check email uniqueness
- ✓ Check employee/personnel ID uniqueness
- ✓ Validate mobile number format
- ✓ Validate password strength
- ✓ Confirm password matches confirmation
- ✓ Hash the password (never store plaintext)
- ✓ Create user in PostgreSQL

### Example User Record

```json
{
  "full_name": "Example Employee",
  "employee_id": "EMP001",
  "organisation": "Example Organisation",
  "designation": "Software Developer",
  "email": "employee@gov.in",
  "mobile_number": "9876543210",
  "role_id": "dev-software",
  "user_type": "employee"
}
```

---

## 5. Login

### Current Method

**Email + Password**

### Flow

- User enters government employee email
- User enters password
- Backend verifies password hash
- Backend authenticates user

### Philosophy

Do not unnecessarily introduce complex authentication mechanisms unless they are technically required.

---

## 6. Role System

### Concept

A user has a **single role** that determines their competency requirements.

### Example

```
User
 ↓
role_id = "dev-software"
 ↓
Software Developer
 ↓
Required Competencies (Programming, etc.)
 ↓
Sub-competencies
```

### Important Database Design Rule

**Store the role ID, NOT the entire competency framework in every user record.**

❌ **WRONG:**
```json
{
  "user": {
    "all_competency_information": "..."
  }
}
```

✓ **CORRECT:**
```json
{
  "role_id": "dev-software"
}
```

### Why This Matters

- Reduces data duplication
- Makes competency framework updates easier
- Keeps the database normalized
- The competency framework is resolved dynamically at runtime

---

## 7. Competency Framework

### Generic Framework Name
**GyanSetu Generic Technical Competency Framework**

### Version
**1.0**

### Framework Structure

The framework defines:

1. **Proficiency Levels** (1-4)
2. **Roles** (e.g., Software Developer, Database Admin)
3. **Competencies** per role (e.g., Programming, Database Design)
4. **Sub-competencies** per competency (e.g., OOP, Data Structures)

### Hierarchy

```
ROLE
 ↓
COMPETENCY
 ↓
SUB-COMPETENCY
 ↓
REQUIRED LEVEL (1–4)
```

### Example Path

```
Software Developer
    ↓
Programming
    ↓
Object-Oriented Programming
    ↓
Required Level 3
```

---

## 8. Proficiency Levels

### Current Levels

| Level | Name | Description |
|-------|------|-------------|
| 1 | Basic | Fundamental understanding; requires guidance. |
| 2 | Developing | Standard tasks; requires minimal guidance. |
| 3 | Proficient | Independent execution; handles standard problem-solving. |
| 4 | Advanced | Complex tasks, performance optimization, and architectural decisions. |

### Critical Design Decision

**These levels are NOT percentage scores.**

Required proficiency should be stored as a **numeric value: 1, 2, 3, or 4**

❌ **WRONG:**
- Do NOT automatically convert level 3 to 75% or 80%

✓ **CORRECT:**
```json
{
  "requiredLevel": 3
}
```

### Future Mapping

A separate mapping between assessment percentage and demonstrated proficiency may be designed later. Currently, **this mapping is NOT FINALIZED**.

---

## 8. Current Competency Framework JSON

### Full Example Structure

```json
{
  "frameworkName": "GyanSetu Generic Technical Competency Framework",
  "version": "1.0",
  "proficiencyLevels": [
    {
      "level": 1,
      "name": "Basic",
      "description": "Fundamental understanding; requires guidance."
    },
    {
      "level": 2,
      "name": "Developing",
      "description": "Standard tasks; requires minimal guidance."
    },
    {
      "level": 3,
      "name": "Proficient",
      "description": "Independent execution; handles standard problem-solving."
    },
    {
      "level": 4,
      "name": "Advanced",
      "description": "Complex tasks, performance optimization, and architectural decisions."
    }
  ],
  "roles": [
    {
      "roleId": "dev-software",
      "roleName": "Software Developer",
      "competencies": [
        {
          "competencyId": "comp-programming",
          "name": "Programming",
          "descriptions": {
            "basic": "Basic syntax understanding and simple script writing.",
            "developing": "Writes clean modular code with minimal supervision.",
            "proficient": "Builds robust software applications independently.",
            "advanced": "Architects codebases, leads code reviews, and optimizes performance."
          },
          "subCompetencies": [
            {
              "subCompetencyId": "sub-oop",
              "name": "Object-Oriented Programming",
              "definition": "Ability to apply OOP principles in software design.",
              "requiredLevel": 3
            }
          ]
        }
      ]
    }
  ]
}
```

### Important Notes

- The **COMPLETE framework** is expected to contain sub-competencies
- A sub-competency should ideally contain:
  - `subCompetencyId`
  - `name`
  - `definition`
  - `requiredLevel`

---

## 9. Why Sub-Competencies Are Important

### Problem with Broad Competency Measurement

❌ **Not Sufficiently Informative:**
```
Programming = 65%
```

### Solution: Sub-competency Breakdown

✓ **Granular & Actionable:**
```
Programming
 ├── Syntax & Fundamentals → 80%
 ├── OOP → 50%
 ├── Data Structures → 70%
 └── Algorithms → 40%
```

This allows GyanSetu to identify **exactly where the employee has a gap**.

### Critical Rule

**EVERY DIAGNOSTIC QUESTION MUST BE ASSOCIATED WITH:**

1. **1 Competency** (e.g., "Programming")
2. **1 Sub-competency** (e.g., "Object-Oriented Programming")

---

## 10. Database Philosophy

### Database Role

**PostgreSQL is the application's main database.**

**Important Decision:**

```
DATABASE = SOURCE OF TRUTH FOR APPLICATION DATA
```

### Competency Framework Role

```
competency_framework.json = Master competency definition during prototype
```

### What to Store Where

❌ **WRONG:** Duplicate entire framework into every user record

✓ **CORRECT:**

**competency_framework.json:**
- Roles
- Competencies
- Sub-competencies
- Proficiency definitions

**PostgreSQL:**
- Users
- Assessments
- Questions
- Answers
- Results

### Workflow

```
competency_framework.json
    ↓
Backend needs competency info
    ↓
Dynamically read framework
    ↓
Build JSON payload for Gemini
```

---

## 11. Expected Database Tables

### USERS Table

```sql
users

- id (PRIMARY KEY)
- full_name
- employee_id (UNIQUE)
- organisation
- designation
- email (UNIQUE)
- mobile_number
- password_hash
- role_id (FOREIGN KEY to roles)
- user_type (ENUM: employee, admin)
- is_verified
- created_at
- updated_at
```

### ASSESSMENTS Table

```sql
assessments

- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- role_id (FOREIGN KEY)
- assessment_type (ENUM: diagnostic, reassessment)
- status (ENUM: started, in_progress, completed)
- total_questions
- started_at
- completed_at
- overall_score
- created_at
```

### ASSESSMENT_QUESTIONS Table

```sql
assessment_questions

- id (PRIMARY KEY)
- assessment_id (FOREIGN KEY)
- question
- option_a
- option_b
- option_c
- option_d
- correct_answer (ENUM: A, B, C, D)
- competency_id
- sub_competency_id
- difficulty (ENUM: easy, medium, hard)
- explanation
- created_at
```

### USER_ANSWERS Table

```sql
user_answers

- id (PRIMARY KEY)
- assessment_id (FOREIGN KEY)
- question_id (FOREIGN KEY)
- selected_answer (ENUM: A, B, C, D, NULL)
- is_correct (BOOLEAN)
- answered_at
```

### COMPETENCY_RESULTS Table

```sql
competency_results

- id (PRIMARY KEY)
- assessment_id (FOREIGN KEY)
- competency_id
- required_level (INT: 1-4)
- current_score (FLOAT: 0-100)
- status (ENUM: gap, met, exceeded)
- created_at
```

### SUB_COMPETENCY_RESULTS Table

```sql
sub_competency_results

- id (PRIMARY KEY)
- assessment_id (FOREIGN KEY)
- competency_id
- sub_competency_id
- required_level (INT: 1-4)
- questions_attempted (INT)
- correct_answers (INT)
- score_percentage (FLOAT: 0-100)
- created_at
```

### Additional Future Tables

These can be added later for:
- `courses`
- `course_competencies`
- `learning_progress`
- `recommendations`
- `certificates`
- `igot_integration_logs`

**These are NOT the immediate priority.**

---

## 12. Diagnostic Assessment Flow

### Complete Workflow

```
USER (Logged In)
       ↓
   Dashboard
       ↓
Start Diagnostic Assessment
       ↓
Backend identifies user's role
       ↓
Backend gets role's competencies
       ↓
Backend gets sub-competencies
       ↓
Backend reads required levels
       ↓
Backend calculates number of questions
       ↓
Backend creates AI payload
       ↓
Gemini generates questions
       ↓
Backend validates AI response
       ↓
Questions are stored in PostgreSQL
       ↓
Questions are displayed on frontend
       ↓
User answers questions
       ↓
Answers are sent to backend
       ↓
Backend calculates scores
       ↓
Sub-competency scores calculated
       ↓
Competency scores calculated
       ↓
Gap analysis performed
       ↓
Results displayed/stored
```

---

## 13. Gemini's Role

### Responsibility

Gemini is responsible for:

**AI-BASED QUESTION GENERATION ONLY**

### What Gemini Should NOT Do

Gemini should **NOT** be the final scoring engine.

### Correct Architecture

```
COMPETENCY FRAMEWORK
       ↓
FASTAPI
       ↓
ASSESSMENT CONFIGURATION
       ↓
GEMINI
       ↓
QUESTIONS (Structured JSON)
       ↓
VALIDATION
       ↓
POSTGRESQL
```

### Scoring Flow (Separate from AI)

```
USER ANSWERS
       ↓
FASTAPI
       ↓
DETERMINISTIC SCORING ENGINE
       ↓
RESULTS (Reproducible, Explainable)
```

---

## 14. AI Question Structure

### Required Fields

Every question generated by Gemini must contain:

```json
{
  "question_id": "Q001",
  "question": "Which approach is most appropriate...",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correct_answer": "B",
  "competency_id": "comp-programming",
  "sub_competency_id": "sub-oop",
  "difficulty": "medium",
  "explanation": "Detailed explanation of why B is correct..."
}
```

### Design Philosophy

- Prefer **IDs internally** instead of relying only on names
- Use structured JSON format for consistency
- Include explanation for educational value

---

## 15. AI Must Follow the Framework

### Gemini's Constraints

Gemini must receive the **relevant competency framework** and:

- ✓ Generate questions **only from supplied competencies**
- ✓ Generate questions **only from supplied sub-competencies**
- ✓ Respect **required proficiency levels**
- ✓ Respect **requested difficulty** distribution
- ✓ Maintain **exact question count**
- ✓ Avoid **duplicate questions**
- ✓ Return **structured output** (valid JSON)

### What Gemini Should NOT Do

- ❌ Invent new competencies
- ❌ Invent new sub-competencies
- ❌ Deviate from the framework

### Backend Validation

The backend must validate Gemini's response before storing:

- ✓ Required fields exist
- ✓ IDs are valid
- ✓ Competency exists in framework
- ✓ Sub-competency belongs to that competency
- ✓ Answer is valid (A, B, C, or D)
- ✓ Difficulty is valid (easy, medium, hard)
- ✓ Question count matches request
- ✓ Duplicate questions are avoided

---

## 16. Question Count Logic

### Calculation Method

Question count depends on the **number of sub-competencies**.

**Critical Rule:** The final question count must always be a **multiple of 10**.

### Examples

| Sub-competencies | Questions |
|------------------|-----------|
| 1–10 | 10 |
| 11–20 | 20 |
| 21–30 | 30 |
| 31–40 | 40 |

### General Formula

```
question_count = ceil(number_of_sub_competencies / 10) × 10
```

### Concrete Example

17 sub-competencies:
```
ceil(17 / 10) × 10 = 2 × 10 = 20 questions
```

### Important Note

**Do not simply generate exactly one question per sub-competency and stop.**

If there are 17 sub-competencies:
```
17 base questions
+
3 additional questions
=
20 questions
```

---

## 17. Question Distribution

### Principle

Each sub-competency should receive **at least one question** whenever practical.

Additional questions should be **intelligently distributed**.

### Factors for Distribution

- Required proficiency level
- Competency importance
- Difficulty weighting
- Assessment coverage
- Priority/criticality

### Concrete Example

17 sub-competencies → 20 questions:

```
Sub A → 1 question
Sub B → 1 question
Sub C → 2 questions
Sub D → 1 question
Sub E → 2 questions
...
Total = 20 questions
```

### Key Point

Different sub-competencies can have **different question counts**.

---

## 18. Scoring Rules

### Rule: Multi-Question Sub-competency Scoring

If a sub-competency has multiple questions, its score **must account for ALL its questions**.

### Formula

```
sub_competency_score = 
  (correct_answers / total_questions_for_that_sub_competency) × 100
```

### Example 1: All Correct

Sub-competency X has 2 questions:
- Question 1 → ✓ Correct
- Question 2 → ✓ Correct

```
Score = (2 / 2) × 100 = 100%
```

### Example 2: Mixed Results

Sub-competency X has 2 questions:
- Question 1 → ✓ Correct
- Question 2 → ❌ Wrong

```
Score = (1 / 2) × 100 = 50%
```

### Example 3: All Wrong

Sub-competency X has 2 questions:
- Question 1 → ❌ Wrong
- Question 2 → ❌ Wrong

```
Score = (0 / 2) × 100 = 0%
```

---

## 19. Competency Score

### Definition

A competency can have **multiple sub-competencies**.

### Initial Prototype Calculation

For the first prototype:

```
competency_score = 
  average of its sub_competency scores
```

### Example

Competency: **Programming**

Sub-competencies:
- OOP → 80%
- Data Structures → 60%
- Algorithms → 70%

```
Programming score = (80 + 60 + 70) / 3 = 70%
```

### Future Enhancement

**Weighted scoring** may be added later if needed.

**Do not overcomplicate the first prototype.**

---

## 20. Required Level vs Current Score

### Critical Distinction

This is **VERY IMPORTANT** to understand.

### Required Level

- **Source:** Competency framework
- **Value:** 1–4 (ordinal level)
- **Meaning:** Expected proficiency for the role

### Current Diagnostic Result

- **Source:** Assessment output
- **Value:** Percentage (0–100)
- **Meaning:** Demonstrated competency from quiz

### Example

Sub-competency: **Object-Oriented Programming**

```
Required Level:  3 (Proficient)
Current Score:   65% (from diagnostic quiz)
```

These are **NOT the same measurement**.

### Important Note

**NOT YET FINALIZED:** The exact percentage → proficiency-level mapping

A formal mapping like:
- 80–100% = Level 4
- 60–79% = Level 3
- 40–59% = Level 2
- 0–39% = Level 1

**is NOT yet decided.**

Do NOT silently assume a mapping. If this becomes relevant, explicitly state that the decision is not finalized.

---

## 21. Gap Analysis

### Concept

The competency engine **compares:**

```
REQUIRED COMPETENCY
versus
CURRENT DEMONSTRATED COMPETENCY
```

### Example

```
Role:              Software Developer
Sub-competency:    OOP
Required:          Level 3 (Proficient)
Current:           65%
Gap Status:        ❌ Gap Exists
```

### What Should Be Identified

For each gap:
- Competency
- Sub-competency
- Required level
- Current score (percentage)
- Current level (if mapped)
- Gap severity/priority

---

## 22. Recommendation Engine

### Flow

```
Gap Identified
       ↓
Recommendation Engine
       ↓
Relevant course/training
       ↓
Personalized Learning Plan
```

### Course Recommendation Factors

Course recommendations should ideally consider:
- User's role
- Weak competency
- Weak sub-competency
- Required proficiency level
- Course competency tags

### Prototype Approach

For the hackathon prototype:
- Course data can be **mocked/local** initially
- Later, connect to **iGOT** or another government platform

---

## 23. iGOT Integration

### Long-term Vision

The long-term intention is to connect GyanSetu with:
- **iGOT Karmayogi**
- Government learning infrastructure

### Potential Flow

```
GyanSetu
       ↓
Identify Gap
       ↓
Recommend iGOT Course
       ↓
User Completes Course
       ↓
Learning Status/Completion
       ↓
Post-Learning Assessment
       ↓
Updated Competency Profile
```

### Critical Prototype Rule

**Do NOT make the prototype completely dependent on external iGOT API.**

### Fallback Strategy

If APIs are unavailable:
- Use **mock/local course data**
- Create **modular integration points**
- Demonstrate the workflow locally
- Replace mock integration with real APIs later

This ensures the prototype is functional even without external dependencies.

---

## 24. Overall Architecture

### High-Level System Diagram

```
                ┌──────────────────────┐
                │      FRONTEND        │
                │    HTML/CSS/JS       │
                └──────────┬───────────┘
                           │
                           │ REST API
                           ▼
                ┌──────────────────────┐
                │       FASTAPI        │
                │       BACKEND        │
                └──────────┬───────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   Authentication   Competency Engine   Assessment
          │                │              Engine
          │                │                │
          │                ▼                ▼
          │        Framework JSON        Gemini
          │                                 │
          │                                 ▼
          │                           AI Questions
          │                                 │
          └────────────────┬────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │      PostgreSQL      │
                │                      │
                │ Users                │
                │ Assessments          │
                │ Questions            │
                │ Answers              │
                │ Results              │
                └──────────────────────┘
                           │
                           ▼
                   Competency Gaps
                           │
                           ▼
                Course Recommendation
                           │
                           ▼
                     Learning/iGOT
                           │
                           ▼
                    Reassessment
```

---

## 25. Backend Internal Architecture

### Recommended FastAPI Structure

```
backend/
│
├── app/
│   ├── main.py
│
│   ├── config/
│   │   └── settings.py
│
│   ├── database/
│   │   ├── database.py
│   │   └── models/
│   │       ├── user.py
│   │       ├── assessment.py
│   │       ├── question.py
│   │       ├── answer.py
│   │       └── result.py
│
│   ├── schemas/
│   │   ├── user.py
│   │   ├── auth.py
│   │   ├── assessment.py
│   │   └── result.py
│
│   ├── routes/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── assessments.py
│   │   └── results.py
│
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── competency_service.py
│   │   ├── assessment_service.py
│   │   ├── scoring_service.py
│   │   └── gemini_service.py
│
│   ├── competency/
│   │   └── competency_framework.json
│
│   └── utils/
│       ├── security.py
│       └── validators.py
│
├── requirements.txt
├── .env
└── README.md
```

### Philosophy

This is a **proposed structure, not an absolute rule**.

If a cleaner structure is found, explain why before changing significantly.

---

## 26. Expected API Structure

### Initial API Endpoints

#### Authentication

```
POST   /auth/register
POST   /auth/verify-otp
POST   /auth/login
```

#### User

```
GET    /users/me
```

#### Competency

```
GET    /competencies/role/{role_id}
GET    /competencies/my-competencies
```

#### Assessment

```
POST   /assessments/start
GET    /assessments/{assessment_id}
POST   /assessments/{assessment_id}/submit
```

#### Results

```
GET    /assessments/{assessment_id}/results
GET    /users/me/competency-results
```

### Note

Exact endpoint names can be improved during implementation.

---

## 27. AI Payload

### Dynamic Payload Creation

The backend should **dynamically create a payload** for Gemini.

### Example Payload

```json
{
  "assessmentType": "diagnostic",

  "role": {
    "roleId": "dev-software",
    "roleName": "Software Developer"
  },

  "competencies": [
    {
      "competencyId": "comp-programming",
      "name": "Programming",
      "requiredLevel": 3,

      "subCompetencies": [
        {
          "subCompetencyId": "sub-oop",
          "name": "Object-Oriented Programming",
          "definition": "Ability to apply OOP principles.",
          "requiredLevel": 3
        },
        {
          "subCompetencyId": "sub-datastructures",
          "name": "Data Structures",
          "definition": "Understanding of arrays, linked lists, trees, etc.",
          "requiredLevel": 3
        }
      ]
    }
  ],

  "assessmentConfig": {
    "questionCount": 20,
    "questionType": "MCQ"
  }
}
```

### Security Rules

**Do NOT send unnecessary PII to Gemini.**

Never send:
- ❌ Passwords
- ❌ Password hashes
- ❌ OTPs
- ❌ Personal identification numbers
- ❌ Other sensitive personal information

Only send information **necessary for question generation**.

---

## 28. AI Prompt Concept

### Structured & Strict Prompt

The Gemini prompt should be **structured and strict**.

### What the Prompt Must Tell Gemini

- User's role
- Competencies required
- Competency definitions
- Sub-competencies
- Sub-competency definitions
- Required proficiency levels
- Exact question count needed
- Difficulty distribution requirements
- Question type (MCQ)
- Required output schema
- Mapping requirements (competency ↔ question)
- Constraint: No questions outside framework
- Constraint: No duplicate questions
- Constraint: Valid JSON only

### When Finalized

The final AI prompt will be designed after the **final competency framework is available**.

---

## 29. Question Storage

### Why Store Questions

Generated questions **MUST be saved** in PostgreSQL.

### Reason

We need to maintain the **complete assessment record**.

### Storage Flow

```
Assessment Created
       ↓
Questions Generated (by Gemini)
       ↓
Questions Validated
       ↓
Questions Stored in PostgreSQL
       ↓
User Answers Stored
       ↓
Results Stored
```

### Benefits

- Complete assessment record
- Result calculation capability
- Review and auditing
- Reproducibility
- Historical competency tracking
- Reassessment comparison

---

## 30. Why AI Scoring Is NOT Used

### Wrong Approach

❌ **Do NOT ask Gemini:**
```
"Give this employee a competency score."
```

### Correct Approach

✓ **Separation of Concerns:**

```
Gemini:
Generate structured questions

Backend:
Determine correctness (deterministic)

Backend:
Calculate percentages

Backend:
Calculate competency/sub-competency scores

Backend:
Perform gap analysis
```

### Why This Matters

This approach makes the system:
- **Deterministic** (reproducible results)
- **Explainable** (audit trail of scoring logic)
- **Reproducible** (same answers = same scores)
- **Easier to debug** (clear logic flow)
- **Less AI-dependent** (less prone to hallucinations)

---

## 31. Current Data Flow

### Registration Flow

```
Frontend
       ↓
POST request
       ↓
FastAPI
       ↓
Validation
       ↓
OTP verification
       ↓
Password hashing
       ↓
PostgreSQL: Save user
```

### Login Flow

```
Frontend
       ↓
Email + Password
       ↓
FastAPI
       ↓
Email/password verification
       ↓
Authentication
       ↓
Dashboard
```

### Diagnostic Assessment Flow

```
User clicks "Start Assessment"
       ↓
FastAPI
       ↓
Find user's role
       ↓
Read competency framework JSON
       ↓
Find role's competencies
       ↓
Find sub-competencies
       ↓
Calculate question count
       ↓
Build Gemini payload
       ↓
Call Gemini API
       ↓
Validate questions
       ↓
Save assessment + questions in PostgreSQL
       ↓
Frontend displays quiz
```

### Assessment Submission Flow

```
Frontend
       ↓
Submit answers
       ↓
FastAPI
       ↓
Save answers in PostgreSQL
       ↓
Calculate correctness (deterministic)
       ↓
Calculate sub-competency scores
       ↓
Calculate competency scores
       ↓
Perform gap analysis
       ↓
Store results in PostgreSQL
       ↓
Frontend displays results
```

---

## 32. Future System

### After Core Diagnostic Works

1. ✓ Course database
2. ✓ Course-to-competency mapping
3. ✓ Recommendation engine
4. ✓ iGOT integration
5. ✓ Learning progress tracking
6. ✓ Post-course assessment
7. ✓ Updated competency profile
8. ✓ Historical competency tracking
9. ✓ Admin dashboard
10. ✓ Analytics and insights
11. ✓ Additional roles
12. ✓ Government competency framework validation

---

## 33. Development Order

### Build in Phases

**Do NOT build everything simultaneously.**

### Recommended Development Phases

| Phase | Task |
|-------|------|
| 1 | Finalize competency framework JSON |
| 2 | Create PostgreSQL database & schema |
| 3 | Create database models (SQLAlchemy) |
| 4 | Connect FastAPI to PostgreSQL |
| 5 | Implement user registration (Step 1) |
| 6 | Implement OTP verification |
| 7 | Implement password hashing/authentication |
| 8 | Implement user registration (Step 2) |
| 9 | Implement login |
| 10 | Implement role & competency retrieval |
| 11 | Implement dynamic assessment configuration |
| 12 | Implement Gemini integration |
| 13 | Implement AI response validation |
| 14 | Save generated assessment/questions |
| 15 | Connect quiz to frontend |
| 16 | Implement answer submission |
| 17 | Implement deterministic scoring |
| 18 | Implement sub-competency results |
| 19 | Implement competency results |
| 20 | Implement competency gap analysis |
| 21 | Implement course recommendation |
| 22 | Implement mock iGOT/course integration |
| 23 | Implement post-learning reassessment |

---

## 34. Important Things That Are Already Decided

### ✅ FINALIZED DECISIONS

Treat these as existing decisions:

- ✓ Project name: **GyanSetu**
- ✓ SIH Problem: **SIH26101**
- ✓ Frontend tech: **HTML/CSS/JavaScript**
- ✓ Backend framework: **Python/FastAPI**
- ✓ Database: **PostgreSQL**
- ✓ AI provider: **Gemini**
- ✓ User types: **Employee + Admin**
- ✓ Login method: **Email + Password**
- ✓ Registration: **Two-step process**
- ✓ Email verification: **OTP-based**
- ✓ Password minimum: **10 characters**
- ✓ Password storage: **Hashed (never plaintext)**
- ✓ Role system: **Role-based competency mapping**
- ✓ Competencies: **Have sub-competencies**
- ✓ Proficiency: **Levels 1-4 (not percentages)**
- ✓ Current competency: **Measured via diagnostic assessment**
- ✓ Diagnostic quiz: **AI-generated**
- ✓ Question tagging: **Every question = 1 competency + 1 sub-competency**
- ✓ Question storage: **Saved in PostgreSQL**
- ✓ Answer storage: **Saved in PostgreSQL**
- ✓ Result storage: **Saved in PostgreSQL**
- ✓ AI responsibility: **Question generation only**
- ✓ Backend responsibility: **Scoring & gap analysis**
- ✓ Question count: **Dynamic (multiple of 10)**
- ✓ Multi-question sub-competencies: **Score accounts for ALL questions**
- ✓ Competency score: **Initially = average of sub-competency scores**
- ✓ Framework JSON: **Master competency definition**
- ✓ PostgreSQL: **Application data source of truth**
- ✓ iGOT integration: **Future/modular (not blocking prototype)**
- ✓ Mock course data: **Acceptable for prototype**
- ✓ Architecture: **Modular & replaceable (especially AI provider)**

---

## 35. Things That Are NOT Yet Finalized

### ⚠️ NOT FINALIZED

Do NOT assume these without discussion:

1. ❓ Complete competency framework JSON
2. ❓ Final list of government roles
3. ❓ Final list of competencies per role
4. ❓ Final list of sub-competencies per competency
5. ❓ Exact percentage ↔ proficiency-level mapping
6. ❓ Specific Gemini model version/API version
7. ❓ OTP provider (Twilio, AWS SNS, etc.)
8. ❓ Production deployment infrastructure
9. ❓ Actual iGOT Karmayogi API implementation
10. ❓ Final course dataset
11. ❓ Final recommendation algorithm (weighted vs simple)
12. ❓ Final admin dashboard features
13. ❓ User role editing/role switching logic

### What to Do

If any of these become relevant during implementation:
- **Explicitly mark it as "NOT FINALIZED"**
- **Do not assume a default**
- **Discuss with team before implementing**

---

## 36. How to Work with This Project

### Working Guidelines

When asking for help with GyanSetu:

1. ✓ Use architecture & decisions in this document as baseline
2. ✓ Do NOT restart project from scratch
3. ✓ Do NOT repeat questions already answered here
4. ✓ Provide implementation-ready code when requested
5. ✓ Clearly specify file names & locations
6. ✓ Keep frontend/backend/database responsibilities separated
7. ✓ Separate AI logic from deterministic business logic
8. ✓ Prefer simple, reliable hackathon architecture over enterprise complexity
9. ✓ Point out technical issues clearly if discovered
10. ✓ Mark items as "NOT FINALIZED" instead of assuming
11. ✓ Maintain consistency across database, APIs, JSON, and frontend
12. ✓ Explain what components are affected by suggested changes
13. ✓ Prioritize end-to-end working prototype first
14. ✓ Improve scalability/security/production-readiness after

---

## 37. Immediate Next Task

### Current Status

The competency framework is still being completed.

### What Comes Next

Once the final competency framework JSON is provided:

1. ✓ Validate its structure
2. ✓ Add/fix sub-competencies if needed
3. ✓ Ensure every sub-competency has a definition
4. ✓ Ensure every sub-competency has a required proficiency level
5. ✓ Ensure IDs are unique and consistent
6. ✓ Finalize `competency_framework.json`
7. ✓ Design exact PostgreSQL schema
8. ✓ Create FastAPI backend step-by-step
9. ✓ Integrate Gemini
10. ✓ Implement scoring/gap engine

### Important Note

**Do NOT jump to implementing the entire application before:**
- Framework and database foundation are properly established
- Schema is finalized
- API structure is agreed upon

---

## Final Understanding

### System at a Glance

```
USER
 ↓
ROLE
 ↓
REQUIRED COMPETENCIES
 ↓
SUB-COMPETENCIES
 ↓
REQUIRED LEVEL (1–4)
 ↓
DIAGNOSTIC QUIZ
 ↓
GEMINI (Question Generation)
 ↓
COMPETENCY-TAGGED MCQs
 ↓
USER ANSWERS
 ↓
DETERMINISTIC SCORING
 ↓
┌──────────────┬──────────────┐
SUB-COMPETENCY    COMPETENCY
    SCORE            SCORE
│                       │
└──────────────┬──────────────┘
               ↓
         GAP ANALYSIS
               ↓
    PERSONALIZED LEARNING
               ↓
        COURSE/iGOT
               ↓
        REASSESSMENT
               ↓
    UPDATED COMPETENCY PROFILE
```

### Core Philosophy

**GyanSetu is NOT just an AI quiz generator.**

**GyanSetu is a complete competency-gap → personalized-learning system.**

---

## Document Information

- **Project:** GyanSetu
- **SIH Problem:** SIH26101
- **Repository:** stoicsatvik/SIH26101
- **Document Version:** 1.0
- **Last Updated:** 2026-09-02
- **Technology:** HTML/CSS/JavaScript, Python/FastAPI, PostgreSQL, Gemini

---

**End of Project Context Document**
