# System Architecture

Last updated: 2026-08-28

## Current deployed shape

```text
Browser
  |
  v
Cloudflare Worker (`src/worker.js`)
  |-- `/api/*` -> backend handlers
  |                |
  |                v
  |             Neon Postgres (`stoicdb`)
  |
  `-- all other paths -> static frontend assets
                         (`sih-ai-learning-platform/frontend/`)
```

`wrangler.jsonc` binds the frontend directory as `ASSETS` and points Worker execution to `src/worker.js`.

## Current user flow

```text
Landing page
   |
   +--> Sign in --> `/api/auth/login`
   |
   `--> Create account --> `/api/auth/register`
                             |
                             v
                         onboarding
                             |
                             v
                       `PUT /api/profile`
                             |
                             v
                         dashboard
```

## Authentication boundary

The current prototype uses first-party Worker authentication, not iGOT/Parichay/WorkOS yet.

- browser submits email/password to the Worker over HTTPS,
- Worker hashes/validates passwords server-side,
- Worker creates a random session token,
- only a hash of the session token is stored in Postgres,
- raw session token is placed in an HttpOnly, Secure, SameSite cookie.

Future external identity integration should replace the authentication provider without rewriting competency/profile subsystems.

## Data ownership

### Neon stores
- prototype account identity,
- profile/employment information,
- education records,
- work experience,
- completed courses,
- self-reported skills,
- session records.

### Future mock iGOT service should own
- external employee/profile source data,
- official role/designation metadata,
- competency framework,
- iGOT-style course catalog,
- training/enrollment/completion history.

### Future intelligence layer should own
- competency estimates,
- evidence,
- gap analyses,
- recommendations,
- learning paths,
- assessment results,
- readiness snapshots.

## Planned architecture

```text
Mock/real iGOT provider
        |
        v
Integration adapter
        |
        +--> profile/role data
        +--> training history
        +--> course catalog
        |
        v
Competency engine
        |
        v
Gap vector
        |
        v
Recommendation engine
        |
        v
Learning path
        |
        +--> assessment engine
        |       |
        |       v
        |   new evidence
        |       |
        `-------+--> competency recomputation

Uploaded material
        |
        v
Document processor -> semantic chunks -> grounded MCQ generation -> assessment bank
```

## Architectural constraints

- Frontend must never connect directly to Neon with privileged credentials.
- `DATABASE_URL` stays a Cloudflare secret, never in Git.
- The system should integrate with iGOT through an adapter/provider boundary rather than hard-coding a mock API throughout the codebase.
- AI outputs that affect competency/readiness should retain evidence/source links where practical.
- The landing page must remain clearly labelled as an SIH26101 prototype and not impersonate an official Government of India login.

## Current known gaps

- Neon migration is verified on a temporary branch but still requires explicit approval before applying to main.
- Competency/recommendation/MCQ engines are not implemented yet.
- Mock iGOT server is not implemented yet.
- WorkOS/Parichay integration is not active.
- Current dashboard is only a placeholder.
