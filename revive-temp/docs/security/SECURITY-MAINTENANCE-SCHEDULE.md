# Security Maintenance Schedule

## 1. EVERY DEPLOYMENT
- **Build Checks:** Ensure no build errors or warnings related to security.
- **Dependency Check:** Automated check for known vulnerabilities in CI/CD pipeline.
- **Secret Check:** Verify no hardcoded secrets or environment variables are included in the client bundle.
- **Security Regression:** Run automated security tests (e.g., RLS bypass attempts, auth checks).

## 2. MONTHLY
- **Dependency Review:** Manually review and update non-critical dependencies.
- **Admin Access Review:** Audit all accounts with `superadmin`, `admin`, `manager`, or `receptionist` roles. Remove inactive users.
- **Secret Exposure Review:** Scan public repositories and logs for accidentally exposed secrets.
- **Supabase/RLS Review:** Audit active Row Level Security policies for correctness and comprehensive coverage.

## 3. QUARTERLY
- **Deeper Security Review:** Conduct a manual architecture and code review focusing on security posture.
- **API Authorization Review:** Verify all Next.js API routes properly implement `requireAdmin()` or user-ownership checks.
- **Payment & Business Logic Review:** Walk through the payment flow to ensure price manipulation and race conditions are mitigated.
- **Backup/Recovery Verification:** Perform a test restore of the Supabase database to verify backups are functional.

## 4. AFTER MAJOR FEATURE RELEASE
- **Targeted Security Review:** Perform an in-depth security analysis on the newly released components, specifically checking for injection flaws, broken access control, and state manipulation.

## 5. AFTER A SECURITY INCIDENT
- **Complete Incident Review:** Conduct a blameless post-mortem to identify root causes.
- **Credential Rotation:** Rotate all relevant API keys, database passwords, and secrets, regardless of whether they were directly compromised.
- **Targeted Retesting:** Verify that the applied fix completely resolves the vulnerability without introducing regressions.
