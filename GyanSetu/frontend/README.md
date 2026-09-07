# Frontend

Cloudflare-served frontend for the SIH26101 competency intelligence prototype.

## Current pages

- `index.html` - public landing page
- `login.html` - dedicated prototype login
- `register.html` - prototype account creation
- `onboarding.html` - first-time profile collection
- `dashboard.html` - authenticated dashboard placeholder

## Current frontend/backend relationship

The frontend is static HTML/CSS/JS, but authentication is no longer fake client-side validation.

The browser calls the Cloudflare Worker backend:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/profile`
- `PUT /api/profile`

Active backend code lives at repository root in `src/worker.js`.

## Profile/onboarding data currently collected

- employment status
- current job title/designation
- department
- ministry/organisation
- years of experience
- current responsibilities
- target role
- education/qualifications
- work history
- completed courses
- self-reported skills

## Styling files

- `styles.css` - shared/base visual system
- `alignment-fixes.css` - landing/login layout corrections
- `register.css` - isolated registration page styling
- `onboarding.css` - onboarding/profile form styling

Registration has its own stylesheet intentionally because earlier shared standalone-login rules caused desktop alignment collisions.

## JavaScript files

- `app.js` - login behavior and backend login request
- `register.js` - registration request
- `onboarding.js` - repeatable profile sections and profile persistence

## Mobile behavior

The mobile landing page exposes a clear login CTA near the hero. Authentication is a separate page rather than stacking a complete desktop login below the landing content.

## Visual direction

The theme uses an iGOT-inspired public-service palette and spacing language, while remaining an original SIH26101 hackathon prototype.

It must not present itself as an official Government of India/iGOT/Parichay authentication page.

## Google Search Console verification

`google6603f76e5906e835.html` verifies ownership of the current URL-prefix Search Console property. Keep the file deployed while verification/security review is needed.

## Local development

Run from the repository root rather than this frontend directory:

```bash
npm install
npm run dev
```

Wrangler serves both the Worker backend and the frontend asset binding.

## Documentation

See:
- `../docs/00-repository-map.md`
- `../docs/07-frontend-architecture.md`
- `../docs/10-api-documentation.md`
- `../docs/11-security.md`
- `../docs/16-development-log.md`
