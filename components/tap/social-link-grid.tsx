import { ExternalLink, Facebook, Globe, Instagram, Linkedin, Smartphone, Youtube } from "lucide-react";

const SOCIAL_META: Record<string, { icon: React.ElementType; color: string }> = {
  linkedin: { icon: Linkedin, color: "text-blue-400" },
  instagram: { icon: Instagram, color: "text-pink-400" },
  facebook: { icon: Facebook, color: "text-blue-500" },
  youtube: { icon: Youtube, color: "text-red-400" },
  tiktok: { icon: Smartphone, color: "text-[var(--text-secondary)]" },
  website: { icon: Globe, color: "text-[var(--accent-color)]" },
};

interface SocialLinkGridProps {
  links: { platform: string; url: string }[];
}

export function SocialLinkGrid({ links }: SocialLinkGridProps) {
  if (!links.length) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {links.map(({ platform, url }) => {
        const meta = SOCIAL_META[platform] ?? { icon: Globe, color: "text-[var(--text-muted)]" };
        const Icon = meta.icon;
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="floating-card flex items-center gap-2.5 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm capitalize text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Icon className={`h-4 w-4 shrink-0 ${meta.color}`} />
            <span className="flex-1 truncate">{platform}</span>
            <ExternalLink className="h-3 w-3 shrink-0 opacity-30" />
          </a>
        );
      })}
    </div>
  );
}
