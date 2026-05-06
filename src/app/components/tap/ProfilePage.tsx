import { useParams, Navigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { getDemoProfile } from "@/lib/mock-data";
import { PublicProfileView } from "@/app/components/tap/PublicProfileView";

export function ProfilePage() {
  const { username = "" } = useParams<{ username: string }>();
  const profile = getDemoProfile(username);

  if (!profile) return <Navigate to="/404" replace />;

  return (
    <>
      <Helmet>
        <title>{`${profile.full_name} · ${profile.position}`}</title>
        <meta name="description" content={profile.bio} />
        <meta property="og:title" content={`${profile.full_name} · ${profile.position}`} />
        <meta property="og:description" content={profile.bio} />
        <meta property="og:url" content={`https://tap.shuttlup.com//${profile.username}`} />
      </Helmet>
      <PublicProfileView profile={profile} />
    </>
  );
}
