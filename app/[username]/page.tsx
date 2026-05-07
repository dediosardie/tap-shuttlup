import { notFound, redirect } from "next/navigation";
import { PublicProfileView } from "@/components/public/public-profile-view";
import { absoluteUrl } from "@/lib/utils";
import { getAuthedUsername, getPublicProfileByUsername, recordUsernameAccess } from "@/lib/public-profile-server";
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
  searchParams: Promise<{ src?: string }>;
}) {
  const { username } = await params;
  const { src } = await searchParams;
  const resolvedSource: "tap" | "qr" | "direct" = src === "qr" ? "qr" : src === "tap" || src === "nfc" ? "tap" : "direct";
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

  const requestHeaders = await headers();
  await recordUsernameAccess(profile.username, resolvedSource, requestHeaders);

  return <PublicProfileView profile={profile} visitSource={resolvedSource} />;
}
