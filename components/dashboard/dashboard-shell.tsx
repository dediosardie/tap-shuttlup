"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, CreditCard, Home, Layers, Palette,
  Settings, UserCircle2, Wifi,
} from "lucide-react";
import { TapNotificationToast } from "@/components/dashboard/tap-notification-toast";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home, exact: true },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
  { href: "/dashboard/cards", label: "NFC Cards", icon: CreditCard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/modes", label: "Modes", icon: Layers },
  { href: "/dashboard/themes", label: "Themes", icon: Palette },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="animated-grid-bg min-h-screen px-4 py-8 md:px-8">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.14)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute right-[-6rem] top-48 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.10)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[240px_1fr]">

        {/* ── Sidebar ────────────────────────────────────────────── */}
        <aside className="glass-card h-fit rounded-2xl p-4">
          {/* Brand */}
          <div className="mb-4 flex items-center gap-2.5 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-purple)]">
              <Wifi className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">Shutt'L Up Tap</p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">NFC Platform</p>
            </div>
          </div>

          <div className="mb-3 h-px bg-[var(--border-muted)]" />

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href) && item.href !== "/dashboard";
              const isOverview = item.href === "/dashboard" && pathname === "/dashboard";
              const isActive = isOverview || (!item.exact && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                    isActive || active
                      ? "bg-[var(--accent-soft)] text-[var(--accent-color)] font-medium"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive || active ? "text-[var(--accent-color)]" : ""}`} />
                  {item.label}
                  {isActive || active ? (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent-color)]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 h-px bg-[var(--border-muted)]" />

          {/* View public profile link */}
          <div className="mt-3 px-1">
            <Link
              href="/ardie"
              target="_blank"
              className="flex items-center gap-2 rounded-xl px-2 py-2 text-xs text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
            >
              <Wifi className="h-3.5 w-3.5" />
              View public card
            </Link>
          </div>
        </aside>

        {/* ── Main Content ───────────────────────────────────────── */}
        <main className="glass-card rounded-2xl p-6 md:p-8">
          <div className="mb-6 border-b border-[var(--border-muted)] pb-4">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
          </div>
          {children}
        </main>
      </div>
      <TapNotificationToast />
    </div>
  );
}

