# Development Roadmap

Last updated: 2026-08-28

## Phase 0 - Foundation and deployment

Status: mostly complete

- [x] Fork selected as working repo
- [x] Cloudflare Worker deployment
- [x] static frontend asset binding
- [x] iGOT-inspired landing/login visual direction
- [x] responsive mobile/desktop split
- [x] Google Search Console ownership verification
- [ ] Safe Browsing review completed

## Phase 1 - Prototype identity and onboarding

Status: implementation complete, database rollout pending

- [x] registration UI
- [x] login UI
- [x] Worker authentication API
- [x] password hashing
- [x] session-token hashing and secure cookie
- [x] onboarding UI
- [x] collect current employment/designation/department/role
- [x] collect education
- [x] collect work experience
- [x] collect completed courses
- [x] collect self-reported skills
- [x] Neon schema prepared and tested on temporary branch
- [ ] approve/apply Neon migration to main
- [ ] configure/verify production `DATABASE_URL`
- [ ] end-to-end registration/login/onboarding test against production Neon

## Phase 2 - Mock iGOT integration environment

Status: not started

Build a separate mock external service containing:
- employee records,
- departments/designations/positions,
- role competency requirements,
- course catalog,
- past training/enrollments/completions.

Expose through a provider-style API so the main system can later swap mock/real iGOT integrations.

## Phase 3 - Competency engine

Status: not started

- define competency ontology for Official Statistical System use cases,
- model required competency level per role,
- combine evidence from profile/training/assessments,
- compute current competency estimate + confidence,
- compute prioritized role gap vector,
- store competency evidence and snapshots.

## Phase 4 - Recommendation engine

Status: not started

- ingest available course metadata,
- rank courses by gap coverage,
- account for difficulty/role/history/redundancy,
- generate explainable recommendation reasons,
- build sequenced learning paths.

## Phase 5 - Assessment and MCQ generation

Status: not started

- upload learning material,
- extract/clean text,
- semantic chunking,
- grounded MCQ generation,
- source-linked answers/explanations,
- assessment attempts/scoring,
- feed results back into competency evidence.

## Phase 6 - Dashboards

Status: placeholder only

Learner:
- competency profile,
- role readiness,
- prioritized gaps,
- next recommended action,
- learning path,
- progress over time.

Admin:
- employee x competency matrix,
- department gaps,
- training effectiveness,
- high-priority workforce gaps,
- readiness trends.

## Phase 7 - Production hardening

- external/approved SSO if available,
- authorization and admin roles,
- security/rate-limit/recovery flows,
- staging/production separation,
- observability,
- automated tests,
- privacy/data-retention review,
- custom domain before final/public deployment if available.

## Development discipline

Every completed phase should update:
- relevant architecture docs,
- `00-repository-map.md` when structure changes,
- `16-development-log.md` for significant milestones.
