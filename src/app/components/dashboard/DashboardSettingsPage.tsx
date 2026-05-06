import { useState } from "react";
import { BadgeCheck, Eye, Globe, Lock, Search, Shield } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

function ToggleRow({
  label,
  description,
  defaultOn = false,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
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
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
          on ? "bg-[var(--accent-color)]" : "bg-[var(--bg-elevated)]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function DashboardSettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <DashboardShell title="Settings">
      <div className="max-w-2xl space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Privacy &amp; Visibility</h2>
          </div>
          <div className="space-y-2">
            <ToggleRow label="Public Profile" description="Allow anyone to view your profile via NFC, QR, or direct link." defaultOn />
            <ToggleRow label="Show Analytics Badges" description="Display tap count, views, and saves on your public card." defaultOn />
            <ToggleRow label="Hide Fleet Info" description="Conceal vehicle and operator details from public view." />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">SEO &amp; Discovery</h2>
          </div>
          <div className="space-y-2">
            <ToggleRow label="Allow Search Indexing" description="Let search engines index your public profile page." defaultOn />
            <ToggleRow label="OpenGraph Preview" description="Generate a rich link preview when your profile is shared." defaultOn />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Security</h2>
          </div>
          <div className="space-y-2">
            <ToggleRow label="Rate Limit NFC Taps" description="Prevent spam from a single IP tapping your card repeatedly." defaultOn />
            <ToggleRow label="Anti-Scraping Protection" description="Block automated profile scrapers and bots." defaultOn />
          </div>
        </div>

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
              placeholder="tap.yourdomain.com"
              className="mt-2 w-full rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] outline-none transition-colors focus:border-[var(--accent-color)]"
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
      </div>
    </DashboardShell>
  );
}
