import { notFound, redirect } from "next/navigation";
import { getPublicProfileByUsername, recordUsernameAccess } from "@/lib/public-profile-server";
import { absoluteUrl } from "@/lib/utils";
import { createSourceToken } from "@/lib/source-token";
import type { Metadata } from "next";
import { BadgeCheck, Download, QrCode, Wifi } from "lucide-react";
import { headers } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);
  if (!profile) return {};
  return {
    title: `${profile.full_name} QR Code`,
    description: `Scan to view ${profile.full_name}'s Shutt'L Up Tap profile`,
    openGraph: { url: absoluteUrl(`/qr/${username}`) },
  };
}

export default async function QrProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);
  if (!profile) notFound();
  if (profile.username !== username) {
    redirect(`/qr/${profile.username}`);
  }

  const requestHeaders = await headers();
  await recordUsernameAccess(profile.username, "qr", requestHeaders);

  const qrToken = createSourceToken(profile.username, "qr");
  const profileUrl = qrToken
    ? `https://tap.shuttlup.com/${profile.username}?src=qr&st=${encodeURIComponent(qrToken)}`
    : `https://tap.shuttlup.com/${profile.username}?src=qr`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&color=F97316&bgcolor=121212&data=${encodeURIComponent(profileUrl)}`;

  return (
    <main className="animated-grid-bg flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.2)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="glass-card gradient-border w-full max-w-sm space-y-6 p-8">
        {/* Header */}
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

        {/* QR Code */}
        <div className="flex items-center justify-center">
          <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4 accent-glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`QR code for ${profile.full_name}`}
              width={260}
              height={260}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* QR Icon label */}
        <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
          <QrCode className="h-4 w-4 text-[var(--accent-color)]" />
          Scan to open NFC profile
        </div>

        {/* Action buttons */}
        <div className="grid gap-2">
          <a
            href={qrToken ? `/${profile.username}?src=qr&st=${encodeURIComponent(qrToken)}` : `/${profile.username}?src=qr`}
            className="premium-button flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
          >
            Open Profile
          </a>
          <a
            href={qrUrl}
            download={`${profile.username}-qr.png`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Download className="h-4 w-4" /> Download QR
          </a>
        </div>
      </div>

      <p className="mt-6 text-xs text-[var(--text-disabled)]">tap.shuttlup.com/{profile.username}</p>
    </main>
  );
}

