import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/public/public-profile-view";
import { getDemoProfile } from "@/lib/mock-data";
import { absoluteUrl } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const profile = getDemoProfile(username);
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

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = getDemoProfile(username);

  if (!profile) {
    notFound();
  }

  return <PublicProfileView profile={profile} />;
}
