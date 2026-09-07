# Deployment

Last updated: 2026-08-28

## Current hosting

Provider: Cloudflare Workers

Production Worker name: `sih26101`

Current production hostname:
`https://sih26101.stoicsolutions-in.workers.dev/`

The current hostname has a Google Safe Browsing deceptive-page warning under review. That is a reputation/review issue, not a Worker build failure.

## Deployment entry points

Root files:
- `wrangler.jsonc`
- `package.json`
- `src/worker.js`

`wrangler.jsonc` currently:
- points Worker execution to `src/worker.js`,
- binds `sih-ai-learning-platform/frontend/` as `ASSETS`.

The Worker routes:
- `/api/*` to backend handlers,
- everything else to static frontend assets.

## Cloudflare build settings

Current Git-connected deployment:
- branch: `main`
- root directory: `/`
- build command: none
- deploy command: `npx wrangler deploy`

Dependencies are installed from root `package.json`.

## Required Cloudflare secret

`DATABASE_URL`

This must contain the Neon connection string and must be configured as a Worker secret/environment variable. Never store it in Git.

## Database

Neon project: `stoicdb`

The application schema has been prepared and verified on a temporary migration branch, but final application to the main Neon branch still requires explicit approval.

See `09-database-design.md` for schema status.

## Google verification/review

Search Console URL-prefix property is verified using:
`frontend/google6603f76e5906e835.html`

Current Search Console security classification:
- `Deceptive pages`

Review/remediation state should be updated in `11-security.md` and `16-development-log.md` when it changes.

## Local development

From the repository root:

```bash
npm install
npm run dev
```

Cloudflare Wrangler runs the Worker and static asset binding locally.

A valid local `DATABASE_URL` binding/secret is required for database-backed API calls.

## Deployment command

```bash
npm run deploy
```

Equivalent to:

```bash
wrangler deploy
```

## Future deployment work

- production/staging environment separation,
- dedicated test database branch,
- custom domain when available,
- CI checks before deployment,
- secret rotation process,
- monitoring/alerts,
- database migration automation with explicit review gates.
