import { useEffect, useState } from "react";
import { BadgeCheck, Copy, CreditCard, Download, Pencil, Plus, QrCode, Trash2, Wifi, XCircle } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import { createCard, deleteCard, readCards, updateCard, type DashboardCard } from "@/lib/dashboard-crud";
import type { ModeType } from "@/lib/types";

export function DashboardCardsPage() {
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qrCardId, setQrCardId] = useState<string | null>(null);
  const [form, setForm] = useState({ uid: "", shortcode: "", mode: "fleet" as ModeType });

  useEffect(() => {
    void readCards().then(setCards);
  }, []);

  function persist(next: DashboardCard[]) {
    setCards(next);
  }

  async function toggleStatus(card: DashboardCard) {
    const next: DashboardCard = { ...card, status: card.status === "active" ? "inactive" : "active" };
    await updateCard(next);
    persist(cards.map((c) => (c.id === card.id ? next : c)));
  }

  function copyUrl(shortcode: string, uid: string) {
    navigator.clipboard.writeText(`https://tap.shuttlup.com/t/${shortcode}`);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  }

  async function handleCreate() {
    if (!form.uid || !form.shortcode) {
      return;
    }
    const created = await createCard({
      uid: form.uid,
      shortcode: form.shortcode,
      mode: form.mode,
      status: "active",
    });
    persist([created, ...cards]);
    setForm({ uid: "", shortcode: "", mode: "fleet" });
  }

  async function handleDelete(id: string) {
    await deleteCard(id);
    persist(cards.filter((c) => c.id !== id));
  }

  async function handleInlineUpdate(card: DashboardCard, patch: Partial<DashboardCard>) {
    const next = { ...card, ...patch };
    await updateCard(next);
    persist(cards.map((c) => (c.id === card.id ? next : c)));
  }

  return (
    <DashboardShell title="NFC Cards">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-muted)]">{cards.length} cards registered</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCreate}
            className="premium-button flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
          >
            <Plus className="h-4 w-4" /> Create NFC Card
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4 sm:grid-cols-4">
        <input
          value={form.uid}
          onChange={(e) => setForm((p) => ({ ...p, uid: e.target.value }))}
          placeholder="Card UID"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <input
          value={form.shortcode}
          onChange={(e) => setForm((p) => ({ ...p, shortcode: e.target.value }))}
          placeholder="Shortcode"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <select
          value={form.mode}
          onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value as ModeType }))}
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        >
          <option value="personal">Personal</option>
          <option value="corporate">Corporate</option>
          <option value="driver">Driver</option>
          <option value="fleet">Fleet</option>
          <option value="investor">Investor</option>
        </select>
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-xl bg-[var(--accent-color)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          Add Card
        </button>
      </div>

      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className="floating-card flex flex-col gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5 sm:flex-row sm:items-center"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              card.status === "active" ? "bg-[var(--accent-soft)]" : "bg-[var(--bg-elevated)]"
            }`}>
              <CreditCard className={`h-5 w-5 ${card.status === "active" ? "text-[var(--accent-color)]" : "text-[var(--text-disabled)]"}`} />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[var(--text-primary)]">{card.uid}</p>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  card.status === "active"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-[var(--bg-elevated)] text-[var(--text-disabled)]"
                }`}>
                  {card.status === "active" ? <Wifi className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {card.status}
                </span>
                <span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-[10px] text-[var(--text-muted)]">
                  {card.mode}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Shortcode: <span className="font-mono text-[var(--text-secondary)]">t/{card.shortcode}</span>
                &nbsp;·&nbsp;{card.taps.toLocaleString()} taps
                &nbsp;·&nbsp;Created {card.created}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => copyUrl(card.shortcode, card.uid)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors hover:text-[var(--accent-color)]"
                title="Copy tap URL"
              >
                {copiedUid === card.uid ? <BadgeCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => { setQrCardId((v) => (v === card.id ? null : card.id)); setEditingId(null); }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--accent-color)]"
                title="Generate QR"
              >
                <QrCode className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => { setEditingId((v) => (v === card.id ? null : card.id)); setQrCardId(null); }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                title="Edit card"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleStatus(card)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  card.status === "active"
                    ? "border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-400"
                    : "bg-[var(--accent-soft)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white"
                }`}
              >
                {card.status === "active" ? "Deactivate" : "Activate"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(card.id)}
                className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-muted)] hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {editingId === card.id ? (
              <div className="grid w-full gap-2 sm:grid-cols-3">
                <input
                  value={card.uid}
                  onChange={(e) => handleInlineUpdate(card, { uid: e.target.value })}
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
                />
                <input
                  value={card.shortcode}
                  onChange={(e) => handleInlineUpdate(card, { shortcode: e.target.value })}
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
                />
                <select
                  value={card.mode}
                  onChange={(e) => handleInlineUpdate(card, { mode: e.target.value as ModeType })}
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
                >
                  <option value="personal">Personal</option>
                  <option value="corporate">Corporate</option>
                  <option value="driver">Driver</option>
                  <option value="fleet">Fleet</option>
                  <option value="investor">Investor</option>
                </select>
              </div>
            ) : null}

            {qrCardId === card.id ? (() => {
              const tapUrl = `https://tap.shuttlup.com/qr/${card.shortcode}`;
              const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=F97316&bgcolor=121212&data=${encodeURIComponent(tapUrl)}`;
              return (
                <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-5 sm:flex-row">
                  <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-2">
                    <img src={qrSrc} alt={`QR for ${card.shortcode}`} width={120} height={120} className="rounded-lg" />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{card.uid}</p>
                    <p className="font-mono text-xs text-[var(--text-muted)]">{tapUrl}</p>
                    <a
                      href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&color=F97316&bgcolor=121212&data=${encodeURIComponent(tapUrl)}`}
                      download={`qr-${card.shortcode}.png`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-color)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--accent-hover)]"
                    >
                      <Download className="h-3.5 w-3.5" /> Download QR
                    </a>
                  </div>
                </div>
              );
            })() : null}
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-[var(--text-disabled)]">
        NFC tags store only <span className="font-mono">tap.shuttlup.com/t/[shortcode]</span>.
        The platform handles all redirects and analytics.
      </p>
    </DashboardShell>
  );
}
