# Rate Limiting Endpoint Audit

This document provides a complete inventory and classification of rate-limited endpoints in the Revive Fight Club application.

## Endpoint Inventory

| Route | Method | Auth | Admin | Sensitive | Rate Limited | Limit | Priority |
|---|---|---|---|---|---|---|---|
| `/api/payments/create-order` | POST | No | No | CRITICAL | Yes | 5/10min | P1 |
| `/api/payments/verify` | POST | No | No | CRITICAL | Yes | 10/10min | P1 |
| `/api/webhooks/razorpay` | POST | Signature | No | CRITICAL | No (signature) | N/A | P1 |
| `/api/admin/upload` | POST | Yes | Yes | HIGH | Yes | 30/min | P2 |
| `/api/admin/upload-video` | POST/DELETE | Yes | Yes | HIGH | Yes (POST) | 10/min | P2 |
| `/api/admin/slot-history` | GET | Yes | Yes | NORMAL | Yes | 60/min | P3 |
| `/auth/callback` | GET | OAuth | No | CRITICAL | Yes | 10/15min | P1 |
| `submitTrialRequest` (SA) | N/A | No | No | HIGH | Yes | 5/hr | P2 |
| `submitContactEnquiry` (SA) | N/A | No | No | HIGH | Yes | 5/hr | P2 |
| ~11 admin SA files (~60 funcs)| N/A | Yes | Yes | HIGH | No (`requireAdmin`) | N/A | P3 |

*(SA) = Server Action*

## Classification Strategy

- **CATEGORY A (CRITICAL)**: Payment creation, payment verification, auth callbacks.
- **CATEGORY B (HIGH)**: Trial bookings, contact form submissions, admin uploads.
- **CATEGORY C (NORMAL)**: Admin slot-history tracking, administrative server actions.
- **CATEGORY D (WEBHOOK)**: Razorpay webhook. Relies entirely on signature verification rather than rate limiting.
