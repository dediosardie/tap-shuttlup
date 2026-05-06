# Shutt'L Up  - Development Rules & Guidelines

> Master rules document governing the creation and modification of all pages, components, styles, and backend logic for the Shutt'L Up  marketing website.

---

## 1. Project Overview

- **Product Name:** Shutt'L Up 
- **Product Description:** VMMS (Vehicle Maintenance Management System)
- **Browser Title:** `Shutt'L Up `
- **Tech Stack:** React 18 + Vite + Tailwind CSS v4 + TypeScript
- **Routing:** `react-router` using `createHashRouter` (NOT `react-router-dom`, NOT `createBrowserRouter`)
- **Animation:** `motion/react` (imported from the `motion` package)
- **Icons:** `lucide-react`
- **Toast Notifications:** `sonner`
- **Font:** Inter (imported via Google Fonts in `/src/styles/fonts.css`)
- **Supabase Project ID:** `btsdfmfifqahijazssmy`

---

## 2. File & Folder Structure

```
/src
  /app
    App.tsx                        # Root component — default export, wraps RouterProvider
    routes.ts                      # All route definitions (createHashRouter)
    /components
      Layout.tsx                   # Shared layout: Navbar + <Outlet /> + Footer + ScrollToTop
      Navbar.tsx                   # Sticky top navigation bar
      Footer.tsx                   # Site-wide footer
      ScrollToTop.tsx              # Floating scroll-to-top button
      ShuttlLogo.tsx               # Reusable branded logo component
      HomePage.tsx                 # / (index)
      AboutPage.tsx                # /about
      ServicesPage.tsx             # /services
      ContactPage.tsx              # /contact
      PrivacyPolicyPage.tsx        # /privacy
      TermsPage.tsx                # /terms
      NotFound.tsx                 # /* (404 catch-all)
      /figma
        ImageWithFallback.tsx      # PROTECTED — never modify
      /ui
        *.tsx                      # shadcn/ui primitives — avoid modifying unless necessary
  /imports
    MasterPrompt.md               # Original product specification
    Rules.md                       # THIS FILE — development rules
  /styles
    fonts.css                      # Font imports ONLY go here
    theme.css                      # Design tokens and base styles
    index.css                      # Global style entry
    tailwind.css                   # Tailwind directives
/supabase/functions/server
    index.tsx                      # Hono web server (Deno)
    kv_store.tsx                   # PROTECTED — never modify
/utils/supabase
    info.tsx                       # PROTECTED — exports projectId & publicAnonKey
```

### Rules:
- All new page components go in `/src/app/components/` and must be named `<Name>Page.tsx`.
- All new reusable UI components go in `/src/app/components/` (or `/src/app/components/ui/` if they are generic primitives).
- Only create `.tsx` files — never `.js` or `.jsx`.
- Never create a `tailwind.config.js` — Tailwind v4 is configured via CSS.
- Never modify protected files: `ImageWithFallback.tsx`, `kv_store.tsx`, `info.tsx`, `pnpm-lock.yaml`.

---

## 3. Routing Rules

- **Router type:** `createHashRouter` from `react-router` (prevents 404 on page refresh).
- **DO NOT** use `react-router-dom` — it does not work in this environment.
- All routes are children of the `Layout` component (which provides Navbar, Footer, ScrollToTop).
- Every new page must be registered in `/src/app/routes.ts`.
- The `*` wildcard route must always exist and render `NotFound`.

### Adding a New Page:
1. Create `/src/app/components/NewPage.tsx` with a named export.
2. Import it in `/src/app/routes.ts`.
3. Add it as a child route: `{ path: "new-page", Component: NewPage }`.
4. Add a navigation link in `Navbar.tsx` (and optionally `Footer.tsx`).

---

## 4. Dark Theme & Design Tokens

The site uses a **dark-first** design with no light mode toggle. All colors are defined as CSS custom properties in `/src/styles/theme.css`.

### Background Hierarchy:
| Token                | Value     | Usage                              |
|----------------------|-----------|--------------------------------------|
| `bg-bg-primary`      | `#0B0B0B` | Page backgrounds                    |
| `bg-bg-secondary`    | `#121212` | Cards, navbar (scrolled), sections  |
| `bg-bg-elevated`     | `#1A1A1A` | Hover states, input fields, modals  |

### Text Hierarchy:
| Token                | Value     | Usage                              |
|----------------------|-----------|--------------------------------------|
| `text-text-primary`  | `#E5E5E5` | Headings, primary content           |
| `text-text-secondary`| `#B3B3B3` | Body text, descriptions             |
| `text-text-muted`    | `#8A8A8A` | Captions, labels, meta info         |
| `text-text-disabled` | `#5A5A5A` | Disabled states, subtle info        |

### Accent (Orange):
| Token                | Value                      | Usage                         |
|----------------------|----------------------------|-------------------------------|
| `bg-accent-color`    | `#F97316`                  | Buttons, active nav, icons    |
| `hover:bg-accent-hover` | `#FB923C`              | Button hover states           |
| `bg-accent-soft`     | `rgba(249, 115, 22, 0.12)` | Subtle accent backgrounds     |

### Border:
| Token                | Value     | Usage                              |
|----------------------|-----------|--------------------------------------|
| `border-border-muted`| `#2A2A2A` | All borders, dividers, separators  |

### Rules:
- **NEVER** use hardcoded hex colors in components — always use the Tailwind token classes above.
- **NEVER** use white (`#FFFFFF`, `text-white`, `bg-white`) for backgrounds or large text areas — only for text on accent-colored buttons/badges.
- All new components must follow the dark theme. No light-theme fallbacks.
- Shadows should use `shadow-accent-color/25` or `shadow-lg` with dark tones — never light/white shadows.

---

## 5. Component Patterns

### 5.1 Page Component Template:
```tsx
import { useRef } from "react";
import { motion, useInView } from "motion/react";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ExamplePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section — pt-24 accounts for fixed navbar */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* content */}
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 px-4 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            {/* content */}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
```

### 5.2 Key Patterns:
- **Every page** must have `pt-32` (or similar top padding) on its first section to clear the fixed navbar.
- **Alternate section backgrounds** between `bg-bg-primary` and `bg-bg-secondary` for visual rhythm.
- **Use `AnimatedSection`** wrapper for scroll-triggered entrance animations.
- **Max content width:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Responsive grid:** Use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (or 4) patterns.
- **Cards:** Use `bg-bg-secondary` or `bg-bg-elevated` with `border border-border-muted rounded-2xl p-6`.
- **Interactive cards:** Add `hover:border-accent-color/30 transition-all duration-300 group`.

### 5.3 Reusable Components:
- **`ShuttlLogo`** — use for all logo instances; accepts `size="sm" | "md" | "lg"`.
- **`ImageWithFallback`** — use instead of `<img>` for any new images (identical API to `<img>`).
- **Icons** — always from `lucide-react`, sized with `w-5 h-5` or similar Tailwind classes.

---

## 6. Branding & Content Rules

### Brand Name:
- Full product name: **Shutt'L Up  VMMS** (used in footer copyright, about page).
- Navbar header: **Shutt'L Up ** (no "VMMS" suffix).
- Always use the curly apostrophe-style: `Shutt'L Up ` (straight quote is acceptable in code).

### Tagline:
- **"Safety | Comfort | On-Time"**

### Contact Information (used in Footer and Contact Page):
- **Address:** Lot 10, Capri Access Road, Km 23 W Service Rd, Cupang, Muntinlupa, 1771 Metro Manila
- **Phone:** +63 917-816-1707
- **Email:** info@shuttlup.com

### Login Button:
- All "Login" buttons (desktop navbar, mobile navbar, hero CTA) must be `<a>` tags.
- `href="https://app.shuttlup.com"` with `target="_blank"` and `rel="noopener noreferrer"`.
- Never use `<button>` or `<Link>` for login.

### Copyright:
- Format: `© 2024 Shutt'L Up  VMMS. All rights reserved.`

---

## 7. Styling Rules

### Typography:
- Font family: `Inter` (loaded in `/src/styles/fonts.css`).
- Headings use `fontWeight: 800` (extra bold) or `fontWeight: 600` (semibold) via inline style or Tailwind `font-extrabold` / `font-semibold`.
- Body text: `text-text-secondary` with default weight.
- Small/meta text: `text-text-muted text-sm`.

### Buttons:
- **Primary CTA:** `bg-accent-color text-white rounded-lg hover:bg-accent-hover transition-all shadow-lg shadow-accent-color/25`
- **Secondary/Outline:** `border border-border-muted text-text-secondary rounded-lg hover:text-text-primary hover:bg-bg-elevated transition-all`
- **Icon buttons:** `w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center hover:bg-accent-color text-text-muted hover:text-white transition-colors`

### Form Inputs:
- Background: `bg-bg-elevated` or `bg-[#1A1A1A]`
- Border: `border border-border-muted`
- Focus: `focus:border-accent-color focus:ring-1 focus:ring-accent-color`
- Text: `text-text-primary`
- Placeholder: `placeholder:text-text-disabled`

### Transitions:
- Default: `transition-all duration-300`
- Fast: `transition-all duration-200`
- Color only: `transition-colors`

### Responsive Design:
- All pages must be fully responsive (mobile, tablet, desktop).
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`.
- Navigation collapses to hamburger menu at `lg:` breakpoint.
- Grid layouts shift from 1 column (mobile) to 2–4 columns (desktop).

---

## 8. Animation Rules

- Use `motion/react` for all animations (import from `motion` package).
- **Scroll animations:** Use the `AnimatedSection` pattern with `useInView`.
- **Entrance animations:** `initial={{ opacity: 0, y: 40 }}` → `animate={{ opacity: 1, y: 0 }}`.
- **Stagger children:** Use `transition={{ delay: index * 0.1 }}` for list items.
- **Hover animations:** Use Tailwind `hover:` classes, not Motion's `whileHover` (for simplicity).
- **All animations should use `once: true`** to fire only on first scroll into view.

---

## 9. Backend Rules

### Server:
- Hono web server in `/supabase/functions/server/index.tsx`.
- All routes prefixed with `/make-server-fb6c0f85/`.
- CORS enabled for all origins.
- Logger enabled: `app.use('*', logger(console.log))`.
- Import external packages via `npm:` or `jsr:` specifiers.
- Node built-ins use `node:` specifier (e.g., `import process from "node:process"`).

### Data Storage:
- Use the KV store (`kv_store.tsx`) for all data persistence.
- **Do NOT** create SQL migrations or DDL statements — they cannot run in this environment.
- KV functions: `get`, `set`, `del`, `mget`, `mset`, `mdel`, `getByPrefix`.
- There is no `list` function.

### Frontend → Server Communication:
- Base URL: `https://btsdfmfifqahijazssmy.supabase.co/functions/v1/make-server-fb6c0f85/<route>`
- Authorization header: `Bearer ${publicAnonKey}`
- Import connection info: `import { projectId, publicAnonKey } from '/utils/supabase/info'`

### Environment Variables (Server-side):
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` — pre-configured.
- `RESEND_API_KEY` — available for sending emails.
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend.

---

## 10. Image Rules

- **Always** use the `unsplash_tool` to source images — never hardcode or guess URLs.
- Use `ImageWithFallback` (from `/src/app/components/figma/ImageWithFallback.tsx`) instead of raw `<img>` tags for new images.
- Figma-imported raster images use `figma:asset/...` imports (no path prefix).
- Figma-imported SVGs use relative file paths from `/src/imports/`.
- Every image should have a descriptive `alt` attribute for accessibility.

---

## 11. Accessibility (a11y)

- All interactive elements must be keyboard-accessible.
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<a>`.
- Buttons with only icons must have `aria-label`.
- Form inputs must have associated `<label>` elements.
- Color contrast must meet WCAG AA against dark backgrounds.
- Focus states must be visible (use `focus:ring` or `focus:border` styles).

---

## 12. Performance

- Lazy load images and heavy components where possible.
- Keep component files focused — one primary export per file.
- Avoid inline anonymous functions in render where performance-critical.
- Use `React.memo` for expensive list item components if needed.

---

## 13. Checklist for New Pages

- [ ] Created component in `/src/app/components/<Name>Page.tsx`
- [ ] Named export matches filename
- [ ] Registered route in `/src/app/routes.ts`
- [ ] First section has `pt-32` to clear fixed navbar
- [ ] Uses dark theme tokens (no hardcoded colors)
- [ ] Includes `AnimatedSection` for scroll animations
- [ ] Responsive across mobile/tablet/desktop
- [ ] Added nav link in `Navbar.tsx` (if applicable)
- [ ] Added footer link (if applicable)
- [ ] All images sourced via `unsplash_tool` or Figma imports
- [ ] All icons from `lucide-react`
- [ ] Accessible (semantic HTML, aria labels, keyboard nav)

---

## 14. Checklist for New Components

- [ ] Created in `/src/app/components/` as `.tsx`
- [ ] Has TypeScript interface for props
- [ ] Uses dark theme tokens consistently
- [ ] Accepts `className` prop for style overrides (where appropriate)
- [ ] Has no hardcoded colors — only Tailwind token classes
- [ ] Exported as named export

---

## 15. Things to NEVER Do

1. **Never** use `react-router-dom` — only `react-router`.
2. **Never** use `createBrowserRouter` — only `createHashRouter`.
3. **Never** hardcode hex colors — use theme tokens.
4. **Never** use white/light backgrounds.
5. **Never** modify protected files (`ImageWithFallback.tsx`, `kv_store.tsx`, `info.tsx`).
6. **Never** create `tailwind.config.js` — Tailwind v4 uses CSS config.
7. **Never** use `<button>` for Login — always `<a href="https://app.shuttlup.com" target="_blank">`.
8. **Never** write SQL migrations or DDL statements.
9. **Never** expose `SUPABASE_SERVICE_ROLE_KEY` to frontend code.
10. **Never** add font imports outside of `/src/styles/fonts.css`.
11. **Never** guess image URLs — always use `unsplash_tool`.
12. **Never** use `konva` for canvas — use native Canvas API.
