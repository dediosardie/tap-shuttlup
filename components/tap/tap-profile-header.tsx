import { BadgeCheck, Building2, Users, Wifi } from "lucide-react";
import type { PublicProfile } from "@/lib/types";

interface TapProfileHeaderProps {
  profile: PublicProfile;
}

export function TapProfileHeader({ profile }: TapProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-purple)] p-[2px] accent-glow">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="h-full w-full rounded-[calc(var(--radius)-2px)] object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-[calc(var(--radius)-2px)] bg-[var(--bg-secondary)]">
              <Users className="h-8 w-8 text-[var(--text-primary)]" />
            </div>
          )}
        </div>
        <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-elevated)] shadow">
          <Wifi className="h-3.5 w-3.5 text-[var(--accent-color)]" />
        </span>
      </div>

      {/* Identity */}
      <div className="flex-1 space-y-1">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">{profile.full_name}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{profile.position}</p>
        <p className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
          <Building2 className="h-3.5 w-3.5 text-[var(--accent-color)]" />
          {profile.company}
        </p>
        {profile.verified && (
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-color)]">
              <BadgeCheck className="h-3.5 w-3.5" />
              Fleet Verified Profile
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
