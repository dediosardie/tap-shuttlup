import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  BadgeCheck, Briefcase, Building2, Car, Copy, Download, ExternalLink,
  Facebook, Globe, Instagram, Linkedin, Mail, MessageCircle,
  Phone, QrCode, Share2, Smartphone, TrendingUp, Users, User2,
  Eye, Wifi, Youtube,
} from "lucide-react";
import type { PublicProfile } from "@/lib/types";
import type { ModeType } from "@/lib/types";
import { recordProfileSave } from "@/lib/public-profile";
import { downloadVCard } from "@/lib/vcard";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  website: Globe,
  tiktok: Smartphone,
};

const MODE_META: Record<ModeType, { label: string; icon: React.ElementType; badgeClass: string; showMetricsTop: boolean; showFleet: boolean }> = {
  personal:  { label: "Personal",  icon: User2,      badgeClass: "bg-violet-500/15 text-violet-300",  showMetricsTop: false, showFleet: false },
  corporate: { label: "Corporate", icon: Briefcase,  badgeClass: "bg-blue-500/15 text-blue-300",      showMetricsTop: false, showFleet: false },
  driver:    { label: "Driver",    icon: Car,        badgeClass: "bg-[var(--accent-soft)] text-[var(--accent-color)]", showMetricsTop: false, showFleet: true  },
  fleet:     { label: "Fleet",     icon: Users,      badgeClass: "bg-emerald-500/15 text-emerald-300", showMetricsTop: false, showFleet: true  },
  investor:  { label: "Investor",  icon: TrendingUp, badgeClass: "bg-amber-500/15 text-amber-300",    showMetricsTop: true,  showFleet: false },
};

function MetricBadge({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-3">
      <Icon className="h-4 w-4 text-[var(--accent-color)]" />
      <p className="text-lg font-bold text-[var(--text-primary)]">{value.toLocaleString()}</p>
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

export function PublicProfileView({ profile }: { profile: PublicProfile }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://tap.shuttlup.com/${profile.username}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=F97316&bgcolor=121212&data=${encodeURIComponent(profileUrl)}`;
  const modeMeta = MODE_META[profile.mode as ModeType] ?? MODE_META.personal;
  const ModeIcon = modeMeta.icon;

  function handleCopy() {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: profile.full_name, url: profileUrl });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="animated-grid-bg min-h-screen px-4 pb-24 pt-12 sm:px-6">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.22)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute right-[-5rem] top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.16)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-lg space-y-4">
        {/* Hero Card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="glass-card gradient-border overflow-hidden p-6 sm:p-8"
        >
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-purple)] p-[2px] accent-glow">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="h-full w-full rounded-[calc(var(--radius)-2px)] object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-[calc(var(--radius)-2px)] bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    <Users className="h-10 w-10" />
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-elevated)] shadow-md">
                <Wifi className="h-3.5 w-3.5 text-[var(--accent-color)]" />
              </span>
            </div>

            <div className="flex-1 space-y-1.5">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">{profile.full_name}</h1>
              <p className="text-sm text-[var(--text-secondary)]">{profile.position}</p>
              <p className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                <Building2 className="h-3.5 w-3.5 text-[var(--accent-color)]" />
                {profile.company}
              </p>
              {profile.verified && (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-color)]">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified Profile
                  </span>
                </div>
              )}
              {/* Mode badge */}
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${modeMeta.badgeClass}`}>
                  <ModeIcon className="h-3.5 w-3.5" />
                  {modeMeta.label}
                </span>
              </div>
            </div>
          </div>

          {profile.bio && (
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)]">{profile.bio}</p>
          )}

          {/* Investor: metrics pinned to top of hero; others: shown below bio */}
          {profile.metrics && (
            <div className="mt-5 grid grid-cols-3 gap-3">
              <MetricBadge label="Taps" value={profile.metrics.taps} icon={Wifi} />
              <MetricBadge label="Views" value={profile.metrics.views} icon={Eye} />
              <MetricBadge label="Saves" value={profile.metrics.saves} icon={TrendingUp} />
            </div>
          )}
        </motion.section>

        {/* CTA Actions */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
          className="glass-card p-5"
        >
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[
              {
                label: "Save",
                icon: Download,
                onClick: async () => {
                  await recordProfileSave(profile.id);
                  downloadVCard(profile);
                },
              },
              {
                label: "Call",
                icon: Phone,
                href: profile.mobile_no
                  ? `tel:${profile.mobile_no}`
                  : profile.social_links.find((l) => l.platform === "phone")?.url
                    ? `tel:${profile.social_links.find((l) => l.platform === "phone")?.url}`
                    : undefined,
              },
              {
                label: "Email",
                icon: Mail,
                href: profile.email
                  ? `mailto:${profile.email}`
                  : profile.social_links.find((l) => l.platform === "email")?.url
                    ? `mailto:${profile.social_links.find((l) => l.platform === "email")?.url}`
                    : undefined,
              },
              {
                label: "Website",
                icon: Globe,
                href: profile.social_links.find((l) => l.platform === "website")?.url ?? undefined,
                external: true,
              },
              {
                label: "Message",
                icon: MessageCircle,
                href: profile.mobile_no
                  ? `sms:${profile.mobile_no}`
                  : profile.social_links.find((l) => l.platform === "phone")?.url
                    ? `sms:${profile.social_links.find((l) => l.platform === "phone")?.url}`
                    : undefined,
              },
              { label: "Share", icon: Share2, onClick: handleShare },
            ].map(({ label, icon: Icon, href, external, onClick }) =>
              href && !onClick ? (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="floating-card flex flex-col items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-3 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <Icon className="h-5 w-5 text-[var(--accent-color)]" />
                  {label}
                </a>
              ) : (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  disabled={!onClick}
                  className="floating-card flex flex-col items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-3 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon className="h-5 w-5 text-[var(--accent-color)]" />
                  {label}
                </button>
              )
            )}
          </div>
        </motion.section>

        {/* Social Links */}
        {profile.social_links.filter((l) => !["phone", "email", "website"].includes(l.platform)).length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.12 }}
            className="glass-card p-5"
          >
            <h2 className="mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Social &amp; Links</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {profile.social_links
                .filter((l) => !["phone", "email"].includes(l.platform))
                .map((link) => {
                  const Icon = SOCIAL_ICONS[link.platform] ?? Globe;
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="floating-card flex items-center gap-2.5 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm capitalize text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[var(--accent-color)]" />
                      <span className="truncate">{link.platform}</span>
                      <ExternalLink className="ml-auto h-3 w-3 shrink-0 opacity-40" />
                    </a>
                  );
                })}
            </div>
          </motion.section>
        )}

        {/* Fleet / Transport Info — shown for driver & fleet modes when data exists */}
        {profile.fleet_info && modeMeta.showFleet && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.16 }}
            className="glass-card gradient-border p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <Car className="h-4 w-4 text-[var(--accent-color)]" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Fleet Identity</h2>
              {profile.fleet_info.verified && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              {[
                { label: "Vehicle", value: profile.fleet_info.vehicle_type ?? "N/A" },
                { label: "Plate", value: profile.fleet_info.plate_number ?? "N/A" },
                { label: "Operator", value: profile.fleet_info.operator_id ?? "N/A" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-3">
                  <p className="text-[var(--text-muted)]">{label}</p>
                  <p className="mt-1 font-semibold text-[var(--text-primary)]">{value}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* QR Code */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <QrCode className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">QR Code</h2>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-3">
              <img src={qrUrl} alt="Profile QR" width={140} height={140} className="rounded-xl" />
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-xs text-[var(--text-muted)]">Scan or share this QR code to instantly open this profile.</p>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2">
                <span className="flex-1 truncate text-xs text-[var(--text-muted)]">{profileUrl}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
                  aria-label="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copied && <p className="text-xs text-emerald-400">Link copied!</p>}
              <Link
                to={`/qr/${profile.username}`}
                className="premium-button inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm"
              >
                <QrCode className="h-4 w-4" /> View Full QR Page
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-2 text-center"
        >
          <a
            href="https://shuttlup.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-disabled)] hover:text-[var(--text-muted)]"
          >
            <Smartphone className="h-3.5 w-3.5" />
            Powered by Shutt'L Up Tap
          </a>
        </motion.div>
      </div>
    </div>
  );
}
