import { useEffect, useState } from "react";
import { BadgeCheck, Pencil, Plus, Trash2 } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import { createTheme, deleteTheme, readThemes, updateTheme, type DashboardTheme } from "@/lib/dashboard-crud";

const themePresets = [
  {
    id: "obsidian",
    label: "Obsidian Orange",
    description: "Default dark theme with vibrant orange accent — the signature Shutt'L Up look.",
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
  const [activeKey, setActiveKey] = useState<string>("obsidian");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTheme, setNewTheme] = useState({ label: "", theme_key: "custom", layout: "spacious" as DashboardTheme["layout"] });

  useEffect(() => {
    void readThemes().then((loaded) => {
      setThemes(loaded);
      const active = loaded.find((t) => t.is_active);
      if (active) setActiveKey(active.theme_key);
    });
  }, []);

  const selected = themes.find((t) => t.theme_key === activeKey);

  async function activatePreset(presetId: string) {
    // Find or create the matching theme in state
    let theme = themes.find((t) => t.theme_key === presetId);
    if (!theme) {
      const preset = themePresets.find((p) => p.id === presetId)!;
      theme = await createTheme({ label: preset.label, theme_key: presetId, layout: "spacious", is_active: false });
      setThemes((prev) => [theme!, ...prev]);
    }
    const next = { ...theme, is_active: true };
    await updateTheme(next);
    setActiveKey(presetId);
    setThemes((prev) => prev.map((t) => ({ ...t, is_active: t.theme_key === presetId })));
  }

  async function setActive(theme: DashboardTheme) {
    const next = { ...theme, is_active: true };
    await updateTheme(next);
    setActiveKey(theme.theme_key);
    setThemes((prev) => prev.map((t) => ({ ...t, is_active: t.id === theme.id })));
  }

  async function createNewTheme() {
    if (!newTheme.label.trim()) {
      return;
    }
    const created = await createTheme({
      label: newTheme.label.trim(),
      theme_key: newTheme.theme_key.trim() || "custom",
      layout: newTheme.layout,
      is_active: false,
    });
    setThemes((prev) => [created, ...prev]);
    setNewTheme({ label: "", theme_key: "custom", layout: "spacious" });
  }

  async function updateInline(theme: DashboardTheme, patch: Partial<DashboardTheme>) {
    const next = { ...theme, ...patch };
    await updateTheme(next);
    setThemes((prev) => prev.map((t) => (t.id === theme.id ? next : t)));
  }

  async function remove(id: string) {
    await deleteTheme(id);
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
          {themePresets.map((preset) => {
            const isActive = activeKey === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => activatePreset(preset.id)}
                className={`floating-card flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isActive
                    ? "border-[var(--accent-color)] bg-[var(--accent-soft)]"
                    : "border-[var(--border-muted)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/30"
                }`}
              >
                <div className="flex gap-1.5">
                  {preset.preview.map((hex) => (
                    <div
                      key={hex}
                      className="h-6 w-6 rounded-lg border border-white/10"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{preset.label}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">{preset.description}</p>
                  </div>
                  {isActive && <BadgeCheck className="h-4 w-4 shrink-0 text-[var(--accent-color)]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom themes */}
      {themes.filter((t) => !themePresets.some((p) => p.id === t.theme_key)).length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Custom Themes</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {themes
              .filter((t) => !themePresets.some((p) => p.id === t.theme_key))
              .map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActive(theme)}
                className={`floating-card flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all ${
                  theme.theme_key === activeKey
                    ? "border-[var(--accent-color)] bg-[var(--accent-soft)]"
                    : "border-[var(--border-muted)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{theme.label}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">key: {theme.theme_key}</p>
                  </div>
                  {theme.theme_key === activeKey && <BadgeCheck className="h-4 w-4 shrink-0 text-[var(--accent-color)]" />}
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
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4">
        <p className="text-sm text-[var(--text-muted)]">
          Active theme:
          <span className="ml-1 font-medium text-[var(--text-primary)]">
            {themePresets.find((p) => p.id === activeKey)?.label ?? selected?.label ?? activeKey}
          </span>
        </p>
      </div>
    </DashboardShell>
  );
}
