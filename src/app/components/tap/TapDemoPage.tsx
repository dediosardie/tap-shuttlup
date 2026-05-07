import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router";
import { PublicProfileView } from "@/app/components/tap/PublicProfileView";
import { getDemoProfile } from "@/lib/mock-data";

export function TapDemoPage() {
  const profile = getDemoProfile("ardie");

  if (!profile) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Shutt&apos;L Up Tap Demo</title>
        <meta
          name="description"
          content="Live demo of a Shutt'L Up Tap public profile view with NFC-style actions and analytics badges."
        />
        <meta property="og:title" content="Shutt'L Up Tap Demo" />
        <meta
          property="og:description"
          content="Preview the public tap profile experience at /tap/demo."
        />
        <meta property="og:url" content="https://tap.shuttlup.com/tap/demo" />
      </Helmet>
      <PublicProfileView profile={profile} />
    </>
  );
}
