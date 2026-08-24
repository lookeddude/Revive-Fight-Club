# Code Change Security Checklist (Part 8)

Use this checklist during Pull Request reviews for any significant changes to the Revive Fight Club application.

## 1. Authentication & Authorization
- [ ] Does this change add a new route? If yes, is the correct authentication guard applied?
- [ ] Are admin-only server actions protected by the `requireAdmin()` guard?
- [ ] Does the UI correctly hide elements the user is not authorized to see?
- [ ] Is role-based access control (RBAC) enforced on the server, not just the client?

## 2. Input Validation & Data Handling
- [ ] Is all user input validated on the server side (e.g., using Zod)?
- [ ] Are we sanitizing inputs before rendering them to prevent XSS?
- [ ] Are file uploads (if any) restricted by type, size, and scanned?
- [ ] Is PII (Personally Identifiable Information) handled securely and masked where appropriate in logs/UI?

## 3. Database Access & RLS (Supabase)
- [ ] **Rule: Every new table MUST have RLS reviewed.**
- [ ] Is RLS enabled on all new tables?
- [ ] Are policies strictly scoping reads/writes to the authenticated user's ID where applicable?
- [ ] Are `service_role` keys used only when absolutely necessary (bypassing RLS), and NEVER exposed to the client?
- [ ] Are database migrations reversible and reviewed for destructive actions?

## 4. API & Endpoint Exposure
- [ ] **Rule: Every new API MUST have auth reviewed.**
- [ ] Are new API routes properly protected against unauthenticated access?
- [ ] Is rate limiting applied to sensitive endpoints (e.g., login, password reset, payment initiation)?
- [ ] Do API responses avoid leaking internal server errors, stack traces, or sensitive data?

## 5. Secrets & Configuration
- [ ] Are new third-party integrations using secure environment variables?
- [ ] Are we absolutely sure no secrets, API keys, or tokens are hardcoded in the source code?
- [ ] Are `.env` files strictly excluded from version control?

## 6. Payment & Webhook Logic (Razorpay)
- [ ] Are payment amounts and items calculated on the server (never trusting client-provided pricing)?
- [ ] Are webhook signatures verified using HMAC SHA-256 with `timingSafeEqual`?
- [ ] Is webhook processing idempotent (safe to process the same event twice)?
- [ ] Are payment state transitions validated (e.g., cannot transition from 'failed' to 'successful' arbitrarily)?

## 7. Logging & Error Handling
- [ ] Are errors handled gracefully without exposing sensitive system details to the user?
- [ ] Are critical security events (login failures, authorization bypass attempts) logged?
- [ ] Ensure that passwords, session tokens, and payment details (like card numbers) are NEVER logged.
