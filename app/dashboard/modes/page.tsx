"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BadgeCheck, Briefcase, Car, TrendingUp, Users, User2 } from "lucide-react";

const modes = [
  {
    id: "personal",
    label: "Personal",
    description: "Share your personal identity, socials, and contact info.",
    icon: User2,
    color: "from-violet-500/30 to-violet-500/10",
    border: "border-violet-500/30",
  },
  {
    id: "corporate",
    label: "Corporate",
    description: "Professional business card with company branding.",
    icon: Briefcase,
    color: "from-blue-500/30 to-blue-500/10",
    border: "border-blue-500/30",
  },
  {
    id: "driver",
    label: "Driver",
    description: "Driver identity with fleet and vehicle details.",
    icon: Car,
    color: "from-[var(--accent-color)]/30 to-[var(--accent-color)]/10",
    border: "border-[var(--accent-color)]/30",
  },
  {
    id: "fleet",
    label: "Fleet",
    description: "Fleet operator profile with full transport identity.",
    icon: Users,
    color: "from-emerald-500/30 to-emerald-500/10",
    border: "border-emerald-500/30",
  },
  {
    id: "investor",
    label: "Investor",
    description: "Investor-grade profile with metrics and credentials.",
    icon: TrendingUp,
    color: "from-amber-500/30 to-amber-500/10",
    border: "border-amber-500/30",
  },
];

export default function DashboardModesPage() {
  const [selected, setSelected] = useState("fleet");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <DashboardShell title="Profile Modes">
      <p className="mb-5 text-sm text-[var(--text-muted)]">
        Choose a mode to control what information is displayed on your public NFC card.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modes.map(({ id, label, description, icon: Icon, color, border }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelected(id)}
            className={`floating-card flex flex-col gap-3 rounded-2xl border p-5 text-left transition-all ${
              selected === id
                ? `${border} bg-gradient-to-br ${color}`
                : "border-[var(--border-muted)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                selected === id ? "bg-white/10" : "bg-[var(--bg-elevated)]"
              }`}>
                <Icon className={`h-5 w-5 ${selected === id ? "text-white" : "text-[var(--text-muted)]"}`} />
              </div>
              {selected === id && (
                <BadgeCheck className="h-4 w-4 text-[var(--accent-color)]" />
              )}
            </div>
            <div>
              <p className={`font-semibold ${selected === id ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                {label}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="premium-button flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm"
        >
          {saved ? <BadgeCheck className="h-4 w-4" /> : null}
          {saved ? "Saved!" : "Set Default Mode"}
        </button>
        <p className="text-sm text-[var(--text-muted)]">
          Active: <span className="capitalize font-medium text-[var(--text-primary)]">{selected}</span>
        </p>
      </div>
    </DashboardShell>
  );
}

