import { useEffect, useState } from "react";
import { BadgeCheck, Pencil, Plus, Trash2 } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import { createTheme, deleteTheme, readThemes, updateTheme, type DashboardTheme } from "@/lib/dashboard-crud";

const themePresets = [
  {
    id: "obsidian",
    label: "Obsidian Orange",
    description: "Default dark theme with vibrant orange accent — the signature ShuttlUp look.",
    preview: ["#0b0b0b", "#1a1a1a", "#f97316"],
  },
  {
    id: "midnight",
    label: "Midnight Blue",
    description: "Deep navy tones with a cool blue glow for a calm enterprise feel.",
    preview: ["#060d1a", "#0d1e3a", "#2563eb"],
  },
  {
    id: "graphite",
    label: "Graphite Glass",
    description: "Neutral graphite palette with subtle glassmorphism surfaces.",
    preview: ["#111111", "#222222", "#9ca3af"],
  },
  {
    id: "forest",
    label: "Forest Emerald",
    description: "Dark green tones inspired by precision tech and mobility.",
    preview: ["#081210", "#0f2320", "#10b981"],
  },
  {
    id: "violet",
    label: "Violet Dark",
    description: "Rich purple-tinted dark theme for a premium creative look.",
    preview: ["#0d0816", "#1c1230", "#7c3aed"],
  },
  {
    id: "carbon",
    label: "Carbon Amber",
    description: "Ultra-dark carbon base with warm amber highlights.",
    preview: ["#090909", "#161616", "#f59e0b"],
  },
];

const layouts = [
  { id: "compact", label: "Compact", description: "Dense layout, fits more info" },
  { id: "spacious", label: "Spacious", description: "Generous whitespace, focused" },
  { id: "minimal", label: "Minimal", description: "Clean, link-tree style" },
];

export function DashboardThemesPage() {
  const [themes, setThemes] = useState<DashboardTheme[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTheme, setNewTheme] = useState({ label: "", theme_key: "custom", layout: "spacious" as DashboardTheme["layout"] });

  useEffect(() => {
    setThemes(readThemes());
  }, []);

  const selected = themes.find((t) => t.is_active);

  function setActive(theme: DashboardTheme) {
    const next = { ...theme, is_active: true };
    updateTheme(next);
    setThemes((prev) => prev.map((t) => ({ ...t, is_active: t.id === theme.id })));
  }

  function createNewTheme() {
    if (!newTheme.label.trim()) {
      return;
    }
    const created = createTheme({
      label: newTheme.label.trim(),
      theme_key: newTheme.theme_key.trim() || "custom",
      layout: newTheme.layout,
      is_active: false,
    });
    setThemes((prev) => [created, ...prev]);
    setNewTheme({ label: "", theme_key: "custom", layout: "spacious" });
  }

  function updateInline(theme: DashboardTheme, patch: Partial<DashboardTheme>) {
    const next = { ...theme, ...patch };
    updateTheme(next);
    setThemes((prev) => prev.map((t) => (t.id === theme.id ? next : t)));
  }

  function remove(id: string) {
    deleteTheme(id);
    setThemes((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <DashboardShell title="Themes">
      <div className="mb-5 grid gap-2 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4 sm:grid-cols-4">
        <input
          value={newTheme.label}
          onChange={(e) => setNewTheme((p) => ({ ...p, label: e.target.value }))}
          placeholder="Theme label"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <input
          value={newTheme.theme_key}
          onChange={(e) => setNewTheme((p) => ({ ...p, theme_key: e.target.value }))}
          placeholder="theme key"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <select
          value={newTheme.layout}
          onChange={(e) => setNewTheme((p) => ({ ...p, layout: e.target.value as DashboardTheme["layout"] }))}
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        >
          <option value="compact">Compact</option>
          <option value="spacious">Spacious</option>
          <option value="minimal">Minimal</option>
        </select>
        <button
          type="button"
          onClick={createNewTheme}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-color)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          Add Theme
        </button>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Color Theme</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {themes.map((theme) => {
            const preset = themePresets.find((p) => p.id === theme.theme_key);
            const preview = preset?.preview ?? ["#111111", "#222222", "#f97316"];
            const description = preset?.description ?? "Custom theme";
            return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setActive(theme)}
              className={`floating-card flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all ${
                theme.is_active
                  ? "border-[var(--accent-color)] bg-[var(--accent-soft)]"
                  : "border-[var(--border-muted)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/30"
              }`}
            >
              <div className="flex gap-1.5">
                {preview.map((hex) => (
                  <div
                    key={hex}
                    className="h-6 w-6 rounded-lg border border-white/10"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{theme.label}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
                </div>
                {theme.is_active && <BadgeCheck className="h-4 w-4 shrink-0 text-[var(--accent-color)]" />}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId((v) => (v === theme.id ? null : theme.id));
                  }}
                  className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(theme.id);
                  }}
                  className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-1.5 text-[var(--text-muted)] hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {editingId === theme.id ? (
                <div className="grid gap-2">
                  <input
                    value={theme.label}
                    onChange={(e) => updateInline(theme, { label: e.target.value })}
                    className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-1.5 text-xs text-[var(--text-primary)]"
                  />
                  <select
                    value={theme.layout}
                    onChange={(e) => updateInline(theme, { layout: e.target.value as DashboardTheme["layout"] })}
                    className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-1.5 text-xs text-[var(--text-primary)]"
                  >
                    <option value="compact">Compact</option>
                    <option value="spacious">Spacious</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              ) : null}
            </button>
          );
          })}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4">
        <p className="text-sm text-[var(--text-muted)]">
          Active theme:
          <span className="ml-1 font-medium text-[var(--text-primary)]">{selected?.label ?? "None"}</span>
          <span className="ml-2 text-xs text-[var(--text-disabled)]">
            ({layouts.find((l) => l.id === selected?.layout)?.label ?? "No layout"})
          </span>
        </p>
      </div>
    </DashboardShell>
  );
}
