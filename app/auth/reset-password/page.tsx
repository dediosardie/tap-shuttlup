"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm_password: "" },
  });

  useEffect(() => {
    async function prepareRecoverySession() {
      if (!supabase) {
        setStatus("error");
        setMessage("Supabase is not configured.");
        setReady(true);
        return;
      }

      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        }

        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setStatus("error");
          setMessage("Reset link is invalid or expired. Please request a new one.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Unable to validate reset link.");
      } finally {
        setReady(true);
      }
    }

    void prepareRecoverySession();
  }, [supabase]);

  async function onSubmit(values: FormData) {
    if (!supabase) return;
    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Password updated successfully. Redirecting to sign in...");
    setTimeout(() => router.replace("/login"), 1200);
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-card gradient-border w-full max-w-md rounded-2xl p-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--accent-color)]" />
          <p className="mt-3 text-sm text-[var(--text-muted)]">Validating reset link...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="glass-card gradient-border w-full rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Set new password</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Choose a secure password for your Shutt'L Up Tap account.</p>

        <form className="mt-5 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="pr-10"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.password && <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                className="pr-10"
                {...form.register("confirm_password")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.confirm_password && <p className="text-xs text-red-400">{form.formState.errors.confirm_password.message}</p>}
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {message}
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full"
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Updating...</span>
            ) : (
              "Update password"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          Remembered it? <Link href="/login" className="font-medium text-[var(--accent-color)] hover:underline">Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}
