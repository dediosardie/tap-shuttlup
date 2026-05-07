import { getSupabaseServerClient } from "@/lib/supabase-server";
import type { PublicProfile } from "@/lib/types";
import { parseUserAgent } from "@/lib/analytics";

type ProfileRow = {
  id: string;
  user_id: string;
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
};

type AccessSource = "tap" | "qr" | "direct";

type CardRow = {
  id: string;
  profile_id: string;
  is_active: boolean;
  tap_count: number;
};

function getClientIp(requestHeaders: Headers): string | null {
  const forwarded = requestHeaders.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return requestHeaders.get("x-real-ip")?.trim() || null;
}

async function insertAnalyticsEvent(cardId: string, source: AccessSource, requestHeaders: Headers): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const userAgent = requestHeaders.get("user-agent");
  const { device, browser, os } = parseUserAgent(userAgent);
  const ip = getClientIp(requestHeaders);
  const city = requestHeaders.get("x-vercel-ip-city");
  const country = requestHeaders.get("x-vercel-ip-country");
  const referrerHeader = requestHeaders.get("referer");

  await supabase.from("tap_analytics").insert({
    card_id: cardId,
    ip_address: ip,
    device,
    browser,
    os,
    country,
    city,
    referrer: source === "direct" ? (referrerHeader ?? "direct") : source,
  });
}

async function incrementCardTapCount(cardId: string, currentTapCount: number): Promise<void> {
  const supabase = await getSupabaseServerClient();
  await supabase.from("nfc_cards").update({ tap_count: currentTapCount + 1 }).eq("id", cardId);
}

function mapProfileRow(
  profile: ProfileRow,
  socialLinks: Array<{ platform: string; url: string }> | null,
  fleetInfo: { vehicle_type: string | null; plate_number: string | null; operator_id: string | null; verified: boolean } | null,
  cards: Array<{ tap_count: number | null }> | null,
): PublicProfile {
  const taps = (cards ?? []).reduce((sum, card) => sum + (card.tap_count ?? 0), 0);

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
    social_links: (socialLinks ?? []).map((l) => ({ platform: l.platform, url: l.url })),
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

async function getPublicProfileById(profileId: string): Promise<PublicProfile | null> {
  const supabase = await getSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, user_id, username, full_name, position, company, bio, avatar_url, mobile_no, email, verified, theme")
    .eq("id", profileId)
    .maybeSingle();

  if (!profile) return null;

  const [{ data: socialLinks }, { data: fleetInfo }, { data: cards }] = await Promise.all([
    supabase.from("social_links").select("platform, url").eq("profile_id", profile.id),
    supabase.from("fleet_info").select("vehicle_type, plate_number, operator_id, verified").eq("profile_id", profile.id).maybeSingle(),
    supabase.from("nfc_cards").select("tap_count").eq("profile_id", profile.id),
  ]);

  return mapProfileRow(profile as ProfileRow, socialLinks, fleetInfo, cards);
}

export async function getPublicProfileByUsername(username: string): Promise<PublicProfile | null> {
  const supabase = await getSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, user_id, username, full_name, position, company, bio, avatar_url, mobile_no, email, verified, theme")
    .ilike("username", username)
    .limit(1)
    .maybeSingle();

  if (!profile) return null;

  return getPublicProfileById((profile as ProfileRow).id);
}

export async function getPublicProfileByShortcode(shortcode: string): Promise<PublicProfile | null> {
  const supabase = await getSupabaseServerClient();
  const { data: card } = await supabase
    .from("nfc_cards")
    .select("profile_id, is_active")
    .ilike("shortcode", shortcode)
    .limit(1)
    .maybeSingle();

  if (!card || !card.is_active || !card.profile_id) return null;
  return getPublicProfileById(card.profile_id);
}

export async function recordShortcodeAccess(shortcode: string, source: AccessSource, requestHeaders: Headers): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { data: card } = await supabase
    .from("nfc_cards")
    .select("id, profile_id, is_active, tap_count")
    .ilike("shortcode", shortcode)
    .limit(1)
    .maybeSingle();

  const resolvedCard = card as CardRow | null;
  if (!resolvedCard || !resolvedCard.is_active) return;

  await insertAnalyticsEvent(resolvedCard.id, source, requestHeaders);
  await incrementCardTapCount(resolvedCard.id, resolvedCard.tap_count ?? 0);
}

export async function recordUsernameAccess(username: string, source: AccessSource, requestHeaders: Headers): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .limit(1)
    .maybeSingle();

  if (!profile?.id) return;

  const { data: activeCard } = await supabase
    .from("nfc_cards")
    .select("id, profile_id, is_active, tap_count")
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let resolvedCard = activeCard as CardRow | null;
  if (!resolvedCard) {
    const { data: latestCard } = await supabase
      .from("nfc_cards")
      .select("id, profile_id, is_active, tap_count")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    resolvedCard = latestCard as CardRow | null;
  }

  if (!resolvedCard) return;

  await insertAnalyticsEvent(resolvedCard.id, source, requestHeaders);
  await incrementCardTapCount(resolvedCard.id, resolvedCard.tap_count ?? 0);
}

export async function getAuthedUsername(): Promise<string | null> {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.username ?? null;
}
