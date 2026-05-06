import { Link } from "react-router";
import { motion } from "motion/react";
import { BadgeCheck, BarChart3, ContactRound, QrCode, Smartphone, Users } from "lucide-react";
import { SEO } from "./seo/SEO";
import { BreadcrumbStructuredData } from "./seo/StructuredData";

const features = [
  {
    icon: ContactRound,
    title: "Digital Business Card",
    description: "One tap profile with instant contact sharing, no app required.",
  },
  {
    icon: QrCode,
    title: "NFC + QR Access",
    description: "Dual delivery using NFC cards and QR fallback for every device.",
  },
  {
    icon: BadgeCheck,
    title: "Verification Badge",
    description: "Verified identity markers for trusted professional networking.",
  },
  {
    icon: BarChart3,
    title: "Tap Analytics",
    description: "Track taps, profile opens, and contact saves in real-time.",
  },
];

export function HomePage() {
  return (
    <div className="pb-20 pt-28 sm:pt-32">
      <SEO
        title="Shutt'L Up Tap | NFC Digital Business Cards"
        description="Premium NFC digital business card platform for modern teams. Share identity, links, and contact details with one tap."
        canonical="/"
        keywords="NFC business card, digital business card, smart contact card, Shutt'L Up Tap"
      />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "/" }]} />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border-muted bg-bg-elevated px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-text-secondary">
              <Smartphone className="h-3.5 w-3.5 text-accent-color" />
              Shutt'L Up Tap Platform
            </span>
            <h1 className="text-text-primary">
              NFC Business Cards for High-Trust, High-Speed Networking
            </h1>
            <p className="max-w-xl text-lg text-text-secondary">
              Shutt'L Up Tap gives your team a premium digital identity card with one-tap profile sharing, QR backup, and analytics built for real business growth.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/tap/demo" className="premium-button rounded-xl px-6 py-3 text-sm">
                View Demo NFC Card
              </Link>
              <a
                href="https://tap.shuttlup.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-border-muted px-6 py-3 text-sm text-text-secondary transition-all hover:bg-accent-soft hover:text-text-primary"
              >
                Open Tap Dashboard
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="glass-card gradient-border p-6"
          >
            <div className="rounded-2xl border border-border-muted bg-bg-secondary/70 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-text-muted">Live Card Preview</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-accent-color to-[var(--accent-purple)] p-[2px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-bg-primary text-text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Alberto "Abbie" Villanueva Jr.</p>
                  <p className="text-sm text-text-muted">Co-Founder of Shutt'L Up and DNSTC</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border-muted bg-bg-elevated p-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted">Taps</p>
                  <p className="mt-1 text-lg font-semibold text-text-primary">2.8k</p>
                </div>
                <div className="rounded-xl border border-border-muted bg-bg-elevated p-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted">Saves</p>
                  <p className="mt-1 text-lg font-semibold text-text-primary">712</p>
                </div>
                <div className="rounded-xl border border-border-muted bg-bg-elevated p-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted">Status</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-400">Active</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-text-primary">Everything You Need for NFC Identity</h2>
            <p className="mt-2 text-text-muted">Built for teams, sales leaders, and modern operators who need premium digital first impressions.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card floating-card p-5">
                <feature.icon className="h-5 w-5 text-accent-color" />
                <h3 className="mt-3 text-base font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
