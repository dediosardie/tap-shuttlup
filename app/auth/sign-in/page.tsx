"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

const signInSchema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const form = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormData) => {
    if (!supabase) return;
    await supabase.auth.signInWithOtp({
      email: values.email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const loginWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="glass-card w-full rounded-2xl border border-border p-6">
        <h1 className="text-2xl font-semibold">Sign in to Shutt'L Up Tap</h1>
        <p className="mt-1 text-sm text-muted-foreground">Magic link, email login, and Google OAuth are supported.</p>
        {!supabase && (
          <p className="mt-3 rounded-lg border border-yellow-400/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
            Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </p>
        )}
        <form className="mt-5 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="you@company.com" {...form.register("email")} />
          <Button type="submit" className="w-full" disabled={!supabase}>Send Magic Link</Button>
        </form>
        <Button variant="secondary" className="mt-2 w-full" onClick={loginWithGoogle} disabled={!supabase}>Continue with Google</Button>
      </div>
    </main>
  );
}
