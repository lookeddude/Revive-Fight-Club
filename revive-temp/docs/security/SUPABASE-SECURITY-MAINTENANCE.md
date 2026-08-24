# Supabase Security Maintenance (Part 9)

This document details the periodic maintenance and security checks required for the Supabase backend of Revive Fight Club.

**Core Rule:** Every new table MUST have RLS reviewed. Every new API MUST have auth reviewed.

## 1. Periodic Review Checklist (Monthly)

Perform these checks monthly to ensure the database remains secure.

### 1.1 Row Level Security (RLS) & Policies
- [ ] **Verify RLS is Enabled:** Ensure all tables containing user data or business logic have RLS enabled.
- [ ] **Review Policy Definitions:** Check that policies are restrictive (e.g., `auth.uid() = user_id`) and don't grant unintended access (like `true` for public tables unless explicitly intended).
- [ ] **Check for Missing Policies:** Ensure that INSERT, UPDATE, and DELETE operations have appropriate policies, not just SELECT.

### 1.2 Table & Schema Audits
- [ ] Review any new tables created in the last month. Confirm RLS is active and policies are documented.
- [ ] Check for overly permissive column types or missing constraints that could lead to data integrity issues.

### 1.3 Storage Buckets
- [ ] **Bucket Privacy:** Ensure storage buckets containing sensitive data (e.g., user documents) are set to Private.
- [ ] **Storage RLS:** Review RLS policies on the `storage.objects` table to restrict who can upload, download, or delete files.
- [ ] **File Size/Type Limits:** Ensure restrictions are in place to prevent malicious uploads or denial-of-wallet attacks via massive files.

### 1.4 Authentication & Users
- [ ] Review active providers (Google OAuth). Disable unused providers.
- [ ] Check for stale or inactive admin accounts and revoke access if necessary.
- [ ] Monitor authentication logs for suspicious activity (e.g., brute-force attempts).

## 2. Privileged Operations & Service Role Usage

- The `service_role` key bypasses all RLS policies. It must **ONLY** be used in secure server environments (Next.js server actions/API routes).
- **Audit:** Search the codebase for `createClient` using the `service_role` key. Verify that every instance is justified, secure, and cannot be manipulated by user input.
- **Rule:** Never pass the `service_role` key to the browser or expose it in public environment variables (`NEXT_PUBLIC_...`).

## 3. Database Migrations

- All database schema changes must be done via migrations, not through the Supabase UI directly on production.
- Migrations must be reviewed in PRs to ensure they don't accidentally drop critical tables, remove RLS, or alter policies insecurely.

## 4. API & Edge Functions (If applicable)

- Review any Supabase Edge Functions for hardcoded secrets.
- Ensure Edge Functions validate the JWT of the calling user before performing sensitive actions.
