import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, Car, QrCode, Shield, Smartphone, Users, Wifi } from "lucide-react";

const features = [
  {
    icon: Wifi,
    title: "NFC Tap Identity",
    description: "One tap shares your full digital profile. No app. No friction. Instant connection.",
  },
  {
    icon: QrCode,
    title: "NFC + QR Dual Share",
    description: "Every card comes with a dynamic QR fallback for every device and scenario.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Fleet Profiles",
    description: "Driver, operator, and fleet verification badges for high-trust networking.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track taps, profile views, saves, and QR scans with rich geographic data.",
  },
  {
    icon: Car,
    title: "Transport Identity",
    description: "Built for mobility teams — include vehicle, plate, and operator details.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Rate limiting, RLS policies, and anti-spam controls on every tap.",
  },
];

export default function HomePage() {
  return (
    <main className="animated-grid-bg min-h-screen">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.22)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute right-[-7rem] top-36 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.16)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.10)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              <Wifi className="h-3.5 w-3.5 text-[var(--accent-color)]" />
              tap.shuttlup.com
            </span>

            <h1 className="text-4xl font-bold leading-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl">
              NFC-powered<br />
              <span className="bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] bg-clip-text text-transparent">
                digital identity
              </span>
              <br />for mobility teams.
            </h1>

            <p className="max-w-xl text-lg text-[var(--text-secondary)]">
              Create premium smart profiles, tap-enabled NFC cards, QR shares, and real-time analytics
              built for enterprise mobility and transport teams.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/sign-in"
                className="premium-button inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ardie"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-muted)] px-6 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--text-primary)]"
              >
                <Users className="h-4 w-4" /> View Demo Profile
              </Link>
            </div>
          </div>

          {/* Live card preview */}
          <div className="glass-card gradient-border p-6 sm:p-8">
            <p className="mb-4 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Live Card Preview</p>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-purple)] p-[2px] accent-glow">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[var(--bg-secondary)]">
                  <Users className="h-6 w-6 text-[var(--text-primary)]" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Ardie Cruz</p>
                <p className="text-xs text-[var(--text-muted)]">Fleet Innovation Lead · Shutt'L Up Tap</p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] text-[var(--accent-color)]">
                  <BadgeCheck className="h-3 w-3" /> Fleet Verified
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Taps", value: "1.9k" },
                { label: "Views", value: "1.4k" },
                { label: "Saves", value: "602" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
                  <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link
                href="/ardie"
                className="premium-button flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold"
              >
                <Smartphone className="h-4 w-4" /> Open Card
              </Link>
              <Link
                href="/qr/ardie"
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] py-2.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <QrCode className="h-4 w-4" /> QR Code
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────────────── */}
        <section className="mt-24">
          <div className="mb-10 text-center">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--accent-color)]">Platform Features</span>
            <h2 className="mt-2 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              Everything your team needs
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[var(--text-muted)]">
              Shutt'L Up Tap is a fully integrated NFC identity module built on the ShuttlUp platform.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="floating-card glass-card rounded-2xl p-5 space-y-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
                  <Icon className="h-5 w-5 text-[var(--accent-color)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section className="mt-24">
          <div className="glass-card gradient-border rounded-3xl p-10 text-center md:p-16">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-4 py-1.5 text-xs uppercase tracking-widest text-[var(--accent-color)]">
              <Wifi className="h-3.5 w-3.5" /> Get started today
            </span>
            <h2 className="mt-2 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              Your team deserves a<br className="hidden sm:block" /> premium digital identity.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[var(--text-secondary)]">
              Set up your NFC card in minutes. No hardware required to start. Ship your tap identity to every device.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/sign-in"
                className="premium-button inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold"
              >
                Create Your Free Card <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-muted)] px-6 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--text-primary)]"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

