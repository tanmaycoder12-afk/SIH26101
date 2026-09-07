# GyanSetu UI Stock Library

Last updated: 2026-08-30

This library converts the approved GyanSetu reference screens into reusable frontend primitives rather than storing one-off screenshot copies. The current visual system uses a warm cream public-service/education theme, navy + saffron/orange primary colors, teal/green accents, soft dotted ornaments, tricolor corner ribbons, bridge/learning symbolism and dark high-priority CTAs.

## Live inventory

Open `/ui-library.html` in the deployed site to inspect reusable elements.

## Files

- `frontend/ui/gyansetu-logo.svg` — scalable bridge/learner/book/data/pathway brand mark.
- `frontend/ui/gyansetu-icons.svg` — reusable SVG symbol sprite.
- `frontend/ui/gyansetu-components.css` — base GyanSetu tokens/components.
- `frontend/ui/gyansetu-landing.css` — landing-screen composition from reference picture 1.
- `frontend/ui/gyansetu-auth.css` — reusable login + two-step registration composition from reference pictures 2–4.
- `frontend/ui-library.html` — visual catalogue/showcase.

## Picture-to-page mapping

### Reference picture 1 → `index.html`
Implemented elements:
- central GyanSetu mark + navy/orange wordmark,
- graduation-cap divider,
- `Bridging competency gaps through learning` tagline,
- `Your pathway to continuous growth` headline,
- four-stage journey: Identify / Learn / Track / Grow,
- dark pill Log In and Register CTAs,
- four supporting trust/use-case items,
- cream canvas, saffron/teal corner ribbons, dotted texture and floating education icons.

### Reference picture 2 → `login.html`
Implemented elements:
- left GyanSetu identity block,
- `For India’s Official Statistical System` use-case line,
- `How to log in?` four-step visual guide,
- explanatory prototype safety note,
- right white authentication card,
- bridge header ornament,
- email + password icon fields,
- password visibility control,
- Forgot Password visual link,
- dark Log In CTA,
- Register secondary link.

### Reference picture 4 → `register.html` Step 1
Implemented elements:
- GyanSetu identity block,
- `How to register?` four-step visual guide,
- MoSPI information strip,
- Organisation dropdown,
- Designation dropdown,
- Government Employee Email field,
- OTP verification box,
- demo OTP generation/verification,
- dark Next CTA,
- two-stage progress stepper.

### Reference picture 3 → `register.html` Step 2
Implemented elements:
- dynamic left-side `You’re Almost There!` state,
- profile-card / learning-road / bridge / book illustration,
- Secure Account / Personalized Experience / Ready to Learn benefit cards,
- Full Name,
- Employee / Personnel ID,
- Mobile Number,
- Password,
- Confirm Password,
- secure-account guidance card,
- Create Account CTA,
- Sign in secondary link.

The left registration illustration changes when moving from Step 1 to Step 2 so the website follows the supplied screens state-by-state instead of merely borrowing their colors.

## Reusable visual primitives

### Page canvas and ribbons
- `.gs-page`, `.gs-shell`
- `.gs-auth-page`, `.gs-auth-layout`
- `.gs-wave-lines`, `.gs-dot-field`

### Brand system
- `.gs-logo`, `.gs-brand-word`, `.gs-brand-rule`, `.gs-tagline`
- `.gs-brand-lockup`, `.gs-brand-mark`, `.gs-brand-name`, `.gs-brand-divider`, `.gs-oss-line`

### Landing journey
- `.gs-growth-title`, `.gs-growth-subtitle`
- `.gs-feature-grid`, `.gs-feature-card`, `.gs-feature-icon`
- `.gs-home-actions`, `.gs-trust-row`, `.gs-trust-item`

### Authentication guide
- `.gs-guide-card`, `.gs-guide-title`
- `.gs-flow-steps`, `.gs-flow-step`, `.gs-flow-icon`, `.gs-flow-number`
- `.gs-info-strip`

### Forms
- `.gs-form-card`, `.gs-card-bridge`, `.gs-form-heading`
- `.gs-field`, `.gs-input-wrap`, `.gs-icon-button`
- `.gs-primary-dark`, `.gs-secondary-line`, `.gs-secondary-link`
- `.status-message`

### Registration-specific
- `.gs-stepper`, `.gs-step`, `.gs-stepper-track`
- `.gs-ministry-note`
- `.gs-verification-box`, `.gs-small-dark`, `.gs-otp-panel`, `.gs-otp-row`
- `.gs-security-box`, `.gs-step-actions`, `.gs-back-button`
- `.gs-journey-card`, `.gs-journey-visual`, `.gs-profile-card`, `.gs-bridge-art`, `.gs-book-orb`, `.gs-benefits`

## SVG sprite inventory

Current sprite IDs include:
- `icon-book`
- `icon-cap`
- `icon-chart`
- `icon-bulb`
- `icon-gear`
- `icon-login`
- `icon-register`
- `icon-arrow`
- `icon-building`
- `icon-search`
- `icon-user-star`
- `icon-shield`
- `icon-award`
- `icon-users`
- `icon-devices`
- `icon-mail`
- `icon-lock`
- `icon-eye`
- `icon-dashboard`
- `icon-org`
- `icon-id`
- `icon-phone`
- `icon-send`
- `icon-info`
- `icon-check`
- `icon-bridge`
- `icon-target`

## Design tokens

Primary reusable variables:
- `--gs-navy`
- `--gs-blue`
- `--gs-teal`
- `--gs-green`
- `--gs-saffron`
- `--gs-orange`
- `--gs-cream`
- `--gs-ink`
- `--gs-shadow-soft`
- `--gs-shadow-cta`
- `--gs-radius-pill`

Do not create page-specific copies of these colors unless there is a deliberate exception.

## Maintenance rule

When a visual element becomes reusable across two or more screens:
1. put the asset/component under `frontend/ui/`,
2. expose it in `ui-library.html` when practical,
3. document it here,
4. make production screens consume the library instead of duplicating markup/styles.

The authentication pages now share `gyansetu-auth.css`; landing-specific composition lives in `gyansetu-landing.css`; base design tokens and global brand pieces stay in `gyansetu-components.css`.
