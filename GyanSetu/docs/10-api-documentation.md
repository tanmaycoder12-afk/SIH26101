# API Documentation

Last updated: 2026-08-28

Current API implementation lives in `src/worker.js` and is served by the same Cloudflare Worker as the frontend.

Base path: `/api`

## Health / diagnostics

### `GET /api/health`
Returns a non-sensitive backend readiness snapshot.

Example response when healthy:
```json
{
  "ok": true,
  "worker": true,
  "databaseConfigured": true,
  "databaseReachable": true,
  "schemaReady": true
}
```

The endpoint never returns the database connection string or credentials. It is intended to distinguish Cloudflare configuration problems from database connectivity/schema problems during development.

## Authentication

### `POST /api/auth/register`
Creates a prototype account.

Request body:
```json
{
  "fullName": "Example User",
  "email": "user@example.com",
  "password": "minimum-10-chars"
}
```

Behavior:
- validates email/password,
- rejects duplicate email,
- hashes password server-side,
- inserts the user,
- creates a session,
- sets the session cookie,
- returns the next page (`/onboarding.html`).

### `POST /api/auth/login`
Authenticates an existing prototype account.

Request body:
```json
{
  "email": "user@example.com",
  "password": "..."
}
```

Behavior:
- verifies password hash,
- creates a new session,
- returns `/onboarding.html` when onboarding is incomplete,
- otherwise returns `/dashboard.html`.

### `POST /api/auth/logout`
Revokes the current session if present and clears the browser session cookie.

### `GET /api/auth/me`
Returns the current authenticated prototype user.

Requires a valid session cookie.

## Profile

### `GET /api/profile`
Returns the authenticated user's current profile bundle:
- base user,
- profile,
- education,
- work experience,
- completed courses,
- skills.

### `PUT /api/profile`
Saves the onboarding/profile snapshot.

Expected body shape:
```json
{
  "profile": {
    "employmentStatus": "Employed",
    "currentJobTitle": "Statistical Officer",
    "designation": "Statistical Officer",
    "department": "Example Department",
    "organization": "Example Ministry",
    "yearsExperience": 4,
    "currentRoleSummary": "...",
    "targetRole": "..."
  },
  "education": [],
  "experience": [],
  "completedCourses": [],
  "skills": []
}
```

The endpoint updates the profile snapshot and marks onboarding as complete.

## Status codes currently used

- `200` success
- `201` resource/account created
- `400` invalid request/body/input
- `401` unauthenticated or invalid credentials
- `404` API route not found
- `409` duplicate account
- `503` backend dependency/configuration not ready (database secret, connection or schema)
- `500` unexpected Worker/server error

Database-related 503 responses expose only safe error codes/messages, never connection strings or credentials.

## Session transport

Authentication is cookie-based. The frontend does not manually store a bearer token in localStorage.

## Not implemented yet

The following APIs still need to be designed/added:
- competencies,
- role requirements,
- gap analysis,
- assessments/quizzes,
- course recommendation,
- learning paths,
- mock iGOT synchronization,
- admin/workforce analytics,
- document upload/processing.

When those endpoints are added, update this document in the same development cycle.
