# ShuttlUp Tap

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
NEXT_PUBLIC_APP_URL=https://tap.shuttlup.com
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
