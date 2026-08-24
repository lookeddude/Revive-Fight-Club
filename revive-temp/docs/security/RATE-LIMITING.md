# Application-Level Rate Limiting

This document details the application-level rate limiting system implemented for Revive Fight Club.

## Architecture

- **Mechanism**: Supabase-backed sliding window rate limiter
- **Storage Table**: `rate_limit_entries`
  - Columns: `id` (UUID), `key` (TEXT), `endpoint` (TEXT), `created_at` (TIMESTAMPTZ), `expires_at` (TIMESTAMPTZ)
- **Indexes**: `(key, created_at)` and `(expires_at)`
- **Security**: No RLS policies (service-role only, never browser-exposed)
- **Client**: Untyped Supabase client (separate from generated Database types)
- **Protection**: `import 'server-only'` ensures the module can never be imported client-side

## Storage & Deployment

- **Database**: Supabase PostgreSQL
- **Environment**: Distributed-safe across Vercel serverless (staging) and Hostinger PM2 (production)
- **Lifecycle**: Entries auto-expire via TTL (`expires_at` column)
- **Cleanup**: Opportunistic cleanup function runs on the payment `create-order` endpoint, executing `DELETE WHERE expires_at < now()`

## Key Strategy

| Endpoint | Key | Rationale |
|---|---|---|
| Payment create-order | IP + email | Prevents order spam per person per IP |
| Payment verify | IP | Prevents verification spam |
| Trial booking | IP + phone | Prevents booking spam |
| Contact form | IP | Prevents contact spam |
| Auth callback | IP | Prevents OAuth abuse |
| Admin upload | User ID | Identity-based, immune to IP spoofing |
| Admin video upload | User ID | Identity-based |
| Admin slot-history | User ID | Identity-based |

*IP Resolution Strategy*: `x-forwarded-for` (first IP) → `x-real-ip` → `req.ip` → `'unknown'`

## Limits & Behavior

| Endpoint | Limit | Window | Fail Behavior |
|---|---|---|---|
| Payment create-order | 5 | 10 min | Fail-closed (HTTP 429) |
| Payment verify | 10 | 10 min | Fail-closed (HTTP 429) |
| Trial booking | 5 | 1 hour | Fail-closed (Error return) |
| Contact form | 5 | 1 hour | Fail-closed (Error return) |
| Auth callback | 10 | 15 min | Redirect to login |
| Admin upload | 30 | 1 min | Fail-open (HTTP 429) |
| Admin video upload | 10 | 1 min | Fail-open (HTTP 429) |
| Admin slot-history | 60 | 1 min | Fail-open (HTTP 429) |
| Razorpay webhook | NO LIMIT | N/A | Signature verification only |

## Implementation Details

- **Response on Limit Exceeded**: HTTP 429 Too Many Requests with `Retry-After` header and JSON error body.
- **Failure Modes**: Critical endpoints fail-closed; admin and auth endpoints fail-open in the event of rate limiter service failure.
- **Monitoring & Logging**: `console.warn` on blocked requests including the endpoint, truncated key, and current count.
- **Exemptions**: Webhooks, static assets, public pages, and admin server actions (protected natively by `requireAdmin()`) are NOT rate-limited.
