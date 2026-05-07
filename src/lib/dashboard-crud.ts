import type { ModeType } from "@/lib/types";
import { getViteSupabaseClient } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DashboardProfile = {
  id: string;
  username: string;
  full_name: string;
  position: string;
  company: string;
  bio: string;
  avatar_url?: string | null;
  mobile_no: string;
  email: string;
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

// ─── localStorage state ───────────────────────────────────────────────────────

type DashboardState = {
  profile: DashboardProfile | null;
  cards: DashboardCard[];
  modes: DashboardMode[];
  themes: DashboardTheme[];
  settings: DashboardSettings | null;
  analytics: AnalyticsEvent[];
};

const STORAGE_KEY = "shuttlup.dashboard.crud.v1";

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function initialState(): DashboardState {
  return {
    profile: null,
    cards: [],
    modes: [],
    themes: [],
    settings: null,
    analytics: [],
  };
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadState(): DashboardState {
  if (!canUseStorage()) return initialState();
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

function saveState(state: DashboardState): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthedProfileId(): Promise<{ db: ReturnType<typeof getViteSupabaseClient>; profileId: string | null }> {
  const db = getViteSupabaseClient();
  if (!db) return { db: null, profileId: null };
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { db, profileId: null };
  const { data } = await db.from("profiles").select("id").eq("user_id", user.id).single();
  return { db, profileId: data?.id ?? null };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Profile CRUD ─────────────────────────────────────────────────────────────

export async function readProfile(): Promise<DashboardProfile | null> {
  const db = getViteSupabaseClient();
  if (db) {
    const { data: { user } } = await db.auth.getUser();
    if (user) {
      const { data } = await db
        .from("profiles")
        .select("id, username, full_name, position, company, bio, avatar_url, mobile_no, email, social_links(platform, url)")
        .eq("user_id", user.id)
        .single();
      if (data) {
        return {
          id: data.id as string,
          username: data.username as string,
          full_name: data.full_name as string,
          position: (data.position as string) ?? "",
          company: (data.company as string) ?? "",
          bio: (data.bio as string) ?? "",
          avatar_url: data.avatar_url as string | null,
          mobile_no: (data.mobile_no as string) ?? "",
          email: (data.email as string) ?? "",
          social_links: (data.social_links as { platform: string; url: string }[]) ?? [],
        };
      }
    }
  }
  return loadState().profile;
}

export async function createProfile(profile: Omit<DashboardProfile, "id">): Promise<DashboardProfile> {
  const db = getViteSupabaseClient();
  if (db) {
    const { data: { user } } = await db.auth.getUser();
    if (user) {
      const { data, error } = await db
        .from("profiles")
        .insert({ user_id: user.id, username: profile.username, full_name: profile.full_name, position: profile.position, company: profile.company, bio: profile.bio, avatar_url: profile.avatar_url, mobile_no: profile.mobile_no, email: profile.email })
        .select("id")
        .single();
      if (data && !error) {
        if (profile.social_links.length) {
          await db.from("social_links").insert(profile.social_links.map((l) => ({ profile_id: data.id, platform: l.platform, url: l.url })));
        }
        const created: DashboardProfile = { ...profile, id: data.id as string };
        const state = loadState();
        state.profile = created;
        saveState(state);
        return created;
      }
    }
  }
  const state = loadState();
  const created: DashboardProfile = { ...profile, id: genId() };
  state.profile = created;
  saveState(state);
  return created;
}

export async function updateProfile(profile: DashboardProfile): Promise<DashboardProfile> {
  const db = getViteSupabaseClient();
  if (db) {
    const { data: { user } } = await db.auth.getUser();
    if (user) {
      await db.from("profiles").update({
        username: profile.username,
        full_name: profile.full_name,
        position: profile.position,
        company: profile.company,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        mobile_no: profile.mobile_no,
        email: profile.email,
      }).eq("user_id", user.id);
      await db.from("social_links").delete().eq("profile_id", profile.id);
      if (profile.social_links.length) {
        await db.from("social_links").insert(profile.social_links.map((l) => ({ profile_id: profile.id, platform: l.platform, url: l.url })));
      }
    }
  }
  const state = loadState();
  state.profile = profile;
  saveState(state);
  return profile;
}

export async function deleteProfile(): Promise<void> {
  const db = getViteSupabaseClient();
  if (db) {
    const { data: { user } } = await db.auth.getUser();
    if (user) {
      await db.from("profiles").delete().eq("user_id", user.id);
    }
  }
  const state = loadState();
  state.profile = null;
  saveState(state);
}

// ─── Cards CRUD ───────────────────────────────────────────────────────────────

export async function readCards(): Promise<DashboardCard[]> {
  const { db, profileId } = await getAuthedProfileId();
  if (db && profileId) {
    const { data } = await db.from("nfc_cards").select("*").eq("profile_id", profileId).order("created_at", { ascending: false });
    if (data) {
      return (data as Array<{ id: string; uid: string; shortcode: string; is_active: boolean; tap_count: number; created_at: string; mode_type?: string | null }>).map((c) => ({
        id: c.id,
        uid: c.uid,
        shortcode: c.shortcode,
        status: c.is_active ? "active" : "inactive",
        taps: c.tap_count,
        created: formatDate(c.created_at),
        mode: (c.mode_type as ModeType | null) ?? "fleet",
      }));
    }
  }
  return loadState().cards;
}

export async function createCard(input: Omit<DashboardCard, "id" | "created" | "taps">): Promise<DashboardCard> {
  const { db, profileId } = await getAuthedProfileId();
  if (db && profileId) {
    const { data, error } = await db
      .from("nfc_cards")
      .insert({ profile_id: profileId, uid: input.uid, shortcode: input.shortcode, is_active: input.status === "active", tap_count: 0, mode_type: input.mode })
      .select("*")
      .single();
    if (data && !error) {
      const row = data as { id: string; uid: string; shortcode: string; is_active: boolean; tap_count: number; created_at: string; mode_type?: string | null };
      const card: DashboardCard = {
        id: row.id,
        uid: row.uid,
        shortcode: row.shortcode,
        status: row.is_active ? "active" : "inactive",
        taps: row.tap_count,
        created: formatDate(row.created_at),
        mode: (row.mode_type as ModeType | null) ?? input.mode,
      };
      const state = loadState();
      state.cards = [card, ...state.cards];
      saveState(state);
      return card;
    }
  }
  const state = loadState();
  const card: DashboardCard = {
    id: genId(),
    uid: input.uid,
    shortcode: input.shortcode,
    mode: input.mode,
    status: input.status,
    taps: 0,
    created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
  state.cards = [card, ...state.cards];
  saveState(state);
  return card;
}

export async function updateCard(card: DashboardCard): Promise<void> {
  const db = getViteSupabaseClient();
  if (db) {
    await db.from("nfc_cards").update({ uid: card.uid, shortcode: card.shortcode, is_active: card.status === "active", mode_type: card.mode }).eq("id", card.id);
  }
  const state = loadState();
  state.cards = state.cards.map((c) => (c.id === card.id ? card : c));
  saveState(state);
}

export async function deleteCard(cardId: string): Promise<void> {
  const db = getViteSupabaseClient();
  if (db) {
    await db.from("nfc_cards").delete().eq("id", cardId);
  }
  const state = loadState();
  state.cards = state.cards.filter((c) => c.id !== cardId);
  saveState(state);
}

// ─── Modes CRUD ───────────────────────────────────────────────────────────────

export async function readModes(): Promise<DashboardMode[]> {
  const { db, profileId } = await getAuthedProfileId();
  if (db && profileId) {
    const { data } = await db.from("tap_modes").select("*").eq("profile_id", profileId);
    if (data) {
      return (data as Array<{ id: string; mode_name: string; mode_type: string; is_default: boolean }>).map((m) => ({
        id: m.id,
        mode_name: m.mode_name,
        mode_type: m.mode_type as ModeType,
        is_default: m.is_default,
      }));
    }
  }
  return loadState().modes;
}

export async function createMode(mode: Omit<DashboardMode, "id">): Promise<DashboardMode> {
  const { db, profileId } = await getAuthedProfileId();
  if (db && profileId) {
    if (mode.is_default) {
      await db.from("tap_modes").update({ is_default: false }).eq("profile_id", profileId);
    }
    const { data, error } = await db
      .from("tap_modes")
      .insert({ profile_id: profileId, mode_name: mode.mode_name, mode_type: mode.mode_type, is_default: mode.is_default })
      .select("*")
      .single();
    if (data && !error) {
      const row = data as { id: string; mode_name: string; mode_type: string; is_default: boolean };
      const created: DashboardMode = { id: row.id, mode_name: row.mode_name, mode_type: row.mode_type as ModeType, is_default: row.is_default };
      const state = loadState();
      if (created.is_default) state.modes = state.modes.map((m) => ({ ...m, is_default: false }));
      state.modes = [created, ...state.modes];
      saveState(state);
      return created;
    }
  }
  const state = loadState();
  const created: DashboardMode = { ...mode, id: genId() };
  if (created.is_default) state.modes = state.modes.map((m) => ({ ...m, is_default: false }));
  state.modes = [created, ...state.modes];
  saveState(state);
  return created;
}

export async function updateMode(mode: DashboardMode): Promise<void> {
  const { db, profileId } = await getAuthedProfileId();
  if (db && profileId) {
    if (mode.is_default) {
      await db.from("tap_modes").update({ is_default: false }).eq("profile_id", profileId);
    }
    await db.from("tap_modes").update({ mode_name: mode.mode_name, mode_type: mode.mode_type, is_default: mode.is_default }).eq("id", mode.id);
  }
  const state = loadState();
  if (mode.is_default) state.modes = state.modes.map((m) => ({ ...m, is_default: false }));
  state.modes = state.modes.map((m) => (m.id === mode.id ? mode : m));
  saveState(state);
}

export async function deleteMode(id: string): Promise<void> {
  const db = getViteSupabaseClient();
  if (db) {
    await db.from("tap_modes").delete().eq("id", id);
  }
  const state = loadState();
  state.modes = state.modes.filter((m) => m.id !== id);
  saveState(state);
}

// ─── Themes CRUD ──────────────────────────────────────────────────────────────
// Custom themes stored in localStorage; active theme key synced to profiles.theme

export async function readThemes(): Promise<DashboardTheme[]> {
  const db = getViteSupabaseClient();
  const state = loadState();
  if (db) {
    const { data: { user } } = await db.auth.getUser();
    if (user) {
      const { data } = await db.from("profiles").select("theme").eq("user_id", user.id).single();
      if (data?.theme) {
        state.themes = state.themes.map((t) => ({ ...t, is_active: t.theme_key === (data.theme as string) }));
        saveState(state);
      }
    }
  }
  return state.themes;
}

export async function createTheme(theme: Omit<DashboardTheme, "id">): Promise<DashboardTheme> {
  const state = loadState();
  const created: DashboardTheme = { ...theme, id: genId() };
  if (created.is_active) {
    state.themes = state.themes.map((t) => ({ ...t, is_active: false }));
    await syncActiveTheme(created.theme_key);
  }
  state.themes = [created, ...state.themes];
  saveState(state);
  return created;
}

export async function updateTheme(theme: DashboardTheme): Promise<void> {
  const state = loadState();
  if (theme.is_active) {
    state.themes = state.themes.map((t) => ({ ...t, is_active: false }));
    await syncActiveTheme(theme.theme_key);
  }
  state.themes = state.themes.map((t) => (t.id === theme.id ? theme : t));
  saveState(state);
}

export async function deleteTheme(id: string): Promise<void> {
  const state = loadState();
  state.themes = state.themes.filter((t) => t.id !== id);
  saveState(state);
}

async function syncActiveTheme(themeKey: string): Promise<void> {
  const db = getViteSupabaseClient();
  if (!db) return;
  const { data: { user } } = await db.auth.getUser();
  if (user) {
    await db.from("profiles").update({ theme: themeKey }).eq("user_id", user.id);
  }
}

// ─── Settings CRUD ────────────────────────────────────────────────────────────
// No dedicated DB table — stored in localStorage only

export function readSettings(): DashboardSettings | null {
  return loadState().settings;
}

export function createSettings(settings: Omit<DashboardSettings, "id">): DashboardSettings {
  const state = loadState();
  const next: DashboardSettings = { ...settings, id: genId() };
  state.settings = next;
  saveState(state);
  return next;
}

export function updateSettings(settings: DashboardSettings): DashboardSettings {
  const state = loadState();
  state.settings = settings;
  saveState(state);
  return settings;
}

export function deleteSettings(): void {
  const state = loadState();
  state.settings = null;
  saveState(state);
}

// ─── Analytics CRUD ───────────────────────────────────────────────────────────

export async function readAnalytics(): Promise<AnalyticsEvent[]> {
  const { db, profileId } = await getAuthedProfileId();
  if (db && profileId) {
    const { data: cards } = await db.from("nfc_cards").select("id").eq("profile_id", profileId);
    if (cards && cards.length > 0) {
      const cardIds = (cards as Array<{ id: string }>).map((c) => c.id);
      const { data } = await db.from("tap_analytics").select("*").in("card_id", cardIds).order("created_at", { ascending: false });
      if (data) {
        return (data as Array<{ id: string; referrer: string | null; city: string | null; device: string | null; created_at: string }>).map((a) => ({
          id: a.id,
          source: (a.referrer === "qr" ? "qr" : a.referrer === "tap" ? "nfc" : "direct") as "nfc" | "qr" | "direct",
          city: a.city ?? "",
          device: a.device ?? "",
          referrer: a.referrer ?? "",
          created_at: a.created_at,
        }));
      }
    }
  }
  return loadState().analytics;
}

export async function createAnalyticsEvent(event: Omit<AnalyticsEvent, "id" | "created_at">): Promise<AnalyticsEvent> {
  const { db, profileId } = await getAuthedProfileId();
  if (db && profileId) {
    const { data: cards } = await db.from("nfc_cards").select("id").eq("profile_id", profileId).limit(1);
    if (cards && cards.length > 0) {
      const cardId = (cards as Array<{ id: string }>)[0].id;
      const { data, error } = await db
        .from("tap_analytics")
        .insert({ card_id: cardId, device: event.device, city: event.city, referrer: event.source === "nfc" ? "tap" : event.source })
        .select("*")
        .single();
      if (data && !error) {
        const row = data as { id: string; referrer: string | null; city: string | null; device: string | null; created_at: string };
        const created: AnalyticsEvent = {
          id: row.id,
          source: event.source,
          city: row.city ?? "",
          device: row.device ?? "",
          referrer: row.referrer ?? "",
          created_at: row.created_at,
        };
        const state = loadState();
        state.analytics = [created, ...state.analytics];
        saveState(state);
        return created;
      }
    }
  }
  const state = loadState();
  const created: AnalyticsEvent = { ...event, id: genId(), created_at: new Date().toISOString() };
  state.analytics = [created, ...state.analytics];
  saveState(state);
  return created;
}

export async function updateAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  const db = getViteSupabaseClient();
  if (db) {
    await db.from("tap_analytics").update({ device: event.device, city: event.city, referrer: event.referrer }).eq("id", event.id);
  }
  const state = loadState();
  state.analytics = state.analytics.map((a) => (a.id === event.id ? event : a));
  saveState(state);
}

export async function deleteAnalyticsEvent(id: string): Promise<void> {
  const db = getViteSupabaseClient();
  if (db) {
    await db.from("tap_analytics").delete().eq("id", id);
  }
  const state = loadState();
  state.analytics = state.analytics.filter((a) => a.id !== id);
  saveState(state);
}