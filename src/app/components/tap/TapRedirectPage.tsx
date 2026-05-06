import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Wifi } from "lucide-react";
import { getProfileByShortcode } from "@/lib/mock-data";

export function TapRedirectPage() {
  const { shortcode = "" } = useParams<{ shortcode: string }>();
  const navigate = useNavigate();
  const profile = getProfileByShortcode(shortcode);

  useEffect(() => {
    if (profile) {
      navigate(`/${profile.username}`, { replace: true });
    }
  }, [profile, navigate]);

  if (!profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-sm text-[var(--text-muted)]">
          NFC shortcode <span className="font-mono text-[var(--text-primary)]">{shortcode}</span> not found.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
        <Wifi className="h-6 w-6 text-[var(--accent-color)] animate-pulse" />
      </div>
      <p className="text-sm text-[var(--text-muted)]">Redirecting to profile…</p>
    </main>
  );
}
