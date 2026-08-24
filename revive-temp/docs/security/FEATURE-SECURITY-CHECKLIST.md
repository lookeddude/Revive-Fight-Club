# Feature Security Checklist

Before merging any new feature or significant architectural change, evaluate the following security considerations. Every new feature must answer these questions to ensure security is maintained throughout the development lifecycle.

## 1. Data Collection & Privacy
- [ ] Does this feature collect new user data?
  - *If yes, ensure data minimization principles are applied. Document the purpose.*
- [ ] Is the data considered Personally Identifiable Information (PII) or sensitive?
  - *If yes, apply appropriate encryption or access controls.*

## 2. Database & Supabase Integrations
- [ ] Does this feature access the Supabase database?
  - *If yes, do queries use the Supabase client correctly without exposing sensitive data?*
- [ ] Does this feature require new tables or changes to existing schemas?
  - *If yes, have Row Level Security (RLS) policies been defined and reviewed for the new tables?*
- [ ] Are RLS policies tested to ensure standard users cannot bypass restrictions?

## 3. Authorization & API Security
- [ ] Does this feature introduce a new API endpoint or Server Action?
  - *If yes, is the endpoint protected with appropriate authentication checks?*
- [ ] Does it require admin authorization?
  - *If yes, is `requireAdmin()` explicitly called before executing business logic?*
- [ ] Are permissions scoped correctly (e.g., restricted to `superadmin` vs. `receptionist`)?
- [ ] Does the feature involve file uploads?
  - *If yes, are file types, sizes, and upload locations strictly validated and restricted?*

## 4. Payments & Financial Transactions
- [ ] Does this feature process money or initiate transactions?
  - *If yes, is pricing strictly server-authoritative?*
- [ ] Does it introduce a new webhook handler?
  - *If yes, is the webhook signature verified securely (e.g., using `timingSafeEqual`)?*
  - *Is the webhook processing logic idempotent?*

## 5. Application Security & Secrets
- [ ] Does the feature introduce new third-party integrations?
  - *If yes, are the required secrets (API keys) stored securely as environment variables?*
- [ ] Are any client-side secrets introduced?
  - *If yes, verify they are only public keys (e.g., `NEXT_PUBLIC_`) and do not expose backend credentials.*
- [ ] Does the feature change core business logic?
  - *If yes, have edge cases and error states been handled gracefully without leaking stack traces?*
- [ ] Are all user inputs validated and sanitized?
