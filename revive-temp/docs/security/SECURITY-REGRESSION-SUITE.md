# Security Regression Suite

This document outlines the security regression test suite that must be executed to verify that previously identified security vulnerabilities remain fixed and that core security controls function correctly.

## Phase 1-3 Historical Context

### Fixed Vulnerabilities (Must Not Regress)
* **SEC-001**: `programSlideActions.ts` missing `requireAdmin()`
* **SEC-002**: Open redirect in `/auth/callback`
* **SEC-003**: `staff_invitations` RLS SELECT used `qual:true`
* **SEC-004**: Storage buckets allowed any authenticated upload
* **SEC-005**: RLS used `super_admin` instead of `superadmin`
* **SEC-006**: HMAC comparison used `===` instead of `timingSafeEqual`
* **SEC-007**: Missing CSP/HSTS/Permissions-Policy headers
* **P2-001 to P2-004**: `hero_slides`, `image_slots`, `program_slides` RLS issues

### Accepted Risks (Monitor)
* **MEDIUM**: No rate limiting implemented.
* **LOW**: `logActivity` identity spoofing risk.
* **LOW**: Payment success IDOR via UUID guessing (mitigated by UUID entropy).

---

## Core Security Test Cases

### 1. Authentication
- [ ] Users can successfully authenticate via Google OAuth.
- [ ] Session tokens are securely managed and invalidated on logout.
- [ ] Users cannot bypass authentication for protected routes.
- [ ] No open redirect vulnerabilities exist in `/auth/callback` (Regression: SEC-002).

### 2. Authorization & Admin Privileges
- [ ] Standard users cannot access admin routes (`/admin/*`).
- [ ] Server actions modifying data strictly enforce `requireAdmin()` (Regression: SEC-001).
- [ ] Role-based access control enforces `superadmin`, `admin`, `manager`, and `receptionist` boundaries.

### 3. Supabase Row Level Security (RLS)
- [ ] Unauthenticated users cannot read/write protected tables.
- [ ] Authenticated users can only read/write their own data.
- [ ] Admin roles use the correct `superadmin` string representation (Regression: SEC-005).
- [ ] `staff_invitations` RLS prevents unauthorized viewing (Regression: SEC-003).
- [ ] Storage buckets deny arbitrary authenticated uploads; restricted to specific paths/roles (Regression: SEC-004).
- [ ] RLS policies for `hero_slides`, `image_slots`, `program_slides` correctly restrict modifications to admins (Regression: P2-001 to P2-004).

### 4. Payment Security (Razorpay)
- [ ] Server-authoritative pricing: Client cannot modify the amount passed to Razorpay.
- [ ] Payment verification uses HMAC SHA-256 with `timingSafeEqual` to prevent timing attacks (Regression: SEC-006).
- [ ] Webhook signature validation is enforced on all Razorpay webhooks.
- [ ] Webhook processing is idempotent (duplicate events are ignored safely).

### 5. API Authorization & Insecure Direct Object Reference (IDOR)
- [ ] API endpoints verify the caller has access to the requested resource.
- [ ] Users cannot access other users' data by manipulating IDs in API requests.

### 6. Input Validation & XSS
- [ ] All user inputs are strictly validated on the server.
- [ ] Markdown or rich text inputs are properly sanitized before rendering to prevent Cross-Site Scripting (XSS).
- [ ] Parameterized queries or ORM functions are used to prevent SQL Injection.

### 7. Application Security & Headers
- [ ] Security headers (CSP, HSTS, Permissions-Policy, X-Frame-Options) are present and correctly configured (Regression: SEC-007).
- [ ] No sensitive secrets (API keys, DB credentials) are exposed to the client-side bundle.
