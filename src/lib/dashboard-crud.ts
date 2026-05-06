import type { ModeType } from "@/lib/types";
import { demoProfiles } from "@/lib/mock-data";

export type DashboardProfile = {
  id: string;
  username: string;
  full_name: string;
  position: string;
  company: string;
  bio: string;
  avatar_url?: string | null;
  social_links: { platform: string; url: string }[];
};

export type DashboardCard = {
  id: string;
  uid: string;
  shortcode: string;
  status: "active" | "inactive";
  taps: number;
  created: string;
  mode: ModeType;
};

export type DashboardMode = {
  id: string;
  mode_name: string;
  mode_type: ModeType;
  is_default: boolean;
};

export type DashboardTheme = {
  id: string;
  label: string;
  theme_key: string;
  layout: "compact" | "spacious" | "minimal";
  is_active: boolean;
};

export type DashboardSettings = {
  id: string;
  public_profile: boolean;
  show_analytics_badges: boolean;
  hide_fleet_info: boolean;
  allow_search_indexing: boolean;
  opengraph_preview: boolean;
  rate_limit_taps: boolean;
  anti_scraping: boolean;
  custom_domain: string;
};

export type AnalyticsEvent = {
  id: string;
  source: "nfc" | "qr" | "direct";
  city: string;
  device: string;
  referrer: string;
  created_at: string;
};

type DashboardState = {
  profile: DashboardProfile | null;
  cards: DashboardCard[];
  modes: DashboardMode[];
  themes: DashboardTheme[];
  settings: DashboardSettings | null;
  analytics: AnalyticsEvent[];
};

const STORAGE_KEY = "shuttlup.dashboard.crud.v1";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function initialState(): DashboardState {
  const base = demoProfiles[0];

  return {
    profile: {
      id: base.id,
      username: base.username,
      full_name: base.full_name,
      position: base.position,
      company: base.company,
      bio: base.bio,
      avatar_url: base.avatar_url,
      social_links: base.social_links,
    },
    cards: [
      { id: uid(), uid: "TAP-XX-001", shortcode: "tap001", status: "active", taps: 1925, created: "May 1, 2026", mode: "fleet" },
      { id: uid(), uid: "TAP-XX-002", shortcode: "tap002", status: "inactive", taps: 441, created: "Apr 18, 2026", mode: "personal" },
    ],
    modes: [
      { id: uid(), mode_name: "Fleet", mode_type: "fleet", is_default: true },
      { id: uid(), mode_name: "Corporate", mode_type: "corporate", is_default: false },
      { id: uid(), mode_name: "Driver", mode_type: "driver", is_default: false },
    ],
    themes: [
      { id: uid(), label: "Obsidian Orange", theme_key: "obsidian", layout: "spacious", is_active: true },
      { id: uid(), label: "Midnight Blue", theme_key: "midnight", layout: "compact", is_active: false },
    ],
    settings: {
      id: uid(),
      public_profile: true,
      show_analytics_badges: true,
      hide_fleet_info: false,
      allow_search_indexing: true,
      opengraph_preview: true,
      rate_limit_taps: true,
      anti_scraping: true,
      custom_domain: "",
    },
    analytics: [
      { id: uid(), source: "nfc", city: "Manila", device: "Mobile iOS", referrer: "tap", created_at: new Date().toISOString() },
      { id: uid(), source: "qr", city: "Quezon City", device: "Android", referrer: "qr", created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
      { id: uid(), source: "direct", city: "Makati", device: "Chrome", referrer: "direct", created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
    ],
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadDashboardState(): DashboardState {
  if (!canUseStorage()) {
    return initialState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = initialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return JSON.parse(raw) as DashboardState;
  } catch {
    const seed = initialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

export function saveDashboardState(state: DashboardState) {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createProfile(profile: Omit<DashboardProfile, "id">) {
  const state = loadDashboardState();
  state.profile = { ...profile, id: uid() };
  saveDashboardState(state);
  return state.profile;
}

export function readProfile() {
  return loadDashboardState().profile;
}

export function updateProfile(profile: DashboardProfile) {
  const state = loadDashboardState();
  state.profile = profile;
  saveDashboardState(state);
  return profile;
}

export function deleteProfile() {
  const state = loadDashboardState();
  state.profile = null;
  saveDashboardState(state);
}

export function readCards() {
  return loadDashboardState().cards;
}

export function createCard(input: Omit<DashboardCard, "id" | "created" | "taps">) {
  const state = loadDashboardState();
  const card: DashboardCard = {
    id: uid(),
    uid: input.uid,
    shortcode: input.shortcode,
    mode: input.mode,
    status: input.status,
    taps: 0,
    created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
  state.cards = [card, ...state.cards];
  saveDashboardState(state);
  return card;
}

export function updateCard(card: DashboardCard) {
  const state = loadDashboardState();
  state.cards = state.cards.map((c) => (c.id === card.id ? card : c));
  saveDashboardState(state);
}

export function deleteCard(cardId: string) {
  const state = loadDashboardState();
  state.cards = state.cards.filter((c) => c.id !== cardId);
  saveDashboardState(state);
}

export function readModes() {
  return loadDashboardState().modes;
}

export function createMode(mode: Omit<DashboardMode, "id">) {
  const state = loadDashboardState();
  const next = { ...mode, id: uid() };
  if (next.is_default) {
    state.modes = state.modes.map((m) => ({ ...m, is_default: false }));
  }
  state.modes = [next, ...state.modes];
  saveDashboardState(state);
  return next;
}

export function updateMode(mode: DashboardMode) {
  const state = loadDashboardState();
  if (mode.is_default) {
    state.modes = state.modes.map((m) => ({ ...m, is_default: false }));
  }
  state.modes = state.modes.map((m) => (m.id === mode.id ? mode : m));
  saveDashboardState(state);
}

export function deleteMode(id: string) {
  const state = loadDashboardState();
  state.modes = state.modes.filter((m) => m.id !== id);
  saveDashboardState(state);
}

export function readThemes() {
  return loadDashboardState().themes;
}

export function createTheme(theme: Omit<DashboardTheme, "id">) {
  const state = loadDashboardState();
  const next = { ...theme, id: uid() };
  if (next.is_active) {
    state.themes = state.themes.map((t) => ({ ...t, is_active: false }));
  }
  state.themes = [next, ...state.themes];
  saveDashboardState(state);
  return next;
}

export function updateTheme(theme: DashboardTheme) {
  const state = loadDashboardState();
  if (theme.is_active) {
    state.themes = state.themes.map((t) => ({ ...t, is_active: false }));
  }
  state.themes = state.themes.map((t) => (t.id === theme.id ? theme : t));
  saveDashboardState(state);
}

export function deleteTheme(id: string) {
  const state = loadDashboardState();
  state.themes = state.themes.filter((t) => t.id !== id);
  saveDashboardState(state);
}

export function readSettings() {
  return loadDashboardState().settings;
}

export function createSettings(settings: Omit<DashboardSettings, "id">) {
  const state = loadDashboardState();
  const next = { ...settings, id: uid() };
  state.settings = next;
  saveDashboardState(state);
  return next;
}

export function updateSettings(settings: DashboardSettings) {
  const state = loadDashboardState();
  state.settings = settings;
  saveDashboardState(state);
  return settings;
}

export function deleteSettings() {
  const state = loadDashboardState();
  state.settings = null;
  saveDashboardState(state);
}

export function readAnalytics() {
  return loadDashboardState().analytics;
}

export function createAnalyticsEvent(event: Omit<AnalyticsEvent, "id" | "created_at">) {
  const state = loadDashboardState();
  const next: AnalyticsEvent = { ...event, id: uid(), created_at: new Date().toISOString() };
  state.analytics = [next, ...state.analytics];
  saveDashboardState(state);
  return next;
}

export function updateAnalyticsEvent(event: AnalyticsEvent) {
  const state = loadDashboardState();
  state.analytics = state.analytics.map((e) => (e.id === event.id ? event : e));
  saveDashboardState(state);
}

export function deleteAnalyticsEvent(id: string) {
  const state = loadDashboardState();
  state.analytics = state.analytics.filter((e) => e.id !== id);
  saveDashboardState(state);
}