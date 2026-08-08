# Revive Fight Club

Professional marketing and lead generation website for Revive Fight Club, Bengaluru.

Built with Next.js 15, Supabase, and TypeScript.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Features

### Public Website
- Homepage with programs preview, trainer showcase, reviews
- Programs listing
- Trainer profiles
- Class schedule
- Membership plans
- Gallery
- Contact page
- Book a Trial form
- WhatsApp, phone, and directions CTAs

### Admin Dashboard (`/admin`)
- Authentication with role-based access (admin / manager)
- Trial request management with status workflow
- Contact enquiry management
- Full CMS: Programs, Trainers, Schedule, Memberships, Reviews, FAQs, Facilities, Gallery
- Business settings management
- Image upload to Supabase Storage

## Getting Started

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full setup and deployment instructions.

### Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/kuku9570/Revive-Fight-Club.git
cd Revive-Fight-Club

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

## Admin Setup

See [ADMIN.md](./ADMIN.md) for admin user creation and management instructions.

## Database

The database schema is in `supabase/migrations/`. See [SUPABASE.md](./SUPABASE.md) for database documentation.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (server) | Service role key — server only, never expose |

## License

Private — All rights reserved. Revive Fight Club.
