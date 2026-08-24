# Admin Security Policy & Audit Guidelines

## 1. Authentication & Access Control
- **Strong Authentication:** All administrators MUST authenticate via Google OAuth provided by Supabase Auth. No local passwords.
- **Least Privilege:** Roles are strictly enforced (`superadmin`, `admin`, `manager`, `receptionist`). Users must be granted the lowest level of access necessary to perform their duties.
- **No Shared Accounts:** Every admin action must be traceable to an individual. Shared admin credentials are fundamentally prohibited.
- **No Hidden Accounts:** "Emergency" or "backdoor" accounts are strictly forbidden. All privileged accounts must be officially documented and visible.

## 2. Account Lifecycle Management
- **Admin Account Review:** Access rights must be reviewed monthly.
- **Inactive Admin Removal:** Accounts dormant for >30 days should have their admin privileges revoked.
- **Credential Rotation:** API keys and environment variables used by the admin system must be rotated according to the Security Maintenance Schedule.
- **Session Security:** Admin sessions should enforce strict timeouts and require re-authentication for sensitive actions.

## 3. Admin Action Audit Guidelines
All state-changing actions performed by administrators must be logged. 

### What to Log
- **Membership Changes:** Approvals, cancellations, upgrades, downgrades.
- **Booking Changes:** Creating, modifying, or cancelling classes/sessions on behalf of users.
- **Payment Admin Actions:** Issuing refunds, voiding invoices, applying discounts.
- **User Management:** Role changes, account suspensions, manual verifications.
- **Content Changes:** Modifications to schedules, announcements, or public-facing text.
- **Settings Changes:** Alterations to application configuration or operational variables.

### What NOT to Log
- **NEVER** log passwords, OAuth tokens, session cookies, API keys, or full credit card numbers.
- **NEVER** log PII unnecessary for the audit context.

### Log Format
Each audit record should include: `timestamp`, `admin_user_id`, `action_type`, `target_resource_id`, and `changes` (before/after state).
