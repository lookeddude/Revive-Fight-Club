# PAYMENTS.md — Revive Fight Club Payment System

## 1. Architecture Overview

```
CUSTOMER
   |
   v
WEBSITE (Next.js)
   |
   +──── /membership  ──→  MembershipCheckout component
   |
   +──── /book-trial  ──→  BookTrialForm (with payment step)
   |
   v
POST /api/payments/create-order  ← Server: fetches price from DB, creates Razorpay order
   |
   v
RAZORPAY CHECKOUT (browser popup)
   |
   +──── Success ──→  POST /api/payments/verify  ← Server: HMAC signature verification
   |
   +──── Failure ──→  /payment/failed
   |
   v
SUPABASE (service role — bypasses RLS)
   |
   +──── payments table (created → paid)
   +──── member_purchases table (pending → active)
   +──── trial_requests table (pending_payment → confirmed)
   |
   v
EMAIL CONFIRMATION  (Resend — non-blocking, failure safe)

RAZORPAY WEBHOOK (async, idempotent)
→ POST /api/webhooks/razorpay
→ Verifies signature with RAZORPAY_WEBHOOK_SECRET
→ Calls process_payment_success() DB function
→ Same outcome as verify endpoint — idempotent
```

---

## 2. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # ← NEVER NEXT_PUBLIC_

# Razorpay (get from dashboard.razorpay.com → Settings → API Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx  # Only this can be NEXT_PUBLIC_
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here               # ← NEVER NEXT_PUBLIC_
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret        # ← NEVER NEXT_PUBLIC_

# Email (resend.com → API Keys)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@revivefightclub.com
```

> ⚠️ **Never commit `.env.local` to git.** It's in `.gitignore`.

---

## 3. Razorpay Setup

### Step 1 — Create Account
1. Go to [razorpay.com](https://razorpay.com) and sign up
2. Complete KYC (required for live payments)
3. For testing, KYC is NOT required

### Step 2 — Get Test Keys
1. Dashboard → Settings → API Keys
2. Click "Generate Test Key"
3. Copy `Key ID` → `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID`
4. Copy `Key Secret` → `RAZORPAY_KEY_SECRET`

### Step 3 — Configure Webhook
1. Dashboard → Settings → Webhooks
2. Add URL: `https://revive-fight-club.vercel.app/api/webhooks/razorpay` (test)
3. Or for production: `https://revivefightclub.com/api/webhooks/razorpay`
4. Select events:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `refund.created`
5. Copy webhook secret → `RAZORPAY_WEBHOOK_SECRET`

---

## 4. Test Mode

All environment variables use `rzp_test_` prefix in test mode.

### Test Cards (Razorpay)
| Card | Number |
|------|--------|
| Success | 4111 1111 1111 1111 |
| Failure | 5267 3181 8797 5449 |
| CVV | Any 3 digits |
| Expiry | Any future date |

### Test UPI
- VPA: `success@razorpay` (succeeds)
- VPA: `failure@razorpay` (fails)

---

## 5. Production Mode

To switch to production:
1. Replace `rzp_test_` keys with `rzp_live_` keys in environment variables
2. Update webhook URL to `https://revivefightclub.com/api/webhooks/razorpay`
3. **No code changes required** — the system reads keys from env vars

---

## 6. Database Tables

### `payments`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Internal payment ID |
| razorpay_order_id | TEXT UNIQUE | Razorpay order reference |
| razorpay_payment_id | TEXT | Razorpay payment ID (after capture) |
| razorpay_signature | TEXT | HMAC signature (for audit) |
| customer_name/email/phone | TEXT | Customer details |
| payment_type | TEXT | `membership` or `trial` |
| reference_id | UUID | FK to member_purchases or trial_requests |
| amount | INTEGER | In paise (₹1 = 100 paise) |
| status | TEXT | created → paid / failed / refunded |
| metadata | JSONB | Plan name, receipt, etc. |

### `member_purchases`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Purchase ID |
| membership_plan_id | UUID | FK to membership_plans |
| payment_id | UUID | FK to payments |
| customer_name/email/phone | TEXT | Customer details |
| start_date / end_date | DATE | Membership validity |
| status | TEXT | pending → active / expired / cancelled |

### `trial_requests` (extended)
Added columns:
- `payment_id` — FK to payments
- `payment_required` — boolean flag
- `trial_fee` — in paise (default 100000 = ₹1,000)

---

## 7. Order Creation Flow

```
POST /api/payments/create-order
Body: { type, planId?, customerName, customerEmail, customerPhone, trialData? }

1. Validate all inputs server-side
2. For membership: fetch price from membership_plans table (NEVER trust browser price)
3. For trial: always ₹1,000 (server constant)
4. Validate plan.is_active
5. Create Razorpay order via SDK
6. Insert payments row (status: 'created')
7. For membership: insert member_purchases row (status: 'pending')
8. For trial: insert trial_requests row (status: 'pending_payment')
9. Return: { orderId, amount, currency, keyId, paymentId, planName }
   (NEVER returns secret key)
```

---

## 8. Signature Verification

```
POST /api/payments/verify
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentRecordId }

1. Verify HMAC: SHA256(orderId + "|" + paymentId, RAZORPAY_KEY_SECRET)
2. Find payment record by razorpay_order_id
3. Check idempotency (already paid → return success without processing)
4. Call process_payment_success() DB function
5. Send confirmation email (non-blocking)
6. Redirect to /payment/success
```

---

## 9. Webhook Architecture

```
POST /api/webhooks/razorpay
Header: x-razorpay-signature

1. Read raw body (required for HMAC)
2. Verify SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET) === signature
3. Parse event
4. payment.captured:
   a. Find payment by razorpay_order_id
   b. Check idempotency (status === 'paid' → skip)
   c. Call process_payment_success()
   d. Send email
5. payment.failed: mark status = 'failed', store failure_reason
6. refund.created: mark status = 'refunded'
7. Always return 200 (Razorpay retries on non-200)
```

---

## 10. Idempotency

The webhook can be delivered multiple times. The system is safe because:
1. `process_payment_success()` checks `status = 'paid'` before updating
2. If already paid, returns early with `{ idempotent: true }`
3. `razorpay_order_id` has UNIQUE constraint — no duplicate payment records
4. `razorpay_payment_id` has UNIQUE partial index — no duplicate captures

---

## 11. Membership Activation

- Membership activates ONLY after `process_payment_success()` runs
- Start date = `CURRENT_DATE` at time of verification
- End date calculated from `billing_period`:
  - monthly → +30 days
  - quarterly → +90 days
  - annually → +365 days
- Frontend CANNOT activate a membership directly

---

## 12. Trial Booking Confirmation

- Trial booking creates `trial_requests` row with `status = 'pending_payment'`
- On payment verification, status changes to `confirmed`
- If payment fails, row remains as `pending_payment` (audit trail)
- Admin can see payment_id linked to each trial request

---

## 13. Email Notifications

Uses **Resend** (resend.com).

| Event | Email Sent |
|-------|-----------|
| Membership payment verified | Membership confirmation with plan, dates, amount |
| Trial payment verified | Trial confirmation with program, date, time, location |
| Email failure | Logged — payment status NOT affected |

To set up Resend:
1. Sign up at resend.com
2. Verify your domain (or use `@resend.dev` for testing)
3. Create API key → `RESEND_API_KEY`

---

## 14. Refund Support

Refunds are handled manually via Razorpay Dashboard.
- When `refund.created` webhook fires → payment status = `refunded`
- Admin can see refund status in `/admin/payments`
- No automatic member_purchase or trial_request state change on refund
  (business decision — implement manually for now)

---

## 15. Security Checklist

| Check | Status |
|-------|--------|
| Frontend cannot change price | ✅ Server fetches from DB |
| Frontend cannot mark payment paid | ✅ Only webhook/verify endpoint |
| Webhook signature verified | ✅ HMAC SHA256 with RAZORPAY_WEBHOOK_SECRET |
| Payment duplication prevented | ✅ Idempotency check + UNIQUE index |
| Service role key not exposed | ✅ Server-only in lib/supabase/admin.ts |
| Razorpay secret not in client | ✅ Only NEXT_PUBLIC_RAZORPAY_KEY_ID is public |
| RLS on payment tables | ✅ Admin-only read access |
| Past trial dates rejected | ✅ Server-side date validation |
| Inactive plan rejected | ✅ is_active check before order creation |
| No card data stored | ✅ Only Razorpay order/payment IDs stored |

---

## 16. Admin Panel

Admin can access payments at: `/admin/payments`

Shows:
- All payment transactions
- Status (paid/failed/cancelled/refunded)
- Customer details
- Razorpay order ID
- Amount
- Type (membership/trial)

> Admin panel uses service role key — bypasses RLS for admin operations.

---

## 17. Hostinger Deployment Checklist

When moving from Vercel to Hostinger:

1. Set all environment variables in Hostinger dashboard
2. Update Razorpay webhook URL to `https://revivefightclub.com/api/webhooks/razorpay`
3. Update Razorpay to live mode keys (`rzp_live_`)
4. Node.js version: 18.x or higher
5. Build command: `npm run build`
6. Start command: `npm run start`
7. Make sure `/api/webhooks/razorpay` endpoint is publicly accessible (no auth)

---

## 18. Testing Checklist

Before going live, test each scenario:

- [ ] TEST 1: Successful membership payment (test card)
- [ ] TEST 2: Failed membership payment
- [ ] TEST 3: Membership checkout cancelled
- [ ] TEST 4: Successful trial payment
- [ ] TEST 5: Failed trial payment
- [ ] TEST 6: Trial checkout cancelled
- [ ] TEST 7: Duplicate webhook (same payload twice → idempotent)
- [ ] TEST 8: Invalid webhook signature → rejected with 400
- [ ] TEST 9: Invalid membership plan ID → rejected
- [ ] TEST 10: Price manipulation (ignore browser amount) → server uses DB price
- [ ] TEST 11: Inactive plan → rejected before order creation
- [ ] TEST 12: Past trial date → rejected
- [ ] TEST 13: Refresh /payment/success → no duplicate record
- [ ] TEST 14: Email received after successful payment
- [ ] TEST 15: Webhook arrives after frontend timeout → still activates membership
