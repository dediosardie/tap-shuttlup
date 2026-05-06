import { useState } from "react";
import { BadgeCheck, Save, User2 } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

export function DashboardProfilePage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <DashboardShell title="Profile">
      <div className="max-w-2xl space-y-6">
        {/* Avatar block */}
        <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-purple)] p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-[calc(var(--radius)-2px)] bg-[var(--bg-secondary)]">
              <User2 className="h-7 w-7 text-[var(--text-primary)]" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">Ardie Cruz</p>
            <p className="text-sm text-[var(--text-muted)]">tap.shuttlup.com/ardie</p>
            <button type="button" className="mt-1 text-xs text-[var(--accent-color)] hover:text-[var(--accent-hover)]">
              Change avatar
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { id: "name", label: "Full Name", defaultValue: "Ardie Cruz", placeholder: "Full name" },
            { id: "position", label: "Position / Title", defaultValue: "Fleet Innovation Lead", placeholder: "Your role" },
            { id: "company", label: "Company", defaultValue: "ShuttlUp Tap", placeholder: "Company name" },
            { id: "username", label: "Username", defaultValue: "ardie", placeholder: "username" },
          ].map(({ id, label, defaultValue, placeholder }) => (
            <div key={id} className="space-y-1.5">
              <label htmlFor={id} className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{label}</label>
              <input
                id={id}
                type="text"
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] outline-none transition-colors focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]"
              />
            </div>
          ))}

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="bio" className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Bio</label>
            <textarea
              id="bio"
              rows={3}
              defaultValue="NFC-powered digital identity for mobility operators, drivers, and enterprise teams."
              className="w-full resize-none rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] outline-none transition-colors focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]"
            />
          </div>
        </div>

        {/* Social links */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Social &amp; Links</h2>
          {[
            { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
            { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
            { id: "website", label: "Website", placeholder: "https://..." },
          ].map(({ id, label, placeholder }) => (
            <div key={id} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-[var(--text-muted)]">{label}</span>
              <input
                type="url"
                placeholder={placeholder}
                className="flex-1 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] outline-none transition-colors focus:border-[var(--accent-color)]"
              />
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="premium-button flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm"
          >
            {saved ? <BadgeCheck className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : "Save Profile"}
          </button>
          {saved && <p className="text-sm text-emerald-400">Profile updated successfully.</p>}
        </div>
      </div>
    </DashboardShell>
  );
}
