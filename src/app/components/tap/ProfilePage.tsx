import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { Helmet } from "react-helmet-async";
import { PublicProfileView } from "@/app/components/tap/PublicProfileView";
import type { PublicProfile } from "@/lib/types";
import { getAuthedUsername, getPublicProfileByUsername, recordUsernameAccess } from "@/lib/public-profile";
import { requestLocation } from "@/lib/geolocation";

export function ProfilePage() {
  const { username = "" } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const resolved = await getPublicProfileByUsername(username);

      if (!active) return;

      if (resolved) {
        if (resolved.username !== username) {
          navigate(`/${resolved.username}`, { replace: true });
          return;
        }
        setProfile(resolved);
        const src = new URLSearchParams(location.search).get("src");
        const coords = await requestLocation();
        if (src === "qr") {
          await recordUsernameAccess(resolved.username, "qr", coords);
        } else if (src !== "tap") {
          await recordUsernameAccess(resolved.username, "direct", coords);
        }
        setLoading(false);
        return;
      }

      const authedUsername = await getAuthedUsername();
      if (!active) return;

      if (authedUsername && authedUsername !== username) {
        navigate(`/${authedUsername}`, { replace: true });
      } else {
        navigate("/404", { replace: true });
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [location.search, navigate, username]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-color)] border-t-transparent" />
      </main>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Helmet>
        <title>{`${profile.full_name} · ${profile.position}`}</title>
        <meta name="description" content={profile.bio} />
        <meta property="og:title" content={`${profile.full_name} · ${profile.position}`} />
        <meta property="og:description" content={profile.bio} />
        <meta property="og:url" content={`https://tap.shuttlup.com/${profile.username}`} />
      </Helmet>
      <PublicProfileView profile={profile} />
    </>
  );
}
