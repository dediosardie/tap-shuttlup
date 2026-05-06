import type { PublicProfile } from "@/lib/types";

export function buildVCard(profile: PublicProfile) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.full_name}`,
    `ORG:${profile.company}`,
    `TITLE:${profile.position}`,
    `NOTE:${profile.bio}`,
    profile.social_links.find((x) => x.platform === "website")?.url
      ? `URL:${profile.social_links.find((x) => x.platform === "website")?.url}`
      : "",
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\n");
}

export function downloadVCard(profile: PublicProfile) {
  const text = buildVCard(profile);
  const blob = new Blob([text], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${profile.username}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
