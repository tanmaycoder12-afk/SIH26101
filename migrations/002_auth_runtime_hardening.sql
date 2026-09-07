-- SIH26101 auth runtime hardening
-- Adds PostgreSQL-side password hashing support and server-side email OTP challenges.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS email_verification_challenges (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  verification_token_hash TEXT,
  registration_consumed_at TIMESTAMPTZ,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_verification_email_created
  ON email_verification_challenges(email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_verification_active
  ON email_verification_challenges(email, expires_at)
  WHERE consumed_at IS NULL;
