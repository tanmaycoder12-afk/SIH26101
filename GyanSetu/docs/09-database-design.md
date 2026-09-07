# Database Design

Last updated: 2026-08-28

## Database

Provider: Neon Postgres

Project: `stoicdb`

The current application schema was prepared and verified on a temporary Neon migration branch. It has **not yet been applied to the main branch** because explicit approval is required before finalizing the migration.

Current migration ID:

`e534239c-6e64-408f-9250-abeb9b9dc902`

## Current tables

### `app_users`
Primary prototype account record.

Stores:
- email,
- password hash,
- full name,
- phone,
- onboarding-completed status,
- timestamps.

Plaintext passwords are never intended to be stored.

### `user_profiles`
One current profile row per user.

Stores:
- employment status,
- current job title,
- designation,
- department,
- ministry/organisation,
- years of experience,
- current role summary,
- target role.

### `user_education`
Repeatable education/qualification records.

Stores:
- qualification level,
- degree/certificate,
- field of study,
- institution,
- start/end year,
- current-study flag.

### `user_work_experience`
Repeatable work-history records.

Stores:
- organisation,
- designation,
- department,
- start/end dates,
- current-role flag,
- responsibilities.

### `user_completed_courses`
Repeatable course-completion history.

Stores:
- optional external course ID,
- title,
- provider,
- completion date,
- score,
- optional certificate URL.

### `user_skills`
Current skill evidence records.

Initial implementation stores self-reported skill level and evidence source. Later this should coexist with assessment/course/profile-derived evidence rather than treating self-report as truth.

### `user_sessions`
Server-managed login sessions.

Stores:
- user reference,
- hash of the session token,
- expiry,
- creation/revocation timestamps.

The raw session token is kept only in the browser's secure HttpOnly cookie.

## Relationships

```text
app_users
   |-- 1:1 user_profiles
   |-- 1:N user_education
   |-- 1:N user_work_experience
   |-- 1:N user_completed_courses
   |-- 1:N user_skills
   `-- 1:N user_sessions
```

Child records are designed to be deleted with the owning prototype user.

## Current profile-write behavior

`PUT /api/profile` currently treats education, experience, course and self-reported-skill arrays as the user's latest complete snapshot:
- existing rows for that user are removed,
- supplied rows are inserted,
- `app_users.onboarding_completed` becomes true.

This is acceptable for the early prototype. If audit history becomes important, switch to versioned/upserted evidence rather than destructive replacement.

## Future intelligence tables

Not created yet. Expected future entities include:
- competencies,
- role competency requirements,
- competency evidence,
- competency scores,
- gap analyses,
- recommendations,
- learning paths,
- assessment attempts,
- generated questions,
- readiness snapshots.

## Mock iGOT data boundary

The separate mock iGOT server should have its own dataset/database for authoritative employee/course/training fixtures. Do not merge all mock external-system records into the main intelligence database merely for convenience.

## Migration rule

Schema changes should be developed/tested on a Neon temporary branch, verified, documented here, then explicitly approved before being applied to main.
