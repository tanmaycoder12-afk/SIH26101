# Frontend Architecture

Last updated: 2026-08-29

The current frontend is deliberately framework-light: static HTML/CSS/JS served by the Cloudflare Worker asset binding. There is no React/Vite build step yet.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Public landing page. Describes the SIH26101 prototype and routes users to sign in/register. |
| `login.html` | Dedicated prototype login screen. Calls the Worker login API and now uses its own isolated stylesheet. |
| `register.html` | Two-step iGOT-style prototype registration flow. Collects organisation context, designation, email verification state, then account details before calling the Worker registration API. |
| `onboarding.html` | Collects employment/profile/education/work/course/skill data after first registration. |
| `dashboard.html` | Authenticated dashboard placeholder for the next development phase. |
| `google6603f76e5906e835.html` | Google Search Console verification file. Do not remove while verification is required. |

## JavaScript

| File | Responsibility |
|---|---|
| `app.js` | Login validation, password visibility and `/api/auth/login` handoff. |
| `register.js` | Two-step registration state, Center/State directory options, demo OTP generation/verification, final `/api/auth/register` submission and temporary registration-context handoff. |
| `onboarding.js` | Dynamic repeated profile sections, pre-fills organisation/designation from registration context, and submits `PUT /api/profile`. |

## CSS

| File | Responsibility |
|---|---|
| `styles.css` | Shared SIH/public-service visual language and base components. |
| `alignment-fixes.css` | Landing responsive alignment overrides. |
| `login.css` | Dedicated login layout. Must not depend on `register.css`; this isolation prevents registration redesigns from breaking login rendering. |
| `register.css` | Isolated two-step registration layout, animated guide panel, responsive stepper, verification card and lightweight 3D/motion effects. |
| `onboarding.css` | Profile/onboarding forms and responsive layout. |

## Registration UX

The registration page intentionally follows the public iGOT onboarding structure shown in the SIH research/reference flow without claiming to be an official iGOT service.

### Step 1
- Center / State selection
- Ministry / Department
- Organisation / MDO
- Designation
- email address
- OTP request and verification

The current OTP delivery is **prototype-only**. A random code is generated in-browser and displayed on the page because no email/SMS delivery provider is connected yet. The UI clearly labels this as demo delivery.

### Step 2
- full name
- group
- mobile number
- prototype password
- declaration
- account creation

After successful registration, the selected ministry/organisation/designation context is stored temporarily in `sessionStorage` and used to pre-fill matching onboarding fields. The context is cleared after profile save.

## Motion / component inspiration

The left registration guide uses locally implemented CSS transforms, floating cards, depth, subtle perspective, progress animation and reduced-motion support. These interaction patterns are inspired by modern open-source component libraries such as Watermelon UI, but the project does not currently import React, Tailwind or Framer Motion.

This keeps the deployed static Worker build simple while allowing a future framework migration if state/component complexity justifies it.

## Responsive behavior

### Desktop
- landing content and prototype-access panel use a split layout,
- registration uses a blue instructional/visual panel plus a dedicated registration form panel,
- registration Step 1 and Step 2 animate in-place rather than changing routes,
- login uses its own split hero/form layout controlled by `login.css`.

### Mobile
- landing page shows the hero and a clear login CTA early,
- login is a separate page rather than a very tall stacked desktop layout,
- registration guide compresses into a shorter visual intro and the form follows below,
- registration controls, OTP entry and navigation buttons collapse to one-column layouts where needed.

## Navigation flow

```text
index.html
 |-- login.html
 |      `-- successful login -> onboarding.html or dashboard.html
 |
 `-- register.html
        |-- Step 1: organisation + email verification
        |-- Step 2: account details
        `-- successful registration -> onboarding.html
                                      `-- save -> dashboard.html
```

## Styling isolation rule

Login and registration are intentionally separate styling domains. `login.html` must load `login.css`; `register.html` must load `register.css`. Do not reuse one page-specific stylesheet for the other. Shared primitives belong in `styles.css` only.

## Branding/security note

The interface uses a public-service/iGOT-inspired blue/saffron visual language, but it must remain visibly labelled as an SIH26101 hackathon prototype and not claim to be an official iGOT/Parichay/Government of India authentication service.

Credential pages must continue to explain that prototype accounts are independent from external government identity systems.

## Future frontend direction

A framework migration should only happen when component/state complexity justifies it. If React/Vite/etc. is introduced, document the reason, build path and routing strategy before removing the current static pages.
