# REVIVE FIGHT CLUB — ADMIN GUIDE

## Overview

The admin panel is available at `/admin`. It is **not linked from the public site** and is completely separate from the customer-facing experience.

---

## First-Time Setup

### 1. Add Service Role Key

Create or edit `.env.local` in the project root and add:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

> Get this from: Supabase Dashboard → Project Settings → API → `service_role` key  
> ⚠️ NEVER commit this to git. NEVER expose it to the browser.

### 2. Create the First Admin User

**Step A — Create the auth user:**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter the staff email and a strong password
4. Note the UUID that Supabase generates

**Step B — Insert the profile record:**
```sql
INSERT INTO public.profiles (id, full_name, role, is_active)
VALUES (
  'paste-the-uuid-here',
  'Your Name',
  'admin',
  true
);
```

Run this in Supabase Dashboard → SQL Editor.

### 3. Login

Go to `/admin/login` and sign in with the credentials you created.

---

## Role Permissions

| Feature | admin | manager |
|---|---|---|
| View/update trial requests | ✅ | ✅ |
| View/update enquiries | ✅ | ✅ |
| Manage all content | ✅ | ✅ |
| Business settings | ✅ | ✅ |
| Delete content permanently | ✅ | ❌ |

---

## Admin Sections

### Dashboard `/admin`
Overview metrics for trials, enquiries, and content status.

### Trial Requests `/admin/trials`
- Filter by status, search by name/phone/email
- View full detail, call or WhatsApp lead directly
- Update status + add admin notes

**Workflow:** New → Contact (WhatsApp/call) → `contacted` → Confirm → `confirmed` → After class → `completed`

### Enquiries `/admin/enquiries`
- Contact form submissions with full detail
- Filter by: new, contacted, resolved, spam

### Programs `/admin/programs`
- Add/edit/archive training programs
- Upload images, toggle active/featured, set display order

### Trainers `/admin/trainers`
- Add/edit/archive trainers, upload photos
- Set specialties, bio, experience

### Schedule `/admin/schedule`
- Add class sessions grouped by day
- Link to program + trainer, set level and location

### Memberships `/admin/memberships`
- Create plans with pricing, billing period, feature list
- Toggle featured for homepage highlight

### Reviews `/admin/reviews`
- Add reviews manually, toggle published/featured

### FAQs `/admin/faqs`
- Add Q&A pairs, group by category, set display order

### Facilities `/admin/facilities`
- Add gym facilities with images, toggle active/featured

### Gallery `/admin/gallery`
- Upload images, assign category, toggle published/featured

### Business Settings `/admin/settings`
- Update phone, WhatsApp, email, address, social links
- Changes reflect on public site immediately

> ⚠️ WhatsApp number must be digits only with country code, e.g. `919876543210`

---

## Security Notes

- Admin panel is protected by middleware — unauthenticated users are redirected to `/admin/login`
- Sessions managed by Supabase Auth (httpOnly cookies)
- All writes protected by Row Level Security (RLS)
- Service role key is server-only — never reaches the browser
- Admin routes are noindex (not crawled by search engines)

---

## Adding More Staff

1. Create auth user in Supabase Dashboard → Authentication → Users
2. Insert their profile row (as above)
3. Share the `/admin/login` URL and their credentials

---

## Deployment Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set in production
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in production
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set in production (server-only)
- [ ] First admin user created in Supabase
- [ ] Business settings populated in admin panel
- [ ] At least one program created and active
- [ ] Schedule sessions added

---

*Revive Fight Club — Admin System built with Next.js 15 + Supabase*
