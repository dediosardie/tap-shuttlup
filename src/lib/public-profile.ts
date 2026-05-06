import type { PublicProfile } from "@/lib/types";
import { getViteSupabaseClient } from "@/lib/supabase";

type ProfileRow = {
  id: string;
  username: string;
  full_name: string;
  position: string | null;
  company: string | null;
  bio: string | null;
  avatar_url: string | null;
  verified: boolean;
  theme: string | null;
};

async function mapProfile(profile: ProfileRow): Promise<PublicProfile> {
  const db = getViteSupabaseClient();
  if (!db) {
    return {
      id: profile.id,
      username: profile.username,
      full_name: profile.full_name,
      position: profile.position ?? "",
      company: profile.company ?? "",
      bio: profile.bio ?? "",
      avatar_url: profile.avatar_url ?? null,
      verified: profile.verified ?? false,
      theme: profile.theme ?? "obsidian",
      social_links: [],
      fleet_info: null,
      metrics: { taps: 0, views: 0, saves: 0 },
    };
  }

  const [{ data: socialLinks }, { data: fleetInfo }, { data: cards }] = await Promise.all([
    db.from("social_links").select("platform, url").eq("profile_id", profile.id),
    db.from("fleet_info").select("vehicle_type, plate_number, operator_id, verified").eq("profile_id", profile.id).maybeSingle(),
    db.from("nfc_cards").select("tap_count").eq("profile_id", profile.id),
  ]);

  const taps = (cards ?? []).reduce((sum, card) => sum + (card.tap_count ?? 0), 0);

  return {
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    position: profile.position ?? "",
    company: profile.company ?? "",
    bio: profile.bio ?? "",
    avatar_url: profile.avatar_url ?? null,
    verified: profile.verified ?? false,
    theme: profile.theme ?? "obsidian",
    social_links: (socialLinks ?? []).map((link) => ({ platform: link.platform, url: link.url })),
    fleet_info: fleetInfo
      ? {
          vehicle_type: fleetInfo.vehicle_type ?? undefined,
          plate_number: fleetInfo.plate_number ?? undefined,
          operator_id: fleetInfo.operator_id ?? undefined,
          verified: fleetInfo.verified ?? false,
        }
      : null,
    metrics: {
      taps,
      views: 0,
      saves: 0,
    },
  };
}

export async function getPublicProfileByUsername(username: string): Promise<PublicProfile | null> {
  const db = getViteSupabaseClient();
  if (!db) return null;

  const { data: profile } = await db
    .from("profiles")
    .select("id, username, full_name, position, company, bio, avatar_url, verified, theme")
    .ilike("username", username)
    .limit(1)
    .maybeSingle();

  if (!profile) return null;
  return mapProfile(profile as ProfileRow);
}

export async function getPublicProfileByShortcode(shortcode: string): Promise<PublicProfile | null> {
  const db = getViteSupabaseClient();
  if (!db) return null;

  const { data: card } = await db
    .from("nfc_cards")
    .select("profile_id, is_active")
    .ilike("shortcode", shortcode)
    .limit(1)
    .maybeSingle();

  if (!card || !card.profile_id || !card.is_active) return null;

  const { data: profile } = await db
    .from("profiles")
    .select("id, username, full_name, position, company, bio, avatar_url, verified, theme")
    .eq("id", card.profile_id)
    .maybeSingle();

  if (!profile) return null;
  return mapProfile(profile as ProfileRow);
}

export async function getAuthedUsername(): Promise<string | null> {
  const db = getViteSupabaseClient();
  if (!db) return null;

  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;

  const { data } = await db
    .from("profiles")
    .select("username")
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.username ?? null;
}
