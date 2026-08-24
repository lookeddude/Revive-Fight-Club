# Data Privacy & Access Review

This document serves as a framework for periodic reviews of data privacy, access controls, and third-party integrations for Revive Fight Club.

## 1. Privacy & Data Minimization Review
*Review periodically to ensure we only retain data necessary for business operations.*

### Customer Data
- **What we store**: Name, email, contact info, basic profile.
- **Review action**: Ensure inactive users can be archived or deleted. Confirm no unnecessary sensitive data (e.g., medical info) is being collected unless legally required.

### Booking & Membership Data
- **What we store**: Class bookings, membership tiers, expiration dates.
- **Review action**: Validate that booking history is retained only as long as required for accounting and customer support.

### Payment Metadata
- **What we store**: Razorpay order IDs, payment status, amounts.
- **Review action**: Confirm we do NOT store full credit card numbers or raw payment instruments. All payment processing must remain offloaded to Razorpay.

### Logs & Analytics
- **What we store**: Application logs, user activity via `logActivity`, Google Analytics events.
- **Review action**: Ensure logs do not contain PII or plain-text credentials. Review log retention policies.

---

## 2. Data Access Review
*Review periodically to ensure the principle of least privilege is maintained.*

- **Admin Users**: Audit the list of users with `superadmin`, `admin`, `manager`, and `receptionist` roles. Revoke access for former staff.
- **Database Access**: Review who has direct access to the Supabase dashboard and production database.
- **Service Credentials**: Rotate API keys (Razorpay, Resend, Supabase Service Role) if any staff member with access leaves the company.
- **Third-Party Integrations**: Audit access to the Vercel (Staging) and Hostinger (Production) dashboards.

---

## 3. Third-Party Integration Inventory

| Integration | Purpose | Data Shared | Credentials Used | Security Dependency | Failure Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Supabase** | Primary Database, Auth, Storage | All app data, user profiles | Supabase URL, Anon Key, Service Role Key | Relies on Supabase RLS and network security. | **Critical**. Full app outage, potential data breach. |
| **Razorpay** | Payment Gateway | Payment amounts, user email, metadata | Key ID, Key Secret, Webhook Secret | Relies on Razorpay compliance, webhook HMAC validation. | **High**. Revenue loss, inability to purchase memberships. |
| **Resend** | Email Delivery | User email addresses, names | Resend API Key | Relies on Resend API security. | **Medium**. Users miss notifications/receipts. |
| **Google Analytics** | Traffic & Usage Tracking | Anonymized usage data, IPs | GA Measurement ID | Client-side tracking, relies on Google privacy policies. | **Low**. Loss of marketing insights. |
| **Google Maps** | Location Display | None | Google Maps API Key | Client-side map rendering. | **Low**. Map UI fails to load. |
| **Google OAuth** | Authentication | Email, Profile Name, Avatar | OAuth Client ID, Secret | Handled via Supabase Auth. | **High**. Users unable to log in. |
