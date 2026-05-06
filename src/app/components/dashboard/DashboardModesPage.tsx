import { useEffect, useState } from "react";
import { BadgeCheck, Briefcase, Car, Pencil, Plus, Trash2, TrendingUp, Users, User2 } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import { createMode, deleteMode, readModes, updateMode, type DashboardMode } from "@/lib/dashboard-crud";
import type { ModeType } from "@/lib/types";

const modeMeta: Record<ModeType, { icon: React.ElementType; color: string; border: string; description: string }> = {
  personal: {
    icon: User2,
    color: "from-violet-500/30 to-violet-500/10",
    border: "border-violet-500/30",
    description: "Share your personal identity, socials, and contact info.",
  },
  corporate: {
    icon: Briefcase,
    color: "from-blue-500/30 to-blue-500/10",
    border: "border-blue-500/30",
    description: "Professional business card with company branding.",
  },
  driver: {
    icon: Car,
    color: "from-[var(--accent-color)]/30 to-[var(--accent-color)]/10",
    border: "border-[var(--accent-color)]/30",
    description: "Driver identity with fleet and vehicle details.",
  },
  fleet: {
    icon: Users,
    color: "from-emerald-500/30 to-emerald-500/10",
    border: "border-emerald-500/30",
    description: "Fleet operator profile with full transport identity.",
  },
  investor: {
    icon: TrendingUp,
    color: "from-amber-500/30 to-amber-500/10",
    border: "border-amber-500/30",
    description: "Investor-grade profile with metrics and credentials.",
  },
};

export function DashboardModesPage() {
  const [modes, setModes] = useState<DashboardMode[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newModeName, setNewModeName] = useState("");
  const [newModeType, setNewModeType] = useState<ModeType>("fleet");

  useEffect(() => {
    void readModes().then(setModes);
  }, []);

  const selected = modes.find((m) => m.is_default)?.mode_type ?? "fleet";

  async function handleCreate() {
    if (!newModeName.trim()) {
      return;
    }
    const created = await createMode({ mode_name: newModeName.trim(), mode_type: newModeType, is_default: false });
    setModes((prev) => [created, ...prev]);
    setNewModeName("");
  }

  async function setDefault(mode: DashboardMode) {
    const next = { ...mode, is_default: true };
    await updateMode(next);
    setModes((prev) => prev.map((m) => ({ ...m, is_default: m.id === mode.id })));
  }

  async function updateInline(mode: DashboardMode, patch: Partial<DashboardMode>) {
    const next = { ...mode, ...patch };
    await updateMode(next);
    setModes((prev) => prev.map((m) => (m.id === mode.id ? next : m)));
  }

  async function remove(modeId: string) {
    await deleteMode(modeId);
    setModes((prev) => prev.filter((m) => m.id !== modeId));
  }

  return (
    <DashboardShell title="Profile Modes">
      <p className="mb-5 text-sm text-[var(--text-muted)]">
        Choose a mode to control what information is displayed on your public NFC card.
      </p>

      <div className="mb-5 grid gap-2 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4 sm:grid-cols-3">
        <input
          value={newModeName}
          onChange={(e) => setNewModeName(e.target.value)}
          placeholder="New mode name"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <select
          value={newModeType}
          onChange={(e) => setNewModeType(e.target.value as ModeType)}
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        >
          <option value="personal">Personal</option>
          <option value="corporate">Corporate</option>
          <option value="driver">Driver</option>
          <option value="fleet">Fleet</option>
          <option value="investor">Investor</option>
        </select>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-color)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          Add Mode
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modes.map((mode) => {
          const meta = modeMeta[mode.mode_type];
          const Icon = meta.icon;
          const isSelected = selected === mode.mode_type;
          return (
          <button
            key={mode.id}
            type="button"
            onClick={() => setDefault(mode)}
            className={`floating-card flex flex-col gap-3 rounded-2xl border p-5 text-left transition-all ${
              isSelected
                ? `${meta.border} bg-gradient-to-br ${meta.color}`
                : "border-[var(--border-muted)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                isSelected ? "bg-white/10" : "bg-[var(--bg-elevated)]"
              }`}>
                <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-[var(--text-muted)]"}`} />
              </div>
              {isSelected && <BadgeCheck className="h-4 w-4 text-[var(--accent-color)]" />}
            </div>
            <div>
              <p className={`font-semibold ${isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                {mode.mode_name}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{meta.description}</p>
              <div className="mt-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId((v) => (v === mode.id ? null : mode.id));
                  }}
                  className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(mode.id);
                  }}
                  className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-1.5 text-[var(--text-muted)] hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {editingId === mode.id ? (
                <div className="mt-2 grid gap-2">
                  <input
                    value={mode.mode_name}
                    onChange={(e) => updateInline(mode, { mode_name: e.target.value })}
                    className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-1.5 text-xs text-[var(--text-primary)]"
                  />
                  <select
                    value={mode.mode_type}
                    onChange={(e) => updateInline(mode, { mode_type: e.target.value as ModeType })}
                    className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-1.5 text-xs text-[var(--text-primary)]"
                  >
                    <option value="personal">Personal</option>
                    <option value="corporate">Corporate</option>
                    <option value="driver">Driver</option>
                    <option value="fleet">Fleet</option>
                    <option value="investor">Investor</option>
                  </select>
                </div>
              ) : null}
            </div>
          </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-[var(--text-muted)]">
        Active: <span className="font-medium capitalize text-[var(--text-primary)]">{selected}</span>
      </p>
    </DashboardShell>
  );
}
