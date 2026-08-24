# Security Incident Runbook

## General Incident Lifecycle
For every incident, execute these phases:
1. **DETECT:** Acknowledge the alert or report.
2. **CONTAIN:** Prevent further damage immediately.
3. **INVESTIGATE:** Determine root cause and scope.
4. **ERADICATE:** Remove the threat or vulnerability.
5. **RECOVER:** Restore systems to normal operation.
6. **VERIFY:** Confirm the fix is effective.
7. **DOCUMENT:** Write a post-mortem report.

## Scenario-Specific Procedures

### 1. Secret Leak
- **Contain:** Revoke the exposed secret immediately at the source provider.
- **Investigate:** Search logs to determine if the leaked secret was used.
- **Eradicate:** Generate new secrets and update Vercel environment variables.
- **Recover:** Redeploy the application with the new secrets.

### 2. Admin Compromise
- **Contain:** Disable the compromised admin account in Supabase Auth. Force logout all active sessions.
- **Investigate:** Audit all actions taken by the user ID in the last 72 hours.
- **Eradicate:** Revert any malicious configuration changes or unauthorized data modifications.
- **Recover:** Restore account access only after verifying the user's identity and securing their authentication method.

### 3. Database Exposure
- **Contain:** Temporarily restrict database network access or disable the offending RLS policy.
- **Investigate:** Query logs to determine what data was accessed and by whom.
- **Eradicate:** Fix the RLS policy or patch the vulnerability.
- **Recover:** Notify affected users if PII was exposed.

### 4. Payment Abuse (Razorpay)
- **Contain:** Pause Razorpay webhooks or disable the checkout flow.
- **Investigate:** Cross-reference Razorpay dashboard logs with application database orders. Check webhook signatures.
- **Eradicate:** Fix timing-safe comparison or price-validation logic.
- **Recover:** Void fraudulent orders and re-enable payments.

### 5. Webhook Compromise
- **Contain:** Invalidate the webhook secret.
- **Investigate:** Identify unauthorized state changes caused by forged webhooks.
- **Eradicate:** Implement `timingSafeEqual` for HMAC verification.
- **Recover:** Manually reconcile application state with the third-party provider (e.g., Razorpay).

### 6. Malicious Deployment
- **Contain:** Trigger an instant rollback in Vercel to a known good deployment.
- **Investigate:** Audit Vercel access logs and Git repository history.
- **Eradicate:** Remove malicious code, revoke compromised Vercel/Git tokens.
- **Recover:** Deploy a clean, verified commit.

### 7. XSS / Defacement
- **Contain:** Roll back to a previous deployment.
- **Investigate:** Identify the input vector that bypassed sanitization.
- **Eradicate:** Implement strict React escaping and update Content Security Policy (CSP).
- **Recover:** Redeploy the patched version.

### 8. Dependency Vulnerability
- **Contain:** If actively exploited, disable the affected feature.
- **Investigate:** Determine if the vulnerable code path is reachable in the application.
- **Eradicate:** Update the dependency (`npm audit fix` or manual upgrade).
- **Recover:** Deploy the updated application.
