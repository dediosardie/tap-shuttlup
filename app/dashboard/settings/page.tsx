"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "../../../components/dashboard/dashboard-shell";
import { BadgeCheck, Eye, Globe, Lock, Plus, Search, Shield, Trash2 } from "lucide-react";
import {
  createSettings,
  deleteSettings,
  readSettings,
  updateSettings,
  type DashboardSettings,
} from "@/lib/dashboard-crud";

function ToggleRow({
  label,
  description,
  on,
  onToggle,
}: {
  label: string;
  description: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] px-5 py-4">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
          on ? "bg-[var(--accent-color)]" : "bg-[var(--bg-elevated)]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function DashboardSettingsPage() {
  const [settings, setSettings] = useState<DashboardSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void readSettings().then(setSettings);
  }, []);

  function patchSettings(patch: Partial<DashboardSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function handleSave() {
    if (!settings) {
      return;
    }
    await updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleCreate() {
    const created = await createSettings({
      public_profile: true,
      show_analytics_badges: true,
      hide_fleet_info: false,
      allow_search_indexing: true,
      opengraph_preview: true,
      rate_limit_taps: true,
      anti_scraping: true,
      custom_domain: "",
      profile_mode: "personal",
    });
    setSettings(created);
  }

  async function handleDelete() {
    await deleteSettings();
    setSettings(null);
  }

  if (!settings) {
    return (
      <DashboardShell title="Settings">
        <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-6">
          <p className="mb-3 text-sm text-[var(--text-muted)]">No settings record found.</p>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            <Plus className="h-4 w-4" />
            Create Settings
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Settings">
      <div className="max-w-2xl space-y-6">

        {/* Privacy & Visibility */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Privacy &amp; Visibility</h2>
          </div>
          <div className="space-y-2">
            <ToggleRow
              label="Public Profile"
              description="Allow anyone to view your profile via NFC, QR, or direct link."
              on={settings.public_profile}
              onToggle={() => patchSettings({ public_profile: !settings.public_profile })}
            />
            <ToggleRow
              label="Show Analytics Badges"
              description="Display tap count, views, and saves on your public card."
              on={settings.show_analytics_badges}
              onToggle={() => patchSettings({ show_analytics_badges: !settings.show_analytics_badges })}
            />
            <ToggleRow
              label="Hide Fleet Info"
              description="Conceal vehicle and operator details from public view."
              on={settings.hide_fleet_info}
              onToggle={() => patchSettings({ hide_fleet_info: !settings.hide_fleet_info })}
            />
          </div>
        </div>

        {/* SEO */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">SEO &amp; Discovery</h2>
          </div>
          <div className="space-y-2">
            <ToggleRow
              label="Allow Search Indexing"
              description="Let search engines index your public profile page."
              on={settings.allow_search_indexing}
              onToggle={() => patchSettings({ allow_search_indexing: !settings.allow_search_indexing })}
            />
            <ToggleRow
              label="OpenGraph Preview"
              description="Generate a rich link preview when your profile is shared."
              on={settings.opengraph_preview}
              onToggle={() => patchSettings({ opengraph_preview: !settings.opengraph_preview })}
            />
          </div>
        </div>

        {/* Security */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Security</h2>
          </div>
          <div className="space-y-2">
            <ToggleRow
              label="Rate Limit NFC Taps"
              description="Prevent spam from a single IP tapping your card repeatedly."
              on={settings.rate_limit_taps}
              onToggle={() => patchSettings({ rate_limit_taps: !settings.rate_limit_taps })}
            />
            <ToggleRow
              label="Anti-Scraping Protection"
              description="Block automated profile scrapers and bots."
              on={settings.anti_scraping}
              onToggle={() => patchSettings({ anti_scraping: !settings.anti_scraping })}
            />
          </div>
        </div>

        {/* Custom domain */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Custom Domain</h2>
          </div>
          <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4">
            <label htmlFor="domain" className="text-xs text-[var(--text-muted)]">Custom tap domain</label>
            <input
              id="domain"
              type="text"
              value={settings.custom_domain}
              onChange={(e) => patchSettings({ custom_domain: e.target.value })}
              placeholder="tap.yourdomain.com"
              className="mt-2 w-full rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] outline-none focus:border-[var(--accent-color)] transition-colors"
            />
            <p className="mt-2 text-xs text-[var(--text-disabled)]">
              Point a CNAME record to <span className="font-mono text-[var(--text-muted)]">tap.shuttlup.com</span>. Available on Pro plan.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="premium-button flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm"
        >
          {saved ? <BadgeCheck className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
          Delete Settings
        </button>
      </div>
    </DashboardShell>
  );
}

