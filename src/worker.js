import { neon } from '@neondatabase/serverless';

const SESSION_COOKIE = 'sih_session';
const SESSION_DAYS = 7;
const OTP_TTL_MINUTES = 10;
const OTP_RESEND_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;
const RESEND_API_URL = 'https://api.resend.com/emails';

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });
}

function badRequest(message, code = 'BAD_REQUEST') {
  return json({ error: message, code }, 400);
}

function unauthorized(message = 'Authentication required.') {
  return json({ error: message }, 401);
}

function getSql(env) {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }
  return neon(env.DATABASE_URL);
}

function errorMessage(error) {
  return String(error?.message || error || '');
}

function isMissingRelation(error) {
  const message = errorMessage(error).toLowerCase();
  return message.includes('does not exist') && message.includes('relation');
}

function databaseErrorResponse(error) {
  const message = errorMessage(error);
  const lower = message.toLowerCase();

  if (lower.includes('database_url is not configured')) {
    return json({
      error: 'Database is not configured on Cloudflare yet. Add the DATABASE_URL Worker secret.',
      code: 'DATABASE_NOT_CONFIGURED',
    }, 503);
  }

  if (isMissingRelation(error)) {
    return json({
      error: 'Database schema is not initialized yet. Apply the verified SIH26101 Neon migration.',
      code: 'DATABASE_SCHEMA_MISSING',
    }, 503);
  }

  if (
    lower.includes('connection') ||
    lower.includes('fetch failed') ||
    lower.includes('password authentication failed') ||
    lower.includes('invalid connection')
  ) {
    return json({
      error: 'Could not connect to the database. Check the Cloudflare DATABASE_URL secret.',
      code: 'DATABASE_CONNECTION_FAILED',
    }, 503);
  }

  return null;
}

function bytesToHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

function randomToken() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

function randomOtp() {
  const random = new Uint32Array(1);
  crypto.getRandomValues(random);
  return String(100000 + (random[0] % 900000));
}

function parseCookies(request) {
  const cookie = request.headers.get('cookie') || '';
  return Object.fromEntries(
    cookie.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
      const index = part.indexOf('=');
      return index === -1 ? [part, ''] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
    }),
  );
}

function sessionCookie(token, maxAge = SESSION_DAYS * 24 * 60 * 60) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

async function createSession(sql, userId) {
  const rawToken = randomToken();
  const tokenHash = await sha256Hex(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await sql`INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (${userId}, ${tokenHash}, ${expiresAt})`;
  return rawToken;
}

async function getCurrentUser(request, sql) {
  const rawToken = parseCookies(request)[SESSION_COOKIE];
  if (!rawToken) return null;
  const tokenHash = await sha256Hex(rawToken);
  const rows = await sql`
    SELECT u.id, u.email, u.full_name, u.phone, u.onboarding_completed
    FROM user_sessions s
    JOIN app_users u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenHash}
      AND s.revoked_at IS NULL
      AND s.expires_at > now()
    LIMIT 1
  `;
  return rows[0] || null;
}

async function requireUser(request, sql) {
  const user = await getCurrentUser(request, sql);
  if (!user) return { response: unauthorized() };
  return { user };
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function otpDeliveryConfigured(env) {
  return Boolean(env.RESEND_API_KEY && env.AUTH_FROM_EMAIL);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function sendOtpEmail(env, email, otp) {
  if (!otpDeliveryConfigured(env)) {
    return {
      ok: false,
      response: json({
        error: 'Email delivery is not configured yet. Add RESEND_API_KEY and AUTH_FROM_EMAIL Worker secrets.',
        code: 'EMAIL_DELIVERY_NOT_CONFIGURED',
      }, 503),
    };
  }

  const safeEmail = escapeHtml(email);
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.AUTH_FROM_EMAIL,
      to: [email],
      subject: 'Your GyanSetu verification code',
      html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#102a43"><h2>GyanSetu email verification</h2><p>Use this one-time code to verify <strong>${safeEmail}</strong>:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>This code expires in ${OTP_TTL_MINUTES} minutes. If you did not request it, you can ignore this email.</p></div>`,
      tags: [{ name: 'category', value: 'email_verification' }],
    }),
  });

  if (!response.ok) {
    const providerText = await response.text().catch(() => '');
    console.error('OTP email provider error:', response.status, providerText.slice(0, 500));
    return {
      ok: false,
      response: json({
        error: 'Could not send the verification email. Check the configured sender and try again.',
        code: 'EMAIL_DELIVERY_FAILED',
      }, 502),
    };
  }

  return { ok: true };
}

async function handleHealth(env) {
  if (!env.DATABASE_URL) {
    return json({
      ok: false,
      worker: true,
      databaseConfigured: false,
      databaseReachable: false,
      schemaReady: false,
      emailDeliveryConfigured: otpDeliveryConfigured(env),
    }, 503);
  }

  const sql = getSql(env);

  try {
    await sql`SELECT 1 AS ok`;
  } catch {
    return json({
      ok: false,
      worker: true,
      databaseConfigured: true,
      databaseReachable: false,
      schemaReady: false,
      emailDeliveryConfigured: otpDeliveryConfigured(env),
    }, 503);
  }

  try {
    await sql`SELECT 1 FROM app_users LIMIT 1`;
    await sql`SELECT 1 FROM user_sessions LIMIT 1`;
    await sql`SELECT 1 FROM email_verification_challenges LIMIT 1`;
    await sql`SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' LIMIT 1`;
  } catch (error) {
    if (isMissingRelation(error)) {
      return json({
        ok: false,
        worker: true,
        databaseConfigured: true,
        databaseReachable: true,
        schemaReady: false,
        emailDeliveryConfigured: otpDeliveryConfigured(env),
      }, 503);
    }
    throw error;
  }

  return json({
    ok: true,
    worker: true,
    databaseConfigured: true,
    databaseReachable: true,
    schemaReady: true,
    emailDeliveryConfigured: otpDeliveryConfigured(env),
  });
}

async function handleSendOtp(request, env) {
  const body = await readJson(request);
  if (!body) return badRequest('Invalid JSON body.');

  const email = normalizeEmail(body.email);
  if (!validEmail(email)) return badRequest('Enter a valid email address.', 'INVALID_EMAIL');

  const sql = getSql(env);
  const existing = await sql`SELECT id FROM app_users WHERE email = ${email} LIMIT 1`;
  if (existing.length) {
    return json({ error: 'An account with this email already exists.', code: 'EMAIL_ALREADY_REGISTERED' }, 409);
  }

  const recent = await sql`
    SELECT created_at
    FROM email_verification_challenges
    WHERE email = ${email}
      AND created_at > now() - (${OTP_RESEND_SECONDS} * interval '1 second')
    ORDER BY created_at DESC
    LIMIT 1
  `;
  if (recent.length) {
    return json({
      error: `Please wait ${OTP_RESEND_SECONDS} seconds before requesting another OTP.`,
      code: 'OTP_RATE_LIMITED',
    }, 429);
  }

  const otp = randomOtp();
  const challengeRows = await sql`
    INSERT INTO email_verification_challenges (email, otp_hash, expires_at)
    VALUES (${email}, crypt(${otp}, gen_salt('bf', 8)), now() + (${OTP_TTL_MINUTES} * interval '1 minute'))
    RETURNING id
  `;
  const challengeId = challengeRows[0]?.id;

  const delivery = await sendOtpEmail(env, email, otp);
  if (!delivery.ok) {
    await sql`
      UPDATE email_verification_challenges
      SET consumed_at = now()
      WHERE id = ${challengeId}
    `;
    return delivery.response;
  }

  return json({ ok: true, expiresInSeconds: OTP_TTL_MINUTES * 60 });
}

async function handleVerifyOtp(request, env) {
  const body = await readJson(request);
  if (!body) return badRequest('Invalid JSON body.');

  const email = normalizeEmail(body.email);
  const otp = String(body.otp || '').trim();
  if (!validEmail(email)) return badRequest('Enter a valid email address.', 'INVALID_EMAIL');
  if (!/^\d{6}$/.test(otp)) return badRequest('Enter the 6-digit OTP.', 'INVALID_OTP');

  const sql = getSql(env);
  const rows = await sql`
    SELECT id, attempts, crypt(${otp}, otp_hash) = otp_hash AS matches
    FROM email_verification_challenges
    WHERE email = ${email}
      AND consumed_at IS NULL
      AND verified_at IS NULL
      AND expires_at > now()
      AND attempts < ${OTP_MAX_ATTEMPTS}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const challenge = rows[0];
  if (!challenge) {
    return json({
      error: 'The OTP has expired or too many attempts were made. Request a new code.',
      code: 'OTP_EXPIRED',
    }, 400);
  }

  if (!challenge.matches) {
    await sql`
      UPDATE email_verification_challenges
      SET attempts = attempts + 1
      WHERE id = ${challenge.id}
    `;
    const attemptsLeft = Math.max(0, OTP_MAX_ATTEMPTS - Number(challenge.attempts || 0) - 1);
    return json({
      error: attemptsLeft
        ? `Incorrect OTP. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`
        : 'Incorrect OTP. Request a new code.',
      code: 'OTP_MISMATCH',
    }, 400);
  }

  const verificationToken = randomToken();
  const verificationTokenHash = await sha256Hex(verificationToken);
  await sql`
    UPDATE email_verification_challenges
    SET verified_at = now(), verification_token_hash = ${verificationTokenHash}
    WHERE id = ${challenge.id}
  `;

  return json({ ok: true, verificationToken });
}

async function handleRegister(request, env) {
  const body = await readJson(request);
  if (!body) return badRequest('Invalid JSON body.');

  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const fullName = String(body.fullName || '').trim() || null;
  const verificationToken = String(body.verificationToken || '').trim();
  const registrationContext = body.registrationContext || {};
  const phone = String(registrationContext.mobile || '').replace(/\D/g, '') || null;

  if (!validEmail(email)) return badRequest('Enter a valid email address.');
  if (password.length < 10) return badRequest('Password must be at least 10 characters.');
  if (!verificationToken) return badRequest('Verify your email before creating the account.', 'EMAIL_NOT_VERIFIED');

  const sql = getSql(env);
  const existing = await sql`SELECT id FROM app_users WHERE email = ${email} LIMIT 1`;
  if (existing.length) return json({ error: 'An account with this email already exists.' }, 409);

  const verificationTokenHash = await sha256Hex(verificationToken);
  const verifiedRows = await sql`
    SELECT id
    FROM email_verification_challenges
    WHERE email = ${email}
      AND verified_at IS NOT NULL
      AND registration_consumed_at IS NULL
      AND verification_token_hash = ${verificationTokenHash}
      AND verified_at > now() - interval '20 minutes'
    ORDER BY verified_at DESC
    LIMIT 1
  `;
  const verification = verifiedRows[0];
  if (!verification) {
    return badRequest('Email verification is missing or expired. Verify the email again.', 'EMAIL_NOT_VERIFIED');
  }

  const rows = await sql`
    INSERT INTO app_users (email, password_hash, full_name, phone)
    VALUES (${email}, crypt(${password}, gen_salt('bf', 12)), ${fullName}, ${phone})
    RETURNING id, email, full_name, phone, onboarding_completed
  `;
  const user = rows[0];

  await sql`
    UPDATE email_verification_challenges
    SET registration_consumed_at = now(), consumed_at = now()
    WHERE id = ${verification.id}
  `;

  const token = await createSession(sql, user.id);

  return json(
    { user, next: '/onboarding.html' },
    201,
    { 'set-cookie': sessionCookie(token) },
  );
}

async function handleLogin(request, env) {
  const body = await readJson(request);
  if (!body) return badRequest('Invalid JSON body.');

  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  if (!validEmail(email) || !password) return badRequest('Email and password are required.');

  const sql = getSql(env);
  const rows = await sql`
    SELECT id, email, full_name, onboarding_completed
    FROM app_users
    WHERE email = ${email}
      AND password_hash = crypt(${password}, password_hash)
    LIMIT 1
  `;
  const user = rows[0];
  if (!user) {
    return unauthorized('Incorrect email or password.');
  }

  const token = await createSession(sql, user.id);
  return json(
    {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        onboarding_completed: user.onboarding_completed,
      },
      next: user.onboarding_completed ? '/dashboard.html' : '/onboarding.html',
    },
    200,
    { 'set-cookie': sessionCookie(token) },
  );
}

async function handleLogout(request, env) {
  const sql = getSql(env);
  const rawToken = parseCookies(request)[SESSION_COOKIE];
  if (rawToken) {
    const tokenHash = await sha256Hex(rawToken);
    await sql`UPDATE user_sessions SET revoked_at = now() WHERE token_hash = ${tokenHash} AND revoked_at IS NULL`;
  }
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
}

async function handleMe(request, env) {
  const sql = getSql(env);
  const user = await getCurrentUser(request, sql);
  if (!user) return unauthorized();
  return json({ user });
}

async function handleProfileSave(request, env) {
  const sql = getSql(env);
  const auth = await requireUser(request, sql);
  if (auth.response) return auth.response;
  const body = await readJson(request);
  if (!body) return badRequest('Invalid JSON body.');

  const profile = body.profile || {};
  const education = Array.isArray(body.education) ? body.education : [];
  const experience = Array.isArray(body.experience) ? body.experience : [];
  const courses = Array.isArray(body.completedCourses) ? body.completedCourses : [];
  const skills = Array.isArray(body.skills) ? body.skills : [];

  await sql`
    INSERT INTO user_profiles (
      user_id, employment_status, current_job_title, designation, department,
      ministry_or_organization, years_experience, current_role_summary, target_role, updated_at
    ) VALUES (
      ${auth.user.id}, ${profile.employmentStatus || null}, ${profile.currentJobTitle || null},
      ${profile.designation || null}, ${profile.department || null}, ${profile.organization || null},
      ${profile.yearsExperience === '' || profile.yearsExperience == null ? null : Number(profile.yearsExperience)},
      ${profile.currentRoleSummary || null}, ${profile.targetRole || null}, now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      employment_status = EXCLUDED.employment_status,
      current_job_title = EXCLUDED.current_job_title,
      designation = EXCLUDED.designation,
      department = EXCLUDED.department,
      ministry_or_organization = EXCLUDED.ministry_or_organization,
      years_experience = EXCLUDED.years_experience,
      current_role_summary = EXCLUDED.current_role_summary,
      target_role = EXCLUDED.target_role,
      updated_at = now()
  `;

  await sql`DELETE FROM user_education WHERE user_id = ${auth.user.id}`;
  for (const item of education) {
    if (!item.degreeOrCertificate) continue;
    await sql`
      INSERT INTO user_education (
        user_id, qualification_level, degree_or_certificate, field_of_study,
        institution, start_year, end_year, is_current
      ) VALUES (
        ${auth.user.id}, ${item.qualificationLevel || 'Other'}, ${item.degreeOrCertificate},
        ${item.fieldOfStudy || null}, ${item.institution || null},
        ${item.startYear ? Number(item.startYear) : null}, ${item.endYear ? Number(item.endYear) : null},
        ${Boolean(item.isCurrent)}
      )
    `;
  }

  await sql`DELETE FROM user_work_experience WHERE user_id = ${auth.user.id}`;
  for (const item of experience) {
    if (!item.designation) continue;
    await sql`
      INSERT INTO user_work_experience (
        user_id, organization, designation, department, start_date, end_date, is_current, responsibilities
      ) VALUES (
        ${auth.user.id}, ${item.organization || null}, ${item.designation}, ${item.department || null},
        ${item.startDate || null}, ${item.endDate || null}, ${Boolean(item.isCurrent)}, ${item.responsibilities || null}
      )
    `;
  }

  await sql`DELETE FROM user_completed_courses WHERE user_id = ${auth.user.id}`;
  for (const item of courses) {
    if (!item.courseTitle) continue;
    await sql`
      INSERT INTO user_completed_courses (
        user_id, external_course_id, course_title, provider, completion_date, score, certificate_url
      ) VALUES (
        ${auth.user.id}, ${item.externalCourseId || null}, ${item.courseTitle}, ${item.provider || null},
        ${item.completionDate || null}, ${item.score === '' || item.score == null ? null : Number(item.score)},
        ${item.certificateUrl || null}
      )
    `;
  }

  await sql`DELETE FROM user_skills WHERE user_id = ${auth.user.id} AND source = 'self_reported'`;
  for (const item of skills) {
    if (!item.skillName) continue;
    await sql`
      INSERT INTO user_skills (user_id, skill_name, self_reported_level, source)
      VALUES (${auth.user.id}, ${item.skillName}, ${item.level === '' || item.level == null ? null : Number(item.level)}, 'self_reported')
      ON CONFLICT (user_id, skill_name, source) DO UPDATE SET self_reported_level = EXCLUDED.self_reported_level
    `;
  }

  await sql`UPDATE app_users SET onboarding_completed = true, updated_at = now() WHERE id = ${auth.user.id}`;
  return json({ ok: true, next: '/dashboard.html' });
}

async function handleProfileGet(request, env) {
  const sql = getSql(env);
  const auth = await requireUser(request, sql);
  if (auth.response) return auth.response;

  const [profileRows, education, experience, completedCourses, skills] = await Promise.all([
    sql`SELECT * FROM user_profiles WHERE user_id = ${auth.user.id} LIMIT 1`,
    sql`SELECT * FROM user_education WHERE user_id = ${auth.user.id} ORDER BY end_year DESC NULLS FIRST, created_at DESC`,
    sql`SELECT * FROM user_work_experience WHERE user_id = ${auth.user.id} ORDER BY is_current DESC, start_date DESC NULLS LAST`,
    sql`SELECT * FROM user_completed_courses WHERE user_id = ${auth.user.id} ORDER BY completion_date DESC NULLS LAST`,
    sql`SELECT * FROM user_skills WHERE user_id = ${auth.user.id} ORDER BY skill_name`,
  ]);

  return json({
    user: auth.user,
    profile: profileRows[0] || null,
    education,
    experience,
    completedCourses,
    skills,
  });
}

async function handleApi(request, env) {
  const url = new URL(request.url);
  const key = `${request.method} ${url.pathname}`;

  if (key === 'GET /api/health') return handleHealth(env);
  if (key === 'POST /api/auth/email/send-otp') return handleSendOtp(request, env);
  if (key === 'POST /api/auth/email/verify-otp') return handleVerifyOtp(request, env);
  if (key === 'POST /api/auth/register') return handleRegister(request, env);
  if (key === 'POST /api/auth/login') return handleLogin(request, env);
  if (key === 'POST /api/auth/logout') return handleLogout(request, env);
  if (key === 'GET /api/auth/me') return handleMe(request, env);
  if (key === 'GET /api/profile') return handleProfileGet(request, env);
  if (key === 'PUT /api/profile') return handleProfileSave(request, env);

  return json({ error: 'API route not found.' }, 404);
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        return await handleApi(request, env);
      }
      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error('Worker request failed:', error);
      const databaseResponse = databaseErrorResponse(error);
      if (databaseResponse) return databaseResponse;
      return json({ error: 'Server error.', code: 'SERVER_ERROR' }, 500);
    }
  },
};
