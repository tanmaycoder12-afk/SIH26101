# Development Log

This log records major implementation changes so contributors can reconstruct what happened without reverse-engineering every commit.

## 2026-08-30

### GyanSetu reference-by-reference authentication implementation
- Applied the supplied GyanSetu reference screens directly to the production landing/login/registration frontend rather than keeping them as mockups only.
- Added `frontend/ui/gyansetu-auth.css` as the shared authentication UI system for cream public-service surfaces, tricolor corner ribbons, dotted ornaments, instructional panels, white form cards, stepper, OTP UI and responsive behavior.
- Added `frontend/ui/gyansetu-landing.css` for the expanded landing reference composition.
- Expanded `gyansetu-icons.svg` with authentication, organisation, security, learner, device, bridge, target, ID and communication symbols.
- `index.html` now follows reference picture 1 with the GyanSetu hero, continuous-growth headline, Identify/Learn/Track/Grow row, Log In/Register CTAs and supporting trust/use-case strip.
- `login.html` now follows reference picture 2 with a GyanSetu identity/How-to-login panel on the left and a white Welcome Back form card on the right. Existing `/api/auth/login` hooks and field IDs were preserved.
- `register.html` Step 1 now follows reference picture 4 with MoSPI context, Organisation, Designation, Government Employee Email, OTP verification and Next CTA.
- `register.html` Step 2 now follows reference picture 3 with the `You're Almost There!` illustration state plus Full Name, Employee/Personnel ID, Mobile, Password and Confirm Password fields.
- Updated `register.js` to switch both the form and the left-side illustration between Step 1 and Step 2, preserve demo OTP verification, validate confirmation/mobile/employee ID and continue calling `/api/auth/register`.
- Updated `app.js` so password visibility toggling preserves the new eye-icon control and login database dependency errors remain user-friendly.
- Expanded `docs/17-ui-stock-library.md` with picture-to-page mapping and the reusable auth component inventory.

### GyanSetu reusable UI stock library
- Rebuilt the root landing page around the approved cream/saffron/teal GyanSetu visual direction with direct Log In and Register actions.
- Added `frontend/ui/gyansetu-logo.svg` as the scalable brand mark rather than embedding a page-specific raster logo.
- Added `frontend/ui/gyansetu-icons.svg` as a reusable SVG symbol sprite for book, graduation cap, chart, bulb, gear, login, register, arrow and civic-building motifs.
- Added `frontend/ui/gyansetu-components.css` containing the shared GyanSetu design tokens and reusable components for page canvas, corner waves, halftone texture, wordmark, tagline, CTA pills, floating icons, cards, badges and responsive behavior.
- Added `/ui-library.html` as a live component catalogue so future contributors can visually inspect and copy supported primitives.
- Added `docs/17-ui-stock-library.md` with an element-by-element breakdown, file map, tokens and usage examples.
- Landing-page components now consume the shared library rather than owning private copies. New reusable elements should be promoted into `frontend/ui/` instead of duplicated across screens.

## 2026-08-29

### Login visual polish + database activation prep
- Added `login-polish.css` as a dedicated visual override layer so glow/motion can be tuned without changing the stable iGOT-style login structure.
- Added subtle animated blue/orange glows, pattern drift, center-orb shimmer, ring pulse, icon depth, input focus elevation and button sheen.
- Added reduced-motion handling so the decorative motion can be disabled by user preference.
- Improved login API error presentation so missing database configuration no longer exposes raw infrastructure wording to normal users.
- Added canonical SQL migration file `migrations/001_auth_profile_schema.sql` containing the auth/profile tables expected by `src/worker.js`.
- Cloudflare still requires a Worker secret named `DATABASE_URL`; it must contain the Neon `stoicdb` main-branch connection string and must not be committed to Git.
- The connected Neon management tool currently has an argument-schema mismatch when executing migrations/queries, so production schema application was not falsely marked complete from ChatGPT. Use the canonical migration file if manual Neon SQL Editor execution is required.

### iGOT-style login redesign
- Reworked `login.html` from a large SaaS-style hero/card layout into an iGOT-inspired split authentication page.
- Left side now uses a government-style instructional blue panel with technical patterning, four explanatory callouts and a central circular `How to Sign In` visual.
- Right side is now a flatter white form panel with sharper field borders, compact labels, a blue primary action and much less decorative card styling.
- Kept prominent prototype language on both sides so the page remains clearly independent from official iGOT/Government identity systems.
- Login keeps its own isolated `login.css`; registration remains on `register.css` so the two flows cannot break each other through shared layout classes.

### iGOT-style registration rebuild
- Rebuilt `register.html` around the public iGOT registration structure shown in the SIH reference flow.
- Registration is now a two-step experience instead of a generic name/email/password form.
- Step 1 collects Center/State, Ministry/Department, Organisation/MDO, Designation and email verification.
- Step 2 collects name, group, mobile number, prototype password and declaration before account creation.
- Added Center/State-specific sample directory data for prototype testing.
- Added demo OTP generation and verification. The generated OTP is shown on-screen because no email/SMS provider is connected yet; the interface labels this clearly as prototype delivery.
- Added a two-step animated progress indicator and contextual organisation help message.
- Carried registration organisation/designation context into onboarding through temporary `sessionStorage` so users are not forced to re-enter the same information immediately.
- Rebuilt `register.css` with an iGOT-inspired instructional left panel plus locally implemented depth, perspective, floating cards and motion patterns inspired by modern open-source component systems such as Watermelon UI.
- Motion remains framework-free and respects `prefers-reduced-motion`; React/Tailwind/Framer Motion were not added to the current static frontend.

## 2026-08-28

### Frontend foundation
- Built the first SIH26101 landing/login experience using an iGOT-inspired blue/saffron/cream theme.
- Added responsive desktop/mobile layouts.
- Restored the hero line: **“Build the skills your role actually needs.”**
- Split mobile landing and login into separate screens so login is immediately reachable without scrolling through a stacked desktop layout.

### Cloudflare deployment
- Added root `wrangler.jsonc` so Cloudflare can deploy the nested frontend correctly.
- Added Worker/static-assets routing.
- Root Worker entry point is now `src/worker.js`.
- Root `package.json` contains Wrangler and Neon serverless dependencies.

### Prototype account system
- Added `register.html` and `register.js`.
- Added dedicated responsive `register.css` after discovering CSS collisions with standalone login rules.
- Added `/api/auth/register` and `/api/auth/login` Worker endpoints.
- Added logout/current-user endpoints.
- Added server-side PBKDF2-SHA256 password hashing with random salts.
- Added random session tokens, hashed storage and HttpOnly/Secure session cookies.

### Backend diagnostics
- Registration exposed a generic `Server error.` when database setup failed.
- Added safe database error classification for missing Cloudflare `DATABASE_URL`, unreachable database, and missing Neon schema.
- Added `GET /api/health` to report Worker/database/schema readiness without exposing connection strings or credentials.
- Frontend API calls automatically surface these clearer backend messages because they already read the API `error` field.

### Onboarding/profile collection
- Added `onboarding.html`, `onboarding.js` and `onboarding.css`.
- Profile flow collects current employment status, current role/designation, department/organisation, experience, education, previous jobs, completed courses and skills.
- Added `/api/profile` GET/PUT endpoints.
- Added a dashboard placeholder for authenticated users.

### Neon database
- Located existing Neon project `stoicdb`.
- Prepared and verified an application schema on a temporary migration branch.
- Migration ID: `e534239c-6e64-408f-9250-abeb9b9dc902`.
- Main Neon branch has **not** been modified yet; explicit approval is still required.

### Safe Browsing / Search Console
- Chrome/Google Safe Browsing flagged the current `workers.dev` hostname as deceptive.
- Removed direct credential collection from the landing page.
- Added Google Search Console verification file `google6603f76e5906e835.html` and verified the URL-prefix property.
- Search Console reports the security issue as `Deceptive pages` with no sample URLs.
- Performed a second remediation pass before review: credential pages were fully de-branded from external/government identity language and now identify only as `SIH26101 Prototype` / `Student Hackathon Demo`.
- Login/register explicitly accept only prototype accounts created on this site and tell users not to reuse credentials from any external service.
- Landing keeps the SIH/public-service visual direction but identifies itself as an independent student prototype and does not collect credentials.

### Documentation cleanup
- Expanded the root README with current implementation status and docs index.
- Added `00-repository-map.md` describing what each important file does.
- Filled previously placeholder system/frontend/database/API/security/deployment/roadmap docs with the actual architecture and status.
- Updated `11-security.md` with the Safe Browsing remediation rules for future auth-page changes.
- Updated `10-api-documentation.md` with the health endpoint and backend dependency status codes.

## Rule for future entries

Add a short entry whenever one of these changes:
- system boundary/architecture,
- database schema,
- API contract,
- authentication/security behavior,
- deployment setup,
- major user flow,
- important file/directory structure.

Do not log every pixel tweak or typo. Git already has enough feelings about those.
