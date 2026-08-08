# Deployment Guide — Revive Fight Club

## Prerequisites

- Node.js 18+
- A Supabase project (already set up at https://hnmtjcpmdywwtafgexxk.supabase.co)
- A Vercel account (for production deployment)
- A GitHub account with access to: https://github.com/kuku9570/Revive-Fight-Club

---

## 1. Clone the Repository

```bash
git clone https://github.com/kuku9570/Revive-Fight-Club.git
cd Revive-Fight-Club
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://hnmtjcpmdywwtafgexxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key from Supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<your service role key from Supabase dashboard>
```

> **Important**: Get these values from:
> Supabase Dashboard → Project Settings → API

> **Security**: `SUPABASE_SERVICE_ROLE_KEY` is server-only.
> - NEVER prefix it with `NEXT_PUBLIC_`
> - NEVER commit `.env.local` to git
> - NEVER expose it in client-side code

## 4. Run Locally

```bash
npm run dev
```

Verify:
- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

## 5. Run Production Build Test

```bash
npm run build
npm run start
```

---

## 6. Deploy to Vercel

### Step A — Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import from GitHub: `kuku9570/Revive-Fight-Club`
4. Vercel will auto-detect Next.js

### Step B — Configure Environment Variables in Vercel

In Vercel project settings → Environment Variables, add:

| Key | Value | Environment |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Production only |

> **Critical**: For `SUPABASE_SERVICE_ROLE_KEY`:
> - Set it as **Production only** (or at minimum, do NOT mark it as a browser variable)
> - In Vercel, it is automatically server-only as long as you do NOT prefix it with `NEXT_PUBLIC_`

### Step C — Deploy

Click **Deploy**. Vercel will build and deploy the application.

### Step D — Verify Production

After deployment, test:
- [ ] Homepage loads
- [ ] Programs page works
- [ ] Book a Trial form submits
- [ ] Contact form submits
- [ ] Admin login works at `/admin/login`
- [ ] WhatsApp / Phone CTAs work

---

## 7. Admin First-Time Setup

See [ADMIN.md](./ADMIN.md) for creating the first admin user.

Summary:
1. Go to Supabase Dashboard → Authentication → Users → Add user
2. Insert a row in `public.profiles` with the user's UUID, name, role, and `is_active = true`
3. Login at `yourdomain.com/admin/login`

---

## Database Schema

The complete schema is in `supabase/migrations/`. Migrations are numbered sequentially and were applied to the Supabase project during development.

If setting up a fresh Supabase project, apply migrations in order:
```bash
# Using Supabase CLI
supabase db push
```

Or apply manually via Supabase Dashboard → SQL Editor.

---

## Environment Variable Summary

| Variable | Where to find | Server/Client |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Both (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Both (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | Server ONLY |
