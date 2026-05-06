import type { PublicProfile } from "@/lib/types";

type DashboardState = {
  profile?: {
    id: string;
    username: string;
    full_name: string;
    position: string;
    company: string;
    bio: string;
    avatar_url?: string | null;
    social_links?: { platform: string; url: string }[];
  } | null;
  cards?: Array<{
    shortcode: string;
    taps?: number;
  }>;
};

const DASHBOARD_STORAGE_KEY = "shuttlup.dashboard.crud.v1";

export const demoProfiles: PublicProfile[] = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    username: "ardie",
    full_name: "Ardie Cruz",
    position: "Fleet Innovation Lead",
    company: "Shutt'L Up Tap",
    bio: "NFC-powered digital identity for mobility operators, drivers, and enterprise teams.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    verified: true,
    theme: "obsidian",
    social_links: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "website", url: "https://tap.shuttlup.com/" },
    ],
    fleet_info: {
      vehicle_type: "Shuttle Van",
      plate_number: "NFC-214",
      operator_id: "OP-94421",
      verified: true,
    },
    metrics: {
      taps: 1925,
      views: 1468,
      saves: 602,
    },
  },
];

function getRuntimeProfileFromDashboard(): PublicProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(DASHBOARD_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DashboardState;
    if (!parsed.profile || !parsed.profile.username) return null;
    const profile = parsed.profile;
    const totalTaps = (parsed.cards ?? []).reduce((sum, card) => sum + (card.taps ?? 0), 0);

    return {
      id: profile.id,
      username: profile.username,
      full_name: profile.full_name,
      position: profile.position,
      company: profile.company,
      bio: profile.bio,
      avatar_url: profile.avatar_url ?? null,
      verified: false,
      theme: "obsidian",
      social_links: profile.social_links ?? [],
      metrics: {
        taps: totalTaps,
        views: 0,
        saves: 0,
      },
    };
  } catch {
    return null;
  }
}

function getRuntimeShortcodes(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(DASHBOARD_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as DashboardState;
    return (parsed.cards ?? []).map((c) => c.shortcode).filter(Boolean);
  } catch {
    return [];
  }
}

export function getDemoProfile(username: string) {
  const runtimeProfile = getRuntimeProfileFromDashboard();
  if (runtimeProfile && runtimeProfile.username.toLowerCase() === username.toLowerCase()) {
    return runtimeProfile;
  }

  return demoProfiles.find(
    (p) => p.username.toLowerCase() === username.toLowerCase()
  ) ?? null;
}

export function getProfileByShortcode(shortcode: string) {
  const normalized = shortcode.toLowerCase();

  // Resolve locally-created cards (dashboard) to the current runtime profile.
  const runtimeProfile = getRuntimeProfileFromDashboard();
  if (runtimeProfile) {
    const runtimeShortcodes = getRuntimeShortcodes().map((s) => s.toLowerCase());
    if (runtimeShortcodes.includes(normalized)) {
      return runtimeProfile;
    }
  }

  if (normalized === "tap001") return demoProfiles[0];
  return null;
}
