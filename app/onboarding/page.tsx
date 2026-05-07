"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Building2,
  Wifi,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  QrCode,
  Copy,
  Download,
  Car,
  Truck,
  TrendingUp,
  Loader2,
  Sparkles,
  AtSign,
  FileText,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { createProfile } from "@/lib/dashboard-crud";
import type { ModeType } from "@/lib/types";

/* ── Types ───────────────────────────────────────────────────────────────── */
type FormData = {
  full_name: string;
  username: string;
  position: string;
  company: string;
  bio: string;
  mode: ModeType;
};

/* ── Mode definitions ────────────────────────────────────────────────────── */
const MODES: {
  type: ModeType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    type: "personal",
    label: "Personal",
    description: "Freelancers, creatives & individuals",
    icon: User,
    color: "text-blue-400",
  },
  {
    type: "corporate",
    label: "Corporate",
    description: "Business professionals & executives",
    icon: Building2,
    color: "text-violet-400",
  },
  {
    type: "driver",
    label: "Driver",
    description: "Rideshare & delivery drivers",
    icon: Car,
    color: "text-emerald-400",
  },
  {
    type: "fleet",
    label: "Fleet",
    description: "Fleet managers & operators",
    icon: Truck,
    color: "text-yellow-400",
  },
  {
    type: "investor",
    label: "Investor",
    description: "Investors & fund managers",
    icon: TrendingUp,
    color: "text-pink-400",
  },
];

/* ── Step progress indicator ─────────────────────────────────────────────── */
const STEP_LABELS = ["Identity", "Profile", "Mode", "Ready"];

function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center gap-0">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {/* connector left */}
              <div
                className="h-px flex-1 transition-all duration-500"
                style={{
                  background: i === 0 ? "transparent" : done ? "var(--accent-color)" : "var(--border-muted)",
                }}
              />
              {/* circle */}
              <div
                className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                style={
                  done
                    ? { background: "var(--accent-color)", color: "#fff" }
                    : active
                      ? {
                          background: "rgba(249,115,22,0.15)",
                          color: "var(--accent-color)",
                          boxShadow: "0 0 0 3px rgba(249,115,22,0.2)",
                          border: "1.5px solid var(--accent-color)",
                        }
                      : {
                          background: "var(--bg-elevated)",
                          color: "var(--text-disabled)",
                          border: "1px solid var(--border-muted)",
                        }
                }
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              {/* connector right */}
              <div
                className="h-px flex-1 transition-all duration-500"
                style={{
                  background:
                    i === STEP_LABELS.length - 1
                      ? "transparent"
                      : done
                        ? "var(--accent-color)"
                        : "var(--border-muted)",
                }}
              />
            </div>
            <span
              className="mt-1.5 text-[10px] font-medium tracking-wide"
              style={{
                color: active
                  ? "var(--accent-color)"
                  : done
                    ? "var(--text-secondary)"
                    : "var(--text-disabled)",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Shared field wrapper ────────────────────────────────────────────────── */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

/* ── Step 1 — Identity ───────────────────────────────────────────────────── */
function StepIdentity({
  data,
  onChange,
  onNext,
}: {
  data: Pick<FormData, "full_name" | "username">;
  onChange: (patch: Partial<FormData>) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.full_name.trim() || data.full_name.trim().length < 2)
      e.full_name = "Name must be at least 2 characters";
    if (!data.username.trim() || data.username.length < 3)
      e.username = "Username must be at least 3 characters";
    if (!/^[a-z0-9_]+$/.test(data.username))
      e.username = "Only lowercase letters, numbers, and underscores";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Let&apos;s set up your identity
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Your digital presence starts here.
        </p>
      </div>

      <Field label="Full Name" error={errors.full_name}>
        <div className="relative">
          <Input
            placeholder="Maria Santos"
            autoComplete="name"
            className="pl-10"
            value={data.full_name}
            onChange={(e) => onChange({ full_name: e.target.value })}
          />
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        </div>
      </Field>

      <Field label="Username" error={errors.username}>
        <div className="relative">
          <Input
            placeholder="mariasantos"
            autoComplete="off"
            className="pl-10"
            value={data.username}
            onChange={(e) => onChange({ username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
          />
          <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        </div>
        {data.username && !errors.username && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Your card link:{" "}
            <span style={{ color: "var(--accent-color)" }}>
              tap.shuttlup.com/{data.username}
            </span>
          </p>
        )}
      </Field>

      <Button
        type="button"
        onClick={() => validate() && onNext()}
        className="w-full rounded-xl py-2.5 text-sm font-semibold"
        style={{ background: "var(--gradient-brand)", color: "#fff", border: "none" }}
      >
        <span className="flex items-center gap-2">
          Continue
          <ArrowRight className="h-4 w-4" />
        </span>
      </Button>
    </div>
  );
}

/* ── Step 2 — Profile ────────────────────────────────────────────────────── */
function StepProfile({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: Pick<FormData, "position" | "company" | "bio">;
  onChange: (patch: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Tell the world about you
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          This appears on your public Shutt'L Up Tap card.
        </p>
      </div>

      <Field label="Title / Position">
        <div className="relative">
          <Input
            placeholder="Head of Operations"
            className="pl-10"
            value={data.position}
            onChange={(e) => onChange({ position: e.target.value })}
          />
          <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        </div>
      </Field>

      <Field label="Company / Organization">
        <div className="relative">
          <Input
            placeholder="Shutt'L Up Transport Inc."
            className="pl-10"
            value={data.company}
            onChange={(e) => onChange({ company: e.target.value })}
          />
          <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        </div>
      </Field>

      <Field label={`Bio (${data.bio.length}/400)`}>
        <div className="relative">
          <textarea
            placeholder="A short bio about you or your work…"
            rows={3}
            maxLength={400}
            value={data.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            className="h-auto w-full resize-none rounded-xl border px-3 py-2.5 text-sm placeholder:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              borderColor: "var(--border)",
              background: "rgba(11,11,11,0.5)",
              color: "var(--text-primary)",
            }}
          />
          <FileText
            className="absolute right-3 top-3 h-4 w-4 opacity-30"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </Field>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
          style={{ background: "var(--gradient-brand)", color: "#fff", border: "none" }}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ── Step 3 — Mode ───────────────────────────────────────────────────────── */
function StepMode({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: ModeType;
  onSelect: (m: ModeType) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          How will you use Tap?
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Choose the identity mode that best fits you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {MODES.map(({ type, label, description, icon: Icon, color }) => {
          const active = selected === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className="floating-card rounded-2xl p-4 text-left transition-all duration-200 active:scale-[0.98]"
              style={
                active
                  ? {
                      background: "rgba(249,115,22,0.10)",
                      border: "1.5px solid var(--accent-color)",
                      boxShadow: "0 0 0 3px rgba(249,115,22,0.12)",
                    }
                  : {
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-muted)",
                    }
              }
            >
              <div
                className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: active ? "rgba(249,115,22,0.15)" : "var(--bg-elevated)",
                }}
              >
                <Icon
                  className={`h-4.5 w-4.5 ${active ? "text-[var(--accent-color)]" : color}`}
                />
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: active ? "var(--accent-color)" : "var(--text-primary)" }}
              >
                {label}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                {description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
          style={{ background: "var(--gradient-brand)", color: "#fff", border: "none" }}
        >
          Generate My Card
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ── Step 4 — Ready ──────────────────────────────────────────────────────── */
function StepReady({
  data,
  onBack,
}: {
  data: FormData;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://tap.shuttlup.com/${data.username}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=F97316&bgcolor=121212&data=${encodeURIComponent(profileUrl)}`;

  function handleCopy() {
    navigator.clipboard.writeText(profileUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-[0_8px_32px_-8px_rgba(249,115,22,0.7)]"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Wifi className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Your Tap card is ready!
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Welcome,{" "}
          <span style={{ color: "var(--accent-color)" }}>{data.full_name}</span>. Your
          NFC-powered digital identity is live.
        </p>
      </div>

      {/* Card preview */}
      <div
        className="gradient-border rounded-2xl p-5"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-[0_4px_16px_-4px_rgba(249,115,22,0.5)]"
            style={{ background: "var(--gradient-brand)" }}
          >
            {data.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-bold" style={{ color: "var(--text-primary)" }}>
              {data.full_name}
            </p>
            <p className="truncate text-sm" style={{ color: "var(--text-secondary)" }}>
              {data.position || "—"} {data.company ? `· ${data.company}` : ""}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                style={{ background: "var(--accent-soft)", color: "var(--accent-color)" }}
              >
                {data.mode}
              </span>
              <span
                className="flex items-center gap-1 text-[10px]"
                style={{ color: "var(--text-muted)" }}
              >
                <Wifi className="h-3 w-3" />
                NFC Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="rounded-2xl p-4 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-muted)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={`QR code for ${data.username}`}
            width={180}
            height={180}
            className="rounded-xl"
          />
        </div>

        {/* Profile URL */}
        <div
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-muted)",
          }}
        >
          <QrCode className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-color)" }} />
          <span className="flex-1 truncate font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
            {profileUrl}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 text-xs font-medium transition-colors"
            style={{ color: copied ? "rgb(52,211,153)" : "var(--accent-color)" }}
          >
            {copied ? "Copied!" : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* NFC instructions */}
      <div
        className="rounded-2xl px-4 py-4 text-xs"
        style={{
          background: "rgba(249,115,22,0.06)",
          border: "1px solid rgba(249,115,22,0.18)",
          color: "var(--text-muted)",
        }}
      >
        <p className="mb-2 flex items-center gap-1.5 font-semibold" style={{ color: "var(--accent-color)" }}>
          <Wifi className="h-3.5 w-3.5" />
          NFC Setup Instructions
        </p>
        <ol className="list-inside list-decimal space-y-1">
          <li>Order your Shutt'L Up NFC card from the dashboard.</li>
          <li>Tap your card to an NFC-enabled phone to test.</li>
          <li>Share the QR code above for instant access.</li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <a
          href={qrUrl}
          download={`${data.username}-qr.png`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-muted)",
            color: "var(--text-secondary)",
          }}
        >
          <Download className="h-4 w-4" />
          Save QR
        </a>
        <Link
          href="/dashboard"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all"
          style={{ background: "var(--gradient-brand)", color: "#fff" }}
        >
          Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/* ── Main Onboarding Page ────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    username: "",
    position: "",
    company: "",
    bio: "",
    mode: "personal",
  });

  function patch(p: Partial<FormData>) {
    setFormData((prev) => ({ ...prev, ...p }));
  }

  async function saveAndFinish() {
    setSaving(true);

    /* Save to localStorage (always works) */
    createProfile({
      username: formData.username,
      full_name: formData.full_name,
      position: formData.position,
      company: formData.company,
      bio: formData.bio,
      avatar_url: null,
      mobile_no: "",
      email: "",
      social_links: [],
      projects: [],
    });

    /* Upsert to Supabase if available */
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({
          user_id: user.id,
          username: formData.username,
          full_name: formData.full_name,
          position: formData.position,
          company: formData.company,
          bio: formData.bio,
        });
      }
    }

    setSaving(false);
    setStep(3);
  }

  return (
    <div
      className="animated-grid-bg relative flex min-h-screen items-start justify-center px-4 py-10"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-20 blur-[140px]"
          style={{ background: "var(--glow-orange)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full opacity-12 blur-[100px]"
          style={{ background: "var(--glow-purple)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 no-underline outline-none"
            aria-label="Home"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Wifi className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Shutt&apos;L Up Tap
            </span>
          </Link>
          <span className="text-xs" style={{ color: "var(--text-disabled)" }}>
            Step {Math.min(step + 1, 4)} of 4
          </span>
        </div>

        {/* Progress indicator */}
        <StepProgress current={step} />

        {/* Card shell */}
        <div className="glass-card gradient-border rounded-2xl p-7 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.7)]">
          {step === 0 && (
            <StepIdentity
              data={formData}
              onChange={patch}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepProfile
              data={formData}
              onChange={patch}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <>
              {saving ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <Loader2
                    className="h-10 w-10 animate-spin"
                    style={{ color: "var(--accent-color)" }}
                  />
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Building your card…
                  </p>
                </div>
              ) : (
                <StepMode
                  selected={formData.mode}
                  onSelect={(m) => patch({ mode: m })}
                  onNext={saveAndFinish}
                  onBack={() => setStep(1)}
                />
              )}
            </>
          )}
          {step === 3 && (
            <StepReady data={formData} onBack={() => setStep(2)} />
          )}
        </div>

        {/* Skip link (only on steps 0-2) */}
        {step < 3 && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-xs transition-colors hover:underline"
              style={{ color: "var(--text-disabled)" }}
            >
              Skip for now — set up later in dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
