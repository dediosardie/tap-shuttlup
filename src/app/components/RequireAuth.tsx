import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { getViteSupabaseClient } from "@/lib/supabase";

type Status = "loading" | "authed" | "unauthed";

export function RequireAuth() {
  const [status, setStatus] = useState<Status>("loading");
  const location = useLocation();

  useEffect(() => {
    const db = getViteSupabaseClient();
    if (!db) {
      // No Supabase configured — allow access in dev/demo mode
      setStatus("authed");
      return;
    }

    db.auth.getUser().then(({ data: { user } }) => {
      setStatus(user ? "authed" : "unauthed");
    }).catch(() => setStatus("unauthed"));

    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
      setStatus(session?.user ? "authed" : "unauthed");
    });

    return () => subscription.unsubscribe();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-color)] border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthed") {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
