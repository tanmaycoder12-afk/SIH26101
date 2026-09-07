# Merge Strategy: Competency & Assessment Intelligence Integration

> **Key Principle:** Keep Devesh's infrastructure; replace/extend the competency and assessment intelligence with Tanmay's granular logic.

## Step-by-Step Merge Plan

### Step 1 — Freeze Devesh's Current Foundation
Do not change the current stack:
- Framework: Next.js
- UI: React, Tailwind CSS
- Language: TypeScript
- Backend / Database: Supabase, PostgreSQL

### Step 2 — Introduce Your Competency Hierarchy
Establish a granular hierarchy:

    Role
     └── Competency
          └── Sub-competency
               └── Required Level

Example:

    Software Developer
    └── Programming
         ├── OOP (Required Level 3)
         ├── Data Structures (Required Level 3)
         └── Algorithms (Required Level 2)

### Step 3 — Connect Framework to Database Architecture
- **MVP Strategy:** `competency_framework.json` = source of truth for framework definition; `Supabase` = application state (users, assessments, results).
- **Future Migration:** Normalize competency framework inside Supabase when direct complex queries are required.

### Step 4 — Add Assessment Data Model
Map assessment structures directly into Supabase:

    assessments ──> assessment_questions (tagged with competency_id & sub_competency_id) ──> user_answers

### Step 5 — Build Competency Framework Service
Create a server-side abstraction layer (`src/lib/competency/service.ts`) with methods:
- `getRole(roleId)`
- `getCompetenciesForRole(roleId)`
- `getSubCompetencies(competencyId)`
- `getRequiredLevel(subCompetencyId)`

### Step 6 — Build Assessment Configuration Engine
Implement deterministic question distribution backend logic:
- 17 sub-competencies -> ceil(17/10) * 10 = 20 total questions (17 minimum + 3 additional).

### Step 7 — Build Gemini Question Generator
Send only structural metadata (Role, Competency definitions, required levels, difficulty distribution) to Gemini. **Do not send user PII.**

### Step 8 — Add Strict Gemini Validator
Validate AI responses before database insertion:
- Question count & required fields
- Valid IDs & parent-child relationships
- Answer validity & duplicate detection

    Gemini ──> Response ──> Validator ──┬── PASS ──> Store in Supabase
                                        └── FAIL ──> Reject / Regenerate

### Step 9 — Store Generated Assessment
Persist validated questions in Supabase (`assessments` -> `assessment_questions`). Frontend strictly reads stored records.
- Data Flow: `React ──> Next.js Server ──> Gemini ──> Validation ──> Supabase ──> React`

### Step 10 — Build Quiz UI
UI consumes `/dashboard/assessment` route. Renders question text, options, and progress. Scoring is strictly handled server-side.

### Step 11 — Build Deterministic Scoring Engine
Calculate sub-competency performance:
Sub-competency Score = (Correct Answers / Attempted Questions) * 100

### Step 12 — Calculate Competency Scores
Aggregate sub-competency scores into parent competency averages (e.g., Programming = average of OOP, Data Structures, Algorithms scores).

### Step 13 — Keep Required Level Separate
Keep required benchmarks and actual scores as distinct metrics:
- `required_level` = 3
- `current_score` = 70%

### Step 14 — Build Gap Engine
Output structured gap analysis objects containing `competencyId`, `subCompetencyId`, `requiredLevel`, `currentScore`, `currentLevel`, `gap`, and `priority`.

### Step 15 — Connect Recommendation Engine
Feed gap outputs into course recommendation pipelines:
Sub-competency Gaps ──> Recommendation Engine ──> Course Tags ──> Learning Path

### Step 16 — Evidence Aggregation (Post-MVP)
Combine profile, training, and assessment evidence into an estimated competency profile with confidence scoring.

### Step 17 — Reassessment (Closed-Loop)
Enable diagnostic baseline -> targeted learning -> reassessment -> growth tracking loop.

### Step 18 — iGOT Abstraction
Use an adapter pattern (`Learning Provider Adapter`) to support Mock Providers now and iGOT/external platforms later.

## System Architecture

                                NEXT.JS FRONTEND
                                       │
                                       ▼
                              SERVER / API LAYER
                                       │
               ┌───────────────────────┼───────────────────────┐
               ▼                       ▼                       ▼
          Auth Engine          Competency Engine       Assessment Engine
                                       │                       │
                                       ▼                       ▼
                            competency_framework.json       Gemini API
                                       │                       │
                                       │                       ▼
                                       │                  AI Questions
                                       │                       │
                                       │                  Validation
                                       │                       │
                                       └───────────┬───────────┘
                                                   ▼
                                                SUPABASE
                                                   │
                   ┌───────────────────────────────┼───────────────────────────────┐
                   ▼                               ▼                               ▼
              Assessments                       Answers                         Results
                                                                                   │
                                                                                   ▼
                                                                              Gap Analysis
                                                                                   │
                                                                                   ▼
                                                                         Recommendation Engine
                                                                                   │
                                                                                   ▼
                                                                           Learning Provider
                                                                                   │
                                                                                   ▼
                                                                              Reassessment

## Recommended Development Phases

1. **Phase A (Foundation):** Verify stack, finalize `competency_framework.json`, define TS types, build service.
2. **Phase B (Assessment):** Design tables/migrations, build config engine, Gemini service, validator, and generation API.
3. **Phase C (Quiz UI):** Build assessment UI & submission handling.
4. **Phase D (Intelligence):** Build scoring service, gap analysis, and results persistence.
5. **Phase E (Learning):** Populate course database, map tags, build recommendation engine & learning dashboard.
6. **Phase F (Closed Loop & Advanced):** Reassessment tracking, evidence aggregation, and iGOT adapter.

### Key Division of Responsibilities
- **Devesh:** Application architecture + Infrastructure + Integration
- **Tanmay:** Granular competency model + Question generation & scoring logic
