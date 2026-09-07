# Repository Map

Last updated: 2026-08-28

This file answers the practical question: **which file does what?**

## Root

| Path | Purpose |
|---|---|
| `README.md` | High-level project status and documentation index. |
| `package.json` | Worker development/deployment scripts and dependencies. |
| `wrangler.jsonc` | Cloudflare Worker entry point plus static-asset binding. |
| `src/worker.js` | Active backend. Handles auth, sessions, profile APIs, Neon access and static asset routing. |
| `.gitignore` | Files that must not be committed. Secrets must remain outside Git. |

## Frontend

Directory: `sih-ai-learning-platform/frontend/`

| File | Purpose |
|---|---|
| `index.html` | Public SIH26101 landing page. No direct credential collection on the home page. |
| `login.html` | Dedicated prototype login screen. |
| `register.html` | Prototype account registration screen. |
| `onboarding.html` | First-time user profile collection. |
| `dashboard.html` | Authenticated dashboard placeholder. |
| `styles.css` | Base visual system and shared login/landing styles. |
| `alignment-fixes.css` | Layout-only responsive overrides for landing/login. |
| `register.css` | Isolated registration-page responsive styling. |
| `onboarding.css` | Onboarding/profile form styling. |
| `app.js` | Login UI behavior and calls to `/api/auth/login`. |
| `register.js` | Registration form behavior and calls to `/api/auth/register`. |
| `onboarding.js` | Dynamic education/experience/course/skill rows and profile save calls. |
| `_headers` | Static security-related response header configuration where supported. |
| `google6603f76e5906e835.html` | Google Search Console ownership verification file. **Do not delete while property verification is needed.** |
| `README.md` | Frontend-specific notes. |

## Backend

### Active backend

`src/worker.js`

Responsibilities:
- connects to Neon using the Cloudflare `DATABASE_URL` secret,
- hashes passwords using PBKDF2-SHA256 with random salts,
- verifies login passwords,
- creates random session tokens,
- stores only hashed session tokens in the database,
- sets HttpOnly/Secure/SameSite session cookies,
- exposes auth/profile APIs,
- serves frontend static assets through the `ASSETS` binding.

### Placeholder backend directory

`sih-ai-learning-platform/backend/`

This predates the Worker implementation and should not be confused with the active backend. If the backend is later split into modules/services, this decision must be documented before moving code.

## AI service

`sih-ai-learning-platform/ai-service/`

Currently placeholder territory for:
- competency engine,
- recommendation engine,
- document processing,
- MCQ generation,
- embeddings/semantic matching.

## Documentation

Directory: `sih-ai-learning-platform/docs/`

Important files:
- `01-project-overview.md` - original project framing.
- `02-problem-statement.md` - SIH problem statement notes.
- `04-user-roles-and-flows.md` - user/role flow notes.
- `05-system-architecture.md` - actual deployed architecture and planned boundaries.
- `07-frontend-architecture.md` - current page/file/navigation structure.
- `08-ai-ml-architecture.md` - future AI/ML architecture.
- `09-database-design.md` - current proposed Neon schema and data ownership.
- `10-api-documentation.md` - currently implemented Worker API contract.
- `11-security.md` - password/session/secrets/security status.
- `12-iGOT-integration.md` - future iGOT/mock integration notes.
- `13-deployment.md` - Cloudflare + Neon deployment setup.
- `14-testing.md` - testing notes.
- `15-development-roadmap.md` - ordered build plan.
- `16-development-log.md` - chronological major changes.

## Trial workspace

`trial/`

Used for isolated experiments. Production code should not silently depend on anything in `trial/`.

## Team rule

When adding a file that introduces a new subsystem or changes how a subsystem works:
1. update this map if the file is structurally important,
2. update the relevant architecture/API/database/security/deployment `.md`,
3. add a short entry to `16-development-log.md`,
4. use a descriptive Git commit message.

That is the minimum documentation discipline. Future-us is still technically a stakeholder, unfortunately.
