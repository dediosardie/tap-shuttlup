import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Wifi } from "lucide-react";
import { getPublicProfileByShortcode, recordShortcodeAccess } from "@/lib/public-profile";

export function TapRedirectPage() {
  const { shortcode = "" } = useParams<{ shortcode: string }>();
  const normalizedShortcode = shortcode.trim();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "not-found">("loading");

  useEffect(() => {
    let active = true;

    async function resolveShortcode() {
      setStatus("loading");
      const profile = await getPublicProfileByShortcode(normalizedShortcode);

      if (!active) return;

      if (profile) {
        await recordShortcodeAccess(normalizedShortcode, "tap");
        navigate(`/${profile.username}?src=tap`, { replace: true });
      } else {
        setStatus("not-found");
      }
    }

    void resolveShortcode();
    return () => {
      active = false;
    };
  }, [normalizedShortcode, navigate]);

  if (status === "not-found") {
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
