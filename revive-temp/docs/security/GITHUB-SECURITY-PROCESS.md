# GitHub Security Process (Part 7)

This document establishes the GitHub configuration and code review processes required to maintain a secure codebase for Revive Fight Club.

**Rule: Production deployments MUST NOT depend on unreviewed code.**

## 1. Branch Protection Rules

Enforce the following rules on the `main` and `production` branches:

- **Require Pull Request reviews before merging:**
  - Minimum number of approvals: 1 (preferably 2 for critical changes).
  - Dismiss stale pull request approvals when new commits are pushed.
  - Require review from Code Owners (if applicable).
- **Require status checks to pass before merging:**
  - Enforce CI build success (Vercel preview build, linting, tests).
- **Require conversation resolution before merging.**
- **Do not allow bypassing the above settings.**
- **Restrict who can push to matching branches:** Only specific administrators or release managers.

## 2. Pull Request Review Security

Reviewers must specifically look for security implications during PR reviews. Use the `CODE-CHANGE-SECURITY-CHECKLIST.md` for significant changes.

Key focus areas during review:
- Hardcoded secrets or credentials.
- Bypass of authentication or authorization checks.
- Unsafe input handling (e.g., raw SQL, dangerous dangerouslySetInnerHTML).
- Changes to critical business logic (payments, admin access).

## 3. Secret Scanning

- **GitHub Advanced Security:** Enable GitHub Secret Scanning on the repository to prevent pushing API keys (Razorpay, Supabase, Resend).
- **Pre-commit Hooks:** Consider using tools like `trufflehog` or `git-secrets` locally to catch secrets before they are committed.
- **Incident Response:** If a secret is committed, **DO NOT** just delete it in a new commit. The secret must be immediately revoked and rotated at the provider.

## 4. Dependency Review

- Enable GitHub Dependency Review to see the security impact of dependency changes in PRs.
- Block PRs that introduce dependencies with known high/critical vulnerabilities.

## 5. Environment Separation

- **Development/Local:** Connects to local or development Supabase instance. Mock payment gateways.
- **Staging (Vercel):** Connects to a staging Supabase instance. Uses Razorpay Test mode. Mirrors production environment closely.
- **Production (Hostinger/Vercel):** Connects to the production Supabase instance. Uses Razorpay Live mode. Highly restricted access.

**Strict Rule:** Environment variables for Production must NEVER be stored in the repository. They must be managed securely in the hosting provider's dashboard.

## 6. Release Management

- Code flows from `feature-branch` -> `main` (Staging).
- Once validated on `main`, a release is tagged and merged/deployed to the `production` environment.
- Only tested and reviewed code from the staging environment is promoted to production.
