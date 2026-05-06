import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { BadgeCheck, Download, QrCode, Wifi } from "lucide-react";
import type { PublicProfile } from "@/lib/types";
import { getAuthedUsername, getPublicProfileByUsername } from "@/lib/public-profile";

export function QrPage() {
  const { username = "" } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const resolved = await getPublicProfileByUsername(username);

      if (!active) return;

      if (resolved) {
        if (resolved.username !== username) {
          navigate(`/qr/${resolved.username}`, { replace: true });
          return;
        }
        setProfile(resolved);
        setLoading(false);
        return;
      }

      const authedUsername = await getAuthedUsername();
      if (!active) return;

      if (authedUsername && authedUsername !== username) {
        navigate(`/qr/${authedUsername}`, { replace: true });
      } else {
        navigate("/404", { replace: true });
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [navigate, username]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-color)] border-t-transparent" />
      </main>
    );
  }

  if (!profile) return null;

  const profileUrl = `https://tap.shuttlup.com/${profile.username}?src=qr`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&color=F97316&bgcolor=121212&data=${encodeURIComponent(profileUrl)}`;

  return (
    <>
      <Helmet>
        <title>{`${profile.full_name} QR Code`}</title>
        <meta name="description" content={`Scan to view ${profile.full_name}'s Shutt'L Up Tap profile`} />
      </Helmet>

      <main className="animated-grid-bg flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
        {/* Ambient glow */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.2)_0%,transparent_70%)] blur-3xl" />
        </div>

        <div className="glass-card gradient-border w-full max-w-sm space-y-6 p-8">
          <div className="space-y-1">
            <div className="mb-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-color)]">
              <Wifi className="h-3.5 w-3.5" /> Shutt'L Up Tap
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{profile.full_name}</h1>
            <p className="text-sm text-[var(--text-muted)]">{profile.position} · {profile.company}</p>
            {profile.verified && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </div>

          <div className="flex items-center justify-center">
            <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4 accent-glow">
              <img
                src={qrUrl}
                alt={`QR code for ${profile.full_name}`}
                width={260}
                height={260}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
            <QrCode className="h-4 w-4 text-[var(--accent-color)]" />
            Scan to open NFC profile
          </div>

          <div className="grid gap-2">
            <Link
              to={`/${profile.username}`}
              className="premium-button flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
            >
              Open Profile
            </Link>
            <a
              href={qrUrl}
              download={`${profile.username}-qr.png`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] py-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <Download className="h-4 w-4" /> Download QR
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
