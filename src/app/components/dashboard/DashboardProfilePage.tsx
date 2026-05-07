import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Eye, EyeOff, ExternalLink, Link2, Pencil, Plus, QrCode, Save, ShieldCheck, Trash2, UserPlus2, User2, Wifi } from "lucide-react";
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
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
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
        { platform: "facebook", url: "" },
        { platform: "instagram", url: "" },
        { platform: "website", url: "" },
      ],
      projects: [],
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

  function addProject() {
    setProfile((prev) => {
      if (!prev) return prev;
      const id = `project-${Date.now()}`;
      const next = {
        id,
        name: "",
        role: "",
        description: "",
        logo_url: "",
        active: true,
        verified: false,
        visibility: "public" as const,
        website: "",
        social_links: [],
      };
      setEditingProjectId(id);
      return { ...prev, projects: [...(prev.projects ?? []), next] };
    });
  }

  function removeProject(projectId: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, projects: (prev.projects ?? []).filter((project) => project.id !== projectId) };
    });
    setEditingProjectId((prev) => (prev === projectId ? null : prev));
  }

  function updateProject(projectId: string, patch: Record<string, unknown>) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        projects: (prev.projects ?? []).map((project) => (
          project.id === projectId ? { ...project, ...patch } : project
        )),
      };
    });
  }

  function setProjectSocialLink(projectId: string, index: number, field: "platform" | "url", value: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        projects: (prev.projects ?? []).map((project) => {
          if (project.id !== projectId) return project;
          const links = [...(project.social_links ?? [])];
          while (links.length <= index) links.push({ platform: "", url: "" });
          links[index] = { ...links[index], [field]: value };
          return { ...project, social_links: links.filter((link) => link.platform || link.url) };
        }),
      };
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
            { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
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

        {/* Projects & Involvement */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Projects &amp; Involvement</h2>
            <button
              type="button"
              onClick={addProject}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] hover:border-[var(--accent-color)]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Project
            </button>
          </div>

          {(profile.projects ?? []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-5 text-sm text-[var(--text-muted)]">
              Add organizations, startups, communities, or businesses you are involved in.
            </div>
          ) : (
            <div className="overflow-x-auto pb-1">
              <div className="flex snap-x snap-mandatory gap-3">
                {(profile.projects ?? []).map((project) => {
                  const editing = editingProjectId === project.id;
                  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://tap.shuttlup.com";
                  const sharePath = `/${profile.username}?project=${project.id}`;
                  return (
                    <div
                      key={project.id}
                      className="glass-card gradient-border min-w-[290px] snap-start space-y-3 rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)]">
                          {project.logo_url ? (
                            <img src={project.logo_url} alt={project.name || "Project logo"} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
                              <Link2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{project.name || "Untitled Project"}</p>
                          <p className="truncate text-xs text-[var(--text-muted)]">{project.role || "Role / Title"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProjectId((prev) => (prev === project.id ? null : project.id))}
                          className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                          aria-label="Edit project"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {editing ? (
                        <div className="space-y-2.5">
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => updateProject(project.id, { name: e.target.value })}
                            placeholder="Project or Organization"
                            className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                          />
                          <input
                            type="text"
                            value={project.role}
                            onChange={(e) => updateProject(project.id, { role: e.target.value })}
                            placeholder="Role / Title"
                            className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                          />
                          <textarea
                            rows={2}
                            value={project.description}
                            onChange={(e) => updateProject(project.id, { description: e.target.value })}
                            placeholder="Short description"
                            className="w-full resize-none rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                          />
                          <input
                            type="url"
                            value={project.logo_url ?? ""}
                            onChange={(e) => updateProject(project.id, { logo_url: e.target.value })}
                            placeholder="Logo URL"
                            className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                          />
                          <input
                            type="url"
                            value={project.website ?? ""}
                            onChange={(e) => updateProject(project.id, { website: e.target.value })}
                            placeholder="Website URL"
                            className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={project.social_links?.[0]?.platform ?? ""}
                              onChange={(e) => setProjectSocialLink(project.id, 0, "platform", e.target.value)}
                              placeholder="Social platform"
                              className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                            />
                            <input
                              type="url"
                              value={project.social_links?.[0]?.url ?? ""}
                              onChange={(e) => setProjectSocialLink(project.id, 0, "url", e.target.value)}
                              placeholder="Social URL"
                              className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                            />
                            <input
                              type="text"
                              value={project.social_links?.[1]?.platform ?? ""}
                              onChange={(e) => setProjectSocialLink(project.id, 1, "platform", e.target.value)}
                              placeholder="Social platform"
                              className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                            />
                            <input
                              type="url"
                              value={project.social_links?.[1]?.url ?? ""}
                              onChange={(e) => setProjectSocialLink(project.id, 1, "url", e.target.value)}
                              placeholder="Social URL"
                              className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-1.5 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-1.5 text-[11px] text-[var(--text-muted)]">
                              <input
                                type="checkbox"
                                checked={project.active}
                                onChange={(e) => updateProject(project.id, { active: e.target.checked })}
                              />
                              Active
                            </label>
                            <label className="flex items-center gap-1.5 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2 py-1.5 text-[11px] text-[var(--text-muted)]">
                              <input
                                type="checkbox"
                                checked={Boolean(project.verified)}
                                onChange={(e) => updateProject(project.id, { verified: e.target.checked })}
                              />
                              Verified
                            </label>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Manage Visibility</p>
                            <select
                              value={project.visibility}
                              onChange={(e) => updateProject(project.id, { visibility: e.target.value })}
                              className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)]"
                            >
                              <option value="public">Public</option>
                              <option value="nfc">NFC/QR Only</option>
                              <option value="private">Private</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProject(project.id)}
                            className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300 hover:text-red-200"
                          >
                            Remove Project
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="line-clamp-2 text-xs text-[var(--text-muted)]">{project.description || "No description yet."}</p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] text-[var(--accent-color)]">
                              {project.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                              {project.active ? "Active" : "Inactive"}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                              {project.visibility === "private" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              {project.visibility}
                            </span>
                            {project.verified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                                <ShieldCheck className="h-3 w-3" /> Verified
                              </span>
                            )}
                          </div>
                          <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-2 text-[11px] text-[var(--text-muted)]">
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3" /> NFC</span>
                              <a href={`${baseUrl}${sharePath}&src=tap&via=nfc`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[var(--accent-color)] hover:text-[var(--accent-hover)]">
                                Share <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1"><QrCode className="h-3 w-3" /> QR</span>
                              <a href={`${baseUrl}${sharePath}&src=qr&via=qr`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[var(--accent-color)] hover:text-[var(--accent-hover)]">
                                Share <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
