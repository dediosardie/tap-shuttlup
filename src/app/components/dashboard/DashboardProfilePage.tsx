import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Save, Trash2, UserPlus2, User2 } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import {
  createProfile,
  deleteProfile,
  readProfile,
  uploadProfileAvatar,
  updateProfile,
  type DashboardProfile,
} from "@/lib/dashboard-crud";

export function DashboardProfilePage() {
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<string | null>(null);
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    void readProfile().then(setProfile);
  }, []);

  useEffect(() => {
    return () => {
      if (pendingAvatarPreview) {
        URL.revokeObjectURL(pendingAvatarPreview);
      }
    };
  }, [pendingAvatarPreview]);

  async function handleSave() {
    if (!profile) {
      return;
    }

    setUploadingAvatar(true);
    let nextProfile = profile;

    if (pendingAvatarFile) {
      const nextUrl = await uploadProfileAvatar(pendingAvatarFile);
      if (nextUrl) {
        nextProfile = { ...profile, avatar_url: nextUrl };
        setProfile(nextProfile);
      }
      setPendingAvatarFile(null);
      setPendingAvatarPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }

    await updateProfile(nextProfile);
    setUploadingAvatar(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleCreate() {
    const created = await createProfile({
      username: "new-profile",
      full_name: "New User",
      position: "Title",
      company: "Company",
      bio: "Short profile bio",
      avatar_url: null,
      mobile_no: "",
      email: "",
      social_links: [
        { platform: "linkedin", url: "" },
        { platform: "instagram", url: "" },
        { platform: "website", url: "" },
      ],
    });
    setProfile(created);
  }

  async function handleDelete() {
    await deleteProfile();
    setProfile(null);
  }

  function setField<K extends keyof DashboardProfile>(key: K, value: DashboardProfile[K]) {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function setSocial(platform: string, url: string) {
    setProfile((prev) => {
      if (!prev) {
        return prev;
      }

      const hasPlatform = prev.social_links.some((s) => s.platform === platform);
      const next = hasPlatform
        ? prev.social_links.map((s) => (s.platform === platform ? { ...s, url } : s))
        : [...prev.social_links, { platform, url }];

      return { ...prev, social_links: next };
    });
  }

  async function handleAvatarChange(file: File | null) {
    if (!file || !profile) return;
    if (!file.type.startsWith("image/")) return;

    setSaved(false);
    setPendingAvatarFile(file);
    setPendingAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  if (!profile) {
    return (
      <DashboardShell title="Profile">
        <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-6">
          <p className="mb-3 text-sm text-[var(--text-muted)]">No profile found.</p>
          <button
            type="button"
            onClick={handleCreate}
            className="premium-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
          >
            <UserPlus2 className="h-4 w-4" />
            Create Profile
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Profile">
      <div className="max-w-2xl space-y-6">
        {/* Avatar block */}
        <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-purple)] p-[2px]">
            {pendingAvatarPreview ? (
              <img
                src={pendingAvatarPreview}
                alt={profile.full_name}
                className="h-full w-full rounded-[calc(var(--radius)-2px)] object-cover"
              />
            ) : profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="h-full w-full rounded-[calc(var(--radius)-2px)] object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[calc(var(--radius)-2px)] bg-[var(--bg-secondary)]">
                <User2 className="h-7 w-7 text-[var(--text-primary)]" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">{profile.full_name}</p>
            <p className="text-sm text-[var(--text-muted)]">tap.shuttlup.com/{profile.username}</p>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                void handleAvatarChange(e.target.files?.[0] ?? null);
                e.currentTarget.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="mt-1 text-xs text-[var(--accent-color)] hover:text-[var(--accent-hover)] disabled:opacity-50"
              disabled={uploadingAvatar}
            >
              {pendingAvatarFile ? "Avatar selected (save to upload)" : "Change avatar"}
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { id: "full_name", label: "Full Name", value: profile.full_name, placeholder: "Full name" },
            { id: "position", label: "Position / Title", value: profile.position, placeholder: "Your role" },
            { id: "company", label: "Company", value: profile.company, placeholder: "Company name" },
            { id: "username", label: "Username", value: profile.username, placeholder: "username" },
          ].map(({ id, label, value, placeholder }) => (
            <div key={id} className="space-y-1.5">
              <label htmlFor={id} className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{label}</label>
              <input
                id={id}
                type="text"
                value={value}
                onChange={(e) => setField(id as keyof DashboardProfile, e.target.value as never)}
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
              value={profile.bio}
              onChange={(e) => setField("bio", e.target.value)}
              className="w-full resize-none rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] outline-none transition-colors focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]"
            />
          </div>
        </div>
        {/* Mobile number */}
        <div className="space-y-1.5">
          <label
            htmlFor="mobile_no"
            className="text-xs uppercase tracking-widest text-[var(--text-muted)]"
          >
            Mobile No
          </label>
          <input
            id="mobile_no"
            type="text"
            value={profile.mobile_no ?? ""}
            onChange={(e) => setField("mobile_no" as keyof DashboardProfile, e.target.value as never)}
            placeholder="+63 912 345 6789"
            className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-colors"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-widest text-[var(--text-muted)]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={profile.email ?? ""}
            onChange={(e) => setField("email" as keyof DashboardProfile, e.target.value as never)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-colors"
          />
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
                value={profile.social_links.find((s) => s.platform === id)?.url ?? ""}
                onChange={(e) => setSocial(id, e.target.value)}
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
            disabled={uploadingAvatar}
            className="premium-button flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm"
          >
            {saved ? <BadgeCheck className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {uploadingAvatar ? "Saving..." : saved ? "Saved!" : "Save Profile"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            Delete Profile
          </button>
          {saved && <p className="text-sm text-emerald-400">Profile updated successfully.</p>}
        </div>
      </div>
    </DashboardShell>
  );
}
