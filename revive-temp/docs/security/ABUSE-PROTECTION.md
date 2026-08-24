# Abuse Protection Strategy

This document outlines the comprehensive abuse protection mechanisms implemented in the Revive Fight Club application.

## Core Protections

### Payment Abuse
- **Server-Authoritative Pricing**: All pricing calculations occur server-side; client inputs for price are ignored.
- **HMAC Verification**: Razorpay signatures are verified using HMAC SHA-256 with `timingSafeEqual` to prevent timing attacks.
- **Idempotency**: Webhooks utilize idempotent processing to ensure duplicate events do not result in duplicate state changes.
- **Rate Limiting**: Applied to order creation and verification endpoints to prevent spam.

### Booking Abuse
- **RPC Execution**: Trial bookings utilize a Supabase RPC function (`SECURITY DEFINER`) for secure data handling.
- **Rate Limiting**: Strictly limited per IP and phone number combination.
- **Input Validation**: Strict validation on all submitted fields.

### Contact Abuse
- **RPC Execution**: Contact form submissions are handled via secure RPC function.
- **Rate Limiting**: Applied by IP to prevent contact form spam.
- **Input Validation**: Ensuring appropriate formatting and length limits.

### Authentication Abuse
- **Provider**: Google OAuth exclusively (no passwords, eliminating credential stuffing attacks).
- **Callback Protection**: Auth callback endpoint is rate-limited by IP to prevent OAuth abuse.

### Admin Abuse
- **Guard Clause**: `requireAdmin()` acts as a server-side guard on all admin actions.
- **Role Hierarchy**: Strict enforcement of roles (superadmin, admin, manager, receptionist).
- **Rate Limiting**: Admin API routes (uploads, slot history) are rate-limited by User ID.

## Application Security Principles

### Identity & State
- **Server-Side Session**: Identity verification strictly relies on server-side session checks.
- **Header Trust**: Client headers are never trusted for identity or critical state determinations.

### Business Logic Integrity
- **Calculations**: Server exclusively calculates amounts and validates plans.
- **Data Integrity**: Server verifies dates and dependencies.

### Input Validation
- **Defense in Depth**: Applied to all endpoints.
- **Checks**: Length limits, type checks, and format validation are mandatory for all external inputs.
