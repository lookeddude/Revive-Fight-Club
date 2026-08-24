# REVIVE FIGHT CLUB - SECURITY ARCHITECTURE 
 
## Trust Boundaries 
 
- **Browser (untrusted)**: Only sees NEXT_PUBLIC_* env vars, anon Supabase key, Razorpay public key 
- **Next.js Server (trusted)**: Holds RAZORPAY_KEY_SECRET, SUPABASE_SERVICE_ROLE_KEY, RAZORPAY_WEBHOOK_SECRET 
- **Supabase (RLS-enforced)**: All 23 tables have RLS enabled. Anon/public clients restricted by policies 
- **Razorpay (external)**: Payment processing. Server creates orders, verifies signatures 
 
## Authentication 
 
- Supabase Auth (email/password + Google OAuth) 
- Cookie-based sessions via @supabase/ssr 
- Admin middleware in proxy.ts protects all /admin/* routes 
- getAdminSession() verifies active staff profile with valid role 
 
## Authorization 
 
- Role hierarchy: superadmin > admin > manager > receptionist 
- Server-side enforcement: requireAdmin(), requireSuperAdmin(), requireAdminRole() 
- All server actions require requireAdmin() before any DB operation 
- RLS policies enforce role-based access at database level 
 
## Payment Security 
 
- Server-authoritative pricing (DB or server constant) 
- HMAC SHA-256 signature verification with timing-safe comparison 
- Webhook raw body verification 
- Multi-tier idempotency (API + DB function + unique constraints) 
 
## Secret Management 
 
- Server-only secrets protected by import 'server-only' 
- .env.local excluded from git (.gitignore) 
- .env.example contains only placeholders 
- NEVER prefix secrets with NEXT_PUBLIC_ 
 
## Incident Response 
 
- If credentials are compromised: rotate in Razorpay Dashboard and Supabase Dashboard 
- Update Vercel environment variables 
- Review admin_activity_logs and admin_audit_logs tables
