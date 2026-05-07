import { notFound, redirect } from "next/navigation";
import { PublicProfileView } from "@/components/public/public-profile-view";
import { absoluteUrl } from "@/lib/utils";
import { getAuthedUsername, getPublicProfileByUsername, recordUsernameAccess } from "@/lib/public-profile-server";
import { createSourceToken, verifySourceToken } from "@/lib/source-token";
import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);
  if (!profile) return {};

  return {
    title: `${profile.full_name} · ${profile.position}`,
    description: profile.bio,
    openGraph: {
      title: `${profile.full_name} · ${profile.position}`,
      description: profile.bio,
      url: absoluteUrl(`/${profile.username}`),
    },
  };
}

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ src?: string; st?: string }>;
}) {
  const { username } = await params;
  const { src, st } = await searchParams;
  const profile = await getPublicProfileByUsername(username);

  if (profile && profile.username !== username) {
    redirect(`/${profile.username}`);
  }

  if (!profile) {
    const authedUsername = await getAuthedUsername();
    if (authedUsername && authedUsername !== username) {
      redirect(`/${authedUsername}`);
    }
    notFound();
  }

  const wantsQr = src === "qr";
  const wantsTap = src === "tap" || src === "nfc";

  const hasValidQrToken = wantsQr && verifySourceToken(st, profile.username, "qr");
  const hasValidTapToken = wantsTap && verifySourceToken(st, profile.username, "tap");
  const resolvedSource: "tap" | "qr" | "direct" = hasValidQrToken ? "qr" : hasValidTapToken ? "tap" : "direct";

  const requestHeaders = await headers();
  await recordUsernameAccess(profile.username, resolvedSource, requestHeaders);

  const sourceTokens = {
    tap: createSourceToken(profile.username, "tap") ?? undefined,
    qr: createSourceToken(profile.username, "qr") ?? undefined,
  };

  return <PublicProfileView profile={profile} visitSource={resolvedSource} sourceTokens={sourceTokens} />;
}
