import { BadgeCheck, Building2, Globe, QrCode, Smartphone, User2 } from "lucide-react";
import { useParams } from "react-router";
import { motion } from "motion/react";
import { SEO } from "./seo/SEO";

const sampleProfiles: Record<string, { name: string; role: string; company: string; bio: string; website: string; email: string; phone: string; verified: boolean; taps: number; saves: number; }> = {
  "demo": {
    name: "Alberto \"Abbie\" Villanueva Jr.",
    role: "Co-Founder of Shutt'L Up and DNSTC",
    company: "Shutt'L Up",
    bio: "Building digital identity experiences for modern transport and smart mobility teams.",
    website: "https://www.shuttlup.com",
    email: "abbie@shuttlup.com",
    phone: "+63 917-555-0171",
    verified: true,
    taps: 2849,
    saves: 712,
  },
};

export function NfcTapProfilePage() {
  const { slug = "demo" } = useParams<{ slug: string }>();
  const profile = sampleProfiles[slug] ?? sampleProfiles.demo;

  return (
    <div className="min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <SEO
        title={`${profile.name} | Shutt'L Up Tap NFC Card`}
        description={`${profile.name} digital NFC business card on Shutt'L Up Tap.`}
        canonical={`/tap/${slug}`}
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="glass-card gradient-border p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative mx-auto sm:mx-0">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent-color to-[var(--accent-purple)] p-[2px] shadow-[0_18px_38px_-20px_var(--glow-blue)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-bg-secondary text-text-primary">
                  <User2 className="h-10 w-10" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-bg-elevated p-1.5">
                <Smartphone className="h-4 w-4 text-accent-color" />
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-text-primary">{profile.name}</h1>
              <p className="text-sm text-text-secondary">{profile.role}</p>
              <p className="inline-flex items-center gap-2 text-sm text-text-muted">
                <Building2 className="h-4 w-4 text-accent-color" />
                {profile.company}
              </p>
              {profile.verified && (
                <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs text-accent-color">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Fleet Verified Profile
                </p>
              )}
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-text-muted">{profile.bio}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut", delay: 0.05 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <a href={profile.website} target="_blank" rel="noreferrer" className="glass-card floating-card p-4 text-sm text-text-primary">
            <span className="mb-2 inline-flex items-center gap-2 text-text-secondary"><Globe className="h-4 w-4 text-accent-color" /> Website</span>
            <p className="truncate">{profile.website}</p>
          </a>
          <a href={`mailto:${profile.email}`} className="glass-card floating-card p-4 text-sm text-text-primary">
            <span className="mb-2 inline-flex items-center gap-2 text-text-secondary">Email</span>
            <p className="truncate">{profile.email}</p>
          </a>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">QR and Tap</h2>
            <QrCode className="h-5 w-5 text-accent-color" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border-muted bg-bg-elevated p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-text-muted">Total Taps</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">{profile.taps}</p>
            </div>
            <div className="rounded-xl border border-border-muted bg-bg-elevated p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-text-muted">Card Saves</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">{profile.saves}</p>
            </div>
            <div className="rounded-xl border border-border-muted bg-bg-elevated p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-text-muted">NFC Status</p>
              <p className="mt-2 text-sm font-semibold text-emerald-400">Active</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={profile.website} target="_blank" rel="noreferrer" className="premium-button rounded-xl px-5 py-2.5 text-sm">Open Full Profile</a>
            <a href={`tel:${profile.phone}`} className="rounded-xl border border-border-muted px-5 py-2.5 text-sm text-text-secondary hover:bg-accent-soft hover:text-text-primary">Call Contact</a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
