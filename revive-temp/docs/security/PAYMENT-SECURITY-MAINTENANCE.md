# Payment Security Maintenance (Part 10 & 11)

This document outlines the monitoring and incident response procedures for the Razorpay integration in Revive Fight Club.

**Golden Rule:** NEVER trust client-side payment state. Always verify with the server and webhooks.

## Part 10: Payment Monitoring & Maintenance

Regularly monitor the system and logs for the following anomalies:

### 1. What to Monitor
- **Payment Failures:** High rates of failed payments could indicate fraud attempts or integration issues.
- **Signature Verification Failures:** A failed HMAC SHA-256 webhook signature indicates a potentially forged request. Alert immediately.
- **Webhook Failures:** Ensure the webhook endpoint is returning 200 OK. Monitor Razorpay dashboard for retrying webhooks.
- **Duplicate Webhook Events:** Ensure the system safely ignores duplicate events (Idempotency).
- **Unexpected Payment States:** Monitor for manual alterations in the database that don't match Razorpay logs.
- **Unusual Membership Activation:** Look for memberships activated without a corresponding successful payment record.
- **Order/Payment Mismatch:** Verify that the amount paid matches the server-calculated amount for the order.

### 2. Routine Checks (Weekly)
- Cross-reference a sample of active memberships in the database against successful payments in the Razorpay dashboard.
- Verify that the webhook endpoint SSL certificate is valid.

---

## Part 11: Razorpay Incident Response Procedure

Follow these procedures during a payment-related security incident.

### Scenario A: Payment Secret Key Leaks
1. **Revoke Immediately:** Go to the Razorpay Dashboard -> Settings -> API Keys and regenerate/roll the API keys.
2. **Update Environment:** Update the `RAZORPAY_KEY_SECRET` in the production environment (Hostinger/Vercel) immediately.
3. **Audit:** Review Razorpay logs for any unauthorized refunds, payouts, or API calls made during the leak window.
4. **Deploy:** Redeploy the application to pick up the new environment variables.

### Scenario B: Webhook Secret Leaks
1. **Regenerate Secret:** Go to Razorpay Dashboard -> Settings -> Webhooks. Edit the webhook and generate a new secret.
2. **Update Environment:** Update `RAZORPAY_WEBHOOK_SECRET` in the production environment.
3. **Audit Webhooks:** Check application logs for signature verification successes from suspicious IP addresses. Re-verify the integrity of data processed during the leak window.

### Scenario C: Suspicious Activity / Fraud
1. **Block User/IP:** If a specific user is attempting fraud (e.g., card testing), block their account in Supabase and block their IP via WAF.
2. **Refund Fraudulent Charges:** Immediately refund unauthorized charges via the Razorpay dashboard to avoid chargebacks.
3. **Analyze:** Determine how they attempted the fraud (was it a flaw in our pricing logic?).

### Scenario D: Webhook Signature Verification Fails Repeatedly
1. **Investigate Source:** Check the IP of the incoming requests. If it's not Razorpay's documented IPs, it's an attack. Block the IPs.
2. **Verify Configuration:** If valid webhooks are failing, verify that the `RAZORPAY_WEBHOOK_SECRET` matches exactly between the dashboard and environment variables. Ensure no whitespace was accidentally added.

### Scenario E: Duplicate Events Causing Issues
1. **Verify Idempotency:** Ensure the webhook handler checks if a payment/order has already been processed (e.g., checking a `status` column or a processed webhooks table) before fulfilling the order.
2. **Patch:** If idempotency is failing, immediately deploy a fix to the webhook handler to prevent multiple membership activations for a single payment.
