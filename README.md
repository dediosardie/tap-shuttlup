# Shutt'L Up Tap

Production-ready NFC-powered digital business card SaaS scaffold for tap.shuttlup.com.

## Stack
- Next.js 15 App Router
- TypeScript
- TailwindCSS (v4 CSS-first)
- Framer Motion
- Supabase (Auth + Data)
- shadcn-style UI primitives
- React Hook Form + Zod
- Recharts
- next-themes

## Features Implemented
- Public profile route: /[username]
- NFC redirect route: /t/[shortcode] (Edge runtime)
- QR profile route: /qr/[username]
- vCard download route: /save/[username]
- Dashboard routes:
  - /dashboard
  - /dashboard/profile
  - /dashboard/cards
  - /dashboard/analytics
  - /dashboard/themes
  - /dashboard/settings
  - /dashboard/modes
- Admin routes:
  - /admin/cards
  - /admin/analytics
  - /admin/users
- Auth screen with magic link + Google OAuth
- API routes:
  - /api/analytics/tap
  - /api/cards/create
- Middleware route protection for dashboard/admin
- Dynamic metadata, sitemap, robots, manifest
- Supabase SQL migration with RLS policies

## Run
1. Install dependencies

```bash
npm install
```

2. Set environment variables in .env.local

```env
NEXT_PUBLIC_APP_URL=https://tap-shuttlup.vercel.app/
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. Start dev server

```bash
npm run dev
```

4. Build

```bash
npm run build
```

## Supabase
Run migration:
- supabase/migrations/202605060001_shuttlup_tap_init.sql

## Notes
- Existing Vite-era files remain in src as legacy and are excluded from new TS build scope.
- Replace mock profile data in lib/mock-data.ts with Supabase queries for production.

## Business Info, Tap, and Card Guide

### 1. Save Business Information

Use the dashboard profile screen to manage your public card details:
- Open /dashboard/profile
- Fill in:
  - Full Name
  - Position / Title
  - Company
  - Username
  - Bio
  - Social links (LinkedIn, Instagram, Website)
- Click Save Profile

What this updates today:
- In this scaffold, Save Profile currently shows a success state in the UI.
- Production persistence should be wired to Supabase (or your preferred backend) from this page.

### 2. How Tap Works

The NFC flow is shortcode-based:
- NFC tag stores only a short URL: https://tap-shuttlup.vercel.app/t/{shortcode}
- The route /t/[shortcode] resolves the shortcode
- If valid, user is redirected to the public profile route: /[username]

Why this pattern is used:
- You can change profile info without rewriting physical NFC tags
- Analytics can be captured at redirect time
- Tags remain lightweight and secure (no raw personal payload on tag)

### 3. How Card Management Works

Use the card dashboard:
- Open /dashboard/cards
- View registered cards with:
  - UID
  - Shortcode
  - Status (active/inactive)
  - Tap count
  - Assigned mode
- Actions:
  - Copy tap URL for sharing/testing
  - Activate/Deactivate a card
  - Create NFC Card (UI action scaffolded)
  - Generate QR (UI action scaffolded)

Current behavior:
- Card list is currently mock/demo data in the UI.
- In production, connect this page to your cards table and update APIs.

### 4. How End Users Save Contact Info

On each public profile page:
- The Save action downloads a .vcf file from /save/[username]
- The route builds a vCard payload and returns it as a downloadable contact

This allows visitors to save business details directly to phone contacts.

### 5. Recommended Production Data Model

Store at minimum:
- profiles: username, full_name, position, company, bio, avatar_url, links
- cards: uid, shortcode, status, profile_id, mode, created_at
- tap_events: shortcode, timestamp, device, referrer, geo (if applicable)

And enforce:
- Unique shortcode
- Unique username
- RLS policies for owner-only writes
