# Security

Last updated: 2026-08-28

## Prototype status

This is an independent SIH26101 student hackathon prototype. It is not an official identity service for any external organisation.

The current `workers.dev` production hostname has been classified by Google Safe Browsing as containing deceptive pages. Google Search Console ownership is verified and remediation/review is in progress. Do not treat local Chrome bypasses as a fix.

## Safe Browsing remediation

Google defines deceptive pages as pages that may look like a trusted entity or try to obtain information such as passwords in a way users would normally reserve for a trusted entity.

Remediation applied on 2026-08-28:
- landing page no longer collects credentials,
- credential pages no longer use external/government identity branding,
- login and registration identify themselves as `SIH26101 Prototype` / `Student Hackathon Demo`,
- credential pages state that they accept only accounts created specifically for this prototype,
- users are told not to reuse credentials from other websites or services,
- inactive external SSO/Parichay-style controls are not presented as working authentication,
- Google Search Console ownership file remains deployed for review.

The public-service/iGOT-inspired visual direction may remain on non-credential product surfaces, but authentication surfaces must stay clearly independent and prototype-branded.

## Password handling

Current implementation: `src/worker.js`.

Passwords are:
- received by the Worker over HTTPS,
- hashed server-side,
- salted with a random 16-byte salt,
- derived using PBKDF2-SHA256,
- currently configured for 210,000 iterations,
- stored only as the encoded derived hash/salt/iteration record.

Plaintext passwords must never be written to logs, Git, localStorage or the database.

## Sessions

After registration/login:
- Worker generates a random 32-byte session token,
- SHA-256 hash of the token is stored in `user_sessions`,
- raw token is sent only as the `sih_session` cookie,
- cookie flags: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`,
- default session lifetime: 7 days,
- logout revokes the stored session and clears the cookie.

## Secrets

`DATABASE_URL` must be configured as a Cloudflare Worker secret/environment binding.

Never commit:
- Neon connection strings,
- database passwords,
- API keys,
- OAuth/client secrets,
- private signing keys.

## Database access

The browser must never directly receive the privileged Neon connection string. All current database access goes through the Worker.

## Authentication branding rules

Requirements for any page that collects credentials:
- identify the page as an independent SIH26101 student/hackathon prototype,
- do not use external organisation/government identity branding,
- do not request credentials from external services,
- do not present inactive external SSO as a real login method,
- tell users to create/use a unique prototype test password,
- keep the public landing page free of direct credential collection.

## Google Search Console verification

File:
`frontend/google6603f76e5906e835.html`

Purpose: URL-prefix ownership verification for the current Worker hostname. Do not delete it while verification/review depends on it.

## Future work

Before real production use:
- replace prototype auth with an approved identity architecture if external SSO is formally authorized,
- add CSRF analysis/protection where required,
- add rate limiting for login/register endpoints,
- add account recovery policy,
- add structured security logging without secrets/PII leakage,
- add authorization/roles for admin APIs,
- review retention/deletion/privacy requirements,
- perform dependency/security scanning and threat modeling.
