export type ThemeKey = "obsidian" | "midnight" | "graphite" | "forest" | "violet" | "carbon";

type ThemeTokens = {
  bgPrimary: string;
  bgSecondary: string;
  bgElevated: string;
  borderMuted: string;
  accentColor: string;
  accentHover: string;
  accentSoft: string;
  accentPurple: string;
};

export const THEME_TOKENS: Record<ThemeKey, ThemeTokens> = {
  obsidian: {
    bgPrimary: "#0B0B0B",
    bgSecondary: "#121212",
    bgElevated: "#1A1A1A",
    borderMuted: "#2A2A2A",
    accentColor: "#F97316",
    accentHover: "#FB923C",
    accentSoft: "rgba(249,115,22,0.12)",
    accentPurple: "#EA580C",
  },
  midnight: {
    bgPrimary: "#060D1A",
    bgSecondary: "#091527",
    bgElevated: "#0D1E3A",
    borderMuted: "#1A3050",
    accentColor: "#2563EB",
    accentHover: "#3B82F6",
    accentSoft: "rgba(37,99,235,0.12)",
    accentPurple: "#1D4ED8",
  },
  graphite: {
    bgPrimary: "#111111",
    bgSecondary: "#191919",
    bgElevated: "#222222",
    borderMuted: "#303030",
    accentColor: "#9CA3AF",
    accentHover: "#D1D5DB",
    accentSoft: "rgba(156,163,175,0.12)",
    accentPurple: "#6B7280",
  },
  forest: {
    bgPrimary: "#081210",
    bgSecondary: "#0C1C18",
    bgElevated: "#0F2320",
    borderMuted: "#1A3830",
    accentColor: "#10B981",
    accentHover: "#34D399",
    accentSoft: "rgba(16,185,129,0.12)",
    accentPurple: "#059669",
  },
  violet: {
    bgPrimary: "#0D0816",
    bgSecondary: "#130E24",
    bgElevated: "#1C1230",
    borderMuted: "#2A1C48",
    accentColor: "#7C3AED",
    accentHover: "#8B5CF6",
    accentSoft: "rgba(124,58,237,0.12)",
    accentPurple: "#6D28D9",
  },
  carbon: {
    bgPrimary: "#090909",
    bgSecondary: "#101010",
    bgElevated: "#161616",
    borderMuted: "#242424",
    accentColor: "#F59E0B",
    accentHover: "#FBBF24",
    accentSoft: "rgba(245,158,11,0.12)",
    accentPurple: "#D97706",
  },
};

/** Convert a 6-digit hex colour to an rgba() string. */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Instantly apply a theme by writing CSS custom properties to :root. */
export function applyTheme(themeKey: string): void {
  if (typeof document === "undefined") return;
  const tokens = THEME_TOKENS[themeKey as ThemeKey] ?? THEME_TOKENS.obsidian;
  const root = document.documentElement;
  root.style.setProperty("--bg-primary", tokens.bgPrimary);
  root.style.setProperty("--bg-secondary", tokens.bgSecondary);
  root.style.setProperty("--bg-elevated", tokens.bgElevated);
  root.style.setProperty("--border-muted", tokens.borderMuted);
  root.style.setProperty("--accent-color", tokens.accentColor);
  root.style.setProperty("--accent-hover", tokens.accentHover);
  root.style.setProperty("--accent-soft", tokens.accentSoft);
  root.style.setProperty("--accent-purple", tokens.accentPurple);
  // Gradient + glow used by .premium-button
  root.style.setProperty("--gradient-brand", `linear-gradient(130deg, ${tokens.accentColor} 0%, ${tokens.accentHover} 100%)`);
  root.style.setProperty("--glow-orange", hexToRgba(tokens.accentColor, 0.35));
  root.style.setProperty("--glow-blue", hexToRgba(tokens.accentColor, 0.3));
  root.style.setProperty("--glow-purple", hexToRgba(tokens.accentHover, 0.3));
  // Keep shadcn/tailwind tokens in sync
  root.style.setProperty("--primary", tokens.accentColor);
  root.style.setProperty("--ring", tokens.accentColor);
  root.style.setProperty("--background", tokens.bgPrimary);
  root.style.setProperty("--card", tokens.bgSecondary);
  root.style.setProperty("--popover", tokens.bgElevated);
  root.style.setProperty("--border", tokens.borderMuted);
  root.style.setProperty("--scrollbar-track", tokens.bgPrimary);
  root.style.setProperty("--scrollbar-thumb", tokens.borderMuted);
  // Persist selection so it survives page reloads before the DB fetch resolves
  try { localStorage.setItem("shuttlup.active_theme", themeKey); } catch { /* ignore */ }
}

/** Apply the saved theme key from localStorage immediately (call before React mounts). */
export function applyPersistedTheme(): void {
  try {
    const saved = localStorage.getItem("shuttlup.active_theme");
    if (saved) applyTheme(saved);
  } catch { /* ignore */ }
}
