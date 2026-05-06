import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Loader2, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "./AuthLayout";
import { getViteSupabaseClient } from "@/lib/supabase";

/* ── Schema ──────────────────────────────────────────────────────────────── */
const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type FormData = z.infer<typeof schema>;

/* ── Google Icon ─────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── Password strength bar ───────────────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  const score = checks.filter(Boolean).length;
  const label = ["", "Weak", "Fair", "Good", "Strong"][score];
  const barColor = score === 1 ? "bg-red-500" : score === 2 ? "bg-yellow-500" : score === 3 ? "bg-blue-400" : "bg-emerald-500";
  const textColor = score === 1 ? "rgb(248,113,113)" : score === 2 ? "rgb(234,179,8)" : score === 3 ? "rgb(96,165,250)" : "rgb(52,211,153)";
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? barColor : "bg-[var(--border-muted)]"}`} />
        ))}
      </div>
      <p className="text-xs" style={{ color: textColor }}>{label} password</p>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */
export function RegisterPage() {
  const supabase = useMemo(() => getViteSupabaseClient(), []);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", password: "", confirm_password: "" },
  });

  const watchedPassword = form.watch("password");

  async function onSubmit(values: FormData) {
    if (!supabase) { navigate("/onboarding"); return; }
    setStatus("loading");
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.full_name },
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) { setStatus("error"); setMessage(error.message); return; }
    if (data.session) { navigate("/onboarding"); return; }
    setStatus("success");
    setMessage(`Confirmation link sent to ${values.email}. Click it to activate your account.`);
  }

  async function handleGoogle() {
    if (!supabase) return;
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
    setGoogleLoading(false);
  }

  const isLoading = status === "loading";

  return (
    <AuthLayout>
      <div className="glass-card gradient-border w-full rounded-2xl p-7 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Create your account</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Join thousands using NFC-powered digital identity</p>
        </div>

        {status === "success" ? (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Check your inbox</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{message}</p>
            </div>
            <Link to="/login" className="inline-block text-sm font-medium hover:underline" style={{ color: "var(--accent-color)" }}>
              Back to Sign In →
            </Link>
          </div>
        ) : (
          <>
            {!supabase && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 text-xs text-yellow-300">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Demo mode — Supabase not configured. Account will be created locally.
              </div>
            )}

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={!supabase || googleLoading || isLoading}
              className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-xl border py-2.5 text-sm font-medium transition-all hover:bg-white/5 disabled:opacity-50"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)", background: "rgba(255,255,255,0.03)" }}
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Sign up with Google
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--text-disabled)" }}>or create with email</span>
              <div className="h-px flex-1" style={{ background: "var(--border)" }} />
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Full Name */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    placeholder="Full Name"
                    autoComplete="name"
                    className="h-11 w-full rounded-xl border pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    style={{ borderColor: "var(--border)", background: "rgba(11,11,11,0.5)", color: "var(--text-primary)" }}
                    {...form.register("full_name")}
                  />
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                </div>
                {form.formState.errors.full_name && <p className="text-xs text-red-400">{form.formState.errors.full_name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="h-11 w-full rounded-xl border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  style={{ borderColor: "var(--border)", background: "rgba(11,11,11,0.5)", color: "var(--text-primary)" }}
                  {...form.register("email")}
                />
                {form.formState.errors.email && <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border pr-10 pl-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    style={{ borderColor: "var(--border)", background: "rgba(11,11,11,0.5)", color: "var(--text-primary)" }}
                    {...form.register("password")}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordStrength password={watchedPassword} />
                {form.formState.errors.password && <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border pr-10 pl-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    style={{ borderColor: "var(--border)", background: "rgba(11,11,11,0.5)", color: "var(--text-primary)" }}
                    {...form.register("confirm_password")}
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.confirm_password && <p className="text-xs text-red-400">{form.formState.errors.confirm_password.message}</p>}
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />{message}
                </div>
              )}

              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                By creating an account you agree to our{" "}
                <a href="#" className="underline" style={{ color: "var(--accent-color)" }}>Terms</a> and{" "}
                <a href="#" className="underline" style={{ color: "var(--accent-color)" }}>Privacy Policy</a>.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="premium-button w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {isLoading
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Creating account…</span>
                  : "Create Account →"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: "var(--accent-color)" }}>Sign in</Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
