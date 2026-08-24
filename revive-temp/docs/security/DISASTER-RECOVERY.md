# Disaster Recovery & Rollback Procedures

## 1. Incident Handling Phases
For any disaster scenario, follow these strict phases:
1. **Detection:** Identify the failure via monitoring, alerts, or user reports.
2. **Containment:** Stop the bleeding (e.g., disable affected features, pause deployments).
3. **Rollback/Recovery:** Restore a known good state.
4. **Verification:** Confirm the system is stable and secure.

## 2. Disaster Scenarios
- **Website/Hosting Failure (Vercel):** Check Vercel status. If regional failure, rely on Vercel's multi-region routing. If misconfiguration, revert Vercel environment variables or project settings.
- **Database Failure (Supabase):** Initiate Point-in-Time Recovery (PITR) via Supabase Dashboard if data corruption occurs.
- **Credential Compromise:** Immediately revoke compromised keys. Rotate Supabase JWT secret, database passwords, Razorpay API keys, and Resend keys. 
- **Payment Integration Failure (Razorpay):** Temporarily disable checkouts. Verify Razorpay status page. 
- **DNS Issue:** Verify domain registrar settings and Vercel DNS configuration.
- **Accidental/Malicious Deployment:** Trigger Vercel instant rollback.
- **Bad Database Migration:** Execute the pre-planned SQL rollback script.

## 3. Deployment Rollback Procedures
- **Previous Stable Commit:** Identify the last known working git commit.
- **Vercel Rollback:** Use the Vercel dashboard to instantly revert the production domain to a previous successful deployment.
- **Environment Rollback:** If environment variables caused the issue, revert them in Vercel and trigger a fast redeploy.
- **Database Considerations:** Ensure the application rollback is compatible with the current database schema. If the bad deployment included a schema change, roll back the database *first*.

## 4. Database Migration Safety
- **Backup:** Always ensure a fresh automated backup exists before applying migrations.
- **Review:** All migrations must be peer-reviewed for performance and security impacts.
- **Test:** Apply and test in the staging environment first.
- **Verify RLS:** Ensure Row Level Security policies are not bypassed or inadvertently disabled.
- **Apply & Verify:** Run in production. Monitor application logs immediately.
- **Rollback Plan:** Every migration `UP` script MUST have a corresponding and tested `DOWN` script.
