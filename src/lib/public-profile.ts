import type { PublicProfile } from "@/lib/types";
import { getViteSupabaseClient } from "@/lib/supabase";

type AccessSource = "tap" | "qr" | "direct";

function isNfcSource(source: AccessSource): boolean {
  return source === "tap";
}

type ProfileRow = {
  id: string;
  username: string;
  full_name: string;
  position: string | null;
  company: string | null;
  bio: string | null;
  avatar_url: string | null;
  mobile_no: string | null;
  email: string | null;
  verified: boolean;
  theme: string | null;
  settings: { hide_fleet_info?: boolean; profile_mode?: string } | null;
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
      mobile_no: profile.mobile_no ?? null,
      email: profile.email ?? null,
      verified: profile.verified ?? false,
      theme: profile.theme ?? "obsidian",
      mode: (profile.settings?.profile_mode ?? "personal") as import("@/lib/types").ModeType,
      social_links: [],
      fleet_info: null,
      metrics: { taps: 0, views: 0, saves: 0 },
    };
  }

  const [{ data: socialLinks }, { data: fleetInfo }, { data: cards }] = await Promise.all([
    db.from("social_links").select("platform, url").eq("profile_id", profile.id),
    db.from("fleet_info").select("vehicle_type, plate_number, operator_id, verified").eq("profile_id", profile.id).maybeSingle(),
    db.from("nfc_cards").select("id, tap_count").eq("profile_id", profile.id),
  ]);

  const taps = (cards ?? []).reduce((sum, card) => sum + (card.tap_count ?? 0), 0);
  const cardIds = (cards ?? []).map((c) => c.id).filter(Boolean) as string[];

  const [{ count: viewsCount }, { count: savesCount }] = await Promise.all([
    cardIds.length
      ? db.from("tap_analytics").select("id", { count: "exact", head: true }).in("card_id", cardIds)
      : Promise.resolve({ count: 0 } as { count: number | null }),
    db.from("tap_saves").select("id", { count: "exact", head: true }).eq("profile_id", profile.id),
  ]);

  return {
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    position: profile.position ?? "",
    company: profile.company ?? "",
    bio: profile.bio ?? "",
    avatar_url: profile.avatar_url ?? null,
    mobile_no: profile.mobile_no ?? null,
    email: profile.email ?? null,
    verified: profile.verified ?? false,
    theme: profile.theme ?? "obsidian",
    mode: (profile.settings?.profile_mode ?? "personal") as import("@/lib/types").ModeType,
    social_links: (socialLinks ?? []).map((link) => ({ platform: link.platform, url: link.url })),
    fleet_info: fleetInfo && !profile.settings?.hide_fleet_info
      ? {
          vehicle_type: fleetInfo.vehicle_type ?? undefined,
          plate_number: fleetInfo.plate_number ?? undefined,
          operator_id: fleetInfo.operator_id ?? undefined,
          verified: fleetInfo.verified ?? false,
        }
      : null,
    metrics: {
      taps,
      views: viewsCount ?? 0,
      saves: savesCount ?? 0,
    },
  };
}

export async function getPublicProfileByUsername(username: string): Promise<PublicProfile | null> {
  const db = getViteSupabaseClient();
  if (!db) return null;

  const { data: profile } = await db
    .from("profiles")
    .select("id, username, full_name, position, company, bio, avatar_url, mobile_no, email, verified, theme, settings")
    .ilike("username", username)
    .limit(1)
    .maybeSingle();

  if (!profile) return null;
  return mapProfile(profile as ProfileRow);
}

export async function getPublicProfileByShortcode(shortcode: string): Promise<PublicProfile | null> {
  const db = getViteSupabaseClient();
  if (!db) return null;

  const normalized = shortcode.trim();
  if (!normalized) return null;

  const { data: card } = await db
    .from("nfc_cards")
    .select("profile_id, is_active")
    .ilike("shortcode", normalized)
    .limit(1)
    .maybeSingle();

  if (!card || !card.profile_id || !card.is_active) return null;

  const { data: profile } = await db
    .from("profiles")
    .select("id, username, full_name, position, company, bio, avatar_url, mobile_no, email, verified, theme, settings")
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

async function insertAnalyticsEvent(cardId: string, source: AccessSource, coords?: GeolocationCoordinates | null): Promise<void> {
  const db = getViteSupabaseClient();
  if (!db) return;

  await db.from("tap_analytics").insert({
    card_id: cardId,
    device: /mobile/i.test(navigator.userAgent) ? "mobile" : "desktop",
    browser: /chrome/i.test(navigator.userAgent)
      ? "Chrome"
      : /safari/i.test(navigator.userAgent)
        ? "Safari"
        : /firefox/i.test(navigator.userAgent)
          ? "Firefox"
          : "Other",
    os: /windows/i.test(navigator.userAgent)
      ? "Windows"
      : /android/i.test(navigator.userAgent)
        ? "Android"
        : /iphone|ios/i.test(navigator.userAgent)
          ? "iOS"
          : /mac/i.test(navigator.userAgent)
            ? "macOS"
            : "Other",
    referrer: source,
    latitude: coords?.latitude ?? null,
    longitude: coords?.longitude ?? null,
  });
}

async function incrementTapCount(cardId: string, tapCount: number): Promise<void> {
  const db = getViteSupabaseClient();
  if (!db) return;
  await db.from("nfc_cards").update({ tap_count: tapCount + 1 }).eq("id", cardId);
}

export async function recordProfileSave(profileId: string): Promise<void> {
  const db = getViteSupabaseClient();
  if (!db || !profileId) return;
  await db.from("tap_saves").insert({ profile_id: profileId });
}

export async function recordShortcodeAccess(shortcode: string, source: AccessSource, coords?: GeolocationCoordinates | null): Promise<void> {
  const db = getViteSupabaseClient();
  if (!db) return;

  const normalized = shortcode.trim();
  if (!normalized) return;

  const { data: card } = await db
    .from("nfc_cards")
    .select("id, is_active, tap_count")
    .ilike("shortcode", normalized)
    .limit(1)
    .maybeSingle();

  if (!card || !card.is_active) return;

  await insertAnalyticsEvent(card.id as string, source, coords);
  if (isNfcSource(source)) {
    await incrementTapCount(card.id as string, (card.tap_count as number | null) ?? 0);
  }
}

export async function recordUsernameAccess(username: string, source: AccessSource, coords?: GeolocationCoordinates | null): Promise<void> {
  const db = getViteSupabaseClient();
  if (!db) return;

  const { data: profile } = await db
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .limit(1)
    .maybeSingle();

  if (!profile?.id) return;

  const { data: activeCard } = await db
    .from("nfc_cards")
    .select("id, tap_count")
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let resolvedCard = activeCard as { id: string; tap_count: number | null } | null;
  if (!resolvedCard) {
    const { data: latestCard } = await db
      .from("nfc_cards")
      .select("id, tap_count")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    resolvedCard = latestCard as { id: string; tap_count: number | null } | null;
  }

  if (!resolvedCard) return;

  await insertAnalyticsEvent(resolvedCard.id, source, coords);
  if (isNfcSource(source)) {
    await incrementTapCount(resolvedCard.id, resolvedCard.tap_count ?? 0);
  }
}
