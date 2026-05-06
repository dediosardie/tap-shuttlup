"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

/* ── Schemas ─────────────────────────────────────────────────────────────── */
const passwordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const magicSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type MagicForm = z.infer<typeof magicSchema>;

/* ── Google Icon ─────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const router = useRouter();
  const [tab, setTab] = useState<"password" | "magic">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  /* Password form */
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { email: "", password: "" },
  });

  /* Magic link form */
  const magicForm = useForm<MagicForm>({
    resolver: zodResolver(magicSchema),
    defaultValues: { email: "" },
  });

  async function onPasswordSubmit(values: PasswordForm) {
    if (!supabase) return;
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      router.push("/dashboard");
    }
  }

  async function onMagicSubmit(values: MagicForm) {
    if (!supabase) return;
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      setMessage(`Magic link sent to ${values.email}. Check your inbox.`);
    }
  }

  async function handleGoogle() {
    if (!supabase) return;
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    setGoogleLoading(false);
  }

  const isLoading = status === "loading";

  return (
    <div className="glass-card gradient-border w-full rounded-2xl p-7 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Welcome back
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Sign in to your ShuttlUp Tap account
        </p>
      </div>

      {/* Env warning */}
      {!supabase && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 text-xs text-yellow-300">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Missing Supabase environment variables. Set{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </div>
      )}

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={!supabase || googleLoading || isLoading}
        className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-xl border py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-primary)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs" style={{ color: "var(--text-disabled)" }}>
          or continue with email
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      {/* Tab switcher */}
      <div
        className="mb-5 flex rounded-xl p-1"
        style={{ background: "var(--bg-elevated)" }}
      >
        {(["password", "magic"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              setStatus("idle");
              setMessage("");
            }}
            className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-200"
            style={
              tab === t
                ? {
                    background: "rgba(249,115,22,0.15)",
                    color: "var(--accent-color)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }
                : { color: "var(--text-muted)" }
            }
          >
            {t === "password" ? "Email & Password" : "Magic Link"}
          </button>
        ))}
      </div>

      {/* Password Form */}
      {tab === "password" && (
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-3"
        >
          <div className="space-y-1">
            <Input
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              {...passwordForm.register("email")}
            />
            {passwordForm.formState.errors.email && (
              <p className="text-xs text-red-400">
                {passwordForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                className="pr-10"
                {...passwordForm.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--text-muted)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.password && (
              <p className="text-xs text-red-400">
                {passwordForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs transition-colors hover:underline"
              style={{ color: "var(--accent-color)" }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Status messages */}
          {status === "error" && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={!supabase || isLoading}
            className="premium-button w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--gradient-brand)", color: "#fff", border: "none" }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      )}

      {/* Magic Link Form */}
      {tab === "magic" && (
        <form
          onSubmit={magicForm.handleSubmit(onMagicSubmit)}
          className="space-y-3"
        >
          <div className="space-y-1">
            <div className="relative">
              <Input
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className="pl-10"
                {...magicForm.register("email")}
              />
              <Mail
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
            </div>
            {magicForm.formState.errors.email && (
              <p className="text-xs text-red-400">
                {magicForm.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Status messages */}
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
            disabled={!supabase || isLoading || status === "success"}
            className="w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--gradient-brand)", color: "#fff", border: "none" }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </span>
            ) : status === "success" ? (
              "✓ Link Sent"
            ) : (
              "Send Magic Link"
            )}
          </Button>
          <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
            A passwordless sign-in link will be emailed to you.
          </p>
        </form>
      )}

      {/* Footer */}
      <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold transition-colors hover:underline"
          style={{ color: "var(--accent-color)" }}
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
