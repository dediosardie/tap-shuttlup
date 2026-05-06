"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, AlertCircle, CheckCircle2, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormData) {
    if (!supabase) return;
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setSentEmail(values.email);
      setStatus("sent");
    }
  }

  return (
    <div className="glass-card gradient-border w-full rounded-2xl p-7 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)]">
      {status === "sent" ? (
        /* ── Success state ────────────────────────────────────────────────── */
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          {/* Animated ring */}
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div
              className="absolute inset-0 animate-ping rounded-full opacity-20"
              style={{ background: "var(--accent-soft)" }}
            />
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(249,115,22,0.15)" }}
            >
              <CheckCircle2 className="h-8 w-8" style={{ color: "var(--accent-color)" }} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Check your inbox
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              We sent a password reset link to
            </p>
            <p
              className="mt-1 font-mono text-sm font-medium"
              style={{ color: "var(--accent-color)" }}
            >
              {sentEmail}
            </p>
          </div>

          <div
            className="w-full rounded-xl px-4 py-3 text-xs"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-muted)",
              color: "var(--text-muted)",
            }}
          >
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="font-medium underline"
              style={{ color: "var(--accent-color)" }}
            >
              try again
            </button>
            .
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm transition-colors hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>
      ) : (
        /* ── Form state ───────────────────────────────────────────────────── */
        <>
          <div className="mb-6">
            <Link
              href="/login"
              className="mb-5 flex items-center gap-1.5 text-sm transition-colors hover:underline"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Reset your password
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {/* Env warning */}
          {!supabase && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 text-xs text-yellow-300">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Missing Supabase environment variables.
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="pl-10"
                  {...form.register("email")}
                />
                <Mail
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              disabled={!supabase || status === "loading"}
              className="w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
              style={{ background: "var(--gradient-brand)", color: "#fff", border: "none" }}
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SendHorizonal className="h-4 w-4" />
                  Send Reset Link
                </span>
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
