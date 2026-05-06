import type { PublicProfile } from "@/lib/types";

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

export function getDemoProfile(username: string) {
  return demoProfiles.find(
    (p) => p.username.toLowerCase() === username.toLowerCase()
  ) ?? null;
}

export function getProfileByShortcode(shortcode: string) {
  if (shortcode === "tap001") return demoProfiles[0];
  return null;
}
