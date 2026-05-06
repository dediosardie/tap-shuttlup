import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

const themes = [
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
  const [selectedTheme, setSelectedTheme] = useState("obsidian");
  const [selectedLayout, setSelectedLayout] = useState("spacious");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <DashboardShell title="Themes">
      <div className="mb-6">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Color Theme</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {themes.map(({ id, label, description, preview }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedTheme(id)}
              className={`floating-card flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all ${
                selectedTheme === id
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
                  <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
                </div>
                {selectedTheme === id && <BadgeCheck className="h-4 w-4 shrink-0 text-[var(--accent-color)]" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Layout Preset</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {layouts.map(({ id, label, description }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedLayout(id)}
              className={`floating-card rounded-2xl border p-4 text-left transition-all ${
                selectedLayout === id
                  ? "border-[var(--accent-color)] bg-[var(--accent-soft)]"
                  : "border-[var(--border-muted)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
                {selectedLayout === id && <BadgeCheck className="h-4 w-4 text-[var(--accent-color)]" />}
              </div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="premium-button flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm"
      >
        {saved && <BadgeCheck className="h-4 w-4" />}
        {saved ? "Saved!" : "Apply Theme"}
      </button>
    </DashboardShell>
  );
}
