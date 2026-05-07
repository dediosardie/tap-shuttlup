"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function handleCallback() {
      if (!supabase) {
        setError("Supabase is not configured.");
        return;
      }

      try {
        const next = searchParams.get("next") || "/dashboard";
        const queryType = searchParams.get("type") || "";
        const code = searchParams.get("code");

        if (code) {
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
          if (codeError) throw codeError;
        } else {
          const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (sessionError) throw sessionError;
          }
        }

        const hashType = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("type") || "";
        const resolvedType = queryType || hashType;

        if (resolvedType === "recovery") {
          router.replace("/auth/reset-password");
          return;
        }

        router.replace(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to complete sign-in.");
      }
    }

    void handleCallback();
  }, [router, searchParams, supabase]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card gradient-border w-full max-w-md rounded-2xl p-6 text-center">
        {error ? (
          <div className="space-y-3">
            <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">Authentication failed</h1>
            <p className="text-sm text-[var(--text-muted)]">{error}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--accent-color)]" />
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">Signing you in...</h1>
            <p className="text-sm text-[var(--text-muted)]">Finalizing your Shutt'L Up Tap authentication.</p>
          </div>
        )}
      </div>
    </main>
  );
}
