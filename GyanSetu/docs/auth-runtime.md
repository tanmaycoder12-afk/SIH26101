# GyanSetu Auth Runtime

This document describes the live prototype authentication path.

## Runtime flow

```text
Send OTP
  -> POST /api/auth/email/send-otp
  -> server generates a 6-digit code
  -> bcrypt hash stored in Neon
  -> Resend delivers the code by email

Verify OTP
  -> POST /api/auth/email/verify-otp
  -> Neon verifies the bcrypt OTP hash
  -> server returns a short-lived one-time verification token

Register
  -> POST /api/auth/register
  -> verification token is checked server-side
  -> password is bcrypt-hashed in PostgreSQL via pgcrypto
  -> user row and session are created
  -> HttpOnly session cookie is returned

Login
  -> POST /api/auth/login
  -> PostgreSQL verifies the bcrypt password hash
  -> a new session is created
```

## Why password hashing is in Neon

Cloudflare Workers have tight CPU limits. The previous implementation performed 210,000 PBKDF2 iterations inside the Worker, which could exhaust the Worker CPU budget before account creation completed. Password hashing and verification now use PostgreSQL `pgcrypto` / bcrypt, so the Worker only performs lightweight request/session work.

## Required Neon migration

Apply:

```text
migrations/002_auth_runtime_hardening.sql
```

It enables `pgcrypto` and creates `email_verification_challenges`.

## Required Cloudflare secrets

```text
DATABASE_URL
RESEND_API_KEY
AUTH_FROM_EMAIL
```

For a prototype Resend sender, `AUTH_FROM_EMAIL` can be configured as the sender allowed by the Resend account, for example:

```text
GyanSetu <onboarding@resend.dev>
```

For production, use an address on a verified sending domain.

## Health check

`GET /api/health` reports database readiness and whether email delivery secrets are configured.

## OTP controls

- 6-digit code
- 10-minute expiry
- 60-second resend delay per email
- maximum 5 verification attempts
- OTP is never returned to the browser
- registration requires a one-time server-issued verification token
