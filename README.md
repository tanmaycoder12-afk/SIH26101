# SIH26101

AI-enabled learning and competency intelligence platform for India's Official Statistical System.

The system is being built to:
- identify competency gaps against current/target roles,
- recommend personalized learning using iGOT-style course data,
- collect profile, education, work history, completed-course and skill evidence,
- generate assessments/MCQs from learning material,
- continuously update competency readiness.

## Current implementation status

Implemented now:
- Cloudflare Worker deployment
- static responsive frontend
- prototype landing, sign-in, registration, onboarding and dashboard screens
- Neon-backed registration/login/profile APIs
- server-side password hashing and secure session cookies
- onboarding collection for employment, education, work history, courses and skills
- Google Search Console verification file

Pending / next:
- commit the verified Neon schema migration to the main database
- finish production database secret configuration
- competency engine
- mock iGOT integration server
- course recommendation engine
- document-to-MCQ pipeline
- richer dashboard and admin analytics

## Important directories

- `src/worker.js` - current Cloudflare Worker backend and API router
- `sih-ai-learning-platform/frontend/` - current deployed frontend
- `sih-ai-learning-platform/docs/` - architecture and project documentation
- `sih-ai-learning-platform/backend/` - older placeholder directory; active backend currently lives in `src/worker.js`
- `sih-ai-learning-platform/ai-service/` - placeholder for future AI services
- `trial/` - isolated experiments/workspace

## Documentation

Start here:
- `sih-ai-learning-platform/docs/00-repository-map.md`
- `sih-ai-learning-platform/docs/05-system-architecture.md`
- `sih-ai-learning-platform/docs/07-frontend-architecture.md`
- `sih-ai-learning-platform/docs/09-database-design.md`
- `sih-ai-learning-platform/docs/10-api-documentation.md`
- `sih-ai-learning-platform/docs/11-security.md`
- `sih-ai-learning-platform/docs/13-deployment.md`
- `sih-ai-learning-platform/docs/15-development-roadmap.md`
- `sih-ai-learning-platform/docs/16-development-log.md`

## Documentation rule

Any meaningful architecture, API, database, deployment or file-structure change should update the relevant `.md` documentation in the same development cycle. The development log records major milestones so future contributors can understand why files exist and what changed.
