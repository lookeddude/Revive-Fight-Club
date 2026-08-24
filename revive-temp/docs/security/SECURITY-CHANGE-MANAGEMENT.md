# Security Change Management & Incident Classification

## 1. Security Change Management
Every security-sensitive change (auth logic, RLS policies, payment routing, role assignments) must follow this formal process:
1. **Reason:** Document why the change is necessary.
2. **Affected Components:** List all systems impacted (e.g., Supabase Auth, Razorpay webhook).
3. **Risk Assessment:** Evaluate potential impact if the change fails or contains a vulnerability.
4. **Implementation:** Code the change following secure coding guidelines.
5. **Testing:** Write automated tests and perform manual verification in staging.
6. **Rollback Plan:** Detail the exact steps to revert the change if issues arise in production.
7. **Approval:** Require at least one peer review from a senior developer before merging.

## 2. Incident Classification
Incidents must be classified to determine the appropriate response level.

- **SEV-1 (Critical):** Immediate, all-hands response required.
  - *Examples:* Active credential compromise, widespread database exposure, payment system breach, superadmin account compromise.
- **SEV-2 (High):** Major issue requiring urgent attention.
  - *Examples:* Major authorization vulnerability, significant but contained data exposure, failure of critical security controls.
- **SEV-3 (Medium):** Limited security issue.
  - *Examples:* Privilege escalation within low-level roles, minor information disclosure, non-exploitable vulnerabilities.
- **SEV-4 (Low):** Minor or non-critical issue.
  - *Examples:* Missing security headers, theoretical vulnerabilities with no known exploit path, outdated dependencies (non-critical).
